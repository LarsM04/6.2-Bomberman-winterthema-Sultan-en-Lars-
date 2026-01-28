export const player = {
  x: 40,
  y: 40,
  tileSize: 40,
  margin: 8,
  speed: 2,
  color: "#2d55db",
  alive: true,
};

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

export function drawPlayer(ctx) {
  if (!player.alive) return;

  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x + player.margin,
    player.y + player.margin,
    player.tileSize - player.margin * 2,
    player.tileSize - player.margin * 2
  );
}

export function updatePlayer(map, TILE) {
  if (!player.alive) return;

  let dx = 0, dy = 0;

  if (keys.ArrowUp || keys.w) dy = -player.speed;
  if (keys.ArrowDown || keys.s) dy = player.speed;
  if (keys.ArrowLeft || keys.a) dx = -player.speed;
  if (keys.ArrowRight || keys.d) dx = player.speed;

  if (canMove(player.x + dx, player.y, map, TILE)) player.x += dx;
  if (canMove(player.x, player.y + dy, map, TILE)) player.y += dy;
}

function canMove(x, y, map, TILE) {
  const s = player.tileSize - 1;
  const pts = [
    [x, y],
    [x + s, y],
    [x, y + s],
    [x + s, y + s],
  ];

  return pts.every(p => {
    const c = Math.floor(p[0] / player.tileSize);
    const r = Math.floor(p[1] / player.tileSize);
    return map[r] && map[r][c] === TILE.EMPTY;
  });
}
