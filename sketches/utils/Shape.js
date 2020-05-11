import { inflatePolygon } from "./inflatePolygon";

export class Shape {
  constructor(pts) {
    this.pts = pts;
    this.stroke = () => "black";
    this.strokeWeight = () => 1;
    this.fill = () => null;
    this.lineDash = () => [];

    this.x = (p) => p[0];
    this.y = (p) => p[1];
  }

  setStrokeWeight(_) {
    return arguments.length
      ? (this.strokeWeight = typeof _ === "function" ? _ : () => _)
      : this.strokeWeight;
  }

  setStrokeDash(_) {
    return arguments.length
      ? (this.lineDash = typeof _ === "function" ? _ : () => _)
      : this.lineDash;
  }

  getCenter() {
    const mx = d3.mean(this.pts.map((d) => this.x(d)));
    const my = d3.mean(this.pts.map((d) => this.y(d)));

    return [mx, my];
  }

  offset(p) {
    return new Shape(inflatePolygon(this.pts, p));
  }

  scale(s) {
    const center = this.getCenter();

    const newPts = this.pts.map((pt) => {
      return d3.interpolate(center, pt)(s);
    });

    return new Shape(newPts);
  }

  setFill(_) {
    return arguments.length
      ? (this.fill = typeof _ === "function" ? _ : () => _)
      : this.fill;
  }

  setStroke(_) {
    return arguments.length
      ? (this.stroke = typeof _ === "function" ? _ : () => _)
      : this.stroke;
  }

  x(_) {
    return arguments.length
      ? (this.x = typeof _ === "function" ? _ : () => _)
      : this.x;
  }

  y(_) {
    return arguments.length
      ? (this.y = typeof _ === "function" ? _ : () => _)
      : this.y;
  }

  getBoundingRect() {
    const minX = d3.min(this.pts.map((d) => this.x(d)));
    const maxX = d3.max(this.pts.map((d) => this.x(d)));
    const minY = d3.min(this.pts.map((d) => this.y(d)));
    const maxY = d3.max(this.pts.map((d) => this.y(d)));

    return [minX, maxX, minY, maxY];
  }
  draw(ctx, offsetX = 0, offsetY = 0) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash(this.lineDash());
    ctx.fillStyle = this.fill();
    ctx.strokeStyle = this.stroke();
    ctx.lineWidth = this.strokeWeight();

    ctx.moveTo(this.x(this.pts[0]) + offsetX, this.y(this.pts[0]) + offsetY);
    this.pts
      .slice(1)
      .forEach((pt) => ctx.lineTo(this.x(pt) + offsetX, this.y(pt) + offsetY));
    ctx.closePath();

    if (this.stroke()) ctx.stroke();
    if (this.fill()) ctx.fill();
    ctx.restore();
  }
}
