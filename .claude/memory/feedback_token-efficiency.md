---
name: Token efficiency in subagents
description: Subagents burn tokens by re-reading files redundantly — minimize reads and keep agents focused
type: feedback
---

Subagents are burning through tokens too fast, likely from redundant file reads.

**Why:** User noticed rapid token consumption during execute flows — suspects repeated reads of the same files.

**How to apply:** When dispatching subagents, be explicit about reading each file only once. Keep subagent prompts focused and minimal. Avoid broad exploration — point agents at exact files.
