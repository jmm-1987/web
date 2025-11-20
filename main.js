document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.main-nav ul');
  const animateItems = document.querySelectorAll('[data-animate]');
  const sections = document.querySelectorAll('.section');
  const form = document.querySelector('#cv-form');
  const confirmation = document.querySelector('.form__confirmation');
  const currentYear = document.querySelector('#current-year');
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('#cookie-accept');
  const COOKIE_STORAGE_KEY = 'alditraexCookiesAccepted';

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const showCookieBanner = () => {
    if (cookieBanner) {
      requestAnimationFrame(() => cookieBanner.classList.add('is-visible'));
    }
  };

  const hideCookieBanner = () => {
    cookieBanner?.classList.remove('is-visible');
  };

  if (!localStorage.getItem(COOKIE_STORAGE_KEY)) {
    showCookieBanner();
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_STORAGE_KEY, 'true');
    hideCookieBanner();
  });

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-active');
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const delay = target.getAttribute('data-delay') || 0;
          target.classList.add('is-visible');
          if (target.classList.contains('section')) {
            target.classList.add('in-view');
          }
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  animateItems.forEach((item) => {
    const delay = item.getAttribute('data-delay') || 0;
    item.style.transitionDelay = `${delay}ms`;
    observer.observe(item);
  });

  sections.forEach((section, idx) => {
    section.setAttribute('data-delay', idx * 60);
    observer.observe(section);
  });

  const sliderTrack = document.querySelector('.slider__slides');
  const prevBtn = document.querySelector('.slider__control--prev');
  const nextBtn = document.querySelector('.slider__control--next');

  if (sliderTrack) {
    const originalSlides = Array.from(sliderTrack.children);

    // Clonar slides para efecto infinito
    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add('slide--clone');
      sliderTrack.appendChild(clone);
    });

    let slideWidth = 0;
    let gap = 0;
    let totalDistance = 0;

    const recalcMetrics = () => {
      // Usar el primer slide original (antes de clonar) para calcular
      const firstOriginalSlide = originalSlides[0];
      if (firstOriginalSlide) {
        slideWidth = firstOriginalSlide.offsetWidth || 0;
        gap = parseInt(window.getComputedStyle(sliderTrack).gap, 10) || 0;
        totalDistance = (slideWidth + gap) * originalSlides.length;
        
        // Actualizar la animación con la distancia calculada
        if (totalDistance > 0) {
          sliderTrack.style.setProperty('--slide-distance', `-${totalDistance}px`);
        }
      }
    };

    // Inicializar animación después de calcular métricas
    const initAnimation = () => {
      recalcMetrics();
      // Esperar un frame para asegurar que las métricas estén calculadas
      requestAnimationFrame(() => {
        sliderTrack.style.animation = 'sliderScroll 60s linear infinite';
      });
    };

    // Pausar animación al pasar el mouse
    sliderTrack.addEventListener('mouseenter', () => {
      sliderTrack.style.animationPlayState = 'paused';
    });
    sliderTrack.addEventListener('mouseleave', () => {
      sliderTrack.style.animationPlayState = 'running';
    });

    // Los botones pueden seguir funcionando pero no son necesarios para la animación continua
    nextBtn?.addEventListener('click', () => {
      // Opcional: avanzar manualmente si se desea
    });

    prevBtn?.addEventListener('click', () => {
      // Opcional: retroceder manualmente si se desea
    });

    // Inicializar
    initAnimation();
    
    // Recalcular en resize
    window.addEventListener('resize', () => {
      recalcMetrics();
    });
  }

  if (form && confirmation) {
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton?.textContent || 'Enviar';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      confirmation.textContent = 'Enviando tu candidatura...';
      confirmation.style.color = '';
      submitButton?.setAttribute('disabled', 'true');
      if (submitButton) {
        submitButton.textContent = 'Enviando...';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();

        if (data.success) {
          confirmation.textContent = '✓ ' + (data.message || '¡Gracias! Hemos recibido tu candidatura.');
          confirmation.style.color = 'green';
          form.reset();
        } else {
          confirmation.textContent = '✗ ' + (data.message || 'No hemos podido enviar tu candidatura. Intenta nuevamente.');
          confirmation.style.color = 'red';
        }
      } catch (error) {
        console.error('Error al enviar el formulario', error);
        confirmation.textContent = '✗ Ha ocurrido un error inesperado. Vuelve a intentarlo en unos minutos.';
        confirmation.style.color = 'red';
      } finally {
        submitButton?.removeAttribute('disabled');
        if (submitButton) {
          submitButton.textContent = defaultButtonText;
        }
        setTimeout(() => {
          confirmation.textContent = '';
          confirmation.style.color = '';
        }, 6000);
      }
    });
  }
});

