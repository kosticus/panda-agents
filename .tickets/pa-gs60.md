---
id: pa-gs60
status: in_progress
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


## Notes

**2026-03-30T21:00:51Z**

Started by Kimberly Kost

**2026-03-30T21:11:27Z**

Approved approach: Replace carry→dig in choreSprites.ts (ChoreId type, delete CARRY_* constants, add DIG_* with steel gray blade/wood handle/earth palette, update CHORE_SPRITES and CHORE_PLACEMENTS to col:35 row:14). New generate-chore-dig-preview.mjs. Update animation-test.html. Delete carry preview script and PNG. Verify with tsc --noEmit.

**2026-03-30T21:38:40Z**

Done: replaced carry with dig in choreSprites.ts (new DIG_PAL/DIG_1/DIG_2, ChoreId updated, placement col:35 row:14). Created generate-chore-dig-preview.mjs. Updated animation-test.html. Deleted carry preview script and PNG. tsc --noEmit: clean (no errors).

**2026-03-30T22:20:30Z**

v3 sprite (commit 8cb6fc8): Redesigned both frames using CHOP pattern — HH 2px handle through center. Frame 1: big blade at top (6px wide), HH through ear gap cols 6-7, gap through face (handle behind head), HH through belly center cols 7-8. Frame 2: HH cols 7-8 through belly/hip/legs/feet into blade in ground (B-AA-HH-AA-B symmetric). Both frames 31 rows. tsc --noEmit passes. USER HAS NOT YET RUN PREVIEW SCRIPT — next step is user runs generate-chore-dig-preview.mjs and visually approves or requests iteration. Previous iterations: v1 had handle alongside right edge (invisible), v2 had single-pixel H at col 10 (too thin). v3 follows proven CHOP_2 pattern. If user approves: amend commit to include preview PNG, close ticket. If user wants changes: iterate on pixel art in choreSprites.ts + preview script, keep in sync.
