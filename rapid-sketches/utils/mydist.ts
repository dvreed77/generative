import { quadratic } from "./quadratic";

export function mydist(k, t) {
  const k2 = 1 - k;
  const a = (1 / (-k2 / 2 + 1)) * (-k2 / 2);
  const b = 1 / (-k2 / 2 + 1);
  const c = -t;

  const zs = quadratic(a, b, c);

  return zs.find((d) => d >= 0 && d <= 1);
}
