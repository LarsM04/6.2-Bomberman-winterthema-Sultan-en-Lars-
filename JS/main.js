import { player, drawPlayer, updatePlayer, setupInput } from "./player.js";
import { drawBombsAndExplosions } from "./bomb.js";
import { drawEnemies, updateEnemies } from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 13;
const cols = 13;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

export const TILE = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  BORDER: 3,
};

const tileImages = {};

async function loadTileImages() {
  const imageMap = {
    [TILE.EMPTY]: "assets/tiles/snow floor.webp",
    [TILE.WALL]: "assets/tiles/wall.jpg",
    [TILE.BLOCK]: "assets/tiles/ice.jpg",
    [TILE.BORDER]: "assets/tiles/buitenmuur.jpg",
  };

  for (const [type, src] of Object.entries(imageMap)) {
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = src;
    });
    tileImages[type] = img;
  }
}

export const map = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
];

function drawMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = map[r][c];
      ctx.drawImage(
        tileImages[tile],
        c * tileSize,
        r * tileSize,
        tileSize,
        tileSize,
      );
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();

  updatePlayer(map, TILE);
  updateEnemies(map, TILE, player);

  drawBombsAndExplosions(ctx, tileSize);
  drawEnemies(ctx);
  drawPlayer(ctx);

  requestAnimationFrame(gameLoop);
}

async function init() {
  await loadTileImages();
  setupInput(map, TILE);
  gameLoop();
}

init();
