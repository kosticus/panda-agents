---
id: pa-o6ia
status: closed
deps: [pa-qqby]
links: []
created: 2026-03-29T23:15:14Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-qaog
tags: [planned]
---
# Wire chore sprite rendering into village renderer

Add ~15 lines to webview-ui/src/village/renderer.ts to import and render animated chore pandas at their designated zone positions, one per chore.

Reference: existing sleep sprite rendering pattern in renderer.ts lines 82-118.

## Design

4 additions to renderer.ts:

a) Import (after line 5):
   import { CHORE_SPRITES, CHORE_PLACEMENTS, CHORE_FRAME_DURATION_SEC } from './choreSprites.js'

b) State variables (after line 13, next to sleep timer):
   let choreFrameIndex = 0
   let choreTimer = 0

c) Timer tick in renderFrame() (after sleep timer block ending ~line 52):
   choreTimer += deltaTime
   if (choreTimer >= CHORE_FRAME_DURATION_SEC) {
     choreFrameIndex = choreFrameIndex === 0 ? 1 : 0
     choreTimer = 0
   }

d) Drawable loop (after hut loop ending ~line 118, before sort at line 121):
   for (const choreId of Object.keys(CHORE_SPRITES) as Array<keyof typeof CHORE_SPRITES>) {
     const frames = CHORE_SPRITES[choreId]
     const placement = CHORE_PLACEMENTS[choreId]
     drawables.push({
       sprite: frames[choreFrameIndex],
       x: placement.col * TILE_SIZE,
       y: placement.row * TILE_SIZE,
       zY: (placement.row + 2) * TILE_SIZE,
     })
   }

zY = (row + 2) * TILE_SIZE puts the sort key at the sprite's feet (bottom of 2-tile-tall sprite), matching sleep panda zY at line 100.

Verification:
- npx tsc --noEmit must pass
- User visual check: 8 pandas at zone positions, ~1s animation cycle, correct z-ordering relative to huts


## Notes

**2026-03-29T23:36:57Z**

Started by Kimberly Kost

**2026-03-29T23:38:45Z**

Approved approach: 4 surgical insertions to renderer.ts — (a) import choreSprites after line 5, (b) choreFrameIndex/choreTimer state after line 13, (c) timer tick after sleep timer block at line 52, (d) drawable loop after hut loop at line 118 before sort. zY = (row + 2) * TILE_SIZE.

**2026-03-29T23:43:18Z**

4 insertions to renderer.ts: (a) import choreSprites, (b) choreFrameIndex/choreTimer state, (c) chore timer tick after sleep timer, (d) drawable loop for 8 chore pandas with zY=(row+2)*TILE_SIZE. tsc --noEmit passes. Awaiting visual verification.
