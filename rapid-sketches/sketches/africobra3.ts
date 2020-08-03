import { canvasSketch, ISettings } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import SimplexNoise from "simplex-noise";

import { offsetPolygon } from "rapid-sketch-util";

const settings: ISettings = {
  dimensions: [2000, 2000],
  name: "africobra3",
};

function drawPoly(context, pts, options_) {
  const options = {
    fill: "red",
    ...options_,
  };

  try {
    context.beginPath();
    context.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(([x, y]) => {
      context.lineTo(x, y);
    });
    context.closePath();
    context.fillStyle = options.fill;
    // context.lineWidth = 6;
    context.fill();
  } catch (w) {}
}

function genWedge(angle1, angle2, r1, r2) {
  const innerC = (angle2 - angle1) * r1;
  const outerC = (angle2 - angle1) * r2;

  const pts = [];
  const nPts = 100;
  for (let i = 0; i < nPts; i++) {
    const a = angle1 + ((angle2 - angle1) / nPts) * i;
    const x = r1 * Math.cos(a);
    const y = r1 * Math.sin(a);
    pts.push([x, y]);
  }

  for (let i = 0; i < nPts; i++) {
    const a = angle2 - ((angle2 - angle1) / nPts) * i;
    const x = r2 * Math.cos(a);
    const y = r2 * Math.sin(a);
    pts.push([x, y]);
  }

  return pts;
}

function drawWedge(context, wedge) {
  // drawPoly(context, wedge, { fill: "#0F2018" });
  try {
    const pts2 = offsetPolygon(wedge, -5);
    drawPoly(context, pts2, { fill: "#184785" });

    const pts3 = offsetPolygon(pts2, -10);
    drawPoly(context, pts3, { fill: "#DD8206" });

    const pts4 = offsetPolygon(pts3, -10);
    drawPoly(context, pts4, { fill: "red" });
  } catch (err) {
    console.log(err);
  }
}

function genBlob(rM) {
  const pts = [];
  const nPts = 1000;
  const dA = (2 * Math.PI) / nPts;
  for (let a = 0; a < nPts; a++) {
    const s = 0.4;
    const dx = s * Math.cos(dA * a);
    const dy = s * Math.sin(dA * a);

    const r = simplex.noise2D(dx, dy) / 2 + 1;

    const x = rM * r * Math.cos(dA * a);
    const y = rM * r * Math.sin(dA * a);

    pts.push([x, y]);
  }
  return pts;
}

function genBlobSegment(angle1, angle2, radius1, radius2) {
  const pts = [];
  const nPts = 100;
  const s = 0.3;
  for (let i = 0; i < nPts; i++) {
    const a = angle1 + ((angle2 - angle1) / nPts) * i;

    const dx = s * Math.cos(a);
    const dy = s * Math.sin(a);

    const r = simplex.noise2D(dx, dy) / 2 + 1;

    const x = radius1 * r * Math.cos(a);
    const y = radius1 * r * Math.sin(a);

    pts.push([x, y]);
  }

  for (let i = 0; i < nPts; i++) {
    const a = angle2 - ((angle2 - angle1) / nPts) * i;
    const dx = s * Math.cos(a);
    const dy = s * Math.sin(a);

    const r = simplex.noise2D(dx, dy) / 2 + 1;

    const x = radius2 * r * Math.cos(a);
    const y = radius2 * r * Math.sin(a);

    pts.push([x, y]);
  }
  return pts;
}

const simplex = new SimplexNoise(Math.random);

const sketch = () => {
  const colors = ["#46b3cf", "#19b56e", "#e26553", "#37383d", "#9c3f2d"];

  const bgColor = "#ddd2bc";
  return ({ context, width, height }) => {
    context.lineJoin = "round";
    const rFull = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    const centerPadding = 200;
    context.translate(width / 2, height / 2);

    genBlob(400);
    genBlob(500);
    genBlob(700);
    genBlob(900);
    // const wedge = genWedge(Math.PI / 2, Math.PI * 0.7, 200, 400);

    // drawWedge(context, wedge);

    const nLines = 30;
    const nCircles = 20;
    const dAngle = (Math.PI * 2) / nLines;
    const dRadius = (rFull - centerPadding) / nCircles;

    // const blobPoly = genBlob(context, 400);

    // drawPoly(context, blobPoly);

    const blobWedge = genBlobSegment(Math.PI / 2, Math.PI * 0.7, 400, 500);
    // drawPoly(context, blobWedge);

    const wedges = [];
    for (let circleIdx = 0; circleIdx < nCircles; circleIdx++) {
      for (let lineIdx = 0; lineIdx < nLines; lineIdx++) {
        // const r = circleIdx * dRadius + centerPadding;
        // const blobPoly = genBlob(context, r);

        // drawPoly(context, blobPoly);

        const angle1 = lineIdx * dAngle;
        const angle2 = (lineIdx + 1) * dAngle;
        const r1 = circleIdx * dRadius + centerPadding;
        const r2 = (circleIdx + 1) * dRadius + centerPadding;

        wedges.push(genBlobSegment(angle1, angle2, r1, r2));
      }
    }

    for (let wedge of wedges) {
      drawWedge(context, wedge);
    }

    // const mx = width / 2;
    // const my = height / 2;
    // const r = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));

    // context.beginPath();
    // for (let i = 0; i < 10; i++) {
    //   const dx = r * Math.cos(angle * i);
    //   const dy = r * Math.sin(angle * i);

    //   context.moveTo(mx, my);
    //   context.lineTo(mx + dx, my + dy);
    // }
    // context.stroke();

    // context.beginPath();
    // for (let i = 0; i < nCircles; i++) {
    //   const r1 = (r / nCircles) * i;
    //   context.arc(mx, my, r1, 0, 2 * Math.PI);
    // }
    // context.stroke();
  };
};

canvasSketch(sketch, settings);
