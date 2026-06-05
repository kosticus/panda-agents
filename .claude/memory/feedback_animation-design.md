---
name: Chore animation design constraints by scale
description: Lessons from animation iterations — what works and fails at 16x32 and 32x64 pixel art scales
type: feedback
---

**At 16×32:** tools above the panda's head don't work — arm routing through face reads as stray pixels, removing the arm makes the tool float, and asymmetric silhouettes look broken. Props at or below body level read clearly.

**At 32×64:** overhead tools CAN work. The extra resolution allows arms covering the face to read correctly. Key lessons from chop 32x64 (3 iterations):
- /\ arm branching through face (thin K lines diverging from handle) = creepy, scattered pixels. Fails.
- Clean handle through center with no arm presence (DIG_BIG_2 clone) = works but looks identical to dig. Each chore needs visual identity beyond tool shape.
- Solid K arm blocks covering the face (eyes peek through) + bare belly below (no handle in body) = reads as "arms raised overhead." Distinct from dig. Works.

**Why:** 16x32 constraints from build animation (5+ iterations). 32x64 refinement from chop animation (3 iterations, 2026-04-06).

**How to apply:**
- At 16x32: Props should be at belly level or below
- At 32x64: Overhead tools work IF arms are solid blocks (not thin /\ lines). Avoid scattered single-pixel arm routing.
- Each chore animation needs a distinct visual identity — don't just swap tool shapes on the same body template
- Body movement between frames should be vertical (crouch/drop) not horizontal (left-right shift reads as shimmy)
- Subtle animations (small prop change, no body movement) don't read well — need visible motion
- Full-width props are more visible than small embedded ones
- Wall/ground elements must stay at same row across frames or it looks like the ground is moving
- Always view the generated PNG before finalizing — use Read tool on the output image

**Side-mounted props (bamboo pa-y21f learnings):**
- For props beside the body (stalks, rods), use the fish animation pattern: body W directly borders the prop columns — no K "grip" pixel between body and prop. A single K pixel at 16px reads as a stray/floating pixel, not a paw.
- Keep the prop at fixed columns across both frames (bamboo used cols 14-15). Shift the body horizontally for lean, but the prop stays put.
- Body-to-leg transition: use the attention panda pattern — a pure-W hips row (`...WWWWWWWWWW...`) between the body's K shell and the legs' K blocks. Custom taper rows look wrong.
- Prop length must be equal across frames. If frame 2 pulls the prop up, extend it into higher rows (e.g. band area) so total visible rows match frame 1.
- Avoid isolated single pixels of any color (leaf, root, grip) — they read as noise at this scale. Props should be solid contiguous blocks.
- Band/body K should abut the prop directly (no 1px gap) — the user closed these gaps in final review.
