// https://observablehq.com/@tophtucker/pathstuff
import {
  paramLengths,
  isRelative,
  applyXY,
  getEndPoint,
  replaceRecursive,
  toXY,
} from "./utils";

const parse = (d) =>
  d
    .trim()
    .split(/(?=[MmLlHhVvCcSsAaQqTtZz])/)
    .map((d) => ({
      type: d.charAt(0),
      values: replaceRecursive(d.substr(1), /([0-9]*\.[0-9]*)\./, "$1 .")
        .replace(/([0-9.])-/g, "$1 -")
        .split(/[\n\s,]/)
        .filter((d) => d.length)
        .map((d) => +d),
    }));

const normalizeImplicitCommandsObj = (pathObject) =>
  [].concat(
    ...pathObject.map(({ type, values }) => {
      if (!values.length) return { type, values };
      const chunks = [];
      for (let i = 0; i < values.length; i += paramLengths[type]) {
        chunks.push(values.slice(i, i + paramLengths[type]));
      }
      return chunks.map((chunk, i) => {
        let newType = type === "M" ? "L" : type === "m" ? "l" : type;
        return { type: i ? newType : type, values: chunk };
      });
    })
  );

// TODO: this should probably just be a loop, not recursive…
export const toAbsoluteObj = (pathObject, last = [0, 0], initial = [0, 0]) => {
  if (!pathObject.length) return [];
  const [first, ...rest] = normalizeImplicitCommandsObj(pathObject);
  const newFirst = {
    type: first.type.toUpperCase(),
    values: isRelative(first)
      ? applyXY(
          (x) => x + last[0],
          (y) => y + last[1]
        )(first)
      : first.values,
  };
  last = getEndPoint(
    newFirst,
    last as [number, number],
    initial as [number, number]
  );
  if (newFirst.type === "M") initial = last;
  return [newFirst, ...toAbsoluteObj(rest, last, initial)];
};

export const pathStringToPath = (pathString) => {
  const relPathObs = parse(pathString);
  const pathObjs = toAbsoluteObj(relPathObs);

  const path = [];
  pathObjs.forEach((pathObj) => {
    const pts = toXY(pathObj, path[path.length - 1]);
    path.push(...pts);
  });

  return path;
};

export function svgToPaths(svgString: string, { pixelsPerInch = 72 } = {}) {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(svgString, "text/xml");

  const svgPaths = xmlDoc.getElementsByTagName("path");

  const paths = [];

  for (let svgPath of svgPaths) {
    const pathString = svgPath.attributes["d"].value;

    const path = pathStringToPath(pathString);

    paths.push(
      path
        .filter((d) => d.length)
        .map(([x, y]) => [x / pixelsPerInch, y / pixelsPerInch])
    );
  }
  return paths;
}
