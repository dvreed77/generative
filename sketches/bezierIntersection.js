const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const {
  compose,
  translate,
  rotate,
  applyToPoints,
  inverse,
} = require("transformation-matrix");

import { lineBezierIntersection } from "./utils";

const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

const isOdd = (x) => !!(x % 2);

function randomLine(xMin, xMax, yMin, yMax) {
  const x1 = random.rangeFloor(xMin, xMax);
  const y1 = random.rangeFloor(yMin, yMax);

  const x2 = random.rangeFloor(xMin, xMax);
  const y2 = random.rangeFloor(yMin, yMax);

  return [
    [x1, y1],
    [x2, y2],
  ];
}

function randomBezier(xMin, xMax, yMin, yMax) {
  const x1 = random.rangeFloor(xMin, xMax);
  const y1 = random.rangeFloor(yMin, yMax);

  const x2 = random.rangeFloor(xMin, xMax);
  const y2 = random.rangeFloor(yMin, yMax);

  const x3 = random.rangeFloor(xMin, xMax);
  const y3 = random.rangeFloor(yMin, yMax);

  return [
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
}

function drawBezier(context, pts, options_) {
  const options = {
    lineColor: "black",
    ...options_,
  };

  context.beginPath();
  context.moveTo(pts[0][0], pts[0][1]);
  context.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
  context.strokeStyle = options.lineColor;
  context.lineWidth = 3;
  context.stroke();

  context.beginPath();
  context.moveTo(pts[0][0], pts[0][1]);
  context.arc(pts[0][0], pts[0][1], 5, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();

  context.beginPath();
  context.moveTo(pts[2][0], pts[2][1]);
  context.arc(pts[2][0], pts[2][1], 5, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
}

function drawLine(context, line, options_) {
  const options = {
    lineColor: "black",
    ...options_,
  };
  context.beginPath();
  context.moveTo(line[0][0], line[0][1]);
  context.lineTo(line[1][0], line[1][1]);
  context.strokeStyle = options.lineColor;
  context.lineWidth = 3;
  context.stroke();

  context.beginPath();
  context.moveTo(line[0][0], line[0][1]);
  context.arc(line[0][0], line[0][1], 5, 0, 2 * Math.PI);
  context.fillStyle = "green";
  context.fill();

  context.beginPath();
  context.moveTo(line[1][0], line[1][1]);
  context.arc(line[1][0], line[1][1], 5, 0, 2 * Math.PI);
  context.fillStyle = "red";
  context.fill();
}

function drawPts(context, pts, options_) {
  const options = {
    lineColor: "black",
    ...options_,
  };

  pts.forEach(([x, y]) => {
    context.moveTo(x, y);
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  });
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.translate(width / 2, height / 2);

    const padding = width / 4;

    // for (let i = 0; i < 10 ; i++) {

    // Random Line
    const line1 = randomLine(
      -width / 2 + padding,
      width / 2 - padding,
      -height / 2 + padding,
      height / 2 - padding
    );
    drawLine(context, line1, { lineColor: "#bbb" });

    // Line1 Translated
    const tMat1 = translate(-line1[0][0], -line1[0][1]);
    // const line2 = applyToPoints(t1, line1);
    // drawLine(context, line2);

    // Line2 Rotated
    const ang = Math.atan2(
      line1[1][1] - line1[0][1],
      line1[1][0] - line1[0][0]
    );

    const tMat2 = compose(rotate(-ang), tMat1);
    const line3 = applyToPoints(tMat2, line1);
    // drawLine(context, line3);

    // Random Bezier
    const bPts1 = randomBezier(
      -width / 2 + padding,
      width / 2 - padding,
      -height / 2 + padding,
      height / 2 - padding
    );
    drawBezier(context, bPts1, { lineColor: "#bbb" });

    const bPts2 = applyToPoints(tMat2, bPts1);
    // drawBezier(context, bPts2);

    // ========= Good up to here
    const a = bPts2[2][1] - 2 * bPts2[1][1] + bPts2[0][1];
    const b = -2 * bPts2[2][1] + 2 * bPts2[1][1];
    const c = bPts2[2][1];

    const t1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    const t2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);

    console.log(t1, t2);

    const x1 =
      bPts2[2][0] * Math.pow(1 - t1, 2) +
      bPts2[1][0] * 2 * (1 - t1) * t1 +
      bPts2[0][0] * Math.pow(t1, 2);

    const y1 =
      bPts2[2][1] * Math.pow(1 - t1, 2) +
      bPts2[1][1] * 2 * (1 - t1) * t1 +
      bPts2[0][1] * Math.pow(t1, 2);

    const x2 =
      bPts2[2][0] * Math.pow(1 - t2, 2) +
      bPts2[1][0] * 2 * (1 - t2) * t2 +
      bPts2[0][0] * Math.pow(t2, 2);

    const y2 =
      bPts2[2][1] * Math.pow(1 - t2, 2) +
      bPts2[1][1] * 2 * (1 - t2) * t2 +
      bPts2[0][1] * Math.pow(t2, 2);

    const intersectionPts1 = [
      [x1, y1],
      [x2, y2],
    ];

    // drawPts(context, intersectionPts1);

    const intersectionPts2 = applyToPoints(inverse(tMat2), intersectionPts1);

    drawPts(context, intersectionPts2);

    console.log(lineBezierIntersection(line1, bPts1));

    // }
  };
};

canvasSketch(sketch, settings);
