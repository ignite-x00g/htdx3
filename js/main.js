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
  const mobileChatLink = document.querySelector('.mobile-nav a[href="#"]');
  if (mobileChatLink) {
    const chatIcon = mobileChatLink.querySelector('.fa-comment-alt');
    if (chatIcon) {
      mobileChatLink.addEventListener('click', function(event) {
        event.preventDefault();
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
  const joinForm = document.getElementById('join-form'); // Assuming new modal form also has id 'join-form'
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(alertMessages.formSubmitted[currentLang]); // Use new alert message
      joinForm.reset(); // Reset form fields (name, email, phone, comment on the new form)

      // New Reset Logic for the new form structure in #join-modal
      document.querySelectorAll('#join-modal .form-section').forEach(section => {
          const inputsContainer = section.querySelector('.inputs');
          if (inputsContainer) inputsContainer.innerHTML = ''; // Remove all dynamically added inputs

          section.classList.remove('completed');
          const acceptBtn = section.querySelector('.accept-btn');
          const editBtn = section.querySelector('.edit-btn');
          const addBtnSection = section.querySelector('.circle-btn.add'); // Specific to new modal
          const removeBtnSection = section.querySelector('.circle-btn.remove'); // Specific to new modal


          if (acceptBtn) {
              acceptBtn.style.display = 'inline-block';
              // Reset acceptBtn text using its data attributes and currentLang
              const acceptText = acceptBtn.getAttribute(`data-${currentLang}`);
              if(acceptText) acceptBtn.textContent = acceptText;
              acceptBtn.disabled = false;
          }
          if (editBtn) editBtn.style.display = 'none';
          if (addBtnSection) addBtnSection.disabled = false;
          if (removeBtnSection) removeBtnSection.disabled = false;
      });

      // Reset "Accept" button states and section UI
      document.querySelectorAll('button.accept-section-btn[data-action="accept-section"]').forEach(button => {
        const sectionName = button.dataset.section;
        const sectionElement = document.getElementById(`${sectionName}-section`);
        const titleLabel = sectionElement ? sectionElement.querySelector(':scope > label') : null;

        if (titleLabel) {
          titleLabel.classList.remove('section-accepted');
          const checkmark = titleLabel.querySelector('.accept-checkmark');
          if (checkmark) checkmark.remove();
        }

        button.disabled = false;
        // Reset text based on current language and original data attributes from HTML
        const originalTextEn = button.getAttribute('data-en');
        const originalTextEs = button.getAttribute('data-es');
        button.textContent = currentLanguage === 'es' ? originalTextEs : originalTextEn;

        const fieldsContainer = document.getElementById(`${sectionName}-fields-container`);
        if (fieldsContainer) {
          fieldsContainer.querySelectorAll('input, textarea, select').forEach(field => field.disabled = false);
        }

        const addBtn = document.querySelector(`[data-action="add-field"][data-section="${sectionName}"]`);
        if (addBtn) addBtn.disabled = false;

        const removeBtn = document.querySelector(`[data-action="remove-field"][data-section="${sectionName}"]`);
        if (removeBtn) removeBtn.disabled = false;

        // After re-enabling, ensure the section remove button state is accurate
        if (sectionName !== 'experience') { // updateSectionRemoveButtonState is for non-experience sections
            updateSectionRemoveButtonState(sectionName);
        }
      });

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
      alert(alertMessages.contactThankYou[currentLang]);
      contactForm.reset();
      const contactModal = document.getElementById('contact-modal');
      if (contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }

  // ================================================================
  // 7) NEW DYNAMIC FORM LOGIC (for the new Join Us modal)
  // ================================================================
  document.querySelectorAll('#join-modal .form-section').forEach(section => {
    const addBtn = section.querySelector('.add');
    const removeBtn = section.querySelector('.remove');
    const acceptBtn = section.querySelector('.accept-btn');
    const editBtn = section.querySelector('.edit-btn');
    const inputsContainer = section.querySelector('.inputs');
    const sectionNameEn = section.querySelector('h2')?.getAttribute('data-en');
    const sectionNameEs = section.querySelector('h2')?.getAttribute('data-es');

    if (!addBtn || !removeBtn || !acceptBtn || !editBtn || !inputsContainer || !sectionNameEn || !sectionNameEs) return;

    addBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'text';
      const placeholderEn = `Enter ${sectionNameEn} info`;
      const placeholderEs = `Ingresa ${sectionNameEs} (info)`;
      input.setAttribute('data-placeholder-en', placeholderEn);
      input.setAttribute('data-placeholder-es', placeholderEs);
      input.placeholder = currentLang === 'es' ? placeholderEs : placeholderEn;
      inputsContainer.appendChild(input);
    });

    removeBtn.addEventListener('click', () => {
      const inputs = inputsContainer.querySelectorAll('input');
      if (inputs.length > 0) {
        inputsContainer.removeChild(inputs[inputs.length - 1]);
      }
    });
    acceptBtn.addEventListener('click', () => {
      const inputs = inputsContainer.querySelectorAll('input');
      const currentSectionNameText = currentLang === 'es' ? sectionNameEs : sectionNameEn;
      if (inputs.length === 0) {
        alert(alertMessages.addEntry[currentLang].replace('{sectionName}', currentSectionNameText));
        return;
      }
      inputs.forEach(inputField => inputField.disabled = true);
      section.classList.add('completed');
      acceptBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
      addBtn.disabled = true;
      removeBtn.disabled = true;
    });

    editBtn.addEventListener('click', () => {
      const inputs = inputsContainer.querySelectorAll('input');
      inputs.forEach(inputField => inputField.disabled = false);
      section.classList.remove('completed');
      acceptBtn.style.display = 'inline-block';
      editBtn.style.display = 'none';
      addBtn.disabled = false;
      removeBtn.disabled = false;
    });
  });

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
