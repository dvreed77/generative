const {
  compose,
  translate,
  rotate,
  applyToPoints,
  inverse,
} = require("transformation-matrix");
const math = require("mathjs");

export function lineBezierIntersection(lPts, bPts) {
  const ang = Math.atan2(lPts[1][1] - lPts[0][1], lPts[1][0] - lPts[0][0]);

  const tMat = compose(rotate(-ang), translate(-lPts[0][0], -lPts[0][1]));

  // See Notes page 77
  const bPtsRotated = applyToPoints(tMat, bPts);

  const a = bPtsRotated[2][1] - 2 * bPtsRotated[1][1] + bPtsRotated[0][1];
  const b = -2 * bPtsRotated[2][1] + 2 * bPtsRotated[1][1];
  const c = bPtsRotated[2][1];

  const t1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
  const t2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);

  const x1 =
    bPtsRotated[2][0] * Math.pow(1 - t1, 2) +
    bPtsRotated[1][0] * 2 * (1 - t1) * t1 +
    bPtsRotated[0][0] * Math.pow(t1, 2);

  const y1 =
    bPtsRotated[2][1] * Math.pow(1 - t1, 2) +
    bPtsRotated[1][1] * 2 * (1 - t1) * t1 +
    bPtsRotated[0][1] * Math.pow(t1, 2);

  const x2 =
    bPtsRotated[2][0] * Math.pow(1 - t2, 2) +
    bPtsRotated[1][0] * 2 * (1 - t2) * t2 +
    bPtsRotated[0][0] * Math.pow(t2, 2);

  const y2 =
    bPtsRotated[2][1] * Math.pow(1 - t2, 2) +
    bPtsRotated[1][1] * 2 * (1 - t2) * t2 +
    bPtsRotated[0][1] * Math.pow(t2, 2);

  const intersectionPtsPre = [
    [x1, y1],
    [x2, y2],
  ];

  const intersectionPts = applyToPoints(inverse(tMat), intersectionPtsPre);

  const ts = [t1, t2];

  return {
    intersectionPts,
    ts,
  };
}
