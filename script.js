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

let asteroides = [];
class Asteroide {
    constructor(x, y, dx, dy, radio) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radio = radio;
        this.vertices = this.generarVertices();
    }

    generarVertices() {
        const puntos = Math.floor(Math.random() * 5) + 8; 
        const vertices = [];
        for (let i = 0; i < puntos; i++) {
            const angulo = (i / puntos) * Math.PI * 2;
            const variacion = this.radio * (0.6 + Math.random() * 0.4); 
            vertices.push({
                x: Math.cos(angulo) * variacion,
                y: Math.sin(angulo) * variacion
            });
        }
        return vertices;
    }

    mover() {
        this.x += this.dx;
        this.y += this.dy;
    }

    dibujar() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

function crearAsteroide() {
    let lado = Math.floor(Math.random() * 4);
    let x, y;

    if (lado === 0) {
        x = Math.random() * canvas.width;
        y = 0;
    } else if (lado === 1) {
        x = Math.random() * canvas.width;
        y = canvas.height;
    } else if (lado === 2) {
        x = 0;
        y = Math.random() * canvas.height;
    } else {
        x = canvas.width;
        y = Math.random() * canvas.height;
    }

    let radio = Math.random() * 40 + 30;

    let anguloHaciaCentro = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    let variacion = (Math.random() - 0.5) * 1;

    let velocidadBase = Math.random() * 2 + 1;
    let dx = Math.cos(anguloHaciaCentro + variacion) * velocidadBase;
    let dy = Math.sin(anguloHaciaCentro + variacion) * velocidadBase;
    return new Asteroide(x, y, dx, dy, radio);

}

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
        ship.angle -= velocidadRotacion;
    }
    if (keys["ArrowRight"]) {
        ship.angle += velocidadRotacion;
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


    if (Math.random() < 0.005) {
        asteroides.push(crearAsteroide());
    }

    asteroides.forEach((asteroide, i) => {
        asteroide.mover();
        asteroide.dibujar();
        if (
            asteroide.x < -100 || asteroide.x > canvas.width + 100 ||
            asteroide.y < -100 || asteroide.y > canvas.height + 100
        ) {
            asteroides.splice(i, 1);
        }
    });
    drawShip();
    drawBullets();

    for (let i = asteroides.length - 1; i >= 0; i--) {
        let asteroide = asteroides[i];

        //Bala vs Asteroide
        for (let j = bullets.length - 1; j >= 0; j--) {
            let bala = bullets[j];
            let dx = asteroide.x - bala.x;
            let dy = asteroide.y - bala.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < asteroide.radio) {
                asteroides.splice(i, 1); 
                bullets.splice(j, 1);
                break; 
            }
        }

        //Nave vs Asteroide
        if (asteroides[i]) { 
            let dxNave = asteroide.x - ship.x;
            let dyNave = asteroide.y - ship.y;
            let distNave = Math.sqrt(dxNave * dxNave + dyNave * dyNave);

            if (distNave < asteroide.radio + 10) {
                console.log("¡Game Over!");
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
                ship.vx = 0;
                ship.vy = 0;
                break;
            }
        }
    }
    requestAnimationFrame(loop);
}
loop();