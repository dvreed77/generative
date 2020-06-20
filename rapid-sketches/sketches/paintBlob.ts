import { canvasSketch, ISettings } from "rapid-sketch";
import { Point } from "../utils/types";
import { drawPath } from "../utils/drawPath";
import math from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import { pointPointSquaredDistance } from "../utils/distances/pointPointSquaredDistance";
import Color from "color";

class Blob {
  nSides: number;
  radius: number;
  path: Point[] = [];
  vars: number[] = [];
  constructor([x0, y0]: Point, radius: number, nSides: number) {
    this.nSides = nSides;
    this.radius = radius;
    for (let i = 0; i < nSides; i++) {
      const angle = (i * 2 * Math.PI) / nSides;
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);
      this.path.push([x0 + dx, y0 + dy]);
    }

    for (let i = 0; i < nSides; i++) {
      const lineSegment =
        i > 0
          ? [this.path[i], this.path[i - 1]]
          : [this.path[i], this.path[nSides - 1]];

      // const d = pointPointSquaredDistance(lineSegment[0], lineSegment[1]);
      // const v = math.mapRange(d, 0, 4000, 0, 30);
      const r = random.gaussian(0.5, 0.2);
      const r2 = r < 0 ? -1 * r : r;
      this.vars.push(r2);
    }
  }

  expand(nIterations: number) {
    let lastPath = this.path;

    for (let iteration = 0; iteration < nIterations; iteration++) {
      const path = [];
      for (let i = 0; i < lastPath.length; i++) {
        const [p1, p2] =
          i > 0
            ? [lastPath[i - 1], lastPath[i]]
            : [lastPath[lastPath.length - 1], lastPath[i]];

        const d = Math.sqrt(pointPointSquaredDistance(p1, p2));

        const t = random.gaussian(0.5, 0.15);
        const midPoint = [
          p1[0] + t * (p2[0] - p1[0]),
          p1[1] + t * (p2[1] - p1[1]),
        ];

        const normalAngle =
          Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) - Math.PI / 2;

        const v1 = random.gaussian(d * 0.8, d * 0.1);
        const v2 = random.gaussian(d * 0.8, d * 0.1);

        const p3 = [
          p1[0] + v1 * Math.cos(normalAngle),
          p1[1] + v1 * Math.sin(normalAngle),
        ];

        const p4 = [
          midPoint[0] + v2 * Math.cos(normalAngle),
          midPoint[1] + v2 * Math.sin(normalAngle),
        ];

        path.push(...[p3, p4]);
      }
      lastPath = path;
    }

    return lastPath;
  }
}
const settings: ISettings = {
  dimensions: [1480, 850],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.globalCompositeOperation = "multiply";
    const nBlobs = 15;
    const color = Color("blue").alpha(0.01).rotate(random.range(-180, 180));

    const blobs = [];
    const colors = [];
    for (let b = 0; b < nBlobs; b++) {
      const x = random.range(0, width);
      const y = random.range(0, height);
      const r = random.range(30, 60);

      blobs.push(new Blob([x, y], r, 10));

      const cr = random.range(-50, 50);
      colors.push(color.rotate(cr));
    }
    // const blob = new Blob([width / 2, height / 2], 30, 10);
    // const blob2 = new Blob([width * 0.4, height * 0.4], 30, 10);
    // const blob3 = new Blob([width * 0.6, height * 0.4], 30, 10);

    // const color = Color("#C2483E").alpha(0.04);
    // const color2 = color.rotate(-10);
    // const color3 = color.darken(0.2);

    for (let i = 6; i > 3; i--) {
      for (let j = 0; j < 30; j++) {
        for (let b = 0; b < blobs.length; b++) {
          const blob = blobs[b];
          const color = colors[b];
          const path = blob.expand(i);
          drawPath(context, path, {
            closePath: true,
            strokeColor: null,
            fillColor: color.string(),
            drawPts: false,
          });
        }

        // const path2 = blob2.expand(i);
        // drawPath(context, path2, {
        //   closePath: true,
        //   strokeColor: null,
        //   fillColor: color2.string(),
        //   drawPts: false,
        // });

        // const path3 = blob3.expand(i);
        // drawPath(context, path3, {
        //   closePath: true,
        //   strokeColor: null,
        //   fillColor: color3.string(),
        //   drawPts: false,
        // });
      }
    }

    context.globalCompositeOperation = "normal";
    context.fillStyle = Color("white").alpha(0.6).string();
    context.fillRect(0, 0, width, height);
  };
}, settings);
