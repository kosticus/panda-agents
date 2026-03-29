---
id: pa-io1k
status: open
deps: []
links: []
created: 2026-03-29T01:33:28Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix sweep animation: add headroom so panda looks taller

The sweep panda looks short. It starts at row 2 (only 2 empty rows at top) and the 3-row ground section with bright warm colors draws the eye downward, compressing the panda visually.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

Both frames:
- Reduce broom ground section from 3 rows to 2 rows. Currently: bristles (R), straw (S), dirt (D) = 3 rows. Merge or drop one — e.g., keep R+S and drop D, or keep R+D and drop S.
- Add 1 more EMPTY row at the top (3 empty rows instead of 2).
- The panda body stays canonical size but gets more visual breathing room above.
- Total row count stays at 32 (one fewer ground row, one more empty row at top).

Key file: scripts/generate-chore-sweep-preview.mjs
~8 lines changed (add EMPTY, remove 1 ground row, in each frame).

Acceptance: run `node scripts/generate-chore-sweep-preview.mjs`, open panda_sweep_preview_8x.png — panda should look proportionally taller with more space above the ears.

