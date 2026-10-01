/**
 * @module game/storage
 * Leaderboard persistence in `localStorage`: saving results and loading the top list.
 * Pure logic, no DOM access.
 */

import { LEADERBOARD } from '../constants/gameConst.js';
import { STRINGS } from '../constants/strings.js';


/**
 * Result of a finished game.
 *
 * @typedef {Object} GameResult
 * @property {number} moves Number of moves the game took.
 * @property {number} date Time the game was finished, in milliseconds since the Unix epoch.
 */


/**
 * Compares two results for sorting: fewer moves first; for equal moves the earlier game first.
 *
 * @param {GameResult} a First result.
 * @param {GameResult} b Second result.
 * @returns {number} Negative if `a` ranks higher than `b`, positive if lower, otherwise 0.
 */
export function compareResults(a, b) {
  return a.moves - b.moves
    || a.date - b.date;
}


/**
 * Checks that a value read from the storage looks like a {@link GameResult}.
 *
 * @param {unknown} value Value to check.
 * @returns {boolean} `true` if the value is a well-formed result.
 */
function isValidResult(value) {
  return value !== null
    && typeof value === 'object'
    && Number.isInteger(value.moves)
    && value.moves > 0
    && Number.isFinite(value.date);
}


/**
 * Loads the leaderboard: valid stored results, sorted, at most {@link LEADERBOARD.size} of them.
 * Missing storage data gives an empty list; corrupted or unavailable storage
 * gives an empty list and a warning in the console.
 *
 * @returns {GameResult[]} Results from the best to the worst.
 */
export function loadResults() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEADERBOARD.storageKey));

    return Array.isArray(stored)
      ? stored
        .filter(isValidResult)
        .sort(compareResults)
        .slice(0, LEADERBOARD.size)
      : [];
  } catch (error) {
    console.warn(STRINGS.errors.leaderboardRead, error);
    return [];
  }
}


/**
 * Adds a finished game to the leaderboard and saves the top list.
 * If the storage is unavailable the result is not persisted (a warning is logged),
 * but the game keeps working.
 *
 * @param {number} moves Number of moves the game took.
 * @param {number} [date=Date.now()] Time the game was finished (ms since the Unix epoch).
 * @returns {GameResult[]} The updated top list, from the best to the worst.
 */
export function saveResult(moves, date = Date.now()) {
  const results = [...loadResults(), { moves, date }]
    .sort(compareResults)
    .slice(0, LEADERBOARD.size);

  try {
    localStorage.setItem(LEADERBOARD.storageKey, JSON.stringify(results));
  } catch (error) {
    console.warn(STRINGS.errors.leaderboardSave, error);
  }

  return results;
}
