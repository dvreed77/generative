import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";

export function genTwirl(
  x0: number,
  y0: number,
  minRadius: number,
  maxRadius: number,
  spacing: number,
  startAngle: number,
  dir: "cw" | "ccw",
  ptsPerCycle = 100
) {
  // const minRadius = Math.max(maxRadius - spacing * nCycles, 0.01);
  // const spacing = 0.05;
  const nCycles = (maxRadius - minRadius) / spacing;
  const path = [];
  const nPts = nCycles * ptsPerCycle;

  const sx0 = 100 * random.value();
  const sy0 = 100 * random.value();
  for (let i = 0; i < nPts; i++) {
    const r = math.mapRange(i, 0, nPts, maxRadius, minRadius);
    const angle = (i * 2 * Math.PI) / ptsPerCycle;

    const sr = 0.2;
    // const sx = sx0 + sr * Math.cos(angle);
    // const sy = sy0 + sr * Math.sin(angle);

    // const nr = simplex.noise2D(sx, sy) * 0.1;
    const nr = 0;

    let a: number;

    if (dir === "cw") {
      a = startAngle + angle;
    } else {
      a = startAngle - angle;
    }
    const x = x0 + (r + nr) * Math.cos(a);
    const y = y0 + (r + nr) * Math.sin(a);
    path.push([x, y]);
  }

  return path;
}
