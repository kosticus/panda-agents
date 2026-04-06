---
id: pa-yilb
status: closed
deps: [pa-x4zj]
links: []
created: 2026-04-04T15:58:11Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64, planned]
---
# Scale attention animation to 32x64

Pixel-double the attention (needs-attention) animation from 16x32 to 32x64 and refine. 2 frames: red ! visible with paw raised + ! gone with paw lowered. Not a chore — this is the alert/waving indicator.

Source: scripts/generate-chore-attention-preview.mjs (wave1, wave2)
Reference: pa-x4zj (canonical 32x64 base panda)

Approach:
- Pixel-double existing 16x32 frames to 32x64
- Refine at new resolution using the canonical 32x64 panda body as reference
- Preserve 2-frame animation (! + wave high, no ! + wave low)
- Add to choreSprites.ts or appropriate location
- Update scripts/generate-chore-attention-preview.mjs for visual validation


## Notes

**2026-04-05T22:57:52Z**

Started by Kimberly Kost

**2026-04-05T23:06:09Z**

Approved approach: Pixel-double 16x32 wave1/wave2 to 32x64, refine using BASE_32 body. Add ATTENTION_BIG_PAL/1/2 as standalone exports in choreSprites.ts (not in CHORE_SPRITES_BIG since attention isn't a ChoreId). Update generate-chore-attention-preview.mjs in-place to 32x64.

**2026-04-06T00:09:51Z**

Session feedback on v2 arm design (2026-04-05): 1) Gap between arm and face looks like a hole cut in the face — arm should overlap/connect smoothly. 2) Body is too angular, needs more rounding. 3) Stray pixel on shoulder area. 4) Arm still too narrow at shoulder attachment — something visually off about the connection. 5) Forearm/paw proportions improved (8K paw, 6K forearm) but integration with body needs work. User wants to iterate in next session.

**2026-04-06T01:57:58Z**

Session ended 2026-04-05. v5 arm design REJECTED: arm movement reads as CREEPY, arm still looks too small relative to body, shoulder/band transition is too straight. All approaches v2-v5 have failed — need fundamentally different strategy. Handoff at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md

**2026-04-06T03:16:40Z**

Session 3 (2026-04-05): v6-v8 all read as fist pump. Root cause: wave motion was vertical (up-down) in all attempts. Must be HORIZONTAL (side-to-side). Angled arm shape from v8 is promising — paw separated from face by 2-3W, 5-6K width. Next session: keep arm shape, change animation to horizontal paw movement between frames.
