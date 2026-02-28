/* ═══════════════════════════════════════════════════════════════
   UNDER FINED — Shared JavaScript
   Navigation, scroll reveal, bubbles, lightbox, smooth anchors
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAVIGATION ─────────────────────────────────────────── */
  const nav       = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const links     = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* mark active nav link */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL HANDLER ─────────────────────────────────────── */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const sy = window.scrollY;

      /* nav background */
      if (nav) nav.classList.toggle('scrolled', sy > 60);

      /* hero parallax */
      const heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (sy * 0.12) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - sy / 600);
      }

      /* reveal on scroll */
      document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add('visible');
        }
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  /* ── BUBBLES (hero) ─────────────────────────────────────── */
  const bubbleContainer = document.getElementById('heroBubbles');
  if (bubbleContainer) {
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = Math.random() * 5 + 2;
      b.style.cssText =
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + (Math.random() * 100) + '%;' +
        'animation-duration:' + (Math.random() * 20 + 12) + 's;' +
        'animation-delay:' + (Math.random() * 12) + 's;' +
        '--drift:' + ((Math.random() - 0.5) * 60) + 'px;';
      bubbleContainer.appendChild(b);
    }
  }

  /* ── LIGHTBOX ────────────────────────────────────────────── */
  const lb = document.getElementById('lightbox');
  const lbInner = document.getElementById('lightboxContent');

  window.openLightbox = function (el) {
    if (!lb || !lbInner) return;
    const ph = el.querySelector('.visual-placeholder, .gallery-item__ph');
    if (ph) lbInner.innerHTML = ph.outerHTML;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function (e) {
    if (!lb) return;
    if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox__close')) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ── SMOOTH ANCHOR LINKS ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navH = nav ? nav.offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── LOOP STEPS STAGGER ─────────────────────────────────── */
  const loopSteps = document.querySelectorAll('.loop__step');
  if (loopSteps.length) {
    const loopObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const parent = entry.target.closest('.loop');
          if (parent) {
            parent.querySelectorAll('.loop__step').forEach(function (s, i) {
              setTimeout(function () {
                s.style.opacity = '1';
                s.style.transform = 'translateY(0)';
              }, i * 110);
            });
          }
          loopObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    loopSteps.forEach(function (s) {
      s.style.opacity = '0';
      s.style.transform = 'translateY(16px)';
      s.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    loopObserver.observe(loopSteps[0]);
  }

  /* ── STATS COUNTER ANIMATION ────────────────────────────── */
  const statNums = document.querySelectorAll('.stat__number');
  if (statNums.length) {
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/^(\d+)/);
          if (match) {
            const target = parseInt(match[1], 10);
            const suffix = text.replace(match[1], '');
            let current = 0;
            const step = Math.ceil(target / 45);
            const timer = setInterval(function () {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current + suffix;
            }, 28);
          }
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (n) { cObs.observe(n); });
  }

})();
