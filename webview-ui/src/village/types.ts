export const TILE_SIZE = 16

export const TileType = {
  BAMBOO: 0,
  GRASS: 1,
  PATH: 2,
  WATER: 3,
  COOKING: 4,
  WOODCUTTING: 5,
  GARDEN: 6,
  GATHERING: 7,
  VOID: 8,
  GROUNDSKEEPING: 9,
} as const
export type TileType = (typeof TileType)[keyof typeof TileType]

export const Direction = {
  DOWN: 0,
  LEFT: 1,
  UP: 2,
  RIGHT: 3,
} as const
export type Direction = (typeof Direction)[keyof typeof Direction]

/** Outer array = rows, inner array = columns. Each string is a CSS hex color (e.g. "#6e9b46"), empty string = transparent. */
export type SpriteData = string[][]

export interface Structure {
  id: string
  type: string
  col: number
  row: number
  backSprite: SpriteData
  frontSprite: SpriteData
  widthTiles: number
  heightTiles: number
  /** Tile-column offsets for each doorway center (relative to Structure col). */
  doorways: number[]
}

export interface Drawable {
  sprite: SpriteData
  x: number
  y: number
  zY: number
}
