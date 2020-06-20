import { convertDistance, units } from "rapid-sketch";
import { Point } from "../types";

export function polylineToSVGPath(
  polyline: Point[],
  { units = "px", viewUnits = "px", precision = 5, pixelsPerInch }
) {
  var commands = [];
  var convertOptions = {
    roundPixel: false,
    precision,
    pixelsPerInch,
  };
  polyline.forEach(function (point, j) {
    var type = j === 0 ? "M" : "L";
    var x = convertDistance(
      point[0],
      units as units,
      viewUnits as units,
      convertOptions
    ).toString();
    var y = convertDistance(
      point[1],
      units as units,
      viewUnits as units,
      convertOptions
    ).toString();
    commands.push(type + x + " " + y);
  });
  return commands.join(" ");
}

function toAttrList(args) {
  return args
    .filter(Boolean)
    .map(function (attr) {
      return attr[0] + '="' + attr[1] + '"';
    })
    .join(" ");
}

interface PathGrp {
  id: string;
  paths: Point[][];
  pathStrs?: string[];
}

export function pathsToSVG(
  pathGrps: PathGrp[],
  {
    width,
    height,
    units = "px",
    pixelsPerInch = 72,
    precision = 5,
    fillStyle = "none",
    strokeStyle = "black",
    lineWidth = 1,
    lineJoin = "round",
    lineCap = "round",
  }: {
    width: number;
    height: number;
    units?: units;
    pixelsPerInch?: number;
    precision?: number;
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    lineJoin?: string;
    lineCap?: string;
  }
) {
  var viewUnits = "px" as units;

  var convertOptions = {
    units: units,
    viewUnits: "px",
    roundPixel: false,
    precision,
    pixelsPerInch,
  };

  const pathGrps2 = pathGrps.map((d) => ({
    ...d,
    pathStrs: d.paths.map((p) => polylineToSVGPath(p, convertOptions)),
  }));

  var viewWidth = convertDistance(
    width,
    units,
    viewUnits,
    convertOptions
  ).toString();
  var viewHeight = convertDistance(
    height,
    units,
    viewUnits,
    convertOptions
  ).toString();

  const pathElements = "";

  const groups = pathGrps2
    .map((pGrp) => {
      const pathElements = pGrp.pathStrs
        .map(function (d) {
          var attrs = toAttrList([["d", d]]);
          return "    <path " + attrs + " />";
        })
        .join("\n");

      const groupAttrs = toAttrList([
        ["id", pGrp.id],
        ["fill", fillStyle],
        ["stroke", strokeStyle],
        ["stroke-width", lineWidth + "" + units],
        lineJoin ? ["stroke-linejoin", lineJoin] : false,
        lineCap ? ["stroke-linecap", lineCap] : false,
      ]);

      return `<g ${groupAttrs}>\n\t${pathElements}\n\t</g>`;
    })
    .join("\n");

  return `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="${width}${units}" height="${height}${units}" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${viewWidth} ${viewHeight}">
    ${groups}
</svg>`;
}
