/**
 * @module ui/gameScreen
 * Game screen: connects the game state with the counters, the board and the victory modal.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { DELAYS, SELECT_RESULT } from '../constants/gameConst.js';
import { STRINGS } from '../constants/strings.js';
import { PAIRS_COUNT } from '../game/cards.js';
import { closeMismatch, createGame, getFoundPairs, isWon, selectCard } from '../game/game.js';
import { saveResult } from '../game/storage.js';
import { cancelDealAnimation, dealCards, flipCardsFaceDown, prefersReducedMotion } from './dealAnimation.js';
import { el } from './dom.js';
import { closeActiveModal, openVictoryModal } from './modal.js';


/**
 * Game screen component: its root element and a function that starts a new game.
 *
 * @typedef {Object} GameScreen
 * @property {HTMLElement} element Root element to insert into the page.
 * @property {() => Promise<void>} restart Starts a new game: reshuffles the cards, resets the counters
 *   and plays the dealing animation. The promise resolves when the animation is over.
 */


/**
 * Creates the game screen and starts a new game.
 *
 * @returns {GameScreen} The game screen component.
 */
export function createGameScreen() {
  let state = createGame();
  const counters = createCounters(PAIRS_COUNT);
  let board = createBoard(state.cards, handleCardClick);

  /** Id of the pending timer that closes a mismatched pair (`undefined` if none). */
  let mismatchTimer;

  /** Id of the pending timer that opens the victory modal (`undefined` if none). */
  let victoryTimer;

  /** `true` while the dealing animation runs: cards cannot be selected. */
  let isDealing = false;

  /** Number of the latest restart; an older animation stops when a newer restart begins. */
  let restartId = 0;

  /**
   * Handles a click on a card: updates the game state and the interface.
   *
   * @param {number} cardId Id of the clicked card.
   * @returns {void}
   */
  function handleCardClick(cardId) {
    if (isDealing) {
      return;
    }

    const result = selectCard(state, cardId);

    if (result === SELECT_RESULT.ignored) {
      return;
    }

    setCardFlipped(getCardElement(board, cardId), true);

    if (result === SELECT_RESULT.opened) {
      return;
    }

    counters.update(state.moves, getFoundPairs(state));

    if (result === SELECT_RESULT.match) {
      state.matchedIds
        .slice(-2)
        .forEach((id) => {
          setCardMatched(getCardElement(board, id));
        });

      if (isWon(state)) {
        saveResult(state.moves);
        victoryTimer = setTimeout(showVictory, DELAYS.victoryModalMs);
      }
      return;
    }

    mismatchTimer = setTimeout(closeOpenedCards, DELAYS.mismatchMs);
  }


  /**
   * Closes the mismatched pair and unlocks card selection.
   *
   * @returns {void}
   */
  function closeOpenedCards() {
    mismatchTimer = undefined;
    closeMismatch(state)
      .forEach((id) => {
        setCardFlipped(getCardElement(board, id), false);
      });
  }


  /**
   * Opens the victory modal for the finished game.
   *
   * @returns {void}
   */
  function showVictory() {
    victoryTimer = undefined;
    openVictoryModal(state.moves, restart);
  }


  /**
   * Starts a new game: cancels pending timers, closes the modal and creates a new
   * shuffled game at once, then plays the dealing animation on the board:
   * opened cards turn face down, gather in the center and are dealt one by one.
   * Cards cannot be selected until the animation is over. Calling it again
   * during the animation starts over.
   *
   * @returns {Promise<void>} Resolves when the animation is over (or was replaced by a newer restart).
   */
  async function restart() {
    restartId += 1;
    const currentRestartId = restartId;
    const animate = !prefersReducedMotion();

    clearTimeout(mismatchTimer);
    clearTimeout(victoryTimer);
    mismatchTimer = undefined;
    victoryTimer = undefined;
    closeActiveModal();

    isDealing = true;
    board.classList.add(CLASS_NAMES.state.dealing);
    cancelDealAnimation(board);

    state = createGame();
    counters.update(0, 0);

    if (animate) {
      await flipCardsFaceDown(board);

      if (currentRestartId !== restartId) {
        return;
      }
    }

    const newBoard = createBoard(state.cards, handleCardClick);
    newBoard.classList.add(CLASS_NAMES.state.dealing);
    board.replaceWith(newBoard);
    board = newBoard;

    if (animate) {
      await dealCards(board);

      if (currentRestartId !== restartId) {
        return;
      }
    }

    board.classList.remove(CLASS_NAMES.state.dealing);
    isDealing = false;
  }

  return {
    element: createGameSection(counters.element, board),
    restart,
  };
}



