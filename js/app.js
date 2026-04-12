/* ============================================
   MedAI Surgery — App Controller
   Navigation, mobile menu, smooth scroll, theme
   ============================================ */

(function () {
  'use strict';

  /* --- Theme Toggle (Light / Dark, default: light) --- */
  const THEME_KEY = 'medai-theme';
  const DEFAULT_THEME = 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function getTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return DEFAULT_THEME;
  }

  /* Apply theme ASAP to avoid flash */
  applyTheme(getTheme());

  function initThemeToggle() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        applyTheme(current === 'light' ? 'dark' : 'light');
      });
    });
  }

  /* Expose for external access */
  window.MedAITheme = { applyTheme, getTheme };

  /* --- Glassmorphism Navigation on Scroll --- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // If the page has a photo hero, keep nav in light (white) mode at all times
    if (document.querySelector('.hero--photo')) {
      nav.classList.add('nav--light-hero');
    }

    let ticking = false;

    function onScroll() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    onScroll();
  }

  /* --- Mobile Hamburger Menu --- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.nav__hamburger');
    const mobileMenu = document.querySelector('.nav__mobile');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open')
        ? 'hidden'
        : '';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active Nav Link Highlighting --- */
  function initActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;

        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Page Transition Fade --- */
  function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';

    function fadeIn() {
      document.body.style.opacity = '1';
    }

    if (document.readyState === 'complete') {
      requestAnimationFrame(fadeIn);
    } else {
      window.addEventListener('load', () => requestAnimationFrame(fadeIn));
    }
  }

  /* --- Initialize --- */
  function init() {
    initPageTransition();
    initNav();
    initMobileMenu();
    initActiveLinks();
    initSmoothScroll();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
