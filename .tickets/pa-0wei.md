---
id: pa-0wei
status: closed
deps: []
links: []
created: 2026-03-29T01:31:50Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix chop animation: wind-up pose + visible axe handle

Frame 1 (axe raised) has a thin 2K-wide body that looks creepy/skeletal — arms-up doesn't read at 16x32. Frame 2 (axe down) hides the axe handle behind the body — it only appears between the legs, not visible through the body area.

Previous approach (canonical body width only) was too static — body identical in both frames made it look like a bouncing axe. Revised design adds physical effort cues to frame 1.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

Frame 1 (wind-up / axe raised):
- **Widen shoulders ~2px each side** beyond canonical width at top body/band rows. Target: nearly fill 16px frame width at shoulders to create a "power stance" silhouette suggesting arms spread holding axe overhead.
- **Shift body up ~1px** — compress or remove a leg row so the panda looks like it's stretching into the swing. Creates anticipation and vertical movement between frames.
- Keep axe in accessory rows 0-3 above head (AAHHAA + HH pattern).
- Band rows should transition from the widened shoulders down toward canonical width.

Frame 2 (chop down):
- Canonical body width, normal stance (contrast with widened frame 1).
- Draw HH (handle) pixels through the belly/body rows at center columns (cols 7-8, the belly midline) so the handle is visible descending IN FRONT of the panda from band level to the stump between the legs.
- Keep the axe head embedded in stump at the bottom.

The two frames reinforce each other: frame 1 sells the wind-up through body shape change + vertical shift, frame 2 sells the follow-through via visible handle path.

Key file: scripts/generate-chore-chop-preview.mjs
Canonical body reference: generate-panda-sheets.mjs DN_BODY (widest: KKKKKWWWWWWKKKKK, belly: KKKKWWWGGWWWKKKK)

Acceptance: run `node scripts/generate-chore-chop-preview.mjs`, open panda_chop_preview_8x.png — frame 1 should show a wider-shouldered, slightly raised panda with axe above head (reads as effort/wind-up), frame 2 should show handle clearly descending through the body to the stump.

