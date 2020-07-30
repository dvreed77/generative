import { canvasSketch, ISettings } from "rapid-sketch";
import { drawPath } from "../utils/drawPath";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import SimplexNoise from "simplex-noise";

const simplex = new SimplexNoise(Math.random);

const settings: ISettings = {
  dimensions: [800, 800],
  name: "twirlPacking",
};

interface Circle {
  x: number;
  y: number;
  r: number;
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
    c.r += 1;
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
    if (d < circle.r + c.r + 2) {
      overlapping = true;
      break;
    }
  }
  return overlapping;
}

function newCircle(boundingBox, circles) {
  let cOut;
  for (let i = 0; i < 100; i++) {
    const c = {
      x: random.range(boundingBox[0], boundingBox[1]),
      y: random.range(boundingBox[2], boundingBox[3]),
      r: 10,
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

function genTwirl(x0, y0, nCycles, spacing, maxRadius, startAngle, dir) {
  const minRadius = Math.max(maxRadius - spacing * nCycles, 0.1);
  const path = [];
  const ptsPerCycle = 100;
  const nPts = nCycles * ptsPerCycle;

  const sx0 = 100 * random.value();
  const sy0 = 100 * random.value();
  for (let i = 0; i < nPts; i++) {
    const r = math.mapRange(i, 0, nPts, maxRadius, minRadius);
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
    const path = [
      [200, 200],
      [500, 400],
      [500, 800],
      [300, 700],
    ] as Point[];

    // const c = {
    //   x: random.range(0, width),
    //   y: random.range(0, height),
    //   r: 20,
    // };

    // const c2 = growCircle([0, width, 0, height], c);

    const circles = [];
    for (let i = 0; i < 200; i++) {
      const c = newCircle([0, width, 0, height], circles);
      if (c) {
        const c2 = growCircle([0, width, 0, height], circles, c, 100);
        circles.push(c2);
        // drawCircle(context, c2);
      }
    }

    for (let circle of circles) {
      const path = genTwirl(
        circle.x,
        circle.y,
        random.range(1, 5),
        random.range(15, 25),
        circle.r,
        random.range(0, 2 * Math.PI),
        random.pick(["cw", "ccw"])
      );
      drawPath(context, path, {
        lineWidth: 2,
        strokeColor: "blue",
        fillColor: null,
      });
    }

    // drawCircle(context, c2);
  };
}, settings);
