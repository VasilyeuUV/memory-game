/**
 * @module game/cards
 * Card data: the emoji set, deck creation and shuffling.
 */

/**
 * A single card of the deck.
 *
 * @typedef {Object} Card
 * @property {number} id Unique card id within a deck (0..15).
 * @property {string} symbol Emoji shown on the card face; two cards share a symbol to form a pair.
 */

/**
 * Emojis used as card faces. Each one produces a pair, so the deck holds `EMOJIS.length * 2` cards.
 *
 * @type {readonly string[]}
 */
export const EMOJIS = Object.freeze(['🐶', '🐱', '🦊', '🐼', '🐸', '🦁', '🐵', '🐙']);

/** Number of pairs in the game. */
export const PAIRS_COUNT = EMOJIS.length;

/**
 * Returns a new array with the items of `items` in random order
 * (Fisher–Yates shuffle). The original array is not modified.
 *
 * @template T
 * @param {readonly T[]} items Items to shuffle.
 * @returns {T[]} New shuffled array.
 */
export function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}


/**
 * Creates an ordered (not shuffled) deck: two cards for every emoji.
 *
 * @returns {Card[]} Deck of `PAIRS_COUNT * 2` cards with unique ids.
 */
export function createDeck() {
  return EMOJIS.flatMap((symbol, index) => [
    { id: index * 2, symbol },
    { id: index * 2 + 1, symbol },
  ]);
}


/**
 * Creates a freshly shuffled deck ready for a new game.
 *
 * @returns {Card[]} Shuffled deck of 16 cards.
 */
export function createShuffledDeck() {
  return shuffle(createDeck());
}
