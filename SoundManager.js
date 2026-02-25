/* =========================================================
   SOUND MANAGER
   Music + SFX (Mario style)
========================================================= */

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.enabled = true;
        this.volume = 0.6;
    }

    load(name, src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = this.volume;
        this.sounds[name] = audio;
    }

    play(name) {
        if (!this.enabled || !this.sounds[name]) return;
        const s = this.sounds[name];
        s.currentTime = 0;
        s.play();
    }

    playMusic(name) {
        if (!this.enabled) return;
        if (this.music) this.music.pause();
        this.music = this.sounds[name];
        if (this.music) {
            this.music.currentTime = 0;
            this.music.play();
        }
    }

    stopMusic() {
        if (this.music) this.music.pause();
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) this.stopMusic();
    }
}
