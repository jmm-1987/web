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

    // Manejar el menú desplegable de Contacto
    const dropdownItem = navMenu.querySelector('.nav-item--dropdown');
    const dropdownLink = navMenu.querySelector('.nav-link--dropdown');
    const submenu = navMenu.querySelector('.nav-submenu');
    
    if (dropdownItem && dropdownLink && submenu) {
      let hoverTimeout;
      
      // Prevenir el comportamiento por defecto del enlace
      dropdownLink.addEventListener('click', (e) => {
        e.preventDefault();
        // En móvil, toggle del submenú
        if (window.innerWidth <= 820) {
          dropdownItem.classList.toggle('is-open');
        }
      });

      // Función para abrir el submenú
      const openSubmenu = () => {
        clearTimeout(hoverTimeout);
        dropdownItem.classList.add('is-open');
      };

      // Función para cerrar el submenú con delay
      const closeSubmenu = () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          dropdownItem.classList.remove('is-open');
        }, 250); // Delay para permitir movimiento del cursor
      };

      // En desktop, manejar hover
      if (window.innerWidth > 820) {
        // Abrir cuando el cursor entra en el dropdown o submenu
        dropdownItem.addEventListener('mouseenter', openSubmenu);
        submenu.addEventListener('mouseenter', openSubmenu);
        
        // Cerrar cuando el cursor sale del dropdown o submenu
        dropdownItem.addEventListener('mouseleave', closeSubmenu);
        submenu.addEventListener('mouseleave', closeSubmenu);
      }

      // Cerrar el submenú cuando se hace click en un enlace del submenú
      const submenuLinks = dropdownItem.querySelectorAll('.nav-submenu a');
      submenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
          dropdownItem.classList.remove('is-open');
          navMenu.classList.remove('is-open');
          navToggle.classList.remove('is-active');
        });
      });
    }

    navMenu.querySelectorAll('a:not(.nav-link--dropdown)').forEach((link) => {
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

  const sliderTracks = document.querySelectorAll('.slider__slides');

  sliderTracks.forEach((sliderTrack) => {
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
        // Si es el slider de Navalmoral, usar animación inversa
        if (sliderTrack.classList.contains('slider__slides--navalmoral')) {
          sliderTrack.style.animation = 'sliderScroll 40s linear infinite reverse';
        } else {
          sliderTrack.style.animation = 'sliderScroll 40s linear infinite';
        }
      });
    };

    // Pausar animación al pasar el mouse
    sliderTrack.addEventListener('mouseenter', () => {
      sliderTrack.style.animationPlayState = 'paused';
    });
    sliderTrack.addEventListener('mouseleave', () => {
      sliderTrack.style.animationPlayState = 'running';
    });

    // Inicializar
    initAnimation();
    
    // Recalcular en resize
    window.addEventListener('resize', () => {
      recalcMetrics();
    });
  });

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
        
        // Verificar si la respuesta es JSON
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Si no es JSON, intentar leer como texto
          const text = await response.text();
          console.error('Respuesta no JSON:', text);
          throw new Error('El servidor no respondió con JSON válido');
        }

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
        
        // Mensajes más específicos según el tipo de error
        let errorMessage = 'Ha ocurrido un error inesperado. Vuelve a intentarlo en unos minutos.';
        
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión: El servidor no permite solicitudes desde este origen. Contacta con el administrador.';
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
          errorMessage = 'Error: El endpoint no fue encontrado. Verifica la configuración del servidor.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Error: El servidor respondió con un formato inesperado.';
        }
        
        confirmation.textContent = '✗ ' + errorMessage;
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

