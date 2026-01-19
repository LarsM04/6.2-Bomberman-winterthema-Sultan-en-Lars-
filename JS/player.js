export const player = {
  row: 1,
  col: 1,
  color: "#ff3b3b",
};

export function drawPlayer(ctx, tileSize) {
  const x = player.col * tileSize;
  const y = player.row * tileSize;

  ctx.fillStyle = player.color;
  ctx.fillRect(x + 6, y + 6, tileSize - 12, tileSize - 12);

  ctx.strokeStyle = "#000";
  ctx.strokeRect(x + 6, y + 6, tileSize - 12, tileSize - 12);
}

export function movePlayer(event, map, TILE) {
  let newRow = player.row;
  let newCol = player.col;

  switch (event.key) {
    case "ArrowUp":
    case "w":
      newRow--;
      break;
    case "ArrowDown":
    case "s":
      newRow++;
      break;
    case "ArrowLeft":
    case "a":
      newCol--;
      break;
    case "ArrowRight":
    case "d":
      newCol++;
      break;
  }

  if (map[newRow][newCol] === TILE.EMPTY) {
    player.row = newRow;
    player.col = newCol;
  }
}
