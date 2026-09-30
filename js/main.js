/**
 * @module main
 * Application entry point: builds the interface and mounts it into `<body>`.
 */

import { append, createHeader, createMain } from './ui/dom.js';
import { createGameScreen } from './ui/gameScreen.js';

/**
 * Appends the header and the game screen (a new game) to `<body>`.
 *
 * @returns {void}
 */
function init() {
  const gameScreen = createGameScreen();

  append(
    document.body,
    createHeader({ onNewGame: gameScreen.restart }),
    createMain(gameScreen.element),
  );
}

init();
