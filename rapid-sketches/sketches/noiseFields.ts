import { canvasSketch, ISettings, ISketch } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { pathsToSVG } from "../utils/svg/writeSVG";
import { drawPath } from "../utils/drawPath";
import { Point } from "../utils/types";

const simplex = new SimplexNoise("dave");
random.setSeed(0);

const PADDING = {
  left: 0.5,
  right: 3,
  top: 0.5,
  bottom: 0.5,
};
const CANVAS_WIDTH = 5;
const CANVAS_HEIGHT = 5;
const PAPER_WIDTH = CANVAS_WIDTH + PADDING.left + PADDING.right;
const PAPER_HEIGHT = CANVAS_HEIGHT + PADDING.bottom + PADDING.top;
const SPACING = 0.05;
const NOISE_STEP = 0.01;
const LINE_WIDTH = 0.01;

const nCols = Math.ceil(CANVAS_WIDTH / SPACING);
const nRows = Math.ceil(CANVAS_HEIGHT / SPACING);

const settings: ISettings = {
  dimensions: [PAPER_WIDTH, PAPER_HEIGHT],
  pixelsPerInch: 300,
  units: "in",
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
    const x0 = PADDING.left + (i % nCols) * SPACING;
    const y0 = PADDING.top + Math.floor(i / nCols) * SPACING;
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
    Math.floor((y - PADDING.top) / SPACING) * nCols +
    Math.floor((x - PADDING.left) / SPACING);

  return grid[i];
}

function genPath(grid, width, height): Point[] {
  const x = random.range(PADDING.left, PADDING.left + CANVAS_WIDTH);
  const y = random.range(PADDING.top, PADDING.top + CANVAS_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i < 40; i++) {
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);
    const dx = (SPACING / 2) * Math.cos(a);
    const dy = (SPACING / 2) * Math.sin(a);

    const nx = x + dx;
    const ny = y + dy;

    if (
      nx < PADDING.left ||
      nx > CANVAS_WIDTH + PADDING.left ||
      ny < PADDING.top ||
      ny > CANVAS_HEIGHT + PADDING.top
    ) {
      break;
    }
    path.push([x + dx, y + dy]);
  }
  // only return values where both x and y are not NaN
  return path.filter(([x, y]) => !isNaN(x) && !isNaN(y));
}

function calcRefill(x0, y0, r) {
  const path = [];
  for (let i = 0; i < 5; i++) {
    const a = random.range(0, 2 * Math.PI);
    const dx = r * Math.cos(a);
    const dy = r * Math.sin(a);
    path.push([x0 + dx, y0 + dy]);
  }
  return path;
}

const sketch = () => {
  return ({ context, width, height, units }: ISketch) => {
    const grid = genGrid();

    const paths1 = [];
    for (let i = 0; i < 100; i++) {
      const path = genPath(grid, width, height);
      drawPath(context, path, {
        strokeColor: "red",
        lineWidth: LINE_WIDTH,
        fillColor: null,
      });

      // refill
      if (i % 20 === 0) {
        const waterPath = calcRefill(PADDING.left + CANVAS_WIDTH + 1.5, 1.5, 1);

        const refillPath = calcRefill(
          PADDING.left + CANVAS_WIDTH + 1.5,
          4.5,
          1
        );

        drawPath(context, waterPath, {
          strokeColor: "blue",
          lineWidth: LINE_WIDTH,
          fillColor: null,
        });

        drawPath(context, refillPath, {
          strokeColor: "red",
          lineWidth: LINE_WIDTH,
          fillColor: null,
        });
        paths1.push(waterPath);
        paths1.push(refillPath);
      }

      paths1.push(path);
    }

    // context.strokeRect(PADDING.left + CANVAS_WIDTH, PAPER_HEIGHT - 2, 2, 1);

    // context.strokeRect(PADDING.left + CANVAS_WIDTH, PAPER_HEIGHT - 3.5, 2, 1);

    // context.fillStyle = "red";
    // context.strokeRect(PADDING.left + CANVAS_WIDTH, PAPER_HEIGHT - 5, 2, 1);

    return pathsToSVG(
      [
        { paths: paths1, id: "1" },
        // { paths: [paths2], id: "2" },
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
};

canvasSketch(sketch, settings);
