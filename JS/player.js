
import { placeBomb } from "./bomb.js";

const playerImg = new Image();
playerImg.src = "assets/tiles/player.png";


class Player {
  constructor(x, y, tileSize) {
   
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.margin = 6;
    this.speed = 2.5; 
    this.alive = true;
    this.bombCooldown = 600;
    this.lastBombTime = 0;
  }

  
  draw(ctx) {
    // If statement
    if (!this.alive) return;

    const drawSize = this.tileSize - this.margin * 2;
    ctx.drawImage(
      playerImg,
      this.x + this.margin,
      this.y + this.margin,
      drawSize,
      drawSize
    );
  }

 
  move(dx, dy, map, TILE) {
 
    const isMoving = dx !== 0 || dy !== 0 ? true : false;
    if (!isMoving) return;


    const canMoveTo = (nx, ny) => {
      const buffer = 8;
    
      const points = [
        { x: nx + buffer, y: ny + buffer },
        { x: nx + this.tileSize - 1 - buffer, y: ny + buffer },
        { x: nx + buffer, y: ny + this.tileSize - 1 - buffer },
        { x: nx + this.tileSize - 1 - buffer, y: ny + this.tileSize - 1 - buffer },
      ];

    
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const gridX = Math.floor(p.x / this.tileSize);
        const gridY = Math.floor(p.y / this.tileSize);
        
      
        if (map[gridY] && map[gridY][gridX] !== TILE.EMPTY) {
          return false;
        }
      }
      return true;
    };

   
    if (dx !== 0 && canMoveTo(this.x + dx, this.y)) this.x += dx;
    if (dy !== 0 && canMoveTo(this.x, this.y + dy)) this.y += dy;
  }
}

export const player = new Player(40, 40, 40);

const keys = {};


 
export function setupInput(map, TILE) {
  // DOM: Event Listeners
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    // Logica voor bom plaatsen
    if (key === "x" && player.alive) {
      const now = Date.now();
      if (now - player.lastBombTime >= player.bombCooldown) {
        placeBomb(player, map, TILE);
        player.lastBombTime = now;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}


 
export function updatePlayer(map, TILE) {
  if (!player.alive) return;

  let dx = 0;
  let dy = 0;


  if (keys["arrowup"] || keys["w"]) dy = -player.speed;
  else if (keys["arrowdown"] || keys["s"]) dy = player.speed;

  if (keys["arrowleft"] || keys["a"]) dx = -player.speed;
  else if (keys["arrowright"] || keys["d"]) dx = player.speed;

  player.move(dx, dy, map, TILE);
}


export function drawPlayer(ctx) {
  player.draw(ctx);
}