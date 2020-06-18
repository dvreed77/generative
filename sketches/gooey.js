const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1000, 1000],
};

const sketch = () => {
  return ({ context, width, height, units }) => {
    context.filter =
      "url(https://gist.githubusercontent.com/dvreed77/3fc24cffaee2b9e3124e43bd8be13f29/raw/4924338da2988fe8c86d61152b7cd79fd2c6633d/blob.xml)";

    context.beginPath();
    context.arc(400, 500, 100, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(600, 500, 100, 0, 2 * Math.PI);
    context.fill();
  };
};

canvasSketch(sketch, settings);
