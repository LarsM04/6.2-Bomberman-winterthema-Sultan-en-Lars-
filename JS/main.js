import { player, drawPlayer, movePlayer } from "./player.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 13;
const cols = 13;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

const TILE = {
  EMPTY: 0, // ijsvloer
  WALL: 1, // vaste muur
  BLOCK: 2, // kapot blok
  BORDER: 3, // buitenrand
};

// Tile images
const tileImages = {
  [TILE.EMPTY]: null,
  [TILE.WALL]: null,
  [TILE.BLOCK]: null,
  [TILE.BORDER]: null,
};

// Afbeeldingen inladen
async function loadTileImages() {
  const imageMap = {
    [TILE.EMPTY]: "assets/tiles/snow floor.webp",
    [TILE.WALL]: "assets/tiles/wall.jpg",
    [TILE.BLOCK]: "assets/tiles/ice.jpg",
    [TILE.BORDER]: "assets/tiles/buitenmuur.jpg",
  };

  for (const [tileType, imagePath] of Object.entries(imageMap)) {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${imagePath}`));
      img.src = imagePath;
    });
    tileImages[tileType] = img;
  }
}

const map = [
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
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = map[row][col];
      const x = col * tileSize;
      const y = row * tileSize;

      // Tekenen van tile afbeelding
      if (tileImages[tile]) {
        ctx.drawImage(tileImages[tile], x, y, tileSize, tileSize);
      }
    }
  }
}

document.addEventListener("keydown", (e) => {
  movePlayer(e, map, TILE);
});

async function init() {
  await loadTileImages();
  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlayer(ctx, tileSize);
  requestAnimationFrame(gameLoop);
}

init();
