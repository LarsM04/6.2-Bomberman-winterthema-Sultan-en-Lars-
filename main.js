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

// Map
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

// Enemies (uit enemy.js)
const enemies = [
  new Enemy(1, 1),
  new Enemy(11, 11)
];

// Map tekenen
function drawMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = map[r][c];

      if (tile === TILE.WALL) ctx.fillStyle = "#4a6fa5";
      if (tile === TILE.BLOCK) ctx.fillStyle = "#ffffff";
      if (tile === TILE.EMPTY) ctx.fillStyle = "#bdefff";

      ctx.fillRect(
        c * tileSize,
        r * tileSize,
        tileSize,
        tileSize
      );
    }
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();

  for (let enemy of enemies) {
    enemy.update(map);
    enemy.draw(ctx, tileSize);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
