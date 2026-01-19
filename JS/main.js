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

      switch (tile) {
        case TILE.BORDER:
          ctx.fillStyle = "#cfefff"; // ijsrand
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = "#7fbcd2";
          ctx.strokeRect(x, y, tileSize, tileSize);
          break;

        case TILE.WALL:
          ctx.fillStyle = "#8fa6b3"; // bevroren steen
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = "#6d7f8a";
          ctx.strokeRect(x, y, tileSize, tileSize);
          break;

        case TILE.BLOCK:
          ctx.fillStyle = "#ffffff"; // sneeuwblok
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = "#d0d0d0";
          ctx.strokeRect(x, y, tileSize, tileSize);
          break;

        case TILE.EMPTY:
          ctx.fillStyle = "#7fc8ff"; // ijsvloer
          ctx.fillRect(x, y, tileSize, tileSize);
          break;
      }

      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }
}

document.addEventListener("keydown", (e) => {
  movePlayer(e, map, TILE);
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlayer(ctx, tileSize);
  requestAnimationFrame(gameLoop);
}

gameLoop();
