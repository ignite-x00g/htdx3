document.addEventListener('DOMContentLoaded', function() {
  const bodyElement = document.body;
  const chatbotUi = document.getElementById('chatbot-ui'); // Ensure chatbot UI element is accessible

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
  // 2) LANGUAGE TOGGLE (Desktop, Mobile & New Modal)
  // ================================================================
  let currentLang = localStorage.getItem('language') || 'en'; // Consolidated language variable

  const alertMessages = {
    addEntry: {
      en: "Please add at least one entry in {sectionName}.",
      es: "Agrega al menos una entrada en {sectionName}."
    },
    formSubmitted: {
      en: "Form submitted.",
      es: "Formulario enviado."
    },
    // Added from original main.js for contact form
    contactThankYou: {
        en: "Thank you for contacting us! We will get back to you soon.",
        es: "¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto."
    }
  };

  function updateLanguageDisplay() {
    // Update text content for elements with data-en/data-es
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${currentLang}`);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // Handle placeholders separately
        if (el.placeholder && el.hasAttribute(`data-placeholder-${currentLang}`)) {
            el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
        } else if (el.placeholder && el.hasAttribute('data-en') && !el.hasAttribute(`data-placeholder-${currentLang}`)) {
            // Fallback for inputs that only have data-en for placeholder
             el.placeholder = el.getAttribute(`data-${currentLang}`);
        }
      } else if (el.classList.contains('circle-btn') || (el.classList.contains('close-modal') && el.id !== 'close-modal-btn')) {
        // circle-btn from new modal has fixed text '+' or '-'
        // old close-modal buttons (not the one with id 'close-modal-btn' from new modal) might have icons
        if (el.querySelector('i.fas')) { // Preserve icon if present (for old modal structure if any part remains)
            const icon = el.querySelector('i.fas').outerHTML;
            if (text) el.innerHTML = text + ' ' + icon;
        }
        // else: do nothing to textContent for circle-btn or new close-modal, aria-label is king
      } else {
        if (text) el.textContent = text;
      }
    });

    // Update placeholders specifically for elements with data-placeholder attributes
    document.querySelectorAll('[data-placeholder-en], [data-placeholder-es]').forEach(el => {
        const placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
        if (placeholder) el.placeholder = placeholder;
    });

    // Update ARIA labels
    document.querySelectorAll('[data-aria-label-en], [data-aria-label-es]').forEach(el => {
      const ariaLabel = el.getAttribute(`data-aria-label-${currentLang}`);
      if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
    });

    // Update lang toggle button texts
    const langToggleMobileEl = document.getElementById('mobile-language-toggle');
    const langToggleDesktopEl = document.getElementById('language-toggle-desktop');
    const langToggleModalEl = document.querySelector('#join-modal .lang-toggle'); // New modal's lang toggle

    const newToggleLabel = currentLang === 'en' ? 'ES' : 'EN';
    if (langToggleMobileEl) langToggleMobileEl.textContent = newToggleLabel;
    if (langToggleDesktopEl) langToggleDesktopEl.textContent = newToggleLabel;

    const newModalToggleText = currentLang === 'en' ? 'EN | ES' : 'ES | EN';
    if (langToggleModalEl) langToggleModalEl.textContent = newModalToggleText;

    // Update page title (main page title)
    // const mainTitleTag = document.querySelector('head > title');
    // if (mainTitleTag && mainTitleTag.hasAttribute('data-en') && mainTitleTag.hasAttribute('data-es')) {
    //    document.title = mainTitleTag.getAttribute(`data-${currentLang}`);
    // }
    // The main index.html title is static. The title tag in join_us_translated_aria.html was data-driven.
    // If the main page title needs to be dynamic, it requires data-en/es attributes.
     bodyElement.setAttribute('lang', currentLang);
  }

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('language', currentLang);
    updateLanguageDisplay();
  }

  // Attach to existing global toggles
  const langToggleMobileGlobal = document.getElementById('mobile-language-toggle');
  const langToggleDesktopGlobal = document.getElementById('language-toggle-desktop');
  if (langToggleMobileGlobal) langToggleMobileGlobal.addEventListener('click', toggleLang);
  if (langToggleDesktopGlobal) langToggleDesktopGlobal.addEventListener('click', toggleLang);

  // The new modal's internal toggle (if present and with onclick="toggleLang()") will also call the new unified toggleLang.

  // Initial language setup
  updateLanguageDisplay();


  // ================================================================
  // 3) MODAL FUNCTIONALITY (Join Us & Contact Us) - Remains largely the same
  // ================================================================
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeModalButtons = document.querySelectorAll('[data-close]'); //This will now also include the new modal's close button if it has data-close
  const floatingIcons = document.querySelectorAll('.floating-icon');
  floatingIcons.forEach((icon) => {
    icon.addEventListener('click', function() {
      const modalId = icon.getAttribute('data-modal');
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        // --- START FIX ---
        // If opening contact-modal, ensure chatbot is hidden.
        if (modalId === 'contact-modal' && chatbotUi) {
            chatbotUi.style.display = 'none';
        }
        // --- END FIX ---
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
  // 5) MOBILE CHAT LINK TO OPEN CHATBOT
  // ================================================================
  const mobileChatLink = document.getElementById('mobile-chat-link');
  if (mobileChatLink) {
    mobileChatLink.addEventListener('click', function(event) {
      event.preventDefault();
      // Attempt to open the chatbot
      if (typeof openChatbot === 'function') {
        openChatbot();
      } else {
        // Fallback if chatbot system is not yet fully integrated:
        // Log a warning and temporarily open the contact modal.
        // This ensures the link remains functional during development.
        console.warn('openChatbot function not found. Mobile chat link opening contact modal as fallback.');
        const contactModal = document.getElementById('contact-modal');
        if (contactModal) {
          if (chatbotUi && chatbotUi.style.display !== 'none') {
            chatbotUi.style.display = 'none'; // Hide chatbot if it's somehow open
          }
          contactModal.classList.add('active');
          contactModal.focus();
        }
      }
    });
  }

  // ================================================================
  // 6) FORM SUBMISSIONS (Alert + Reset + Close Modal)
  // ================================================================
  // const joinForm = document.getElementById('join-form'); // Logic for this specific ID moved to joinus-modal/script.js
  // if (joinForm) {
    // ... submit listener and reset logic for #join-modal from index.html ...
  // }

  // const contactForm = document.getElementById('contact-form'); // Moved to contactus/script.js
  // if (contactForm) {
  //   contactForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     alert(alertMessages.contactThankYou[currentLang]);
  //     contactForm.reset();
  //     const contactModal = document.getElementById('contact-modal');
  //     if (contactModal) {
  //       contactModal.classList.remove('active');
  //     }
  //   });
  // }

  // ================================================================
  // 7) NEW DYNAMIC FORM LOGIC (for the new Join Us modal) - MOVED
  // ================================================================
  // Logic for '#join-modal .form-section' (i.e. the complex dynamic fields)
  // was specific to the standalone joinus.html page (now joinus/index.html and its script joinus/script.js).
  // The #join-modal in index.html is simpler and does not use this structure.
  // This entire block has been moved to joinus/script.js.
  // document.querySelectorAll('#join-modal .form-section').forEach(section => {
  //   ...
  // });

  // ================================================================
  // 8) SERVICE WORKER REGISTRATION (was 10, renumbered)
  // ================================================================
  if ('serviceWorker'in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    });
  }
});
