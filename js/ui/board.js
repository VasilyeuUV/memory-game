/**
 * @module ui/board
 * Game board: a grid with all the cards.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { createCard } from './card.js';
import { el } from './dom.js';

/**
 * Creates the board with the given cards laid out in the order of the array.
 *
 * @param {import('../game/cards.js').Card[]} cards Cards to render (a shuffled deck).
 * @returns {HTMLElement} The board element.
 */
export function createBoard(cards) {
  return el(
    'div',
    { className: CLASS_NAMES.board },
    cards.map(createCard),
  );
}
