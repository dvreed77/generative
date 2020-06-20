import { canvasSketch, ISettings } from "rapid-sketch";
import { range } from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { pathsToSVG } from "../utils/svg/writeSVG";
import { drawPath } from "../utils/drawPath";
import { Point } from "../utils/types";

const simplex = new SimplexNoise(Math.random);

const PADDING = 0.5;
const PAPER_WIDTH = 6;
const PAPER_HEIGHT = 6;
const CANVAS_WIDTH = PAPER_WIDTH - 2 * PADDING;
const CANVAS_HEIGHT = PAPER_HEIGHT - 2 * PADDING;
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

function genPath(grid, width, height): Point[] {
  const x = range(PADDING, PADDING + CANVAS_WIDTH);
  const y = range(PADDING, PADDING + CANVAS_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i < 40; i++) {
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);
    const dx = (SPACING / 2) * Math.cos(a);
    const dy = (SPACING / 2) * Math.sin(a);

    const nx = x + dx;
    const ny = y + dy;

    if (
      nx < PADDING ||
      nx > PADDING + CANVAS_WIDTH ||
      ny < PADDING ||
      ny > PADDING + CANVAS_HEIGHT
    ) {
      break;
    }
    path.push([x + dx, y + dy]);
  }
  return path;
}

const sketch = () => {
  return ({ context, width, height, units }) => {
    const grid = genGrid();
    // drawGrid(context, grid);

    const paths1 = [];
    for (let i = 0; i < 100; i++) {
      const path = genPath(grid, width, height);
      drawPath(context, path, {
        strokeColor: "red",
        lineWidth: LINE_WIDTH,
        fillColor: null,
      });
      paths1.push(path);
    }

    const paths2 = [];
    for (let i = 0; i < 100; i++) {
      const path = genPath(grid, width, height);
      drawPath(context, path, {
        strokeColor: "blue",
        lineWidth: LINE_WIDTH,
        fillColor: null,
      });
      paths2.push(path);
    }

    // const paths3 = [];
    // for (let i = 0; i < 200; i++) {
    //   const path = genPath(grid, width, height);
    //   drawPath(context, path);
    //   paths3.push(path);
    // }

    // const paths4 = [];
    // for (let i = 0; i < 200; i++) {
    //   const path = genPath(grid, width, height);
    //   drawPath(context, path);
    //   paths4.push(path);
    // }

    return pathsToSVG(
      [
        { paths: paths1, id: "1" },
        { paths: paths2, id: "2" },
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

    // return [
    //   // Export PNG as first layer
    //   context.canvas,
    //   // Export SVG for pen plotter as second layer
    //   {
    //     data: polylinesToSVG(paths1, {
    //       width,
    //       height,
    //       units,
    //     }),
    //     extension: "layer1.svg",
    //   },
    //   {
    //     data: polylinesToSVG(paths2, {
    //       width,
    //       height,
    //       units,
    //     }),
    //     extension: "layer2.svg",
    //   },
    //   {
    //     data: polylinesToSVG(paths3, {
    //       width,
    //       height,
    //       units,
    //     }),
    //     extension: "layer3.svg",
    //   },
    //   {
    //     data: polylinesToSVG(paths4, {
    //       width,
    //       height,
    //       units,
    //     }),
    //     extension: "layer4.svg",
    //   },
    // ];
  };
};

canvasSketch(sketch, settings);
