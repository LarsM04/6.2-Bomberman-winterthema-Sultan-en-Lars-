

export const enemies = [
  createEnemy(11, 1, "basic"),
  createEnemy(1, 11, "fast"),
  createEnemy(11, 11, "slow"),
];


function createEnemy(col, row, type = "basic") {
  const types = {
    basic: { speed: 1, color: "#2ecc71" },
    fast:  { speed: 2, color: "#e74c3c" },
    slow:  { speed: 0.5, color: "#3498db" },
  };

  const t = types[type];

  return {
    x: col * 40,
    y: row * 40,
    tileSize: 40,

    speed: t.speed,
    dirX: randomDir().x,
    dirY: randomDir().y,

    color: t.color,
    type,

   
    waitTime: 0,
    animOffset: Math.random() * Math.PI * 2,
    alive: true,
  };
}



export function drawEnemies(ctx) {
  enemies.forEach(e => {
    if (!e.alive) return;

    const wobble = Math.sin(e.animOffset) * 2;

    ctx.fillStyle = e.color;
    ctx.fillRect(
      e.x + 8 + wobble,
      e.y + 8,
      e.tileSize - 16,
      e.tileSize - 16
    );
  });
}



function isSolid(col, row, map, TILE) {
  if (!map[row] || map[row][col] === undefined) return true;
  return map[row][col] !== TILE.EMPTY;
}

function canMove(enemy, x, y, map, TILE) {
  const s = enemy.tileSize - 1;

  const points = [
    [x, y],
    [x + s, y],
    [x, y + s],
    [x + s, y + s],
  ];

  return points.every(([px, py]) => {
    const c = Math.floor(px / enemy.tileSize);
    const r = Math.floor(py / enemy.tileSize);
    return !isSolid(c, r, map, TILE);
  });
}



export function updateEnemies(map, TILE) {
  enemies.forEach(e => {
    if (!e.alive) return;

  
    e.animOffset += 0.1;

  
    if (e.waitTime > 0) {
      e.waitTime--;
      return;
    }

    const nx = e.x + e.dirX * e.speed;
    const ny = e.y + e.dirY * e.speed;

    if (canMove(e, nx, ny, map, TILE)) {
      e.x = nx;
      e.y = ny;
    } else {

      const d = randomDir();
      e.dirX = d.x;
      e.dirY = d.y;
      e.waitTime = 10;
    }
  });
}



function randomDir() {
  const dirs = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

