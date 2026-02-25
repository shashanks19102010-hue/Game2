/* =====================================================================
   EXTREME PLATFORMER GAME
   File 6: PlatformManager.js
   Role:
   - Ground & platform system
   - Moving / falling platforms
   - World themes (Mario-style)
   - Collision handling
===================================================================== */

/* ====================== WORLD THEMES ====================== */
export const WORLD_THEMES = {
    grass: {
        ground: "#3cb043",
        platform: "#2e8b57",
        accent: "#00ff9d"
    },
    desert: {
        ground: "#d2b48c",
        platform: "#c19a6b",
        accent: "#ffcc66"
    },
    ice: {
        ground: "#aeefff",
        platform: "#7fdfff",
        accent: "#00eaff",
        slippery: true
    },
    lava: {
        ground: "#3b0a0a",
        platform: "#ff4500",
        accent: "#ff004c",
        damage: true
    },
    dark: {
        ground: "#1a1a1a",
        platform: "#333333",
        accent: "#b000ff"
    }
};

/* ====================== PLATFORM CLASS ====================== */
export class Platform {
    constructor(x, y, w, h, options = {}) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.type = options.type || "static"; // static | moving | falling
        this.speed = options.speed || 1.5;
        this.range = options.range || 120;

        this.startX = x;
        this.startY = y;

        this.dir = 1;
        this.fallTimer = 0;

        this.theme = options.theme || WORLD_THEMES.grass;
    }

    update() {
        if (this.type === "moving") {
            this.x += this.speed * this.dir;
            if (Math.abs(this.x - this.startX) > this.range) {
                this.dir *= -1;
            }
        }

        if (this.type === "falling") {
            if (this.fallTimer > 0) {
                this.fallTimer++;
                this.y += this.fallTimer * 0.4;
            }
        }
    }

    triggerFall() {
        if (this.type === "falling" && this.fallTimer === 0) {
            this.fallTimer = 1;
        }
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.theme.platform;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.theme.accent;
        ctx.fillRect(this.x - cameraX, this.y, this.w, this.h);
        ctx.shadowBlur = 0;
    }
}

/* ====================== GROUND TILE ====================== */
export class Ground {
    constructor(length, theme) {
        this.y = 560;
        this.h = 80;
        this.length = length;
        this.theme = theme;
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.theme.ground;
        ctx.fillRect(-cameraX, this.y, this.length, this.h);

        // Decorative tiles
        for (let i = 0; i < this.length; i += 40) {
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.strokeRect(i - cameraX, this.y, 40, this.h);
        }
    }
}

/* ====================== COLLISION CHECK ====================== */
export function platformCollision(player, platform) {
    return (
        player.x + player.w > platform.x &&
        player.x < platform.x + platform.w &&
        player.y + player.h <= platform.y + 12 &&
        player.y + player.h + player.vy >= platform.y
    );
}

/* ====================== PLATFORM MANAGER ====================== */
export class PlatformManager {
    constructor(level, levelLength, themeKey) {
        this.level = level;
        this.length = levelLength;
        this.theme = WORLD_THEMES[themeKey] || WORLD_THEMES.grass;

        this.platforms = [];
        this.ground = new Ground(levelLength + 800, this.theme);

        this.generatePlatforms();
    }

    generatePlatforms() {
        const baseCount = 5 + this.level * 2;
        const count = Math.min(baseCount, 40);

        for (let i = 0; i < count; i++) {
            const x = 200 + Math.random() * this.length;
            const y = 380 - Math.random() * 180;

            let type = "static";
            if (this.level > 5 && Math.random() > 0.7) type = "moving";
            if (this.level > 10 && Math.random() > 0.85) type = "falling";

            this.platforms.push(
                new Platform(x, y, 70, 14, {
                    type,
                    speed: 1.2 + this.level * 0.05,
                    range: 80 + Math.random() * 120,
                    theme: this.theme
                })
            );
        }
    }

    update(player) {
        this.platforms.forEach(p => {
            p.update();

            if (platformCollision(player, p)) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.grounded = true;

                if (p.type === "falling") {
                    p.triggerFall();
                }

                if (this.theme.slippery) {
                    player.vx *= 1.05;
                }
            }
        });
    }

    draw(ctx, cameraX) {
        this.ground.draw(ctx, cameraX);
        this.platforms.forEach(p => p.draw(ctx, cameraX));
    }
}

/* ====================== LEVEL THEME PICKER ====================== */
export function pickWorldTheme(level) {
    if (level < 20) return "grass";
    if (level < 40) return "desert";
    if (level < 60) return "ice";
    if (level < 80) return "lava";
    return "dark";
}
