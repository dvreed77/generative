import { canvasSketch, ISettings } from "rapid-sketch";
import { svg as violetSVG } from "./violet";
import { drawPath } from "../../utils/drawPath";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { pointInPolygon } from "../../utils/pointInPolygon";
import { pointLineSegmentDistance } from "../../utils/pointLineSegmentDistance";
import { schemeCategory10 } from "d3";
import { pathsToSVG } from "../../utils/svg/writeSVG";
import { getBoundingBox } from "../../utils/getBoundingBox";
import { Circle, Point } from "../../utils/types";
import { svgToPaths } from "../../utils/svg/readSVG";
import {
  lineSegmentTree,
  TreeNode,
  PathTree,
} from "../../utils/lineSegmentTree";
import { drawCircle } from "../../utils/drawCircle";
import { circlePathIntersection } from "../../utils/circlePathIntersection";
import { drawExtent } from "../../utils/drawExtent";
import { quadtree, Quadtree, QuadtreeLeaf } from "d3-quadtree";
import { genTwirl } from "../../utils/genTwirl";

function edges(extent: Point[], { x, y, r }: Circle) {
  const a = x + r > extent[1][0];
  const b = x - r < extent[0][0];
  const c = y + r > extent[1][1];
  const d = y - r < extent[0][1];

  return a || b || c || d;
}

function circleTouchesPath(pathTree: PathTree, c: Circle) {
  return circlePathIntersection(pathTree.root, c);
}

function polygonEdges(polygon) {
  return polygon.map(function (p, i) {
    return i ? [polygon[i - 1], p] : [polygon[polygon.length - 1], p];
  });
}

function intersects(circle, polygon) {
  return (
    pointInPolygon(circle, polygon) ||
    polygonEdges(polygon).some(function (line) {
      return pointLineSegmentDistance(circle, line) < circle[2];
    })
  );
}

function circleTouchesCircle(circleTree: Quadtree<Circle>, c: Circle, maxR) {
  const candidates = [];
  circleTree.visit((node, x0, y0, x1, y1) => {
    const i = intersects(
      [c.x, c.y, 2 * maxR],
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ]
    );

    if (i) {
      if (!node.length) {
        candidates.push((node as QuadtreeLeaf<Circle>).data);
      }
      return false;
    } else {
      return true;
    }
  });

  let overlapping = false;
  for (let circle of candidates) {
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

function circleInsideCircle(circleTree: Quadtree<Circle>, c: Circle, maxR) {
  const candidates = [];
  circleTree.visit((node, x0, y0, x1, y1) => {
    const i = intersects(
      [c.x, c.y, 2 * maxR],
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ]
    );

    if (i) {
      if (!node.length) {
        candidates.push((node as QuadtreeLeaf<Circle>).data);
      }
      return false;
    } else {
      return true;
    }
  });

  let inside = false;
  for (let circle of candidates) {
    const d = Math.sqrt(
      Math.pow(c.x - circle.x, 2) + Math.pow(c.y - circle.y, 2)
    );
    if (d < circle.r + c.r) {
      inside = true;
      break;
    }
  }
  return inside;
}

function growCircle(
  extent: Point[],
  pathTree: PathTree,
  circleTree: Quadtree<Circle>,
  c: Circle,
  maxR: number
) {
  let grow = true;
  let idx = 0;
  while (
    !edges(extent, c) &&
    !circleTouchesCircle(circleTree, c, maxR) &&
    !circleTouchesPath(pathTree, c) &&
    // idx < 100 &&
    grow
  ) {
    c.r += 0.01;
    if (maxR && c.r >= maxR) {
      grow = false;
    }
    idx++;
  }
  return c;
}

function newCircle(
  extent: Point[],
  pathTree: PathTree,
  circleTree: Quadtree<Circle>,
  minRadius: number,
  maxRadius: number
) {
  let cOut: Circle;

  trialLoop: for (let i = 0; i < 100; i++) {
    const c = {
      x: random.range(extent[0][0], extent[1][0]),
      y: random.range(extent[0][1], extent[1][1]),
      r: minRadius,
    };

    let valid = true;

    if (circleInsideCircle(circleTree, c, maxRadius)) {
      continue trialLoop;
    }

    for (let path of pathTree.paths) {
      if (pointInPolygon([c.x, c.y], path)) {
        valid = false;
        continue trialLoop;
      }
    }

    if (valid) {
      cOut = c;
      break trialLoop;
    }
  }

  return cOut;
}

