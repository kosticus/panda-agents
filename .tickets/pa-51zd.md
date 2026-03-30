---
id: pa-51zd
status: open
deps: [pa-2h2w, pa-gs60, pa-njel, pa-owc2, pa-kgv6, pa-10re, pa-3mvc]
links: []
created: 2026-03-30T00:38:42Z
type: feature
priority: 2
assignee: Kimberly Kost
tags: [planned]
---
# Chore panda visual polish

Visual polish pass on chore panda sprites following initial render review (pa-qaog). Addresses placement errors, color contrast issues, sprite redesigns, and a chore replacement (carry→dig). Source plan: .claude/plans/iterative-stirring-stroustrup.md

## Design

7 child tasks, serialized by choreSprites.ts contention but with logical deps only:

T1: Enlarge garden zone in tileMap.ts (foundation)
T2: Replace carry with dig — new sprite + ChoreId type change (needs T1)
T3: Fish sprite redesign + relocate to water edge (needs T1)
T4: Build move to woodcutting + color fix (independent)
T5: Bamboo move to garden + color fix (needs T1)
T6: Sweep broom color fix (independent)
T7: Cook spoon handle color fix (independent)

After T1, tasks T2-T7 are all ready. User picks freely, one at a time (choreSprites.ts contention). Each task: modify preview script palette/art, user runs script, update choreSprites.ts, npx tsc --noEmit, user visual verification.

Ground color reference for contrast decisions:
- Garden: browns #8C6941 #735532 #A58255, greens #64A050 #4B823C
- Woodcutting: browns #786946 #B49B6E #877D55, dark #645032
- Water: blues #4678AA #5A91C3 #325F8C
- Grass: greens #64913E #82A555 #558234

