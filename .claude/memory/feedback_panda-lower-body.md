---
name: Panda lower body anatomy rules
description: Hip shelf is wrong — arms must either reach legs (continuous K) or end with visible belly gap before legs. No ambiguous black mass between.
type: feedback
originSessionId: 57183381-ede9-4a8b-b956-44c93ed9c39a
---
The BASE_32 hip shelf (wide K-W-K rows between body and legs) reads as structural hips, not arms. Two valid designs:
1. Arms reach the legs — continuous arm K merges into leg K, no gap
2. Arms end above legs — belly W visible for 1-2 rows between arm end and leg start

The current shelf is neither — arms end but extra K rows bridge the gap without reading as arm or leg.

**Why:** The 16x32→32x64 scale-up doubled the hip rows, turning a compact arm-to-leg transition into a visible shelf. User finds this bothersome across all sprites.

**How to apply:** When drawing or editing the panda lower body at 32x64, choose option 1 or 2 explicitly. Never leave ambiguous K mass between arm zone and legs. User prefers trying option 2 (belly gap) first. Plan at `scripts/plans/panda-lower-body-rework.synth.md`.
