/**
 * @module constants/gameConst
 * Tunable parameters of the game, grouped into frozen objects.
 */

/**
 * Pauses (in milliseconds) of the game flow.
 *
 * - `mismatchMs`    — how long a mismatched pair stays open before it is closed
 *                     (the task requires a value between 700 and 1500 ms);
 * - `victoryModalMs` — pause between opening the last pair and showing the victory modal,
 *                     so that the player sees the final flip.
 *
 * @type {Readonly<{ mismatchMs: number, victoryModalMs: number }>}
 */
export const DELAYS = Object.freeze({
  mismatchMs: 1000,
  victoryModalMs: 600,
});


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
 * Leaderboard settings.
 *
 * - `storageKey` — key under which the results are stored in `localStorage`;
 * - `size`       — number of results kept and shown.
 *
 * @type {Readonly<{ storageKey: string, size: number }>}
 */
export const LEADERBOARD = Object.freeze({
  storageKey: 'memory-game:leaderboard',
  size: 10,
});


/**
 * Parameters of the dealing animation played on "New Game" (see `ui/dealAnimation.js`).
 *
 * - `gatherDurationMs`   — how long the cards take to gather in the center of the board;
 * - `cardDurationMs`     — how long one card takes to fly to its place;
 * - `cardStaggerMs`      — pause between the start of two consecutive cards;
 * - `pileMaxRotationDeg` — maximum rotation of a card in the pile, to look like a real deck;
 * - `pileMaxOffsetPx`    — maximum random shift of a card in the pile.
 *
 * @type {Readonly<{
 *   gatherDurationMs: number,
 *   cardDurationMs: number,
 *   cardStaggerMs: number,
 *   pileMaxRotationDeg: number,
 *   pileMaxOffsetPx: number
 * }>}
 */
export const DEAL_ANIMATION = Object.freeze({
  gatherDurationMs: 450,
  cardDurationMs: 350,
  cardStaggerMs: 60,
  pileMaxRotationDeg: 12,
  pileMaxOffsetPx: 6,
});


/**
 * Footer content: the year the game was created, the two links and the logo images.
 *
 * - `createdYear` — year shown in the middle of the footer;
 * - `projectUrl`  — repository of the project (GitHub logo, left);
 * - `taskUrl`     — description of the task at RS School (RS School logo, right);
 * - `githubLogo`, `rsSchoolLogo` — paths of the logo images.
 *
 * @type {Readonly<{
 *   createdYear: number,
 *   projectUrl: string,
 *   taskUrl: string,
 *   githubLogo: string,
 *   rsSchoolLogo: string
 * }>}
 */
export const FOOTER = Object.freeze({
  createdYear: 2026,
  projectUrl: 'https://github.com/VasilyeuUV/memory-game',
  taskUrl: 'https://github.com/rolling-scopes-school/tasks/tree/master/tasks/memory-game',
  githubLogo: 'assets/github.svg',
  rsSchoolLogo: 'assets/rs-school.svg',
});
