/* =====================================================================
   EXTREME PLATFORMER GAME
   File 4: EnemyManager.js
   Role:
   - Enemy base class
   - Multiple AI patterns
   - Smart movement
   - Boss enemy logic
   - Difficulty scaling support
===================================================================== */

/* ====================== BASE ENEMY ====================== */
export class Enemy {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;

        this.w = config.w || 36;
        this.h = config.h || 36;

        this.speed = config.speed || 2;
        this.health = config.health || 1;

        this.vx = this.speed;
        this.vy = 0;

        this.gravity = 1.2;
        this.grounded = false;

        this.color = config.color || "#ff004c";

        this.aiType = config.aiType || "patrol";
        this.state = "idle";

        this.patrolMin = config.patrolMin || x - 120;
        this.patrolMax = config.patrolMax || x + 120;

        this.jumpCooldown = 0;
    }

    /* ================= UPDATE ================= */
    update(player) {
        this.applyGravity();
        this.runAI(player);
        this.x += this.vx;
        this.y += this.vy;
    }

    applyGravity() {
        this.vy += this.gravity;
        if (this.y + this.h > 560) {
            this.y = 560 - this.h;
            this.vy = 0;
            this.grounded = true;
        } else {
            this.grounded = false;
        }
    }

    /* ================= AI BRAIN ================= */
    runAI(player) {
        switch (this.aiType) {
            case "patrol":
                this.patrolAI();
                break;
            case "chase":
                this.chaseAI(player);
                break;
            case "jumper":
                this.jumpAI(player);
                break;
            case "aggressive":
                this.aggressiveAI(player);
                break;
        }
    }

    /* ================= AI TYPES ================= */
    patrolAI() {
        if (this.x < this.patrolMin) this.vx = this.speed;
        if (this.x > this.patrolMax) this.vx = -this.speed;
    }

    chaseAI(player) {
        if (player.x > this.x) this.vx = this.speed + 1;
        else this.vx = -(this.speed + 1);
    }

    jumpAI(player) {
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
            return;
        }

        const distance = Math.abs(player.x - this.x);
        if (distance < 120 && this.grounded) {
            this.vy = -14;
            this.jumpCooldown = 90;
        }
    }

    aggressiveAI(player) {
        this.chaseAI(player);
        this.jumpAI(player);
    }

    /* ================= DRAW ================= */
    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x - cameraX, this.y, this.w, this.h);
        ctx.shadowBlur = 0;
    }

    /* ================= DAMAGE ================= */
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}

/* =====================================================================
   BOSS ENEMY
===================================================================== */
export class BossEnemy extends Enemy {
    constructor(x, y, level) {
        super(x, y, {
            w: 90,
            h: 90,
            speed: 2 + level * 0.05,
            health: 10 + level * 2,
            aiType: "aggressive",
            color: "#ff00ff"
        });

        this.phase = 1;
        this.phaseTimer = 0;
    }

    update(player) {
        this.phaseTimer++;

        /* PHASE CHANGE */
        if (this.health < 8) this.phase = 2;
        if (this.health < 4) this.phase = 3;

        /* PHASE LOGIC */
        if (this.phase === 1) {
            this.aiType = "chase";
        } else if (this.phase === 2) {
            this.aiType = "aggressive";
            this.speed = 3;
        } else if (this.phase === 3) {
            this.aiType = "jumper";
            this.speed = 4;
        }

        super.update(player);
    }

    draw(ctx, cameraX) {
        super.draw(ctx, cameraX);

        /* BOSS HEALTH BAR */
        ctx.fillStyle = "#000";
        ctx.fillRect(80, 10, 200, 10);
        ctx.fillStyle = "#ff004c";
        ctx.fillRect(80, 10, (this.health / 20) * 200, 10);
    }
}

/* =====================================================================
   ENEMY FACTORY
===================================================================== */
export function createEnemyPack(level, levelLength) {
    const enemies = [];

    const count = Math.min(5 + level, 20);

    for (let i = 0; i < count; i++) {
        const typeChance = Math.random();

        let ai = "patrol";
        if (typeChance > 0.7) ai = "chase";
        if (typeChance > 0.85) ai = "jumper";
        if (typeChance > 0.95) ai = "aggressive";

        enemies.push(
            new Enemy(
                400 + Math.random() * levelLength,
                560 - 36,
                {
                    speed: 2 + level * 0.08,
                    aiType: ai
                }
            )
        );
    }

    /* ADD BOSS EVERY 10 LEVELS */
    if (level % 10 === 0) {
        enemies.push(new BossEnemy(levelLength - 200, 560 - 90, level));
    }

    return enemies;
}
