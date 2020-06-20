import { canvasSketch, ISettings } from "rapid-sketch";
import { lineSegmentTree } from "../utils/lineSegmentTree";
import { drawPath } from "../utils/drawPath";
import { Circle } from "../utils/types";
import { circlePathIntersection } from "../utils/circlePathIntersection";

const settings: ISettings = {
  dimensions: [800, 800],
};

function drawCircle(
  context,
  circle: Circle,
  { lineWidth = 1, strokeColor = "red" } = {}
) {
  context.beginPath();
  context.moveTo(circle.x + circle.r, circle.y);
  context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeColor;
  context.stroke();
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    const path = [
      [100, 100],
      [200, 100],
      [400, 400],
      [100, 400],
    ] as [number, number][];

    const line = [
      [140, 40],
      [140, 500],
    ] as [number, number][];

    const circle = { x: 120, y: 111, r: 10 };

    const root = lineSegmentTree([path]);

    console.log(root.intersections([line[0], line[1]]));

    console.log(root);

    const d = circlePathIntersection(root, circle);
    console.log(d);

    drawPath(context, path);
    drawPath(context, line, { strokeColor: "black" });
    drawCircle(context, circle);
  };
}, settings);
