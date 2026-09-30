/**
 * @module ui/gameScreen
 * Game screen: connects the game state with the counters and the board.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { MISMATCH_DELAY_MS, SELECT_RESULT } from '../constants/game.js';
import { closeMismatch, createGame, getFoundPairs, selectCard } from '../game/game.js';
import { createBoard, getCardElement } from './board.js';
import { setCardFlipped, setCardMatched } from './card.js';
import { createCounters } from './counters.js';
import { el } from './dom.js';


/**
 * Creates the game screen and starts a new game.
 *
 * @returns {HTMLElement} The element with the counters and the board.
 */
export function createGameScreen() {
  const state = createGame();
  const counters = createCounters();
  const board = createBoard(state.cards, handleCardClick);

  /** Id of the pending timer that closes a mismatched pair (`undefined` if none). */
  let mismatchTimer;

  /**
   * Handles a click on a card: updates the game state and the interface.
   *
   * @param {number} cardId Id of the clicked card.
   * @returns {void}
   */
  function handleCardClick(cardId) {
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
      return;
    }

    mismatchTimer = setTimeout(closeOpenedCards, MISMATCH_DELAY_MS);
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

  return el('section', { className: CLASS_NAMES.game }, counters.element, board);
}
