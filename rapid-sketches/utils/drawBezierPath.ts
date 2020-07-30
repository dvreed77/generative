export function drawBezierPath(context, bezierShape) {
  context.beginPath();
  context.moveTo(bezierShape[0].pt[0], bezierShape[0].pt[1]);

  for (let i = 1; i < bezierShape.length; i++) {
    context.bezierCurveTo(
      bezierShape[i - 1].armB[0],
      bezierShape[i - 1].armB[1],
      bezierShape[i].armA[0],
      bezierShape[i].armA[1],
      bezierShape[i].pt[0],
      bezierShape[i].pt[1]
    );
  }

  context.bezierCurveTo(
    bezierShape[bezierShape.length - 1].armB[0],
    bezierShape[bezierShape.length - 1].armB[1],
    bezierShape[0].armA[0],
    bezierShape[0].armA[1],
    bezierShape[0].pt[0],
    bezierShape[0].pt[1]
  );

  context.fillStyle = "red";
  context.fill();
}

export function drawBezierPath2(
  context,
  bezierShape,
  { fillColor = "red" } = {}
) {
  context.beginPath();
  context.moveTo(bezierShape[0][0], bezierShape[0][1]);

  for (let i = 3; i < bezierShape.length; i += 3) {
    context.bezierCurveTo(
      bezierShape[i - 1][0],
      bezierShape[i - 1][1],
      bezierShape[i + 1][0],
      bezierShape[i + 1][1],
      bezierShape[i][0],
      bezierShape[i][1]
    );
  }

  context.bezierCurveTo(
    bezierShape[bezierShape.length - 1][0],
    bezierShape[bezierShape.length - 1][1],
    bezierShape[1][0],
    bezierShape[1][1],
    bezierShape[0][0],
    bezierShape[0][1]
  );

  context.fillStyle = fillColor;
  context.fill();
}
