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
