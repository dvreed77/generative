import { Vector } from "./Vector";

export function drawPath(
  context: CanvasRenderingContext2D,
  path: Vector[] | number[][],
  {
    drawPts = false,
    lineWidth = 1,
    strokeColor = "red",
    fillColor = "red",
    closePath = false,
  } = {}
) {
  context.beginPath();
  context.moveTo(path[0][0], path[0][1]);

  for (let i = 1; i < path.length; i++) {
    context.lineTo(path[i][0], path[i][1]);
  }
  if (closePath) {
    context.closePath();
  }

  if (strokeColor) {
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    context.stroke();
  }

  if (fillColor) {
    context.fillStyle = fillColor;
    context.fill();
  }

  if (drawPts) {
    context.beginPath();
    context.moveTo(path[0][0], path[0][1]);
    context.arc(path[0][0], path[0][1], 5 * lineWidth, 0, 2 * Math.PI);
    context.fillStyle = "green";
    context.fill();

    context.beginPath();
    for (let i = 1; i < path.length; i++) {
      context.moveTo(path[i][0], path[i][1]);
      context.arc(path[i][0], path[i][1], 2 * lineWidth, 0, 2 * Math.PI);
    }
    context.fillStyle = "black";
    context.fill();
  }
}
