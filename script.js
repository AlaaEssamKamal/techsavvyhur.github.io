/**
 * TechSavvy Website - Enhanced JavaScript
 * Optimized for performance, accessibility, and user experience
 */

(function() {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  // Debounce function for performance optimization
  const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Throttle function for scroll events
  const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initMobileMenu();
    initCurrentYear();
    initSmoothScroll();
    initLazyLoading();
  });

  // ============================================
  // NAVIGATION ENHANCEMENTS
  // ============================================
  function initNavigation() {
    const navbar = $('.navbar');
    if (!navbar) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  function initMobileMenu() {
    const menuToggle = $('.mobile-menu-toggle');
    const navLinks = $('.nav-links');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    $$('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = $(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          if (history.pushState) {
            history.pushState(null, null, href);
          }

          // Focus management for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.addEventListener('blur', function() {
            target.removeAttribute('tabindex');
          }, { once: true });
        }
      });
    });
  }

  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  function initScrollAnimations() {
    const sections = $$('.section');
    const cards = $$('.service-card, .project-card, .stat-card');
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animate sections
    if (sections.length > 0) {
      const sectionObserverOptions = {
        threshold: prefersReducedMotion ? 0 : 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            sectionObserver.unobserve(entry.target);
          }
        });
      }, sectionObserverOptions);

      sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
      });
    }

    // Animate cards with stagger effect
    if (cards.length > 0) {
      const cardObserverOptions = {
        threshold: prefersReducedMotion ? 0 : 0.15,
        rootMargin: '0px 0px -50px 0px'
      };

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
          }
        });
      }, cardObserverOptions);

      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        cardObserver.observe(card);
      });
    }
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  function initBackToTop() {
    const backToTopBtn = $('#backToTop');
    if (!backToTopBtn) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Focus management for accessibility
      $('.navbar a').focus();
    });

    // Keyboard navigation
    backToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        backToTopBtn.click();
      }
    });
  }

  // ============================================
  // CONTACT FORM ENHANCEMENT
  // ============================================
  function initContactForm() {
    const form = $('#contact-form');
    const successMessage = $('#success-message');
    const errorMessage = $('#error-message');
    const submitBtn = form?.querySelector('.btn-submit');

    if (!form || !successMessage) return;

    // Real-time validation
    const inputs = $$('input, textarea', form);
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields
      let isValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        showError('Please complete all fields correctly');
        return;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Hide previous messages
      hideMessages();

      try {
        const formData = new FormData(form);
        
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          form.reset();
          showSuccess();
          // Announce success to screen readers
          successMessage.setAttribute('aria-live', 'assertive');
        } else {
          const errorData = await response.json();
          const errorText = errorData.error || 'An error occurred while sending the message. Please try again.';
          showError(errorText);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showError('A connection error occurred. Please check your internet connection and try again.');
      } finally {
        // Remove loading state
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    });

    function validateField(field) {
      const value = field.value.trim();
      const isValid = field.validity.valid;

      // Remove previous error styling
      field.classList.remove('error');

      if (!isValid && value !== '') {
        field.classList.add('error');
        return false;
      }

      return isValid;
    }

    function showSuccess() {
      successMessage.classList.add('show');
      errorMessage.classList.remove('show');
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);
    }

    function showError(message) {
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
        errorMessage.setAttribute('aria-live', 'assertive');
        setTimeout(() => {
          errorMessage.classList.remove('show');
        }, 7000);
      }
    }

    function hideMessages() {
      successMessage.classList.remove('show');
      if (errorMessage) {
        errorMessage.classList.remove('show');
      }
    }
  }

  // ============================================
  // CURRENT YEAR (Footer)
  // ============================================
  function initCurrentYear() {
    const yearElement = $('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // LAZY LOADING (for images)
  // ============================================
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = $$('img[loading="lazy"]');
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    } else {
      // Fallback: Intersection Observer for browsers without native support
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }
  }

  // ============================================
  // KEYBOARD NAVIGATION ENHANCEMENTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Ctrl+Home (or Cmd+Home on Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
      e.preventDefault();
      const mainContent = $('#main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // ============================================
  // PERFORMANCE MONITORING (Development only)
  // ============================================
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
      if ('performance' in window && 'PerformanceObserver' in window) {
        try {
          const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart, 'ms');
              }
            }
          });
          perfObserver.observe({ entryTypes: ['navigation'] });
        } catch (e) {
          // Performance Observer not supported or error
        }
      }
    });
  }

})();
