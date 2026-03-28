---
id: pa-ilil
status: closed
deps: []
links: []
created: 2026-03-28T02:40:37Z
type: task
priority: 2
parent: pa-h3ca
tags: [planned]
---
# Create village type system

Create webview-ui/src/village/types.ts with village-native type definitions. This is the foundation — all other village files import from it.

No office imports. All types are defined fresh for the village module.

## Design

File: webview-ui/src/village/types.ts

Constants:
- TILE_SIZE = 16

Enums:
- TileType: BAMBOO=0, GRASS=1, PATH=2, WATER=3, COOKING=4, WOODCUTTING=5, GARDEN=6, GATHERING=7, VOID=8
- Direction: DOWN=0, LEFT=1, UP=2, RIGHT=3

Types:
- SpriteData = string[][] (outer=rows, inner=columns; each string is CSS hex like "#6e9b46", empty string "" = transparent)
- Structure = { id: string, type: string, col: number, row: number, backSprite: SpriteData, frontSprite: SpriteData, widthTiles: number, heightTiles: number }
- Drawable = { sprite: SpriteData, x: number, y: number, zY: number }

Convention: use .js extensions in all relative imports (ESM convention — codebase uses moduleResolution: "bundler" with allowImportingTsExtensions in tsconfig.app.json).

Verification: npx tsc --noEmit from webview-ui/ should produce zero errors for this file. Note: tsconfig has strict: true, noUnusedLocals: true, noUnusedParameters: true, verbatimModuleSyntax: true.


## Notes

**2026-03-28T02:52:15Z**

Created webview-ui/src/village/types.ts with TILE_SIZE constant, TileType and Direction as const objects (not enums — erasableSyntaxOnly: true in tsconfig forbids enum syntax), SpriteData type alias, Structure and Drawable interfaces. Used 'as const' + union type pattern matching existing office/types.ts conventions. npx tsc --noEmit passes with zero errors. Committed as e99a027.
