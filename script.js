/* ============================================================
   BIRTHDAY SURPRISE — script.js
   Clean, well-commented, easy to customise
============================================================ */

"use strict";

/* ──────────────────────────────────────────────────────────
   ✏️  CUSTOMISE EVERYTHING HERE
────────────────────────────────────────────────────────── */

// 💬 Typing animation lines — shown one after another on Page 2
// Change any text you like. Keep lines reasonably short.
const TYPING_LINES = [
  "Before you, Soni, my days were just days…",
  "Then you walked in — and everything had colour.",
  "You didn't just enter my life, you became it.",
  "Every heartbeat now quietly whispers your name.",
  "Soni — my calm in chaos, my home in a person.",
  "Today the stars celebrate what my heart already knows…",
  "That the most beautiful soul was born on this day.",
];

// ⏱  Timing (milliseconds)
const TYPING_SPEED   = 52;   // ms per character (lower = faster)
const ERASE_SPEED    = 28;   // ms per character when erasing
const LINE_PAUSE     = 1800; // pause after typing a full line
const ERASE_PAUSE    = 400;  // pause before erasing

// 🎨 Petal colours on page 1
const PETAL_COLORS = ["#e8437a", "#f472a0", "#a855f7", "#f5c57a", "#ec4899"];

// ❤️  Heart emojis used on page 2
const HEART_EMOJIS  = ["❤️", "🩷", "💕", "💖", "💗", "💓", "💞", "🌹"];

/* ──────────────────────────────────────────────────────────
   DOM REFS
────────────────────────────────────────────────────────── */
const page1          = document.getElementById("page1");
const page2          = document.getElementById("page2");
const surpriseBtn    = document.getElementById("surpriseBtn");
const musicBtn       = document.getElementById("musicBtn");
const replayBtn      = document.getElementById("replayBtn");
const iconMusic      = document.getElementById("iconMusic");
const iconMute       = document.getElementById("iconMute");
const bgMusic        = document.getElementById("bgMusic");
const typingEl       = document.getElementById("typingText");
const cursorEl       = document.querySelector(".cursor");
const bigWish        = document.getElementById("bigWish");
const personalNote   = document.getElementById("personalNote");
const signature      = document.getElementById("signature");
const photoFrame     = document.getElementById("photoFrame");
const floatingHeartsLayer = document.getElementById("floatingHearts");

/* ──────────────────────────────────────────────────────────
   TRANSITION OVERLAY
────────────────────────────────────────────────────────── */
const overlay = document.createElement("div");
overlay.id = "transitionOverlay";
document.body.appendChild(overlay);

