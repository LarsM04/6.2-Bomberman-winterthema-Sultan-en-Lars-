export const bombs = [];
export const explosions = [];

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
    explode(newBomb, map, TILE);
  }, newBomb.timer);
}

function explode(bomb, map, TILE) {
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
    ctx.fillStyle = "rgba(255, 69, 0, 0.7)";
    ctx.fillRect(expo.col * tileSize, expo.row * tileSize, tileSize, tileSize);

    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.fillRect(
      expo.col * tileSize + 5,
      expo.row * tileSize + 5,
      tileSize - 10,
      tileSize - 10,
    );
  });
}
