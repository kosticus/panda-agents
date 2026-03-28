---
id: pa-mgtx
status: open
deps: []
links: [pa-zysq, pa-peat]
created: 2026-03-28T01:05:06Z
type: bug
priority: 2
tags: [server]
---
# Parser timer leak on agent removal

When fileRemoved fires (index.ts:301-308), pending setTimeout callbacks in parser.ts module-level maps (parser.ts:14-16) are not cancelled. Timers fire on stale agent references and broadcast events for agents the client has already cleaned up. Impact: stale agentStatus or agentToolDone messages after agent removal.

## Design

Add a cleanup function to parser.ts that cancels pending timeouts by agent ID, called from fileRemoved handler. See pixel-agents-open-items-r2.temp.md bug #3.

