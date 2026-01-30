import { player, drawPlayer, updatePlayer, setupInput } from "./player.js";
import {
  drawBombsAndExplosions,
  updateParticles,
  drawParticles,
  explosions,
  playerHitByExplosion,
  bombs,
  particles,
} from "./bomb.js";
import {
  drawEnemies,
  updateEnemies,
  killEnemiesInExplosion,
  enemies,
} from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const menuOverlay = document.getElementById("menuOverlay");

const tileSize = 40;
const rows = 17;
const cols = 17;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

export const TILE = { EMPTY: 0, WALL: 1, BLOCK: 2, BORDER: 3 };
const tileImages = {};
let gameStarted = false;
let score = 0;
let currentLevel = 1;
const MAX_LEVELS = 3;

function drawScore() {
  ctx.font = "18px Trebuchet MS";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(`Score: ${score}`, 12, 24);
  ctx.fillText(`Level: ${currentLevel} / ${MAX_LEVELS}`, 12, 45);
}

function addScore(points) { score += points; }
function showMenu() { menuOverlay.classList.remove("hidden"); gameStarted = false; }
function hideMenu() { menuOverlay.classList.add("hidden"); gameStarted = true; }

async function loadTileImages() {
  const imageMap = {
    [TILE.EMPTY]: "assets/tiles/snow floor.webp",
    [TILE.WALL]: "assets/tiles/wall.jpg",
    [TILE.BLOCK]: "assets/tiles/ice.jpg",
    [TILE.BORDER]: "assets/tiles/buitenmuur.jpg",
  };
  for (const [type, src] of Object.entries(imageMap)) {
    const img = new Image();
    await new Promise((res) => { img.onload = res; img.src = src; });
    tileImages[type] = img;
  }
}

function createBaseMap() {
  const m = Array.from({ length: rows }, () => Array(cols).fill(TILE.EMPTY));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) m[r][c] = TILE.BORDER;
      else if (r % 2 === 0 && c % 2 === 0) m[r][c] = TILE.WALL;
    }
  }
  return m;
}

function addRandomBlocks(m) {
  const blockChance = 0.33;
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (m[r][c] === TILE.EMPTY && Math.random() < blockChance) m[r][c] = TILE.BLOCK;
    }
  }
  const clear = (cc, rr) => { if(m[rr] && m[rr][cc] !== TILE.BORDER) m[rr][cc] = TILE.EMPTY; };
  [1, 2].forEach(i => { clear(1,i); clear(i,1); clear(cols-2,i); clear(cols-1-i,1); });
}

let originalMap = createBaseMap();
addRandomBlocks(originalMap);
export const map = structuredClone(originalMap);

function resetMap() {
  const newM = createBaseMap();
  addRandomBlocks(newM);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) map[r][c] = newM[r][c];
  }
}

function resetGame(fullReset = false) {
  if (fullReset) { currentLevel = 1; score = 0; }
  player.x = tileSize; player.y = tileSize; player.alive = true;
  resetMap();
  bombs.length = 0; explosions.length = 0; particles.length = 0;

  const speedMult = 1 + (currentLevel - 1) * 0.4;
  const enemyPos = [
    { col: 15, row: 1 },
    { col: 1, row: 15 }, // Vaste veilige plek linksonder
    { col: 15, row: 15 }
  ];

  enemies.forEach((e, i) => {
    e.x = enemyPos[i].col * tileSize; 
    e.y = enemyPos[i].row * tileSize;
    e.speed = (0.6 + Math.random() * 0.4) * speedMult; 
    e.alive = true; e.dx = 1; e.dy = 0;
  });
}

startBtn.addEventListener("click", () => { resetGame(true); hideMenu(); });
restartBtn.addEventListener("click", () => { resetGame(true); hideMenu(); });

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.drawImage(tileImages[map[r][c]], c * tileSize, r * tileSize, tileSize, tileSize);
    }
  }

  if (gameStarted) {
    updatePlayer(map, TILE);
    updateEnemies(map, TILE, player);
    killEnemiesInExplosion(explosions, tileSize, addScore);

    if (enemies.every(e => !e.alive)) {
      if (currentLevel < MAX_LEVELS) {
        currentLevel++;
        alert(`Level ${currentLevel - 1} voltooid! Klaar voor Level ${currentLevel}?`);
        resetGame(false);
      } else {
        alert("GEWONNEN! Je hebt de Winter Editie uitgespeeld!");
        resetGame(true);
        showMenu();
      }
    }

    if (player.alive && playerHitByExplosion(player, tileSize)) {
      player.alive = false;
      showMenu();
    }
  }

  drawBombsAndExplosions(ctx, tileSize);
  drawEnemies(ctx);
  drawPlayer(ctx);
  updateParticles();
  drawParticles(ctx);
  drawScore();
  requestAnimationFrame(gameLoop);
}

async function init() {
  await loadTileImages();
  setupInput(map, TILE);
  showMenu();
  gameLoop();
}
init();