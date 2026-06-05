---
name: Add sprites to HTML animation preview
description: New 32x64 sprites must be added to the HTML animation preview page, not just choreSprites.ts and PNG preview scripts
type: feedback
---

Always add new BIG sprites to the HTML animation preview page when scaling chore animations to 32x64.

**Why:** The HTML preview page is the primary visual validation tool for animated sprites — PNG previews are static. Forgetting to update it means the user has to manually wire it in.

**How to apply:** When implementing any 32x64 sprite scale-up ticket, the deliverables include: (1) choreSprites.ts constants, (2) CHORE_SPRITES_BIG registration, (3) preview script, and (4) HTML animation preview page entry.
