import { placeBomb } from "./bomb.js";

export const player = {
  x: 40,
  y: 40,
  tileSize: 40,
  margin: 8,
  speed: 2,
  color: "#00ec96",
  alive: true,

  bombCooldown: 600,
  lastBombTime: 0,

  centerForce: 0.35,
};

const keys = {};

export function setupInput(map, TILE) {
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === "x" && player.alive) {
      const now = Date.now();
      if (now - player.lastBombTime >= player.bombCooldown) {
        placeBomb(player, map, TILE);
        player.lastBombTime = now;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

export function updatePlayer(map, TILE) {
  if (!player.alive) return;

  let dx = 0;
  let dy = 0;

  if (keys["arrowup"] || keys["w"]) dy = -player.speed;
  if (keys["arrowdown"] || keys["s"]) dy = player.speed;
  if (keys["arrowleft"] || keys["a"]) dx = -player.speed;
  if (keys["arrowright"] || keys["d"]) dx = player.speed;

  if (dx !== 0 && dy === 0) {
    autoCenterY(map, TILE);
  }
  if (dy !== 0 && dx === 0) {
    autoCenterX(map, TILE);
  }

  if (dx !== 0) {
    const newX = player.x + dx;

    if (canMoveTo(newX, player.y, map, TILE)) {
      player.x = newX;
    } else {
      for (let offset of [-2, 2]) {
        if (canMoveTo(newX, player.y + offset, map, TILE)) {
          player.x = newX;
          player.y += offset;
          break;
        }
      }
    }
  }

  if (dy !== 0) {
    const newY = player.y + dy;

    if (canMoveTo(player.x, newY, map, TILE)) {
      player.y = newY;
    } else {
      for (let offset of [-2, 2]) {
        if (canMoveTo(player.x + offset, newY, map, TILE)) {
          player.y = newY;
          player.x += offset;
          break;
        }
      }
    }
  }

  const min = player.tileSize;
  const maxX = (map[0].length - 2) * player.tileSize;
  const maxY = (map.length - 2) * player.tileSize;

  player.x = Math.max(min, Math.min(player.x, maxX));
  player.y = Math.max(min, Math.min(player.y, maxY));
}

function autoCenterX(map, TILE) {
  const centerX =
    Math.floor(player.x / player.tileSize) * player.tileSize +
    player.tileSize / 2;

  const diff = centerX - (player.x + player.tileSize / 2);

  if (Math.abs(diff) < 1) return;

  const step = diff * player.centerForce;

  if (canMoveTo(player.x + step, player.y, map, TILE)) {
    player.x += step;
  }
}

function autoCenterY(map, TILE) {
  const centerY =
    Math.floor(player.y / player.tileSize) * player.tileSize +
    player.tileSize / 2;

  const diff = centerY - (player.y + player.tileSize / 2);

  if (Math.abs(diff) < 1) return;

  const step = diff * player.centerForce;

  if (canMoveTo(player.x, player.y + step, map, TILE)) {
    player.y += step;
  }
}

function canMoveTo(x, y, map, TILE) {
  const left = x;
  const right = x + player.tileSize - 1;
  const top = y;
  const bottom = y + player.tileSize - 1;

  const lT = Math.floor(left / player.tileSize);
  const rT = Math.floor(right / player.tileSize);
  const tT = Math.floor(top / player.tileSize);
  const bT = Math.floor(bottom / player.tileSize);

  const isSolid = (c, r) => !map[r] || map[r][c] !== TILE.EMPTY;

  return !(
    isSolid(lT, tT) ||
    isSolid(rT, tT) ||
    isSolid(lT, bT) ||
    isSolid(rT, bT)
  );
}

export function drawPlayer(ctx) {
  if (!player.alive) return;

  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x + player.margin,
    player.y + player.margin,
    player.tileSize - player.margin * 2,
    player.tileSize - player.margin * 2,
  );
}
