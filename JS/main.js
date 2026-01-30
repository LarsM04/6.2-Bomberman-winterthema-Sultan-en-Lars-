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

export const TILE = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  BORDER: 3,
};

const tileImages = {};

let gameStarted = false;

const snowflakesBack = [];
const snowflakesFront = [];

const SNOW_BACK_COUNT = 120;
const SNOW_FRONT_COUNT = 100;

let score = 0;
function addScore(points) {
  score += points;
}

function drawScore() {
  ctx.font = "18px Trebuchet MS";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(`Score: ${score}`, 12, 24);
}

function showMenu() {
  menuOverlay.classList.remove("hidden");
  gameStarted = false;
}

function hideMenu() {
  menuOverlay.classList.add("hidden");
  gameStarted = true;
}

function makeSnowflake(randomY = false, front = false) {
  const base = front
    ? {
        rMin: 1.6,
        rMax: 3.8,
        speedMin: 1.2,
        speedMax: 3.2,
        alphaMin: 0.25,
        alphaMax: 0.75,
      }
    : {
        rMin: 0.8,
        rMax: 2.2,
        speedMin: 0.5,
        speedMax: 1.5,
        alphaMin: 0.18,
        alphaMax: 0.5,
      };

  return {
    x: Math.random() * canvas.width,
    y: randomY ? Math.random() * canvas.height : -10,
    r: base.rMin + Math.random() * (base.rMax - base.rMin),
    speedY: base.speedMin + Math.random() * (base.speedMax - base.speedMin),
    driftX: -0.7 + Math.random() * 1.4,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.03,
    alpha: base.alphaMin + Math.random() * (base.alphaMax - base.alphaMin),
  };
}

function initSnow() {
  snowflakesBack.length = 0;
  snowflakesFront.length = 0;

  for (let i = 0; i < SNOW_BACK_COUNT; i++)
    snowflakesBack.push(makeSnowflake(true, false));
  for (let i = 0; i < SNOW_FRONT_COUNT; i++)
    snowflakesFront.push(makeSnowflake(true, true));
}

function updateSnowLayer(layer, front = false) {
  for (let i = 0; i < layer.length; i++) {
    const s = layer[i];
    s.wobble += s.wobbleSpeed;
    s.x += s.driftX + Math.sin(s.wobble) * (front ? 0.55 : 0.35);
    s.y += s.speedY;

    if (s.y > canvas.height + 12 || s.x < -25 || s.x > canvas.width + 25) {
      layer[i] = makeSnowflake(false, front);
      layer[i].x = Math.random() * canvas.width;
    }
  }
}

function drawSnowLayer(layer) {
  for (let i = 0; i < layer.length; i++) {
    const s = layer[i];
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWinterMist() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "rgba(180, 240, 255, 0.18)");
  g.addColorStop(1, "rgba(10, 30, 45, 0.05)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

async function loadTileImages() {
  const imageMap = {
    [TILE.EMPTY]: "assets/tiles/snow floor.webp",
    [TILE.WALL]: "assets/tiles/wall.jpg",
    [TILE.BLOCK]: "assets/tiles/ice.jpg",
    [TILE.BORDER]: "assets/tiles/buitenmuur.jpg",
  };

  for (const [type, src] of Object.entries(imageMap)) {
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = src;
    });
    tileImages[type] = img;
  }
}

function createBaseMap() {
  const m = Array.from({ length: rows }, () => Array(cols).fill(TILE.EMPTY));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || c === 0 || r === rows - 1 || c === cols - 1) {
        m[r][c] = TILE.BORDER;
        continue;
      }

      if (r % 2 === 0 && c % 2 === 0) {
        m[r][c] = TILE.WALL;
      }
    }
  }

  return m;
}

function clearSpawn(m, spawnCol, spawnRow) {
  const safe = [
    [spawnCol, spawnRow],
    [spawnCol + 1, spawnRow],
    [spawnCol, spawnRow + 1],
    [spawnCol + 2, spawnRow],
    [spawnCol, spawnRow + 2],
  ];

  safe.forEach(([c, r]) => {
    if (m[r] && m[r][c] !== undefined && m[r][c] !== TILE.BORDER) {
      m[r][c] = TILE.EMPTY;
    }
  });
}

function addRandomBlocks(m) {
  const blockChance = 0.33;

  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (m[r][c] !== TILE.EMPTY) continue;

      if (Math.random() < blockChance) {
        m[r][c] = TILE.BLOCK;
      }
    }
  }

  clearSpawn(m, 1, 1);
  clearSpawn(m, cols - 2, 1);
  clearSpawn(m, 1, rows - 2);
  clearSpawn(m, cols - 2, rows - 2);
}

function generateMap() {
  const m = createBaseMap();
  addRandomBlocks(m);
  return m;
}

let originalMap = generateMap();
export const map = structuredClone(originalMap);

function resetMap() {
  originalMap = generateMap();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      map[r][c] = originalMap[r][c];
    }
  }
}

function resetGame() {
  player.x = tileSize * 1;
  player.y = tileSize * 1;
  player.alive = true;

  score = 0;

  resetMap();

  bombs.length = 0;
  explosions.length = 0;
  particles.length = 0;

  const enemyStart = [
    { col: cols - 2, row: 1, speed: 1, color: "#6a18cf", scoreValue: 100 },
    { col: 1, row: rows - 2, speed: 2, color: "#e74c3c", scoreValue: 150 },
    {
      col: cols - 2,
      row: rows - 2,
      speed: 0.6,
      color: "#ded419",
      scoreValue: 200,
    },
  ];

  for (let i = 0; i < enemies.length; i++) {
    const s = enemyStart[i];
    const e = enemies[i];

    e.x = s.col * tileSize;
    e.y = s.row * tileSize;
    e.speed = s.speed;
    e.color = s.color;
    e.scoreValue = s.scoreValue;
    e.alive = true;
    e.dx = 1;
    e.dy = 0;
  }
}

function startGame() {
  resetGame();
  hideMenu();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  resetGame();
  hideMenu();
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === "enter" && !gameStarted) {
    startGame();
  }

  if (key === "r") {
    resetGame();
    hideMenu();
  }
});

function drawMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = map[r][c];
      ctx.drawImage(
        tileImages[tile],
        c * tileSize,
        r * tileSize,
        tileSize,
        tileSize,
      );
    }
  }
}

function drawFrostOverlay() {
  ctx.fillStyle = "rgba(220, 250, 255, 0.06)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const v = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    50,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 1.1,
  );
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawWinterMist();
  updateSnowLayer(snowflakesBack, false);
  drawSnowLayer(snowflakesBack);

  drawMap();

  if (gameStarted) {
    updatePlayer(map, TILE);
    updateEnemies(map, TILE, player);

    killEnemiesInExplosion(explosions, tileSize, addScore);

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

  updateSnowLayer(snowflakesFront, true);
  drawSnowLayer(snowflakesFront);

  drawFrostOverlay();
  drawScore();

  requestAnimationFrame(gameLoop);
}

async function init() {
  await loadTileImages();
  initSnow();
  setupInput(map, TILE);
  showMenu();
  gameLoop();
}

init();
