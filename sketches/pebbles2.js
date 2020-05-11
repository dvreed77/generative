const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
import { Delaunay } from "d3-delaunay";
const d3 = require("d3");
import { offsetPolygon } from "./utils/inflatePolygon";
import { getBoundingBox } from "./utils/getBoundingBox";

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

function genWavyLine({ amplitude = 25, phase = 0, period = 30 }) {
  const path = [];
  const width = 1000;
  const nPts = 3000;
  for (let i = -1000; i < nPts; i++) {
    const x = (i * 1000) / 1000;
    const y = amplitude * Math.cos(x / period + phase);
    path.push([x, y]);
  }
  return path;
}

function genWavyLine2({
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

function drawWavyLines(
  context,
  {
    amplitude = 25,
    phase = 0,
    period = 30,
    spacing = 30,
    lineRotation = 0,
  } = {}
) {
  const path = genWavyLine({ amplitude, phase, period });
  context.save();
  context.translate(500, 500);
  context.rotate(lineRotation);
  context.translate(-500, -500);
  for (let i = -20; i < 50; i++) {
    context.save();
    context.translate(0, i * spacing);
    drawPath(context, path);
    context.restore();
  }
  context.restore();
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
    paths.push(genWavyLine2({ width: d, x0, y0: y, amplitude, phase, period }));
  }
  return paths;
}

function drawPaths(paths) {
  context.save();
  context.translate(500, 500);
  context.rotate(lineRotation);
  context.translate(-500, -500);
  for (let path of paths) {
    context.save();
    context.translate(0, i * spacing);
    drawPath(context, path);
    context.restore();
  }
  context.restore();
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
  fillColor,
  spacing,
  outlineColor
) {
  if (polygonPath.length === 0) return;
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
    spacing,
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

  context.beginPath();
  drawWavyPaths(context, wavyPaths, cx, cy, lineRotation);
  context.strokeStyle = outlineColor;
  context.lineWidth = strokeWidth2;
  context.stroke();

  // context.beginPath();
  // drawPolygon(context, polygonPath);
  // context.strokeStyle = fillColor;
  // context.lineWidth = 10;
  // context.stroke();

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
  const nPts = 100;

  var color = d3
    .scaleLinear()
    .domain([0, 800, 1000])
    .range(["#fcba03", "#fc9403", "#fce397"]);

  var strokeColor = d3
    .scaleLinear()
    .domain([0, 1000])
    .range(["#ff2d08", "#ff7f08"]);

  var spacing = d3.scaleLinear().domain([0, 1000]).range([40, 12]);
  var offset = d3.scaleLinear().domain([0, 1000]).range([-25, -10]);

  return ({ context, width, height }) => {
    context.globalCompositeOperation = "source-over";
    context.lineJoin = "round";
    context.save();

    context.translate(500, 500);
    context.scale(0.9, 0.9);
    context.translate(-500, -500);

    const rx = d3.randomUniform(0, width);
    const ry = d3.randomExponential(3);
    const pts = d3.range(nPts).map(() => [rx(), height - ry() * height]);

    // context.beginPath();
    // for (let pt of pts) {
    //   context.moveTo(pt[0], pt[1]);
    //   context.arc(pt[0], pt[1], 4, 0, 2 * Math.PI);
    // }
    // context.fill();

    // return;

    const delaunay = Delaunay.from(pts);

    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

    for (let i = 0; i < nPts; i++) {
      const pts = voronoi.cellPolygon(i);
      if (!pts) continue;
      const yMin = Math.min(...pts.map((d) => d[1]));
      const yMax = Math.max(...pts.map((d) => d[1]));
      const yMiddle = (yMin + yMax) / 2;

      const pts2 = offsetPolygon(pts, offset(yMiddle));

      drawComplicateShape(
        context,
        pts2,
        color(yMiddle),
        spacing(yMiddle),
        strokeColor(yMiddle)
      );
    }

    context.restore();
    context.globalCompositeOperation = "destination-over";

    context.fillStyle = "#f5f4f0";
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
