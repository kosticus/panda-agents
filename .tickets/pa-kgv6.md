---
id: pa-kgv6
status: closed
deps: [pa-2h2w]
links: []
created: 2026-03-30T00:51:30Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Move bamboo to garden zone and fix stalk colors

Bamboo panda at BAMBOO border (2,6) doesn't read as a chore — just looks like it's at the map edge. Move to enlarged garden where it reads as harvesting/tending. Stalk colors also conflict with garden greens.

## Design

Files to modify:
- webview-ui/src/village/choreSprites.ts — CHORE_PLACEMENTS.bamboo, BAMBOO_PAL color values
- scripts/generate-chore-bamboo-preview.mjs — mirror palette RGB changes

Placement: move from (2,6) to enlarged garden ~(33, 13). Coordinate with other garden chores: water ~(31, 14), dig ~(35, 14). Maintain ~2-3 col separation.

Color fix: bamboo greens clash severely with garden ground:
- Bamboo N=#50a03c vs garden P=#64A050 (both medium green)
- Bamboo J=#3c7828 vs garden Q=#4B823C (both dark green)
Shift bamboo stalks to bright lime/yellow-green: N→~#7CC820, V→~#A0E040, J→~#5AA010. This creates clear separation from the muted garden greens.
Root/dirt colors R=#64461e and D=#8c6432 also overlap garden browns — shift toward red-brown or simplify.

Ground colors for reference (garden): browns #8C6941, #735532, #A58255; greens #64A050, #4B823C

Verification: npx tsc --noEmit, user runs bamboo preview script, user visual check in garden context.


## Notes

**2026-03-30T15:55:00Z**

Started by Kimberly Kost

**2026-03-30T16:17:19Z**

Approved approach: (1) Move CHORE_PLACEMENTS.bamboo from (2,6) to (33,13). (2) Update BAMBOO_PAL: N #50a03c→#7CC820, V #78be50→#A0E040, J #3c7828→#5AA010, D #8c6432→#A05A30. (3) Remove dead R and L palette entries. (4) Mirror all changes in generate-chore-bamboo-preview.mjs. (5) npx tsc --noEmit.

**2026-03-30T16:21:19Z**

Moved bamboo placement from (2,6) to (33,13) in garden zone. Updated BAMBOO_PAL stalk colors: N #50a03c->#7CC820, V #78be50->#A0E040, J #3c7828->#5AA010, D #8c6432->#A05A30. Removed unused L and R palette entries. Mirrored all changes in generate-chore-bamboo-preview.mjs. TypeScript compiles clean (npx tsc --noEmit). Files changed: choreSprites.ts, generate-chore-bamboo-preview.mjs.

**2026-03-30T16:23:18Z**

Done: moved bamboo to (33,13) garden zone, updated stalk colors to bright lime (N=#7CC820 V=#A0E040 J=#5AA010), dirt to warm red-brown (D=#A05A30), removed dead R/L entries. TSC passed, user approved visual. Commit ac81db9. Note: garden zone may need enlarging later for n-pandas-per-station.
