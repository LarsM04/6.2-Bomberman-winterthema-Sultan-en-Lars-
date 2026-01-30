export const bombs = [];
export const explosions = [];

export const particles = [];

function spawnExplosionParticles(col, row, tileSize) {
  const cx = col * tileSize + tileSize / 2;
  const cy = row * tileSize + tileSize / 2;

  const count = 16 + Math.floor(Math.random() * 10);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 2.6;

    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (0.4 + Math.random() * 0.8),
      r: 1 + Math.random() * 2.5,
      life: 30 + Math.floor(Math.random() * 25),
      alpha: 0.9,
      drag: 0.985,
      gravity: 0.06 + Math.random() * 0.06,
    });
  }
}

export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.gravity;

    p.x += p.vx;
    p.y += p.vy;

    p.life -= 1;
    p.alpha *= 0.97;

    if (p.life <= 0 || p.alpha <= 0.02) {
      particles.splice(i, 1);
    }
  }
}

export function drawParticles(ctx) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(240, 252, 255, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function placeBomb(player, map, TILE) {
  const col = Math.round(player.x / player.tileSize);
  const row = Math.round(player.y / player.tileSize);

  const alreadyHasBomb = bombs.some((b) => b.col === col && b.row === row);
  if (alreadyHasBomb) return;

  const newBomb = {
    col,
    row,
    timer: 2000,
    range: 2,
  };

  bombs.push(newBomb);

  setTimeout(() => {
    explode(newBomb, map, TILE, player.tileSize);
  }, newBomb.timer);
}

function explode(bomb, map, TILE, tileSize) {
  const index = bombs.indexOf(bomb);
  if (index === -1) return;
  bombs.splice(index, 1);

  const directions = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  directions.forEach((dir) => {
    for (let i = 0; i <= bomb.range; i++) {
      const targetCol = bomb.col + dir.x * i;
      const targetRow = bomb.row + dir.y * i;

      if (!map[targetRow] || map[targetRow][targetCol] === undefined) break;

      const tile = map[targetRow][targetCol];

      if (tile === TILE.WALL || tile === TILE.BORDER) break;

      const expo = { col: targetCol, row: targetRow, timer: 500 };
      explosions.push(expo);

      spawnExplosionParticles(targetCol, targetRow, tileSize);

      setTimeout(() => {
        const eIndex = explosions.indexOf(expo);
        if (eIndex > -1) explosions.splice(eIndex, 1);
      }, expo.timer);

      if (tile === TILE.BLOCK) {
        map[targetRow][targetCol] = TILE.EMPTY;
        break;
      }
    }
  });
}

export function drawBombsAndExplosions(ctx, tileSize) {
  ctx.fillStyle = "black";
  bombs.forEach((bomb) => {
    ctx.beginPath();
    ctx.arc(
      bomb.col * tileSize + tileSize / 2,
      bomb.row * tileSize + tileSize / 2,
      tileSize / 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });

  explosions.forEach((expo) => {
    ctx.fillStyle = "rgba(120, 220, 255, 0.45)";
    ctx.fillRect(expo.col * tileSize, expo.row * tileSize, tileSize, tileSize);

    ctx.fillStyle = "rgba(240, 255, 255, 0.55)";
    ctx.fillRect(
      expo.col * tileSize + 6,
      expo.row * tileSize + 6,
      tileSize - 12,
      tileSize - 12,
    );
  });
}
