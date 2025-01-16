const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

class Firework {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = 5;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.distance = Math.hypot(targetX - x, targetY - y);
    this.traveled = 0;
    this.exploded = false;
  }

  update() {
    if (this.traveled < this.distance) {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.traveled += this.speed;
    } else {
      this.exploded = true;
      this.createParticles();
    }
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 3 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.exploded) {
      fireworks.splice(index, 1);
    }
  });

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

// Manual trigger on click
canvas.addEventListener('click', (e) => {
  const x = canvas.width / 2;
  const y = canvas.height;
  fireworks.push(new Firework(x, y, e.clientX, e.clientY));
});

// Auto-launch fireworks every 2 seconds
setInterval(() => {
  const x = canvas.width / 2;
  const y = canvas.height;
  const targetX = Math.random() * canvas.width;
  const targetY = Math.random() * (canvas.height / 2); // Launch towards the upper half of the screen
  fireworks.push(new Firework(x, y, targetX, targetY));
}, 2000);

animate();