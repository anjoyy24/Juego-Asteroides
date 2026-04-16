const canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    vx: 0,
    vy: 0
};
let keys = {};
let velocidadRotacion = 0.05;
let fuerza = 0.2;
let bullets = [];
let bulletSpeed = 6;
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") {
        bullets.push({
            x: ship.x,
            y: ship.y,
            vx: Math.cos(ship.angle) * bulletSpeed,
            vy: Math.sin(ship.angle) * bulletSpeed,
            life: 60
        });
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-15, 12);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, -12);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
}

function drawBullets() {
    ctx.fillStyle = "white";
    bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys["ArrowLeft"]) {
        ship.angle -= velocidadRotacion;
    }
    if (keys["ArrowRight"]) {
        ship.angle += velocidadRotacion;
    }
    if (keys["ArrowUp"]) {
        ship.vx += Math.cos(ship.angle) * fuerza;
        ship.vy += Math.sin(ship.angle) * fuerza;
    }
    ship.x += ship.vx;
    ship.y += ship.vy;
    ship.vx *= 0.99;
    ship.vy *= 0.99;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.y > canvas.height) ship.y = 0;
    if (ship.y < 0) ship.y = canvas.height;
    bullets.forEach((b, index) => {
        b.x += b.vx;
        b.y += b.vy;
        b.life--;
        if (b.x > canvas.width) b.x = 0;
        if (b.x < 0) b.x = canvas.width;
        if (b.y > canvas.height) b.y = 0;
        if (b.y < 0) b.y = canvas.height;
        if (b.life <= 0) {
            bullets.splice(index, 1);
        }
    });

    drawShip();
    drawBullets();

    requestAnimationFrame(loop);
}
loop();