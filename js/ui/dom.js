/**
 * @module ui/dom
 * Building blocks of the DOM tree: the generic helpers (`el`, `append`, `clear`, ...)
 * and the components shared by the whole page (button, header, main area, footer).
 * Game-specific elements are built in `ui/gameScreen.js`, modal windows in `ui/modal.js`.
 * All elements are created exclusively through `document.createElement`;
 * no HTML strings are parsed anywhere in this module.
 */

import { CLASS_NAMES } from '../constants/classNames.js';
import { FOOTER } from '../constants/gameConst.js';
import { STRINGS } from '../constants/strings.js';


/**
 * A single child accepted by {@link el}: a DOM node, a plain string/number
 * (converted to a text node), or a nullish/boolean value (ignored).
 * Arrays of children are flattened recursively.
 *
 * @typedef {Node | string | number | boolean | null | undefined | ElementChild[]} ElementChild
 */


/**
 * Options describing an element created by {@link el}.
 *
 * @typedef {Object} ElementOptions
 * @property {string | string[]} [className] Class name(s) to add. A string may contain several space-separated names.
 * @property {string} [text] Text content, assigned through `textContent`.
 * @property {Object<string, string | number | boolean | null | undefined>} [attrs]
 *   Attributes to set. `true` sets an empty attribute, `false`/`null`/`undefined` skips it.
 * @property {Object<string, string>} [dataset] Values for `data-*` attributes (camelCase keys).
 * @property {Object<string, EventListenerOrEventListenerObject>} [on]
 *   Event listeners keyed by event type, e.g. `{ click: handler }`.
 */


/**
 * Creates a DOM element using `document.createElement` and configures it.
 *
 * @param {string} tag Tag name of the element to create (e.g. `'div'`).
 * @param {ElementOptions} [options={}] Configuration applied to the element.
 * @param {...ElementChild} children Children appended to the element in order.
 * @returns {HTMLElement} The created and configured element.
 * @example
 * const button = el('button', { className: 'btn', text: 'New Game', on: { click: startGame } });
 * const header = el('header', { className: 'header' }, el('h1', { text: 'Memory Game' }), button);
 */
export function el(tag, options = {}, ...children) {
  const element = document.createElement(tag);
  const { className, text, attrs, dataset, on } = options;

  if (className) {
    addClasses(element, className);
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  if (attrs) {
    setAttributes(element, attrs);
  }

  if (dataset) {
    Object.assign(element.dataset, dataset);
  }

  if (on) {
    Object.entries(on)
      .forEach(([type, listener]) => {
        element.addEventListener(type, listener);
      });
  }

  append(element, ...children);

  return element;
}


/**
 * Appends children to a parent node. Strings and numbers become text nodes,
 * nullish and boolean values are skipped, nested arrays are flattened.
 *
 * @param {Node} parent Node that receives the children.
 * @param {...ElementChild} children Children to append.
 * @returns {Node} The same `parent`, to allow chaining.
 */
export function append(parent, ...children) {
  children
    .flat(Infinity)
    .forEach((child) => {
      if (child === null
        || child === undefined
        || typeof child === 'boolean') {
        return;
      }

      parent.appendChild(
        child instanceof Node
          ? child
          : document.createTextNode(String(child)),
      );
    });

  return parent;
}


/**
 * Removes every child node of the given element.
 *
 * @param {Node} node Node to be emptied.
 * @returns {Node} The same `node`, to allow chaining.
 */
export function clear(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  return node;
}



/*###################################################################################################################*/
/* #region Components */

/**
 * Click handlers of the header buttons. Both are optional:
 * a button without a handler is rendered but does nothing.
 *
 * @typedef {Object} HeaderHandlers
 * @property {() => void} [onNewGame] Called when "New Game" is clicked.
 * @property {() => void} [onLeaderboard] Called when "Leaderboard" is clicked.
 */


/**
 * Creates the page header with the title and the "New Game" / "Leaderboard" buttons.
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
 * Creates the `<main>` element that holds the page content.
 *
 * @param {...ElementChild} children Content of the main area.
 * @returns {HTMLElement} The `<main>` element.
 */
export function createMain(...children) {
  return el('main', { className: CLASS_NAMES.main }, ...children);
}


/**
 * Creates a button.
 *
 * @param {string} label Button caption.
 * @param {() => void} [onClick] Optional click handler.
 * @returns {HTMLButtonElement} The `<button>` element.
 */
export function createButton(label, onClick) {
  return el('button', {
    className: CLASS_NAMES.button,
    text: label,
    attrs: { type: 'button' },
    on: onClick
      ? { click: onClick }
      : {},
  });
}


/**
 * Creates the page footer: the GitHub logo linking to the project on the left,
 * the year the game was created in the middle and the RS School logo linking
 * to the task description on the right.
 *
 * @returns {HTMLElement} The `<footer>` element.
 */
export function createFooter() {
  return el(
    'footer',
    { className: CLASS_NAMES.footer.root },
    createLogoLink(FOOTER.projectUrl, FOOTER.githubLogo, STRINGS.footer.githubLink),
    el('span', { className: CLASS_NAMES.footer.year, text: String(FOOTER.createdYear) }),
    createLogoLink(FOOTER.taskUrl, FOOTER.rsSchoolLogo, STRINGS.footer.rsSchoolLink),
  );
}


/**
 * Creates a link that consists of a logo image. It opens in a new tab.
 *
 * @param {string} href Address the link leads to.
 * @param {string} logoSrc Path of the logo image.
 * @param {string} label Accessible name of the link, also the alternative text of the image.
 * @returns {HTMLAnchorElement} The `<a>` element.
 */
function createLogoLink(href, logoSrc, label) {
  return el(
    'a',
    {
      className: CLASS_NAMES.footer.link,
      attrs: { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': label, title: label },
    },
    el('img', { className: CLASS_NAMES.footer.logo, attrs: { src: logoSrc, alt: '' } }),
  );
}

/* #endregion Components */



/**
 * Adds one or several class names to an element.
 *
 * @param {HTMLElement} element Target element.
 * @param {string | string[]} className Class name(s); a string may hold several space-separated names.
 * @returns {void}
 */
function addClasses(element, className) {
  const names = Array.isArray(className)
    ? className
    : className.split(/\s+/);
  element.classList.add(...names.filter(Boolean));
}


/**
 * Sets a group of attributes on an element.
 * `true` produces an empty attribute (e.g. `disabled`); `false`, `null` and
 * `undefined` values are skipped.
 *
 * @param {HTMLElement} element Target element.
 * @param {Object<string, string | number | boolean | null | undefined>} attrs Attribute name/value map.
 * @returns {void}
 */
function setAttributes(element, attrs) {
  Object.entries(attrs)
    .forEach(([name, value]) => {
      if (value === false
        || value === null
        || value === undefined) {
        return;
      }

      element.setAttribute(name, value === true
        ? ''
        : String(value));
    });
}
