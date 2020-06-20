export function pointPointSquaredDistance(v, w) {
  var dx = v[0] - w[0],
    dy = v[1] - w[1];
  return dx * dx + dy * dy;
}
