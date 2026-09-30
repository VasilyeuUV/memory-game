/**
 * @module ui/modal
 * Behavior of all modal windows: opening, closing (Escape, click on the background,
 * buttons), focus handling, and the concrete modals of the game (victory).
 * The DOM of a modal is built by `createModal` in the last region of this file.
 * Only one modal can be open at a time.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { STRINGS } from '../constants/strings.js';
import { append, createButton, el } from './dom.js';


/**
 * Description of a modal button. The modal closes after `onClick` is called.
 *
 * @typedef {Object} ModalButton
 * @property {string} label Button caption.
 * @property {() => void} [onClick] Called when the button is clicked, before the modal closes.
 */


/**
 * Content of a modal.
 *
 * @typedef {Object} ModalOptions
 * @property {string} title Modal title (also used as the accessible name of the dialog).
 * @property {import('./dom.js').ElementChild} [content] Content of the modal body.
 * @property {ModalButton[]} [buttons] Buttons shown at the bottom, from left to right.
 */


/** The modal that is currently open (`null` if none). */
let activeModal = null;


/**
 * Opens the victory modal with the final number of moves.
 *
 * @param {number} moves Number of moves the game took.
 * @param {() => void} onNewGame Called when "New Game" is clicked.
 * @returns {{ close: () => void }} Handle that closes the modal.
 */
export function openVictoryModal(moves, onNewGame) {
  return openModal({
    title: STRINGS.victory.title,
    content: STRINGS.victory.message(moves),
    buttons: [
      { label: STRINGS.victory.newGame, onClick: onNewGame },
      { label: STRINGS.victory.close },
    ],
  });
}


/**
 * Opens a modal in the page, closing the previous one if it is still open.
 * It is closed by the Escape key, by a click on the background or by any of its buttons.
 * Keyboard focus moves into the modal and returns to the previous element on close.
 *
 * @param {ModalOptions} options Title, content and buttons of the modal.
 * @returns {{ close: () => void }} Handle that closes this modal.
 */
export function openModal({ title, content, buttons = [] }) {
  closeActiveModal();

  const previouslyFocused = document.activeElement;
  let isClosed = false;

  const actionButtons = buttons.map(({ label, onClick }) => createButton(label, () => {
    onClick?.();
    close();
  }));

  const { overlay, dialog } = createModal({
    title,
    content,
    buttons: actionButtons,
    onBackdropClick: close,
  });


  /**
   * Closes the modal when Escape is pressed.
   *
   * @param {KeyboardEvent} event Keyboard event.
   * @returns {void}
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      close();
    }
  }

  /**
   * Removes the modal from the page and restores the focus. Safe to call twice.
   *
   * @returns {void}
   */
  function close() {
    if (isClosed) {
      return;
    }

    isClosed = true;
    document.removeEventListener('keydown', handleKeydown);
    overlay.remove();

    if (activeModal === handle) {
      activeModal = null;
    }

    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
  }

  const handle = { close };

  activeModal = handle;
  document.addEventListener('keydown', handleKeydown);
  append(document.body, overlay);
  (actionButtons[0] ?? dialog).focus();

  return handle;
}


/**
 * Closes the open modal, if there is one.
 *
 * @returns {void}
 */
export function closeActiveModal() {
  activeModal?.close();
}


/**
 * Parts of a modal window built by {@link createModal}.
 *
 * @typedef {Object} ModalElements
 * @property {HTMLElement} overlay Full-screen dimmed background; the root of the modal.
 * @property {HTMLElement} dialog The dialog window inside the overlay.
 */


/**
 * Creates the DOM of a modal window (not yet attached to the page).
 *
 * @param {Object} options Modal parts.
 * @param {string} options.title Modal title (also used as the accessible name of the dialog).
 * @param {import('./dom.js').ElementChild} [options.content] Content of the modal body.
 * @param {HTMLElement[]} [options.buttons] Ready buttons shown at the bottom.
 * @param {() => void} [options.onBackdropClick] Called when the background (not the dialog) is clicked.
 * @returns {ModalElements} The overlay and the dialog elements.
 */
function createModal({ title, content, buttons = [], onBackdropClick }) {
  const dialog = el(
    'div',
    {
      className: CLASS_NAMES.modal.dialog,
      attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
    },
    el('h2', { className: CLASS_NAMES.modal.title, text: title }),
    el('div', { className: CLASS_NAMES.modal.body }, content),
    el('div', { className: CLASS_NAMES.modal.actions }, buttons),
  );

  const overlay = el(
    'div',
    {
      className: CLASS_NAMES.modal.root,
      on: {
        click: (event) => {
          if (event.target === overlay) {
            onBackdropClick?.();
          }
        },
      },
    },
    dialog,
  );

  return { overlay, dialog };
}
