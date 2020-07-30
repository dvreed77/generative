export function getPaths(polygon) {
  const paths = [];

  let start = polygon[0];
  for (let i = 1; i < polygon.length; i++) {
    const stop = polygon[i];
    paths.push([start, stop]);
    start = stop;
  }

  paths.push([start, polygon[0]]);

  return paths;
}
