export const player = {
  x: 40,
  y: 40,
  tileSize: 40,
  margin: 8,
  speed: 2,
  color: "#ff3b3b",
};

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

export function drawPlayer(ctx) {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x + player.margin,
    player.y + player.margin,
    player.tileSize - player.margin * 2,
    player.tileSize - player.margin * 2
  );
}

function isSolid(col, row, map, TILE) {
  if (!map[row] || map[row][col] === undefined) return true;
  return map[row][col] !== TILE.EMPTY;
}

function canMove(x, y, map, TILE) {
  const s = player.tileSize - 1;
  const points = [
    [x, y],
    [x + s, y],
    [x, y + s],
    [x + s, y + s],
  ];

  return points.every(([px, py]) => {
    const c = Math.floor(px / player.tileSize);
    const r = Math.floor(py / player.tileSize);
    return !isSolid(c, r, map, TILE);
  });
}

export function updatePlayer(map, TILE) {
  let dx = 0, dy = 0;

  if (keys.ArrowUp || keys.w) dy = -player.speed;
  if (keys.ArrowDown || keys.s) dy = player.speed;
  if (keys.ArrowLeft || keys.a) dx = -player.speed;
  if (keys.ArrowRight || keys.d) dx = player.speed;

  if (canMove(player.x + dx, player.y, map, TILE)) player.x += dx;
  if (canMove(player.x, player.y + dy, map, TILE)) player.y += dy;
}
