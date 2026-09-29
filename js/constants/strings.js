/**
 * @module constants/strings
 * All user-visible texts of the interface in one place.
 * Components import texts from here instead of hardcoding them.
 */

/**
 * Interface texts, grouped by the component that uses them.
 *
 * @type {Readonly<{
 *   header: Readonly<{ title: string, newGame: string, leaderboard: string }>
 * }>}
 */
export const STRINGS = Object.freeze({
  header: Object.freeze({
    title: 'Memory Game',
    newGame: 'New Game',
    leaderboard: 'Leaderboard',
  }),
});
