## Session
- Date: 2026-06-05
- Branch: setup (main branch: main)
- Last commit: 4f0ab92 — sync: track Claude memory + live handoff in repo
- Working tree: clean except `.claude/settings.local.json` and `.claude/worktrees/` (both local-only, expected untracked)
- Origin: in sync — `setup` fully pushed to `origin/setup`

## Cross-Machine Sync — read this first if you're on a new machine

This session set up cross-machine portability for Claude state. The arrangement:

- `.claude/memory/` (in this repo) is the canonical auto-memory store. The CLAUDE.md path `~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents/memory/` is a **symlink** to it.
- `.claude/handoff.md` (this file) is the canonical handoff. `~/.claude/projects/.../handoff.md` is a **symlink** to it.

**On a fresh clone of this repo on a new machine, before doing any work, set up the symlinks:**

```bash
PROJDIR=~/.claude/projects/-Users-kimberlykost-Documents-Code-panda-agents
REPO=/path/to/panda-agents     # wherever you cloned this repo
mkdir -p "$PROJDIR"
ln -sf "$REPO/.claude/memory"    "$PROJDIR/memory"
ln -sf "$REPO/.claude/handoff.md" "$PROJDIR/handoff.md"
```

The `PROJDIR` name is derived from the repo's absolute path. If the repo isn't at `~/Documents/Code/panda-agents`, the directory name changes (e.g., `~/code/panda-agents` → `-Users-<user>-code-panda-agents`). Cloning to the same path on both machines is the path of least friction.

**Verify symlinks resolve:** `ls -la "$PROJDIR/memory" "$PROJDIR/handoff.md"` should show `->` arrows pointing into the repo.

**What's NOT synced** (per-machine, by design): the `<session-id>.jsonl` transcripts and `<session-id>/subagents/` under `~/.claude/projects/.../`. Memory + handoff + tickets + PKM carry all durable context.

**PKM** lives separately in the user's Obsidian vault and is synced via Obsidian — not via this repo. If a session needs PKM and it's missing on the new machine, check the vault sync status.

## Active Work

In-progress tickets:
- **pa-hkbf** [in_progress] — Zone and groundskeeping decoration landmarks. All children closed. Blocks `pa-okh6` and `pa-lshn`. Check `tk show pa-hkbf` for state.
- **pa-j52j** [in_progress] — Water zone 32x32 landmark sprites. Untouched since 2026-04-04 (per ticket notes). Stale; reconfirm scope before resuming.
- **pa-okh6** [in_progress] — Tile edge blending and zone decorations. Waiting on `pa-lshn` (open) and `pa-hkbf` (in_progress).

Most relevant open tickets:
- **pa-lshn** — Preview script updates for edge blending and decorations (child of pa-hkbf)
- **pa-djhk** — Scale landmark sprites to 32x32
- **pa-s80e / pa-zyes / pa-6qil / pa-3hnf / pa-aw4a** — Per-zone 32x32 landmark sprites (garden, woodcutting, gathering, cooking, groundskeeping)

Full list: `tk list | grep -E "\[(open|in_progress)\]"`

## Recently Completed (don't redo)

- **pa-3dgg** [closed] — Chop 32x64 animation. Frame 1 body reworked with belly bulge + attention-style legs + wind-up jump (957d231). Frame 2 with wood stump (75c68bd).
- **pa-3eaa** [closed] — Dig 32x64 with handle through body.
- **pa-4ayv** [closed] — Bamboo 32x64 scaling (polish deferred).
- **pa-yilb** [closed] — Attention 32x64 v10 horizontal pivot wave; hip flare removed (72fd3d4).
- **pa-oy0c** [closed] — Chopping landmark stumps + frame rework.

## Plans In-Tree

- **`scripts/plans/panda-lower-body-rework.synth.md`** (committed 92288b1) — Documents the two valid lower-body configurations to eliminate the "hip shelf" ambiguity from the 16x32→32x64 scale-up: (1) arms reach legs continuously, or (2) belly gap then legs. The recent chop frame 1 rework applied design #2. Remaining sprites that may still have the hip shelf (per the plan): bamboo, build, dig, sweep, water — verify and propagate.

## Memory Pointers (read these for context the agent needs)

The `.claude/memory/` dir contains:
- `feedback_panda-lower-body.md` — anatomy rules: no hip shelf; arms reach legs OR belly gap before legs
- `feedback_animation-design.md` — props below body work, overhead tools fail at 16x32
- `feedback_no-build-commands.md` / `feedback_no-run-preview-scripts.md` — user runs builds and preview scripts, agent should not
- `feedback_commit-on-close.md` — commit ticket + artifacts immediately after `tk close`
- `feedback_plan-then-tk.md` — write plan doc and stop; user runs `/plan-to-tk` next
- `feedback_html-preview-page.md` — new 32x64 sprites must be added to `scripts/animation-test.html`
- `feedback_fixed-ground-frames.md` — ground/props must stay at same rows across animation frames
- `project_pa03lk-layout-review.md` — v3 layout committed, awaiting user visual feedback
- `project_village-zone-tiles.md` — zone tiles done, layout redesigned, edge-awareness not yet wired
- `project_garden-sizing.md` — garden zone may need enlarging for n-pandas-per-station

## Files

- `webview-ui/src/village/choreSprites.ts` — canonical sprite data. 32x64 variants follow `*_BIG_*` naming and use `BASE_32` body template.
- `scripts/generate-chore-*-preview.mjs` — preview scripts; frame data MUST stay in sync with choreSprites.ts.
- `scripts/animation-test.html` — sprite preview page (open directly in browser, no build step). All `panda_*_preview_8x.png` it references are tracked.
- `webview-ui/public/assets/characters/` — tracked sprites (game runtime + preview PNGs).

## Notes for the new-machine agent

1. **Verify symlinks first** (commands above). If `$PROJDIR/memory` doesn't symlink into the repo, the auto-memory referenced by CLAUDE.md won't load.
2. The repo is at branch `setup`, not `main`. Stay on `setup` unless explicitly instructed otherwise.
3. Run `tk list` to see ticket state — memory and this handoff may lag git truth; tickets are always authoritative.
4. Don't run build commands or preview-generation scripts — the user runs those.
