// The media are original research animations. Progress is playback time,
// not a new simulation or a measurement of physical deployment speed.
const players = new Map();

for (const figure of document.querySelectorAll('[data-animation]')) {
  const videos = [...figure.querySelectorAll('video')];
  const primary = videos[0];
  const controls = figure.querySelector('.animation-controls');
  const play = controls.querySelector('[data-play]');
  const reset = controls.querySelector('[data-reset]');
  const range = controls.querySelector('input');
  const output = controls.querySelector('output');
  let request = 0;
  let playing = false;

  const progress = (fraction) => {
    const value = Math.min(100, Math.max(0, fraction * 100));
    range.value = String(value);
    output.value = `${Math.round(value)}%`;
  };
  const pause = () => {
    request += 1;
    playing = false;
    videos.forEach(video => video.pause());
    play.textContent = 'Play';
  };
  const seek = (fraction) => {
    videos.forEach(video => {
      if (Number.isFinite(video.duration)) {
        video.currentTime = fraction * Math.max(0, video.duration - 0.03);
      }
    });
    progress(fraction);
  };
  const fallback = () => {
    pause();
    controls.hidden = true;
    videos.forEach(video => { video.controls = true; });
  };

  play.addEventListener('click', async () => {
    if (playing) { pause(); return; }
    if (primary.ended || primary.currentTime >= primary.duration - 0.05) seek(0);
    const token = ++request;
    playing = true;
    play.textContent = 'Pause';
    try {
      await Promise.all(videos.map(video => video.play()));
      if (token !== request && !playing) videos.forEach(video => video.pause());
    } catch {
      if (token === request) fallback();
    }
  });
  reset.addEventListener('click', () => { pause(); seek(0); });
  range.addEventListener('input', () => { pause(); seek(Number(range.value) / 100); });
  primary.addEventListener('timeupdate', () => {
    if (playing && primary.duration) progress(primary.currentTime / primary.duration);
  });
  primary.addEventListener('ended', () => { pause(); progress(1); });

  const enhance = () => {
    if (!videos.every(video => Number.isFinite(video.duration) && video.duration > 0)) return;
    videos.forEach(video => { video.controls = false; });
    controls.hidden = false;
  };
  videos.forEach(video => {
    video.addEventListener('loadedmetadata', enhance);
    video.addEventListener('error', fallback);
  });
  enhance();
  players.set(figure, { pause });
}

const selector = document.querySelector('.example-selector');
const panels = [...document.querySelectorAll('[data-example-panel]')];
if (selector && panels.length) {
  const select = (name) => {
    panels.forEach(panel => {
      panel.hidden = panel.dataset.examplePanel !== name;
      if (panel.hidden) players.get(panel)?.pause();
    });
    selector.querySelectorAll('[data-example]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.example === name));
    });
  };
  selector.addEventListener('click', event => {
    const button = event.target.closest('[data-example]');
    if (button) select(button.dataset.example);
  });
  select('dome');
  selector.hidden = false;
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) players.forEach(player => player.pause());
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) players.get(entry.target)?.pause();
    });
  });
  players.forEach((_, figure) => observer.observe(figure));
}
