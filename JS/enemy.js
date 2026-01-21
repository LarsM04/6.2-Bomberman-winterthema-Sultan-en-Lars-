class Enemy {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.color = "red";
    this.timer = 0;
  }

  update(map) {
    this.timer++;
    if (this.timer < 30) return;
    this.timer = 0;

    const directions = [
      { r: -1, c: 0 }, 
      { r: 1, c: 0 },  
      { r: 0, c: -1 }, 
      { r: 0, c: 1 }   
    ];

    const dir = directions[Math.floor(Math.random() * directions.length)];
    const newRow = this.row + dir.r;
    const newCol = this.col + dir.c;

    if (map[newRow][newCol] === 0) {
      this.row = newRow;
      this.col = newCol;
    }
  }

  draw(ctx, tileSize) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.col * tileSize,
      this.row * tileSize,
      tileSize,
      tileSize
    );
  }
}
