---
id: pa-udbx
status: in_progress
deps: []
links: []
created: 2026-03-28T19:37:08Z
type: task
priority: 2
parent: pa-aua3
tags: [village, animation, sprites]
---
# Chore animations

Test existing chore animations in-app and create the remaining ones.

Existing (preview scripts only, not yet in runtime):
1. Cooking — body rock over fire pit (generate-chore-cooking-preview.mjs)
2. Chopping wood — V-arms + height change (generate-chore-chop-preview.mjs)
3. Watering/tending crops — crouch vs stand (generate-chore-water-preview.mjs)

Need creation:
4. Fishing — at pond/water zone
5. Building/repairing — at frame/sawhorse landmark
6. Harvesting bamboo — at bamboo cluster
7. Sweeping/cleaning — near shelter
8. Carrying — walking variant (panda holding something while moving)

Design notes (from chore-animation-design-r1.synth.md):
- All 16×32 frame size, 2-frame minimum
- Front-facing only for now; side/back views are future work
- Movement profiles: chopping → building/harvesting share vertical motion; watering → sweeping share bending motion; cooking is its own category
- Carrying layers on walk animation rather than being stationary
- Open: 2-frame bounce may look jerky; a 3rd rest frame might help. Decide after in-app testing.
- Open: different chores may want different animation speeds.

Source: ~/pkm/projects/pixel-agents/chore-animation-design-r1.synth.md


## Notes

**2026-03-28T20:43:34Z**

Added preview scripts for all 5 remaining chore animations: fish (standing cast → seated waiting with bobber), build (mallet raised → mallet down on sawhorse, vertical motion profile matching chop), bamboo (reach high → hunch/pull, vertical motion profile), sweep (broom sweeps left → sweeps right, bending profile matching water), carry (walking variant: left foot forward → right foot forward with bundle at chest). Fixed 3 oversized row strings (17→16 chars) in fish, sweep, and carry scripts before commit.

**2026-03-28T21:27:27Z**

Revised all 5 animations: fishing changed to seated tug, building to sideways hammer, bamboo to pulling shoot. Fixed sweep head proportions and carry body proportions to match canonical panda from generate-panda-sheets.mjs.
