/* =====================================================================
   EXTREME PLATFORMER GAME ENGINE
   File 3: main.js
   Role:
   - Game loop
   - Level system (100+ levels)
   - Difficulty scaling
   - Camera system
   - Input system
   - Enemy manager
   - Physics handler
===================================================================== */

/* ====================== IMPORTS ====================== */
import Player from "./Player.js";
import { clamp } from "./utils.js";

/* ====================== CANVAS SETUP ====================== */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

/* ====================== GAME STATES ====================== */
const GAME_STATE = {
    LOADING: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3,
    LEVEL_COMPLETE: 4
};

let gameState = GAME_STATE.LOADING;

/* ====================== GLOBAL GAME DATA ====================== */
let currentLevel = 1;
let maxLevels = 100;
let score = 0;
let coins = 0;
let lives = 3;
let difficultyMultiplier = 1;

/* ====================== CAMERA ====================== */
const camera = {
    x: 0,
    y: 0,
    speed: 0.08
};

/* ====================== PLAYER ====================== */
const player = new Player();

/* ====================== INPUT SYSTEM ====================== */
const input = {
    left: false,
    right: false,
    jump: false
};

document.addEventListener("keydown", e => {
    if (e.code === "ArrowLeft") input.left = true;
    if (e.code === "ArrowRight") input.right = true;
    if (e.code === "Space") input.jump = true;
});

document.addEventListener("keyup", e => {
    if (e.code === "ArrowLeft") input.left = false;
    if (e.code === "ArrowRight") input.right = false;
    if (e.code === "Space") input.jump = false;
});

/* ====================== MOBILE BUTTON HOOKS ====================== */
window.moveLeft = state => input.left = state;
window.moveRight = state => input.right = state;
window.doJump = () => input.jump = true;

/* ====================== LEVEL DATA ====================== */
const levels = [];
for (let i = 1; i <= maxLevels; i++) {
    levels.push({
        id: i,
        length: 2000 + i * 300,
        enemyCount: Math.floor(3 + i * 0.6),
        enemySpeed: 2 + i * 0.05,
        gravity: 1.2 + i * 0.01,
        theme: i < 20 ? "grass" : i < 40 ? "desert" : i < 60 ? "ice" : i < 80 ? "lava" : "dark"
    });
}

/* ====================== ENEMY SYSTEM ====================== */
class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.w = 36;
        this.h = 36;
        this.speed = speed;
        this.dir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.x += this.speed * this.dir;
        if (Math.random() < 0.01) this.dir *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = "#ff004c";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff004c";
        ctx.fillRect(this.x - camera.x, this.y, this.w, this.h);
        ctx.shadowBlur = 0;
    }
}

let enemies = [];

/* ====================== LEVEL INITIALIZER ====================== */
function loadLevel(levelNumber) {
    const level = levels[levelNumber - 1];
    difficultyMultiplier = 1 + levelNumber * 0.03;

    player.x = 70;
    player.y = 520;
    player.vx = 0;
    player.vy = 0;

    enemies = [];
    for (let i = 0; i < level.enemyCount; i++) {
        enemies.push(
            new Enemy(
                400 + Math.random() * level.length,
                560 - 36,
                level.enemySpeed * difficultyMultiplier
            )
        );
    }

    camera.x = 0;
    gameState = GAME_STATE.PLAYING;
}

/* ====================== PLAYER CONTROL ====================== */
function handlePlayerInput() {
    player.vx = 0;

    if (input.left) player.vx = -4;
    if (input.right) player.vx = 4;

    if (input.jump) {
        player.jump();
        input.jump = false;
    }
}

/* ====================== CAMERA UPDATE ====================== */
function updateCamera() {
    camera.x += (player.x - camera.x - 120) * camera.speed;
    camera.x = clamp(camera.x, 0, levels[currentLevel - 1].length);
}

/* ====================== COLLISION ====================== */
function checkCollision(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

/* ====================== UPDATE LOOP ====================== */
function update() {
    if (gameState !== GAME_STATE.PLAYING) return;

    handlePlayerInput();
    player.gravity = levels[currentLevel - 1].gravity;
    player.update();

    enemies.forEach(enemy => {
        enemy.update();
        if (checkCollision(player, enemy)) {
            lives--;
            if (lives <= 0) {
                gameState = GAME_STATE.GAME_OVER;
            } else {
                player.x = 70;
                player.y = 520;
            }
        }
    });

    if (player.x > levels[currentLevel - 1].length) {
        gameState = GAME_STATE.LEVEL_COMPLETE;
    }

    updateCamera();
    score++;
}

/* ====================== DRAW ====================== */
function drawBackground() {
    ctx.fillStyle = "#050b12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawUI() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(`Level: ${currentLevel}`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`Lives: ${lives}`, 10, 60);
}

function draw() {
    drawBackground();

    enemies.forEach(enemy => enemy.draw(ctx));
    player.draw(ctx);

    drawUI();

    if (gameState === GAME_STATE.GAME_OVER) {
        ctx.fillStyle = "#ff004c";
        ctx.font = "32px Arial";
        ctx.fillText("GAME OVER", 80, 320);
    }

    if (gameState === GAME_STATE.LEVEL_COMPLETE) {
        ctx.fillStyle = "#00ff9d";
        ctx.font = "26px Arial";
        ctx.fillText("LEVEL COMPLETE!", 60, 320);
    }
}

/* ====================== MAIN LOOP ====================== */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

/* ====================== START ====================== */
setTimeout(() => {
    loadLevel(currentLevel);
    gameLoop();
}, 1500);
