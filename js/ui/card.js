/**
 * @module ui/card
 * A single card of the board: a button with a hidden face (emoji) and a back side.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { STRINGS } from '../constants/strings.js';
import { el } from './dom.js';

/**
 * Creates the DOM element of a card. The card is rendered face down;
 * its id is stored in `data-id` so that the board can identify clicks.
 *
 * @param {import('../game/cards.js').Card} card Card data (id and emoji).
 * @returns {HTMLButtonElement} The `<button>` element of the card.
 */
export function createCard(card) {
  return el(
    'button',
    {
      className: CLASS_NAMES.card.root,
      attrs: { type: 'button', 'aria-label': STRINGS.card.label },
      dataset: { id: String(card.id) },
    },
    el(
      'span',
      { className: CLASS_NAMES.card.inner },
      el('span', { className: CLASS_NAMES.card.back }),
      el('span', { className: CLASS_NAMES.card.front, text: card.symbol }),
    ),
  );
}

/**
 * Shows the front side of a card (`true`) or turns it face down (`false`).
 *
 * @param {HTMLElement} cardElement Card element created by {@link createCard}.
 * @param {boolean} flipped Whether the card should be open.
 * @returns {void}
 */
export function setCardFlipped(cardElement, flipped) {
  cardElement.classList.toggle(CLASS_NAMES.state.flipped, flipped);
}

/**
 * Marks a card as belonging to a found pair.
 *
 * @param {HTMLElement} cardElement Card element created by {@link createCard}.
 * @returns {void}
 */
export function setCardMatched(cardElement) {
  cardElement.classList.add(CLASS_NAMES.state.matched);
}
