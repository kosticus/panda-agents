---
name: Fixed ground between animation frames
description: Ground, props, and environmental elements must stay at the same row positions across animation frames to avoid visual jumping
type: feedback
---

Ground/environmental elements (soil, crops, walls, floor) must occupy the same rows in every frame of an animation. If the panda crouches or bends, compress the body/legs — don't shift the ground up to fill the gap.

**Why:** Both the build wall (pa-5637) and water crops (pa-t605) initially had the ground shift position between frames, making the environment visually "jump" during animation. Caught during preview review.

**How to apply:** When designing frame 2 of any chore animation where the panda changes posture, keep ground rows fixed and add empty gap rows between the panda's feet and the ground instead.
