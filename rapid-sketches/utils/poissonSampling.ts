export function* samples([min, max], n, k = 30) {
  if (!(max > min)) throw new Error("max > min");
  let width = max - min;
  let radius = width / (n * 1.5);
  let R = 3 * radius;
  let cellSize = radius * Math.SQRT1_2;
  let gridWidth = Math.ceil(width / cellSize);
  let grid = new Array(gridWidth);
  let queue = [];
  let queueSize = 0;
  let sampleSize = 0;

  function far(x) {
    const i = (x / cellSize) | 0;
    const i0 = Math.max(i - 2, 0);
    const i1 = Math.min(i + 3, gridWidth);
    for (let i = i0; i < i1; ++i) {
      const s = grid[i];
      if (s) {
        const dx = s - x;
        if (Math.abs(dx) < radius) return false;
      }
    }
    return true;
  }

  function sample(x) {
    queue.push(x);
    grid[(x / cellSize) | 0] = x;
    ++sampleSize;
    ++queueSize;
    return x + min;
  }

  yield sample(Math.random() * width);

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
  // Bostock using esoteric js again
  sampling: while (queueSize) {
    let i = (Math.random() * queueSize) | 0;
    let s = queue[i];
    for (let j = 0; j < k; ++j) {
      let r = Math.random();
      let x = s + (r < 0.5 ? -1 : +1) * (radius + Math.random() * radius);
      if (0 <= x && x < width && far(x)) {
        yield sample(x);
        continue sampling;
      }
    }
    queue[i] = queue[--queueSize];
    queue.length = queueSize;
  }
}
