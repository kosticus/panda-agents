---
id: pa-x4zj
status: closed
deps: []
links: []
created: 2026-04-04T15:57:34Z
type: task
priority: 2
assignee: Kimberly Kost
tags: [village, sprites, 32x64]
---
# Scale canonical panda to 32x64 base template

Pixel-double the canonical 16x32 neutral down-facing idle panda to 32x64 and refine. This establishes the reference body template that all chore and animation scale-ups will use for consistency.

Source: scripts/generate-panda-sheets.mjs (DN_EARS_HEAD, DN_FACE, DN_BAND, DN_BODY, DN_LEGS_IDLE)

Approach:
- Pixel-double each row (each char becomes a 2x2 block) to produce a 32x64 grid
- Refine at the new resolution: smooth doubling artifacts, add sub-pixel detail where the extra resolution helps (ear shape, eye glint, belly gradient, foot shape)
- Preserve the anatomy proportions: 4-row header, 6 ears+head, 6 face, 3 band, 8 body, 3 legs (all doubled)
- Output the template in choreSprites.ts or a shared location so chore tickets can reference it
- Update or create a preview script for visual validation


## Notes

**2026-04-04T15:59:23Z**

Started by Kimberly Kost

**2026-04-05T01:08:09Z**

Session ended 2026-04-04. Handoff context at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md

**2026-04-05T15:20:35Z**

Session ended 2026-04-04. 5 design iterations completed (none approved yet). Iteration history in ~/pkm/projects/panda-agents/panda-32x64-design-iterations.synth.md. Handoff at ~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/handoff.md
