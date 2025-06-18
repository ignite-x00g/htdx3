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
        // Check if the element is a button with an icon to preserve the icon
        if (el.tagName === 'BUTTON' && el.querySelector('i.fas')) {
            const icon = el.querySelector('i.fas').outerHTML;
            el.innerHTML = text + ' ' + icon;
        } else {
            el.textContent = text;
        }
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
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(currentLanguage === 'en' ? 'Thank you for joining us! We have received your details.' : '¡Gracias por unirte! Hemos recibido tus datos.');
      joinForm.reset(); // Reset form fields
       // Manually reset dynamic fields and hide remove buttons again
      dynamicFieldTypes.forEach(type => {
        const container = document.getElementById(`${type.name}-fields-container`);
        if (container) {
          // Remove all but the first item
          const items = container.querySelectorAll(`.dynamic-item.${type.name}-item`);
          for (let i = items.length - 1; i > 0; i--) {
            items[i].remove();
          }
          // Reset counter
          counters[type.name] = 1;
          updateRemoveButtonVisibility(`${type.name}-fields-container`);
        }
      });
      // Manually reset collapsible checkboxes
      const collapsibleCheckboxes = joinForm.querySelectorAll('.collapsible-content input[type="checkbox"]');
      collapsibleCheckboxes.forEach(checkbox => checkbox.checked = false);

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
  // 7) DYNAMIC FIELD FUNCTIONALITY (Join Us Form)
  // ================================================================
  const counters = {
    experience: 1,
    skills: 1,
    education: 1,
    'continued-education': 1,
    certification: 1,
    hobbies: 1
  };

  function getExperienceItemHTML(id) {
    return `
      <div class="dynamic-item experience-item">
        <label for="exp-role-${id}" data-en="Describe your Roles" data-es="Describe tus Funciones">Describe your Roles</label>
        <textarea id="exp-role-${id}" name="exp-role[]" placeholder="Describe your role... / Describe tu función..." data-en="Describe your role..." data-es="Describe tu función..." rows="3"></textarea>
        <label for="exp-date-from-${id}" data-en="Date from" data-es="Fecha desde">Date from</label>
        <input type="month" id="exp-date-from-${id}" name="exp-date-from[]">
        <label for="exp-date-to-${id}" data-en="Date to" data-es="Fecha hasta">Date to</label>
        <input type="month" id="exp-date-to-${id}" name="exp-date-to[]">
        <button type="button" class="remove-btn" data-remove="experience-item">-</button>
      </div>`;
  }

  function getGenericItemHTML(type, id, placeholderEn, placeholderEs) {
    return `
      <div class="dynamic-item ${type}-item">
        <input type="text" id="${type}-${id}" name="${type}[]" placeholder="${placeholderEn} / ${placeholderEs}" data-en="${placeholderEn}" data-es="${placeholderEs}">
        <button type="button" class="remove-btn" data-remove="${type}-item">-</button>
      </div>`;
  }

  function updateRemoveButtonVisibility(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = container.querySelectorAll('.dynamic-item');
    items.forEach((item) => {
      const removeBtn = item.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.style.display = items.length === 1 ? 'none' : '';
      }
    });
  }

  function addDynamicField(containerId, itemName, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    counters[itemName]++;
    const newItemHTML = templateFn(counters[itemName]);

    const tempWrapper = document.createElement('div');
    tempWrapper.innerHTML = newItemHTML;
    const newItemElement = tempWrapper.firstChild;

    container.appendChild(newItemElement);
    updateLanguageText(); // Update text for newly added elements
    updateRemoveButtonVisibility(containerId);
  }

  const dynamicFieldTypes = [
    { name: 'experience', template: getExperienceItemHTML, placeholderEn: '', placeholderEs: '' }, // Experience is special
    { name: 'skills', template: (id) => getGenericItemHTML('skills', id, 'Enter a skill', 'Ingresa una habilidad') },
    { name: 'education', template: (id) => getGenericItemHTML('education', id, 'Enter degree or institution', 'Ingresa título o institución') },
    { name: 'continued-education', template: (id) => getGenericItemHTML('continued-education', id, 'Enter course or program', 'Ingresa curso o programa') },
    { name: 'certification', template: (id) => getGenericItemHTML('certification', id, 'Enter certification', 'Ingresa certificación') },
    { name: 'hobbies', template: (id) => getGenericItemHTML('hobbies', id, 'Enter a hobby', 'Ingresa un pasatiempo') }
  ];

  dynamicFieldTypes.forEach(type => {
    const addButton = document.querySelector(`[data-add="${type.name}-item"]`);
    if (addButton) {
      addButton.addEventListener('click', () => {
        addDynamicField(`${type.name}-fields-container`, type.name, type.template);
      });
    }
    // Initial visibility update for remove buttons
    updateRemoveButtonVisibility(`${type.name}-fields-container`);
  });

  if (joinForm) {
    joinForm.addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-btn')) {
        const itemToRemove = event.target.closest('.dynamic-item');
        if (itemToRemove) {
          const container = itemToRemove.parentElement;
          itemToRemove.remove();
          if (container && container.id) {
            updateRemoveButtonVisibility(container.id);
          }
        }
      }
    });
  }

  // ================================================================
  // 8) COLLAPSIBLE DROPDOWN FUNCTIONALITY (Join Us Form)
  // ================================================================
  const collapsibleToggles = document.querySelectorAll('.collapsible-toggle');
  collapsibleToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const contentId = this.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', !isExpanded);
      content.classList.toggle('active');
      const icon = this.querySelector('i.fas');
      if (icon) {
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      }
    });

    // Done button functionality
    const contentId = toggle.getAttribute('aria-controls');
    const content = document.getElementById(contentId);
    if (content) {
      const doneBtn = content.querySelector('.collapsible-done-btn');
      if (doneBtn) {
        doneBtn.addEventListener('click', function() {
          toggle.setAttribute('aria-expanded', 'false');
          content.classList.remove('active');
          const icon = toggle.querySelector('i.fas');
          if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
          }
        });
      }
    }
  });


  // ================================================================
  // 9) SERVICE WORKER REGISTRATION
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
