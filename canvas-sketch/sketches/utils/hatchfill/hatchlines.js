// import { Point } from "transformation-matrix";
// import { Line } from "../../types";
// var assert = require("assert");

// Reference
// https://raw.githubusercontent.com/evil-mad/EggBot/master/inkscape_driver/eggbot_hatch.py

export function hatchlines([[bx0, by0], [bx1, by1]], angle, spacing) {
  const width = bx1 - bx0;
  const height = by1 - by0;
  const r = Math.sqrt(width * width + height * height) / 2.0;

  const ca = Math.cos(angle);
  const sa = Math.sin(angle);

  const cx = bx0 + width / 2;
  const cy = by0 + height / 2;

  const lines = [];

  for (let i = -r; i <= r; i += spacing) {
    const x1 = cx + i * ca + r * sa; // i * ca - (-r) * sa
    const y1 = cy + i * sa - r * ca; // i * sa + (-r) * ca
    const x2 = cx + i * ca - r * sa; // i * ca - (+r) * sa
    const y2 = cy + i * sa + r * ca; //i * sa + (+r) * ca

    if ((x1 < bx0 && x2 < bx0) || (x1 > bx1 && x2 > bx1)) {
      continue;
    }
    if ((y1 < by0 && y2 < by0) || (y1 > by1 && y2 > by1)) {
      continue;
    }

    lines.push([
      [x1, y1],
      [x2, y2],
    ]);
  }

  return lines;

  //           i = -r
  //           while i <= r:
  //               # Line starts at (i, -r) and goes to (i, +r)
  //               x1 = cx + (i * ca) + (r * sa)  # i * ca - (-r) * sa
  //               y1 = cy + (i * sa) - (r * ca)  # i * sa + (-r) * ca
  //               x2 = cx + (i * ca) - (r * sa)  # i * ca - (+r) * sa
  //               y2 = cy + (i * sa) + (r * ca)  # i * sa + (+r) * ca
  //               i += spacing
  //               # Remove any potential hatch lines which are entirely
  //               # outside of the bounding box
  //               if (x1 < self.xmin and x2 < self.xmin) or (x1 > self.xmax and x2 > self.xmax):
  //                   continue
  //               if (y1 < self.ymin and y2 < self.ymin) or (y1 > self.ymax and y2 > self.ymax):
  //                   continue
  //               self.grid.append((x1, y1, x2, y2))

  //           sa = math.sin(math.radians(90 - angle))

  // def makeHatchGrid(self, angle, spacing, init=True):  # returns True if succeeds in making grid, else False

  //       """
  //       Build a grid of hatch lines which encompasses the entire bounding
  //       box of the graphical elements we are to hatch.

  //       1. Figure out the bounding box for all of the graphical elements
  //       2. Pick a rectangle larger than that bounding box so that we can
  //          later rotate the rectangle and still have it cover the bounding
  //          box of the graphical elements.
  //       3. Center the rectangle of 2 on the origin (0, 0).
  //       4. Build the hatch line grid in this rectangle.
  //       5. Rotate the rectangle by the hatch angle.
  //       6. Translate the center of the rotated rectangle, (0, 0), to be
  //          the center of the bounding box for the graphical elements.
  //       7. We now have a grid of hatch lines which overlay the graphical
  //          elements and can now be intersected with those graphical elements.
  //       """

  //       # If this is the first call, do some one time initializations
  //       # When generating cross hatches, we may be called more than once
  //       if init:
  //           self.getBoundingBox()
  //           self.grid = []

  //       # Determine the width and height of the bounding box containing
  //       # all the polygons to be hatched
  //       w = self.xmax - self.xmin
  //       h = self.ymax - self.ymin

  //       b_bounding_box_exists = ((w != (EXTREME_NEG - EXTREME_POS)) and (h != (EXTREME_NEG - EXTREME_POS)))
  //       ret_value = b_bounding_box_exists

  //       if b_bounding_box_exists:
  //           # Nice thing about rectangles is that the diameter of the circle
  //           # encompassing them is the length the rectangle's diagonal...
  //           r = math.sqrt(w * w + h * h) / 2.0

  //           # Length of a hatch line will be 2r
  //           # Now generate hatch lines within the square
  //           # centered at (0, 0) and with side length at least d

  //           # While we could generate these lines running back and forth,
  //           # that makes for weird behavior later when applying odd/even
  //           # rules AND there are nested polygons.  Instead, when we
  //           # generate the SVG <path> elements with the hatch line
  //           # segments, we can do the back and forth weaving.

  //           # Rotation information
  //           ca = math.cos(math.radians(90 - angle))
  //           sa = math.sin(math.radians(90 - angle))

  //           # Translation information
  //           cx = self.xmin + (w / 2)
  //           cy = self.ymin + (h / 2)

  //           # Since the spacing may be fractional (e.g., 6.5), we
  //           # don't try to use range() or other integer iterator
  //           spacing = float(abs(spacing))
  //           i = -r
  //           while i <= r:
  //               # Line starts at (i, -r) and goes to (i, +r)
  //               x1 = cx + (i * ca) + (r * sa)  # i * ca - (-r) * sa
  //               y1 = cy + (i * sa) - (r * ca)  # i * sa + (-r) * ca
  //               x2 = cx + (i * ca) - (r * sa)  # i * ca - (+r) * sa
  //               y2 = cy + (i * sa) + (r * ca)  # i * sa + (+r) * ca
  //               i += spacing
  //               # Remove any potential hatch lines which are entirely
  //               # outside of the bounding box
  //               if (x1 < self.xmin and x2 < self.xmin) or (x1 > self.xmax and x2 > self.xmax):
  //                   continue
  //               if (y1 < self.ymin and y2 < self.ymin) or (y1 > self.ymax and y2 > self.ymax):
  //                   continue
  //               self.grid.append((x1, y1, x2, y2))

  //       return ret_value
}
