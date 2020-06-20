export type Vector = [number, number];

export function add(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
}

export function subtract(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
}

export function divide(a: Vector, d: number): Vector {
  return [a[0] / d, a[1] / d];
}

export function multiply(a: Vector, d: number): Vector {
  return [a[0] * d, a[1] * d];
}

export function normalize(a: Vector) {
  const md = magnitude(a);
  return divide(a, md);
}

export function average(vs: Vector[]): Vector {
  const tV = vs.reduce((total, curV) => add(total, curV), [0, 0]);

  return divide(tV, vs.length);
}

export function magnitude(a: Vector) {
  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
}
