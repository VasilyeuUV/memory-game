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
 *   button: string
 * }>}
 */
export const CLASS_NAMES = Object.freeze({
  header: Object.freeze({
    root: 'header',
    title: 'header__title',
    actions: 'header__actions',
  }),
  button: 'btn',
});
