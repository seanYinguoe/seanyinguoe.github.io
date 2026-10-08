import { writeFile } from 'node:fs/promises';
import { kreslingMarkup } from '../static/kresling.js';
import { kirigamiMarkup } from '../static/kirigami.js';
for (const [name, markup] of [['kresling', kreslingMarkup], ['kirigami', kirigamiMarkup]]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g data-structure-mesh>${markup(0)}</g></svg>`;
  await writeFile(new URL(`../static/assets/${name}.svg`, import.meta.url), svg);
}
console.log('Rendered the two structural icon fallbacks.');
