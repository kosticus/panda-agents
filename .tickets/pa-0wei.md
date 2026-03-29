---
id: pa-0wei
status: open
deps: []
links: []
created: 2026-03-29T01:31:50Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix chop animation: canonical body width + visible axe handle

Frame 1 (axe raised) has a thin 2K-wide body that looks creepy/skeletal. Frame 2 (axe down) hides the axe handle behind the body — it only appears between the legs, not visible through the body area.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

Frame 1 (axe raised):
- Replace thin-body rows (currently `...KKWWWWWWKK...` = 2K per arm) with canonical width (5K/4K per arm, e.g., `KKKKKWWWWWWKKKKK`). Reference: generate-panda-sheets.mjs DN_BODY lines 107-116.
- Keep axe in accessory rows 0-3 above head (AAHHAA + HH pattern). The tool-above-head pattern is sufficient to communicate "arms raised" without needing the body to look different.
- Band rows should also be canonical width (not narrowed).

Frame 2 (axe down):
- Draw HH (handle) pixels through the belly/body rows at center columns (cols 7-8, the belly midline) so the handle is visible descending IN FRONT of the panda from band level to the stump between the legs.
- Keep the axe head embedded in stump at the bottom.

Key file: scripts/generate-chore-chop-preview.mjs
Canonical body reference: generate-panda-sheets.mjs DN_BODY (widest: KKKKKWWWWWWKKKKK, belly: KKKKWWWGGWWWKKKK)

Acceptance: run `node scripts/generate-chore-chop-preview.mjs`, open panda_chop_preview_8x.png — frame 1 should look like a normal-proportioned panda with axe floating above head, frame 2 should show handle clearly descending through the body to the stump.

