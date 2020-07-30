import canvasSketch from "canvas-sketch";
import { range } from "canvas-sketch-util/random";
import { Vector } from "../utils/Vector";
// import { Vector as Vector2 } from "../utils/Vector2";

const settings = {
  dimensions: [1000, 1000],
};

class Particle {
  constructor(x, y, vx = 0, vy = 0) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
  }
  applyForce(dx, dy) {
    this.pos = this.pos + this.vel.add(this.vel.add(new Vector(dx, dy)));
  }
  clone() {
    return new Particle(this.pos.x, this.pos.y);
  }
}

function drawPt(context, pt, { radius = 2, fillColor = "black" } = {}) {
  context.beginPath();
  context.moveTo(pt[0], pt[1]);
  context.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
  context.fillStyle = fillColor;
  context.fill();
}

function drawPath(
  context,
  path,
  { drawPts = false, lineWidth = 1, strokeColor = "red" } = {}
) {
  if (drawPts) {
    context.beginPath();
    for (let i = 0; i < path.length; i++) {
      context.moveTo(path[i][0], path[i][1]);
      context.arc(path[i][0], path[i][1], 2 * lineWidth, 0, 2 * Math.PI);
    }
    context.fillStyle = "black";
    context.fill();
  }

  context.beginPath();
  context.moveTo(path[0][0], path[0][1]);

  for (let i = 1; i < path.length; i++) {
    context.lineTo(path[i][0], path[i][1]);
  }
  context.lineWidth = lineWidth;
  context.strokeStyle = strokeColor;
  context.stroke();
}

const sketch = () => {
  return ({ context, width, height, units }) => {
    const p1 = new Particle(width / 2, height / 2);

    const pArray = [p1];
    for (let i = 0; i < 10; i++) {
      p1.applyForce(20, 0);
      pArray.push(p1.clone());
    }

    drawPath(
      context,
      pArray.map((p) => [p.pos.x, p.pos.y]),
      { drawPts: true }
    );

    const average = Vector.average(pArray.map((p) => p.pos));

    console.log(average);

    drawPt(context, [average.x, average.y], { radius: 6, fillColor: "blue" });

    const p2 = new Particle(width / 2 + 30, height / 2 + 100);

    drawPt(context, [p2.pos.x, p2.pos.y], { radius: 6, fillColor: "orange" });
  };
};

canvasSketch(sketch, settings);
