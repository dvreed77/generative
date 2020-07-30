import { canvasSketch, ISettings } from "rapid-sketch";
import exquisiteConsequencesData from "./exquisiteConsequencesData.json";

import {
  applyToPoints,
  compose,
  translate,
  rotate,
  scale,
} from "transformation-matrix";
import { drawBezierPath2 } from "../../utils/drawBezierPath";
import Color from "color";
import random from "canvas-sketch-util/random";

const settings: ISettings = {
  dimensions: [800, 800],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const x0 = width / 2,
      y0 = height / 2;
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

    const arcLength = 40;
    let k = 0;
    for (let j = 0; j < 30; j++) {
      const radius = 20 * (j + 1);

      const nPts = Math.floor((2 * Math.PI * radius) / arcLength);

      const circPts = [];
      const startAngle = random.range(0, 2 * Math.PI);
      for (let i = 0; i < nPts; i++) {
        const angle = startAngle + (2 * Math.PI * i) / nPts;

        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);

        circPts.push([x0 + dx, y0 + dy, angle]);
      }

      context.globalCompositeOperation = "screen";
      context.beginPath();
      for (let i = 0; i < circPts.length; i++) {
        const [x, y, angle] = circPts[i];

        const tMat = compose(
          translate(x, y),
          scale(arcLength * 1.8),
          rotate(angle),
          translate(-0.5, -0.5)
        );

        const colorAngleRange = 40;
        const c = Color("#146eea")
          .rotate(random.range(-colorAngleRange, colorAngleRange))
          .alpha(0.8);

        drawBezierPath2(
          context,
          applyToPoints(tMat, bezierShapes2[k++ % bezierShapes2.length]),
          {
            fillColor: c.toString(),
          }
        );
      }
    }

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
  };
}, settings);
