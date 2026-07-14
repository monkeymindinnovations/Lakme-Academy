/* =========================================================
   LAKMÉ ACADEMY LUDHIANA — SCRIPT
   Vanilla JS. No frameworks. No backend.
   ========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPreloader();
    initAOS();
    initScrollProgress();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initUrgencyBanner();
    initCountdown();
    initCounters();
    initCourseFilter();
    initGalleryFilter();
    initLightbox();
    initTestimonialSwiper();
    initFaqAccordion();
    initLeadForm();
    initExitIntent();
    initVideoModal();
    initBackToTop();
    initRipple();
    initYear();
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var pre = document.getElementById('preloader');
    if (!pre) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        pre.classList.add('done');
      }, 300);
    });
    // Fallback in case load event already fired / is slow
    setTimeout(function () { pre.classList.add('done'); }, 2500);
  }

  /* ---------- AOS ---------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
    }
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---------- Sticky header shadow ---------- */
  function initStickyHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!hamburger || !menu) return;

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
    function toggleMenu() {
      var isOpen = menu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    }
    hamburger.addEventListener('click', toggleMenu);
    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Smooth scroll (with sticky header offset) ---------- */
  function initSmoothScroll() {
    var header = document.getElementById('siteHeader');
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = (header ? header.offsetHeight : 0) + 12;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    var map = {};
    navLinks.forEach(function (l) { map[l.getAttribute('href')] = l; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = '#' + entry.target.id;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          if (map[id]) map[id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Urgency banner close ---------- */
  function initUrgencyBanner() {
    var banner = document.getElementById('urgencyBanner');
    var closeBtn = document.getElementById('urgencyClose');
    if (!banner || !closeBtn) return;
    closeBtn.addEventListener('click', function () {
      banner.classList.add('hidden');
      document.documentElement.style.setProperty('--header-h', '84px');
    });
  }

  /* ---------- Countdown timer (resets daily at midnight) ---------- */
  function initCountdown() {
    var hEl = document.getElementById('cd-h');
    var mEl = document.getElementById('cd-m');
    var sEl = document.getElementById('cd-s');
    if (!hEl || !mEl || !sEl) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now = new Date();
      var midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      var diff = Math.max(0, midnight - now);
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      hEl.textContent = pad(h);
      mEl.textContent = pad(m);
      sEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---------- Course filter ---------- */
  function initCourseFilter() {
    var buttons = document.querySelectorAll('.course-filters .filter-btn');
    var cards = document.querySelectorAll('.course-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.classList.toggle('hide', !match);
        });
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll('.gallery-filters .filter-btn');
    var items = document.querySelectorAll('.g-item');
    if (!buttons.length || !items.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-gfilter');
        items.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-gcat') === filter;
          item.classList.toggle('hide', !match);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var closeBtn = document.getElementById('lightboxClose');
    var items = document.querySelectorAll('.g-item img');
    if (!lightbox || !lightboxImg || !items.length) return;

    function open(src, alt) {
      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', alt || '');
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- Testimonial Swiper ---------- */
  function initTestimonialSwiper() {
    if (!window.Swiper) return;
    var el = document.querySelector('.testimonial-swiper');
    if (!el) return;
    new Swiper(el, {
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      spaceBetween: 24,
      slidesPerView: 1,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;
    items.forEach(function (item) {
      var q = item.querySelector('.faq-q');
      q.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        items.forEach(function (i) {
          i.classList.remove('active');
          i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Lead form validation + WhatsApp handoff ---------- */
  function initLeadForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    var fields = {
      name: { el: document.getElementById('fName'), err: document.getElementById('err-fName') },
      phone: { el: document.getElementById('fPhone'), err: document.getElementById('err-fPhone') },
      email: { el: document.getElementById('fEmail'), err: document.getElementById('err-fEmail') },
      course: { el: document.getElementById('fCourse'), err: document.getElementById('err-fCourse') },
      branch: { el: document.getElementById('fBranch'), err: document.getElementById('err-fBranch') }
    };

    function setError(field, message) {
      field.err.textContent = message || '';
      field.el.closest('.form-group').classList.toggle('invalid', !!message);
    }

    function validate() {
      var valid = true;

      if (!fields.name.el.value.trim() || fields.name.el.value.trim().length < 2) {
        setError(fields.name, 'Please enter your full name'); valid = false;
      } else setError(fields.name);

      var phoneVal = fields.phone.el.value.trim();
      if (!/^[6-9]\d{9}$/.test(phoneVal)) {
        setError(fields.phone, 'Enter a valid 10-digit mobile number'); valid = false;
      } else setError(fields.phone);

      var emailVal = fields.email.el.value.trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError(fields.email, 'Enter a valid email address'); valid = false;
      } else setError(fields.email);

      if (!fields.course.el.value) {
        setError(fields.course, 'Please select a course'); valid = false;
      } else setError(fields.course);

      if (!fields.branch.el.value) {
        setError(fields.branch, 'Please select a branch'); valid = false;
      } else setError(fields.branch);

      return valid;
    }

    // Restrict phone field to digits
    fields.phone.el.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var name = fields.name.el.value.trim();
      var phone = fields.phone.el.value.trim();
      var course = fields.course.el.value;
      var branch = fields.branch.el.value;
      var message = document.getElementById('fMessage').value.trim();

      showToast();

      var text = 'Hi, I would like to enquire about admissions.%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Phone: ' + encodeURIComponent(phone) + '%0A' +
        'Course: ' + encodeURIComponent(course) + '%0A' +
        'Branch: ' + encodeURIComponent(branch) +
        (message ? '%0AMessage: ' + encodeURIComponent(message) : '');

      setTimeout(function () {
        window.open('https://wa.me/919814155566?text=' + text, '_blank', 'noopener');
        form.reset();
      }, 1200);
    });
  }

  /* ---------- Success toast ---------- */
  function showToast() {
    var toast = document.getElementById('successToast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  /* ---------- Exit intent popup ---------- */
  function initExitIntent() {
    var modal = document.getElementById('exitModal');
    var closeBtn = document.getElementById('exitModalClose');
    var exitForm = document.getElementById('exitForm');
    if (!modal) return;

    var shown = false;
    var STORAGE_KEY = 'lakme_exit_shown_session';

    try {
      shown = sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) { /* storage may be unavailable; fall back to in-memory flag */ }

    function open() {
      if (shown) return;
      modal.classList.add('open');
      shown = true;
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    }
    function close() { modal.classList.remove('open'); }

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY < 10) open();
    });

    // Mobile fallback: show after meaningful scroll + delay, only once
    var mobileTimer = setTimeout(function () {
      if (window.innerWidth <= 768) open();
    }, 45000);

    closeBtn.addEventListener('click', function () {
      close();
      clearTimeout(mobileTimer);
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    if (exitForm) {
      exitForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var inputs = exitForm.querySelectorAll('input');
        var name = inputs[0].value.trim();
        var phone = inputs[1].value.trim();
        if (!name || !/^[6-9]\d{9}$/.test(phone)) {
          inputs[1].style.borderColor = '#E53935';
          return;
        }
        close();
        showToast();
        var text = 'Hi, please call me back.%0AName: ' + encodeURIComponent(name) + '%0APhone: ' + encodeURIComponent(phone);
        setTimeout(function () {
          window.open('https://wa.me/919814155566?text=' + text, '_blank', 'noopener');
          exitForm.reset();
        }, 1000);
      });
    }
  }

  /* ---------- Video modal ---------- */
  function initVideoModal() {
    var openBtn = document.getElementById('playVideoBtn');
    var modal = document.getElementById('videoModal');
    var closeBtn = document.getElementById('videoModalClose');
    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', function () { modal.classList.add('open'); });
    closeBtn.addEventListener('click', function () { modal.classList.remove('open'); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Button ripple effect ---------- */
  function initRipple() {
    document.querySelectorAll('.ripple').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var circle = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        circle.className = 'ripple-effect';
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(circle);
        setTimeout(function () { circle.remove(); }, 650);
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
