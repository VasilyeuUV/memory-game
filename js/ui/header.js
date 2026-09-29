/**
 * @module ui/header
 * Page header with the game title and the "New Game" / "Leaderboard" buttons.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { STRINGS } from '../constants/strings.js';
import { el } from './dom.js';

/**
 * Click handlers of the header buttons. Both are optional:
 * a button without a handler is rendered but does nothing.
 *
 * @typedef {Object} HeaderHandlers
 * @property {() => void} [onNewGame] Called when "New Game" is clicked.
 * @property {() => void} [onLeaderboard] Called when "Leaderboard" is clicked.
 */


/**
 * Creates the page header.
 *
 * @param {HeaderHandlers} [handlers={}] Click handlers of the buttons.
 * @returns {HTMLElement} The `<header>` element.
 */
export function createHeader({ onNewGame, onLeaderboard } = {}) {
  return el(
    'header',
    { className: CLASS_NAMES.header.root },
    el('h1', { className: CLASS_NAMES.header.title, text: STRINGS.header.title }),
    el('nav',
      { className: CLASS_NAMES.header.actions },
      createButton(STRINGS.header.newGame, onNewGame),
      createButton(STRINGS.header.leaderboard, onLeaderboard),
    ),
  );
}


/**
 * Creates a header button.
 *
 * @param {string} label Button caption.
 * @param {() => void} [onClick] Optional click handler.
 * @returns {HTMLButtonElement} The `<button>` element.
 */
function createButton(label, onClick) {
  return el('button', {
    className: CLASS_NAMES.button,
    text: label,
    attrs: { type: 'button' },
    on: onClick
      ? { click: onClick }
      : {},
  });
}
