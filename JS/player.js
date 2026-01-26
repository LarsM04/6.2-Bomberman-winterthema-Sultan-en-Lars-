import { placeBomb } from "./bomb.js";

export const player = {
  x: 40,
  y: 40,
  tileSize: 40,
  margin: 8,
  speed: 2,
  color: "#ff3b3b",
};

const keys = {};

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

function canMoveTo(x, y, map, TILE) {
  const left = x, right = x + player.tileSize - 1;
  const top = y, bottom = y + player.tileSize - 1;
  const lT = Math.floor(left / 40), rT = Math.floor(right / 40);
  const tT = Math.floor(top / 40), bT = Math.floor(bottom / 40);

  const isSolid = (c, r) => !map[r] || map[r][c] !== TILE.EMPTY;

  return !(isSolid(lT, tT) || isSolid(rT, tT) || isSolid(lT, bT) || isSolid(rT, bT));
}

export function drawPlayer(ctx) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x + player.margin, player.y + player.margin, player.tileSize - player.margin * 2, player.tileSize - player.margin * 2);
}

export function setupInput(map, TILE) {
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;
    if (key === "x") placeBomb(player, map, TILE);
  });
  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}