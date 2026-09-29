/**
 * @module ui/dom
 * Helpers for building DOM trees exclusively through `document.createElement`.
 * No HTML strings are parsed anywhere in this module.
 */


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
