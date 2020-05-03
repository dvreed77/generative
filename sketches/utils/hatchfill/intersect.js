export function intersect([p1, p2], [p3, p4]) {
  const d21x = p2[0] - p1[0];
  const d21y = p2[1] - p1[1];
  const d43x = p4[0] - p3[0];
  const d43y = p4[1] - p3[1];

  const d = d21x * d43y - d21y * d43x;

  if (d === 0) return -1.0;

  /*
  For our purposes, the first line segment given
  by p1 & p2 is the LONG hatch line running through
  the entire drawing.  And, p3 & p4 describe the
  usually much shorter line segment from a polygon.
  As such, we compute sb first as it's more likely
  to indicate "no intersection".  That is, sa is
  more likely to indicate an intersection with a
  much a long line containing p3 & p4.
  */

  const nb = (p1[1] - p3[1]) * d21x - (p1[0] - p3[0]) * d21y;

  const sb = nb / d;

  if (sb < 0 || sb > 1) return -1.0;

  const na = (p1[1] - p3[1]) * d43x - (p1[0] - p3[0]) * d43y;
  const sa = na / d;

  if (sa < 0 || sa > 1) return -1.0;

  return sa;
}
// """
// Determine if two line segments defined by the four points p1 & p2 and
// p3 & p4 intersect.  If they do intersect, then return the fractional
// point of intersection "sa" along the first line at which the
// intersection occurs.
// """

// # Precompute these values -- note that we're basically shifting from
// #
// #        p = p1 + s (p2 - p1)
// #
// # to
// #
// #         p = p1 + s d
// #
// # where D is a direction vector.  The solution remains the same of
// # course.  We'll just be computing D once for each line rather than
// # computing it a couple of times.

// d21x = p2[0] - p1[0]
// d21y = p2[1] - p1[1]
// d43x = p4[0] - p3[0]
// d43y = p4[1] - p3[1]

// # Denominator
// d = d21x * d43y - d21y * d43x

// # Return now if the denominator is zero
// if d == 0:
//     return -1.0

// # For our purposes, the first line segment given
// # by p1 & p2 is the LONG hatch line running through
// # the entire drawing.  And, p3 & p4 describe the
// # usually much shorter line segment from a polygon.
// # As such, we compute sb first as it's more likely
// # to indicate "no intersection".  That is, sa is
// # more likely to indicate an intersection with a
// # much a long line containing p3 & p4.

// nb = (p1[1] - p3[1]) * d21x - (p1[0] - p3[0]) * d21y

// # Could first check if abs(nb) > abs(d) or if
// # the signs differ.
// sb = float(nb) / float(d)
// if sb < 0 or sb > 1:
//     return -1.0

// na = (p1[1] - p3[1]) * d43x - (p1[0] - p3[0]) * d43y
// sa = float(na) / float(d)
// if sa < 0 or sa > 1:
//     return -1.0

// return sa
