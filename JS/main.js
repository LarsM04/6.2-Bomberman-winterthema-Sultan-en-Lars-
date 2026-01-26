import { player, drawPlayer, updatePlayer, setupInput } from "./player.js";
import { drawBombsAndExplosions } from "./bomb.js";

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
  for (const [tileType, imagePath] of Object.entries(imageMap)) {
    const img = new Image();
    await new Promise((res) => { img.onload = res; img.src = imagePath; });
    tileImages[tileType] = img;
  }
}

const map = [
  [3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,0,0,0,0,0,0,0,0,0,0,0,3],
  [3,0,1,0,1,0,1,0,1,0,1,0,3],
  [3,2,0,2,0,2,0,2,0,2,0,2,3],
  [3,0,1,0,1,0,1,0,1,0,1,0,3],
  [3,2,0,2,0,2,0,2,0,2,0,2,3],
  [3,0,1,0,1,0,1,0,1,0,1,0,3],
  [3,2,0,2,0,2,0,2,0,2,0,2,3],
  [3,0,1,0,1,0,1,0,1,0,1,0,3],
  [3,2,0,2,0,2,0,2,0,2,0,2,3],
  [3,0,1,0,1,0,1,0,1,0,1,0,3],
  [3,0,0,2,0,2,0,2,0,2,0,0,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3],
];

function drawMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (tileImages[map[r][c]]) ctx.drawImage(tileImages[map[r][c]], c * 40, r * 40, 40, 40);
    }
  }
}

async function init() {
  await loadTileImages();
  setupInput(map, TILE); // Setup input met map data
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawBombsAndExplosions(ctx, tileSize);
  updatePlayer(map, TILE);
  drawPlayer(ctx);
  requestAnimationFrame(gameLoop);
}

init();