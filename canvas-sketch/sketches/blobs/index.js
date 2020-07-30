const canvasSketch = require("canvas-sketch");
const SimplexNoise = require("simplex-noise");
const { polylinesToSVG } = require("canvas-sketch-util/penplot");

const settings = {
  // Output size
  // dimensions: [500, 500],
  dimensions: [8, 11],
  pixelsPerInch: 300,
  units: "in",
};

function genPoints(options) {
  const { width, height, totalNum, scale, shiftx, shifty } = options;

  const nCols = 10;
  const nRows = 20;

  let w = width / (width + height);
  let h = height / (width + height);

  let stepnum = Math.sqrt(totalNum / (w * h));
  let wn = Math.floor(stepnum * w);
  let hn = Math.floor(stepnum * h);

  let mwidth = Math.floor(width / wn) * wn;
  let mheight = Math.floor(height / hn) * hn;

  const positions = [];
  const dirs = [];

  const simplex = new SimplexNoise(Math.random);

  const lines = [];
  for (let i = 0; i < nCols; i++) {
    for (let n = 0; n < nRows; n++) {
      let x = (n * width) / nRows;
      let y = (i * height) / nCols;

      // this.positions.push(createVector(x, y));
      positions.push(x, y);

      const angle = Math.PI * simplex.noise2D(x * scale, y);

      dirs.push(angle);

      // const a = dirs[i / 2];

      const dx = 2 * Math.cos(angle);
      const dy = 2 * Math.sin(angle);

      lines.push([
        [x, y],
        [x + dx, y + dy],
      ]);
    }
  }

  return { positions, dirs, lines };
}

const sketch = ({ width, height, units }) => {
  console.log(width, height);
  const { positions, dirs, lines } = genPoints({
    width,
    height,
    totalNum: 300,
    scale: 0.05,
    shiftx: 45253.534,
    shifty: 3424.234,
  });

  return ({ context }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#eff3f4";
    context.fillRect(0, 0, width, height);
    // for (let i = 0; i < positions.length; i += 2) {
    //   const x = positions[i];
    //   const y = positions[i + 1];

    //   // context.beginPath();
    //   // context.moveTo(x, y);
    //   // context.arc(x, y, 3, 0, 2 * Math.PI);
    //   // context.fillStyle = "red";
    //   // context.fill();

    //   const a = dirs[i / 2];

    //   const dx = 2 * Math.cos(a);
    //   const dy = 2 * Math.sin(a);

    //   console.log(x, y, dx, dy);

    //   context.beginPath();
    //   context.moveTo(x, y);
    //   context.lineTo(x + dx, y + dy);
    //   context.strokeStyle = "black";
    //   context.lineWidth = 0.04;
    //   context.stroke();
    // }

    context.beginPath();
    for (let line of lines) {
      const [[x1, y1], [x2, y2]] = line;

      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = "black";
      context.lineWidth = 0.04;
    }
    context.stroke();
    return [
      // Export PNG as first layer
      context.canvas,
      // Export SVG for pen plotter as second layer
      {
        data: polylinesToSVG(lines, {
          width,
          height,
          units,
        }),
        extension: ".svg",
      },
    ];
  };
};

canvasSketch(sketch, settings);
