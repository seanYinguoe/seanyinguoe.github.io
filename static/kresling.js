// Illustrative height–twist interpolation, not a rigid-folding or force model.
const TAU = 2 * Math.PI;
export function kreslingState(compression = 0) {
  const amount = Math.max(0, Math.min(1, compression));
  return { compression: amount, sides: 6, radius: 18, height: 29 - 20 * amount, twist: (24 + 42 * amount) * Math.PI / 180 };
}
export function kreslingMarkup(compression = 0) {
  const { sides, radius, height, twist } = kreslingState(compression);
  const yaw = -.28;
  const ring = (z, angle) => Array.from({ length: sides }, (_, i) => {
    const a = TAU * i / sides + angle;
    return [radius * Math.cos(a), radius * Math.sin(a), z];
  });
  const bottom = ring(-height / 2, 0), top = ring(height / 2, twist);
  const depth = ([x, y]) => x * Math.sin(yaw) + y * Math.cos(yaw);
  const project = ([x, y, z]) => [24 + x * Math.cos(yaw) - y * Math.sin(yaw), 24 + .32 * depth([x, y]) - .94 * z];
  const point = vertex => project(vertex).map(n => n.toFixed(2)).join(',');
  const points = vertices => vertices.map(point).join(' ');
  const panels = Array.from({ length: sides }, (_, i) => {
    const j = (i + 1) % sides;
    const vertices = [bottom[i], bottom[j], top[j], top[i]];
    return { i, j, vertices, depth: vertices.reduce((sum, p) => sum + depth(p), 0) / 4 };
  }).sort((a, b) => a.depth - b.depth);
  const sidesMarkup = panels.map(({ i, j, vertices }) => `
    <polygon points="${points(vertices)}" fill="#fafafa"/>
    <polygon points="${points([bottom[i], bottom[j], top[i]])}" fill="#e9e9e7"/>
    <path d="M${point(bottom[i])}L${point(bottom[j])}L${point(top[j])}L${point(top[i])}Z" fill="none" stroke="#333" stroke-width="1.15" stroke-linejoin="round"/>
    <path d="M${point(bottom[j])}L${point(top[i])}" fill="none" stroke="#777" stroke-width=".95" stroke-dasharray="2 1.65"/>`).join('');
  return `${sidesMarkup}<polygon points="${points(top)}" fill="#fff" stroke="#333" stroke-width="1.15" stroke-linejoin="round"/>`;
}
