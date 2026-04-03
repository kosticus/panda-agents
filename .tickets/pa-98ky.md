---
id: pa-98ky
status: closed
deps: []
links: []
created: 2026-04-03T01:42:52Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-hkbf
tags: [planned]
---
# Garden zone landmark sprites

Design and implement readable landmark sprites for the garden zone.

pa-hkbf established the wiring infrastructure. The placeholder art was rejected — scattered produce pixels read as "off" pixels, scarecrow post was too thin, shapes unrecognizable at 16x16.

Key file: webview-ui/src/village/groundTiles.ts

## Design

Base texture: tilled soil with crop rows (B=#5A3E20, K=#4A3218, H=#6B4E2A, crop P=#6B8C3A, Q=#8AAC4A)

Working landmarks share: dark outline + bright interior, ~30-40px contiguous feature, 3 distinct colors.

User specifically requested a **scarecrow / plot marker** as one landmark.

### Sprites to replace

1. `garden_produce` — individual red/orange pixels in crop rows (invisible noise)
2. `garden_scarecrow` — thin 1px cross shape (unrecognizable)

Palette entries currently assigned (can be reassigned):
- 0=#D04020 (produce red), 6=#E08030 (produce orange)
- 7=#C8A050 (scarecrow post), 8=#5A3818 (scarecrow hat), 9=#A07030 (scarecrow rag)

#### Acceptance criteria

- Both sprites are 16x16 character grids via toSprite()
- Features are immediately recognizable at rendered scale
- Strong color contrast against tilled soil base
- Scarecrow reads as scarecrow (cross shape with hat, wider than 1px)
- Garden theme

## Notes

**2026-04-03T16:08:20Z**

Started by Kimberly Kost

**2026-04-03T16:20:04Z**

Approved approach: 5-variant expansion following water zone pattern. 3 produce variants (clustered tomatoes/peppers, each ~30-40px contiguous, offset positions for variety) + 2 scarecrow variants (wider 2-3px cross, 4x3 hat, different rag positions). Update gardenLandmarks array to 5 entries, add garden-specific mod-5 hash like water zone. Reuse/reassign palette chars 0,6,7,8,9 — add more if needed. Keep bold centered feature + dark outline + bright interior design language.

**2026-04-03T16:31:22Z**

Replaced garden_produce and garden_scarecrow with 5 readable landmark sprites: 3 produce variants (centered, upper-right, lower-left offset clusters of tomatoes/peppers with dark-red outlines and green stems) + 2 scarecrow variants (wide 2px post, 5x3 hat, 9x2 arms, rag on left vs right). Added palette chars + (#8C2010 dark red outline) and # (#3C7830 stem green). Updated gardenLandmarks array to 5 entries and selectBaseSprite to use mod-5 hash: ((col + row * 2) % 5 + 5) % 5. TypeScript compiles clean.

**2026-04-03T17:39:54Z**

Reworked garden landmark palette and shapes for contrast: scarecrow now uses blue hat (#3848A0), bright yellow post (#E8D050), red rag (#CC3030) — all high-contrast against brown soil. Produce sprites redesigned as single large ~6px round tomatoes with darker outline (#601808), placed at different offsets per variant. Scarecrow shapes unchanged structurally. tsc --noEmit passes clean.

**2026-04-03T18:24:14Z**

Replaced rejected garden landmarks with single centered scarecrow. Dark charcoal hat with wide brim, straw yellow arms, cream shirt, blue pants. Placed at garden zone centroid (computed dynamically, offset 1 tile left). Produce sprites removed per user direction — palette entries orphaned but harmless. garden_scarecrow2 variant defined but unused (only scarecrow v1 placed at centroid). Wiring changed from isLandmarkSpot scatter to single gardenCenter placement.
