/* ============================================
   MedAI Surgery — i18n Engine
   Language: EN (default) / zh-Hant / zh-Hans
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'medai-lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'zh-Hant', 'zh-Hans'];

  /* Detect the current page key from filename */
  function getPageKey() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const map = {
      index: 'index', about: 'about', services: 'services',
      cases: 'cases', team: 'team', contact: 'contact'
    };
    return map[page] || 'index';
  }

  /* Get persisted language or fall back to default */
  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  /* Persist language choice */
  function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  /* Apply translations to every [data-i18n] element */
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    /* text content */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    /* placeholder attributes */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key] !== undefined) {
        el.placeholder = dict[key];
      }
    });

    /* aria-label attributes */
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.dataset.i18nAria;
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    /* Page <title> */
    const pageKey = getPageKey();
    const titleKey = 'title.' + pageKey;
    if (dict[titleKey]) {
      document.title = dict[titleKey];
    }

    /* <html lang=""> */
    document.documentElement.lang = lang;

    /* Highlight active lang button */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  /* Switch language and re-apply */
  function switchLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    setStoredLang(lang);
    applyTranslations(lang);
  }

  /* Wire up switcher buttons */
  function initSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => switchLang(btn.dataset.lang));
    });
  }

  /* Bootstrap */
  function init() {
    const lang = getStoredLang();
    applyTranslations(lang);
    initSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for programmatic use */
  window.MedAIi18n = { switchLang, getStoredLang };
})();
