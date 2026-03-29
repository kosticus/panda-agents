---
id: pa-o41q
status: closed
deps: []
links: []
created: 2026-03-29T01:33:29Z
type: task
priority: 2
parent: pa-udbx
tags: [planned]
---
# Fix carry animation: add visible paw grip around bundle

The carry animation has a bundle at belly level, but the arms (K = black) are indistinguishable from the body outline (also K). There's no visual evidence of "holding" — the bundle looks embedded in the body rather than carried.

Source plan: ~/pkm/projects/pixel-agents/chore-animation-fixes-r5.synth.md

## Design

Both frames (carry1 and carry2):
- Add W (white paw) pixels at the boundary between arms (K) and bundle (T/X/R) to show paws gripping the package.
- Current bundle rows pattern: `.KKKKWWTTTTWKKKK` — K arms blend into K body outline.
- Fix: narrow the arm K pixels adjacent to the bundle and insert W paw pixels so the grip is visible. E.g.:
  `.KKKWWTTTTWWKKKK` → W pixels visible between arm and bundle on both sides
  `.KKKWWKTTKKWKKKK` → K paw pixels crossing over bundle face (alternative approach)
- The goal is breaking the K-on-K blending so the viewer sees distinct paws wrapping around the bundle.
- Apply the same pattern to both frames (bundle is at same relative position in both, only body lean differs).

Key file: scripts/generate-chore-carry-preview.mjs
~14 lines changed (bundle rows in both frames).

Acceptance: run `node scripts/generate-chore-carry-preview.mjs`, open panda_carry_preview_8x.png — should see white paw pixels visibly wrapping around the bundle, distinguishable from the body outline.


## Notes

**2026-03-29T17:15:23Z**

Started by kimberlykost

**2026-03-29T17:43:23Z**

Redesigned carry bundle: arms (K) directly wrap bundle with no white gap, belly narrows above bundle to transition smoothly, bundle 5px wide with XXRXX face pattern. Stray pixels fixed by eliminating W between arm and bundle.
