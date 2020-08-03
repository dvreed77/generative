import { canvasSketch, ISettings } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import { math } from "rapid-sketch-util";

console.log(math);
const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "piet_mondrian",
};

function genLine(width, height, horizontal) {
  if (horizontal) {
    const x1 = 0;
    const x2 = width;
    const y1 = random.rangeFloor(0, height);
    const y2 = y1;

    return [
      [x1, y1],
      [x2, y2],
    ];
  } else {
    const x1 = random.rangeFloor(0, width);
    const x2 = x1;
    const y1 = 0;
    const y2 = height;

    return [
      [x1, y1],
      [x2, y2],
    ];
  }
}

function drawLine2(context, pts, horizontal) {
  const w = 16;

  if (horizontal) {
    context.beginPath();
    context.moveTo(pts[0][0] - w / 2, pts[0][1] - w / 2);
    context.lineTo(pts[1][0] + w / 2, pts[1][1] - w / 2);
    context.lineTo(pts[1][0] + w / 2, pts[1][1] + w / 2);
    context.lineTo(pts[0][0] - w / 2, pts[0][1] + w / 2);
    context.closePath();
    context.fillStyle = "#e4c837";
    context.fill();
  } else {
    context.beginPath();
    context.moveTo(pts[0][0] - w / 2, pts[0][1] - w / 2);
    context.lineTo(pts[0][0] + w / 2, pts[0][1] - w / 2);
    context.lineTo(pts[1][0] + w / 2, pts[1][1] + w / 2);
    context.lineTo(pts[1][0] - w / 2, pts[1][1] + w / 2);
    context.closePath();
    context.fillStyle = "#e4c837";
    context.fill();
  }
}

function intersection(l1, l2) {
  return math.intersect(l1[0], l1[1], l2[0], l2[1]);
}

function relaxH(hLines) {
  let close = false;
  const padding = 40;
  for (let k = 0; k < 30; k++) {
    for (let i = 0; i < hLines.length; i++) {
      for (let j = 0; j < hLines.length; j++) {
        if (i == j) continue;
        const l1 = hLines[i];
        const l2 = hLines[j];
        const d = Math.abs(l2[0][1] - l1[0][1]);
        if (d < 16) {
          const m = 16 - d;
          console.log("closeH", i, j, d);
          hLines[i][0][1] = l1[0][1] - m / 2 - padding;
          hLines[i][1][1] = l1[1][1] - m / 2 - padding;

          hLines[j][0][1] = l2[0][1] + m / 2 + padding;
          hLines[j][1][1] = l2[1][1] + m / 2 + padding;

          const l1a = hLines[i];
          const l2a = hLines[j];
          const d1 = Math.abs(l2a[0][1] - l1a[0][1]);

          console.log("closeH - end", d1);
        }
      }
    }
  }
}

function relaxV(vLines) {
  let close = false;
  const padding = 40;
  for (let k = 0; k < 30; k++) {
    for (let i = 0; i < vLines.length; i++) {
      for (let j = 0; j < vLines.length; j++) {
        if (i == j) continue;
        const l1 = vLines[i];
        const l2 = vLines[j];
        const d = Math.abs(l2[0][0] - l1[0][0]);
        if (d < 16) {
          const m = 16 - d;
          console.log("close", i, j, d);
          vLines[i][0][0] = l1[0][0] - m / 2 - padding;
          vLines[i][1][0] = l1[1][0] - m / 2 - padding;

          vLines[j][0][0] = l2[0][0] + m / 2 + padding;
          vLines[j][1][0] = l2[1][0] + m / 2 + padding;
        }
      }
    }
  }
}

const sketch = () => {
  const bgColor = "#e1e2dd";
  const jointColors = ["#a31e1f", "#013878"];
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    const nLines = 10;
    const vLines = [];
    for (let i = 0; i < nLines; i++) {
      const line = genLine(width, height, false);
      // drawLine2(context, line, h);
      // drawLine(context, line);
      vLines.push(line);
    }
    vLines.sort((a, b) => a[0][0] - b[0][0]);
    relaxV(vLines);

    const hLines = [];
    for (let i = 0; i < nLines; i++) {
      const line = genLine(width, height, true);
      // drawLine(context, line);
      hLines.push(line);
    }

    hLines.sort((a, b) => a[0][1] - b[0][1]);

    relaxH(hLines);
    // for (let i = 0; i < nLines; i++) {
    //   // const line = genLine(width, height, true);
    //   drawLine(context, hLines[i]);
    //   // hLines.push(line);
    // }

    const vSegments = [];
    for (let i = 0; i < vLines.length; i++) {
      let yStart = 0;
      const x = vLines[i][0][0];
      for (let j = 0; j < hLines.length; j++) {
        const pt = intersection(vLines[i], hLines[j]);
        vSegments.push([
          [x, yStart],
          [x, pt[1]],
        ]);
        yStart = pt[1];
      }
      vSegments.push([
        [x, yStart],
        [x, height],
      ]);
    }

    const hSegments = [];
    for (let i = 0; i < hLines.length; i++) {
      let xStart = 0;
      const y = hLines[i][0][1];
      for (let j = 0; j < vLines.length; j++) {
        const pt = intersection(hLines[i], vLines[j]);
        hSegments.push([
          [xStart, y],
          [pt[0], y],
        ]);
        xStart = pt[0];
      }
      hSegments.push([
        [xStart, y],
        [width, y],
      ]);
    }

    const vSegmentsPruned = vSegments.filter(() => Math.random() > 0.1);

    vSegmentsPruned.forEach((segment) => {
      drawLine2(context, segment, false);
    });

    const hSegmentsPruned = hSegments.filter(() => Math.random() > 0.1);

    hSegmentsPruned.forEach((segment) => {
      drawLine2(context, segment, true);
    });

    for (let i = 0; i < hSegments.length; i++) {
      for (let j = i + 1; j < vSegments.length; j++) {
        const pt = intersection(hSegments[i], vSegments[j]);

        if (pt) {
          context.beginPath();
          context.rect(pt[0] - 8, pt[1] - 8, 16, 16);
          context.fillStyle = random.pick(jointColors);
          context.fill();
        }
      }
    }

    for (let i = 0; i < vSegments.length; i++) {
      for (let j = i + 1; j < hSegments.length; j++) {
        const pt = intersection(vSegments[i], hSegments[j]);

        if (pt) {
          context.beginPath();
          context.rect(pt[0] - 8, pt[1] - 8, 16, 16);
          context.fillStyle = random.pick(jointColors);
          context.fill();
        }
      }
    }

    // const l1 = genLine(width, height, true);

    // drawLine2(context, l1, true);
    // // drawLine(context, l1, { strokeWidth: 5 });

    // const l2 = genLine(width, height, false);
    // drawLine2(context, l2, false);

    // drawLine(context, l2, { strokeWidth: 5 });

    // lines.forEach((line) => drawLine2(context, line));
  };
};

canvasSketch(sketch, settings);
