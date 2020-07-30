import { canvasSketch, ISettings } from "rapid-sketch";
import { range } from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { drawPath } from "../../utils/drawPath";
import { Point } from "../../utils/types";
import exquisiteConsequencesData from "./exquisiteConsequencesData.json";
import { pointPointSquaredDistance } from "../../utils/distances/pointPointSquaredDistance";
import {
  applyToPoints,
  compose,
  translate,
  rotate,
  scale,
} from "transformation-matrix";
import Color from "color";
import { math, random } from "canvas-sketch-util";
import { quadtree, Quadtree, QuadtreeLeaf } from "d3-quadtree";
import { pathsToSVG } from "../../utils/svg/writeSVG";

// Set an initial random seed
// const randomSeed = random.getRandomSeed();
const randomSeed = 284027;
random.setSeed(randomSeed);

// Log it for later reproducibility
console.log("Random seed: %s", random.getSeed(), randomSeed);

const data = exquisiteConsequencesData.map((d) => {
  let bezierShape;
  try {
    bezierShape = JSON.parse(d.bezierShape);
  } catch {}
  let stroke;
  try {
    stroke = JSON.parse(d.stroke);
  } catch {}

  return {
    bezierShape,
    stroke,
    color: d.color,
  };
});
const strokeData = data
  .filter((d) => d.stroke && d.stroke.length)
  .map((d) => d.stroke);
const bezierData = data
  .filter((d) => d.bezierShape)
  .map(({ bezierShape }) =>
    bezierShape.map(({ pt, armA, armB }) => [pt, armA, armB]).flat()
  );

const simplex = new SimplexNoise(randomSeed);

const PADDING = 20;
const PAPER_WIDTH = 2000;
const PAPER_HEIGHT = 1000;
const CANVAS_WIDTH = PAPER_WIDTH - 2 * PADDING;
const CANVAS_HEIGHT = PAPER_HEIGHT - 2 * PADDING;
const SPACING = 10;
const NOISE_STEP = 0.005;
const LINE_WIDTH = 1;

const nCols = Math.ceil(CANVAS_WIDTH / SPACING);
const nRows = Math.ceil(CANVAS_HEIGHT / SPACING);

const settings: ISettings = {
  dimensions: [PAPER_WIDTH, PAPER_HEIGHT],
};

function genGrid() {
  const grid = [];

  const s = NOISE_STEP;
  for (let j = 0; j < nRows; j++) {
    for (let i = 0; i < nCols; i++) {
      const sx = i * s;
      const sy = j * s;
      const angle = Math.PI * simplex.noise2D(sx, sy);
      grid.push(angle);
    }
  }
  return grid;
}

function drawGrid(context, grid) {
  for (let i = 0; i < grid.length; i++) {
    const x0 = PADDING + (i % nCols) * SPACING;
    const y0 = PADDING + Math.floor(i / nCols) * SPACING;
    const angle = grid[i];

    const dx = (SPACING / 2) * Math.cos(angle);
    const dy = (SPACING / 2) * Math.sin(angle);

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x0 + dx, y0 + dy);
    context.lineWidth = LINE_WIDTH;
    context.stroke();
  }
}

function lookup(grid, x, y) {
  const i =
    Math.floor((y - PADDING) / SPACING) * nCols +
    Math.floor((x - PADDING) / SPACING);

  return grid[i];
}

function convertStroke(refLine, stroke) {
  const [x1, y1] = refLine[0];
  const [x2, y2] = refLine[1];

  const pDist = Math.sqrt(pointPointSquaredDistance([x1, y1], [x2, y2]));

  const [sX, sY] = stroke[0];
  const strokeA = stroke.map(([x, y]) => [x - sX, y - sY]);

  const [xA, yA] = strokeA[0];
  const [xB, yB] = strokeA[stroke.length - 1];
  const strokeDist = Math.sqrt(pointPointSquaredDistance([xA, yA], [xB, yB]));

  const s = pDist / strokeDist;
  const t = [x1 - xA, y1 - yA];
  const r = -Math.atan2(yB - yA, xB - xA) + Math.atan2(y2 - y1, x2 - x1);

  const tMat = compose(translate(x1, y1), rotate(r), scale(s));

  const stroke2A = applyToPoints(tMat, strokeA) as [number, number][];

  return stroke2A;
}

