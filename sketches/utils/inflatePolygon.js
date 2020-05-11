const jsts = require("jsts");

function vectorCoordinates2JTS(polygon) {
  var coordinates = [];

  for (var i = 0; i < polygon.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(polygon[i][0], polygon[i][1]));
  }
  return coordinates;
}

export function inflatePolygon(poly, spacing) {
  var geoInput = vectorCoordinates2JTS(poly);
  geoInput.push(geoInput[0]);

  var geometryFactory = new jsts.geom.GeometryFactory();

  var shell = geometryFactory.createPolygon(geoInput);

  var polygon = shell.buffer(
    spacing,
    jsts.operation.buffer.BufferParameters.CAP_FLAT
  );

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.shell.points.coordinates;
  for (let i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push([Math.ceil(oItem.x), Math.ceil(oItem.y)]);
  }
  return inflatedCoordinates;
}

export function offsetPolygon(poly, offset = -10) {
  var geoInput = vectorCoordinates2JTS(poly);
  geoInput.push(geoInput[0]);

  // console.log(geoInput, poly)

  var geometryFactory = new jsts.geom.GeometryFactory();

  var shell = geometryFactory.createPolygon(geoInput);

  var polygon = shell.buffer(
    offset,
    jsts.operation.buffer.BufferParameters.CAP_FLAT
  );

  var inflatedCoordinates = [];
  var oCoordinates;
  oCoordinates = polygon.shell.points.coordinates;
  for (let i = 0; i < oCoordinates.length; i++) {
    var oItem;
    oItem = oCoordinates[i];
    inflatedCoordinates.push([Math.ceil(oItem.x), Math.ceil(oItem.y)]);
  }
  return inflatedCoordinates;
}