/*###################################################################################################################*/
/* #region Game screen */

/**
 * Counters component: its root element and a function that refreshes the values.
 *
 * @typedef {Object} Counters
 * @property {HTMLElement} element Root element to insert into the page.
 * @property {(moves: number, foundPairs: number) => void} update Refreshes the displayed values.
 */


/**
 * Creates the counters block showing "Moves" and "Pairs" (found of total).
 * Initial values are 0 moves and 0 found pairs.
 *
 * @param {number} totalPairs Total number of pairs in the game (shown after the slash).
 * @returns {Counters} The counters component.
 */
function createCounters(totalPairs) {
  const movesValue = el('span', { className: CLASS_NAMES.counters.value });
  const pairsValue = el('span', { className: CLASS_NAMES.counters.value });

  const element = el(
    'div',
    { className: CLASS_NAMES.counters.root },
    createCounterItem(STRINGS.counters.moves, movesValue),
    createCounterItem(STRINGS.counters.pairs, pairsValue),
  );

  /**
   * Refreshes the displayed values.
   *
   * @param {number} moves Number of moves made.
   * @param {number} foundPairs Number of pairs found.
   * @returns {void}
   */
  function update(moves, foundPairs) {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${foundPairs} / ${totalPairs}`;
  }

  update(0, 0);

  return { element, update };
}


/**
 * Creates one counter: a caption and a value element.
 *
 * @param {string} label Caption of the counter.
 * @param {HTMLElement} valueElement Element that displays the value.
 * @returns {HTMLElement} The counter element.
 */
function createCounterItem(label, valueElement) {
  return el(
    'div',
    { className: CLASS_NAMES.counters.item },
    el('span', { className: CLASS_NAMES.counters.label, text: label }),
    valueElement,
  );
}


/**
 * Creates the game screen container that holds the counters and the board.
 *
 * @param {...import('./dom.js').ElementChild} children Counters and board elements.
 * @returns {HTMLElement} The `<section>` element.
 */
function createGameSection(...children) {
  return el('section', { className: CLASS_NAMES.game }, ...children);
}


/**
 * Creates the DOM element of a card. The card is rendered face down;
 * its id is stored in `data-id` so that the board can identify clicks.
 *
 * @param {import('../game/cards.js').Card} card Card data (id and emoji).
 * @returns {HTMLButtonElement} The `<button>` element of the card.
 */
function createCard(card) {
  return el(
    'button',
    {
      className: CLASS_NAMES.card.root,
      attrs: { type: 'button', 'aria-label': STRINGS.card.label },
      dataset: { id: String(card.id) },
    },
    el(
      'span',
      { className: CLASS_NAMES.card.inner },
      el('span', { className: CLASS_NAMES.card.back }),
      el('span', { className: CLASS_NAMES.card.front, text: card.symbol }),
    ),
  );
}


/**
 * Creates the board with the given cards laid out in the order of the array.
 * Clicks are handled by a single listener on the board (event delegation).
 *
 * @param {import('../game/cards.js').Card[]} cards Cards to render (a shuffled deck).
 * @param {(cardId: number) => void} onCardClick Called with the id of the clicked card.
 * @returns {HTMLElement} The board element.
 */
function createBoard(cards, onCardClick) {
  return el(
    'div',
    {
      className: CLASS_NAMES.board,
      on: {
        click: (event) => {
          const cardElement = event.target.closest(`.${CLASS_NAMES.card.root}`);

          if (cardElement) {
            onCardClick(Number(cardElement.dataset.id));
          }
        },
      },
    },
    cards.map(createCard),
  );
}


/**
 * Finds the element of a card on the board by the card id.
 *
 * @param {HTMLElement} board Board element created by {@link createBoard}.
 * @param {number} cardId Id of the card.
 * @returns {HTMLElement | null} The card element, or `null` if there is no such card.
 */
function getCardElement(board, cardId) {
  return board.querySelector(`[data-id="${cardId}"]`);
}


/**
 * Shows the front side of a card (`true`) or turns it face down (`false`).
 *
 * @param {HTMLElement} cardElement Card element created by {@link createCard}.
 * @param {boolean} flipped Whether the card should be open.
 * @returns {void}
 */
function setCardFlipped(cardElement, flipped) {
  cardElement.classList.toggle(CLASS_NAMES.state.flipped, flipped);
}


/**
 * Marks a card as belonging to a found pair.
 *
 * @param {HTMLElement} cardElement Card element created by {@link createCard}.
 * @returns {void}
 */
function setCardMatched(cardElement) {
  cardElement.classList.add(CLASS_NAMES.state.matched);
}

/* #endregion */
