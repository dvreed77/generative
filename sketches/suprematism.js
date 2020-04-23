const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const d3 = require("d3");

const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

const isOdd = (x) => !!(x % 2);

console.log(isOdd(1), isOdd(2));

const sketch = () => {
  const colors = ["#292522", "#8d512e", "#38324c", "#d79e27", "#9c3f2d"];

  const bgColor = "#ddd2bc";

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    var arc = d3.arc().context(context);
    context.save();
    for (let i = 0; i < random.rangeFloor(30, 60); i++) {
      context.restore();
      context.beginPath();

      const xOffset = Math.random() * width;
      const yOffset = Math.random() * height;

      const a = Math.random() * 2 * Math.PI;
      context.translate(xOffset, yOffset);
      context.rotate(a);

      const c = Math.random();

      switch (true) {
        case c > 0.7:
          const a1 = random.rangeFloor(10, width / 10);
          const b1 = a1 + Math.random() * 20 + 3;
          arc({
            innerRadius: a1,
            outerRadius: b1,
            startAngle: 0,
            endAngle: 2 * Math.PI,
          });
          break;
        case c > 0.4:
          const w = random.rangeFloor(10, width / 3);
          const h = random.rangeFloor(10, width / 3);
          context.rect(0, 0, w, h);
          break;

        case c < 0.4:
          const r = random.rangeFloor(10, width / 10);
          context.arc(0, 0, r, 0, 2 * Math.PI);
          break;
        default:
          console.log("none");
          break;
      }

      const color = random.pick(colors);

      // const color = "white"

      context.fillStyle = color;
      context.fill();
      context.rotate(-a);
      context.translate(-xOffset, -yOffset);
      context.save();
    }
  };
};

canvasSketch(sketch, settings);
