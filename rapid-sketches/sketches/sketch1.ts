import { canvasSketch, ISettings } from "rapid-sketch";

const settings: ISettings = {
  dimensions: [800, 800],
  name: "sketch1",
};

canvasSketch(() => {
  return ({ context, width, height, deltaTime }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.beginPath();
    context.moveTo(Math.random() * width, Math.random() * height);
    context.lineTo(100, 100);
    context.stroke();
  };
}, settings);
