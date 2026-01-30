
const TILE_SIZE = 40;
const enemyImg = new Image();
enemyImg.src = "assets/tiles/enemy.png"; 


class Enemy {
  constructor(col, row, speed, scoreValue = 100) {

    this.x = col * TILE_SIZE;
    this.y = row * TILE_SIZE;
    this.size = TILE_SIZE;
    this.speed = speed;
    this.dx = 1;
    this.dy = 0;
    this.alive = true;
    this.scoreValue = scoreValue;
  }

  
  update(map, TILE, player) {
    if (!this.alive || !player.alive) return;

   
    if (this.x < player.x + 30 && this.x + 30 > player.x && 
        this.y < player.y + 30 && this.y + 30 > player.y) {
      player.alive = false;
    }
    
    let nx = this.x + this.dx * this.speed;
    let ny = this.y + this.dy * this.speed;

    
    const isFree = (checkX, checkY) => {
      const buffer = 4; 
      const points = [
        {x: checkX + buffer, y: checkY + buffer},
        {x: checkX + TILE_SIZE - buffer, y: checkY + buffer},
        {x: checkX + buffer, y: checkY + TILE_SIZE - buffer},
        {x: checkX + TILE_SIZE - buffer, y: checkY + TILE_SIZE - buffer}
      ];

      return points.every(p => {
        const c = Math.floor(p.x / TILE_SIZE);
        const r = Math.floor(p.y / TILE_SIZE);
        
        return map[r] && map[r][c] === TILE.EMPTY;
      });
    };

    if (isFree(nx, ny)) {
      this.x = nx;
      this.y = ny;
    } else { 
     
      this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
      this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;

      const dirs = [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}];
      const validDirs = dirs.filter(d => isFree(this.x + d.dx * 5, this.y + d.dy * 5));

      
      const nextDir = validDirs.length > 0 
        ? validDirs[Math.floor(Math.random() * validDirs.length)] 
        : { dx: -this.dx, dy: -this.dy };

      this.dx = nextDir.dx;
      this.dy = nextDir.dy;
    }
  }
}

export const enemies = [
  new Enemy(15, 1, 0.6, 100),
  new Enemy(1, 15, 0.7, 150),
  new Enemy(15, 15, 0.4, 200),
];


export function drawEnemies(ctx) {
  enemies.forEach(e => {
    if (e.alive) {
      ctx.drawImage(enemyImg, e.x + 4, e.y + 4, e.size - 8, e.size - 8);
    }
  });
}


export function updateEnemies(map, TILE, player) {
  enemies.forEach(e => e.update(map, TILE, player));
}

export function killEnemiesInExplosion(explosions, tileSize, addScore) {
  // While loop voorbeeld
  let i = 0;
  while (i < enemies.length) {
    const e = enemies[i];
    if (e.alive) {
      const ec = Math.floor((e.x + TILE_SIZE / 2) / tileSize);
      const er = Math.floor((e.y + TILE_SIZE / 2) / tileSize);
      
      if (explosions.some(ex => ex.col === ec && ex.row === er)) {
        e.alive = false;
        if (addScore) addScore(e.scoreValue);
      }
    }
    i++;
  }
}


setInterval(() => {
  enemies.forEach(e => {
    if (e.alive) {
      const onGridX = Math.abs(e.x % TILE_SIZE) < 2;
      const onGridY = Math.abs(e.y % TILE_SIZE) < 2;
      
      if (onGridX && onGridY) {
        const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
        const d = dirs[Math.floor(Math.random() * dirs.length)];
        e.dx = d.dx;
        e.dy = d.dy;
      }
    }
  });
}, 3000);