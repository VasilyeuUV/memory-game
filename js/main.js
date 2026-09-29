/**
 * @module main
 * Application entry point: builds the interface and mounts it into `<body>`.
 */

import { CLASS_NAMES } from './constants/classNames.js';
import { createGame } from './game/game.js';
import { createBoard } from './ui/board.js';
import { append, el } from './ui/dom.js';
import { createHeader } from './ui/header.js';

/**
 * Creates a new game and appends the header and the board to `<body>`.
 *
 * @returns {void}
 */
function init() {
  const game = createGame();

  append(
    document.body,
    createHeader(),
    el('main', { className: CLASS_NAMES.main }, createBoard(game.cards)),
  );
}

init();
