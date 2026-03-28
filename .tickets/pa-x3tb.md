---
id: pa-x3tb
status: open
deps: [pa-3bur, pa-qaog]
links: []
created: 2026-03-28T01:04:25Z
type: feature
priority: 2
tags: [planned, migrated]
---
# Panda character reskin with randomizable variants

Replace human office worker sprites with panda characters. Each agent gets a visually unique panda from randomizable variants (fur color, head accessory, band/neck color). 70 variant sprite sheets already generated. Remaining: multi-view accessories and app integration (CHAR_COUNT 6→70).

## Design

Three sequential tasks: 1) Complete multi-view accessory sprites (sprout+bow side/back views), 2) Integrate 70 panda sprites into app (update CHAR_COUNT, PALETTE_COUNT, remove hue shifting). Variant sheet generator is already complete (generate-panda-sheets.mjs, 70 variants). Migrated from pixel-agents-standalone pas-fqz5.

