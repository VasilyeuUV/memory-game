/**
 * @module main
 * Application entry point: builds the interface and mounts it into `<body>`.
 */

import { append, createFooter, createHeader, createMain } from './ui/dom.js';
import { createGameScreen } from './ui/gameScreen.js';
import { openLeaderboardModal } from './ui/modal.js';

/**
 * Appends the header, the game screen (a new game) and the footer to `<body>`.
 *
 * @returns {void}
 */
function init() {
  const gameScreen = createGameScreen();

  append(
    document.body,
    createHeader({
      onNewGame: gameScreen.restart,
      onLeaderboard: openLeaderboardModal
    }),
    createMain(gameScreen.element),
    createFooter(),
  );
}

init();
