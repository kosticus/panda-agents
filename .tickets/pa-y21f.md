---
id: pa-y21f
status: closed
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


## Notes

**2026-03-29T18:06:00Z**

Started by kimberlykost

**2026-03-29T18:18:50Z**

Redesigned both frames: 3px lean (was 1px), stalk goes from ground-planted (frame 1) to head-height with clear air gap (frame 2). ~8 row vertical shift in stalk position. All row strings verified 16 chars, all characters in color map.

**2026-03-29T18:32:41Z**

Second attempt: reduced lean to 2px (was 3px), stalk now 2px wide (NV) with J-color segment nodes instead of 3px solid NVN. Stalk moves ~4 rows between frames (was 8). Only 1 row of dirt at base (was 5 rows underground). Leaf at stalk top in both frames. Air gap of 3 rows in frame 2 between root and ground.

**2026-03-29T18:57:22Z**

v3: Moved stalk from cols 11-12 to 13-14 (clear of leg area). Added 2 taper rows for smooth body-to-leg transition. Removed stray L/R pixels. Single K paw at grip point — no more arm-hanging look. Stalk at 14-15 above grip, shifts 1px to 13-14 at grip and below.

**2026-03-29T19:13:08Z**

v4: Redesigned using attention panda body-to-leg pattern (pure-W hips row). Stalk NV at fixed cols 14-15 both frames. No floating pixels — dropped leaf L and grip K entirely. Stalk same 8-row length both frames (frame 2 extends into band). Frame 2 has 3-row air gap between stalk bottom and ground.
