---
id: pa-qaog
status: closed
deps: [pa-qqby, pa-o6ia]
links: []
created: 2026-03-28T01:04:25Z
type: task
priority: 2
parent: pa-x3tb
tags: [planned, migrated]
---
# Render animated chore pandas in village view

Rescoped from office integration (70-variant sprite sheets) to village path: render one animated panda per chore at its respective zone. Cheap visual preview — not the permanent agent pipeline. Lets us see all 8 chore animations in context and iterate on design. The 70-variant sheets need further work (pa-3bur).

## Design

Two child tasks:
1. pa-qqby: Create webview-ui/src/village/choreSprites.ts — extract 2-frame sprite data from 8 preview scripts following sleepSprite.ts pattern. Exports CHORE_SPRITES, CHORE_PLACEMENTS, CHORE_FRAME_DURATION_SEC.
2. pa-o6ia: Wire into webview-ui/src/village/renderer.ts — ~15 lines: import, timer state, timer tick, drawable loop with z-ordering.

After both children complete: user visual verification — 8 pandas at zone positions, ~1s animation cycle, correct z-ordering.

Source plan: .claude/plans/pure-skipping-church.md


## Notes

**2026-03-29T22:40:46Z**

Started by Kimberly Kost
