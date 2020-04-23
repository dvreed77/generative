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

export function splitBezier(bez, z) {
  // https://pomax.github.io/bezierinfo/#matrixsplit
  // const mat1 = [
  //   [1, 0, 0],
  //   [-(z - 1), z, 0],
  //   [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
  // ];

  const f1a = (a1, a2, a3) => a1;
  const f2a = (a1, a2, a3) => z * a2 - (z - 1) * a1;
  const f3a = (a1, a2, a3) =>
    z * z * a3 - 2 * z * (z - 1) * a2 + Math.pow(z - 1, 2) * a1;

  const x1a = f1a(bez[0][0], bez[1][0], bez[2][0]);
  const x2a = f2a(bez[0][0], bez[1][0], bez[2][0]);
  const x3a = f3a(bez[0][0], bez[1][0], bez[2][0]);

  const y1a = f1a(bez[0][0], bez[1][0], bez[2][0]);
  const y2a = f2a(bez[0][0], bez[1][0], bez[2][0]);
  const y3a = f3a(bez[0][0], bez[1][0], bez[2][0]);

  const bezA = [
    [x1a, y1a],
    [x2a, y2a],
    [x3a, y3a],
  ];

  const f1b = (a1, a2, a3) =>
    z * z * a3 - 2 * z * (z - 1) * a2 + Math.pow(z - 1, 2) * a1;
  const f2b = (a1, a2, a3) => z * a3 - (z - 1) * a2;
  const f3b = (a1, a2, a3) => a3;

  const x1b = f1b(bez[0][0], bez[1][0], bez[2][0]);
  const x2b = f2b(bez[0][0], bez[1][0], bez[2][0]);
  const x3b = f3b(bez[0][0], bez[1][0], bez[2][0]);

  const y1b = f1b(bez[0][0], bez[1][0], bez[2][0]);
  const y2b = f2b(bez[0][0], bez[1][0], bez[2][0]);
  const y3b = f3b(bez[0][0], bez[1][0], bez[2][0]);

  const bezB = [
    [x1b, y1b],
    [x2b, y2b],
    [x3b, y3b],
  ];

  // const mat2 = [
  //   [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
  //   [0, -(z - 1), z],
  //   [0, 0, 1],
  // ];

  return { bezA, bezB };
}

export function splitBezier2(bez, z) {
  // https://pomax.github.io/bezierinfo/#matrixsplit
  const mat1 = [
    [1, 0, 0],
    [-(z - 1), z, 0],
    [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
  ];

  const bezA = math.multiply(mat1, [bez[2], bez[1], bez[0]]);

  const mat2 = [
    [Math.pow(z - 1, 2), -2 * (z - 1) * z, z * z],
    [0, -(z - 1), z],
    [0, 0, 1],
  ];

  const bezB = math.multiply(mat2, [bez[2], bez[1], bez[0]]);

  return { bezA, bezB };
}

function getBez([l1, l2], bez, bottom = true) {
  const a1 = Math.atan2(l1[1][1] - l1[0][1], l1[1][0] - l1[0][0]);
  const a2 = Math.atan2(l2[1][1] - l2[0][1], l2[1][0] - l2[0][0]);

  if (bottom) {
    if (a2 > a1) {
      const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezA, bezB } = splitBezier2(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l1, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC, bezB: bezD } = splitBezier2(bezB, z);

      return bezD;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezB } = splitBezier2(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezB);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezB: bezD } = splitBezier2(bezB, z);

      return bezD;
    }
  } else {
    if (a2 < a1) {
      const { intersectionPts: iA, ts: tsA } = lineBezierIntersection(l2, bez);
      const { bezA, bezB } = splitBezier2(bez, tsA[1]);
      const { ts: tsB } = lineBezierIntersection(l1, bezA);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC, bezB: bezD } = splitBezier2(bezA, z);

      return bezC;
    } else {
      const { ts: tsA } = lineBezierIntersection(l1, bez);
      const { bezA } = splitBezier2(bez, tsA[1]);

      const { ts: tsB } = lineBezierIntersection(l2, bezA);

      const z = tsB.find((d) => d >= 0 || d <= 1);

      const { bezA: bezC } = splitBezier2(bezA, z);

      return bezC;
    }
  }
}

export function getBezPoly([l1, l2], [bez1, bez2]) {
  const b1 = getBez([l1, l2], bez1);
  const b2 = getBez([l1, l2], bez2, false);

  return [b1, b2];
}

export function drawBezPoly(context, b1, b2, options_) {
  const options = {
    fill: "red",
    ...options_,
  };

  context.beginPath();
  context.moveTo(b1[2][0], b1[2][1]);
  context.quadraticCurveTo(b1[1][0], b1[1][1], b1[0][0], b1[0][1]);
  context.lineTo(b2[0][0], b2[0][1]);
  context.quadraticCurveTo(b2[1][0], b2[1][1], b2[2][0], b2[2][1]);
  context.closePath();
  context.fillStyle = options.fill;
  context.fill();
}
