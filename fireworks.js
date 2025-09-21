const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.colors = colors;
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(x, y, colors));
    }
  }

  update() {
    this.particles.forEach(p => p.update());
  }

  draw() {
    this.particles.forEach(p => p.draw());
  }
}

class Particle {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.angle = Math.random() * 2 * Math.PI;
    this.speed = Math.random() * 6 + 2;
    this.life = 100;
    this.opacity = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.speed *= 0.95;
    this.life--;
    this.opacity = this.life / 100;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace("OPACITY", this.opacity);
    ctx.fill();
  }
}

let fireworks = [];

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2;
  const colors = [
    "rgba(255,0,0,OPACITY)",
    "rgba(255,165,0,OPACITY)",
    "rgba(255,255,0,OPACITY)",
    "rgba(0,255,0,OPACITY)",
    "rgba(0,0,255,OPACITY)",
    "rgba(75,0,130,OPACITY)",
    "rgba(238,130,238,OPACITY)"
  ];
  fireworks.push(new Firework(x, y, colors));
}

function animate() {
    ctx.fillStyle = "rgba(69, 51, 6, 0.2)"; // mismo #453306 con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    

  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    fw.particles = fw.particles.filter(p => p.life > 0);
    if (fw.particles.length === 0) fireworks.splice(i, 1);
  });

  requestAnimationFrame(animate);
}

setInterval(createFirework, 1200);
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
