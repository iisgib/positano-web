/* ─────────────────────────────────────────────────────────────
   Positano Ristorante — script.js
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Nav: solidify on scroll ─────────────────────────────────
  const nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu ─────────────────────────────────────────────
  const toggle   = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay  = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ── Smooth-scroll nav links ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 76; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Scroll reveal ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObs.observe(el));

  // ── Set date input minimum to today ─────────────────────────
  const dateInput = document.getElementById('f-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // ── Reservation form ─────────────────────────────────────────
  const form    = document.getElementById('res-form');
  const formBtn = document.getElementById('form-btn');

  if (form && formBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Collect data (extend with Formspree / fetch as needed)
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Reservation request:', data);

      // Show success state
      formBtn.disabled = true;
      formBtn.classList.add('sent');

      // Optionally reset after a delay
      setTimeout(() => {
        form.reset();
        formBtn.disabled = false;
        formBtn.classList.remove('sent');
      }, 5000);
    });
  }

  // ── Active nav link on scroll ────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksList.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => sectionObs.observe(sec));

  // ── Video autoplay fallback (iOS Safari) ─────────────────────
  // iOS requires video.muted = true as a DOM property (not just the HTML
  // attribute) and may block autoplay until play() is called explicitly.
  document.querySelectorAll('video').forEach(video => {
    video.muted = true; // DOM property — required by iOS Safari
    video.play().catch(() => {
      // If autoplay is still blocked (e.g. low-power mode), retry on first
      // user interaction so the video starts as soon as the user touches the page.
      const resume = () => {
        video.play().catch(() => {});
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('click', resume);
      };
      document.addEventListener('touchstart', resume, { once: true, passive: true });
      document.addEventListener('click', resume, { once: true });
    });
  });

})();
