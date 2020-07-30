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

const settings: ISettings = {
  dimensions: [1000, 1000],
};

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

function createCirc(data, r, x0, y0, nPts = 100) {
  const circPath = [[x0 + r, y0]];
  const strokePath = [];
  for (let i = 1; i < nPts; i++) {
    const a = (i * Math.PI * 2) / nPts;
    const dx = r * Math.cos(a);
    const dy = r * Math.sin(a);

    const x1 = circPath[i - 1][0];
    const y1 = circPath[i - 1][1];

    const x2 = x0 + dx;
    const y2 = y0 + dy;

    circPath.push([x2, y2]);

    const strokeB = convertStroke(
      [
        [x1, y1],
        [x2, y2],
      ],
      data[i]
    );

    strokePath.push(...strokeB);
  }

  const x1 = circPath[nPts - 1][0];
  const y1 = circPath[nPts - 1][1];

  const x2 = circPath[0][0];
  const y2 = circPath[0][1];

  const strokeB = convertStroke(
    [
      [x1, y1],
      [x2, y2],
    ],
    data[0]
  );
  strokePath.push(...strokeB);

  return strokePath;
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    const strokeData = exquisiteConsequencesData
      .map((d) => JSON.parse(d.stroke))
      .map((path) => path.filter(([x, y]) => !!x && !!y))
      .filter((d) => d.length);

    const nCols = 20;

    const strokeDataTransformed = strokeData.map((path, idx) => {
      const xOffset = idx % nCols;
      const yOffset = Math.floor(idx / nCols);
      return path.map(([x, y]) => [x + xOffset, y + yOffset]);
    });

    return pathsToSVG(
      strokeDataTransformed.map((path, idx) => ({
        paths: [path],
        id: `g${idx}`,
      })),
      {
        width,
        height,
      }
    );
  };
}, settings);
