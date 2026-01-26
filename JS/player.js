export const player = {
  x: 1 * 40,
  y: 1 * 40,

  tileSize: 40,
  margin: 8,

  speed: 2,
  color: "#ff3b3b",
};

// INPUT
const keys = {};
document.addEventListener("keydown", (e) => {
  const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
  if (validKeys.includes(e.key)) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// DRAW PLAYER
export function drawPlayer(ctx) {
  ctx.fillStyle = player.color;
  // Hier gebruiken we de margin voor het VISUELE gedeelte
  ctx.fillRect(
    player.x + player.margin,
    player.y + player.margin,
    player.tileSize - player.margin * 2,
    player.tileSize - player.margin * 2
  );
}

// SOLID TILE CHECK
function isSolidTile(col, row, map, TILE) {
  // Check of de tile buiten de map valt of geen EMPTY (0) is
  if (!map[row] || map[row][col] === undefined) return true;
  return map[row][col] !== TILE.EMPTY;
}

// COLLISION CHECK (AANGEPAST)
function canMoveTo(x, y, map, TILE) {
  // We controleren de volledige tile-grootte (40x40) voor de collision.
  // De -1 voorkomt dat we "vastplakken" aan de rand van de volgende tile.
  const left   = x;
  const right  = x + player.tileSize - 1;
  const top    = y;
  const bottom = y + player.tileSize - 1;

  const leftTile   = Math.floor(left / player.tileSize);
  const rightTile  = Math.floor(right / player.tileSize);
  const topTile    = Math.floor(top / player.tileSize);
  const bottomTile = Math.floor(bottom / player.tileSize);

  // Als een van de hoeken een solide tile raakt, mag je er niet heen
  return !(
    isSolidTile(leftTile, topTile, map, TILE) ||
    isSolidTile(rightTile, topTile, map, TILE) ||
    isSolidTile(leftTile, bottomTile, map, TILE) ||
    isSolidTile(rightTile, bottomTile, map, TILE)
  );
}

// UPDATE PLAYER
export function updatePlayer(map, TILE) {
  let dx = 0;
  let dy = 0;

  if (keys["ArrowUp"] || keys["w"]) dy = -player.speed;
  if (keys["ArrowDown"] || keys["s"]) dy = player.speed;
  if (keys["ArrowLeft"] || keys["a"]) dx = -player.speed;
  if (keys["ArrowRight"] || keys["d"]) dx = player.speed;

  // X-as beweging
  if (dx !== 0) {
    const newX = player.x + dx;
    if (canMoveTo(newX, player.y, map, TILE)) {
      player.x = newX;
    }
  }

  // Y-as beweging
  if (dy !== 0) {
    const newY = player.y + dy;
    if (canMoveTo(player.x, newY, map, TILE)) {
      player.y = newY;
    }
  }

  // Clamping om binnen de muren te blijven
  const min = player.tileSize;
  const maxX = (map[0].length - 2) * player.tileSize;
  const maxY = (map.length - 2) * player.tileSize;

  player.x = Math.max(min, Math.min(player.x, maxX));
  player.y = Math.max(min, Math.min(player.y, maxY));
}