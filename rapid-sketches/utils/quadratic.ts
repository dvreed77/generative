export function quadratic(a, b, c) {
  const z1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  const z2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

  return [z1, z2];
}
