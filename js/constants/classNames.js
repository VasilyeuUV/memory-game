/**
 * @module constants/classNames
 * CSS class names used by the interface. The same names are written in
 * `css/style.css`: renaming a class requires changing both places.
 */

/**
 * Class names, grouped by the component that uses them (BEM naming).
 *
 * @type {Readonly<{
 *   header: Readonly<{ root: string, title: string, actions: string }>,
 *   main: string,
 *   game: string,
 *   counters: Readonly<{ root: string, item: string, label: string, value: string }>,
 *   board: string,
 *   modal: Readonly<{ root: string, dialog: string, title: string, body: string, actions: string }>,
 *   card: Readonly<{ root: string, inner: string, front: string, back: string }>,
 *   state: Readonly<{ flipped: string, matched: string }>,
 *   button: string
 * }>}
 */
export const CLASS_NAMES = Object.freeze({
  header: Object.freeze({
    root: 'header',
    title: 'header__title',
    actions: 'header__actions',
  }),
  main: 'main',
  game: 'game',
  counters: Object.freeze({
    root: 'counters',
    item: 'counters__item',
    label: 'counters__label',
    value: 'counters__value',
  }),
  board: 'board',
  modal: Object.freeze({
    root: 'modal',
    dialog: 'modal__dialog',
    title: 'modal__title',
    body: 'modal__body',
    actions: 'modal__actions',
  }),
  card: Object.freeze({
    root: 'card',
    inner: 'card__inner',
    front: 'card__face card__face--front',
    back: 'card__face card__face--back',
  }),
  state: Object.freeze({
    flipped: 'is-flipped',
    matched: 'is-matched',
  }),
  button: 'btn',
});
