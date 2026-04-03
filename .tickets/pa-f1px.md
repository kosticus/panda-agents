---
id: pa-f1px
status: open
deps: []
links: []
created: 2026-04-03T01:42:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-hkbf
tags: [planned]
---
# Gathering zone landmark sprites

Design and implement readable landmark sprites for the gathering (play area) zone.

pa-hkbf established the wiring infrastructure: selectBaseSprite dispatch, variant arrays, palette entries, and placeholder sprites. The placeholder art was rejected — features were too small/scattered, colors didn't contrast against packed earth base, shapes were unrecognizable at 16x16.

Key file: webview-ui/src/village/groundTiles.ts

## Design

The gathering zone is a **fun/play area for pandas** (not a work zone — there is no gathering chore).

Base texture: packed earth (c=#987850, v=#A08860, x=#887048, y=#B09870)

Working landmarks (wood2 stump, cook2-4 fire pits) share these properties:
- Dark outline + bright interior (bark ring around golden heartwood; soot ring around bright flames)
- ~30-40px contiguous feature area (not scattered individual pixels)
- 3 distinct colors that define shape through internal structure
- Feature spans rows 3-9 ish, centered horizontally

### Sprites to replace

1. `gather_flowers` — currently a scattered flower patch that reads as noise
2. `gather_toy` — currently a red ball gradient that's too subtle

Palette entries currently assigned (can be reassigned):
- C=#E85090 (pink), G=#E8D040 (yellow), T=#F0E8E0 (white), U=#50A840 (green)
- V=#D03030 (red), X=#E85050 (red highlight), 1=#901818 (red shadow)

#### Acceptance criteria

- Both sprites are 16x16 character grids via toSprite()
- Features are immediately recognizable at rendered scale
- Strong color contrast against packed earth base
- Features use dark-outline + bright-interior pattern
- Play area theme (flowers, toys, playground elements)
