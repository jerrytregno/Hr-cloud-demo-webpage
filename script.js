// ============================================================
// Workmates landing — interactions & animations
// ============================================================

// ---- Sticky nav shadow on scroll ----
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---- Mobile menu ----
const burger = document.getElementById('burger');
burger?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav__links a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// ---- Scroll reveal ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // small stagger for siblings
        const delay = entry.target.dataset.delay || (i % 3) * 90;
        setTimeout(() => entry.target.classList.add('in'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ---- Animated stat counters ----
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * easeOut(progress);
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat__num').forEach((el) => countObserver.observe(el));

// ---- Subtle parallax on hero art ----
const heroArt = document.querySelector('.hero__art');
if (heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener(
    'mousemove',
    (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      heroArt.style.transform = `translate(${x}px, ${y}px)`;
    },
    { passive: true }
  );
}

// ---- YouTube video lightbox ----
// Replace VIDEO_ID with your real demo video's YouTube ID.
const VIDEO_ID = 'ScMzIvxBSi4';

const lightbox = document.getElementById('videoLightbox');
const openVideoBtn = document.getElementById('playVideo');
const closeVideoBtn = document.getElementById('closeVideo');
const videoFrame = document.getElementById('videoFrame');
let lastFocused = null;

function openLightbox() {
  if (!lightbox) return;
  lastFocused = document.activeElement;
  videoFrame.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
  lightbox.hidden = false;
  document.body.classList.add('lb-open');
  requestAnimationFrame(() => lightbox.classList.add('open'));
  closeVideoBtn?.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.classList.remove('open');
  document.body.classList.remove('lb-open');
  const cleanup = () => {
    lightbox.hidden = true;
    videoFrame.src = '';
    lightbox.removeEventListener('transitionend', cleanup);
  };
  lightbox.addEventListener('transitionend', cleanup);
  setTimeout(cleanup, 400);
  lastFocused?.focus();
}

openVideoBtn?.addEventListener('click', openLightbox);
closeVideoBtn?.addEventListener('click', closeLightbox);
lightbox?.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeLightbox));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
