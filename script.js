/* ================================================================
   PORTFOLIO — script.js
================================================================ */
'use strict';

/* ===== Typing Effect ===== */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = [
    'research that matters.',
    'sustainable solutions.',
    'engineering bridges.',
    'leadership that counts.',
    'impactful projects.',
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const phrase = phrases[phraseIndex];
    if (deleting) { charIndex--; el.textContent = phrase.slice(0, charIndex); }
    else           { charIndex++; el.textContent = phrase.slice(0, charIndex); }
    let delay = deleting ? 55 : 95;
    if (!deleting && charIndex === phrase.length)      { delay = 2000; deleting = true; }
    else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 380; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1200);
})();

/* ===== Back to Top ===== */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Navbar — scroll state & active link ===== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('visible', window.scrollY > 420);
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let activeId = null;
    sections.forEach(section => {
      const top = section.offsetTop, bottom = top + section.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) activeId = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ===== Smooth Scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ===== Hamburger Menu ===== */
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  function close() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    if (mobileMenu.classList.contains('open')) { close(); }
    else { hamburger.classList.add('active'); mobileMenu.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true'); }
  });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', e => { if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ===== Dark / Light Mode Toggle ===== */
(function initTheme() {
  const html   = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved  = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ===== Scroll Reveal — fade/slide for sections ===== */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  // Fallback: force everything visible after 2.5s in case IO is slow
  const fallbackTimer = setTimeout(() => {
    revealEls.forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.project-card').forEach(card => card.classList.add('card-visible'));
  }, 2500);

  // Observer for .reveal / .reveal-left / .reveal-right
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px 0px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  // Elements already in viewport on load get revealed instantly
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  // Staggered card reveal — triggered when the parent grid enters viewport
  const gridObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.project-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('card-visible');
          }, i * 130);
        });
        gridObserver.unobserve(entry.target);
        clearTimeout(fallbackTimer);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.projects-grid').forEach(grid => {
    // If grid is already in view on load, stagger immediately
    const rect = grid.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const cards = grid.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('card-visible'), i * 130);
      });
    } else {
      gridObserver.observe(grid);
    }
  });
})();

/* ===== Contact Form Validation ===== */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;
  const fields = {
    name:    { rule: v => v.length >= 2,  msg: 'Please enter your name (at least 2 characters).' },
    email:   { rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    subject: { rule: v => v.length >= 3,  msg: 'Subject must be at least 3 characters.' },
    message: { rule: v => v.length >= 10, msg: 'Message must be at least 10 characters.' },
  };
  function validateField(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    const group = input.closest('.form-group');
    const val   = input.value.trim();
    const ok    = fields[id].rule(val);
    error.textContent = ok ? '' : fields[id].msg;
    group.classList.toggle('error', !ok);
    return ok;
  }
  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => { if (document.getElementById(id + 'Error').textContent) validateField(id); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const allOk = Object.keys(fields).map(validateField).every(Boolean);
    if (!allOk) {
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }
    const btn     = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnLoad = btn.querySelector('.btn-loading');
    btn.disabled  = true; btnText.hidden = true; btnLoad.hidden = false;
    setTimeout(() => {
      btn.disabled = false; btnText.hidden = false; btnLoad.hidden = true;
      form.reset();
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      form.querySelectorAll('.field-error').forEach(s => s.textContent = '');
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1500);
  });
})();
