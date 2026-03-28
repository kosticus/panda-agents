---
id: pa-pmsk
status: closed
deps: [pa-ilil]
links: []
created: 2026-03-28T02:40:39Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create sleeping panda sprite frames

Create webview-ui/src/village/sleepSprite.ts with 2 sleeping panda animation frames extracted from the character grids in scripts/generate-sleep-preview.mjs. These are 16x32 pixel frames (1 tile wide, 2 tiles tall).

## Design

File: webview-ui/src/village/sleepSprite.ts
Imports: SpriteData from ./types.js

Source: scripts/generate-sleep-preview.mjs
- Frame 1 (lines ~43-77): sitting slump, head up, eyes closed, Zzz overlay top-right
- Frame 2 (lines ~81-111): deep nod, ears flatten, head drops 2 rows, Zzz shifted

Each frame: 16 columns x 32 rows (read the exact character grids from the script).

Palette:
- K = #1e1e1e (black fur)
- W = #f5f5f5 (white fur)
- G = #d7d7d7 (gray shadow)
- Z = #82b4f0 (Zzz blue)
- '.' = "" (transparent)

Conversion: map each character in the grid to its hex color.

Exports:
- SLEEP_FRAMES: SpriteData[] (array of 2 frames, each 32 rows x 16 cols)
- SLEEP_FRAME_DURATION_SEC: number = 1.0 (time between frame switches)

Verification: tsc --noEmit passes. Frame dimensions should match: each frame has 32 rows, each row has 16 entries.


## Notes

**2026-03-28T03:16:54Z**

Created sleepSprite.ts with 2 frames (32x16 each) converted from generate-sleep-preview.mjs character grids. Palette: K=#1e1e1e, W=#f5f5f5, G=#d7d7d7, Z=#82b4f0, .=transparent. Exports SLEEP_FRAMES (SpriteData[]) and SLEEP_FRAME_DURATION_SEC (1.0). tsc --noEmit passes clean. Runtime verification confirms correct dimensions and color mapping.
