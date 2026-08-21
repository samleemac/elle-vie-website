(function () {
  var MENU_BREAKPOINT = 992;
  var menuBtn = document.querySelector('.icon-menu');
  var nav = document.getElementById('site-nav');
  var modal = document.getElementById('reservationModal');
  var closeBtn = modal ? modal.querySelector('.modal__close') : null;

  function isMobileNav() {
    return window.matchMedia('(max-width: ' + MENU_BREAKPOINT + 'px)').matches;
  }

  function syncNavInert() {
    if (!nav) return;
    var hide = isMobileNav() && !document.body.classList.contains('menu-open');
    var links = nav.querySelectorAll('a');
    if (hide) {
      nav.setAttribute('inert', '');
    } else {
      nav.removeAttribute('inert');
    }
    links.forEach(function (link) {
      if (hide) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  }

  function setMenuOpen(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    syncNavInert();
    if (open && nav) {
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else if (!open && menuBtn && nav && nav.contains(document.activeElement)) {
      menuBtn.focus();
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function openModal() {
    if (!modal) return;
    closeMenu();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.body.classList.contains('menu-open')) {
      document.body.style.overflow = '';
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenuOpen(!document.body.classList.contains('menu-open'));
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) {
      closeMenu();
      if (menuBtn) menuBtn.focus();
      return;
    }
    if (modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  window.addEventListener('resize', function () {
    if (!isMobileNav()) closeMenu();
    syncNavInert();
  });

  syncNavInert();

  document.querySelectorAll('[data-open-reservation], .main__button').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!modal) return;
      e.preventDefault();
      openModal();
    });
  });

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }
})();
