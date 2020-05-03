import { Line } from "../../types";

function interstices([p1, p2]: Line, paths: Line[]) {
  /*
    For the line L defined by the points p1 & p2, determine the segments
    of L which lie within the polygons described by the paths stored in
    "paths"

    p1 -- (x,y) coordinate [list]
    p2 -- (x,y) coordinate [list]
    paths -- Dictionary of all the paths to check for intersections

    When an intersection of the line L is found with a polygon edge, then
    the fractional distance along the line L is saved along with the
    lxml.etree node which contained the intersecting polygon edge.  This
    fractional distance is always in the range [0, 1].

    Once all polygons have been checked, the list of fractional distances
    corresponding to intersections is sorted and any duplicates removed.
    It is then assumed that the first intersection is the line L entering
    a polygon; the second intersection the line leaving the polygon.  This
    line segment defined by the first and second intersection points is
    thus a hatch fill line we sought to generate.  In general, our hatch
    fills become the line segments described by intersection i and i+1
    with i an odd value (1, 3, 5, ...).  Since we know the lxml.etree node
    corresponding to each intersection, we can then correlate the hatch
    fill lines to the graphical elements in the original SVG document.
    This enables us to group hatch lines with the elements being hatched.

    The hatch line segments are returned by populating a dictionary.
    The dictionary is keyed off of the lxml.etree node pointer.  Each
    dictionary value is a list of 4-tuples,

        (x1, y1, x2, y2)

    where (x1, y1) and (x2, y2) are the (x,y) coordinates of the line
    segment's starting and ending points.
    */
  // d_and_a = []
  // # p1 & p2 is the hatch line
  // # p3 & p4 is the polygon edge to check
  // for path in paths:
  //     for subpath in paths[path]:
  //         p3 = subpath[0]
  //         for p4 in subpath[1:]:
  //             s = intersect(p1, p2, p3, p4)
  //             if 0.0 <= s <= 1.0:
  //                 # Save this intersection point along the hatch line
  //                 if b_hold_back_hatches:
  //                     # We will need to know how the hatch meets the polygon segment, so that we can
  //                     # calculate the end of a shorter line that stops short
  //                     # of the polygon segment.
  //                     # We compute the angle now while we have the information required,
  //                     # but do _not_ apply it now, as we need the real,original, intersects
  //                     # for the odd/even inside/outside operations yet to come.
  //                     # Note that though the intersect() routine _could_ compute the join angle,
  //                     # we do it here because we go thru here much less often than we go thru intersect().
  //                     angle_hatch_radians = math.atan2(-(p2[1] - p1[1]), (p2[0] - p1[0]))  # from p1 toward p2, cartesian coordinates
  //                     angle_segment_radians = math.atan2(-(p4[1] - p3[1]), (p4[0] - p3[0]))  # from p3 toward p4, cartesian coordinates
  //                     angle_difference_radians = angle_hatch_radians - angle_segment_radians
  //                     # coerce to range -pi to +pi
  //                     if angle_difference_radians > math.pi:
  //                         angle_difference_radians -= 2 * math.pi
  //                     elif angle_difference_radians < -math.pi:
  //                         angle_difference_radians += 2 * math.pi
  //                     f_sin_of_join_angle = math.sin(angle_difference_radians)
  //                     f_abs_sin_of_join_angle = abs(f_sin_of_join_angle)
  //                     if f_abs_sin_of_join_angle != 0.0:  # Worrying about case of intersecting a segment parallel to the hatch
  //                         prelim_length_to_be_removed = f_hold_back_steps / f_abs_sin_of_join_angle
  //                         b_unconditionally_excise_hatch = False
  //                     else:
  //                         b_unconditionally_excise_hatch = True
  //                     if not b_unconditionally_excise_hatch:
  //                         # The relevant end of the segment is the end from which the hatch approaches at an acute angle.
  //                         intersection = [0, 0]
  //                         intersection[0] = p1[0] + s * (p2[0] - p1[0])  # compute intersection point of hatch with segment
  //                         intersection[1] = p1[1] + s * (p2[1] - p1[1])  # intersecting hatch line starts at p1, vectored toward p2,
  //                         # but terminates at intersection
  //                         # Note that atan2 returns answer in range -pi to pi
  //                         # Which end is the approach end of the hatch to the segment?
  //                         # The dot product tells the answer:
  //                         #    if dot product is positive, p2 is at the p4 end,
  //                         #    else p2 is at the p3 end
  //                         # We really don't need to take the time to actually take
  //                         #     the cosine of the angle, we are just interested in
  //                         #    the quadrant within which the angle lies.
  //                         # I'm sure there is an elegant way to do this, but I'll settle for results just now.
  //                         # If the angle is in quadrants I or IV then p4 is the relevant end, otherwise p3 is
  //                         # nb: Y increases down, rather than up
  //                         # nb: difference angle has been forced to the range -pi to +pi
  //                         if abs(angle_difference_radians) < math.pi / 2:
  //                             # It's near the p3 the relevant end from which the hatch departs
  //                             dist_intersection_to_relevant_end = math.hypot(p3[0] - intersection[0], p3[1] - intersection[1])
  //                             dist_intersection_to_irrelevant_end = math.hypot(p4[0] - intersection[0], p4[1] - intersection[1])
  //                         else:
  //                             # It's near the p4 end from which the hatch departs
  //                             dist_intersection_to_relevant_end = math.hypot(p4[0] - intersection[0], p4[1] - intersection[1])
  //                             dist_intersection_to_irrelevant_end = math.hypot(p3[0] - intersection[0], p3[1] - intersection[1])
  //                         # Now, the problem defined in issue 22 is that we may not need to remove the
  //                         # entire preliminary length we've calculated.  This problem occurs because
  //                         # we have so far been considering the polygon segment as a line of infinite extent.
  //                         # Thus, we may be holding back at a point where no holdback is required, when
  //                         # calculated holdback is well beyond the position of the segment end.
  //                         # To make matters worse, we do not currently know whether we're
  //                         # starting a hatch or terminating a hatch, because the duplicates have
  //                         # yet to be removed.  All we can do then, is calculate the required
  //                         # line shortening for both possibilities - and then choose the correct
  //                         # one after duplicate-removal, when actually finalizing the hatches.
  //                         # Let's see if either end, or perhaps both ends, has a case of excessive holdback
  //                         # First, default assumption is that neither end has excessive holdback
  //                         length_remove_starting_hatch = prelim_length_to_be_removed
  //                         length_remove_ending_hatch = prelim_length_to_be_removed
  //                         # Now check each of the two ends
  //                         if prelim_length_to_be_removed > (dist_intersection_to_relevant_end + f_hold_back_steps):
  //                             # Yes, would be excessive holdback approaching from this direction
  //                             length_remove_starting_hatch = dist_intersection_to_relevant_end + f_hold_back_steps
  //                         if prelim_length_to_be_removed > (dist_intersection_to_irrelevant_end + f_hold_back_steps):
  //                             # Yes, would be excessive holdback approaching from other direction
  //                             length_remove_ending_hatch = dist_intersection_to_irrelevant_end + f_hold_back_steps
  //                         d_and_a.append((s, path, length_remove_starting_hatch, length_remove_ending_hatch))
  //                     else:
  //                         d_and_a.append((s, path, 123456.0, 123456.0))  # Mark for complete hatch excision, hatch is parallel to segment
  //                         # Just a random number guaranteed large enough to be longer than any hatch length
  //                 else:
  //                     d_and_a.append((s, path, 0, 0))  # zero length to be removed from hatch
  //             p3 = p4
  // # Return now if there were no intersections
  // if len(d_and_a) == 0:
  //     return None
  // d_and_a.sort()
  // # Remove duplicate intersections.  A common case where these arise
  // # is when the hatch line passes through a vertex where one line segment
  // # ends and the next one begins.
  // # Having sorted the data, it's trivial to just scan through
  // # removing duplicates as we go and then truncating the array
  // n = len(d_and_a)
  // i_last = 1
  // i = 1
  // last = d_and_a[0]
  // while i < n:
  //     if (abs(d_and_a[i][0] - last[0])) > F_MINGAP_SMALL_VALUE:
  //         d_and_a[i_last] = last = d_and_a[i]
  //         i_last += 1
  //     i += 1
  // d_and_a = d_and_a[:i_last]
  // if len(d_and_a) < 2:
  //     return
  // # Now, entries with even valued indices into sa[] are where we start
  // # a hatch line and odd valued indices where we end the hatch line.
  // i = 0
  // while i < (len(d_and_a) - 1):
  //     if d_and_a[i][1] not in hatches:
  //         hatches[d_and_a[i][1]] = []
  //     x1 = p1[0] + d_and_a[i][0] * (p2[0] - p1[0])
  //     y1 = p1[1] + d_and_a[i][0] * (p2[1] - p1[1])
  //     x2 = p1[0] + d_and_a[i + 1][0] * (p2[0] - p1[0])
  //     y2 = p1[1] + d_and_a[i + 1][0] * (p2[1] - p1[1])
  //     # These are the hatch ends if we are _not_ holding off from the boundary.
  //     if not b_hold_back_hatches:
  //         hatches[d_and_a[i][1]].append([[x1, y1], [x2, y2]])
  //     else:
  //         # User wants us to perform a pseudo inset operation.
  //         # We will accomplish this by trimming back the ends of the hatches.
  //         # The amount by which to trim back depends on the angle between the
  //         # intersecting hatch line with the intersecting polygon segment, and
  //         # may well be different at the two different ends of the hatch line.
  //         # To visualize this, imagine a hatch intersecting a segment that is
  //         # close to parallel with it.  The length of the hatch would have to be
  //         # drastically reduced in order that its closest approach to the
  //         # segment be reduced to the desired distance.
  //         # Imagine a Cartesian coordinate system, with the X axis representing the
  //         # polygon segment, and a line running through the origin with a small
  //         # positive slope being the intersecting hatch line.
  //         # We see that we want a Y value of the specified hatch width, and that
  //         # at that Y, the distance from the origin to that point is the
  //         # hypotenuse of the triangle.
  //         #     Y / cutlength = sin(angle)
  //         # therefore:
  //         #   cutlength = Y / sin(angle)
  //         # Fortunately, we have already stored this angle for exactly this purpose.
  //         # For each end, trim back the hatch line by the amount required by
  //         # its own angle.  If the resultant diminished hatch is too short,
  //         # remove it from consideration by marking it as already drawn - a
  //         # fiction, but is much quicker than actually removing the hatch from the list.
  //         f_min_allowed_hatch_length = self.options.hatchSpacing * MIN_HATCH_FRACTION
  //         f_initial_hatch_length = math.hypot(x2 - x1, y2 - y1)
  //         # We did as much as possible of the inset operation back when we were finding intersections.
  //         # We did it back then because at that point we knew more about the geometry than we know now.
  //         # Now we don't know where the ends of the segments are, so we can't address issue 22 here.
  //         f_length_to_be_removed_from_pt1 = d_and_a[i][3]
  //         f_length_to_be_removed_from_pt2 = d_and_a[i + 1][2]
  //         if (f_initial_hatch_length - (f_length_to_be_removed_from_pt1 + f_length_to_be_removed_from_pt2)) <= f_min_allowed_hatch_length:
  //             pass  # Just don't insert it into the hatch list
  //         else:
  //             """
  //             Use:
  //             def RelativeControlPointPosition( self, distance, fDeltaX, fDeltaY, deltaX, deltaY ):
  //                 # returns the point, relative to 0, 0 offset by deltaX, deltaY,
  //                 # which extends a distance of "distance" at a slope defined by fDeltaX and fDeltaY
  //             """
  //             pt1 = self.RelativeControlPointPosition(f_length_to_be_removed_from_pt1, x2 - x1, y2 - y1, x1, y1)
  //             pt2 = self.RelativeControlPointPosition(f_length_to_be_removed_from_pt2, x1 - x2, y1 - y2, x2, y2)
  //             hatches[d_and_a[i][1]].append([[pt1[0], pt1[1]], [pt2[0], pt2[1]]])
  //     # Remember the relative start and end of this hatch segment
  //     last_d_and_a = [d_and_a[i], d_and_a[i + 1]]
  //     i += 2
}
