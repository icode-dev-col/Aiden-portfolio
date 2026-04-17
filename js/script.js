const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Event Listeners: Handling toggle event
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

toggleSwitch.addEventListener("change", switchTheme, false);

//  Store color theme for future visits

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark"); //add this
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light"); //add this
  }
}

// Save user preference on load

const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
  }
}

//Adding date

let myDate = document.querySelector("#datee");

const yes = new Date().getFullYear();
myDate.innerHTML = yes;

// Scroll Reveal Animation
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      setTimeout(() => {
        entry.target.classList.remove('reveal', 'active');
      }, 1000);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Fire Breath Particle System
const fireContainer = document.getElementById("fire-breath");

function createFireParticle() {
  if (!fireContainer) return;

  const particle = document.createElement("div");
  particle.classList.add("fire-particle");

  // Calculate random outward spread trajectory
  const angle = (Math.random() - 0.5) * 80; // Spread angle degree
  const velocity = Math.random() * 25 + 30; // Distance

  // Set CSS variables for the animation to read
  particle.style.setProperty("--tx", `${Math.sin((angle * Math.PI) / 180) * velocity}px`);
  particle.style.setProperty("--ty", `${Math.cos((angle * Math.PI) / 180) * velocity}px`);

  // Randomized particle sizing
  const size = Math.random() * 20 + 10;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  fireContainer.appendChild(particle);

  // Clean up DOM after animation completes
  setTimeout(() => particle.remove(), 700);
}

// Emits a flame puff roughly every 40 milliseconds for a smooth stream
if (fireContainer) {
  setInterval(createFireParticle, 40);
}
