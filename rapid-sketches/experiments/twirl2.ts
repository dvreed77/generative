import { canvasSketch, ISettings } from "rapid-sketch";
import { polylineToSVGPath, pathsToSVG } from "../utils/svg/toSVG2";
import { Point } from "../api";
import { drawPath } from "../utils/drawPath";
import { drawPt } from "../utils/drawPt";
import { mapRange } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { samples } from "../utils/poissonSampling";
const simplex = new SimplexNoise(Math.random);

const settings: ISettings = {
  dimensions: [1000, 1000],
};

function genTwirl(x0, y0, nCycles, spacing, maxRadius, startAngle, dir) {
  const minRadius = Math.max(maxRadius - spacing * nCycles, 10);
  const path = [];
  const ptsPerCycle = 100;
  const nPts = nCycles * ptsPerCycle;

  const sx0 = 100 * random.value();
  const sy0 = 100 * random.value();
  for (let i = 0; i < nPts; i++) {
    const r = mapRange(i, 0, nPts, maxRadius, minRadius);
    const angle = (i * 2 * Math.PI) / ptsPerCycle;

    const sr = 0.2;
    const sx = sx0 + sr * Math.cos(angle);
    const sy = sy0 + sr * Math.sin(angle);

    // const nr = simplex.noise2D(sx, sy) * 10;
    const nr = 0;

    let a;

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

canvasSketch(() => {
  return ({ context, width, height }) => {
    const line = [
      [400, 100],
      [100, 900],
    ] as Point[];

    const ts = Array.from({ length: 10 })
      .map((d) => random.value())
      .sort();

    // Poisson Random Sampling
    // Needs help
    const t3 = samples([0, 1], 30);

    const ts5 = [];
    for (let i = 0; i < 30; i++) {
      ts5.push(t3.next().value);
    }

    ts5.sort();
    //**********

    const newArray = [];
    const ts2 = ts5.reduce(function (a, t, i) {
      const dx = t * (line[1][0] - line[0][0]);
      const dy = t * (line[1][1] - line[0][1]);

      const d = Math.sqrt(dx * dx + dy * dy);
      console.log("AAA", t, a, d, d - a);
      return (newArray[i] = d - a);
    }, 0);

    console.log("NA", newArray);

    for (let i = 0; i < ts5.length; i++) {
      const t = ts5[i];
      // const r = newArray[i];
      // const r = random.range(10, 50);
      const r = mapRange(simplex.noise2D(t, 0), -1, 1, 10, 50);
      console.log(r);
      const pt = [
        line[0][0] + t * (line[1][0] - line[0][0]),
        line[0][1] + t * (line[1][1] - line[0][1]),
      ] as Point;

      // drawPt(context, pt);

      const a = Math.atan2(-(line[1][0] - line[0][0]), line[1][1] - line[0][1]);

      const a2 = a + Math.PI;

      const dx = r * Math.cos(a);
      const dy = r * Math.sin(a);

      const twirl = genTwirl(pt[0] + dx, pt[1] + dy, 3, 10, r, a2, "cw");

      drawPath(context, twirl);
    }

    // for (let i = 0; i < 10; i++) {
    //   const t = random.value();

    //   const r = random.range(50, 80);

    //   const pt = [
    //     line[0][0] + t * (line[1][0] - line[0][0]),
    //     line[0][1] + t * (line[1][1] - line[0][1]),
    //   ] as Point;

    //   const a = Math.atan2(-(line[1][0] - line[0][0]), line[1][1] - line[0][1]);

    //   const a2 = a + Math.PI;

    //   const dx = r * Math.cos(a2);
    //   const dy = r * Math.sin(a2);

    //   const twirl = genTwirl(pt[0] + dx, pt[1] + dy, 3, 10, r, a, "ccw");

    //   drawPath(context, twirl);
    // }

    drawPath(context, line);
  };
}, settings);
