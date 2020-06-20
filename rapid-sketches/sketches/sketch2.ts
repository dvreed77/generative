import { canvasSketch, ISettings } from "rapid-sketch";

import {
  average,
  subtract,
  magnitude,
  multiply,
  divide,
} from "../utils/Vector";
import { Particle } from "../utils/Particle";
import { drawPath } from "../utils/drawPath";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";

const settings: ISettings = {
  dimensions: [1000, 1000],
};

function drawRandom(context, width, height, avgVector) {
  const x = random.range(-20, width);
  const y = random.range(-20, height);

  const r = random.value();

  let c;
  if (r > 0.9) {
    c = 12;
  } else {
    c = 40;
  }

  const color = `hsl(${math.mapRange(
    x,
    0,
    width,
    c - 5,
    c + 5,
    true
  )},100%,${math.mapRange(y, 0, height, 50, 60, true)}%, .8)`;

  const p2 = new Particle([x, y], {
    speed: 2,
    dir: -Math.PI * 0.3 + random.range(-0.1, 0.1),
  });

  // drawPt(context, p2.pos, { radius: 5, fillColor: "orange" });

  for (let i = 0; i < 2000; i++) {
    const d = subtract(p2.pos, avgVector);
    const mD = magnitude(d);
    p2.applyForce(multiply(divide(d, Math.pow(mD, 1.35)), 4));
    p2.applyField(-Math.PI * 0.3, 2);
    p2.update();
  }

  drawPath(
    context,
    p2.history.map((d) => d.pos),
    { strokeColor: color, drawPts: false, lineWidth: 4 }
  );
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.globalCompositeOperation = "overlay";
    context.lineCap = "round";

    const p1 = new Particle([width / 2, height / 2], { speed: 20 });

    const particlePath = [p1.copy()];
    for (let i = 0; i < 10; i++) {
      p1.update();
      particlePath.push(p1.copy());
    }

    const path = particlePath.map((p) => p.pos);

    // drawPath(context, path, { drawPts: true });

    const avgVector = average(path);

    // drawPt(context, avgVector, { radius: 5, fillColor: "blue" });

    const p2 = new Particle([width / 2 + 30, height / 2 + 100], {
      speed: 2,
      dir: -Math.PI * 0.3,
    });

    // drawPt(context, p2.pos, { radius: 5, fillColor: "orange" });

    for (let i = 0; i < 200; i++) {
      const d = subtract(p2.pos, avgVector);
      const mD = magnitude(d);
      p2.applyForce(multiply(divide(d, Math.pow(mD, 1.35)), 4));
      p2.applyField(-Math.PI * 0.3, 2);
      p2.update();
    }

    drawPath(
      context,
      p2.history.map((d) => d.pos),
      { strokeColor: "orange", drawPts: false }
    );

    for (let i = 0; i < 1000; i++) {
      drawRandom(context, width, height, avgVector);
    }
  };
}, settings);
