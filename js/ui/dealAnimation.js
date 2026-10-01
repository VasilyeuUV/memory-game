/**
 * @module ui/dealAnimation
 * Visual effect of dealing the cards for a new game:
 * 1. opened cards turn face down;
 * 2. all cards gather in the center of the board (imitates shuffling);
 * 3. cards return to their places one by one, from the top left corner,
 *    left to right, top to bottom.
 *
 * The effect is purely visual: it never touches the game state.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { DEAL_ANIMATION } from '../constants/gameConst.js';


/**
 * Tells whether the user asked the system to reduce motion.
 *
 * @returns {boolean} `true` if animations should be skipped.
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


/**
 * Turns every opened card of the board face down and waits until the flip is over.
 * Resolves immediately if no card is open.
 *
 * @param {HTMLElement} board Board element with the cards as children.
 * @returns {Promise<void>} Resolves when the cards are face down.
 */
export async function flipCardsFaceDown(board) {
  const openedCards = getCards(board)
    .filter((card) => card.classList.contains(CLASS_NAMES.state.flipped));

  if (openedCards.length === 0) {
    return;
  }

  openedCards.forEach((card) => card.classList.remove(CLASS_NAMES.state.flipped));
  await wait(getCssDurationMs('--card-flip-duration'));
}


/**
 * Plays the gathering and the dealing of the cards. The cards must be face down.
 * Resolves early (without dealing) if the animation was cancelled
 * with {@link cancelDealAnimation}.
 *
 * @param {HTMLElement} board Board element with the cards as children.
 * @returns {Promise<void>} Resolves when every card is back at its place.
 */
export async function dealCards(board) {
  const cards = getCards(board);
  const boardRect = board.getBoundingClientRect();
  const centerX = boardRect.left + boardRect.width / 2;
  const centerY = boardRect.top + boardRect.height / 2;

  const pileTransforms = cards.map((card) => {
    const rect = card.getBoundingClientRect();
    const dx = centerX - (rect.left + rect.width / 2) + randomOffset(DEAL_ANIMATION.pileMaxOffsetPx);
    const dy = centerY - (rect.top + rect.height / 2) + randomOffset(DEAL_ANIMATION.pileMaxOffsetPx);
    const rotation = randomOffset(DEAL_ANIMATION.pileMaxRotationDeg);

    return `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`;
  });

  const gatherings = cards.map((card, index) => card.animate(
    [{ transform: 'none' }, { transform: pileTransforms[index] }],
    { duration: DEAL_ANIMATION.gatherDurationMs, easing: 'ease-in-out', fill: 'forwards' },
  ));

  await Promise.allSettled(gatherings.map((animation) => animation.finished));

  if (gatherings.some((animation) => animation.playState !== 'finished')) {
    return;
  }

  const dealings = cards.map((card, index) => card.animate(
    [{ transform: pileTransforms[index] }, { transform: 'none' }],
    {
      duration: DEAL_ANIMATION.cardDurationMs,
      delay: index * DEAL_ANIMATION.cardStaggerMs,
      easing: 'ease-out',
      fill: 'both',
    },
  ));

  gatherings.forEach((animation) => animation.cancel());
  await Promise.allSettled(dealings.map((animation) => animation.finished));
  dealings.forEach((animation) => animation.cancel());
}


/**
 * Stops every animation running on the board and its cards; cards return to their places.
 *
 * @param {HTMLElement} board Board element.
 * @returns {void}
 */
export function cancelDealAnimation(board) {
  board
    .getAnimations({ subtree: true })
    .forEach((animation) => animation.cancel());
}


/**
 * Returns the cards of a board in the order they are laid out.
 *
 * @param {HTMLElement} board Board element.
 * @returns {HTMLElement[]} Card elements.
 */
function getCards(board) {
  return [...board.children];
}


/**
 * Returns a random number from `-max` to `max`.
 *
 * @param {number} max Maximum absolute value.
 * @returns {number} Random offset.
 */
function randomOffset(max) {
  return (Math.random() * 2 - 1) * max;
}


/**
 * Resolves after the given time.
 *
 * @param {number} ms Delay in milliseconds.
 * @returns {Promise<void>} Promise that resolves after `ms`.
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


/**
 * Reads a duration from a CSS custom property of the page (`0.4s` or `400ms`).
 * The duration is defined in CSS once, so JS and CSS cannot disagree.
 *
 * @param {string} propertyName Custom property name, e.g. `--card-flip-duration`.
 * @returns {number} Duration in milliseconds (0 if the property is missing).
 */
function getCssDurationMs(propertyName) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();
  const number = parseFloat(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return value.endsWith('ms')
    ? number
    : number * 1000;
}
