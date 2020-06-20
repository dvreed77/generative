export const paramLengths = {
  M: 2,
  m: 2,
  L: 2,
  l: 2,
  H: 1,
  h: 1,
  V: 1,
  v: 1,
  C: 6,
  c: 6,
  S: 4,
  s: 4,
  Q: 4,
  q: 4,
  T: 2,
  t: 2,
  A: 7,
  a: 7,
};

export const isRelative = (d) => d.type === d.type.toLowerCase();

// "rx" is in x-units but not zero-based, notably arc radius, so it should be rescaled but not translated, as even in the absolute coords commands it's relative. same with "ry".
export const applyXY = (x, y, rx?, ry?) => ({ type, values }) => {
  switch (type) {
    case "A":
    case "a":
      return values.map((d, i) => {
        switch (i % paramLengths[type]) {
          case 0:
            return rx ? rx(d) : d;
          case 1:
            return ry ? ry(d) : d;
          case 5:
            return x(d);
          case 6:
            return y(d);
          default:
            return d;
        }
      });
    case "H":
    case "h":
      return values.map(x);
    case "V":
    case "v":
      return values.map(y);
    default:
      return values.map((d, i) => (i % 2 ? y(d) : x(d)));
  }
};

export const getEndPoint = (
  { type, values },
  [x = 0, y = 0],
  [x0 = 0, y0 = 0]
) => {
  switch (type) {
    case "A":
    case "C":
    case "L":
    case "M":
    case "Q":
    case "S":
    case "T":
      return values.slice(values.length - 2);
    case "H":
      return [values[values.length - 1], y];
    case "V":
      return [x, values[values.length - 1]];
    case "a":
    case "c":
    case "l":
    case "m":
    case "q":
    case "s":
    case "t":
      const [dx, dy] = values.slice(values.length - 2);
      return [x + dx, y + dy];
    case "h":
      return [x + values[values.length - 1], y];
    case "v":
      return [x, y + values[values.length - 1]];
    case "Z":
    case "z":
      return [x0, y0];
    default:
      return [x, y];
  }
};

export const replaceRecursive = (str, regex, newThing) => {
  return regex.test(str)
    ? replaceRecursive(str.replace(regex, newThing), regex, newThing)
    : str;
};

const svgTemplate = (
  body
) => `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 792 612" style="enable-background:new 0 0 792 612;" xml:space="preserve">${body}</svg>`;

export const createPath = ({ type, values }, last) => {
  const pathString = svgTemplate(
    `<path d="M ${last[0]} ${last[1]} ${type} ${values.join(" ")}"/>`
  );

  // const pathString = svgTemplate(
  //   `<path d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>`
  // );

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(pathString, "text/xml");

  const svgPath = xmlDoc.getElementsByTagName("path").item(0);

  // console.log(svgPath);
  const pathLength = svgPath.getTotalLength();

  const nPts = Math.floor(pathLength);

  const path = [];
  for (let i = 0; i < nPts; i++) {
    const pt = svgPath.getPointAtLength((i * pathLength) / (nPts - 1));
    path.push([pt.x, pt.y]);
  }

  return path;
};

export const toXY = ({ type, values }, last) => {
  switch (type) {
    // case "A":
    case "C":
      return createPath({ type, values }, last);
    // return [values.slice(values.length - 2)];
    case "L":
      return [values];
    // case "M":
    // case "Q":
    // case "S":
    // case "T":
    //   return values.slice(values.length - 2);
    case "H":
      return [[values[0], last[1]]];
    case "V":
      return [[last[0], values[0]]];
    // case "a":
    // case "c":
    // case "l":
    // case "m":
    // case "q":
    // case "s":
    // case "t":
    //   const [dx, dy] = values.slice(values.length - 2);
    //   return [x + dx, y + dy];
    // case "h":
    //   return [x + values[values.length - 1], y];
    // case "v":
    //   return [x, y + values[values.length - 1]];
    // case "Z":
    // case "z":
    //   return [x0, y0];
    default:
      return [values];
  }
};
