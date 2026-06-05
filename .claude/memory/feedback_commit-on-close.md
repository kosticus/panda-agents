---
name: Commit and clean up on ticket close
description: Always commit ticket status changes and related files immediately after closing a ticket — don't wait for the user to notice
type: feedback
---

When closing a ticket, immediately check `git status` and propose committing the relevant changes (ticket file, any generated output like preview PNGs). Don't wait for the user to ask.

**Why:** The user expects a clean workspace after each unit of work. Leaving uncommitted ticket status changes means the next session starts dirty.

**How to apply:** After every `tk close`, run `git status`, stage the ticket file and any related artifacts, and propose the commit to the user before moving on to the ready list.
