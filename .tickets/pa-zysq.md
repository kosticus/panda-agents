---
id: pa-zysq
status: open
deps: []
links: [pa-mgtx, pa-peat]
created: 2026-03-28T01:05:06Z
type: bug
priority: 2
tags: [client, integration]
---
# Exclamation overlay lingers after agent closes

Overlay not cleaned up on agentClosed event. Likely related to sub-agent character leak (useExtensionMessages.ts:137-162) and parser timer leak (parser.ts:14-16). The exclamation indicator remains visible after the agent that triggered it has been removed.

