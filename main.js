/* ═══════════════════════════════════════════════════════════════
   UNDER FINED — Main JS
   Nav · Scroll reveal · Bubbles · Gallery filters · Lightbox
   Loop stagger · How-step stagger · Stats counter
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var nav    = document.getElementById('navbar');
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');

  /* ── MOBILE NAV ─────────────────────────────────────────── */
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

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── HERO PARALLAX LAYERS (mouse + touch) ────────────────── */
  var heroEl = document.getElementById('hero');
  var heroLayers = heroEl ? heroEl.querySelectorAll('.hero__layer') : [];

  function onHeroMove(clientX, clientY) {
    if (!heroEl) return;
    var r = heroEl.getBoundingClientRect();
    var x = (clientX - (r.left + r.width / 2)) / r.width;
    var y = (clientY - (r.top  + r.height / 2)) / r.height;
    heroEl.style.setProperty('--mx', (x * 60).toFixed(2) + 'px');
    heroEl.style.setProperty('--my', (y * 60).toFixed(2) + 'px');
  }

  window.addEventListener('mousemove', function (e) {
    onHeroMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (!e.touches || !e.touches.length) return;
    onHeroMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  /* ── SCROLL HANDLER ─────────────────────────────────────── */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var sy = window.scrollY;

      /* nav background */
      if (nav) nav.classList.toggle('scrolled', sy > 40);

      /* hero content parallax */
      var heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (sy * 0.15) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - sy / 500);
      }

      /* depth illusion — layers shift at different speeds on scroll */
      if (heroEl && heroLayers.length) {
        var r = heroEl.getBoundingClientRect();
        var progress = Math.min(1, Math.max(0,
          (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        heroLayers.forEach(function (layer, i) {
          var k = (i + 1) * 6;
          layer.style.transform =
            'translate3d(calc(var(--mx,0px) * var(--px,0.02)), calc(var(--my,0px) * var(--py,0.02) + ' +
            (progress * k).toFixed(2) + 'px), 0)';
        });
      }

      /* reveal-on-scroll */
      document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
          el.classList.add('visible');
        }
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HERO BUBBLES (upgraded — glass-like) ───────────────── */
  var heroBubbles = document.getElementById('heroBubbles');
  if (heroBubbles) {
    var bubbleCount = 20;
    for (var i = 0; i < bubbleCount; i++) {
      var b = document.createElement('span');
      b.className = 'bubble';
      var size = 5 + Math.random() * 20;
      var left = Math.random() * 100;
      var dur = 8 + Math.random() * 12;
      var opacity = 0.1 + Math.random() * 0.25;
      var drift = (Math.random() * 2 - 1) * 40;

      b.style.left = left + '%';
      b.style.setProperty('--s', size.toFixed(1) + 'px');
      b.style.setProperty('--d', dur.toFixed(1) + 's');
      b.style.setProperty('--o', opacity.toFixed(2));
      b.style.setProperty('--x', drift.toFixed(1) + 'px');
      b.style.animationDelay = (-Math.random() * dur).toFixed(1) + 's';
      heroBubbles.appendChild(b);
    }
  }

  /* ── PAGE BUBBLES (ambient background) ──────────────────── */
  var pageBubbles = document.getElementById('pageBubbles');
  if (pageBubbles) {
    for (var j = 0; j < 14; j++) {
      var pb = document.createElement('span');
      pb.className = 'bubble';
      var sz = 3 + Math.random() * 8;
      var pLeft = Math.random() * 100;
      var pDur = 14 + Math.random() * 16;
      var pOp = 0.06 + Math.random() * 0.12;
      var pDrift = (Math.random() * 2 - 1) * 50;

      pb.style.left = pLeft + '%';
      pb.style.setProperty('--s', sz.toFixed(1) + 'px');
      pb.style.setProperty('--d', pDur.toFixed(1) + 's');
      pb.style.setProperty('--o', pOp.toFixed(2));
      pb.style.setProperty('--x', pDrift.toFixed(1) + 'px');
      pb.style.animationDelay = (-Math.random() * pDur).toFixed(1) + 's';
      pageBubbles.appendChild(pb);
    }
  }

  /* ── GALLERY FILTERS ────────────────────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* toggle active class */
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              });
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function () { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ── LIGHTBOX ────────────────────────────────────────────── */
  var lb = document.getElementById('lightbox');
  var lbInner = document.getElementById('lightboxContent');

  window.openLightbox = function (el) {
    if (!lb || !lbInner) return;
    var img = el.querySelector('img');
    if (img) {
      lbInner.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || '') + '" style="max-width:90vw;max-height:85vh;border-radius:var(--radius);object-fit:contain;">';
    }
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

  /* ── SMOOTH ANCHORS ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var navH = nav ? nav.offsetHeight : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── LOOP STEP STAGGER ──────────────────────────────────── */
  function staggerGroup(selector, parentSelector) {
    var steps = document.querySelectorAll(selector);
    if (!steps.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var parent = entry.target.closest(parentSelector);
          if (parent) {
            parent.querySelectorAll(selector).forEach(function (s, i) {
              setTimeout(function () {
                s.style.opacity = '1';
                s.style.transform = 'translateY(0)';
              }, i * 90);
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    steps.forEach(function (s) {
      s.style.opacity = '0';
      s.style.transform = 'translateY(14px)';
      s.style.transition = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    observer.observe(steps[0]);
  }

  staggerGroup('.loop__step', '.loop');
  staggerGroup('.how-step', '.how-strip__flow');

  /* ── STATS COUNTER ──────────────────────────────────────── */
  var statNums = document.querySelectorAll('.stat__number');
  if (statNums.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();
          var match = text.match(/^(\d+)/);
          if (match) {
            var target = parseInt(match[1], 10);
            var suffix = text.replace(match[1], '');
            var current = 0;
            var step = Math.ceil(target / 40);
            var timer = setInterval(function () {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current + suffix;
            }, 25);
          }
          cObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (n) { cObs.observe(n); });
  }

  /* ── CARD TILT ON HOVER ─────────────────────────────────── */
  var tiltCards = document.querySelectorAll('.pill, .devlog-card, .mech-card');
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -3;
      var rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── GALLERY ITEM TRANSITIONS ───────────────────────────── */
  galleryItems.forEach(function (item) {
    item.style.transition = 'opacity 0.3s var(--ease), transform 0.3s var(--ease)';
  });

})();
