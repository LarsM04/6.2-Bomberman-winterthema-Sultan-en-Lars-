import { player, drawPlayer, updatePlayer, setupInput } from "./player.js";
import {
  drawBombsAndExplosions,
  updateParticles,
  drawParticles,
} from "./bomb.js";
import { drawEnemies, updateEnemies } from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 13;
const cols = 13;

canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

export const TILE = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  BORDER: 3,
};

const tileImages = {};

const snowflakesBack = [];
const snowflakesFront = [];

const SNOW_BACK_COUNT = 90;
const SNOW_FRONT_COUNT = 70;

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

  for (let i = 0; i < SNOW_BACK_COUNT; i++) {
    snowflakesBack.push(makeSnowflake(true, false));
  }
  for (let i = 0; i < SNOW_FRONT_COUNT; i++) {
    snowflakesFront.push(makeSnowflake(true, true));
  }
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

export const map = [
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3],
  [3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
  [3, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
];

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

  updatePlayer(map, TILE);
  updateEnemies(map, TILE, player);

  drawBombsAndExplosions(ctx, tileSize);
  drawEnemies(ctx);
  drawPlayer(ctx);

  updateParticles();
  drawParticles(ctx);

  updateSnowLayer(snowflakesFront, true);
  drawSnowLayer(snowflakesFront);

  drawFrostOverlay();

  requestAnimationFrame(gameLoop);
}

async function init() {
  await loadTileImages();
  initSnow();
  setupInput(map, TILE);
  gameLoop();
}

init();
