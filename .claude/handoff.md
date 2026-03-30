## Session
- Date: 2026-03-30
- Branch: setup (main branch: main)
- Last commit: 1af91da — tk(pa-gs60): add v3 iteration note for session handoff
- Working tree: clean (untracked: .claude/, panda_dig_preview_8x.png is stale — from v1, not v3)

## Active Work
- pa-gs60 [in_progress]: Replace carry chore with dig. v3 sprite committed, awaiting user visual check.
- pa-51zd [open]: Chore panda visual polish — pa-gs60 is the last open child. Closes when pa-gs60 closes.

## Next Steps
1. User runs `node scripts/generate-chore-dig-preview.mjs` and checks the preview
2. If approved: commit the preview PNG, `tk close pa-gs60`, then check if pa-51zd can close (all children done)
3. If needs changes: iterate pixel art in choreSprites.ts lines 625-695 + preview script (must stay in sync)

## Context
- Three iterations of the dig sprite happened this session (v1→v2→v3). v1 had single-pixel handle alongside the right edge — invisible at 8x. v2 moved to single-pixel H at col 10 through belly — still too thin. v3 adopted the CHOP_2 pattern: HH (2px wide) through belly center at cols 7-8, which is the proven readable approach in this codebase.
- Frame 1 has the blade at top (6px wide), HH through ear gap, gap through face (handle behind head), HH through belly. Frame 2 has HH continuously from belly through legs to blade in ground (B-AA-HH-AA-B symmetric).
- User feedback that drove v2→v3: "That did not look much better" after v2. The single-pixel handle was not visible enough at render scale.

## Files
- `webview-ui/src/village/choreSprites.ts` — DIG_PAL/DIG_1/DIG_2 at lines ~613-695. ChoreId type, CHORE_SPRITES, CHORE_PLACEMENTS at bottom.
- `scripts/generate-chore-dig-preview.mjs` — preview script, must match choreSprites.ts frame data exactly
- `scripts/animation-test.html` — line 128, already updated to dig
- Deleted: `scripts/generate-chore-carry-preview.mjs`, `webview-ui/public/assets/characters/panda_carry_preview_8x.png`
