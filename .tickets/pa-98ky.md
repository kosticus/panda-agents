---
id: pa-98ky
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
