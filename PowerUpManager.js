/* =====================================================================
   EXTREME PLATFORMER GAME
   File 5: PowerUpManager.js
   Role:
   - Coin system
   - Power-ups (Mario style)
   - Pickup detection
   - Timers & effects
===================================================================== */

/* ====================== COIN CLASS ====================== */
export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 8;
        this.collected = false;
        this.anim = 0;
    }

    update() {
        this.anim += 0.1;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        ctx.fillStyle = "#ffe600";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffe600";
        ctx.beginPath();
        ctx.arc(
            this.x - cameraX,
            this.y + Math.sin(this.anim) * 4,
            this.r,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    checkPickup(player) {
        const dx = (this.x - player.x);
        const dy = (this.y - player.y);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 26) {
            this.collected = true;
            return true;
        }
        return false;
    }
}

/* ====================== POWER-UP BASE ====================== */
export class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;

        this.w = 28;
        this.h = 28;

        this.collected = false;
        this.bounce = 0;
    }

    update() {
        this.bounce += 0.12;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;

        let color = "#00ff9d";
        if (this.type === "shield") color = "#00eaff";
        if (this.type === "speed") color = "#ff7b00";
        if (this.type === "doubleJump") color = "#b000ff";
        if (this.type === "invincible") color = "#ff004c";

        ctx.fillStyle = color;
        ctx.shadowBlur = 18;
        ctx.shadowColor = color;
        ctx.fillRect(
            this.x - cameraX,
            this.y + Math.sin(this.bounce) * 5,
            this.w,
            this.h
        );
        ctx.shadowBlur = 0;
    }

    checkPickup(player) {
        if (
            player.x < this.x + this.w &&
            player.x + player.w > this.x &&
            player.y < this.y + this.h &&
            player.y + player.h > this.y
        ) {
            this.collected = true;
            return this.type;
        }
        return null;
    }
}

/* ====================== PLAYER POWER STATE ====================== */
export class PlayerPowers {
    constructor() {
        this.shield = false;
        this.speedBoost = false;
        this.doubleJump = false;
        this.invincible = false;

        this.timers = {
            shield: 0,
            speed: 0,
            doubleJump: 0,
            invincible: 0
        };
    }

    activate(type) {
        if (type === "shield") {
            this.shield = true;
            this.timers.shield = 600;
        }

        if (type === "speed") {
            this.speedBoost = true;
            this.timers.speed = 600;
        }

        if (type === "doubleJump") {
            this.doubleJump = true;
            this.timers.doubleJump = 800;
        }

        if (type === "invincible") {
            this.invincible = true;
            this.timers.invincible = 300;
        }
    }

    update() {
        for (let key in this.timers) {
            if (this.timers[key] > 0) {
                this.timers[key]--;
                if (this.timers[key] === 0) {
                    this.disable(key);
                }
            }
        }
    }

    disable(type) {
        if (type === "shield") this.shield = false;
        if (type === "speed") this.speedBoost = false;
        if (type === "doubleJump") this.doubleJump = false;
        if (type === "invincible") this.invincible = false;
    }
}

/* ====================== GENERATORS ====================== */
export function generateCoins(level, levelLength) {
    const coins = [];
    const count = Math.min(20 + level * 2, 80);

    for (let i = 0; i < count; i++) {
        coins.push(
            new Coin(
                200 + Math.random() * levelLength,
                420 - Math.random() * 120
            )
        );
    }
    return coins;
}

export function generatePowerUps(level, levelLength) {
    const powerUps = [];
    const types = ["shield", "speed", "doubleJump", "invincible"];

    const count = Math.min(2 + Math.floor(level / 5), 6);

    for (let i = 0; i < count; i++) {
        powerUps.push(
            new PowerUp(
                400 + Math.random() * levelLength,
                520,
                types[Math.floor(Math.random() * types.length)]
            )
        );
    }
    return powerUps;
}
