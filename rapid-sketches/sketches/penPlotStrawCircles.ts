import { canvasSketch, ISettings } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import { pathsToSVG } from "../utils/svg/writeSVG";
import math from "canvas-sketch-util/math";
import { mydist } from "../utils/mydist";

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

canvasSketch(() => {
  return ({ context, width, height }) => {
    const paths = [];
    for (let i = 0; i < 300; i++) {
      const x0 = math.mapRange(
        mydist(0, random.value()),
        0,
        1,
        PADDING.left,
        PADDING.left + CANVAS_WIDTH
      );

      const y0 = random.range(PADDING.top, PADDING.top + CANVAS_HEIGHT);

      // refill
      if (i % 10 === 0) {
        const x0 = PADDING.left + CANVAS_WIDTH + 1.5 + random.range(-0.2, 0.2);
        const y0 = 1.5 + random.range(-0.2, 0.2);
        paths.push([[x0, y0]]);
        context.beginPath();
        context.arc(x0, y0, 0.1, 0, 2 * Math.PI);
        context.lineWidth = 0.01;
        context.stroke();
      }

      paths.push([[x0, y0]]);

      context.beginPath();
      context.arc(x0, y0, 0.1, 0, 2 * Math.PI);
      context.lineWidth = 0.01;
      context.stroke();
    }

    return pathsToSVG(
      [
        { paths: paths, id: "1" },
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
}, settings);
