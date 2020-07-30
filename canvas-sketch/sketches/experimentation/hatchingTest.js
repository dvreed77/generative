const canvasSketch = require("canvas-sketch");
import { hatchlines } from "../utils/hatchfill/hatchlines";
import { getBoundingBox } from "../utils/hatchfill/getBoundingBox";
import { getPaths } from "../utils/hatchfill/getPaths";
import { getHatchSubPaths } from "../utils/hatchfill/getHatchSubPaths";

import { genHatchLines } from "../utils/hatchfill/genHatchLines";
const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

const sketch = () => {
  return ({ context, width, height }) => {
    const polygon = [
      // [10, 10],
      // [600, 50],
      // [600, 700],
      [10, 10],
      [500, 10],
      [200, 100],
      [500, 200],
      [10, 200],
    ];

    const bb = getBoundingBox(polygon);

    const cx = (bb[1][0] + bb[0][0]) / 2;
    const cy = (bb[1][1] + bb[0][1]) / 2;

    context.translate(cx, cy);

    context.beginPath();
    context.moveTo(polygon[0][0], polygon[0][1]);
    for (let pt of polygon) {
      context.lineTo(pt[0], pt[1]);
    }
    context.closePath();
    context.stroke();

    const hatchLines = hatchlines(bb, Math.PI * 0.1, 20);

    context.beginPath();
    for (let line of hatchLines) {
      context.moveTo(line[0][0], line[0][1]);
      context.lineTo(line[1][0], line[1][1]);
    }
    context.stroke();

    context.beginPath();
    context.rect(bb[0][0], bb[0][1], bb[1][0] - bb[0][0], bb[1][1] - bb[0][1]);
    context.stroke();

    const paths = getPaths(polygon);
    context.beginPath();
    for (let line of paths) {
      context.moveTo(line[0][0], line[0][1]);
      context.lineTo(line[1][0], line[1][1]);
    }
    context.strokeStyle = "red";
    context.lineWidth = 4;
    context.stroke();

    for (let hatchLine of hatchLines) {
      const { intersectionPts, hatchLines: subHatchLines } = getHatchSubPaths(
        hatchLine,
        paths
      );
      context.beginPath();
      for (let pt of intersectionPts) {
        context.moveTo(pt[0], pt[1]);
        context.arc(pt[0], pt[1], 6, 0, 2 * Math.PI);
      }
      context.fill();

      context.beginPath();
      for (let line of subHatchLines) {
        context.moveTo(line[0][0], line[0][1]);
        context.lineTo(line[1][0], line[1][1]);
      }
      context.strokeStyle = "blue";
      context.lineWidth = 4;
      context.stroke();
    }

    const hl2 = genHatchLines(polygon, Math.PI * 0.5, 20);

    context.beginPath();
    for (let line of hl2) {
      context.moveTo(line[0][0], line[0][1]);
      context.lineTo(line[1][0], line[1][1]);
    }
    context.strokeStyle = "green";
    context.lineWidth = 4;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
