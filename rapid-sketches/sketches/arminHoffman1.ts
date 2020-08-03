import { canvasSketch, ISettings } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import { solveCubic } from "rapid-sketch-util";

const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "arminHoffman",
};

function fGen(x, y, h, k) {
  const a = (y - k) / Math.pow(x - h, 2);
  console.log(a);
  return function f(x) {
    return a * Math.pow(x - h, 2) + k;
  };
}

function getIntercept(x, y, h, k, y0) {
  const a = (y - k) / Math.pow(x - h, 2);
  const m = a / 3 - a * h + a * h * h + k;
  const A = a / 3 / m;
  const B = (-a * h) / m;
  const C = (a * h * h + k) / m;
  const D = -y0;

  const roots = solveCubic(A, B, C, D);

  return roots.find((r) => r >= 0 && r <= 1);
}

function fGen2(x, y, h, k) {
  // see notes Nov2019 page 87
  const a = (y - k) / Math.pow(x - h, 2);
  console.log(a, h, k);
  const m = a / 3 - a * h + a * h * h + k;
  return function f(x) {
    return (
      ((a * Math.pow(x, 3)) / 3 -
        (2 * a * h * x * x) / 2 +
        (a * h * h + k) * x) /
      m
    );
  };
}

function f3(x) {
  return Math.sqrt(x);
}

function f4() {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random() * 0.5 * 0.2);

  return [0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)];
}

function f5() {
  const angle = Math.random() * Math.PI * 2;
  const r = random.gaussian(Math.sqrt(2 * 0.25), 0.2);

  return [0.5 + r * Math.cos(angle), 0.5 + r * Math.sin(angle)];
}

function genPts(width, height, nPts = 100) {
  const pts = [];
  for (let i = 0; i < nPts; i++) {
    const [x0, y0] = f5();
    pts.push([x0 * width, y0 * height]);
  }

  return pts;
}

function drawShape(context, [x, y]) {
  context.save();
  const aR = random.rangeFloor(4, 14);

  const w = random.rangeFloor(1, 12);
  const h = w * aR;

  context.translate(x, y - h / 2);

  // context.fillStyle = "#f2efe9";
  context.rect(-w / 2, -w / 2, w, w);

  context.rect(-w / 2, (3 * w) / 2, w, h);

  context.restore();
}

function drawCircle(context, [x, y]) {
  context.save();
  context.translate(x, y);
  context.moveTo(x, y);
  context.arc(0, 0, 5, 0, 2 * Math.PI);

  context.restore();
}

const sketch = () => {
  const bgColor = "#414245";

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
    const padding = 50;

    context.beginPath();
    context.rect(padding, padding, width - 2 * padding, height - 2 * padding);
    context.clip();

    context.beginPath();
    const pts = genPts(width - padding, height - padding, 4000);
    pts.forEach((pt) => drawShape(context, pt));

    context.fillStyle = "#f2efe9";
    context.fill();
  };
};

canvasSketch(sketch, settings);
