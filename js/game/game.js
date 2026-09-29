/**
 * @module game/game
 * Game state and rules. Pure logic, no DOM access and no timers:
 * the caller decides when a mismatched pair is closed (see {@link closeMismatch}).
 */

import { PAIRS_COUNT, createShuffledDeck } from './cards.js';

/**
 * Mutable state of a single game.
 *
 * @typedef {Object} GameState
 * @property {import('./cards.js').Card[]} cards Shuffled deck laid out on the board.
 * @property {number[]} openedIds Ids of currently opened, not yet resolved cards (0..2).
 * @property {number[]} matchedIds Ids of cards that belong to found pairs.
 * @property {number} moves Number of moves made; one move is two selected cards.
 * @property {boolean} locked `true` while a mismatched pair waits to be closed; card selection is blocked.
 */

/**
 * Outcome of {@link selectCard}.
 *
 * - `ignored`  — the click had no effect (unknown, opened or found card, or selection is locked);
 * - `opened`   — the first card of a move was opened;
 * - `match`    — the second card matched the first one, the pair stays open;
 * - `mismatch` — the second card differs, selection is locked until {@link closeMismatch}.
 *
 * @typedef {'ignored' | 'opened' | 'match' | 'mismatch'} SelectResult
 */


/**
 * Creates the state of a new game: shuffled deck, zeroed counters, nothing opened.
 *
 * @returns {GameState} Fresh game state.
 */
export function createGame() {
  return {
    cards: createShuffledDeck(),
    openedIds: [],
    matchedIds: [],
    moves: 0,
    locked: false,
  };
}


/**
 * Handles the selection of a card and updates the state in place.
 * A move is counted when the second card of a turn is selected.
 *
 * @param {GameState} state Current game state (mutated).
 * @param {number} cardId Id of the selected card.
 * @returns {SelectResult} What happened as a result of the selection.
 */
export function selectCard(state, cardId) {
  const card = findCard(state, cardId);

  if (!card
    || state.locked
    || state.openedIds.includes(cardId)
    || state.matchedIds.includes(cardId)) {
    return 'ignored';
  }

  state.openedIds.push(cardId);

  if (state.openedIds.length === 1) {
    return 'opened';
  }

  state.moves += 1;

  const [firstId, secondId] = state.openedIds;

  if (findCard(state, firstId).symbol === card.symbol) {
    state.matchedIds.push(firstId, secondId);
    state.openedIds = [];
    return 'match';
  }

  state.locked = true;
  return 'mismatch';
}


/**
 * Closes a mismatched pair and unlocks card selection.
 * Does nothing when there is no pending mismatch.
 *
 * @param {GameState} state Current game state (mutated).
 * @returns {number[]} Ids of the cards that were closed (empty if nothing was pending).
 */
export function closeMismatch(state) {
  if (!state.locked) {
    return [];
  }

  const closedIds = state.openedIds;
  state.openedIds = [];
  state.locked = false;

  return closedIds;
}


/**
 * Returns the number of pairs found so far.
 *
 * @param {GameState} state Current game state.
 * @returns {number} Found pairs, from 0 to {@link PAIRS_COUNT}.
 */
export function getFoundPairs(state) {
  return state.matchedIds.length / 2;
}


/**
 * Tells whether every pair has been found.
 *
 * @param {GameState} state Current game state.
 * @returns {boolean} `true` when the game is won.
 */
export function isWon(state) {
  return getFoundPairs(state) === PAIRS_COUNT;
}


/**
 * Finds a card of the current deck by id.
 *
 * @param {GameState} state Current game state.
 * @param {number} cardId Card id to look for.
 * @returns {import('./cards.js').Card | undefined} The card, or `undefined` if the id is unknown.
 */
function findCard(state, cardId) {
  return state.cards.find((card) => card.id === cardId);
}
