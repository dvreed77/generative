import { canvasSketch, ISettings } from "rapid-sketch";
import { drawPath } from "../utils/drawPath";
import random from "canvas-sketch-util/random";
import { pointInPolygon } from "../utils/pointInPolygon";
import { pointLineSegmentDistance } from "../utils/pointLineSegmentDistance";

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

function circleTouchesPath(paths, c) {
  let overlapping = false;
  loop1: for (let path of paths) {
    for (let i = 0; i < path.length; i++) {
      const pathSegment = i
        ? [path[i - 1], path[i]]
        : [path[path.length - 1], path[i]];

      if (pointLineSegmentDistance([c.x, c.y], pathSegment) < c.r) {
        overlapping = true;
        break loop1;
      }
    }
  }
  return overlapping;
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

function growCircle(bounds, paths, circles, c: Circle, maxR) {
  let grow = true;
  while (
    !edges(bounds, c) &&
    !isOverlapping(circles, c) &&
    !circleTouchesPath(paths, c) &&
    grow
  ) {
    c.r += 0.01;
    if (maxR && c.r >= maxR) {
      grow = false;
    }
  }
  return c;
}

function newCircle(boundingBox, paths, circles: Circle[], minRadius: number) {
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

    for (let path of paths) {
      if (pointInPolygon([c.x, c.y], path)) {
        valid = false;
      }
    }
    if (valid) {
      cOut = c;
      break;
    }
  }

  return cOut;
}

const settings: ISettings = {
  dimensions: [800, 800],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const shapePaths = [
      [
        [200, 200],
        [600, 300],
        [600, 600],
        [200, 600],
      ],
    ] as Point[][];

    for (let path of shapePaths) {
      drawPath(context, path, { closePath: true });
    }

    const circles = [];
    for (let i = 0; i < 1000; i++) {
      const c = newCircle([0, width, 0, height], shapePaths, circles, 2);
      // drawCircle(context, c);

      if (c) {
        const c2 = growCircle(
          [0, width, 0, height],
          shapePaths,
          circles,
          c,
          50
        );
        circles.push(c2);
        drawCircle(context, c2, { lineWidth: 1 });
      }
    }
  };
}, settings);
