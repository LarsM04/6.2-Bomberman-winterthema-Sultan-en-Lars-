const TILE_SIZE = 40;

class Enemy {
  constructor(col, row, speed, color, scoreValue = 100) {
    this.x = col * TILE_SIZE;
    this.y = row * TILE_SIZE;
    this.size = TILE_SIZE;
    this.speed = speed;
    this.dx = 1;
    this.dy = 0;
    this.color = color;
    this.alive = true;
    this.scoreValue = scoreValue;
  }
}

export const enemies = [
  new Enemy(11, 1, 1, "#6a18cf", 100),
  new Enemy(1, 11, 2, "#e74c3c", 150),
  new Enemy(11, 11, 0.5, "#ded419", 200),
];

export function drawEnemies(ctx) {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.alive) continue;

    ctx.fillStyle = e.color;
    ctx.fillRect(e.x + 8, e.y + 8, e.size - 16, e.size - 16);
  }
}

export function updateEnemies(map, TILE, player) {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.alive || !player.alive) continue;

    if (hit(e, player)) player.alive = false;

    const nx = e.x + e.dx * e.speed;
    const ny = e.y + e.dy * e.speed;

    if (free(nx, ny, e.size, map, TILE)) {
      e.x = nx;
      e.y = ny;
    } else {
      const d = randomDir();
      e.dx = d.dx;
      e.dy = d.dy;
    }
  }
}

export function killEnemiesInExplosion(explosions, tileSize, addScore) {
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (!e.alive) continue;

    const enemyCol = Math.floor((e.x + e.size / 2) / tileSize);
    const enemyRow = Math.floor((e.y + e.size / 2) / tileSize);

    for (let j = 0; j < explosions.length; j++) {
      const ex = explosions[j];
      if (ex.col === enemyCol && ex.row === enemyRow) {
        e.alive = false;
        if (addScore) addScore(e.scoreValue);
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

  return points.every((p) => {
    const c = Math.floor(p[0] / size);
    const r = Math.floor(p[1] / size);
    return map[r] && map[r][c] === TILE.EMPTY;
  });
}

function hit(enemy, player) {
  return (
    enemy.x < player.x + player.tileSize &&
    enemy.x + enemy.size > player.x &&
    enemy.y < player.y + player.tileSize &&
    enemy.y + enemy.size > player.y
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
  enemies.forEach((e) => {
    const d = randomDir();
    e.dx = d.dx;
    e.dy = d.dy;
  });
}, 2000);
