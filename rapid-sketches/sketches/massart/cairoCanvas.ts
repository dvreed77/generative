const { createCanvas, loadImage } = require("canvas");

import { range } from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";
import { pathsToSVG } from "../../utils/svg/writeSVG";
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
import random from "canvas-sketch-util/random";

console.time("start");
const data = exquisiteConsequencesData
  .map((d) => {
    try {
      return {
        bezierShape: JSON.parse(d.bezierShape),
        stroke: JSON.parse(d.stroke),
        color: d.color,
      };
    } catch {}
  })
  .filter((d) => d && d.stroke.length);
const strokeData = data.map((d) => d.stroke);

const simplex = new SimplexNoise(Math.random);

const PADDING = 20;
const PAPER_WIDTH = 1000;
const PAPER_HEIGHT = 1000;
const CANVAS_WIDTH = PAPER_WIDTH - 2 * PADDING;
const CANVAS_HEIGHT = PAPER_HEIGHT - 2 * PADDING;
const SPACING = 10;
const NOISE_STEP = 0.01;
const LINE_WIDTH = 1;

const nCols = Math.ceil(CANVAS_WIDTH / SPACING);
const nRows = Math.ceil(CANVAS_HEIGHT / SPACING);

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

function genPath(grid, dd = 0.5 * SPACING): Point[] {
  const x = range(PADDING, PADDING + CANVAS_WIDTH);
  const y = range(PADDING, PADDING + CANVAS_HEIGHT);

  const path: Point[] = [[x, y]];

  for (let i = 1; i < 40; i++) {
    const [x, y] = path[i - 1];
    const a = lookup(grid, x, y);
    const dx = dd * Math.cos(a);
    const dy = dd * Math.sin(a);

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

const canvas = createCanvas(PAPER_WIDTH, PAPER_HEIGHT);
const context = canvas.getContext("2d");

context.globalCompositeOperation = "overlay";

const grid = genGrid();
let k = 0;
const c = Color("red");
for (let i = 0; i < 2000; i++) {
  const path = genPath(grid, 4 * SPACING);
  for (let j = 1; j < path.length; j++) {
    const refLine = [path[j - 1], path[j]];
    const stroke = convertStroke(refLine, strokeData[k++ % strokeData.length]);

    drawPath(context, stroke, {
      // strokeColor: c.alpha(0.1).toString(),
      strokeColor: Color("#eee").alpha(0.5).toString(),
      lineWidth: 3,
      fillColor: null,
    });
  }
}
context.globalCompositeOperation = "multiply";
for (let i = 0; i < 2000; i++) {
  const path = genPath(grid);
  for (let j = 1; j < path.length; j++) {
    const refLine = [path[j - 1], path[j]];
    const stroke = convertStroke(refLine, strokeData[k++ % strokeData.length]);

    drawPath(context, stroke, {
      strokeColor: c.rotate(random.range(-60, 60)).alpha(0.5).toString(),
      lineWidth: LINE_WIDTH,
      fillColor: null,
    });
  }
}

context.globalCompositeOperation = "destination-over";
context.fillStyle = "white";
context.fillRect(0, 0, PAPER_WIDTH, PAPER_HEIGHT);

const fs = require("fs");
const out = fs.createWriteStream(__dirname + "/test.png");
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on("finish", () => console.log("The PNG file was created."));
console.timeEnd("start");
