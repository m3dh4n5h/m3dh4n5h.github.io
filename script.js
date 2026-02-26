/* ================================================================
   PORTFOLIO — script.js
   ================================================================ */

'use strict';

/* ===== Typing Effect ===== */
(function initTyping() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const phrases = ['research that matters.', 'sustainable solutions.', 'engineering bridges.', 'leadership that counts.', 'impactful projects.'];
    let phraseIndex = 0;
    let charIndex   = 0;
    let deleting    = false;

    function tick() {
        const phrase = phrases[phraseIndex];

        if (deleting) {
            charIndex--;
            el.textContent = phrase.slice(0, charIndex);
        } else {
            charIndex++;
            el.textContent = phrase.slice(0, charIndex);
        }

        let delay = deleting ? 55 : 95;

        if (!deleting && charIndex === phrase.length) {
            delay     = 2000;
            deleting  = true;
        } else if (deleting && charIndex === 0) {
            deleting     = false;
            phraseIndex  = (phraseIndex + 1) % phrases.length;
            delay        = 380;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 1200); // start after hero animations
})();


/* ===== Navbar — scroll state & active link ===== */
(function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const navLinks  = document.querySelectorAll('.nav-links a');
    const sections  = document.querySelectorAll('section[id]');

    function onScroll() {
        // Scrolled state
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Back-to-top visibility
        backToTop.classList.toggle('visible', window.scrollY > 420);

        // Active link highlighting
        const scrollMid = window.scrollY + window.innerHeight / 2;
        let activeId    = null;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollMid >= top && scrollMid < bottom) activeId = section.id;
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', isActive);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();


/* ===== Back to Top ===== */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== Smooth Scroll (anchor links) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const id     = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
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
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            close();
        } else {
            hamburger.classList.add('active');
            mobileMenu.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
        }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', close);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            close();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
    });
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


/* ===== Intersection Observer — Scroll Reveal ===== */
(function initReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stagger children when a grid/list becomes visible
                const children = entry.target.querySelectorAll('.project-card.reveal, .skill-item');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 80}ms`;
                    child.classList.add('visible');
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ===== Animated Skill Bars ===== */
(function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                // Small RAF delay so the CSS transition is guaranteed to fire
                requestAnimationFrame(() => {
                    fill.style.width = fill.dataset.width + '%';
                });
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.4 });

    fills.forEach(fill => observer.observe(fill));
})();


/* ===== Contact Form Validation ===== */
(function initForm() {
    const form       = document.getElementById('contactForm');
    const success    = document.getElementById('formSuccess');
    if (!form) return;

    const fields = {
        name:    { rule: v => v.length >= 2,                           msg: 'Please enter your name (at least 2 characters).' },
        email:   { rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),  msg: 'Please enter a valid email address.' },
        subject: { rule: v => v.length >= 3,                           msg: 'Subject must be at least 3 characters.' },
        message: { rule: v => v.length >= 10,                          msg: 'Message must be at least 10 characters.' },
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

    // Live validation on blur
    Object.keys(fields).forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('blur',  () => validateField(id));
        el.addEventListener('input', () => {
            // Clear error eagerly while typing once field has been touched
            if (document.getElementById(id + 'Error').textContent) validateField(id);
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const allOk = Object.keys(fields).map(validateField).every(Boolean);
        if (!allOk) {
            // Focus first invalid field
            const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
            if (firstError) firstError.focus();
            return;
        }

        // Simulate async send
        const btn       = form.querySelector('button[type="submit"]');
        const btnText   = btn.querySelector('.btn-text');
        const btnLoad   = btn.querySelector('.btn-loading');

        btn.disabled    = true;
        btnText.hidden  = true;
        btnLoad.hidden  = false;

        setTimeout(() => {
            btn.disabled   = false;
            btnText.hidden = false;
            btnLoad.hidden = true;
            form.reset();

            // Remove any lingering error states
            form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
            form.querySelectorAll('.field-error').forEach(s => s.textContent = '');

            success.hidden = false;
            success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(() => { success.hidden = true; }, 5000);
        }, 1500);
    });
})();
