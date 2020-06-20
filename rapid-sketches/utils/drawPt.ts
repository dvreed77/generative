import { Vector } from "../Vector";

export function drawPt(
  context: CanvasRenderingContext2D,
  pt: Vector,
  { radius = 2, fillColor = "black" } = {}
) {
  context.beginPath();
  context.moveTo(pt[0], pt[1]);
  context.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
  context.fillStyle = fillColor;
  context.fill();
}
