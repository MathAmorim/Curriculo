(function () {
  'use strict';

  var root = document.documentElement;
  var themeToggleBtn = document.getElementById('theme-toggle');
  var menuToggleBtn = document.getElementById('menu-toggle');
  var siteNav = document.getElementById('menu-navegacao');
  var navLinks = document.querySelectorAll('.nav-link');
  var yearSpan = document.getElementById('current-year');

  // 1. Atualiza o ano no rodapé
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Gerenciamento de Tema (Claro / Escuro)
  function updateThemeButtonLabel(theme) {
    if (!themeToggleBtn) return;
    var label = theme === 'dark'
      ? 'Ativar modo claro'
      : 'Ativar modo escuro';
    themeToggleBtn.setAttribute('aria-label', label);
    themeToggleBtn.setAttribute('title', label);
  }

  function applyTheme(theme, savePreference) {
    root.setAttribute('data-theme', theme);
    updateThemeButtonLabel(theme);
    if (savePreference) {
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // Ignora erro caso localStorage esteja bloqueado
      }
    }
  }

  var currentTheme = root.getAttribute('data-theme') || 'dark';
  updateThemeButtonLabel(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      var activeTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  // Escuta alterações de preferência do sistema operacional caso o usuário não tenha salvo manualmente
  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var handleSystemThemeChange = function (e) {
      try {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
  }

  // 3. Menu de Navegação Mobile
  function closeMobileMenu() {
    if (!menuToggleBtn || !siteNav) return;
    siteNav.classList.remove('is-open');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    menuToggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  function toggleMobileMenu() {
    if (!menuToggleBtn || !siteNav) return;
    var isOpen = siteNav.classList.toggle('is-open');
    menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggleBtn.setAttribute(
      'aria-label',
      isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );
  }

  if (menuToggleBtn && siteNav) {
    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggleBtn.focus();
      }
    });
  }

  // 4. Destaque automático da seção ativa na barra de navegação (Scroll Spy)
  var sections = document.querySelectorAll('main section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    var observerOptions = {
      root: null,
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();

