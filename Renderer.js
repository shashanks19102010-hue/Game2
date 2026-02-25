/* =====================================================================
   EXTREME PLATFORMER GAME
   File 8: Renderer.js
   Role:
   - Background rendering
   - Parallax layers
   - World theme visuals
   - Particle effects
   - Camera based drawing
===================================================================== */

/* ====================== PARALLAX LAYERS ====================== */
class ParallaxLayer {
    constructor(color, speed, heightFactor = 1) {
        this.color = color;
        this.speed = speed;
        this.heightFactor = heightFactor;
    }

    draw(ctx, cameraX, canvas) {
        const offsetX = -(cameraX * this.speed) % canvas.width;
        ctx.fillStyle = this.color;

        for (let x = offsetX; x < canvas.width + canvas.width; x += canvas.width) {
            ctx.fillRect(
                x,
                canvas.height * (1 - this.heightFactor),
                canvas.width,
                canvas.height * this.heightFactor
            );
        }
    }
}

/* ====================== BACKGROUND THEMES ====================== */
const BACKGROUND_THEMES = {
    grass: [
        new ParallaxLayer("#0b1d2e", 0.1, 1),
        new ParallaxLayer("#113f67", 0.25, 0.6),
        new ParallaxLayer("#1b6ca8", 0.4, 0.35)
    ],
    desert: [
        new ParallaxLayer("#2b1b0f", 0.1, 1),
        new ParallaxLayer("#7a4a28", 0.25, 0.6),
        new ParallaxLayer("#d2b48c", 0.4, 0.35)
    ],
    ice: [
        new ParallaxLayer("#0a2a33", 0.1, 1),
        new ParallaxLayer("#5fc9f3", 0.25, 0.6),
        new ParallaxLayer("#aeefff", 0.4, 0.35)
    ],
    lava: [
        new ParallaxLayer("#140000", 0.1, 1),
        new ParallaxLayer("#5c0000", 0.25, 0.6),
        new ParallaxLayer("#ff4500", 0.45, 0.35)
    ],
    dark: [
        new ParallaxLayer("#02010a", 0.1, 1),
        new ParallaxLayer("#1a0033", 0.25, 0.6),
        new ParallaxLayer("#330066", 0.4, 0.35)
    ]
};

/* ====================== PARTICLES ====================== */
class Particle {
    constructor(x, y, vx, vy, life, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.color = color;
        this.size = size;
    }

    update() {
        this.life--;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
    }

    draw(ctx, cameraX) {
        ctx.globalAlpha = Math.max(this.life / 30, 0);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - cameraX, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

/* ====================== PARTICLE MANAGER ====================== */
export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    spawnJump(x, y) {
        for (let i = 0; i < 6; i++) {
            this.particles.push(
                new Particle(
                    x + Math.random() * 10,
                    y + 30,
                    (Math.random() - 0.5) * 2,
                    -Math.random() * 3,
                    30,
                    "#ffffff",
                    3
                )
            );
        }
    }

    spawnLand(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(
                new Particle(
                    x,
                    y,
                    (Math.random() - 0.5) * 3,
                    -Math.random() * 2,
                    25,
                    "#00eaff",
                    3
                )
            );
        }
    }

    spawnCoin(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push(
                new Particle(
                    x,
                    y,
                    (Math.random() - 0.5) * 4,
                    -Math.random() * 4,
                    35,
                    "#ffe600",
                    4
                )
            );
        }
    }

    spawnHit(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push(
                new Particle(
                    x,
                    y,
                    (Math.random() - 0.5) * 5,
                    -Math.random() * 5,
                    40,
                    "#ff004c",
                    4
                )
            );
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
    }

    draw(ctx, cameraX) {
        this.particles.forEach(p => p.draw(ctx, cameraX));
    }
}

/* ====================== MAIN RENDERER ====================== */
export class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.themeKey = "grass";
        this.particles = new ParticleSystem();
    }

    setTheme(themeKey) {
        this.themeKey = themeKey;
    }

    drawBackground(cameraX) {
        const layers = BACKGROUND_THEMES[this.themeKey] || BACKGROUND_THEMES.grass;
        layers.forEach(layer => {
            layer.draw(this.ctx, cameraX, this.canvas);
        });
    }

    drawGame({ player, enemies, platforms, camera }) {
        this.drawBackground(camera.x);

        platforms.draw(this.ctx, camera.x);

        enemies.forEach(e => e.draw(this.ctx, camera.x));

        player.draw(this.ctx);

        this.particles.update();
        this.particles.draw(this.ctx, camera.x);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
