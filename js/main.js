document.addEventListener('DOMContentLoaded', function() {
  const bodyElement = document.body;

  // ================================================================
  // 1) THEME TOGGLE (Desktop & Mobile)
  // ================================================================
  const themeToggleMobile = document.getElementById('mobile-theme-toggle');
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  let currentTheme = localStorage.getItem('theme') || 'light';

  bodyElement.setAttribute('data-theme', currentTheme);

  function setupThemeButton(button) {
    if (!button) return;
    button.textContent = (bodyElement.getAttribute('data-theme') === 'light') ? 'Dark' : 'Light';
    button.addEventListener('click', function() {
      currentTheme = bodyElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      bodyElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      this.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      if (this === themeToggleMobile && themeToggleDesktop) {
        themeToggleDesktop.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      } else if (this === themeToggleDesktop && themeToggleMobile) {
        themeToggleMobile.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      }
    });
  }
  setupThemeButton(themeToggleMobile);
  setupThemeButton(themeToggleDesktop);

  // ================================================================
  // 2) LANGUAGE TOGGLE (Desktop & Mobile)
  // ================================================================
  const langToggleMobile = document.getElementById('mobile-language-toggle');
  const langToggleDesktop = document.getElementById('language-toggle-desktop');
  let currentLanguage = localStorage.getItem('language') || 'en';

  function updateLanguageText() {
    const translatableElements = document.querySelectorAll('[data-en]');
    translatableElements.forEach((el) => {
      const text = (currentLanguage === 'en') ? el.getAttribute('data-en') : el.getAttribute('data-es');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder) el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });
  }

  function setLanguageButtonLabels() {
    const label = (currentLanguage === 'en') ? 'ES' : 'EN';
    if (langToggleMobile) langToggleMobile.textContent = label;
    if (langToggleDesktop) langToggleDesktop.textContent = label;
  }

  bodyElement.setAttribute('lang', currentLanguage);
  updateLanguageText();
  setLanguageButtonLabels();

  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'es' : 'en';
    localStorage.setItem('language', currentLanguage);
    bodyElement.setAttribute('lang', currentLanguage);
    updateLanguageText();
    setLanguageButtonLabels();
  }

  if (langToggleMobile) {
    langToggleMobile.addEventListener('click', toggleLanguage);
  }
  if (langToggleDesktop) {
    langToggleDesktop.addEventListener('click', toggleLanguage);
  }

  // ================================================================
  // 3) MODAL FUNCTIONALITY (Join Us & Contact Us)
  // ================================================================
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeModalButtons = document.querySelectorAll('[data-close]');
  const floatingIcons = document.querySelectorAll('.floating-icon');

  floatingIcons.forEach((icon) => {
    icon.addEventListener('click', function() {
      const modalId = icon.getAttribute('data-modal');
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        modalElement.classList.add('active');
        modalElement.focus();
      }
    });
  });

  closeModalButtons.forEach((btn) => {
    btn.addEventListener('click', function() {
      const parentOverlay = btn.closest('.modal-overlay');
      if (parentOverlay) {
        parentOverlay.classList.remove('active');
      }
    });
  });

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
      }
    });
  });

  // ================================================================
  // 4) MOBILE SERVICES TOGGLE
  // ================================================================
  const servicesToggleMobile = document.getElementById('mobile-services-toggle');
  const mobileServicesMenu = document.getElementById('mobile-services-menu');

  if (servicesToggleMobile && mobileServicesMenu) {
    servicesToggleMobile.addEventListener('click', function() {
      mobileServicesMenu.classList.toggle('active');
    });
  }

  // ================================================================
  // 5) MOBILE CHAT LINK TO OPEN CONTACT MODAL
  // ================================================================
  const mobileChatLink = document.querySelector('.mobile-nav a[href="#"]'); // Target the chat link specifically
  if (mobileChatLink) {
    const chatIcon = mobileChatLink.querySelector('.fa-comment-alt');
    if (chatIcon) { // Check if it's indeed the chat link by icon
      mobileChatLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        const contactModal = document.getElementById('contact-modal');
        if (contactModal) {
          contactModal.classList.add('active');
          contactModal.focus();
        }
      });
    }
  }

  // ================================================================
  // 6) FORM SUBMISSIONS (Alert + Reset + Close Modal)
  // ================================================================
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(currentLanguage === 'en' ? 'Thank you for joining us! We have received your details.' : '¡Gracias por unirte! Hemos recibido tus datos.');
      joinForm.reset();
      const joinModal = document.getElementById('join-modal');
      if (joinModal) {
        joinModal.classList.remove('active');
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(currentLanguage === 'en' ? 'Thank you for contacting us! We will get back to you soon.' : '¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
      contactForm.reset();
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }

  // ================================================================
  // 7) SERVICE WORKER REGISTRATION
  // ================================================================
  if ('serviceWorker'in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/service-worker.js') // Updated path
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    });
  }
});
