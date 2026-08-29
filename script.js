// ============================================================
// ADS NETWORKING SERVICE — MAIN.JS
// Modern interactivity: smooth scroll, mobile menu,
// form validation with feedback, custom cursor,
// active nav links, scroll reveal
// ============================================================

(function () {
  'use strict';

  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $$$ = (sel) => document.getElementsByClassName(sel);

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setCurrentYear();
    initCustomCursor();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavLink();
    initScrollReveal();
    initContactForm();
    initFormValidation();
    initNavbarScrollEffect();
    initChatbot();
    initHeroSlider();
  }

  // ---------- Footer Year ----------
  function setCurrentYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Custom Cursor ----------
  function initCustomCursor() {
    const cursor = $('.custom-cursor__cursor');
    const cursorTwo = $('.custom-cursor__cursor-two');

    if (!cursor || !cursorTwo) return;

    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorTwo.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const interactiveEls = $$('a, button, .btn, input, textarea, select, .service-card');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorTwo.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorTwo.classList.remove('hover');
      });
    });
  }

  // ---------- Mobile Menu ----------
  function initMobileMenu() {
    const burger = $('.menu-toggle');
    const navLinks = $('.nav-links');

    if (!burger || !navLinks) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    $$('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // ---------- Smooth Scroll ----------
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerHeight = document.querySelector('nav')?.offsetHeight || 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      });
    });
  }

  // ---------- Active Nav Link ----------
  function initActiveNavLink() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const setActive = () => {
      const scrollPos = window.scrollY + 100;
      let currentId = '';
      sections.forEach((sec) => {
        if (sec.offsetTop <= scrollPos) currentId = sec.id;
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const isActive = href && href === `#${currentId}`;
        link.classList.toggle('active', isActive);
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  // ---------- Scroll Reveal ----------
  function initScrollReveal() {
    const reveals = $$('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ---------- Navbar Scroll Effect ----------
  function initNavbarScrollEffect() {
    const navbar = $('nav');
    if (!navbar) return;

    const updateNavbar = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // ---------- Contact Form (both pages) ----------
  function initContactForm() {
    const forms = $$('form[action^="https://formspree.io/f/"]');
    if (!forms.length) return;

    forms.forEach((form) => {
      let formSuccess = form.querySelector('.form-success');
      let formError = form.querySelector('[data-form-error]');

      // Create error element if missing
      if (!formError) {
        formError = document.createElement('div');
        formError.className = 'form-error';
        formError.id = 'formError';
        formError.style.display = 'none';
        formError.style.marginTop = '1rem';
        formError.style.padding = '0.75rem';
        formError.style.borderRadius = '6px';
        formError.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        formError.style.color = '#ef4444';
        formError.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        formError.style.fontSize = '0.9rem';
        formError.setAttribute('data-form-error', 'true');
        form.insertAdjacentElement('afterend', formError);
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset UI
        if (formSuccess) formSuccess.style.display = 'none';
        formError.style.display = 'none';
        formError.textContent = '';

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        try {
          const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            form.reset();
            if (formSuccess) {
              formSuccess.style.display = 'block';
              formSuccess.textContent = 'Thank you! Your message has been sent.';
              setTimeout(() => (formSuccess.style.display = 'none'), 5000);
            }
          } else {
            const result = await response.json().catch(() => ({}));
            const msg = result.errors
              ? result.errors.map((err) => err.message).join(', ')
              : 'Oops! Something went wrong. Please try again or email us directly.';
            formError.textContent = msg;
            formError.style.display = 'block';
          }
        } catch (err) {
          formError.textContent =
            'Network error. Please check your connection and try again.';
          formError.style.display = 'block';
          console.error('Form submission error:', err);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    });
  }

  // ---------- Form Validation ----------
  function initFormValidation() {
    const form = $('#consultForm');
    if (!form) return;

    const setError = (field, message) => {
      const parent = field.parentElement;
      let errorEl = parent.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        parent.appendChild(errorEl);
      }
      errorEl.textContent = message;
      errorEl.style.display = message ? 'block' : 'none';
      if (message) field.classList.add('has-error');
      else field.classList.remove('has-error');
    };

    const clearError = (field) => {
      const parent = field.parentElement;
      const errorEl = parent.querySelector('.form-error');
      if (errorEl) errorEl.remove();
      field.classList.remove('has-error');
    };

    const validateField = (field) => {
      const name = field.name || field.id;
      const value = field.value.trim();

      clearError(field);

      if (field.required && !value) {
        setError(field, `${field.placeholder || name} is required`);
        return false;
      }

      if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError(field, 'Please enter a valid email address');
          return false;
        }
      }

      if (value && field.minLength && value.length < field.minLength) {
        setError(field, `Must be at least ${field.minLength} characters`);
        return false;
      }

      return true;
    };

    // Validate on blur
    const inputs = $$('input, select, textarea', form);
    inputs.forEach((field) => {
      if (field.name || field.id) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('has-error')) validateField(field);
        });
      }
    });
  }

  // ===========================================================
  // CHATBOT WIDGET
  // ===========================================================
  function initChatbot() {
    const widget = $('#chatbotWidget');
    const toggle = $('#chatbotToggle');
    const window = $('#chatbotWindow');
    const minimize = $('#chatbotMinimize');
    const messages = $('#chatbotMessages');
    const form = $('#chatbotForm');
    const input = $('#chatbotInput');

    if (!widget || !toggle || !window) return;

    // Bot responses for quick replies and messages
    const botResponses = {
      services: {
        text: `<strong>Our Enterprise Services include:</strong><br>
          <br>📡 <strong>Enterprise Routing</strong> - High-performance routing architectures<br>
          🔀 <strong>Intelligent Switching</strong> - Advanced LAN solutions<br>
          🛡️ <strong>Firewall Defense</strong> - Multi-layered security<br>
          🔒 <strong>VPN Setup</strong> - Secure remote access<br>
          📋 <strong>AMC Programs</strong> - Annual maintenance contracts<br>
          💡 <strong>Network Consulting</strong> - Expert advisory<br>
          📹 <strong>CCTV & Surveillance</strong> - Video security systems<br>
          <br>Would you like to schedule a consultation?`,
        quickReplies: [
          { text: 'Free Consultation', reply: 'consultation' },
          { text: 'Contact Us', reply: 'contact' }
        ]
      },
      pricing: {
        text: `Our pricing is tailored to your specific requirements. Factors include:<br>
          <br>• Network size and complexity<br>
          • Number of locations<br>
          • Services required<br>
          • Equipment specifications<br>
          <br>The best way to get accurate pricing is a <strong>free consultation</strong> where we assess your needs.`,
        quickReplies: [
          { text: 'Book Free Consultation', reply: 'consultation' },
          { text: 'Other Questions', reply: 'contact' }
        ]
      },
      consultation: {
        text: `Great choice! 🎉<br><br>Our free consultation includes:<br>
          <br>✅ Network assessment<br>
          ✅ Requirements analysis<br>
          ✅ Preliminary recommendations<br>
          ✅ No obligation quote<br>
          <br>Would you like to schedule now?`,
        quickReplies: [
          { text: 'Yes, Schedule Now', reply: 'schedule' },
          { text: 'Learn More', reply: 'services' }
        ]
      },
      support: {
        text: `For technical support, we offer:<br>
          <br>📞 <strong>24/7 Helpdesk</strong><br>
          🔧 <strong>Remote Diagnostics</strong><br>
          🚀 <strong>Emergency Response</strong><br>
          <br>Current clients can reach us at:<br>
          📧 security@adsnetworkingservice.co.in<br>
          📞 +91 96668 19812`,
        quickReplies: [
          { text: 'Become a Client', reply: 'contact' },
          { text: 'View Services', reply: 'services' }
        ]
      },
      contact: {
        text: `<strong>Contact Information:</strong><br>
          <br>📧 <strong>Email:</strong> security@adsnetworkingservice.co.in<br>
          📞 <strong>Phone:</strong> +91 96668 19812<br>
          🕒 <strong>Hours:</strong> 24/7 Enterprise Support<br>
          🏢 <strong>Address:</strong> Enterprise Solutions Center, India<br>
          <br>You can also use our <strong>consultation form</strong> for a detailed inquiry.`,
        quickReplies: [
          { text: 'Fill Consultation Form', reply: 'schedule' },
          { text: 'View Services', reply: 'services' }
        ]
      },
      schedule: {
        text: `Perfect! Click below to schedule your free consultation:<br>
          <br><a href="consultation.html" class="btn btn-primary" style="display:inline-block;padding:8px 16px;border-radius:8px;text-decoration:none;margin-top:8px;">📅 Schedule Consultation</a>`,
        quickReplies: [
          { text: 'View Services First', reply: 'services' },
          { text: 'Contact Info', reply: 'contact' }
        ]
      },
      default: {
        text: `Thanks for your message! Our team will get back to you shortly. For immediate assistance, call us at <strong>+91 96668 19812</strong> or email <strong>security@adsnetworkingservice.co.in</strong>.`,
        quickReplies: []
      }
    };

    // Toggle chatbot
    toggle.addEventListener('click', () => {
      widget.classList.toggle('open');
      toggle.classList.toggle('open');
      if (widget.classList.contains('open')) {
        input.focus();
      }
    });

    // Minimize chatbot
    if (minimize) {
      minimize.addEventListener('click', () => {
        widget.classList.remove('open');
        toggle.classList.remove('open');
      });
    }

    // Add message to chat
    function addMessage(text, type) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${type}`;
      msgDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <span class="message-time">${time}</span>
      `;
      messages.appendChild(msgDiv);
      messages.scrollTop = messages.scrollHeight;
      return msgDiv;
    }

    // Add quick replies
    function addQuickReplies(replies) {
      const quickRepliesDiv = $('#quickReplies');
      if (!quickRepliesDiv) return;
      quickRepliesDiv.innerHTML = '';
      if (!replies || replies.length === 0) {
        quickRepliesDiv.style.display = 'none';
        return;
      }
      quickRepliesDiv.style.display = 'flex';
      replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
        btn.textContent = reply.text;
        btn.addEventListener('click', () => {
          // Hide quick replies
          quickRepliesDiv.style.display = 'none';
          // Add user message
          addMessage(reply.text, 'user');
          // Simulate bot typing
          setTimeout(() => {
            const response = botResponses[reply.reply] || botResponses.default;
            const msg = addMessage(response.text, 'bot');
            addQuickReplies(response.quickReplies);
          }, 800);
        });
        quickRepliesDiv.appendChild(btn);
      });
    }

    // Handle quick replies on initial load
    const initialQuickReplies = [
      { text: 'Our Services', reply: 'services' },
      { text: 'Pricing', reply: 'pricing' },
      { text: 'Free Consultation', reply: 'consultation' },
      { text: 'Technical Support', reply: 'support' },
      { text: 'Contact Info', reply: 'contact' }
    ];
    addQuickReplies(initialQuickReplies);

    // Handle form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        input.value = '';

        // Simple keyword matching
        setTimeout(() => {
          const lowerMsg = message.toLowerCase();
          let response = botResponses.default;

          if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('quote')) {
            response = botResponses.pricing;
          } else if (lowerMsg.includes('service') || lowerMsg.includes('offer') || lowerMsg.includes('what do')) {
            response = botResponses.services;
          } else if (lowerMsg.includes('consult') || lowerMsg.includes('schedule') || lowerMsg.includes('book')) {
            response = botResponses.consultation;
          } else if (lowerMsg.includes('support') || lowerMsg.includes('help') || lowerMsg.includes('issue')) {
            response = botResponses.support;
          } else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
            response = botResponses.contact;
          } else if (lowerMsg.includes('thank')) {
            response = { text: "You're welcome! 😊 Is there anything else I can help you with?", quickReplies: initialQuickReplies };
          }

          addMessage(response.text, 'bot');
          addQuickReplies(response.quickReplies);
        }, 800);
      });
    }
  }

  // ===========================================================
  // HERO BACKGROUND SLIDER
  // ===========================================================
  function initHeroSlider() {
    const bgContainer = $('.hero-bg-images');
    const prevBtn = $('#heroPrev');
    const nextBtn = $('#heroNext');
    const indicators = $('#heroIndicators');

    if (!bgContainer || !prevBtn || !nextBtn) return;

    const slides = $$('img', bgContainer);
    let currentSlide = 0;
    let autoSlideInterval;

    // If only one image, hide arrows and indicators
    if (slides.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      if (indicators) indicators.style.display = 'none';
      return;
    }

    // Create indicators for each slide
    if (indicators) {
      indicators.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'indicator' + (index === 0 ? ' active' : '');
        dot.dataset.slide = index;
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
      });
    }

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      const dots = $$('.indicator', indicators);
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = index;
      if (currentSlide >= slides.length) currentSlide = 0;
      if (currentSlide < 0) currentSlide = slides.length - 1;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 8000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    });

    // Pause on hover
    const hero = $('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stopAutoSlide);
      hero.addEventListener('mouseleave', startAutoSlide);
    }

    // Start auto slide
    startAutoSlide();
  }
})();
