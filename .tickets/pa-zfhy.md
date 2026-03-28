---
id: pa-zfhy
status: closed
deps: [pa-ilil, pa-io8r, pa-ee5d, pa-pmsk, pa-18cp]
links: []
created: 2026-03-28T02:40:41Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create minimal village renderer and module barrel

Create webview-ui/src/village/renderer.ts (minimal canvas renderer for the POC) and webview-ui/src/village/index.ts (barrel export). The renderer draws a ground tile grid, Z-sorts hut back layer / sleeping panda / hut front layer, and cycles the sleeping panda between 2 animation frames.

This is the final task — depends on all other village files being complete. After this, tsc --noEmit must pass for the entire webview-ui project.

## Design

Files: webview-ui/src/village/renderer.ts, webview-ui/src/village/index.ts

renderer.ts imports: types.js, groundTiles.js, hutSprites.js, sleepSprite.js, tileMap.js

Render pipeline (renderFrame function):
1. Clear canvas (ctx.clearRect)
2. Compute offset to center village on canvas:
   mapWidth = VILLAGE_COLS * TILE_SIZE, mapHeight = VILLAGE_ROWS * TILE_SIZE
   offsetX = (canvasWidth - mapWidth) / 2, offsetY = (canvasHeight - mapHeight) / 2
3. Draw ground grid: iterate tileMap rows/cols, call getGroundSprite(tileType, col, row), draw sprite at (offsetX + col*TILE_SIZE, offsetY + row*TILE_SIZE)
4. Build structures: for each hutPos in HUT_POSITIONS, createSmallHut(id, hutPos.col, hutPos.row)
5. Collect drawables into array:
   - Hut back layer: { sprite: hut.backSprite, x: hut.col*TILE_SIZE, y: hut.row*TILE_SIZE, zY: hut.row * TILE_SIZE }
   - Sleeping panda: { sprite: currentSleepFrame, x: (hut.col+1)*TILE_SIZE, y: (hut.row+1)*TILE_SIZE, zY: (hut.row+2)*TILE_SIZE + 8 }
     (panda centered in hut doorway, 1 tile right + 1 tile down from hut origin)
   - Hut front layer: { sprite: hut.frontSprite, x: hut.col*TILE_SIZE, y: hut.row*TILE_SIZE, zY: (hut.row + hut.heightTiles) * TILE_SIZE }
6. Sort drawables by zY ascending
7. Draw each drawable at (offsetX + d.x, offsetY + d.y)

Sprite drawing: for a SpriteData (string[][]), iterate rows/cols. For each non-empty string, set ctx.fillStyle to the hex color and ctx.fillRect(x + col, y + row, 1, 1). For performance, consider using ImageData (createImageData, set RGBA per pixel, putImageData) — but fillRect is fine for POC.

Animation state (module-level):
- sleepFrameIndex: number = 0
- sleepTimer: number = 0
- On each frame: sleepTimer += deltaTime; if sleepTimer >= SLEEP_FRAME_DURATION_SEC, toggle sleepFrameIndex (0↔1), reset timer

Export: initVillage(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void
  — sets up requestAnimationFrame loop, tracks deltaTime, calls renderFrame each tick

Export: renderFrame(ctx, canvasWidth, canvasHeight, deltaTime): void
  — single frame render + animation update

index.ts: re-export public API from all village modules:
  export * from './types.js'
  export * from './groundTiles.js'
  export * from './hutSprites.js'
  export * from './sleepSprite.js'
  export * from './tileMap.js'
  export * from './renderer.js'

Verification:
  cd webview-ui && npx tsc --noEmit  (zero errors)
  npm run build from webview-ui/ should succeed


## Notes

**2026-03-28T03:21:58Z**

Created renderer.ts (renderFrame + initVillage) and index.ts barrel export. tsc --noEmit passes with zero errors. npm run build has pre-existing failures in src/office/ (unused locals in OfficeCanvas.tsx and ToolOverlay.tsx) — not caused by this ticket. Commit c25d780.
