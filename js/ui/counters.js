/**
 * @module ui/counters
 * Counters of moves and found pairs.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { STRINGS } from '../constants/strings.js';
import { PAIRS_COUNT } from '../game/cards.js';
import { el } from './dom.js';

/**
 * Counters component: its root element and a function that refreshes the values.
 *
 * @typedef {Object} Counters
 * @property {HTMLElement} element Root element to insert into the page.
 * @property {(moves: number, foundPairs: number) => void} update Refreshes the displayed values.
 */


/**
 * Creates the counters block showing "Moves" and "Pairs" (found of total).
 * Initial values are 0 moves and 0 found pairs.
 *
 * @returns {Counters} The counters component.
 */
export function createCounters() {
  const movesValue = el('span', { className: CLASS_NAMES.counters.value });
  const pairsValue = el('span', { className: CLASS_NAMES.counters.value });

  const element = el(
    'div',
    { className: CLASS_NAMES.counters.root },
    createItem(STRINGS.counters.moves, movesValue),
    createItem(STRINGS.counters.pairs, pairsValue),
  );

  /**
   * Refreshes the displayed values.
   *
   * @param {number} moves Number of moves made.
   * @param {number} foundPairs Number of pairs found.
   * @returns {void}
   */
  function update(moves, foundPairs) {
    movesValue.textContent = String(moves);
    pairsValue.textContent = `${foundPairs} / ${PAIRS_COUNT}`;
  }

  update(0, 0);

  return { element, update };
}

/**
 * Creates one counter: a caption and a value element.
 *
 * @param {string} label Caption of the counter.
 * @param {HTMLElement} valueElement Element that displays the value.
 * @returns {HTMLElement} The counter element.
 */
function createItem(label, valueElement) {
  return el(
    'div',
    { className: CLASS_NAMES.counters.item },
    el('span', { className: CLASS_NAMES.counters.label, text: label }),
    valueElement,
  );
}
