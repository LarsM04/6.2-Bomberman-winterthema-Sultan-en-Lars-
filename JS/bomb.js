export const bombs = [];

export function placeBomb(player) {
  // Bereken de kolom en rij op basis van de spelerpositie
  const col = Math.round(player.x / player.tileSize);
  const row = Math.round(player.y / player.tileSize);

  // Controleer of er al een bom ligt op dit vakje
  const alreadyHasBomb = bombs.some(b => b.col === col && b.row === row);

  if (!alreadyHasBomb) {
    const newBomb = {
      col: col,
      row: row,
      timer: 2000, // De bom ontploft na 2 seconden
    };
    bombs.push(newBomb);

    // Verwijder de bom uit de lijst na de timer
    setTimeout(() => {
      const index = bombs.indexOf(newBomb);
      if (index > -1) {
        bombs.splice(index, 1);
        console.log("BOEM!"); // Hier voegen we later de explosie-animatie toe
      }
    }, newBomb.timer);
  }
}

export function drawBombs(ctx, tileSize) {
  ctx.fillStyle = "black";
  bombs.forEach(bomb => {
    ctx.beginPath();
    // Teken een ronde bom in het midden van de tile
    ctx.arc(
      bomb.col * tileSize + tileSize / 2,
      bomb.row * tileSize + tileSize / 2,
      tileSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Optioneel: een klein grijs lontje tekenen
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bomb.col * tileSize + tileSize / 2, bomb.row * tileSize + tileSize / 4);
    ctx.lineTo(bomb.col * tileSize + tileSize / 2, bomb.row * tileSize + tileSize / 6);
    ctx.stroke();
  });
}