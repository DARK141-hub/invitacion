const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleSize = canvas.width / 40; // Smaller size for more dynamic look
const fallSpeed = 2;
let particles = [];
const rows = Math.floor(canvas.height / particleSize);
const columns = Math.floor(canvas.width / particleSize);
const grid = Array.from({ length: rows }, () => Array(columns).fill(null));

// Tetris shapes
const shapes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]] // J
];

function Particle(x, y, color, velocity, shape) {
    this.x = x;
    this.y = y;
    this.size = particleSize;
    this.color = color;
    this.velocity = velocity;
    this.shape = shape;

    this.update = function () {
        let canFall = true;
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j]) {
                    const newY = this.y + i * this.size + this.velocity.y;
                    const newX = this.x + j * this.size;
                    if (newY + this.size > canvas.height || grid[Math.floor(newY / this.size)][Math.floor(newX / this.size)]) {
                        canFall = false;
                        break;
                    }
                }
            }
            if (!canFall) break;
        }

        if (canFall) {
            this.y += this.velocity.y;
        } else {
            const gridX = Math.floor(this.x / this.size);
            const gridY = Math.floor(this.y / this.size);
            for (let i = 0; i < this.shape.length; i++) {
                for (let j = 0; j < this.shape[i].length; j++) {
                    if (this.shape[i][j]) {
                        grid[gridY + i][gridX + j] = this;
                    }
                }
            }
            this.velocity.y = 0;
        }
    };

    this.draw = function () {
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape[i].length; j++) {
                if (this.shape[i][j]) {
                    ctx.fillRect(this.x + j * this.size, this.y + i * this.size, this.size, this.size);
                }
            }
        }
    };
}

function createParticles() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = `hsl(${Math.random() * 360}, 80%, 50%)`;
    const velocity = { x: 0, y: fallSpeed };
    const x = Math.floor(Math.random() * (columns - shape[0].length)) * particleSize;
    particles.push(new Particle(x, 0, color, velocity, shape));
}

function checkAndClearRows() {
    for (let y = rows - 1; y >= 0; y--) {
        if (grid[y].every(cell => cell)) {
            for (let clearedY = y; clearedY > 0; clearedY--) {
                grid[clearedY] = grid[clearedY - 1];
                grid[clearedY].forEach(cell => {
                    if (cell) cell.y += particleSize;
                });
            }
            grid[0] = Array(columns).fill(null);
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    particles = particles.filter(p => p.velocity.y !== 0);
    checkAndClearRows();

    requestAnimationFrame(animateParticles);
}

// Confetti animation function
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.id = 'confetti';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiPiece.style.left = `${Math.random() * 100}vw`;
        confettiPiece.style.background = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Colores aleatorios
        confettiPiece.style.animationDelay = `${Math.random() * 3}s`;
        confettiContainer.appendChild(confettiPiece);
    }

    confettiContainer.style.display = 'block';
    setTimeout(() => {
        confettiContainer.remove(); // Remove the confetti container
    }, 3000);
}

// Mostrar dislike
function showDislike() {
    const dislikeContainer = document.getElementById('dislike');
    dislikeContainer.style.display = 'block';
    setTimeout(() => {
        dislikeContainer.style.display = 'none';
    }, 3000);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    grid.forEach(row => row.fill(null));
});

animateParticles(); // Start animation loop
setInterval(createParticles, 500);

// Lógica del Reloj y Barra de Vida
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock(); // Initial call to set the time immediately

const hearts = [];
const lifeBar = document.getElementById('life-bar');
for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    lifeBar.appendChild(heart);
    hearts.push(heart);
}

let heartIndex = 0;
setInterval(() => {
    if (heartIndex < hearts.length) {
        hearts[heartIndex].classList.add('dimmed');
        heartIndex++;
    } else {
        hearts.forEach(heart => heart.classList.remove('dimmed'));
        heartIndex = 0;
    }
}, 15000);
