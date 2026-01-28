const TILE_SIZE = 40;

class Enemy {
  constructor(col, row, speed, color) {
    this.x = col * TILE_SIZE;
    this.y = row * TILE_SIZE;
    this.size = TILE_SIZE;
    this.speed = speed;
    this.dx = 1;
    this.dy = 0;
    this.color = color;
    this.alive = true;
  }
}


// ENEMIES
// ===============================
export const enemies = [
  new Enemy(11, 1, 1, "#6a18cf"),
  new Enemy(1, 11, 2, "#e74c3c"),
  new Enemy(11, 11, 0.5, "#ded419"),
];


export function drawEnemies(ctx) {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.alive) continue;

    ctx.fillStyle = e.color;
    ctx.fillRect(
      e.x + 8,
      e.y + 8,
      e.size - 16,
      e.size - 16
    );
  }
}


export function updateEnemies(map, TILE, player) {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.alive || !player.alive) continue;

    // collision met speler (ternary)
    player.alive = hit(e, player) ? false : player.alive;

    const nx = e.x + e.dx * e.speed;
    const ny = e.y + e.dy * e.speed;

    if (free(nx, ny, e.size, map, TILE)) {
      e.x = nx;
      e.y = ny;
    } else {
      // while-loop → nieuwe richting zoeken
      let tries = 0;
      while (tries < 4) {
        const d = randomDir();
        e.dx = d.dx;
        e.dy = d.dy;
        tries++;
        break;
      }
    }
  }
}


function free(x, y, size, map, TILE) {
  const points = [
    [x, y],
    [x + size - 1, y],
    [x, y + size - 1],
    [x + size - 1, y + size - 1],
  ];

  return points.every(p => {
    const c = Math.floor(p[0] / size);
    const r = Math.floor(p[1] / size);
    return map[r] && map[r][c] === TILE.EMPTY;
  });
}

function hit(a, b) {
  return (
    a.x < b.x + b.tileSize &&
    a.x + a.size > b.x &&
    a.y < b.y + b.tileSize &&
    a.y + a.size > b.y
  );
}

function randomDir() {
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];
  return dirs[Math.floor(Math.random() * dirs.length)];
}


setInterval(() => {
  enemies.forEach(e => {
    const d = randomDir();
    e.dx = d.dx;
    e.dy = d.dy;
  });
}, 2000);