function newCircle2(
  path: Point[],
  circleTree: Quadtree<Circle>,
  minRadius: number,
  maxRadius: number
) {
  let cOut: Circle;

  const boundingBox = getBoundingBox(path);
  trialLoop: for (let i = 0; i < 100; i++) {
    const c = {
      x: random.range(boundingBox[0][0], boundingBox[1][0]),
      y: random.range(boundingBox[0][1], boundingBox[1][1]),
      r: minRadius,
    };

    let valid = true;

    if (!pointInPolygon([c.x, c.y], path)) continue trialLoop;

    if (circleInsideCircle(circleTree, c, maxRadius)) {
      continue trialLoop;
    }

    if (valid) {
      cOut = c;
      break trialLoop;
    }
  }
  return cOut;
}

const settings: ISettings = {
  dimensions: [11, 8.5],
  pixelsPerInch: 300,
  units: "in",
};

canvasSketch(() => {
  const minR = 0.01;
  const maxR = 0.4;
  const totalCircles = 1000;
  const padding = 0.75;

  return ({ context, width, height }) => {
    // Setup BoundingBox
    const boundingBox = [
      [padding, padding],
      [width - padding, height - padding],
    ] as Point[];

    // Get and Draw Letter Paths
    const violetLetterPaths = svgToPaths(violetSVG);
    for (let i = 0; i < violetLetterPaths.length; i++) {
      drawPath(context, violetLetterPaths[i], {
        lineWidth: 0.015,
      });
    }

    // Paths to PathTree
    const pathTree = new PathTree(violetLetterPaths);

    // Circle Quadtree
    const circleTree = quadtree<Circle>()
      .x((d) => d.x)
      .y((d) => d.y);

    for (let i = 0; i < 3000; i++) {
      const c = newCircle(boundingBox, pathTree, circleTree, minR, maxR);

      if (c) {
        const c2 = growCircle(boundingBox, pathTree, circleTree, c, maxR);

        circleTree.add(c2);

        // drawCircle(context, c2, { lineWidth: 0.015 });
      }
    }

    const oPath = violetLetterPaths.find((_, idx) => idx === 4);
    const oPathTree = new PathTree(violetLetterPaths);
    for (let i = 0; i < 100; i++) {
      const c = newCircle2(oPath, circleTree, minR, maxR);

      if (c) {
        const c2 = growCircle(boundingBox, oPathTree, circleTree, c, maxR);

        circleTree.add(c2);

        // drawCircle(context, c2, { lineWidth: 0.015 });
      }
    }

    const ePath = violetLetterPaths.find((_, idx) => idx === 7);
    const ePathTree = new PathTree(violetLetterPaths);
    for (let i = 0; i < 20; i++) {
      const c = newCircle2(ePath, circleTree, minR, maxR);

      if (c) {
        const c2 = growCircle(boundingBox, ePathTree, circleTree, c, maxR);

        circleTree.add(c2);

        // drawCircle(context, c2, { lineWidth: 0.015 });
      }
    }

    const paths = [];
    const circles = circleTree.data();
    for (let circle of circles) {
      const path = genTwirl(
        circle.x,
        circle.y,
        minR,
        circle.r,
        math.mapRange(circle.r, 0, maxR, 0.02, 0.06),
        random.range(0, 2 * Math.PI),
        random.pick(["cw", "ccw"])
      );
      paths.push(path);
    }

    const pathsShuffled = random.shuffle(paths);

    const groups = [];
    const nGroups = 5;
    for (let i = 0; i < nGroups; i++) {
      const startIdx = (i * circles.length) / nGroups;
      const endIdx = ((i + 1) * circles.length) / nGroups;
      const paths = pathsShuffled.slice(startIdx, endIdx);
      const strokeColor = schemeCategory10[i];
      paths.forEach((path) => {
        if (path.length) {
          drawPath(context, path, { lineWidth: 0.015, strokeColor });
        }
      });

      groups.push({
        paths,
        id: `g${i}`,
      });
    }

    groups.push({
      paths: violetLetterPaths,
      id: "violet",
    });

    return pathsToSVG(groups, {
      width,
      height,
      pixelsPerInch: 300,
      units: "in",
    });
  };
}, settings);
