import { canvasSketch, ISettings } from "rapid-sketch";
import exquisiteConsequencesData from "./exquisiteConsequencesData.json";

const data = exquisiteConsequencesData
  .map((d) => {
    try {
      return {
        bezierShape: JSON.parse(d.bezierShape),
        stroke: JSON.parse(d.stroke),
        color: d.color,
      };
    } catch {}
  })
  .filter((d) => d && d.stroke.length);
const strokeData = data.map((d) => d.stroke);

const settings: ISettings = {
  dimensions: [800, 800],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 400;
    offscreenCanvas.height = 400;

    const c2 = offscreenCanvas.getContext("2d");
    c2.beginPath();
    c2.moveTo(0, 0);
    c2.lineTo(400, 400);
    c2.stroke();

    context.drawImage(offscreenCanvas, 50, 50, 200, 200);

    context.drawImage(offscreenCanvas, 500, 500);
    // myCanvas.offscreenCanvas.width = myCanvas.width;
    // myCanvas.offscreenCanvas.height = myCanvas.height;

    // myCanvas.getContext('2d').drawImage(myCanvas.offScreenCanvas, 0, 0);
  };
}, settings);
