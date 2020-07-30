import { intersect } from "./intersect";

export function getHatchSubPaths(hatchLine, paths) {
  const sValues = [];
  const [p1, p2] = hatchLine;

  for (let path of paths) {
    const s = intersect(hatchLine, path);

    if (s >= 0 && s <= 1) sValues.push(s);
  }

  sValues.sort();

  const intersectionPts = [];
  const hatchLines = [];

  for (let i = 0; i < sValues.length; i += 2) {
    const s1 = sValues[i];
    const s2 = sValues[i + 1];
    const x1 = p1[0] + s1 * (p2[0] - p1[0]);
    const y1 = p1[1] + s1 * (p2[1] - p1[1]);
    const x2 = p1[0] + s2 * (p2[0] - p1[0]);
    const y2 = p1[1] + s2 * (p2[1] - p1[1]);

    intersectionPts.push([x1, y1]);
    intersectionPts.push([x2, y2]);

    hatchLines.push([
      [x1, y1],
      [x2, y2],
    ]);
  }

  return { intersectionPts, hatchLines };
}
