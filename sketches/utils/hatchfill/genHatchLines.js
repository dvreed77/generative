import { hatchlines } from "./hatchlines";
import { getBoundingBox } from "./getBoundingBox";
import { getPaths } from "./getPaths";
import { getHatchSubPaths } from "./getHatchSubPaths";

export function genHatchLines(polygon, angle, spacing) {
  /* 
  1. Get Subpaths of Polygon
  2. Get Bounding Box of Polygon
  3. Get Generate BBox Hashs
  4. Get Hatchlines
  */

  const paths = getPaths(polygon);

  const boundingBox = getBoundingBox(polygon);

  let hatchLines = [];
  for (let hatchLine of hatchlines(boundingBox, angle, spacing)) {
    const { intersectionPts, hatchLines: subHatchLines } = getHatchSubPaths(
      hatchLine,
      paths
    );

    hatchLines = hatchLines.concat(subHatchLines);
  }

  return hatchLines;
}
