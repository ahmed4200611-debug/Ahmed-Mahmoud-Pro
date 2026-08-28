/**
 * AHMED MAHMOUD - DATA ANALYST PORTFOLIO
 * Vanilla JavaScript (ES6+)
 * 
 * Features:
 * 1. Dark / Light Theme Toggle & Persistence
 * 2. Mobile Hamburger Navigation & Backdrop
 * 3. IntersectionObserver Scroll Reveal Animations
 * 4. Active Navigation Section Spy
 * 5. Dynamic Fixed Header on Scroll
 * 6. Contact Form Validation & UI Feedback
 * 7. Dynamic Footer Year
 * 8. Smooth Anchor Scrolling with Header Offset
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Initialize theme: Check localStorage, then system preference, default to dark
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    // If system explicitly prefers light, we can start in light or stick to dark default
    // Default requested is Dark mode
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', targetTheme);
      localStorage.setItem('portfolio-theme', targetTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION & BACKDROP OVERLAY
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    mobileToggleBtn.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    mobileToggleBtn.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          closeMobileMenu();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. HEADER STYLE CHANGE ON SCROLL
  // -------------------------------------------------------------------------
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // -------------------------------------------------------------------------
  // 4. ACTIVE SECTION TRACKER ON SCROLL
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const handleActiveSection = () => {
    const scrollPosition = window.scrollY + 180; // Offset for header & trigger threshold

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleActiveSection, { passive: true });

  // -------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // -------------------------------------------------------------------------
  // 6. CONTACT FORM HANDLING & VALIDATION
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (input, isValid) => {
      const parent = input.closest('.form-group');
      if (parent) {
        if (isValid) {
          parent.classList.remove('has-error');
        } else {
          parent.classList.add('has-error');
        }
      }
      return isValid;
    };

    // Live validation on blur
    if (nameInput) {
      nameInput.addEventListener('blur', () => validateField(nameInput, nameInput.value.trim().length > 0));
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length > 0) validateField(nameInput, true);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => validateField(emailInput, emailRegex.test(emailInput.value.trim())));
      emailInput.addEventListener('input', () => {
        if (emailRegex.test(emailInput.value.trim())) validateField(emailInput, true);
      });
    }

    if (subjectInput) {
      subjectInput.addEventListener('blur', () => validateField(subjectInput, subjectInput.value.trim().length > 0));
      subjectInput.addEventListener('input', () => {
        if (subjectInput.value.trim().length > 0) validateField(subjectInput, true);
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => validateField(messageInput, messageInput.value.trim().length > 0));
      messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length > 0) validateField(messageInput, true);
      });
    }

    // Submit handler
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length > 0);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length > 0);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Successful mock submit
        if (formMessage) {
          formMessage.className = 'form-message success';
          formMessage.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thanks! The form is ready to be connected to a backend or email service.';
          formMessage.style.display = 'block';
        }

        // Disable submit button temporarily to demonstrate feedback state
        if (submitBtn) {
          const originalContent = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
          
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
          }, 3000);
        }

        // Reset form inputs
        contactForm.reset();

        // Clear error classes
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

        // Hide success message after 8 seconds
        setTimeout(() => {
          if (formMessage) {
            formMessage.style.display = 'none';
          }
        }, 8000);
      } else {
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields with valid information.';
          formMessage.style.display = 'block';
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. DYNAMIC FOOTER YEAR
  // -------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 8. BACK TO TOP BUTTON SMOOTH SCROLL
  // -------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
