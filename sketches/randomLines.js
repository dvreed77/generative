const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const SimplexNoise = require("simplex-noise");
const math = require("mathjs");
const { polylinesToSVG } = require("canvas-sketch-util/penplot");

import { offsetPolygon } from "./utils/inflatePolygon";

const settings = {
  dimensions: [10, 8],
  pixelsPerInch: 600,
  units: "in",
};

const sketch = () => {
  return ({ context, width, height, units }) => {
    const lines = [];

    const x1 = random.range(0, width);
    const x2 = random.range(0, width);

    const y1 = random.range(0, height);
    const y2 = random.range(0, height);

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 0.01;
    context.stroke();

    for (let t = 0; t <= 1; t += 0.01) {
      const x = x1 + t * (x2 - x1);
      const y = y1 + t * (y2 - y1);

      const a = Math.atan2(-x2 + x1, y2 - y1);

      const dx = 0.2 * Math.cos(a);
      const dy = 0.2 * Math.sin(a);

      // context.beginPath();
      // context.moveTo(x, y);
      // context.arc(x, y, 0.05, 0, 2 * Math.PI);
      // context.fill();

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + dx, y + dy);
      context.stroke();
    }

    return [
      // Export PNG as first layer
      context.canvas,
      // Export SVG for pen plotter as second layer
      {
        data: polylinesToSVG(lines, {
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
