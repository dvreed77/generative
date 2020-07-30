import { canvasSketch, ISettings } from "rapid-sketch";
import exquisiteConsequencesData from "./exquisiteConsequencesData.json";
import { drawPath } from "../../utils/drawPath";
import { drawPt } from "../../utils/drawPt";
import { pointPointSquaredDistance } from "../../utils/distances/pointPointSquaredDistance";
import {
  fromTriangles,
  applyToPoints,
  compose,
  translate,
  rotate,
  scale,
} from "transformation-matrix";
import { pathsToSVG } from "../../utils/svg/writeSVG";
import { drawBezierPath2 } from "../../utils/drawBezierPath";
import { path as d3Path } from "d3";

const settings: ISettings = {
  dimensions: [1000, 1000],
};

export function getBezierPath(
  // context,
  bezierShape
  // { fillColor = "red" } = {}
) {
  const pathCtx = d3Path();

  // pathCtx.beginPath();
  pathCtx.moveTo(bezierShape[0][0], bezierShape[0][1]);

  for (let i = 3; i < bezierShape.length; i += 3) {
    pathCtx.bezierCurveTo(
      bezierShape[i - 1][0],
      bezierShape[i - 1][1],
      bezierShape[i + 1][0],
      bezierShape[i + 1][1],
      bezierShape[i][0],
      bezierShape[i][1]
    );
  }

  pathCtx.bezierCurveTo(
    bezierShape[bezierShape.length - 1][0],
    bezierShape[bezierShape.length - 1][1],
    bezierShape[1][0],
    bezierShape[1][1],
    bezierShape[0][0],
    bezierShape[0][1]
  );

  return pathCtx;

  // context.fillStyle = fillColor;
  // context.fill();
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
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
      .filter((d) => d);

    const bezierShapes2 = data.map(({ bezierShape }) =>
      bezierShape.map(({ pt, armA, armB }) => [pt, armA, armB]).flat()
    );

    const nCols = 20;

    const units = "px";

    const paths = bezierShapes2.map((bezierShape, idx) => {
      const xOffset = idx % nCols;
      const yOffset = Math.floor(idx / nCols);
      const bz = bezierShape.map(([x, y]) => [x + xOffset, y + yOffset]);

      const pathCtx = getBezierPath(bz);
      return `<path d="${pathCtx.toString()}"/>`;
    });

    const groups = [`<g>${paths.join("")}</g>`];

    const viewWidth = width;
    const viewHeight = height;

    const svg = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${width}${units}" height="${height}${units}" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${viewWidth} ${viewHeight}">
    ${groups.join("")}
</svg>`;

    return svg;
  };
}, settings);
