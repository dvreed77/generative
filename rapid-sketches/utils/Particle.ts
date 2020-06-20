import fp from "lodash/fp";
import { Vector, add, normalize, multiply } from "./Vector";

export class Particle {
  pos: Vector;
  vel: Vector;
  history: any[];

  constructor(
    pos: Vector,
    { speed = 0, dir = 0, vel: vel_ = [0, 0] as Vector } = {}
  ) {
    this.pos = pos;
    this.history = [];
    let vel: Vector;
    if (speed) {
      const vx = speed * Math.cos(dir);
      const vy = speed * Math.sin(dir);
      vel = [vx, vy];
    } else {
      vel = vel_;
    }
    this.vel = vel;
  }

  copy() {
    return new Particle(this.pos, { vel: this.vel });
  }

  applyForce(force: Vector) {
    this.vel = add(this.vel, force);
  }

  applyField(dir: number, r: number) {
    const force: Vector = [r * Math.cos(dir), r * Math.sin(dir)];
    this.vel = add(this.vel, force);
    this.vel = multiply(normalize(this.vel), 2);
  }

  update() {
    this.history.push({ pos: this.pos, vel: this.vel });
    this.pos = add(this.pos, this.vel);
  }
}
