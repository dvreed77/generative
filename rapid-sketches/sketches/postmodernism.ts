import { canvasSketch, ISettings } from "rapid-sketch";
const random = require("canvas-sketch-util/random");

const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "postmodernism",
};

const isOdd = (x) => !!(x % 2);

console.log(isOdd(1), isOdd(2));

const sketch = () => {
  const colors = [
    "#f9ca24",
    "#abd3dc",
    "#ed3323",
    "#f5dcd0",
    "#eca233",
    "#00a0e4",
    "#ed1e2b",
  ];

  return ({ context, width, height }) => {
    const c1 = random.pick(colors);
    const c2 = random.pick(colors);
    // Create gradient
    var grd = context.createLinearGradient(0, 0, 0, height);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);

    var grd2 = context.createLinearGradient(0, 0, 0, height);
    grd2.addColorStop(0, c2);
    grd2.addColorStop(1, c1);

    // Fill with gradient
    context.fillStyle = grd;
    context.fillRect(0, 0, width, height);

    context.save();
    const r = 4;
    const hGap = 12;
    const vGap = (hGap / 2) * Math.sqrt(3);

    console.log(hGap, vGap);

    const nCols = Math.ceil(width / hGap);
    const nRows = Math.ceil(height / vGap);

    context.beginPath();
    for (let i = 0; i < nCols; i++) {
      for (let j = 0; j < nRows; j++) {
        const x = isOdd(j) ? i * hGap + 1 : i * hGap + 1 + hGap / 2;
        const y = j * vGap + 1;

        context.moveTo(x, y);
        context.arc(x, y, r, 0, 2 * Math.PI);
      }
    }

    context.fillStyle = "white";
    context.fill();

    context.beginPath();
    for (let i = 0; i < nCols; i++) {
      for (let j = 0; j < nRows; j++) {
        const x = isOdd(j) ? i * hGap : i * hGap + hGap / 2;
        const y = j * vGap;

        context.moveTo(x, y);
        context.arc(x, y, r, 0, 2 * Math.PI);
      }
    }

    context.clip();

    context.fillStyle = grd2;
    context.fillRect(0, 0, width, height);

    context.restore();
    var grd3 = context.createLinearGradient(0, 0, 0, height);
    grd3.addColorStop(1, random.pick(colors));
    grd3.addColorStop(0.5, random.pick(colors));
    grd3.addColorStop(0, random.pick(colors));

    const nBars = random.rangeFloor(2, 20);
    const barWidth = random.rangeFloor(10, 40);
    const gap2 = width / nBars;
    for (let i = 0; i < nBars; i++) {
      context.fillStyle = grd3;
      const x = i * gap2 + gap2 / 2 - barWidth / 2;
      context.fillRect(x, barWidth, 20, height - 60);
    }

    context.translate(width / 2, height / 2);
    context.rotate(Math.PI / 4);
    for (let i = 0; i < random.rangeFloor(3, 6); i++) {
      const w = random.rangeFloor(50, width / 2);
      const yOffset = Math.random() * height - height / 2;
      context.rotate(-Math.PI / 4);
      context.translate(0, yOffset);
      context.rotate(+Math.PI / 4);

      context.fillStyle = random.shuffle(colors);
      // const w =
      context.fillRect(-w / 2, -w / 2, w, w);

      context.rotate(-Math.PI / 4);
      context.translate(0, -yOffset);
      context.rotate(+Math.PI / 4);
    }
  };
};

canvasSketch(sketch, settings);
