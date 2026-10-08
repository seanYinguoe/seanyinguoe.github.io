// Keep links to sections in the previous single-page site usable.
(() => {
  if (location.pathname !== '/' && location.pathname !== '/index.html') return;
  const destinations = {
    '#research': '/research/', '#publications': '/publications/',
    '#paper-inverse-design': '/publications/#paper-inverse-design',
    '#paper-bistability': '/publications/#paper-bistability',
    '#education': '/academic/#education', '#activities': '/academic/#presentations',
    '#code': '/research/#code'
  };
  const redirect = () => {
    const destination = destinations[location.hash];
    if (destination) location.replace(destination);
  };
  redirect();
  window.addEventListener('hashchange', redirect);
})();

// Local interactive research icons; the browser's native pointer is unchanged.
import { mountStructureIcons } from './structure-icons.js';
mountStructureIcons();

// The native disclosure remains usable without JavaScript.
document.querySelectorAll('.bibtex').forEach((details) => {
  const button = details.querySelector('.copy-bibtex');
  const code = details.querySelector('code');
  const status = details.querySelector('.bibtex-status');
  button.hidden = false;
  details.addEventListener('toggle', () => {
    if (!details.open) status.textContent = '';
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = 'Copied.';
    } catch {
      // Keep manual copying available when clipboard access is blocked.
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      status.textContent = 'Select the citation and copy it manually.';
    } finally {
      button.disabled = false;
    }
  });
});
