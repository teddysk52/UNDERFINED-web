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

  /* ── SCROLL HANDLER ─────────────────────────────────────── */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var sy = window.scrollY;

      /* nav background */
      if (nav) nav.classList.toggle('scrolled', sy > 40);

      /* hero parallax */
      var heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (sy * 0.1) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - sy / 500);
      }

      /* reveal-on-scroll */
      document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
          el.classList.add('visible');
        }
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HERO BUBBLES ───────────────────────────────────────── */
  var heroBubbles = document.getElementById('heroBubbles');
  if (heroBubbles) {
    for (var i = 0; i < 12; i++) {
      var b = document.createElement('div');
      b.className = 'bubble';
      var size = Math.random() * 5 + 2;
      b.style.cssText =
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + (Math.random() * 100) + '%;' +
        'animation-duration:' + (Math.random() * 18 + 14) + 's;' +
        'animation-delay:' + (Math.random() * 10) + 's;' +
        '--drift:' + ((Math.random() - 0.5) * 50) + 'px;';
      heroBubbles.appendChild(b);
    }
  }

  /* ── PAGE BUBBLES (ambient background) ──────────────────── */
  var pageBubbles = document.getElementById('pageBubbles');
  if (pageBubbles) {
    for (var j = 0; j < 18; j++) {
      var pb = document.createElement('div');
      pb.className = 'bubble';
      var sz = Math.random() * 3 + 1.5;
      pb.style.cssText =
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'left:' + (Math.random() * 100) + '%;' +
        'animation-duration:' + (Math.random() * 25 + 20) + 's;' +
        'animation-delay:' + (Math.random() * 15) + 's;' +
        '--drift:' + ((Math.random() - 0.5) * 70) + 'px;';
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
    var ph = el.querySelector('.gallery-item__ph');
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

  /* ── GALLERY ITEM TRANSITIONS ───────────────────────────── */
  galleryItems.forEach(function (item) {
    item.style.transition = 'opacity 0.3s var(--ease), transform 0.3s var(--ease)';
  });

})();
