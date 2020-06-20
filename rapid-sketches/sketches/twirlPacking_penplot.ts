import { canvasSketch, ISettings } from "rapid-sketch";
import { drawPath } from "../utils/drawPath";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";

import SimplexNoise from "simplex-noise";
import { pathsToSVG } from "../utils/svg/toSVG2";
import { Point } from "../utils/types";
import { schemeCategory10 } from "d3";

const simplex = new SimplexNoise(Math.random);

const settings: ISettings = {
  dimensions: [11, 8.5],
  pixelsPerInch: 300,
  units: "in",
};

interface Circle {
  x: number;
  y: number;
  r: number;
}

function drawCircle(
  context,
  circle: Circle,
  { lineWidth = 1, strokeColor = "red" } = {}
) {
  context.beginPath();
  context.moveTo(circle.x + circle.r, circle.y);
  context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeColor;
  context.stroke();
}

function edges([x0, x1, y0, y1], { x, y, r }: Circle) {
  const a = x + r > x1;
  const b = x - r < x0;
  const c = y + r > y1;
  const d = y - r < y0;

  return a || b || c || d;
}

function growCircle(bounds, circles, c: Circle, maxR) {
  let grow = true;
  while (!edges(bounds, c) && !isOverlapping(circles, c) && grow) {
    c.r += 0.01;
    if (maxR && c.r >= maxR) {
      grow = false;
    }
  }
  return c;
}

function isOverlapping(circles: Circle[], c: Circle) {
  let overlapping = false;
  for (let circle of circles) {
    const d = Math.sqrt(
      Math.pow(c.x - circle.x, 2) + Math.pow(c.y - circle.y, 2)
    );
    if (d < circle.r + c.r) {
      overlapping = true;
      break;
    }
  }
  return overlapping;
}

function newCircle(boundingBox, circles: Circle[], minRadius: number) {
  let cOut;
  for (let i = 0; i < 100; i++) {
    const c = {
      x: random.range(boundingBox[0], boundingBox[1]),
      y: random.range(boundingBox[2], boundingBox[3]),
      r: minRadius,
    };

    let valid = true;
    for (let circle of circles) {
      const d = Math.sqrt(
        Math.pow(c.x - circle.x, 2) + Math.pow(c.y - circle.y, 2)
      );
      if (d < circle.r + c.r) {
        valid = false;
        break;
      }
    }
    if (valid) {
      cOut = c;
      break;
    }
  }

  return cOut;
}

function genTwirl(
  x0: number,
  y0: number,
  minRadius: number,
  maxRadius: number,
  spacing: number,
  startAngle: number,
  dir: "cw" | "ccw"
) {
  // const minRadius = Math.max(maxRadius - spacing * nCycles, 0.01);
  // const spacing = 0.05;
  const nCycles = (maxRadius - minRadius) / spacing;
  const path = [];
  const ptsPerCycle = 100;
  const nPts = nCycles * ptsPerCycle;

  const sx0 = 100 * random.value();
  const sy0 = 100 * random.value();
  for (let i = 0; i < nPts; i++) {
    const r = math.mapRange(i, 0, nPts, maxRadius, minRadius);
    const angle = (i * 2 * Math.PI) / ptsPerCycle;

    const sr = 0.2;
    const sx = sx0 + sr * Math.cos(angle);
    const sy = sy0 + sr * Math.sin(angle);

    // const nr = simplex.noise2D(sx, sy) * 0.1;
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
    const maxR = 0.8;
    const totalPaths = 2000;

    const circles = [];
    for (let i = 0; i < totalPaths; i++) {
      const c = newCircle(
        [0.75, width - 0.75, 0.75, height - 0.75],
        circles,
        0.02
      );
      if (c) {
        const c2 = growCircle(
          [0.75, width - 0.75, 0.75, height - 0.75],
          circles,
          c,
          maxR
        );
        circles.push(c2);
        // drawCircle(context, c2, { lineWidth: 0.03 });
      }
    }

    const paths = [];
    for (let circle of circles) {
      const path = genTwirl(
        circle.x,
        circle.y,
        0.01,
        circle.r,
        math.mapRange(circle.r, 0, maxR, 0.02, 0.1),
        random.range(0, 2 * Math.PI),
        random.pick(["cw", "ccw"])
      );
      paths.push(path);
    }

    const pathsShuffled = random.shuffle(paths);

    const groups = [];
    const nGroups = 5;
    for (let i = 0; i < nGroups; i++) {
      const startIdx = (i * totalPaths) / nGroups;
      const endIdx = ((i + 1) * totalPaths) / nGroups;
      const paths = pathsShuffled.slice(startIdx, endIdx);
      const strokeColor = schemeCategory10[i];
      paths.forEach((path) =>
        drawPath(context, path, { lineWidth: 0.015, strokeColor })
      );

      groups.push({
        paths,
        id: `g${i}`,
      });
    }

    return pathsToSVG(groups, {
      width,
      height,
      pixelsPerInch: 300,
      units: "in",
    });
  };
}, settings);
