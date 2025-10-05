// Main interactions for Creative Portfolio
(function () {
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  // Year in footer
  $('#year').textContent = new Date().getFullYear();

  // Theme toggle with localStorage
  const themeBtn = $('#themeToggle');
  function setTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  themeBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });

  // Mobile menu toggle
  const mobileBtn = $('#mobileMenuBtn');
  const mobileMenu = $('#mobileMenu');
  mobileBtn?.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    mobileBtn.setAttribute('aria-expanded', String(isHidden));
  });

  // Smooth scroll and close mobile menu when navigating
  const links = $$('.nav-link, .mobile-link, a[href^="#"]');
  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = $(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Close mobile menu
      if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    });
  });

  // Active link highlighting on scroll
  const sections = ['#home', '#about', '#projects', '#services', '#testimonials', '#contact']
    .map((id) => ({ id, el: $(id) }))
    .filter((s) => s.el);
  const navLinks = new Map(
    $$('.nav-link').map((l) => [l.getAttribute('href'), l])
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const href = `#${entry.target.id}`;
        const link = navLinks.get(href);
        if (!link) return;
        if (entry.isIntersecting) {
          $$('.nav-link').forEach((l) => l.classList.remove('text-indigo-600'));
          link.classList.add('text-indigo-600');
        }
      });
    },
    { rootMargin: '-50% 0px -40% 0px', threshold: [0, 0.25, 0.5, 1] }
  );
  sections.forEach((s) => observer.observe(s.el));

  // Reveal on scroll (micro-interactions)
  const revealEls = $$('section [data-reveal], .group');
  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-safe:animate-[fadeIn_0.6s_ease-out_1]');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  // Projects: modal details
  const modal = $('#projectModal');
  const modalTitle = $('#modalTitle');
  const modalDesc = $('#modalDesc');
  const modalImage = $('#modalImage');
  const modalPrimary = $('#modalPrimary');

  function openModal({ title, desc, img, link }) {
    modalTitle.textContent = title || 'Project';
    modalDesc.textContent = desc || '';
    if (img) modalImage.src = img;
    modalPrimary.href = link || '#';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  $$('.btn-project').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        title: btn.dataset.title,
        desc: btn.dataset.desc,
        img: btn.dataset.img,
        link: btn.dataset.link || '#'
      });
    });
  });
  $$('[data-modal-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Testimonials carousel
  const carousel = $('#carousel');
  const track = $('.carousel-track', carousel);
  const items = $$('.carousel-item', track);
  const prevBtn = $('#prevTestimonial');
  const nextBtn = $('#nextTestimonial');
  const dotsWrap = $('#carouselDots');

  let index = 0;
  let autoTimer;

  function updateCarousel(newIndex) {
    index = (newIndex + items.length) % items.length;
    const offset = -index * carousel.clientWidth;
    track.style.transform = `translateX(${offset}px)`;
    // Update dots
    $$('.dot', dotsWrap).forEach((d, i) => {
      d.classList.toggle('bg-indigo-600', i === index);
      d.classList.toggle('bg-slate-300', i !== index);
    });
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    items.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot w-2.5 h-2.5 rounded-full bg-slate-300';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => {
        stopAuto();
        updateCarousel(i);
        startAuto();
      });
      dotsWrap.appendChild(b);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => updateCarousel(index + 1), 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function onResize() {
    updateCarousel(index);
  }

  if (carousel && track && items.length) {
    buildDots();
    updateCarousel(0);
    startAuto();

    nextBtn?.addEventListener('click', () => {
      stopAuto();
      updateCarousel(index + 1);
      startAuto();
    });
    prevBtn?.addEventListener('click', () => {
      stopAuto();
      updateCarousel(index - 1);
      startAuto();
    });

    window.addEventListener('resize', onResize);
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
  }

  // Contact form validation
  const form = $('#contactForm');
  const feedback = $('#formFeedback');
  function setFeedback(msg, ok) {
    feedback.textContent = msg;
    feedback.className = 'text-sm ' + (ok ? 'text-emerald-600' : 'text-rose-600');
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || name.length < 2) {
      setFeedback('Please enter your full name.', false);
      return;
    }
    if (!email || !validEmail(email)) {
      setFeedback('Please enter a valid email address.', false);
      return;
    }
    if (!message || message.length < 10) {
      setFeedback('Please include at least 10 characters in your message.', false);
      return;
    }

    // Simulate async submission
    setFeedback('Sending…', true);
    setTimeout(() => {
      setFeedback('Thanks! Your message has been sent. I will get back to you soon.', true);
      form.reset();
    }, 800);
  });

  // Lazy loading enhancements for non-supporting browsers
  if ('loading' in HTMLImageElement.prototype === false) {
    $$('img[loading="lazy"]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        const i = new Image();
        i.src = src;
      }
    });
  }
})();
