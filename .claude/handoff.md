## Session
- Date: 2026-04-10
- Branch: setup
- Last commit: 72fd3d4 attention 32x64: remove hip flare, extend cheek in wave frame 2
- Working tree: untracked files only (`scripts/plans/`, `.claude/settings.local.json`, `.claude/worktrees/`)

## Active Work
- pa-3dgg: chop 32x64 — animation functional, body needs rounding (too angular vs attention)
- pa-hkbf, pa-j52j, pa-okh6: no work this session

## Next Steps
1. Try the "belly gap" approach on chop frame 1 body — end the arm K above the legs, show 1-2 rows of belly W, then legs start. See `scripts/plans/panda-lower-body-rework.synth.md` for the two valid designs.
2. If belly gap looks right on chop, apply same pattern to the base panda template (`generate-base-panda-32-preview.mjs`).
3. Propagate to remaining sprites with hip shelf (bamboo, build, dig, sweep, water).
4. Revisit whether attention's current fix (arm taper, commit 72fd3d4) aligns with the chosen approach or needs reworking.

## Context
- User wants to try "option 2" (belly gap between arms and legs) before "option 1" (arms reach all the way to legs).
- The hip shelf originated from 16x32→32x64 scale-up doubling rows. At 16x32 the arms-to-legs was compact; at 32x64 the extra rows created an ambiguous black mass.
- Chop frame 1 body is 12 identical rows of 20W — a perfect rectangle. Needs organic rounding to match attention's feel. This is separate from the hip issue but should be addressed together.
- The plan file `scripts/plans/panda-lower-body-rework.synth.md` is untracked — commit it when work begins.
- Known pre-existing from prior session: chop frame 2 row 53 has HH at cols 16-17 but legs have HH at cols 15-16 (1-col misalignment). User has not flagged as blocking.

## Files
- `scripts/generate-chore-attention-preview.mjs` — committed, hip shelf removed + frame 2 cheek fixed
- `scripts/generate-chore-chop-32x64-preview.mjs` — next target for body rounding + hip fix
- `scripts/plans/panda-lower-body-rework.synth.md` — new plan doc (untracked)
