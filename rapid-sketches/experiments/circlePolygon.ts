import { canvasSketch, ISettings } from "rapid-sketch";
import violet from "../assets/violet.svg";

console.log(typeof violet);
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
