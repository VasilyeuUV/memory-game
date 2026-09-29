/**
 * @module main
 * Application entry point: builds the interface and mounts it into `<body>`.
 */

import { append } from './ui/dom.js';
import { createHeader } from './ui/header.js';

/**
 * Builds the interface and appends it to `<body>`.
 *
 * @returns {void}
 */
function init() {
  append(document.body, createHeader());
}

init();
