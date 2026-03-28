---
id: pa-ndew
status: open
deps: []
links: []
created: 2026-03-28T19:38:07Z
type: task
priority: 2
parent: pa-aua3
tags: [village, sprites, palette]
---
# Revisit bamboo rendering

Current bamboo tiles look rough. Revisit rendering style per design direction in panda-state-model-brainstorm.synth.md:

- Softer palette — more muted, less saturated greens; no harsh black outlines
- Stalk variation — different heights, spacing, lean angles to break grid patterns
- Depth cues — faded/lighter stalks in background, crisper foreground
- Canopy/leaves at top edge

Current bamboo has 3 variants (bamboo1-3) in groundTiles.ts. The palette was already softened in the r2 iteration (commit 9f24929) but may need further work.

Additional context from panda-village-concept-r2.synth.md: bamboo should be a light backdrop that says "bamboo forest" at a glance without competing with pandas and activity stations. The village exists within the forest.

