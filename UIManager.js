/* =========================================================
   UI MANAGER
   - HUD
   - Pause Menu
   - Game Over Screen
   - Level Complete Screen
========================================================= */

export class UIManager {
    constructor() {
        this.hud = document.getElementById("hud-container");
        this.pauseScreen = document.getElementById("pause-menu");
        this.gameOverScreen = document.getElementById("gameover-screen");
        this.levelCompleteScreen = document.getElementById("level-complete");

        this.levelText = document.getElementById("hud-level");
        this.scoreText = document.getElementById("hud-score");
        this.livesText = document.getElementById("hud-lives");
        this.coinsText = document.getElementById("hud-coins");
    }

    updateHUD({ level, score, lives, coins }) {
        if (this.levelText) this.levelText.textContent = `Level ${level}`;
        if (this.scoreText) this.scoreText.textContent = `Score ${score}`;
        if (this.livesText) this.livesText.textContent = `Lives ${lives}`;
        if (this.coinsText) this.coinsText.textContent = `Coins ${coins}`;
    }

    showPause(show) {
        if (!this.pauseScreen) return;
        this.pauseScreen.classList.toggle("hidden", !show);
    }

    showGameOver(show, score, best) {
        if (!this.gameOverScreen) return;
        this.gameOverScreen.classList.toggle("hidden", !show);

        if (show) {
            const s = this.gameOverScreen.querySelector(".final-score");
            const b = this.gameOverScreen.querySelector(".best-score");
            if (s) s.textContent = score;
            if (b) b.textContent = best;
        }
    }

    showLevelComplete(show, level) {
        if (!this.levelCompleteScreen) return;
        this.levelCompleteScreen.classList.toggle("hidden", !show);

        if (show) {
            const l = this.levelCompleteScreen.querySelector(".completed-level");
            if (l) l.textContent = `Level ${level} Complete!`;
        }
    }
}