/* ──────────────────────────────────────────────────────────
   PAGE 1 — CANVAS PARTICLES
────────────────────────────────────────────────────────── */
(function initCanvas1() {
  const canvas = document.getElementById("canvas1");
  const ctx    = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.8 + 0.4;
    this.vx   = (Math.random() - 0.5) * 0.3;
    this.vy   = -Math.random() * 0.5 - 0.1;
    this.life = Math.random();
    this.col  = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
  };

  function init() {
    resize();
    particles = Array.from({ length: 90 }, () => new Particle());
    window.addEventListener("resize", resize);
    loop();
  }

  function loop() {
    if (!page1.classList.contains("active")) { requestAnimationFrame(loop); return; }
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life += 0.003;
      if (p.y < -10 || p.life > 1) p.reset();
      const alpha = Math.sin(p.life * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + hexAlpha(alpha);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  init();
})();

/* ──────────────────────────────────────────────────────────
   PAGE 1 — PETALS
────────────────────────────────────────────────────────── */
(function spawnPetals() {
  const ring = document.getElementById("petalRing");
  for (let i = 0; i < 28; i++) {
    const p    = document.createElement("div");
    p.className = "petal";
    const col  = PETAL_COLORS[i % PETAL_COLORS.length];
    const size = Math.random() * 8 + 5;
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      width: ${size}px;
      height: ${size * 1.6}px;
      background: ${col};
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * -20}s;
      opacity: 0.18;
      filter: blur(${Math.random() > 0.5 ? "1px" : "0px"});
    `;
    ring.appendChild(p);
  }
})();

/* ──────────────────────────────────────────────────────────
   PAGE TRANSITION: Page 1 → Page 2
────────────────────────────────────────────────────────── */
surpriseBtn.addEventListener("click", goToPage2);

function goToPage2() {
  // Animate button out
  gsap.to(surpriseBtn, { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1 });

  // Fade overlay in
  gsap.to(overlay, {
    opacity: 1, duration: 0.55,
    ease: "power2.inOut",
    onComplete: () => {
      page1.classList.remove("active");
      page2.classList.add("active");
      gsap.to(overlay, {
        opacity: 0, duration: 0.7,
        delay: 0.1, ease: "power2.inOut"
      });
      startPage2();
    }
  });
}

/* ──────────────────────────────────────────────────────────
   PAGE 2 — INIT
────────────────────────────────────────────────────────── */
let page2Started = false;
let heartsInterval;

function startPage2() {
  if (page2Started) resetPage2Animations();
  page2Started = true;

  // Show controls
  gsap.to(".ctrl-btn", {
    opacity: 1, duration: 0.5, stagger: 0.15, delay: 0.3
  });

  // Photo frame entrance
  gsap.to(photoFrame, {
    opacity: 1, scale: 1, duration: 1.1,
    ease: "back.out(1.4)", delay: 0.5
  });

  // "From my heart to yours" label
  gsap.to(".from-label", {
    opacity: 1, y: 0, duration: 0.7,
    ease: "power2.out", delay: 0.9
  });

  // Typing animation — starts at 1.2s
  setTimeout(runTypingLoop, 1200);

  // Big wish
  gsap.to(bigWish, {
    opacity: 1, y: 0, duration: 0.9,
    ease: "power3.out", delay: 1.0
  });

  // Personal note
  gsap.to(personalNote, {
    opacity: 1, y: 0, duration: 0.8,
    ease: "power2.out", delay: 1.4
  });

  // Signature
  gsap.to(signature, {
    opacity: 1, y: 0, duration: 0.8,
    ease: "power2.out", delay: 1.7
  });

  // Start floating hearts
  startHearts();

  // Attempt music autoplay
  attemptAutoplay();
}

function resetPage2Animations() {
  // Reset for replay
  gsap.set([".ctrl-btn", photoFrame, ".from-label", bigWish, personalNote, signature],
    { opacity: 0, y: (i, el) => (el === photoFrame ? 0 : 16) });
  gsap.set(photoFrame, { scale: 0.7 });
  typingEl.textContent = "";
  clearInterval(heartsInterval);
  clearFloatingHearts();
  stopTyping();
}

/* ──────────────────────────────────────────────────────────
   TYPING ANIMATION
────────────────────────────────────────────────────────── */
let typingTimeout;
let stopTypingFlag = false;

function stopTyping() {
  stopTypingFlag = true;
  clearTimeout(typingTimeout);
}

function runTypingLoop() {
  stopTypingFlag = false;
  let lineIndex = 0;

  function cycle() {
    if (stopTypingFlag) return;
    typeLine(TYPING_LINES[lineIndex], () => {
      if (stopTypingFlag) return;
      typingTimeout = setTimeout(() => {
        if (stopTypingFlag) return;
        eraseLine(() => {
          lineIndex = (lineIndex + 1) % TYPING_LINES.length;
          if (!stopTypingFlag) typingTimeout = setTimeout(cycle, 300);
        });
      }, LINE_PAUSE);
    });
  }
  cycle();
}

function typeLine(text, done) {
  let i = 0;
  typingEl.textContent = "";
  function tick() {
    if (stopTypingFlag) return;
    if (i < text.length) {
      typingEl.textContent += text[i++];
      typingTimeout = setTimeout(tick, TYPING_SPEED);
    } else {
      if (done) done();
    }
  }
  tick();
}

function eraseLine(done) {
  function tick() {
    if (stopTypingFlag) return;
    const t = typingEl.textContent;
    if (t.length > 0) {
      typingEl.textContent = t.slice(0, -1);
      typingTimeout = setTimeout(tick, ERASE_SPEED);
    } else {
      if (done) done();
    }
  }
  typingTimeout = setTimeout(tick, ERASE_PAUSE);
}

/* ──────────────────────────────────────────────────────────
   FLOATING HEARTS
────────────────────────────────────────────────────────── */
function spawnHeart() {
  const h   = document.createElement("span");
  h.className = "fheart";
  h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  const size = Math.random() * 18 + 12;
  const dur  = Math.random() * 7 + 7;
  h.style.cssText = `
    left: ${Math.random() * 100}%;
    font-size: ${size}px;
    animation-duration: ${dur}s;
    animation-delay: 0s;
  `;
  floatingHeartsLayer.appendChild(h);
  setTimeout(() => h.remove(), dur * 1000);
}

function startHearts() {
  clearInterval(heartsInterval);
  // Burst of 10 hearts on arrival
  for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 120);
  // Steady drizzle
  heartsInterval = setInterval(spawnHeart, 600);
}

function clearFloatingHearts() {
  clearInterval(heartsInterval);
  floatingHeartsLayer.innerHTML = "";
}

/* ──────────────────────────────────────────────────────────
   PAGE 2 — CANVAS SPARKLES
────────────────────────────────────────────────────────── */
(function initCanvas2() {
  const canvas = document.getElementById("canvas2");
  const ctx    = canvas.getContext("2d");
  let W, H, sparks = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Spark() { this.reset(); }
  Spark.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.2 + 0.3;
    this.vx   = (Math.random() - 0.5) * 0.15;
    this.vy   = (Math.random() - 0.5) * 0.15;
    this.life = Math.random();
    this.col  = Math.random() > 0.5 ? "#f472a0" : "#f5c57a";
  };

  function init() {
    resize();
    sparks = Array.from({ length: 120 }, () => new Spark());
    window.addEventListener("resize", resize);
    loop();
  }

  function loop() {
    if (!page2.classList.contains("active")) { requestAnimationFrame(loop); return; }
    ctx.clearRect(0, 0, W, H);
    sparks.forEach(s => {
      s.x    += s.vx;
      s.y    += s.vy;
      s.life += 0.004;
      if (s.life > 1) s.reset();
      const a = Math.sin(s.life * Math.PI) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col + hexAlpha(a);
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  init();
})();

/* ──────────────────────────────────────────────────────────
   MUSIC
────────────────────────────────────────────────────────── */
let musicPlaying = false;

function attemptAutoplay() {
  if (!bgMusic.src || bgMusic.src === window.location.href) return; // no src set
  bgMusic.volume = 0;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      updateMusicIcon();
      gsap.to(bgMusic, { volume: 0.45, duration: 2 });
    }).catch(() => {
      // Autoplay blocked — user must click
      musicPlaying = false;
      updateMusicIcon();
    });
  }
}

musicBtn.addEventListener("click", () => {
  if (!bgMusic.src || bgMusic.src === window.location.href) {
    // No music file — show subtle pulse on button
    gsap.fromTo(musicBtn, { scale: 1 }, { scale: 1.2, yoyo: true, repeat: 1, duration: 0.15 });
    return;
  }
  if (musicPlaying) {
    gsap.to(bgMusic, {
      volume: 0, duration: 0.5,
      onComplete: () => bgMusic.pause()
    });
    musicPlaying = false;
  } else {
    bgMusic.play();
    gsap.to(bgMusic, { volume: 0.45, duration: 1 });
    musicPlaying = true;
  }
  updateMusicIcon();
});

function updateMusicIcon() {
  iconMusic.classList.toggle("hidden", !musicPlaying);
  iconMute.classList.toggle("hidden",   musicPlaying);
}

/* ──────────────────────────────────────────────────────────
   REPLAY BUTTON
────────────────────────────────────────────────────────── */
replayBtn.addEventListener("click", () => {
  gsap.fromTo(replayBtn, { rotate: 0 }, {
    rotate: 360, duration: 0.6, ease: "power2.inOut",
    onComplete: () => {
      stopTyping();
      resetPage2Animations();
      setTimeout(startPage2, 200);
    }
  });
});

/* ──────────────────────────────────────────────────────────
   UTILITY
────────────────────────────────────────────────────────── */
function hexAlpha(a) {
  // Convert 0-1 alpha to 2-char hex for appending to a colour string
  return Math.round(a * 255).toString(16).padStart(2, "0");
}
