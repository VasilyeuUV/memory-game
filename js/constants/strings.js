/**
 * @module constants/strings
 * All user-visible texts of the interface and the messages written to the console
 * in one place. Components import texts from here instead of hardcoding them.
 */

/**
 * Interface texts and console messages, grouped by the component that uses them.
 *
 * @type {Readonly<{
 *   header: Readonly<{ title: string, newGame: string, leaderboard: string }>,
 *   counters: Readonly<{ moves: string, pairs: string }>,
 *   card: Readonly<{ label: string }>,
 *   footer: Readonly<{ githubLink: string, rsSchoolLink: string }>,
 *   errors: Readonly<{ leaderboardRead: string, leaderboardSave: string }>,
 *   leaderboard: Readonly<{
 *     title: string, rank: string, moves: string, date: string, empty: string, close: string
 *   }>,
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
  errors: Object.freeze({
    leaderboardRead: 'Leaderboard: cannot read saved results, starting with an empty list.',
    leaderboardSave: 'Leaderboard: cannot save the result to localStorage.',
  }),
  leaderboard: Object.freeze({
    title: 'Leaderboard',
    rank: '#',
    moves: 'Moves',
    date: 'Date',
    empty: 'No results yet. Win a game to get on the board!',
    close: 'Close',
  }),
  footer: Object.freeze({
    githubLink: 'Project on GitHub',
    rsSchoolLink: 'Task description at RS School',
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
