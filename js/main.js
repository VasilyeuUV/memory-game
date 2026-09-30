/**
 * @module main
 * Application entry point: builds the interface and mounts it into `<body>`.
 */

import { CLASS_NAMES } from './constants/classNames.js';
import { append, el } from './ui/dom.js';
import { createGameScreen } from './ui/gameScreen.js';
import { createHeader } from './ui/header.js';

/**
 * Appends the header and the game screen (a new game) to `<body>`.
 *
 * @returns {void}
 */
function init() {
  append(
    document.body,
    createHeader(),
    el('main', { className: CLASS_NAMES.main }, createGameScreen()),
  );
}

init();
