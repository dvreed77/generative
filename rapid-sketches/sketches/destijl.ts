import { canvasSketch, ISettings } from "rapid-sketch";
const random = require("canvas-sketch-util/random");
const d3 = require("d3");

const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "destijl",
};

const isOdd = (x) => !!(x % 2);

console.log(isOdd(1), isOdd(2));

const sketch = () => {
  const colors = ["#d2b771", "#9a2d22", "#20366d", "#e9e6d7"];

  const bgColor = "#111018";

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.beginPath();

    const nLines = 10;
    const xs = Array.from({ length: nLines })
      .map(() => random.rangeFloor(0, width))
      .sort();
    const ys = Array.from({ length: nLines })
      .map(() => random.rangeFloor(0, height))
      .sort();

    console.log(xs, ys);

    const rectangles = [];
    let x0 = 0,
      y0 = 0;
    for (let i = 0; i <= nLines; i++) {
      for (let j = 0; j <= nLines; j++) {
        const w = (xs[j] ? xs[j] : width) - x0;
        const h = (ys[i] ? ys[i] : height) - y0;
        rectangles.push([x0, y0, w, h]);
        x0 = xs[j];
      }
      x0 = 0;
      y0 = ys[i];
    }

    rectangles.forEach(([x, y, w, h]) => {
      context.save();
      context.beginPath();

      const color = random.pick(colors);
      context.fillStyle = color;
      // const p = random.rangeFloor(10, 20);
      const p1 = 2;
      const p2 = 2;
      // const xd = random.rangeFloor(p1);
      // const yd = random.rangeFloor(p2);
      context.rect(x + p1, y + p2, w - 2 * p1, h - 2 * p2);
      context.fill();
      // context.strokeStyle = "white";
      // context.stroke();
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
