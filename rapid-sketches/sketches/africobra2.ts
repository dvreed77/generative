import { canvasSketch, ISettings } from "rapid-sketch";
const random = require("canvas-sketch-util/random");
const d3 = require("d3");
// import { getBezPoly, drawBezPoly, splitBezier2 } from "../utils";
import {
  splitBezier,
  lineBezierIntersection,
  getBezierPolygon,
  drawBezierPolygon,
  d,
} from "rapid-sketch-util";
import {} from "rapid-sketch-util";
const { lerp, linspace } = require("canvas-sketch-util/math");

console.log(d);

const settings: ISettings = {
  dimensions: [2000, 2000],
  name: "africobra2",
};

function drawLine(context, width, height) {
  const x1 = width / 2;
  const y1 = height + 30;

  const x2 = random.rangeFloor(0, width);
  const y2 = random.rangeFloor(0, height / 2);

  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  return [
    [x1, y1],
    [x2, y2],
  ];
}

function drawBezier(context, width, height, offset) {
  const x1 = -width / 2;
  const y1 = height - offset;

  const x2 = random.gaussian(0, 50);
  const y2 = height - offset - 5000;

  const x3 = width * 1.5;
  const y3 = height - offset;

  // context.beginPath();
  // context.moveTo(x1, y1);
  // context.quadraticCurveTo(x2, y2, x3, y3);
  // context.stroke();

  return [
    [x1, y1],
    [x2, y2],
    [x3, y3],
  ];
}

function drawPts(context, pts, options_) {
  const options = {
    lineColor: "black",
    ...options_,
  };

  context.beginPath();
  pts.forEach(([x, y]) => {
    context.moveTo(x, y);
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  });
}

function drawPoly(context, pts, options_) {
  const options = {
    fill: "red",
    ...options_,
  };

  context.beginPath();
  context.moveTo(pts[0][0], pts[0][1]);
  pts.forEach(([x, y]) => {
    context.lineTo(x, y);
  });
  context.fillStyle = options.fill;
  context.fill();
}

function getPts([l1, l2], [b1, b2]) {
  const pts = [];
  pts.push(lineBezierIntersection(l1, b1).intersectionPts[1]);
  pts.push(lineBezierIntersection(l1, b2).intersectionPts[1]);
  pts.push(lineBezierIntersection(l2, b2).intersectionPts[1]);
  pts.push(lineBezierIntersection(l2, b1).intersectionPts[1]);

  return pts;
}

function getPts2([l1, l2], [b1, b2]) {
  const pts = [];

  const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(l1, b1);
  const bA = splitBezier(b1, tsA[1]);

  const { intersectionPts: iB, ts: tsB } = lineBezierIntersection(l1, b1);
  const bB = splitBezier(b1, tsB[1]);

  console.log(iB[1], bB);
  // const z2 = lineBezierIntersection(l2, b1).ts[1];
  // const bB = splitBezier(b1, z2);

  pts.push(bB.bezB[0]);
  pts.push(bB.bezB[1]);
  pts.push(bA.bezA[1]);
  pts.push(bA.bezA[2]);

  return pts;
}

function drawLine2(context, line, options_) {
  const options = {
    lineColor: "black",
    ...options_,
  };
  context.beginPath();
  context.moveTo(line[0][0], line[0][1]);
  context.lineTo(line[1][0], line[1][1]);
  context.strokeStyle = options.lineColor;
  context.lineWidth = 1;
  context.stroke();

  // context.beginPath();
  // context.moveTo(line[0][0], line[0][1]);
  // context.arc(line[0][0], line[0][1], 5, 0, 2 * Math.PI);
  // context.fillStyle = "green";
  // context.fill();

  // context.beginPath();
  // context.moveTo(line[1][0], line[1][1]);
  // context.arc(line[1][0], line[1][1], 5, 0, 2 * Math.PI);
  // context.fillStyle = "red";
  // context.fill();
}

function randomLines(width, height) {
  return linspace(10).map((t) => {
    const pA = Math.PI / 4;
    const ang =
      lerp(-Math.PI / 2 - pA, -Math.PI / 2 + pA, t) + random.gaussian(0, 0.05);

    const x1 = width / 2;
    const y1 = height + 100;

    const x2 = 5000 * Math.cos(ang) + x1;
    const y2 = 5000 * Math.sin(ang) + y1;

    return [
      [x1, y1],
      [x2, y2],
    ];
  });
}

const sketch = () => {
  const colors = ["#46b3cf", "#19b56e", "#e26553", "#37383d", "#9c3f2d"];

  const bgColor = "#ddd2bc";
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    let lastBez = drawBezier(context, width, height, -2500);
    for (let j = 1; j < 70; j++) {
      const bez = drawBezier(context, width, height, j * 40 - 2500);

      const lines = randomLines(width, height);
      // lines.forEach((line) => drawLine2(context, line));
      for (let idx = 1; idx < lines.length; idx++) {
        const l1 = lines[idx - 1];
        const l2 = lines[idx];

        // const pts = getPts([l1, l2], [bez1, bez2]);

        const [b1, b2] = getBezierPolygon([l1, l2], [lastBez, bez]);

        drawBezierPolygon(context, b1, b2, { fill: random.pick(colors) });

        // drawPts(context, pts);

        // drawPoly(context, pts, { fill: random.pick(colors) });
      }
      lastBez = bez;
    }

    // lines.forEach((line) => drawLine2(context, line));
  };
};

canvasSketch(sketch, settings);
