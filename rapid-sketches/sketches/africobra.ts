import { canvasSketch, ISettings } from "rapid-sketch";
const random = require("canvas-sketch-util/random");
const d3 = require("d3");

const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "africobra",
};

const isOdd = (x) => !!(x % 2);

console.log(isOdd(1), isOdd(2));

const sketch = () => {
  const colors = ["#46b3cf", "#19b56e", "#e26553", "#37383d", "#9c3f2d"];

  const bgColor = "#ddd2bc";

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    const x0 = width / 2;
    const y0 = height * 1.2;

    function d1(r) {
      const a1 = -Math.PI / 2 + Math.atan2(x0, y0 - height) - Math.PI / 20;

      const xp1 = x0 + r * Math.cos(a1);
      const yp1 = y0 + r * Math.sin(a1);

      // const a1t = Math.atan2(-(xp1 - x0), y0 - yp1);
      const a1t = a1 - Math.PI / 2;

      const br = 200;
      const xp1a = xp1 + br * Math.cos(a1t);
      const yp1a = yp1 + br * Math.sin(a1t);

      // context.beginPath();
      // context.moveTo(xp1, yp1);
      // context.lineTo(xp1a, yp1a);
      // context.strokeStyle = "black";
      // context.stroke();

      // context.beginPath();
      // context.arc(xp1, yp1, 3, 0, 2 * Math.PI);
      // context.fillStyle = "red";
      // context.fill();

      const a2 = -Math.PI / 2 - Math.atan2(x0, y0 - height) + Math.PI / 20;

      const xp2 = x0 + r * Math.cos(a2);
      const yp2 = y0 + r * Math.sin(a2);

      // const a1t = Math.atan2(-(xp1 - x0), y0 - yp1);
      const a2t = a2 + Math.PI / 2;

      // const a2t = Math.atan2(-x0, -y0 + height);

      const xp2a = xp2 + br * Math.cos(a2t - Math.PI / 10);
      const yp2a = yp2 + br * Math.sin(a2t - Math.PI / 10);

      // context.beginPath();
      // context.moveTo(xp2, yp2);
      // context.lineTo(xp2a, yp2a);
      // context.strokeStyle = "black";
      // context.stroke();

      context.beginPath();
      context.moveTo(xp2, yp2);
      context.bezierCurveTo(
        xp2a + random.gaussian(0, 40),
        yp2a + random.gaussian(0, 40),
        xp1a + random.gaussian(0, 40),
        yp1a + random.gaussian(0, 40),
        xp1,
        yp1
      );

      context.lineWidth = 40;
      context.strokeStyle = random.pick(colors);
      context.stroke();
    }

    // const r = Math.sqrt(Math.pow(y0 - height, 2) + Math.pow(x0, 2));

    const r = 50;

    for (let i = 0; i < 40; i++) {
      d1(r + i * 50);
    }

    // d1(r + 100);
    // d1(r + 200);
    // d1(r + 300);
    // d1(r + 400);
    // context.beginPath();
    // context.arc(x0, y0, r, 0, 2 * Math.PI);
    // context.strokeStyle = "red";
    // context.stroke();
  };
};

canvasSketch(sketch, settings);
