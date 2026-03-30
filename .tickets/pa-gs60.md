---
id: pa-gs60
status: open
deps: [pa-2h2w]
links: []
created: 2026-03-30T00:50:51Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Replace carry chore with dig

Remove carry chore entirely and introduce dig (panda with shovel). Carry doesn't work as a stationary animation — dig is a natural 2-frame cycle in the garden zone.

## Design

Files to modify:
- webview-ui/src/village/choreSprites.ts — ChoreId type: 'carry' → 'dig'. Delete CARRY_PAL/CARRY_1/CARRY_2. Add DIG_PAL/DIG_1/DIG_2. Update CHORE_SPRITES and CHORE_PLACEMENTS entries.
- scripts/generate-chore-dig-preview.mjs — new file, copy pattern from generate-chore-carry-preview.mjs
- scripts/animation-test.html — line ~128: change carry entry to { name: 'dig', file: 'panda_dig_preview_8x.png', frames: 2 }
- Delete scripts/generate-chore-carry-preview.mjs

Sprite design:
- Frame 1: standing upright, shovel raised to side
- Frame 2: bent forward, shovel in ground with displaced earth
- Palette: steel gray blade (#A0A0AA), wood handle (#785032), displaced earth browns. Steel gray reads well against garden warm browns (#8C6941, #735532).
- Placement: enlarged garden, ~{ col: 35, row: 14 } (eastern garden, spaced from water and bamboo)

ChoreId type change is atomic — tsc --noEmit enforces all Record<ChoreId, ...> entries update consistently. TypeScript catches any missed 'carry' references at compile time.

Verification: npx tsc --noEmit, user runs dig preview script, user visual check in village.

