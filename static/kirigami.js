// Four counter-rotating square units joined at their corners.
export function kirigamiSquares(deployment = 0) {
  const amount = Math.max(0, Math.min(1, deployment));
  const angle = (7 + 31 * amount) * Math.PI / 180;
  const half = 5.8;
  const spacing = half * (Math.cos(angle) + Math.sin(angle));
  return [[-1,-1], [1,-1], [-1,1], [1,1]].map(([x,y]) => {
    const a = x * y * angle, c = Math.cos(a), s = Math.sin(a);
    return [[-half,-half], [half,-half], [half,half], [-half,half]].map(([u,v]) => [
      24 + x * spacing + u * c - v * s,
      24 + y * spacing + u * s + v * c
    ]);
  });
}
export function kirigamiMarkup(deployment = 0) {
  return kirigamiSquares(deployment).map((vertices, i) =>
    `<polygon points="${vertices.map(p => p.map(n => n.toFixed(2)).join(',')).join(' ')}" fill="${i % 3 ? '#f8f8f6' : '#e9e9e7'}" stroke="#444" stroke-width="1.5" stroke-linejoin="round"/>`
  ).join('');
}
