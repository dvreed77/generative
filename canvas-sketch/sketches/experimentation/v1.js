const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
import { lineBezierIntersection, splitBezier, splitBezier2 } from "../utils";

const settings = {
  id: 1,
  dimensions: [1000, 1000],
};
function drawBezier(context, width, height, offset) {
  const x1 = -width / 2;
  const y1 = height - offset;

  const x2 = random.gaussian(0, 10);
  const y2 = height - offset - 2000;

  const x3 = width * 1.5;
  const y3 = height - offset;

  context.beginPath();
  context.moveTo(x1, y1);
  context.quadraticCurveTo(x2, y2, x3, y3);
  context.stroke();

  return [
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
}

function drawLine(context, width, height) {
  const x1 = width / 2;
  const y1 = height + 30;

  const x2 = random.rangeFloor(0, width);
  const y2 = random.rangeFloor(0, 0);

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  return [
    [x1, y1],
    [x2, y2],
  ];
}

function getBez([l1, l2], bez, bottom = true) {
  const a1 = Math.atan2(l1[1][1] - l1[0][1], l1[1][0] - l1[0][0]);
  const a2 = Math.atan2(l2[1][1] - l2[0][1], l2[1][0] - l2[0][0]);

  if (bottom) {
    if (a2 > a1) {
      const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezA, bezB } = splitBezier2(bez, tsA[1]);

      console.log(bezA, bezB);

      const { ts: tsB } = lineBezierIntersection(l1, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);
      console.log(
        tsB,
        tsB.find((d) => d >= 0 || d <= 1)
      );

      const { bezA: bezC, bezB: bezD } = splitBezier2(bezB, z);

      console.log(bezC, bezD);

      return bezD;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezB } = splitBezier2(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezB: bezD } = splitBezier2(bezB, z);

      return bezD;
    }
  } else {
    if (a2 < a1) {
      const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezA, bezB } = splitBezier2(bez, tsA[1]);
      const { ts: tsB } = lineBezierIntersection(l1, bezA);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      console.log("top A");

      const { bezA: bezC, bezB: bezD } = splitBezier2(bezA, z);

      return bezC;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezA } = splitBezier2(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezA);

      console.log("top B");

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC } = splitBezier2(bezA, z);

      return bezC;
    }
  }
}

function getBezPoly([l1, l2], [bez1, bez2]) {
  const b1 = getBez([l1, l2], bez1);
  const b2 = getBez([l1, l2], bez2, false);

  return [b1, b2];
}

function drawBezPoly(context, b1, b2) {
  context.beginPath();
  context.moveTo(b1[2][0], b1[2][1]);
  context.quadraticCurveTo(b1[1][0], b1[1][1], b1[0][0], b1[0][1]);
  context.lineTo(b2[0][0], b2[0][1]);
  context.quadraticCurveTo(b2[1][0], b2[1][1], b2[2][0], b2[2][1]);
  context.closePath();
  context.fillStyle = "blue";
  context.fill();
}

function drawSplit(context, lPts, bez, offset, [c1, c2]) {
  context.translate(0, offset);
  const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(lPts, bez);
  const { bezA, bezB } = splitBezier2(bez, tsA[1]);

  console.log(bezA);
  context.beginPath();
  context.moveTo(bezA[0][0], bezA[0][1]);
  context.quadraticCurveTo(bezA[1][0], bezA[1][1], bezA[2][0], bezA[2][1]);
  context.strokeStyle = c1;
  context.lineWidth = 2;
  context.stroke();

  context.beginPath();
  context.moveTo(bezB[0][0], bezB[0][1]);
  context.quadraticCurveTo(bezB[1][0], bezB[1][1], bezB[2][0], bezB[2][1]);
  context.strokeStyle = c2;
  context.lineWidth = 2;
  context.stroke();
}

const sketch = () => {
  return ({ context, width, height }) => {
    const bez1 = drawBezier(context, width, height, -200);
    const bez2 = drawBezier(context, width, height, -100);
    const l1 = drawLine(context, width, height);
    const l2 = drawLine(context, width, height);

    // const b1 = getBez([l1, l2], bez1);

    // context.beginPath();
    // context.moveTo(b1[0][0], b1[0][1]);
    // context.quadraticCurveTo(b1[1][0], b1[1][1], b1[2][0], b1[2][1]);
    // context.strokeStyle = "red";
    // context.lineWidth = 2;
    // context.stroke();

    // const b2 = getBez([l1, l2], bez2, false);

    // context.beginPath();
    // context.moveTo(b2[0][0], b2[0][1]);
    // context.quadraticCurveTo(b2[1][0], b2[1][1], b2[2][0], b2[2][1]);
    // context.strokeStyle = "red";
    // context.lineWidth = 2;
    // context.stroke();

    // context.beginPath();
    // context.moveTo(b1[2][0], b1[2][1]);
    // context.quadraticCurveTo(b1[1][0], b1[1][1], b1[0][0], b1[0][1]);
    // context.lineTo(b2[0][0], b2[0][1]);
    // context.quadraticCurveTo(b2[1][0], b2[1][1], b2[2][0], b2[2][1]);
    // context.closePath();
    // context.fillStyle = "blue";
    // // context.lineWidth = 2;
    // context.fill();

    const [b1, b2] = getBezPoly([l1, l2], [bez1, bez2]);

    drawBezPoly(context, b1, b2);

    // drawSplit(context, l1, bez, 0, ["green", "blue"]);
    // drawSplit(context, l2, bez, 10, ["red", "black"]);
  };
};

canvasSketch(sketch, settings);
