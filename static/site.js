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
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'bibtex-toggle';
  toggle.textContent = 'BibTeX';
  toggle.setAttribute('aria-controls', details.id);
  toggle.setAttribute('aria-expanded', String(details.open));
  toggle.addEventListener('click', () => {
    details.open = !details.open;
    toggle.setAttribute('aria-expanded', String(details.open));
  });
  details.closest('.publication-body').querySelector('.text-links').append(toggle);
  details.querySelector('summary').hidden = true;
  details.classList.add('bibtex-enhanced');
  button.hidden = false;
  details.addEventListener('toggle', () => {
    toggle.setAttribute('aria-expanded', String(details.open));
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
