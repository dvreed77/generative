const d3 = require("d3");
const { Shape } = require("./Shape");
export function chaikin(shape, ratio, iterations = 0, close) {
  if (iterations > 10) iterations = 10;
  if (iterations == 0) return shape;

  const nCorners = shape.pts.length;

  const pts = [];
  for (let i = 0; i < nCorners; i++) {
    // Get the i'th and (i+1)'th vertex to work on that edge.
    const ptA = shape.pts[i];
    const ptB = shape.pts[(i + 1) % nCorners];

    const [newPtA, newPtB] = chaikinCut(ptA, ptB, ratio);

    pts.push(newPtA);
    pts.push(newPtB);
  }

  const newShape = new Shape(pts);
  return chaikin(newShape, ratio, iterations - 1);
}

function chaikinCut(pA, pB, ratio) {
  /*
   * If ratio is greater than 0.5 flip it so we avoid cutting across
   * the midpoint of the line.
   */
  if (ratio > 0.5) ratio = 1 - ratio;

  /* Find point at a given ratio going from A to B */
  const pA_new = d3.interpolate(pA, pB)(ratio);
  const pB_new = d3.interpolate(pB, pA)(ratio);

  return [pA_new, pB_new];
}
