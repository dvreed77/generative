import { canvasSketch, ISettings } from "rapid-sketch";
import { polylineToSVGPath, pathsToSVG } from "../utils/svg/toSVG2";
import { Point } from "../api";
import { drawPath } from "../utils/drawPath";
import { mapRange } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";

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

    const nr = simplex.noise2D(sx, sy) * 10;

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

    const paths = [];
    for (let i = 0; i < 600; i++) {
      const x0 = random.range(0, width);
      const y0 = random.range(0, height);

      const spacing = random.range(10, 15);
      const maxRadius = random.range(20, 40);
      const cycles = random.range(1, 5);
      const startAngle = random.range(0, 2 * Math.PI);

      const lineWidth = mapRange(y0, 0, height, 1, 3);

      const c = 40;
      const color = `hsl(${mapRange(x0, 0, width, 0, 50, true)},90%,${mapRange(
        y0,
        0,
        height,
        50,
        60,
        true
      )}%, .8)`;

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
    }

    return pathsToSVG(
      [
        { paths: paths.slice(0, 200), id: "1" },
        { paths: paths.slice(200, 400), id: "2" },
        { paths: paths.slice(400, 600), id: "3" },
        // { paths: paths3, id: "3" },
        // { paths: paths4, id: "4" },
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
