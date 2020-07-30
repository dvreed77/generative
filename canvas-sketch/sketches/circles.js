const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const SimplexNoise = require("simplex-noise");
const math = require("mathjs");
const { polylinesToSVG } = require("canvas-sketch-util/penplot");

import { offsetPolygon } from "./utils/inflatePolygon";

const settings = {
  dimensions: [11, 8.5],
  pixelsPerInch: 600,
  units: "in",
};

function genArc(x0, y0, startAngle, endAngle, radius) {
  const arcLength = (endAngle - startAngle) * radius;

  const nPts = Math.ceil((arcLength / (2 * Math.PI * 3)) * 200);
  const path = [];
  for (let i = 0; i < nPts; i++) {
    const a = startAngle + ((endAngle - startAngle) * i) / nPts;
    const dx = radius * Math.cos(a);
    const dy = radius * Math.sin(a);

    path.push([x0 + dx, y0 + dy]);
  }
  return path;
}

function drawPath(context, path) {
  context.beginPath();
  context.moveTo(path[0][0], path[0][1]);

  for (let i = 1; i < path.length; i++) {
    context.lineTo(path[i][0], path[i][1]);
  }
  context.lineWidth = 0.01;
  context.strokeStyle = "black";
  context.stroke();
}

const sketch = () => {
  return ({ context, width, height, units }) => {
    const x0 = width / 2;
    const y0 = height / 2;
    const paths = [];
    for (let i = 0; i < 1000; i++) {
      const startAngle = random.range(0, 2 * Math.PI);
      const endAngle = startAngle + random.range(0.1, 0.3);
      const path = genArc(x0, y0, startAngle, endAngle, random.range(0.3, 3.5));

      paths.push(path);

      drawPath(context, path);
    }

    return [
      // Export PNG as first layer
      context.canvas,
      // Export SVG for pen plotter as second layer
      {
        data: polylinesToSVG(paths, {
          width,
          height,
          units,
        }),
        extension: ".svg",
      },
    ];
  };
};

canvasSketch(sketch, settings);
