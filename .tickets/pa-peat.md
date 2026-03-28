---
id: pa-peat
status: open
deps: []
links: [pa-zysq, pa-mgtx]
created: 2026-03-28T01:05:06Z
type: bug
priority: 2
tags: [client, integration]
---
# Sub-agent character leak in React state

agentClosed handler (useExtensionMessages.ts:137-162) filters subagentCharacters by s.parentAgentId !== id. But when a sub-agent itself closes, the filter doesn't match because id is the sub-agent's own ID, not its parent's. The sub-agent entry where s.id === id is never removed. Impact: orphaned entries accumulate in subagentCharacters state.

## Design

Fix: filter should also exclude s.id === id. See pixel-agents-open-items-r2.temp.md bug #2.

