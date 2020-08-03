import { canvasSketch, ISettings } from "rapid-sketch";
import { randomFloat, randomInt, randomPick } from "rapid-sketch-util";
const settings: ISettings = {
  dimensions: [800, 800],
  name: "squiggleWalkers",
};

interface ISimObject {
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

function fromPolar(r, theta) {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

const MAX_PARTICLE_SIZE = 3;
class Particle implements ISimObject {
  x = 0;
  y = 0;
  speed = 0;
  theta = 0;

  radius = 1;
  ttl = 500;
  duration = 500;
  lifetime = 500;

  color = "black";
  constructor(private w: number, private h: number, private palette: string[]) {
    this.x = randomFloat(0, w);
    this.y = randomFloat(0, h);

    this.color = randomPick(palette);

    this.speed = randomFloat(0, 3.0);
    this.theta = randomFloat(0, 2 * Math.PI);

    this.radius = randomFloat(0.05, MAX_PARTICLE_SIZE);
    this.lifetime = this.ttl = randomInt(25, 50);
  }

  update() {
    const dRadius = randomFloat(
      -MAX_PARTICLE_SIZE / 10,
      MAX_PARTICLE_SIZE / 10
    );
    const dSpeed = randomFloat(-0.01, 0.01);
    const dTheta = randomFloat(-Math.PI / 8, Math.PI / 8);

    this.speed += dSpeed;
    this.theta += dTheta;

    const [dx, dy] = fromPolar(this.speed, this.theta);
    this.x += dx;
    this.y += dy;
    this.radius =
      this.radius + dRadius < 0 ? MAX_PARTICLE_SIZE : this.radius + dRadius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.experiment1(ctx);
    ctx.restore();
  }

  experiment1(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    let circle = new Path2D();
    circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill(circle);
  }
}

const PARTICLE_COUNT = 400;
const COLOR_PALETTES = [
  ["#D92B3A", "#8C754A", "#F28705", "#402C1A", "#F21616"],
  ["#252759", "#0455BF", "#2E97F2", "#AED3F2", "#F25C05"],
  ["#A8B6BF", "#657371", "#D0D9D2", "#5C7346", "#A1A692"],
  ["#60731D", "#D9AA52", "#8C3807", "#F2F2F2", "#0D0D0D"],
  ["#303E8C", "#83A603", "#F2B705", "#F28A2E", "#F26D3D"],
  ["#D93D4A", "#F2CED1", "#049DBF", "#F2C84B", "#D98E04"],
];

class Simulation implements ISimObject {
  particles: Particle[] = [];
  palette: string[] = [];
  constructor(private width: number, private height: number) {
    this.palette = randomPick(COLOR_PALETTES);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      this.particles.push(new Particle(width, height, this.palette));
    }
  }
  update() {
    this.particles.forEach((p) => p.update());
  }
  init = false;
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.init) {
      ctx.fillStyle = this.palette[0];
      ctx.fillRect(0, 0, this.width, this.height);
      this.init = true;
    }

    this.particles.forEach((p) => p.draw(ctx));
  }
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    const s = new Simulation(width, height);

    for (let i = 0; i < 300; i++) {
      s.update();
      s.draw(context);
    }
  };
}, settings);
