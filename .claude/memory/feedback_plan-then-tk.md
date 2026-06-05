---
name: Plan then tk, don't auto-execute
description: After planning, write the plan doc and stop — don't create tasks or start executing
type: feedback
---

After plan mode approval, write the plan as a PKM synth and stop. Do not create TaskCreate tasks or begin implementation.

**Why:** The user's workflow is plan → `/plan-to-tk` → execute. Jumping straight to execution skips the ticket decomposition step and takes away user control over sequencing.

**How to apply:** When ExitPlanMode completes, write the plan artifact and wait. The user will invoke `/plan-to-tk` when ready to decompose into tickets.
