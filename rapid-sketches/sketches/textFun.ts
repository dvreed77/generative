import { canvasSketch, ISettings } from "rapid-sketch";
import random from "canvas-sketch-util/random";
import { text } from "./text";
const settings: ISettings = {
  dimensions: [800, 800],
  name: "textFun",
};

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
  fitWidth = fitWidth || 0;
  lineHeight = lineHeight || 20;

  var currentLine = 0;

  var lines = text.split(/\r\n|\r|\n/);
  for (var line = 0; line < lines.length; line++) {
    if (fitWidth <= 0) {
      context.fillText(lines[line], x, y + lineHeight * currentLine);
    } else {
      var words = lines[line].split(" ");
      var idx = 1;
      while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(" ");
        var w = context.measureText(str).width;
        if (w > fitWidth) {
          if (idx == 1) {
            idx = 2;
          }
          context.fillText(
            words.slice(0, idx - 1).join(" "),
            x,
            y + lineHeight * currentLine
          );
          currentLine++;
          words = words.splice(idx - 1);
          idx = 1;
        } else {
          idx++;
        }
      }
      if (idx > 0)
        context.fillText(words.join(" "), x, y + lineHeight * currentLine);
    }
    currentLine++;
  }
}

function splitBox(x0, y0, x1, y1): [number, number, number, number][] {
  const sx = random.gaussian((x0 + x1) / 2, (x1 - x0) * 0.3);
  const sy = random.gaussian((y0 + y1) / 2, (y1 - y0) * 0.1);

  return [
    [x0, y0, sx, sy],
    [sx, y0, x1, sy],
    [x0, sy, sx, y1],
    [sx, sy, x1, y1],
  ];
}

const allBoxes = [];

function recurBoxes(bb: [number, number, number, number], level = 0) {
  const boxes = splitBox(...bb);

  if (level < 3) {
    boxes.forEach((box) => recurBoxes(box, level + 1));
  } else {
    allBoxes.push(...boxes);
  }
}

function fillRectWithText(context, text, startIdx, [x0, y0, x1, y1]) {
  const width = x1 - x0;
  const height = y1 - y0;
  const nLines = random.rangeFloor(2, 6);

  // var d = context.measureText("M");
  // console.log("M", d.actualBoundingBoxAscent - d.actualBoundingBoxDescent);

  const fSize = height / nLines;
  // const fSize = 210;
  context.font = `bold ${fSize}pt helvetica`;

  // console.log(height, fSize, context.font);

  // var d = context.measureText("M");
  // console.log("M", d.actualBoundingBoxAscent - d.actualBoundingBoxDescent);

  let keepGoing = true;
  let curLine = 1;
  let curPos = 0;
  let idx = 0;

  while (keepGoing) {
    const char = text[startIdx + idx];
    var d = context.measureText(char);
    // console.log(d.actualBoundingBoxAscent - d.actualBoundingBoxDescent);
    const w = d.width;
    if (curPos + w <= width) {
      context.fillText(char, x0 + curPos, y0 + fSize * curLine);
      curPos += w;
    } else {
      curPos = 0;
      curLine++;
      if (curLine > nLines) {
        break;
      }
    }
    idx++;
  }

  return startIdx + idx;
}

canvasSketch(() => {
  return ({ context, width, height }) => {
    // const text = "Dave";

    recurBoxes([0, 0, width, height]);

    let idx = 0;
    for (let box of allBoxes) {
      // context.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);

      idx = fillRectWithText(context, text, idx, box);
      if (idx > text.length) idx = 0;
    }

    // fillRectWithText(context, [
    //   width / 2,
    //   height / 2,
    //   width / 2 + 400,
    //   height / 2 + 400,
    // ]);
    // context.strokeRect(width / 2, height / 2, 400, 400);

    // context.font = "bold 30pt helvetica";

    // context.rect(width / 2, height / 2 - 30, 200, 30 * 3);
    // context.stroke();
    // printAtWordWrap(
    //   context,
    //   "HELLO MY NAME IS DAVE",
    //   width / 2,
    //   height / 2,
    //   30,
    //   200
    // );
  };
}, settings);
