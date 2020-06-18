export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    const m = this.magnitude();
    if (m > 0) {
      this.x = this.x / m;
      this.y = this.y / m;
    }
    return this;
  }

  normal() {
    const new_x = this.y;
    const new_y = -this.x;

    this.x = new_x;
    this.y = new_y;

    return this;
  }

  rotate(angle) {
    const new_x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    const new_y = this.x * Math.sin(angle) + this.y * Math.cos(angle);

    this.x = new_x;
    this.y = new_y;

    return this;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  rotateTowards(v, a) {
    const d = v.angle() - this.angle();
    // if (d >= Math.PI/4) return this.rotate(this.angle())
    // if (d <= -Math.PI/4) return this.rotate(this.angle())
    return this.rotate(d * a);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  mult(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  static average(vs) {
    const average = new Vector(0, 0);
    vs.forEach((v) => average.add(v));
    average.divide(vs.length);
    return average;
  }
}
