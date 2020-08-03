import { canvasSketch, ISettings } from "rapid-sketch";
const random = require("canvas-sketch-util/random");

const settings: ISettings = {
  dimensions: [1000, 1000],
  name: "dada",
};

const isOdd = (x) => !!(x % 2);

const sketch = async () => {
  const [width, height] = settings.dimensions;
  const colors = [
    "#f9ca24",
    "#abd3dc",
    "#ed3323",
    "#f5dcd0",
    "#eca233",
    "#00a0e4",
    "#ed1e2b",
  ];

  const fonts = [
    "Arial",
    "Verdana",
    "Trebuchet MS",
    "Times New Roman",
    "Didot",
    "American Typewriter",
    "Andale Mono",
    "Courier",
    "Bradley Hand",
    "Luminari",
  ];

  const fontWeights = [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];

  function bigRed(context, text) {
    const w4 = text.split(" ").find((d) => d.length === 4);

    console.log(w4);

    context.fillStyle = "#aa4834";
    const size = random.rangeFloor(200, 300);
    for (let i = 0; i < 4; i++) {
      context.save();
      const font = random.pick(fonts);

      const weight = random.pick(fontWeights);
      context.font = `900 ${size}px sans-serif`;
      context.translate(
        random.rangeFloor(0, width),
        random.rangeFloor(0, height)
      );
      context.rotate(random.range(0, 2 * Math.PI));
      context.fillText(w4, 0, 0);
      context.restore();
    }
  }

  function varWord(context, text) {
    context.save();
    const word = random.pick(text.split(" ").filter((w) => w.length > 5));

    context.fillStyle = "#2e3233";

    context.translate(
      random.rangeFloor(0, width / 2),
      random.rangeFloor(40, height)
    );

    context.rotate(random.range(-Math.PI / 4, Math.PI / 4));

    const baseSize = random.rangeFloor(20, 200);

    let last = 0;
    word.split("").forEach((letter, idx) => {
      const font = random.pick(fonts);
      const size = baseSize + random.rangeFloor(-100, 100);
      const weight = random.pick(fontWeights);
      context.font = `${weight} ${size}px ${font}`;
      context.fillText(letter, last, random.rangeFloor(-10, 10));

      last = context.measureText(letter).width + last;
    });

    context.restore();
  }

  function para(context, text) {
    let w = 0;
    let y = 0;
    const boxWidth = 200;
    context.fillStyle = "black";
    context.font = `normal 30px serif`;

    // context.translate(10, 100);

    text
      .split("")
      .slice(100)
      .forEach((letter) => {
        context.fillText(letter, w, y);
        w = context.measureText(letter).width + w;
        if (w > boxWidth) {
          w = 0;
          y = 40 + y;
        }
      });
  }

  const response = await fetch(
    "https://hipsum.co/api/?type=hipster-centric&sentences=10"
  ).then((r) => r.json());

  const text = response[0];

  return ({ context, width, height }) => {
    context.fillStyle = "#e0d8c1";
    context.fillRect(0, 0, width, height);

    bigRed(context, text);

    for (let i = 0; i < 4; i++) {
      varWord(context, text);
    }
    console.log();

    context.translate(10, 100);
    para(context, text);

    context.translate(600, 100);
    para(context, text);
  };
};

canvasSketch(sketch, settings);
