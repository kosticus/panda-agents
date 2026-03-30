---
id: pa-qqby
status: closed
deps: []
links: []
created: 2026-03-29T23:14:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-qaog
tags: [planned]
---
# Create choreSprites.ts with 8 chore animation sprite data

Extract 2-frame pixel art animation data from 8 preview scripts into a new TypeScript module at webview-ui/src/village/choreSprites.ts, following the sleepSprite.ts pattern.

Source scripts: scripts/generate-chore-{cooking,chop,fish,water,bamboo,sweep,build,carry}-preview.mjs
Reference: webview-ui/src/village/sleepSprite.ts (pattern to follow), webview-ui/src/village/types.ts (SpriteData type)

## Design

Follow sleepSprite.ts pattern exactly:
- import SpriteData from './types.js'
- Hex string palette in Record<string, string>
- normalize() to pad rows to FRAME_W=16, columns to FRAME_H=32 (bottom-aligned, pads top)
- toSprite() to convert character grid through palette to SpriteData

Data extraction per chore:
1. Copy palette object C from preview script — convert each [r,g,b] to hex: '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0'). Replace null (for '.') with '' (transparent).
2. Copy the two frame character grid arrays (string arrays passed to n()).
3. Each chore needs its own palette — keys like R, D mean different colors in different scripts.

Common core palette (shared across all):
- K: '#1e1e1e' (black fur), W: '#f5f5f5' (white fur), G: '#d7d7d7' (gray belly), E: '#ffffff' (eye glint), '.': '' (transparent)

CAUTION: water preview script may order frame variables differently from the final frames array — check the actual `frames` array assignment, not just variable names.

Exports:
- type ChoreId = 'cook' | 'chop' | 'fish' | 'water' | 'bamboo' | 'sweep' | 'build' | 'carry'
- CHORE_SPRITES: Record<ChoreId, [SpriteData, SpriteData]>
- CHORE_PLACEMENTS: Record<ChoreId, { col: number; row: number }> with coordinates:
  cook(15,13), chop(7,3), fish(25,15), water(30,13), bamboo(2,6), sweep(19,8), build(23,10), carry(16,5)
- CHORE_FRAME_DURATION_SEC = 1.0

Verification: npx tsc --noEmit must pass.


## Notes

**2026-03-29T23:20:01Z**

Approved approach: Create choreSprites.ts with 8 per-chore palettes (RGB→hex converted from preview scripts), character grid data for 2 frames each, normalize/toSprite helpers copied from sleepSprite.ts. Water frames use [water2, water1] order per script's frames array. Exports ChoreId, CHORE_SPRITES, CHORE_PLACEMENTS, CHORE_FRAME_DURATION_SEC.

**2026-03-29T23:20:10Z**

Started by Kimberly Kost

**2026-03-29T23:25:12Z**

Created choreSprites.ts: 8 per-chore palettes (RGB->hex), 16 character grids (2 frames x 8 chores), normalize/toSprite helpers, exports ChoreId type, CHORE_SPRITES, CHORE_PLACEMENTS, CHORE_FRAME_DURATION_SEC. Water frames use [water2, water1] order per source script. npx tsc --noEmit passes clean.
