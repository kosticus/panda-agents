---
id: pa-rjqw
status: open
deps: []
links: []
created: 2026-03-28T01:05:07Z
type: bug
priority: 2
tags: [server]
---
# Long-running Bash tools go idle prematurely

A Bash tool running a multi-minute build gets one startIdleTimeout call at tool start (parser.ts:220). If the build takes >2min, the idle timeout fires and transitions to waiting because Bash is not in LONG_RUNNING_TOOLS. The bash_progress events only restart the permission timer, not the idle timer (parser.ts:361-365).

## Design

Either add Bash to LONG_RUNNING_TOOLS, or have bash_progress events reset the idle timer. See pixel-agents-open-items-r2.temp.md inferred issue #5.

