import { kreslingMarkup } from './kresling.js';
import { kirigamiMarkup } from './kirigami.js';

export function mountStructureIcons() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-structure]').forEach(button => {
    const mesh = button.querySelector('[data-structure-mesh]');
    const markup = button.dataset.structure === 'kresling' ? kreslingMarkup : kirigamiMarkup;
    let amount = 0, target = 0, frame = 0, timer = 0;
    let hovered = false, focused = false, held = false, pulse = false;
    const draw = value => {
      amount = value;
      mesh.innerHTML = markup(value);
      button.dataset.deformation = value.toFixed(3);
    };
    const moveTo = value => {
      target = value;
      cancelAnimationFrame(frame);
      if (reducedMotion.matches || Math.abs(amount - value) < .001) { draw(value); return; }
      const from = amount, start = performance.now(), duration = value > amount ? 280 : 380;
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        draw(from + (value - from) * (1 - (1 - t) ** 3));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const update = () => moveTo(held || pulse ? 1 : hovered || focused ? .85 : 0);
    const reset = () => {
      hovered = focused = held = pulse = false;
      clearTimeout(timer);
      moveTo(0);
    };
    draw(0);
    button.disabled = false;
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      hovered = true;
      update();
    });
    button.addEventListener('pointerleave', () => {
      hovered = held = pulse = false;
      clearTimeout(timer);
      update();
    });
    button.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      held = true;
      clearTimeout(timer);
      pulse = false;
      update();
    });
    button.addEventListener('pointerup', () => { held = false; update(); });
    button.addEventListener('pointercancel', reset);
    button.addEventListener('focus', () => { focused = button.matches(':focus-visible'); update(); });
    button.addEventListener('blur', reset);
    // Native button clicks include touch taps and Enter/Space activation.
    button.addEventListener('click', () => {
      clearTimeout(timer);
      held = false;
      pulse = true;
      update();
      timer = setTimeout(() => { pulse = false; update(); }, 500);
    });
    window.addEventListener('blur', reset);
    window.addEventListener('pagehide', reset);
    document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
    reducedMotion.addEventListener('change', () => {
      cancelAnimationFrame(frame);
      draw(target);
    });
  });
}
