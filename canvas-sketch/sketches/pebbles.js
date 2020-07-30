const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
import { Delaunay } from "d3-delaunay";
const d3 = require("d3");
import { Shape } from "./utils/Shape";
import { chaikin } from "./utils/chaikin";
const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const rx = d3.randomUniform(0, width);
    const ry = d3.randomUniform(0, height);
    const pts = d3.range(100).map(() => [rx(), ry()]);

    const delaunay = Delaunay.from(pts);

    const voronoi = delaunay.voronoi([0.5, 0.5, width - 0.5, height - 0.5]);

    for (let i = 0; i < pts.length; i++) {
      var c = d3.hsl("orange");
      c.h += d3.randomUniform(-5, 5)();
      c.s += d3.randomUniform(-0.1, 0.1)();
      c + ""; // rgb(198, 45, 205)

      const s = new Shape(voronoi.cellPolygon(i));

      const s2 = s.offset(-2);

      const s3 = chaikin(s2, 0.25, 5);
      s3.setFill(c);
      s3.setStroke(null);
      s3.draw(context);
    }
  };
};

canvasSketch(sketch, settings);
