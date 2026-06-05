---
name: Village layout style preferences
description: User preferences for how the village tile map should feel — organic, freeform, not grid-like
type: feedback
---

Village layout should feel organic and freeform, not regularly spaced or grid-like.

- Paths should curve gently (shift 1-2 cols between rows), not run perfectly straight
- No symmetric E-W/N-S highway grids through the gathering zone
- Zone shapes should be irregular (different widths per row), not perfect rectangles
- Zones should be large enough to accommodate pandas
- Work zones (cooking, woodcutting) should feel close to the gathering hub, not far away with long formal paths

**Why:** User rejected a layout with evenly-spaced straight paths and regular zone placement as feeling "too regularly spaced." Preferred the earlier more freeform style.

**How to apply:** When editing tileMap.ts, vary path positions row-to-row, use asymmetric zone shapes, and keep functional zones (cooking especially) close to the gathering center.
