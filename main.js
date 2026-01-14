const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 13;
const cols = 13;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// Tile types
const TILE = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2
};

// 2D grid (map)
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,2,0,2,0,2,0,2,0,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,0,2,0,2,0,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,0,2,0,2,0,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,0,2,0,2,0,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,2,0,2,0,2,0,2,0,2,0,2,1],
  [1,0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,2,0,2,0,2,0,2,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function drawMap() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = map[row][col];

      switch (tile) {
        case TILE.WALL:
          ctx.fillStyle = "#4a6fa5"; // ijsmuur
          break;
        case TILE.BLOCK:
          ctx.fillStyle = "#ffffff"; // sneeuwblok
          break;
        case TILE.EMPTY:
          ctx.fillStyle = "#bdefff"; // sneeuwgrond
          break;
      }

      ctx.fillRect(
        col * tileSize,
        row * tileSize,
        tileSize,
        tileSize
      );
    }
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  requestAnimationFrame(gameLoop);
}

gameLoop();
