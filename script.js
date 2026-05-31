(function () {
  'use strict';

  const LANGS = ['ar', 'fr', 'en'];
  let currentLang = 'ar';

  const html = document.documentElement;
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const langSwitcher = document.getElementById('langSwitcher');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contactForm');

  const titles = {
    ar: "مكتب المحاماة | Cabinet d'Avocat",
    fr: "Cabinet d'Avocat | Law Firm",
    en: "Law Firm | Cabinet d'Avocat"
  };

  const metaDescriptions = {
    ar: 'مكتب محاماة متخصص | Cabinet d\'avocat professionnel',
    fr: 'Cabinet d\'avocat professionnel | Law firm',
    en: 'Professional law firm | Cabinet d\'avocat'
  };

  const whatsappTemplates = {
    ar: 'مرحباً، أود طلب استشارة قانونية:\n\nالاسم: ',
    fr: 'Bonjour, je souhaite demander une consultation juridique:\n\nNom: ',
    en: 'Hello, I would like to request a legal consultation:\n\nName: '
  };

  const whatsappFields = {
    ar: { email: '\nالبريد: ', phone: '\nالهاتف: ', service: '\nالخدمة: ', message: '\n\nالرسالة:\n' },
    fr: { email: '\nEmail: ', phone: '\nTéléphone: ', service: '\nService: ', message: '\n\nMessage:\n' },
    en: { email: '\nEmail: ', phone: '\nPhone: ', service: '\nService: ', message: '\n\nMessage:\n' }
  };

  function setLanguage(lang) {
    if (!LANGS.includes(lang)) return;

    currentLang = lang;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = titles[lang];

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', metaDescriptions[lang]);

    document.querySelectorAll('[data-ar][data-fr][data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    document.querySelectorAll('select option[data-ar][data-fr][data-en]').forEach(function (opt) {
      opt.textContent = opt.getAttribute('data-' + lang);
    });

    if (langSwitcher) {
      langSwitcher.querySelectorAll('.lang-switcher__btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    }
  }

  if (langSwitcher) {
    langSwitcher.querySelectorAll('.lang-switcher__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ----- Scroll: header + floating contact ----- */
  const floatingContact = document.getElementById('floatingContact');
  const heroSection = document.getElementById('home');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);

    if (floatingContact && heroSection) {
      const isMobile = window.innerWidth <= 768;
      const showAfter = isMobile ? 60 : heroSection.offsetHeight * 0.4;
      floatingContact.classList.toggle('visible', window.scrollY > showAfter);
    }
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();

  if (floatingContact) {
    floatingContact.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  }

  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service');
      const serviceText = service.options[service.selectedIndex].textContent;
      const message = document.getElementById('message').value;
      const f = whatsappFields[currentLang];

      const whatsappMessage =
        whatsappTemplates[currentLang] + name +
        f.email + email +
        f.phone + phone +
        f.service + serviceText +
        f.message + message;

      window.open('https://wa.me/212600000000?text=' + encodeURIComponent(whatsappMessage), '_blank');
      contactForm.reset();
    });
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.service-card__body, .about__content, .trust-pillar, .trust-card, .trust-seal, .trust__cta, .contact__info, .contact__form, .contact__map-wrap').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* ----- Trust counter animation ----- */
  function animateCounter(el, target, isDecimal) {
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      if (el.dataset.animated) return;

      el.dataset.animated = 'true';
      const target = parseFloat(el.getAttribute('data-count'));
      animateCounter(el, target, el.hasAttribute('data-decimal'));
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.trust__metric-value[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  setLanguage('ar');
})();
