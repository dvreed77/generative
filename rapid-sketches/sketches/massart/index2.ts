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

const settings: ISettings = {
  dimensions: [800, 800],
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
  const strokePaths = [];
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

    strokePaths.push(strokeB);
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
  strokePaths.push(strokeB);

  return strokePaths;
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    const data = exquisiteConsequencesData
      .map((d) => ({
        stroke: JSON.parse(d.stroke),
        color: d.color,
      }))
      .filter((d) => d.stroke.length);

    const totalPts = data.length;
    const nPts = 120;

    const strokeData = data.map((d) => d.stroke);
    const colorData = data.map((d) => d.color);

    for (let i = 0; i < 30; i++) {
      const startIdx = (i * nPts) % totalPts;
      const stopIdx = ((i + 1) * nPts) % totalPts;

      let strokeDataSliced, colorDataSliced;
      if (stopIdx < startIdx) {
        const d1 = strokeData.slice(startIdx);
        const d2 = strokeData.slice(0, stopIdx);
        strokeDataSliced = d1.concat(d2);

        const c1 = colorData.slice(startIdx);
        const c2 = colorData.slice(0, stopIdx);
        colorDataSliced = c1.concat(c2);
      } else {
        strokeDataSliced = strokeData.slice(startIdx, stopIdx);
        colorDataSliced = colorData.slice(startIdx, stopIdx);
      }

      const strokePaths = createCirc(
        strokeDataSliced,
        20 * (i + 1),
        width / 2,
        height / 2,
        nPts
      );

      // console.log(strokePaths);

      for (let i = 0; i < strokePaths.length; i++) {
        const strokePath = strokePaths[i];
        const color = colorDataSliced[i];
        drawPath(context, strokePath, {
          fillColor: null,
          strokeColor: color,
          lineWidth: 1,
        });
      }
    }
  };
}, settings);
