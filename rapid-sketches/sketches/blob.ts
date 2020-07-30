import { canvasSketch, ISettings } from "rapid-sketch";

const settings: ISettings = {
  dimensions: [800, 800],
  name: "blob",
};

canvasSketch(() => {
  return ({ context, width, height }) => {
    context.canvas.style.filter = "url(/static/gooeyFilter.xml#gooey)";

    context.beginPath();
    context.arc(400, 500, 100, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(600, 500, 100, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  };
}, settings);
