import '../scss/main.scss';

/**
 * Main JS scripts
 *
 * @since 1.0
 */
document.addEventListener('click', (e) => {
  const el = e.target;

  if (el.closest('[data-js-event]')) {
    e.preventDefault();
  }
});
