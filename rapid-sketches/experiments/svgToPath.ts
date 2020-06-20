import { canvasSketch, ISettings } from "rapid-sketch";
import { svg } from "../sketches/violet/violet";
import { dave } from "./svg";
import { drawPath } from "../utils/drawPath";

function svgToPath(svgString) {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(svg, "text/xml");

  const svgPaths = xmlDoc.getElementsByTagName("path");

  const pathString = svgPaths[6].attributes["d"].value;

  return dave(pathString);
}

const settings: ISettings = {
  dimensions: [800, 800],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const d = svgToPath(svg);

    drawPath(context, d, { drawPts: false });
  };
}, settings);
