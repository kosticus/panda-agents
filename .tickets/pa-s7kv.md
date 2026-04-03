---
id: pa-s7kv
status: in_progress
deps: [pa-ee7g]
links: []
created: 2026-04-03T20:45:34Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-v04a
tags: [planned]
---
# Sleep sprite at 32x64 with ZZZ overlays and preview script

Create a new sleeping panda sprite at 32x64 resolution (up from 16x32) for the 2x scale validation. This is the idle state visible in hut doorways. Also scale up the ZZZ animation overlays and update the preview generation script.

At 32x64, the panda has 4x the pixel budget — use this for more detail in the fur, face, and curled sleeping pose.

## Design

#### Files to modify

##### webview-ui/src/village/sleepSprite.ts
- Change `FRAME_W = 16` → `32` (line 12)
- Change `FRAME_H = 32` → `64` (line 13)
- `normalize()` (lines 19-29) uses FRAME_W/FRAME_H directly — works correctly with new values, no code change needed.

**New SLEEP_BODY character grid:**
Create a 32-wide character grid (~48 actual content rows, normalize() pads to 64 with top transparency). The sleeping panda is curled up, viewed from the side/front, fitting within a hut doorway.

Design guidance:
- Use the existing palette: K (black fur), W (white fur), G (gray belly/shading), E (eye glint), N (nose)
- The panda is curled in a sleeping pose — body forms a rounded shape
- At 32x64, ears should be ~6-8px, eye patches ~8-10px across
- Add subtle fur texture (occasional G pixels in white areas, occasional lighter K pixels in black areas)
- Bottom-aligned (feet/body base at the bottom of the frame)

**New ZZZ_FRAMES:**
Scale up proportionally from current 3-5px to ~6-10px. Two frames for the bobbing animation.
- ZZZ_1: the letter shapes slightly larger, maintaining readability
- ZZZ_2: offset variant for animation

`SLEEP_FRAME_DURATION_SEC` stays at 2.5 (no change).

##### scripts/generate-sleep-preview.mjs
- Update `FRAME_W = 16` → `32`
- Update `FRAME_H = 32` → `64`
- Adjust preview scale factor if needed (currently 8x — at 32x64 base, 8x = 256x512px preview, which is fine)

#### Acceptance criteria
- SLEEP_SPRITE is a 64-row × 32-column SpriteData array
- ZZZ_FRAMES contains 2 frames, each larger than the current 3-5px
- normalize() pads correctly to 32x64
- Preview script generates a viewable PNG at the new dimensions
- TypeScript compiles

#### Verification
- Run `npx tsc --noEmit` to verify compilation
- User runs `node scripts/generate-sleep-preview.mjs` and evaluates the sprite visually
- User views sleeping pandas in hut doorways in the village webview


## Notes

**2026-04-03T21:37:00Z**

Started by Kimberly Kost

**2026-04-03T21:41:27Z**

Approved approach: Keep existing K/W/G palette (no E/N — eyes closed). Update FRAME_W=32, FRAME_H=64, design new 32x64 SLEEP_BODY, scale ZZZ_FRAMES to ~6-10px. Update renderer.ts pixel offsets (+16, +24, +8) for 2x positioning. Update preview script dimensions and both character grids. Verify with tsc --noEmit.
