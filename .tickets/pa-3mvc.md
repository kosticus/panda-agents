---
id: pa-3mvc
status: closed
deps: []
links: []
created: 2026-03-30T00:51:47Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Cook spoon handle color fix

Cook panda's spoon handle is hard to read against the cooking zone ground. Thin 2px diagonal in dark brown disappears.

## Design

Files to modify:
- webview-ui/src/village/choreSprites.ts — COOK_PAL value for P (spoon handle)
- scripts/generate-chore-cooking-preview.mjs — mirror palette RGB change

Color fix: handle P=#644628 (dark brown) is a thin 2px diagonal that's hard to see. Lighten to ~#AA8050 for better contrast against cooking ground.

Consider widening the handle from 2px to 3px in the character grid (COOK_1 and COOK_2) for readability at village scale. This is a grid edit, not just a palette change.

Placement stays at (15,13) on COOKING zone. No move needed.

Verification: npx tsc --noEmit, user runs cooking preview script, user visual check.


## Notes

**2026-03-30T01:48:33Z**

Started by Kimberly Kost

**2026-03-30T01:50:14Z**

Approved approach: Color-only fix. Spoon handle P: #644628 → #AA8050 (warm tan). Update both choreSprites.ts and generate-chore-cooking-preview.mjs. No grid changes. Verify tsc --noEmit, user runs preview script.
