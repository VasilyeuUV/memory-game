/**
 * @module constants/strings
 * All user-visible texts of the interface in one place.
 * Components import texts from here instead of hardcoding them.
 */

/**
 * Interface texts, grouped by the component that uses them.
 *
 * @type {Readonly<{
 *   header: Readonly<{ title: string, newGame: string, leaderboard: string }>,
 *   counters: Readonly<{ moves: string, pairs: string }>,
 *   card: Readonly<{ label: string }>,
 *   victory: Readonly<{ title: string, message: (moves: number) => string, newGame: string, close: string }>
 * }>}
 */
export const STRINGS = Object.freeze({
  header: Object.freeze({
    title: 'Memory Game',
    newGame: 'New Game',
    leaderboard: 'Leaderboard',
  }),
  counters: Object.freeze({
    moves: 'Moves',
    pairs: 'Pairs',
  }),
  card: Object.freeze({
    label: 'Card',
  }),
  victory: Object.freeze({
    title: 'You win!',
    message: (moves) => `You found all pairs in ${moves} ${moves === 1 ? 'move' : 'moves'}.`,
    newGame: 'New Game',
    close: 'Close',
  }),
});
