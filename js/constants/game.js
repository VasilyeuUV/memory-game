/**
 * @module constants/game
 * Tunable parameters of the game.
 */

/**
 * How long (in milliseconds) a mismatched pair stays open before it is closed.
 * The task requires a value between 700 and 1500 ms.
 *
 * @type {number}
 */
export const MISMATCH_DELAY_MS = 1000;

/**
 * Pause (in milliseconds) between opening the last pair and showing the victory modal,
 * so that the player sees the final flip.
 *
 * @type {number}
 */
export const VICTORY_MODAL_DELAY_MS = 600;

/**
 * Possible outcomes of selecting a card (see `selectCard` in `game/game.js`).
 *
 * - `ignored`  — the click had no effect (unknown, opened or found card, or selection is locked);
 * - `opened`   — the first card of a move was opened;
 * - `match`    — the second card matched the first one, the pair stays open;
 * - `mismatch` — the second card differs, selection is locked until the pair is closed.
 *
 * @type {Readonly<{ ignored: 'ignored', opened: 'opened', match: 'match', mismatch: 'mismatch' }>}
 */
export const SELECT_RESULT = Object.freeze({
  ignored: 'ignored',
  opened: 'opened',
  match: 'match',
  mismatch: 'mismatch',
});


/**
 * Key under which the leaderboard is stored in `localStorage`.
 *
 * @type {string}
 */
export const LEADERBOARD_STORAGE_KEY = 'memory-game:leaderboard';


/**
 * Number of results kept and shown in the leaderboard.
 *
 * @type {number}
 */
export const LEADERBOARD_SIZE = 10;
