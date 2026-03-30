---
id: pa-10re
status: in_progress
deps: []
links: []
created: 2026-03-30T00:51:39Z
type: task
priority: 2
assignee: Kimberly Kost
parent: pa-51zd
tags: [planned]
---
# Sweep broom color and handle fix

Sweep panda's broom blends into the ground at (19,8) on GATHERING zone. Handle needs more contrast and possibly better shape.

## Design

Files to modify:
- webview-ui/src/village/choreSprites.ts — SWEEP_PAL color values for H (handle), possibly R and S (bristles)
- scripts/generate-chore-sweep-preview.mjs — mirror palette RGB changes

Color fix: handle H=#8c6437 blends with ground tones. Lighten to ~#B88850 or add reddish warmth for separation. Bristles (R=#c8a050, S=#b48c3c) are straw-colored — may need brightening if they also blend.

Consider whether the handle character grid needs widening (currently thin) for readability at village scale.

Placement stays at (19,8) on GATHERING zone. No move needed.

Verification: npx tsc --noEmit, user runs sweep preview script, user visual check.


## Notes

**2026-03-30T01:26:37Z**

Started by Kimberly Kost

**2026-03-30T01:41:03Z**

Approved approach: Color-only fix. Handle H: #8C6437 → #A04830 (reddish mahogany), bristles R: #C8A050 → #E0C050 (bright straw), tips S: #B48C3C → #CCB040. Update both choreSprites.ts and generate-chore-sweep-preview.mjs. No grid changes. Verify tsc --noEmit, user runs preview script.

**2026-03-30T01:42:39Z**

Color edits applied: H #8c6437→#a04830, R #c8a050→#e0c050, S #b48c3c→#ccb040 in choreSprites.ts; matching RGB in preview script. tsc --noEmit passes. Committed at 664b503. User still needs to run preview script and visual check.
