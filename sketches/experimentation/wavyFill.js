const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
import { getBoundingBox } from "../utils/getBoundingBox";

const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

function drawPolygon(context, pts) {
  context.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    context.lineTo(pts[i][0], pts[i][1]);
  }
  context.closePath();
}

function drawPath(context, pts) {
  context.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    context.lineTo(pts[i][0], pts[i][1]);
  }
}

function genWavyLine({
  width,
  dx = 1,
  x0 = 0,
  y0 = 0,
  amplitude = 25,
  phase = 0,
  period = 30,
}) {
  const path = [];
  for (let x = x0; x < x0 + width; x += dx) {
    const y = y0 + amplitude * Math.cos(x / period + phase);
    path.push([x, y]);
  }
  return path;
}

function genWavyLines(
  boundingBox,
  { amplitude = 25, phase = 0, period = 30, spacing = 30 } = {}
) {
  const w = boundingBox[1][0] - boundingBox[0][0];
  const h = boundingBox[1][1] - boundingBox[0][1];

  const d = Math.sqrt(w * w + h * h);

  const x0 = (boundingBox[0][0] + boundingBox[1][0]) / 2 - d / 2;
  const y0 = (boundingBox[0][1] + boundingBox[1][1]) / 2 - d / 2;
  const paths = [];
  for (let y = y0; y <= y0 + d; y += spacing) {
    paths.push(genWavyLine({ width: d, x0, y0: y, amplitude, phase, period }));
  }
  return paths;
}

function drawWavyPaths(context, paths, cx, cy, angle) {
  context.save();
  context.translate(cx, cy);
  context.rotate(angle);
  context.translate(-cx, -cy);
  context.beginPath();
  for (let path of paths) {
    drawPath(context, path);
  }
  context.restore();
}

function drawComplicateShape(
  context,
  polygonPath,
  fillColor = "red",
  spacing = 10,
  outlineColor = "black"
) {
  const strokeWidth1 = random.rangeFloor(3, 10);
  const strokeWidth2 = strokeWidth1 + 4;

  const boundingBox = getBoundingBox(polygonPath);
  const cx = (boundingBox[0][0] + boundingBox[1][0]) / 2;
  const cy = (boundingBox[0][1] + boundingBox[1][1]) / 2;

  // const outlineColor = "#0C0C0C";
  // const fillColor = "#ffd333";
  const amplitude = random.rangeFloor(10, 30);
  const phase = random.rangeFloor(0, 2 * Math.PI);
  const period = random.rangeFloor(20, 30);
  // const spacing = random.rangeFloor(20, 60);
  const lineRotation = random.range(0, 2 * Math.PI);

  const wavyPaths = genWavyLines(boundingBox, {
    amplitude,
    phase,
    period,
  });

  context.save();

  // context.scale(0.95, 0.95);
  context.save();

  context.beginPath();
  drawPolygon(context, polygonPath);
  context.clip();

  context.beginPath();
  drawPolygon(context, polygonPath);
  context.strokeStyle = outlineColor;
  context.lineWidth = 14;
  context.stroke();

  drawWavyPaths(context, wavyPaths, cx, cy, lineRotation);

  // drawWavyLines(context, { amplitude, phase, period, spacing, lineRotation });
  context.strokeStyle = outlineColor;
  context.lineWidth = strokeWidth2;
  context.stroke();

  context.beginPath();
  drawPolygon(context, polygonPath);
  context.strokeStyle = fillColor;
  context.lineWidth = 10;
  context.stroke();

  context.beginPath();
  // drawWavyLines(context, { amplitude, phase, period, spacing, lineRotation });
  drawWavyPaths(context, wavyPaths, cx, cy, lineRotation);
  context.strokeStyle = fillColor;
  context.lineWidth = strokeWidth1;
  context.stroke();

  context.restore();

  context.globalCompositeOperation = "destination-over";

  context.beginPath();
  drawPolygon(context, polygonPath);
  context.strokeStyle = outlineColor;
  context.lineWidth = 14;
  context.stroke();

  context.globalCompositeOperation = "source-over";
  context.beginPath();

  drawPolygon(context, polygonPath);
  context.strokeStyle = fillColor;
  context.lineWidth = 10;
  context.stroke();
  context.restore();
}

const sketch = () => {
  return ({ context, width, height }) => {
    const path = [
      [300, 300],
      [700, 300],
      [700, 700],
      [300, 700],
    ];

    drawComplicateShape(context, path);
  };
};

canvasSketch(sketch, settings);
