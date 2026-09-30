/**
 * @module ui/board
 * Game board: a grid with all the cards.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { createCard } from './card.js';
import { el } from './dom.js';

/**
 * Creates the board with the given cards laid out in the order of the array.
 * Clicks are handled by a single listener on the board (event delegation).
 *
 * @param {import('../game/cards.js').Card[]} cards Cards to render (a shuffled deck).
 * @param {(cardId: number) => void} onCardClick Called with the id of the clicked card.
 * @returns {HTMLElement} The board element.
 */
export function createBoard(cards, onCardClick) {
  return el(
    'div',
    {
      className: CLASS_NAMES.board,
      on: {
        click: (event) => {
          const cardElement = event.target.closest(`.${CLASS_NAMES.card.root}`);

          if (cardElement) {
            onCardClick(Number(cardElement.dataset.id));
          }
        },
      },
    },
    cards.map(createCard),
  );
}

/**
 * Finds the element of a card on the board by the card id.
 *
 * @param {HTMLElement} board Board element created by {@link createBoard}.
 * @param {number} cardId Id of the card.
 * @returns {HTMLElement | null} The card element, or `null` if there is no such card.
 */
export function getCardElement(board, cardId) {
  return board.querySelector(`[data-id="${cardId}"]`);
}
