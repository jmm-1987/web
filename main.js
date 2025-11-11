document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.main-nav ul');
  const animateItems = document.querySelectorAll('[data-animate]');
  const sections = document.querySelectorAll('.section');
  const form = document.querySelector('#cv-form');
  const confirmation = document.querySelector('.form__confirmation');
  const currentYear = document.querySelector('#current-year');

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

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

    originalSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add('slide--clone');
      sliderTrack.appendChild(clone);
    });

    originalSlides
      .slice()
      .reverse()
      .forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add('slide--clone');
        sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      });

    const totalSlides = originalSlides.length;
    let index = totalSlides;
    let slideWidth = 0;
    let gap = 0;

    const recalcMetrics = () => {
      const sampleSlide = sliderTrack.querySelector('.slide');
      slideWidth = sampleSlide?.offsetWidth || 0;
      gap = parseInt(window.getComputedStyle(sliderTrack).gap, 10) || 0;
    };

    const setTransition = (enable) => {
      sliderTrack.style.transition = enable ? 'transform 0.6s ease' : 'none';
    };

    const updateSlider = () => {
      const offset = (slideWidth + gap) * index;
      sliderTrack.style.transform = `translateX(-${offset}px)`;
    };

    const jumpToIndex = (targetIndex) => {
      setTransition(false);
      index = targetIndex;
      updateSlider();
      requestAnimationFrame(() => setTransition(true));
    };

    const handleLoopEdges = () => {
      if (index >= totalSlides * 2) {
        jumpToIndex(totalSlides);
      } else if (index < totalSlides) {
        jumpToIndex(totalSlides * 2 - 1);
      }
    };

    const nextSlide = () => {
      setTransition(true);
      index += 1;
      updateSlider();
    };

    const prevSlide = () => {
      setTransition(true);
      index -= 1;
      updateSlider();
    };

    let autoSlide = setInterval(nextSlide, 3500);

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      restartAutoSlide();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      restartAutoSlide();
    });

    sliderTrack.addEventListener('transitionend', handleLoopEdges);

    const restartAutoSlide = () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 3500);
    };

    sliderTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderTrack.addEventListener('mouseleave', () => {
      autoSlide = setInterval(nextSlide, 3500);
    });

    recalcMetrics();
    setTransition(false);
    updateSlider();
    requestAnimationFrame(() => setTransition(true));
    window.addEventListener('resize', () => {
      recalcMetrics();
      updateSlider();
    });
  }

  if (form && confirmation) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      confirmation.textContent = '¡Gracias! Hemos recibido tu candidatura.';
      form.reset();

      setTimeout(() => {
        confirmation.textContent = '';
      }, 4000);
    });
  }
});

