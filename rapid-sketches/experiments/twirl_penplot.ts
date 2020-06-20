import { canvasSketch, ISettings } from "rapid-sketch";
import { polylineToSVGPath, pathsToSVG } from "../utils/svg/toSVG2";
import { Point } from "../api";
import { drawPath } from "../utils/drawPath";
import { mapRange, clamp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { mydist } from "../utils/mydist";
import { randomPareto } from "d3-random";

const simplex = new SimplexNoise(Math.random);

const settings: ISettings = {
  dimensions: [11, 8.5],
  pixelsPerInch: 300,
  units: "in",
};

function genTwirl(x0, y0, nCycles, spacing, maxRadius, startAngle, dir) {
  const minRadius = Math.max(maxRadius - spacing * nCycles, 0.1);
  const path = [];
  const ptsPerCycle = 100;
  const nPts = nCycles * ptsPerCycle;

  const sx0 = 100 * random.value();
  const sy0 = 100 * random.value();
  for (let i = 0; i < nPts; i++) {
    const r = mapRange(i, 0, nPts, maxRadius, minRadius);
    const angle = (i * 2 * Math.PI) / ptsPerCycle;

    const sr = 0.3;
    const sx = sx0 + sr * Math.cos(angle);
    const sy = sy0 + sr * Math.sin(angle);

    const nr = simplex.noise2D(sx, sy) * 0.1;
    // const nr = 0;

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
    context.globalCompositeOperation = "multiply";

    const rGen = randomPareto(0.6);
    const padding = 0.7;
    const paths1 = [];
    for (let i = 0; i < 200; i++) {
      const x0 = mapRange(
        mydist(0, random.value()),
        0,
        1,
        padding,
        width - padding
      );

      const y0 = random.range(padding, height - padding);

      const spacing = random.range(0.1, 0.15);
      const maxRadius = random.range(0.3, 0.5);
      const cycles = random.range(1, 5);
      const startAngle = random.range(0, 2 * Math.PI);

      const lineWidth = 0.03;

      const color = "blue";

      const path = genTwirl(
        x0,
        y0,
        cycles,
        spacing,
        maxRadius,
        startAngle,
        random.pick(["cw", "ccw"])
      );
      drawPath(context, path, { lineWidth, strokeColor: color });
      paths1.push(path);
    }

    const paths2 = [];
    for (let i = 0; i < 200; i++) {
      const x0 = mapRange(
        mydist(0, random.value()),
        0,
        1,
        width - padding,
        padding
      );

      const y0 = random.range(padding, height - padding);

      const spacing = random.range(0.1, 0.15);
      const maxRadius = random.range(0.3, 0.5);
      const cycles = random.range(1, 5);
      const startAngle = random.range(0, 2 * Math.PI);

      const lineWidth = 0.03;

      const color = "red";

      const path = genTwirl(
        x0,
        y0,
        cycles,
        spacing,
        maxRadius,
        startAngle,
        random.pick(["cw", "ccw"])
      );
      drawPath(context, path, { lineWidth, strokeColor: color });
      paths2.push(path);
    }

    return pathsToSVG(
      [
        { paths: paths1, id: "1" },
        { paths: paths2, id: "2" },
      ],
      {
        width,
        height,
        pixelsPerInch: 300,
        units: "in",
      }
    );
  };
}, settings);
