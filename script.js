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
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
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
    drawShip();
    requestAnimationFrame(loop);
}

loop();