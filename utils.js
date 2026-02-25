/* =========================================================
   UTILS
========================================================= */

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function rectsIntersect(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function rand(min, max) {
    return Math.random() * (max - min) + min;
}

export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function fullscreen(canvas) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
}

export function createButton(id, text) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.textContent = text;
    btn.className = "ui-btn";
    document.body.appendChild(btn);
    return btn;
}
