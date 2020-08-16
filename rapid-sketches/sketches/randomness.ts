import { canvasSketch, ISettings } from "rapid-sketch";
import { randomF } from "rapid-sketch-util";
import Color from "color";

const settings: ISettings = {
  dimensions: [800, 800],
  name: "randomness",
};

const palette = ["#264F73", "#3F7EA6", "#F2811D", "#BF5B21", "#F2D4C9"];
// const p = palette[Math.floor(Math.random() * palette.length)];
const p = "#F2811D";
console.log(p);
let c = Color(p).alpha(0.6);

function myF(f) {
  // const f = (x) => Math.cos(2 * Math.PI * x);
  const data = [];
  for (let i = 0; i < 1000; i++) {
    data.push({
      x: i / 1000,
      y: f(i / 1000),
    });
  }

  return data;
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    const backgroundColor = Color(p).rotate(180).string();
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.globalCompositeOperation = "overlay";

    const rowHeight = 20;

    let phase = 0;
    let wavelength = 4 * Math.PI;

    for (let r = 0; r < height / rowHeight; r++) {
      phase += Math.PI * (Math.random() - 0.5) * 0.3;
      wavelength += 0.5 * Math.PI * (Math.random() - 0.5);
      const rGen = randomF((x) => 2 + Math.cos(wavelength * x + phase));
      c = c.rotate(1 * Math.random());
      context.strokeStyle = c.string();
      for (let i = 0; i < 1000; i++) {
        context.beginPath();
        const x = rGen() * width;

        context.moveTo(x, r * rowHeight - rowHeight * 0.1 * Math.random());
        context.lineTo(
          x,
          (r + 1) * rowHeight + rowHeight * 0.2 * Math.random()
        );

        context.lineWidth = 1;
        context.stroke();
      }
    }

    context.restore();

    context.globalCompositeOperation = "hard-light";

    for (let k = 0; k < 5; k++) {
      context.save();

      context.rotate(Math.random());
      const phase1 = 2 * Math.PI * Math.random();
      const waveLength = 2 * Math.PI * Math.random();
      const lineTop = myF((x) => Math.cos(waveLength * x + phase1)).map(
        (d) => ({
          x: d.x * 2 * width,
          y: d.y * height * 0.1,
        })
      );

      const phase2 = phase1 + Math.random();

      const lineBottom = myF((x) => Math.cos(waveLength * x + phase2)).map(
        (d) => ({
          x: d.x * width,
          y: d.y * height * 0.1,
        })
      );
      context.beginPath();
      context.moveTo(lineTop[0].x, lineTop[0].y);
      lineTop.forEach((d) => {
        context.lineTo(d.x, d.y + (k * height) / 5);
      });

      lineBottom.reverse().forEach((d) => {
        context.lineTo(d.x, d.y + (k * height) / 5 + 50);
      });

      context.fillStyle = backgroundColor;
      context.fill();

      context.restore();
    }

    // for (let i = 0; i < 10; i++) {
    //   const y1 = Math.random() * height;
    //   const y2 = Math.random() * height;

    //   const h1 = height * 0.05 + Math.random() * 0.2 * height;
    //   const h2 = height * 0.05 + Math.random() * 0.2 * height;

    //   context.beginPath();
    //   context.moveTo(0, y1 - h1 / 5);
    //   context.lineTo(width, y2 - h2 / 5);
    //   context.lineTo(width, y2 + h2 / 5);
    //   context.lineTo(0, y1 + h1 / 5);

    //   context.fillStyle = Color(backgroundColor).string();
    //   context.fill();
    // }
  };
}, settings);
