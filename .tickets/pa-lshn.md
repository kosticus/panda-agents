---
id: pa-lshn
status: open
deps: [pa-hkbf]
links: []
created: 2026-04-02T23:03:20Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-okh6
tags: [planned]
---
# Preview script updates for edge blending and decorations

Update the existing preview scripts to showcase the new edge blending and decoration landmarks. Currently the zone palette preview (generate-zone-palette-preview.mjs) shows 5 zones × 2 rows (plain + island edge). The ground preview (generate-ground-preview.mjs) shows grass/path/bamboo variants. Neither reflects the algorithmic compositing or new decoration sprites.

## Design

#### Key files

1. scripts/generate-zone-palette-preview.mjs (~376 lines)
2. scripts/generate-ground-preview.mjs (~362 lines)

##### Zone palette preview updates

Current layout: 5 columns (Water, Garden, Woodcutting, Cooking, Gathering) × 2 rows.

New layout: 5 columns × 3 rows:
- Row 0: Interior tile (base fill)
- Row 1: Edge tile with N-edge blending toward grass (demonstrate the compositing effect)
- Row 2: Landmark decoration variant

To show edge blending in the preview, replicate the blendEdges logic from groundTiles.ts:
- Import or duplicate the dithering algorithm
- Apply it to the base tile sprites with EDGE_N flag
- Use grass palette as the neighbor palette

For Row 2, show one landmark sprite per zone:
- Water: water_lily
- Garden: garden_tall
- Woodcutting: wood_logs (or wood2 stump)
- Cooking: cook2 (existing fire pit)
- Gathering: gather_basket

##### Ground preview updates

Current layout: 3 columns × 4 rows (grass variants, path variants, bamboo variants, composed sample).

Updates needed:
- Replace path3 in the path row with a path-with-edge-blending sample
- Add a 4th row or extend to show groundskeeping: grass base + decoration variants (ground_dirt, ground_leaves, ground_broom)
- The composed sample row could show a path corridor (grass|path|grass) with blending on both sides

##### Palette data

Both scripts have their own palette definitions (C object with RGB arrays). These need to be kept in sync with the P record in groundTiles.ts. For any new palette entries added in pa-hkbf, add corresponding entries to the preview scripts.

Note: Preview scripts use RGB arrays [r, g, b] while groundTiles.ts uses hex strings '#RRGGBB'. Convert as needed.

#### Acceptance criteria

- Zone palette preview shows edge blending effect and decoration landmarks
- Ground preview shows path edge blending and groundskeeping decorations
- All preview PNGs generate without errors
- New palette colors match groundTiles.ts P record values
- Output files: zone_palette_preview_8x.png, ground_palette_preview_8x.png (existing filenames)

#### Verification

Run the preview scripts (user will run them) and inspect output PNGs:
- Edge blending visible in zone preview row 1
- Decoration landmarks visible in zone preview row 2
- Path blending visible in ground preview
- Groundskeeping decorations visible in ground preview

