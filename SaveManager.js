/* =========================================================
   SAVE MANAGER
   - Progress save
   - Best score
   - Settings
========================================================= */

const SAVE_KEY = "EXTREME_PLATFORMER_SAVE";

export class SaveManager {
    constructor() {
        this.data = {
            level: 1,
            bestScore: 0,
            coins: 0,
            sound: true
        };
        this.load();
    }

    load() {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            try {
                this.data = JSON.parse(raw);
            } catch (e) {
                console.warn("Save corrupted, resetting");
                this.save();
            }
        }
    }

    save() {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    }

    setLevel(level) {
        if (level > this.data.level) {
            this.data.level = level;
            this.save();
        }
    }

    addCoins(amount) {
        this.data.coins += amount;
        this.save();
    }

    setBestScore(score) {
        if (score > this.data.bestScore) {
            this.data.bestScore = score;
            this.save();
        }
    }

    toggleSound() {
        this.data.sound = !this.data.sound;
        this.save();
        return this.data.sound;
    }

    resetAll() {
        localStorage.removeItem(SAVE_KEY);
        this.data = {
            level: 1,
            bestScore: 0,
            coins: 0,
            sound: true
        };
        this.save();
    }
}
