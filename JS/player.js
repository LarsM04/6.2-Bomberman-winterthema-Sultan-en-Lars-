import { placeBomb } from "./bomb.js";

export const player = {
  x: 1 * 40,
  y: 1 * 40,
  tileSize: 40,
  margin: 8,
  speed: 2,
  color: "#ff3b3b",
};

const keys = {};

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  // Luister naar de 'x' toets om een bom te plaatsen
  if (key === "x") {
    placeBomb(player);
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

export function drawPlayer(ctx) {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x + player.margin,
    player.y + player.margin,
    player.tileSize - player.margin * 2,
    player.tileSize - player.margin * 2
  );
}

function isSolidTile(col, row, map, TILE) {
  if (!map[row] || map[row][col] === undefined) return true;
  return map[row][col] !== TILE.EMPTY;
}

function canMoveTo(x, y, map, TILE) {
  const left = x;
  const right = x + player.tileSize - 1;
  const top = y;
  const bottom = y + player.tileSize - 1;

  const leftTile = Math.floor(left / player.tileSize);
  const rightTile = Math.floor(right / player.tileSize);
  const topTile = Math.floor(top / player.tileSize);
  const bottomTile = Math.floor(bottom / player.tileSize);

  return !(
    isSolidTile(leftTile, topTile, map, TILE) ||
    isSolidTile(rightTile, topTile, map, TILE) ||
    isSolidTile(leftTile, bottomTile, map, TILE) ||
    isSolidTile(rightTile, bottomTile, map, TILE)
  );
}

export function updatePlayer(map, TILE) {
  let dx = 0;
  let dy = 0;

  if (keys["arrowup"] || keys["w"]) dy = -player.speed;
  if (keys["arrowdown"] || keys["s"]) dy = player.speed;
  if (keys["arrowleft"] || keys["a"]) dx = -player.speed;
  if (keys["arrowright"] || keys["d"]) dx = player.speed;

  if (dx !== 0) {
    const newX = player.x + dx;
    if (canMoveTo(newX, player.y, map, TILE)) player.x = newX;
  }
  if (dy !== 0) {
    const newY = player.y + dy;
    if (canMoveTo(player.x, newY, map, TILE)) player.y = newY;
  }

  const min = player.tileSize;
  const maxX = (map[0].length - 2) * player.tileSize;
  const maxY = (map.length - 2) * player.tileSize;
  player.x = Math.max(min, Math.min(player.x, maxX));
  player.y = Math.max(min, Math.min(player.y, maxY));
}