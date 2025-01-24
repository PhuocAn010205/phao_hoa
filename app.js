const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];
let currentTheme = 'random'; // Initial theme
let isTextDisplayed = false; // Track if text is displayed

// Function to switch themes automatically
setInterval(() => {
  const themeKeys = Object.keys(themes);
  currentTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
}, 10000);

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
      // Display text when the first firework explodes
    }
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y, currentTheme));
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
  constructor(x, y, theme) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 3 + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.color = this.generateColor(theme);
  }

  generateColor(theme) {
    if (theme === 'random') {
      return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    const hues = themes[theme];
    const hue = hues[Math.floor(Math.random() * hues.length)];
    return `hsl(${hue}, 100%, 50%)`;
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

// Function to display text
function displayText(message) {
  ctx.save();
  ctx.font = '60px Arial';
  ctx.fillStyle = 'yellow';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 20;
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  ctx.restore();

  // Clear the text after a short delay
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
