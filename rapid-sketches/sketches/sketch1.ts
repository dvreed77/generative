import { canvasSketch, ISettings } from "rapid-sketch";

const settings: ISettings = {
  dimensions: [800, 800],
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    console.log(width, height);
    context.beginPath();
    context.moveTo(20, 20);
    context.lineTo(100, 100);
    context.stroke();
  };
}, settings);
