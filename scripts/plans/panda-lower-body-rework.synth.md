---
id: panda-lower-body-rework
title: "Panda lower body rework — eliminate hip shelf across sprites"
type: synth
status: draft
created: 2026-04-10
tags: [sprite-design, panda-anatomy, BASE_32]
---

## Problem

The BASE_32 panda template has a "hip shelf" — rows of black K between the arm zone and the legs that don't read as either arm or leg. They create an ambiguous structural mass that looks like wide hips or thigh-high boots.

**Root cause** (Inferred): The 16x32→32x64 scale-up doubled the hip rows, turning what was "arms reaching down to legs" at small scale into a visible shelf at larger scale.

## The Two Valid Designs

The lower body reads correctly in exactly two configurations:

1. **Arms reach the legs** — continuous black from arm K down to leg K. Arm and leg merge, no gap, no shelf. The black is *arm* all the way down.
2. **Arms end above the legs** — arms stop, belly W is visible below them for 1-2 rows, then legs start. Clear separation, no unexplained black bridge.

The current design is stuck between these: arms end partway, then 2-4 rows of tapering K that are neither arm nor leg. That ambiguity creates the shelf.

## Preferred Direction

**Try option 2 first** (small belly gap between arms and legs). User wants to see this before committing.

## Affected Sprites

Verified — these files contain the BASE_32 hip shelf pattern (`KKKKKKKKKKWWWWWWWWKKKKKKKKKK`):
- `generate-base-panda-32-preview.mjs` — canonical template
- `generate-chore-bamboo-preview.mjs`
- `generate-chore-build-preview.mjs`
- `generate-chore-chop-32x64-preview.mjs` (frame 1 ear area only)
- `generate-chore-dig-preview.mjs`
- `generate-chore-sweep-preview.mjs`
- `generate-chore-water-preview.mjs`

**Already fixed:** `generate-chore-attention-preview.mjs` — hip shelf replaced with body taper (commit 72fd3d4). This approach removed the shelf but used a different technique (arm K taper + belly narrowing). May need revisiting once the canonical design is settled.

## Open Questions

- How many rows of belly gap looks right between arm end and leg start? (1-2 likely)
- Should the arms taper to a rounded end, or cut off cleanly?
- Does the attention sprite's current fix (arm taper) align with whichever option we pick, or does it need reworking too?
- The 16x32 sprites (bamboo, build, dig, sweep, water) — fix now at 16x32 or wait until they're scaled to 32x64?
