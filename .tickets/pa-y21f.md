---
id: pa-y21f
status: open
deps: []
links: []
created: 2026-03-29T01:33:27Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix bamboo animation: make pulling action readable

The bamboo stalk barely changes position between frames and the panda's pose barely changes (1px lean). The "pulling bamboo from ground" action is unclear — difficult to understand what the panda is doing.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

The stalk position change must be DRAMATIC — this is the primary motion signal:

Frame 1 (reaching down to grip):
- Panda leans forward 2-3px (shifted left). Arms (K) extend DOWN toward stalk at ground level.
- Bamboo stalk (NVN, 3px wide) runs from arm level all the way to ground. Stalk has roots/dirt (R/D) at base.
- The stalk should be clearly planted in the ground with dirt around its base.

Frame 2 (pulling up):
- Panda leans back 2-3px (shifted right). Body posture shows effort/pulling.
- Bamboo stalk is pulled UP to shoulder/head height — significantly higher than frame 1. Stalk bottom should be ABOVE the legs with roots dangling in air.
- Clear gap between stalk bottom and ground, showing it's been uprooted.
- Ground row shows disturbed dirt / hole where stalk was.

The key visual difference: frame 1 = stalk touches ground, arms reaching down. Frame 2 = stalk held up high, clear gap between stalk and ground.

Key file: scripts/generate-chore-bamboo-preview.mjs
~30 lines of pixel data changed across both frames.

Acceptance: run `node scripts/generate-chore-bamboo-preview.mjs`, open panda_bamboo_preview_8x.png — the "pulling up bamboo" action should be immediately recognizable from the stalk height change between frames.

