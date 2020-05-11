const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  id: 1,
  dimensions: [1000, 1000],
};

const poly = [
  [0, 0],
  [250, 0],
  [250, 250],
  [0, 250],
];

const path = [
  [0, 0],
  [500, -500],
  [1000, 0],
];

function drawPolygon(context, pts) {
  context.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    context.lineTo(pts[i][0], pts[i][1]);
  }
  context.closePath();
}

function drawPath(context, pts) {
  context.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    context.lineTo(pts[i][0], pts[i][1]);
  }
}

function genWavyLine({ amplitude = 25, phase = 0, period = 30 }) {
  const path = [];
  for (let i = 0; i < 1000; i++) {
    const x = (i * 1000) / 1000;
    const y = amplitude * Math.cos(x / period + phase);
    path.push([x, y]);
  }
  return path;
}

function drawWavyLines(
  context,
  { amplitude = 25, phase = 0, period = 30, spacing = 30 } = {}
) {
  const path = genWavyLine({ amplitude, phase, period });

  for (let i = 0; i < 50; i++) {
    context.save();
    context.translate(0, i * spacing);
    drawPath(context, path);
    context.restore();
  }
}

function drawComplicateShape(
  context,
  {
    rotate: { angle = 0, rx = 0, ry = 0 } = {},
    translate: { tx = 0, ty = 0 } = {},
  } = {}
) {
  const strokeWidth1 = random.rangeFloor(3, 10);
  const strokeWidth2 = strokeWidth1 + random.rangeFloor(8, 10);
  const outlineColor = "#754E0D";
  const fillColor = "#ffd333";
  const amplitude = random.rangeFloor(10, 30);
  const phase = random.rangeFloor(0, 2 * Math.PI);
  const period = random.rangeFloor(20, 30);
  const spacing = random.rangeFloor(20, 40);

  context.save();

  context.translate(tx, ty);

  context.translate(rx, ry);
  context.rotate(angle);
  context.translate(-rx, -ry);

  context.scale(0.95, 0.95);
  context.save();

  context.beginPath();
  drawPolygon(context, poly);
  context.clip();

  context.beginPath();
  drawPolygon(context, poly);
  context.strokeStyle = outlineColor;
  context.lineWidth = strokeWidth2;
  context.stroke();

  context.beginPath();
  drawWavyLines(context, { amplitude, phase, period, spacing });
  context.strokeStyle = outlineColor;
  context.lineWidth = strokeWidth2;
  context.stroke();

  context.beginPath();
  drawPolygon(context, poly);
  context.strokeStyle = fillColor;
  context.lineWidth = strokeWidth1;
  context.stroke();

  context.beginPath();
  drawWavyLines(context, { amplitude, phase, period, spacing });
  context.strokeStyle = fillColor;
  context.lineWidth = strokeWidth1;
  context.stroke();

  context.restore();

  context.globalCompositeOperation = "destination-over";

  context.beginPath();
  drawPolygon(context, poly);
  context.strokeStyle = outlineColor;
  context.lineWidth = 18;
  context.stroke();

  context.globalCompositeOperation = "source-over";
  context.beginPath();

  drawPolygon(context, poly);
  context.strokeStyle = fillColor;
  context.lineWidth = 10;
  context.stroke();
  context.restore();
}

const sketch = () => {
  const bgColor = "#DBDBCF";

  return ({ context, width, height }) => {
    context.lineJoin = "round";
    context.save();
    context.translate(width / 2, height / 2);
    context.scale(0.69, 0.69);
    context.rotate(Math.PI / 4);
    context.translate(-width / 2, -height / 2);

    drawComplicateShape(context);
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI / 2 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: (3 * Math.PI) / 2 },
    });

    drawComplicateShape(context, { translate: { tx: 500, ty: 0 } });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI / 2 },
      translate: { tx: 500, ty: 0 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI },
      translate: { tx: 500, ty: 0 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: (3 * Math.PI) / 2 },
      translate: { tx: 500, ty: 0 },
    });

    drawComplicateShape(context, { translate: { tx: 0, ty: 500 } });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI / 2 },
      translate: { tx: 0, ty: 500 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI },
      translate: { tx: 0, ty: 500 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: (3 * Math.PI) / 2 },
      translate: { tx: 0, ty: 500 },
    });

    drawComplicateShape(context, { translate: { tx: 500, ty: 500 } });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI / 2 },
      translate: { tx: 500, ty: 500 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: Math.PI },
      translate: { tx: 500, ty: 500 },
    });
    drawComplicateShape(context, {
      rotate: { rx: 250, ry: 250, angle: (3 * Math.PI) / 2 },
      translate: { tx: 500, ty: 500 },
    });

    context.restore();
    context.globalCompositeOperation = "destination-over";

    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
