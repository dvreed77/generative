import { pointPointSquaredDistance } from "./distances/pointPointSquaredDistance";

export function pointLineSegmentDistance(point, line) {
  var v = line[0],
    w = line[1],
    d,
    t;
  return Math.sqrt(
    pointPointSquaredDistance(
      point,
      (d = pointPointSquaredDistance(v, w))
        ? (t =
            ((point[0] - v[0]) * (w[0] - v[0]) +
              (point[1] - v[1]) * (w[1] - v[1])) /
            d) < 0
          ? v
          : t > 1
          ? w
          : [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]
        : v
    )
  );
}
