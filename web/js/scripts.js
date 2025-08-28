// Fires when the HTML document has been completely parsed and all deferred scripts have downloaded & executed
document.addEventListener("DOMContentLoaded", () => {
  //Theme - Default to dark
  document.body.classList.remove("light");
  const icon = document.getElementById("themeToggle").querySelector("i");
  icon.className = "fas fa-sun";

  //Theme toggle
  const navLinks = document.getElementById('navLinks');
  document.getElementById("themeToggle").addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    const icon = document.getElementById("themeToggle").querySelector("i");
    icon.className = isLight ? "fas fa-moon" : "fas fa-sun";
    navLinks.classList.remove('show');
  });

  // Mobile nav
  const toggleButton = document.getElementById('menuToggle');
  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Close mobile nav menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('show'));
  });

  // Copyright year
  document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// Galaxy background with soft moving stars and shooting stars
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let starCount = window.innerWidth < 600 ? 80 : 150; // Abjusted star count on mobile
let mouseX = w / 2;
let mouseY = h / 2;

const colors = ['#ffffff', '#99ccff', '#cc99ff']; // White, Bluish, Purplish

let shootingStar = {
  active: false,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  length: 0,
  life: 0,
  maxLife: 0
};

function createStars() {
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.5,
      twinkleSpeed: Math.random() * 0.008 + 0.004,
      twinkleOffset: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function createShootStar() {
  const isMobile = window.innerWidth < 600;
  const chance = isMobile ? 0.0003 : 0.0005; // Lower chance for natural look ~0.05% chance per frame

  if (!shootingStar.active && Math.random() < chance) {
    const fromLeft = Math.random() > 0.5; // Randomize the entry side for variety each time
    shootingStar.active = true;
    shootingStar.x = fromLeft ? -100 : w + 100; // Math.random() * w // Start off-screen (+100 left/right)
    shootingStar.y = Math.random() * h * 0.5; // On top 50% of screen
    shootingStar.vx = fromLeft ? (Math.random() * 4 + 6) : -(Math.random() * 4 + 6); // + 4 // Speed x
    shootingStar.vy = Math.random() * 2 + 1; // * 1.5 + 0.5; // Speed y
    shootingStar.length = 100 + Math.random() * 100;
    shootingStar.life = 0;
    shootingStar.maxLife = 200 + Math.random() * 40;
  }
}

function drawStars(time) {
  ctx.clearRect(0, 0, w, h);

  // Star field motion
  stars.forEach(star => {
    const dx = (mouseX - w / 2) * 0.001;
    const dy = (mouseY - h / 2) * 0.001;
    star.x += dx * star.speed;
    star.y += dy * star.speed;

    // Wrap stars
    if (star.x < 0) star.x = w;
    if (star.x > w) star.x = 0;
    if (star.y < 0) star.y = h;
    if (star.y > h) star.y = 0;

    const twinkle = 0.2 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + star.baseAlpha;

    ctx.beginPath();
    ctx.globalAlpha = Math.min(1, Math.max(0, twinkle));
    ctx.fillStyle = star.color;
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Draw shooting star - Create an object on every frame
  createShootStar();

  if (shootingStar.active) {
    const trailLength = shootingStar.length;
    const progress = shootingStar.life / shootingStar.maxLife;
    const fade = progress < 0.1 ? progress / 0.1 // fade in
      : progress > 0.9 ? (1 - progress) / 0.1 // fade out
      : 1;

    ctx.save(); // Save current canvas state
    ctx.globalAlpha = fade;

    // Glow blur effect
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 20; // Tweak for more or less glow

    // Create gradient trail
    const grad = ctx.createLinearGradient(
      shootingStar.x, shootingStar.y,
      shootingStar.x - shootingStar.vx * trailLength,
      shootingStar.y - shootingStar.vy * trailLength
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(
      shootingStar.x - shootingStar.vx * trailLength,
      shootingStar.y - shootingStar.vy * trailLength
    );
    ctx.stroke();
    ctx.restore(); // Restore canvas state

    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.life++;

    if (shootingStar.life > shootingStar.maxLife) {
      shootingStar.active = false;
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  createStars();
});

createStars();
requestAnimationFrame(drawStars);

// Scroll to top button
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Privacy
const privacyPopup = document.getElementById("privacyPopup");
const acceptBtn = document.getElementById("acceptPrivacy");
const closeBtn = document.getElementById("closePrivacy");

// Show privacy message only if not accepted
window.addEventListener("DOMContentLoaded", () => {
  const consent = localStorage.getItem("privacyAccepted");
  if (!consent) {
    setTimeout(() => {
      privacyPopup.classList.remove("hidden");
    }, 500);
  }
});

// Hide privacy message with storing at localstorage
acceptBtn.addEventListener("click", () => {
  localStorage.setItem("privacyAccepted", "true");
  privacyPopup.classList.add("hidden");
});

// Hide privacy message without storing at localstorage
closeBtn.addEventListener("click", () => {
  privacyPopup.classList.add("hidden");
});
