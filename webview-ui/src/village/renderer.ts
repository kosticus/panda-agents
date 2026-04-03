import type { SpriteData, Drawable } from './types.js'
import { TILE_SIZE } from './types.js'
import { getGroundSprite } from './groundTiles.js'
import { createSmallHut, createMediumHut, createLargeHut } from './hutSprites.js'
import { SLEEP_SPRITE, ZZZ_FRAMES, SLEEP_FRAME_DURATION_SEC } from './sleepSprite.js'
import { CHORE_SPRITES, CHORE_PLACEMENTS, CHORE_FRAME_DURATION_SEC } from './choreSprites.js'
import { VILLAGE_COLS, VILLAGE_ROWS, tileMap, HUT_PLACEMENTS } from './tileMap.js'

const BASE_MAP_W = VILLAGE_COLS * TILE_SIZE
const BASE_MAP_H = VILLAGE_ROWS * TILE_SIZE

// --- Animation state (module-level) ---
let sleepFrameIndex = 0
let sleepTimer = 0
let choreFrameIndex = 0
let choreTimer = 0

/** Draw a SpriteData at (x, y) using 1×1 fillRect calls. */
function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteData,
  x: number,
  y: number,
): void {
  for (let r = 0; r < sprite.length; r++) {
    const row = sprite[r]
    for (let c = 0; c < row.length; c++) {
      const color = row[c]
      if (color === '') continue
      ctx.fillStyle = color
      ctx.fillRect(x + c, y + r, 1, 1)
    }
  }
}

/**
 * Render a single frame of the village scene and advance animation state.
 *
 * @param ctx       - Canvas 2D rendering context
 * @param canvasWidth  - Current canvas width in pixels
 * @param canvasHeight - Current canvas height in pixels
 * @param deltaTime    - Seconds elapsed since last frame
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  deltaTime: number,
): void {
  // --- Animation update ---
  sleepTimer += deltaTime
  if (sleepTimer >= SLEEP_FRAME_DURATION_SEC) {
    sleepFrameIndex = sleepFrameIndex === 0 ? 1 : 0
    sleepTimer = 0
  }
  choreTimer += deltaTime
  if (choreTimer >= CHORE_FRAME_DURATION_SEC) {
    choreFrameIndex = choreFrameIndex === 0 ? 1 : 0
    choreTimer = 0
  }

  const currentZzz = ZZZ_FRAMES[sleepFrameIndex]

  // 1. Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 2. Compute scale to fit village in viewport, then center
  ctx.imageSmoothingEnabled = false
  const scale = Math.min(canvasWidth / BASE_MAP_W, canvasHeight / BASE_MAP_H)
  const mapWidth = BASE_MAP_W * scale
  const mapHeight = BASE_MAP_H * scale
  const offsetX = (canvasWidth - mapWidth) / 2
  const offsetY = (canvasHeight - mapHeight) / 2

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)

  // 3. Draw ground grid
  for (let row = 0; row < VILLAGE_ROWS; row++) {
    for (let col = 0; col < VILLAGE_COLS; col++) {
      const tileType = tileMap[row][col]
      const sprite = getGroundSprite(tileType, col, row)
      drawSprite(ctx, sprite, col * TILE_SIZE, row * TILE_SIZE)
    }
  }

  // 4. Build structures and collect drawables
  const drawables: Drawable[] = []

  for (let i = 0; i < HUT_PLACEMENTS.length; i++) {
    const hutPos = HUT_PLACEMENTS[i]

    // Select hut variant based on cluster size
    const hut =
      hutPos.size >= 3
        ? createLargeHut(`hut-${i}`, hutPos.col, hutPos.row)
        : hutPos.size === 2
          ? createMediumHut(`hut-${i}`, hutPos.col, hutPos.row)
          : createSmallHut(`hut-${i}`, hutPos.col, hutPos.row)

    // Hut back layer (doorway interiors)
    drawables.push({
      sprite: hut.backSprite,
      x: hut.col * TILE_SIZE,
      y: hut.row * TILE_SIZE,
      zY: hut.row * TILE_SIZE,
    })

    // One sleeping panda + zzz overlay per doorway
    const hutX = hut.col * TILE_SIZE
    for (const doorPx of hut.doorways) {
      drawables.push({
        sprite: SLEEP_SPRITE,
        x: hutX + doorPx,
        y: (hut.row + 1) * TILE_SIZE,
        zY: (hut.row + 2) * TILE_SIZE + 32,
      })

      drawables.push({
        sprite: currentZzz,
        x: hutX + doorPx + 48,
        y: (hut.row + 1) * TILE_SIZE + 16,
        zY: (hut.row + hut.heightTiles) * TILE_SIZE + 1,
      })
    }

    // Hut front layer (roof, walls, foundation)
    drawables.push({
      sprite: hut.frontSprite,
      x: hut.col * TILE_SIZE,
      y: hut.row * TILE_SIZE,
      zY: (hut.row + hut.heightTiles) * TILE_SIZE,
    })
  }

  for (const choreId of Object.keys(CHORE_SPRITES) as Array<keyof typeof CHORE_SPRITES>) {
    const frames = CHORE_SPRITES[choreId]
    for (const placement of CHORE_PLACEMENTS[choreId]) {
      drawables.push({
        sprite: frames[choreFrameIndex],
        x: placement.col * TILE_SIZE,
        y: placement.row * TILE_SIZE + (placement.dy ?? 0),
        zY: (placement.row + 2) * TILE_SIZE,
      })
    }
  }

  // 5. Sort drawables by zY ascending (painter's algorithm)
  drawables.sort((a, b) => a.zY - b.zY)

  // 6. Draw each drawable
  for (const d of drawables) {
    drawSprite(ctx, d.sprite, d.x, d.y)
  }

  ctx.restore()
}

/**
 * Initialize the village rendering loop.
 *
 * Sets up a requestAnimationFrame loop that tracks deltaTime and calls
 * renderFrame each tick.
 */
export function initVillage(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
): void {
  let lastTime = 0

  function loop(timestamp: number): void {
    const deltaTime = lastTime === 0 ? 0 : (timestamp - lastTime) / 1000
    lastTime = timestamp
    renderFrame(ctx, canvasWidth, canvasHeight, deltaTime)
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
