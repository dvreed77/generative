import { canvasSketch, ISettings } from "rapid-sketch";
import { svg } from "./violet";
import { drawPath } from "../../utils/drawPath";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { pointInPolygon } from "../../utils/pointInPolygon";
import { pointLineSegmentDistance } from "../../utils/pointLineSegmentDistance";
import { schemeCategory10 } from "d3";
import { pathsToSVG } from "../../utils/svg/writeSVG";

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

function loadSVG() {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(svg, "text/xml");

  const svgPaths = xmlDoc.getElementsByTagName("path");

  const paths = [];
  for (let svgPath of svgPaths) {
    const pathLength = svgPath.getTotalLength();
    const nPts = Math.floor(pathLength);

    const path = [];
    for (let i = 0; i < nPts; i++) {
      const pt = svgPath.getPointAtLength((i * pathLength) / (nPts - 1));
      path.push([pt.x, pt.y]);
    }
    paths.push(path);
  }
  return paths;
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
  name: "violet",
};

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
  const minR = 2;
  const maxR = 50;
  const totalCircles = 1000;
  return ({ context, width, height }) => {
    const violetPath = loadSVG();
    for (let path of violetPath) {
      drawPath(context, path, { fillColor: null });
    }

    const circles = [];
    for (let i = 0; i < totalCircles; i++) {
      const c = newCircle([0, width, 0, height], violetPath, circles, minR);
      // drawCircle(context, c);

      if (c) {
        const c2 = growCircle(
          [0, width, 0, height],
          violetPath,
          circles,
          c,
          maxR
        );
        circles.push(c2);
        // drawCircle(context, c2, { lineWidth: 1 });
      }
    }

    const paths = [];
    for (let circle of circles) {
      const path = genTwirl(
        circle.x,
        circle.y,
        minR,
        circle.r,
        // 10,
        math.mapRange(circle.r, 0, maxR, 2, 8),
        random.range(0, 2 * Math.PI),
        random.pick(["cw", "ccw"])
      );
      paths.push(path);
    }

    const pathsShuffled = random.shuffle(paths);

    const groups = [];
    const nGroups = 5;
    for (let i = 0; i < nGroups; i++) {
      const startIdx = (i * totalCircles) / nGroups;
      const endIdx = ((i + 1) * totalCircles) / nGroups;
      const paths = pathsShuffled.slice(startIdx, endIdx);
      const strokeColor = schemeCategory10[i];
      paths.forEach((path) => {
        if (path.length) {
          drawPath(context, path, {
            lineWidth: 1,
            strokeColor,
            fillColor: null,
          });
        }
      });

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
