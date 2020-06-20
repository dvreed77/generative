import { canvasSketch, ISettings } from "rapid-sketch";
import { polylineToSVGPath, pathsToSVG } from "../utils/svg/toSVG2";
import { Point } from "../api";
import { drawPath } from "../utils/drawPath";

const settings: ISettings = {
  dimensions: [11, 8.5],
  units: "in",
  pixelsPerInch: 300,
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const paths1 = [
      [
        [1, 2],
        [3, 4],
      ],
    ] as Point[][];
    const paths2 = [
      [
        [10, 8],
        [1, 3],
      ],
    ] as Point[][];

    drawPath(context, paths1[0], { lineWidth: 0.03 });
    drawPath(context, paths2[0], { lineWidth: 0.03 });

    return pathsToSVG(
      [
        { paths: paths1, id: "1" },
        { paths: paths2, id: "2" },
      ],
      {
        width,
        height,
        pixelsPerInch: 300,
        units: "in",
      }
    );
  };
}, settings);
