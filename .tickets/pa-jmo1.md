---
id: pa-jmo1
status: open
deps: []
links: []
created: 2026-03-28T01:05:07Z
type: chore
priority: 3
tags: [client, cleanup]
---
# Double webviewReady sends duplicate initial data

wsApi.ts sends webviewReady on WebSocket open; useExtensionMessages.ts:378 sends it again on React mount via vscode.postMessage. Server calls sendInitialData() twice. Client handlers are idempotent so no visible bugs, but doubles bandwidth on connect.

