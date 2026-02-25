/* =====================================================================
   EXTREME PLATFORMER GAME
   File 7: InputManager.js
   Role:
   - Keyboard input
   - Mobile on-screen joystick
   - Jump / action buttons
   - Smooth analog movement
===================================================================== */

/* ====================== INPUT STATE ====================== */
export const Input = {
    left: false,
    right: false,
    jump: false,

    axisX: 0,      // -1 to +1 (joystick strength)
    isMobile: false
};

/* ====================== KEYBOARD INPUT ====================== */
function setupKeyboard() {
    window.addEventListener("keydown", e => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") {
            Input.left = true;
        }
        if (e.code === "ArrowRight" || e.code === "KeyD") {
            Input.right = true;
        }
        if (e.code === "Space" || e.code === "ArrowUp") {
            Input.jump = true;
        }
    });

    window.addEventListener("keyup", e => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") {
            Input.left = false;
        }
        if (e.code === "ArrowRight" || e.code === "KeyD") {
            Input.right = false;
        }
        if (e.code === "Space" || e.code === "ArrowUp") {
            Input.jump = false;
        }
    });
}

/* ====================== MOBILE DETECTION ====================== */
function detectMobile() {
    Input.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* ====================== JOYSTICK ====================== */
let joystickBase, joystickStick;
let baseX = 0, baseY = 0;
let activeTouch = null;
const MAX_DISTANCE = 40;

function setupJoystick() {
    joystickBase = document.getElementById("joystick-base");
    joystickStick = document.getElementById("joystick-stick");

    if (!joystickBase || !joystickStick) return;

    const rect = joystickBase.getBoundingClientRect();
    baseX = rect.left + rect.width / 2;
    baseY = rect.top + rect.height / 2;

    joystickBase.addEventListener("touchstart", startJoystick);
    joystickBase.addEventListener("touchmove", moveJoystick);
    joystickBase.addEventListener("touchend", endJoystick);
}

/* ====================== JOYSTICK HANDLERS ====================== */
function startJoystick(e) {
    activeTouch = e.changedTouches[0].identifier;
}

function moveJoystick(e) {
    for (let t of e.changedTouches) {
        if (t.identifier === activeTouch) {
            const dx = t.clientX - baseX;
            const dy = t.clientY - baseY;

            const distance = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_DISTANCE);
            const angle = Math.atan2(dy, dx);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            joystickStick.style.transform =
                `translate(${x}px, ${y}px)`;

            Input.axisX = x / MAX_DISTANCE;
            Input.left = Input.axisX < -0.2;
            Input.right = Input.axisX > 0.2;
        }
    }
}

function endJoystick() {
    activeTouch = null;
    joystickStick.style.transform = "translate(0px, 0px)";
    Input.axisX = 0;
    Input.left = false;
    Input.right = false;
}

/* ====================== JUMP BUTTON ====================== */
function setupJumpButton() {
    const jumpBtn = document.getElementById("btn-jump");
    if (!jumpBtn) return;

    jumpBtn.addEventListener("touchstart", () => {
        Input.jump = true;
    });

    jumpBtn.addEventListener("touchend", () => {
        Input.jump = false;
    });
}

/* ====================== INPUT UPDATE ====================== */
export function applyInput(player) {
    let speed = 4;

    // analog joystick support
    if (Input.axisX !== 0) {
        player.vx = speed * Input.axisX;
    } else {
        if (Input.left) player.vx = -speed;
        else if (Input.right) player.vx = speed;
        else player.vx = 0;
    }

    if (Input.jump) {
        player.jump();
        Input.jump = false;
    }
}

/* ====================== INIT ====================== */
export function initInput() {
    detectMobile();
    setupKeyboard();

    if (Input.isMobile) {
        setupJoystick();
        setupJumpButton();
    }
}
