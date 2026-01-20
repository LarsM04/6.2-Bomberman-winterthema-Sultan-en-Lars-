export const player = {
  row: 1,
  col: 1,
  x: 1 * 40,
  y: 1 * 40,
  color: "#ff3b3b",
  speed: 1,
  moveDistance: 0,
  targetX: 1 * 40,
  targetY: 1 * 40,
};

const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

export function drawPlayer(ctx, tileSize) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x + 6, player.y + 6, tileSize - 12, tileSize - 12);

  ctx.strokeStyle = "#000";
  ctx.strokeRect(player.x + 6, player.y + 6, tileSize - 12, tileSize - 12);
}

export function updatePlayer(map, TILE, tileSize) {
  // Move towards target
  if (player.x < player.targetX) {
    player.x = Math.min(player.x + player.speed, player.targetX);
  } else if (player.x > player.targetX) {
    player.x = Math.max(player.x - player.speed, player.targetX);
  }

  if (player.y < player.targetY) {
    player.y = Math.min(player.y + player.speed, player.targetY);
  } else if (player.y > player.targetY) {
    player.y = Math.max(player.y - player.speed, player.targetY);
  }

  // Check if reached target
  if (player.x === player.targetX && player.y === player.targetY && player.moveDistance > 0) {
    player.moveDistance = 0;
  }

  // Always check for input
  if (player.moveDistance === 0) {
    let newX = player.x;
    let newY = player.y;
    let moved = false;

    if (keys["ArrowUp"] || keys["w"]) {
      newY -= player.speed;
      moved = true;
    } else if (keys["ArrowDown"] || keys["s"]) {
      newY += player.speed;
      moved = true;
    } else if (keys["ArrowLeft"] || keys["a"]) {
      newX -= player.speed;
      moved = true;
    } else if (keys["ArrowRight"] || keys["d"]) {
      newX += player.speed;
      moved = true;
    }

    if (moved) {
      const newCol = Math.round(newX / tileSize);
      const newRow = Math.round(newY / tileSize);

      if (map[newRow] && map[newRow][newCol] === TILE.EMPTY) {
        player.targetX = newX;
        player.targetY = newY;
        player.moveDistance = player.speed;
      }
    }
  }
}

export function movePlayer(event, map, TILE) {
  // Deprecated - using keyboard state instead
}