function genPath(
  grid,
  dd = 0.5 * SPACING,
  qTree: Quadtree<[number, number]>
): Point[] {
  const x = range(0, PAPER_WIDTH);
  const y = range(0, PAPER_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i < 40; i++) {
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);
    const dx = dd * Math.cos(a);
    const dy = dd * Math.sin(a);

    const nx = x + dx;
    const ny = y + dy;

    if (qTree.find(nx, ny, dd)) break;

    // if (
    //   nx < PADDING ||
    //   nx > PADDING + CANVAS_WIDTH ||
    //   ny < PADDING ||
    //   ny > PADDING + CANVAS_HEIGHT
    // ) {
    //   break;
    // }

    if (nx < 0 || nx > PAPER_WIDTH || ny < 0 || ny > PAPER_HEIGHT) {
      break;
    }
    path.push([x + dx, y + dy]);
  }
  return path;
}

const sketch = () => {
  return ({ context, width, height, units }) => {
    context.globalCompositeOperation = "screen";

    const qTree = quadtree();

    const grid = genGrid();
    let k = 0;
    const palette = ["#D98B2B", "#D97823", "#D93425", "#A63429"];
    const pathGroups = palette.map((p) => ({ id: p, paths: [] }));

    const paths = [];
    // for (let i = 0; i < 1000; i++) {
    //   const path = genPath(grid, SPACING, qTree);
    //   // console.log(path);
    //   qTree.addAll(path);
    //   paths.push(path);
    //   // for (let j = 1; j < path.length; j++) {
    //   //   const refLine = [path[j - 1], path[j]];
    //   //   const stroke = convertStroke(
    //   //     refLine,
    //   //     strokeData[k++ % strokeData.length]
    //   //   );

    //   //   drawPath(context, stroke, {
    //   //     // strokeColor: c.alpha(0.1).toString(),
    //   //     strokeColor: Color(random.pick(palette))
    //   //       .rotate(math.mapRange(path[0][1], height, 0, -20, 20))
    //   //       .alpha(0.2)
    //   //       .toString(),
    //   //     lineWidth: 4,
    //   //     fillColor: null,
    //   //   });
    //   // }
    //   drawPath(context, path, {
    //     // strokeColor: c.alpha(0.1).toString(),
    //     strokeColor: Color(random.pick(palette))
    //       .rotate(math.mapRange(path[0][1], height, 0, -20, 20))
    //       .alpha(0.2)
    //       .toString(),
    //     lineWidth: 4,
    //     fillColor: null,
    //   });
    // }

    const qTree2 = quadtree();

    context.globalCompositeOperation = "overlay";
    for (let i = 0; i < 2000; i++) {
      const path = genPath(grid, SPACING / 2, qTree2);
      qTree2.addAll(path);
      // paths.push(path);

      const pColor = random.pick(palette);

      pathGroups.find((d) => d.id === pColor).paths.push(path);

      const strokeColor = Color(random.pick(palette))
        .rotate(math.mapRange(path[0][0], 0, width, -20, 20))
        .alpha(0.9)
        .toString();
      // for (let j = 1; j < path.length; j++) {
      //   const refLine = [path[j - 1], path[j]];
      //   const stroke = convertStroke(
      //     refLine,
      //     strokeData[k++ % strokeData.length]
      //   );

      //   drawPath(context, stroke, {
      //     strokeColor,
      //     lineWidth: 2,
      //     fillColor: null,
      //   });
      // }
      drawPath(context, path, {
        strokeColor,
        lineWidth: 2,
        fillColor: null,
      });
    }
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "white";
    context.fillRect(0, 0, PAPER_WIDTH, PAPER_HEIGHT);

    pathGroups.forEach((d) => {
      d.paths = d.paths
        .filter((path) => path.length > 10)
        .map((path) => path.filter(([x, y]) => x && y));
    });
    // const fPaths = paths
    //   .filter((path) => path.length > 10)
    //   .map((path) => path.filter(([x, y]) => x && y));

    return pathsToSVG(pathGroups, {
      width,
      height,
    });
  };
};

canvasSketch(sketch, settings);
