/* =========================================================
   LEVEL MANAGER
   100 Levels + Worlds + Difficulty Curve
========================================================= */

import { pickWorldTheme } from "./PlatformManager.js";

export class LevelManager {
    constructor(maxLevels = 100) {
        this.maxLevels = maxLevels;
        this.currentLevel = 1;
    }

    getLevelData(level) {
        const theme = pickWorldTheme(level);

        return {
            level,
            theme,
            length: 2000 + level * 300,
            enemyMultiplier: 1 + level * 0.05,
            platformDensity: Math.min(0.3 + level * 0.01, 0.7),
            coinDensity: Math.min(0.4 + level * 0.01, 0.8),
            hasBoss: level % 10 === 0
        };
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            return true;
        }
        return false;
    }

    reset() {
        this.currentLevel = 1;
    }
}
