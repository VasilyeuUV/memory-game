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
 *   board: string,
 *   card: Readonly<{ root: string, inner: string, front: string, back: string }>,
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
  board: 'board',
  card: Object.freeze({
    root: 'card',
    inner: 'card__inner',
    front: 'card__face card__face--front',
    back: 'card__face card__face--back',
  }),
  button: 'btn',
});
