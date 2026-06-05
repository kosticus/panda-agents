---
name: Don't run preview generation scripts
description: User runs sprite preview scripts themselves and reports back — don't waste tokens generating + viewing PNGs
type: feedback
---

Don't run sprite/animation preview generation scripts or view the resulting PNGs. The user will run them and report back.

**Why:** Running node scripts that generate images and then reading those images burns many tokens for low value — the user can do this faster and cheaper.

**How to apply:** When creating preview scripts, write the code only. Let the user generate and visually verify the output.
