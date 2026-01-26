export const bombs = [];
export const explosions = []; // Lijst met actieve explosie-deeltjes

export function placeBomb(player, map, TILE) {
  const col = Math.round(player.x / player.tileSize);
  const row = Math.round(player.y / player.tileSize);

  const alreadyHasBomb = bombs.some(b => b.col === col && b.row === row);

  if (!alreadyHasBomb) {
    const newBomb = {
      col: col,
      row: row,
      timer: 2000,
      range: 2 // Hoe ver de explosie gaat
    };
    bombs.push(newBomb);

    setTimeout(() => {
      explode(newBomb, map, TILE);
    }, newBomb.timer);
  }
}

function explode(bomb, map, TILE) {
  const index = bombs.indexOf(bomb);
  if (index === -1) return;
  bombs.splice(index, 1);

  const directions = [
    { x: 0, y: 0 },  // Midden
    { x: 1, y: 0 },  // Rechts
    { x: -1, y: 0 }, // Links
    { x: 0, y: 1 },  // Onder
    { x: 0, y: -1 }  // Boven
  ];

  directions.forEach(dir => {
    for (let i = 0; i <= bomb.range; i++) {
      if (i === 0 && dir.x !== 0 || i === 0 && dir.y !== 0) continue; 
      
      const targetCol = bomb.col + (dir.x * i);
      const targetRow = bomb.row + (dir.y * i);

      // Stop als we de rand van de map raken
      if (!map[targetRow] || map[targetRow][targetCol] === undefined) break;

      const tile = map[targetRow][targetCol];

      // Stop bij een onverwoestbare muur
      if (tile === TILE.WALL || tile === TILE.BORDER) break;

      // Voeg explosie toe
      const expo = { col: targetCol, row: targetRow, timer: 500 };
      explosions.push(expo);

      // Verwijder explosie na 500ms
      setTimeout(() => {
        const eIndex = explosions.indexOf(expo);
        if (eIndex > -1) explosions.splice(eIndex, 1);
      }, expo.timer);

      // Als we een ijsblok raken, maak hem kapot en stop de straal in die richting
      if (tile === TILE.BLOCK) {
        map[targetRow][targetCol] = TILE.EMPTY;
        break;
      }
    }
  });
}

export function drawBombsAndExplosions(ctx, tileSize) {
  // Teken Bommen
  ctx.fillStyle = "black";
  bombs.forEach(bomb => {
    ctx.beginPath();
    ctx.arc(bomb.col * tileSize + tileSize / 2, bomb.row * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Teken Explosies
  ctx.fillStyle = "rgba(255, 69, 0, 0.7)"; // Oranje-rood doorzichtig
  explosions.forEach(expo => {
    ctx.fillRect(expo.col * tileSize, expo.row * tileSize, tileSize, tileSize);
    
    // Binnenste gele gloed
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.fillRect(expo.col * tileSize + 5, expo.row * tileSize + 5, tileSize - 10, tileSize - 10);
    ctx.fillStyle = "rgba(255, 69, 0, 0.7)";
  });
}