const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let colors = [];
let particles = [];
let scrollY = 0;

function updateColors() {
  const style = getComputedStyle(document.documentElement);
  colors = [
    style.getPropertyValue("--primary-color").trim(),
    style.getPropertyValue("--secondary-color").trim(),
    style.getPropertyValue("--bg-secondary").trim(),
    style.getPropertyValue("--text-color-two").trim(),
  ].filter((c) => c !== "");
  
  if (colors.length === 0) {
    colors = ["#42ecff", "#a40ee4", "#deec19"]; // Fallback mixing
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

class Particle {
  constructor() {
    this.shapes = ["{  }", "< />", "< >", "[ ]", "+", "O", "∆", "X", "□", ";", "0", "1"];
    this.reset(true);
    // Randomize initial logical Y to fill screen
    this.y = Math.random() * canvas.height;
  }

  reset(isInit = false) {
    this.shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    this.size = Math.random() * 20 + 10;
    this.x = Math.random() * canvas.width;
    this.y = isInit ? Math.random() * canvas.height : canvas.height + this.size * 2;
    this.speedY = Math.random() * 0.8 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.parallaxFactor = Math.random() * 0.5 + 0.1; // Slower parallax layer (0.1) to faster (0.6)
    this.colorIndex = Math.floor(Math.random() * colors.length);
  }

  update() {
    // Intrinsic floating movement
    this.y -= this.speedY;
    this.x += this.speedX;

    // Horizontal wrap
    if (this.x > canvas.width + this.size) this.x = -this.size;
    else if (this.x < -this.size) this.x = canvas.width + this.size;

    // Vertical intrinsic wrap (base float)
    if (this.y < -this.size * 2) {
      this.reset();
    }
  }

  draw() {
    // Parallax scrolling calculation
    let drawY = this.y - scrollY * this.parallaxFactor;

    // Smooth wrap for Parallax
    let totalHeight = canvas.height + this.size * 4;
    let offsetDrawY = drawY + this.size * 2;
    let wrappedY = ((offsetDrawY % totalHeight) + totalHeight) % totalHeight - this.size * 2;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    // Update color selection organically if theme changes while running
    ctx.fillStyle = colors[this.colorIndex % colors.length] || "#fff";
    ctx.font = `${this.size}px "Courier New", Courier, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.shape, this.x, wrappedY);
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const numParticles = Math.floor((canvas.width * canvas.height) / 12000); // Responsive amount
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

// Watch for theme changes (using MutationObserver to be fully reliable with the checkbox logic)
const themeObserver = new MutationObserver(() => {
  updateColors();
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

// Initial setup
updateColors();
resizeCanvas(); // Will call initParticles
animate();
