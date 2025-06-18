document.addEventListener('DOMContentLoaded', function() {
  const bodyElement = document.body;

  // ================================================================
  // 1) THEME TOGGLE (Desktop & Mobile)
  // ================================================================
  const themeToggleMobile = document.getElementById('mobile-theme-toggle');
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  let currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme on load
  bodyElement.setAttribute('data-theme', currentTheme);

  // Helper to set up a single theme button's text and event listener
  function setupThemeButton(button) {
    if (!button) return;

    // Set initial button text
    button.textContent = (bodyElement.getAttribute('data-theme') === 'light') ? 'Dark' : 'Light';

    // Add event listener
    button.addEventListener('click', function() {
      currentTheme = bodyElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      bodyElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      // Update text for this button
      this.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      // Update text for the other button if it exists
      if (this === themeToggleMobile && themeToggleDesktop) {
        themeToggleDesktop.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      } else if (this === themeToggleDesktop && themeToggleMobile) {
        themeToggleMobile.textContent = (currentTheme === 'light') ? 'Dark' : 'Light';
      }
    });
  }

  // Initialize both theme toggles
  setupThemeButton(themeToggleMobile);
  setupThemeButton(themeToggleDesktop);

  // ================================================================
  // 2) LANGUAGE TOGGLE (Desktop & Mobile)
  // ================================================================
  const langToggleMobile = document.getElementById('mobile-language-toggle');
  const langToggleDesktop = document.getElementById('language-toggle-desktop');
  let currentLanguage = localStorage.getItem('language') || 'en';

  // Helper function to update text content based on selected language
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

  // Helper function to set button labels
  function setLanguageButtonLabels() {
    const label = (currentLanguage === 'en') ? 'ES' : 'EN';
    if (langToggleMobile) langToggleMobile.textContent = label;
    if (langToggleDesktop) langToggleDesktop.textContent = label;
  }

  // Initialize language on load
  bodyElement.setAttribute('lang', currentLanguage);
  updateLanguageText();
  setLanguageButtonLabels();

  // Combined toggle function for language
  function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'es' : 'en';
    localStorage.setItem('language', currentLanguage);
    bodyElement.setAttribute('lang', currentLanguage);
    updateLanguageText();
    setLanguageButtonLabels();
  }

  // Event listeners for language toggles
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
        modalElement.focus(); // For accessibility, focus on the modal
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
      if (e.target === overlay) { // Clicked on the overlay itself
        overlay.classList.remove('active');
      }
    });
    // Add ESC key listener to close modals
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
  // 5) FORM SUBMISSIONS (Alert + Reset + Close Modal)
  // ================================================================
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple alert, replace with actual submission logic if needed
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
      // Simple alert, replace with actual submission logic if needed
      alert(currentLanguage === 'en' ? 'Thank you for contacting us! We will get back to you soon.' : '¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto.');
      contactForm.reset();
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }

  // ================================================================
  // 6) SERVICE WORKER REGISTRATION
  // ================================================================
  if ('serviceWorker'in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js') // Ensure this path is correct
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    });
  }

});
