import { canvasSketch, ISettings } from "rapid-sketch";

var radius = 2.5,
  width = 960,
  height = 500,
  x0 = radius,
  y0 = radius,
  x1 = width - radius,
  y1 = height - radius,
  active = -1,
  k = 100;

function reset(r, x, y) {
  // context.clearRect(0, 0, width, height);

  var id = ++active,
    inner2 = r * r,
    A = 4 * r * r - inner2,
    cellSize = r * Math.SQRT1_2,
    gridWidth = Math.ceil(width / cellSize),
    gridHeight = Math.ceil(height / cellSize),
    grid = new Array(gridWidth * gridHeight),
    queue = [],
    out = [],
    n = 0,
    count = -1;

  console.log(gridWidth, gridHeight);

  emitSample([x, y]);
  // d3.timer(function () {
  if (id !== active) return true;

  var start = Date.now();
  do {
    var i = (Math.random() * n) | 0,
      p = queue[i];

    for (var j = 0; j < k; ++j) {
      var q = generateAround(p);
      if (withinExtent(q) && !near(q)) {
        emitSample(q);
        break;
      }
    }
    // No suitable candidate found; remove from active queue.
    if (j === k) (queue[i] = queue[--n]), queue.pop();
  } while (n);
  // return !n;
  // });

  return out;

  function emitSample(p) {
    queue.push(p), ++n;
    grid[gridWidth * ((p[1] / cellSize) | 0) + ((p[0] / cellSize) | 0)] = p;

    out.push(p);
    // context.beginPath();
    // context.arc(p[0], p[1], ratio, 0, 2 * Math.PI);
    // context.stroke();
  }

  // Generate point chosen uniformly from spherical annulus between radius r
  // and 2r from p.
  function generateAround(p) {
    var θ = Math.random() * 2 * Math.PI,
      r = Math.sqrt(Math.random() * A + inner2); // http://stackoverflow.com/a/9048443/64009
    return [p[0] + r * Math.cos(θ), p[1] + r * Math.sin(θ)];
  }

  function near(p) {
    var n = 2,
      x = (p[0] / cellSize) | 0,
      y = (p[1] / cellSize) | 0,
      x0 = Math.max(x - n, 0),
      y0 = Math.max(y - n, 0),
      x1 = Math.min(x + n + 1, gridWidth),
      y1 = Math.min(y + n + 1, gridHeight);
    for (var y = y0; y < y1; ++y) {
      var o = y * gridWidth;
      for (var x = x0; x < x1; ++x) {
        var g = grid[o + x];
        if (g && distance2(g, p) < inner2) return true;
      }
    }
    return false;
  }
}

function withinExtent(p) {
  var x = p[0],
    y = p[1];
  return x0 <= x && x <= x1 && y0 <= y && y <= y1;
}

function distance2(a, b) {
  var dx = b[0] - a[0],
    dy = b[1] - a[1];
  return dx * dx + dy * dy;
}

const settings: ISettings = {
  dimensions: [width, height],
  name: "poissonDisc",
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const pts = reset(2 * radius, width / 2, height / 2);

    // console.log(pts);

    context.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      context.moveTo(x, y);
      context.arc(x, y, 2, 0, 2 * Math.PI);
    }
    context.fill();
  };
}, settings);
