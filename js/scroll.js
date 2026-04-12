/* ============================================
   MedAI Surgery — Scroll Animation Engine
   Intersection Observer + Parallax + Sticky
   ============================================ */

(function () {
  'use strict';

  /* --- Intersection Observer: animate elements on scroll --- */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* --- Parallax scrolling --- */
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.parentElement.getBoundingClientRect();
        const inView =
          rect.bottom > 0 && rect.top < window.innerHeight;

        if (inView) {
          const offset = (scrollY - el.parentElement.offsetTop) * speed;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --- Sticky scroll sections with progress --- */
  function initStickyScroll() {
    const stickySections = document.querySelectorAll('.sticky-section');
    if (!stickySections.length) return;

    let ticking = false;

    function updateSticky() {
      stickySections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;

        const scrolled = -rect.top;
        const totalScroll = sectionHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

        section.style.setProperty('--scroll-progress', progress);

        const lines = section.querySelectorAll('.sticky-text-line');
        if (lines.length) {
          const step = 1 / lines.length;
          lines.forEach((line, i) => {
            const lineStart = i * step;
            const lineEnd = lineStart + step;
            if (progress >= lineStart && progress < lineEnd + 0.1) {
              line.classList.add('is-active');
            } else if (progress < lineStart) {
              line.classList.remove('is-active');
            }
          });
        }

        const progressItems = section.querySelectorAll('[data-sticky-item]');
        if (progressItems.length) {
          const step = 1 / progressItems.length;
          progressItems.forEach((item, i) => {
            const itemProgress = Math.max(
              0,
              Math.min(1, (progress - i * step) / step)
            );
            item.style.setProperty('--item-progress', itemProgress);

            if (progress >= i * step && progress < (i + 1) * step + 0.05) {
              item.classList.add('is-active');
            } else {
              item.classList.remove('is-active');
            }
          });
        }
      });

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateSticky);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateSticky();
  }

  /* --- Counter animation --- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration, 10) || 2000;
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(now) {
      const elapsed = now - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeOutQuart(rawProgress);
      const current = Math.round(progress * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (rawProgress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* --- 3D card tilt --- */
  function initCardTilt() {
    const cards = document.querySelectorAll('.card-3d');
    if (!cards.length) return;

    cards.forEach((card) => {
      const inner = card.querySelector('.card-3d__inner') || card;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform =
          'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  /* --- Particle background --- */
  function initParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = 10 + Math.random() * 20 + 's';
      particle.style.width = 1 + Math.random() * 2 + 'px';
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  /* --- Initialize all scroll features --- */
  function init() {
    initScrollAnimations();
    initParallax();
    initStickyScroll();
    initCounters();
    initCardTilt();
    initParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
