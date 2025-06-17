vdocument.addEventListener("DOMContentLoaded", () => {
  // === LANGUAGE TOGGLE ===
  let currentLanguage = localStorage.getItem("language") || "en";
  const langToggleDesktop = document.getElementById("language-toggle-desktop");
  const langToggleMobile = document.getElementById("language-toggle-mobile");

  function updateLanguage(lang) {
    const attr = (lang === "en") ? "data-en" : "data-es";
    const elements = document.querySelectorAll("[data-en]");
    elements.forEach((el) => {
      const translation = el.getAttribute(attr);
      if (translation) {
        if (el.hasAttribute("placeholder")) {
          el.setAttribute("placeholder", translation);
        } else if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") {
          el.textContent = translation;
        }
      }
    });
  }

  document.body.setAttribute("lang", currentLanguage);
  updateLanguage(currentLanguage);

  function setLanguageButtonLabels() {
    if (langToggleDesktop) langToggleDesktop.textContent = (currentLanguage === "en") ? "ES" : "EN";
    if (langToggleMobile) {
      const mobileSpan = langToggleMobile.querySelector("span") || langToggleMobile;
      mobileSpan.textContent = (currentLanguage === "en") ? "ES" : "EN";
    }
  }

  function toggleLanguage() {
    currentLanguage = (currentLanguage === "en") ? "es" : "en";
    localStorage.setItem("language", currentLanguage);
    document.body.setAttribute("lang", currentLanguage);
    updateLanguage(currentLanguage);
    setLanguageButtonLabels();
  }

  if (langToggleDesktop) langToggleDesktop.addEventListener("click", toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener("click", toggleLanguage);
  setLanguageButtonLabels();

  // === THEME TOGGLE ===
  const themeToggleDesktop = document.getElementById("theme-toggle-desktop");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);

  function setupThemeToggle(button) {
    if (!button) return;
    button.textContent = (savedTheme === "light") ? "Dark" : "Light";
    button.addEventListener("click", () => {
      const current = body.getAttribute("data-theme");
      const newTheme = current === "light" ? "dark" : "light";
      body.setAttribute("data-theme", newTheme);
      button.textContent = current;
      localStorage.setItem("theme", newTheme);
    });
  }

  setupThemeToggle(themeToggleDesktop);
  setupThemeToggle(themeToggleMobile);

  // === MODAL LOGIC with Scroll Lock ===
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeModalButtons = document.querySelectorAll('[data-close]');
  const floatingIcons = document.querySelectorAll('.floating-icon');

  function toggleBodyScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  floatingIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const modalId = icon.getAttribute('data-modal');
      const target = document.getElementById(modalId);
      if (target) {
        target.classList.add('active');
        toggleBodyScroll(true);
      }
    });
  });

  closeModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        toggleBodyScroll(false);
      }
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        toggleBodyScroll(false);
      }
    });
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
        toggleBodyScroll(false);
      }
    });
  });

  // === MOBILE SERVICES MENU ===
  const mobileServicesToggleBtn = document.getElementById('mobile-services-toggle');
  const mobileServicesMenu = document.getElementById('mobile-services-menu-container');

  if (mobileServicesToggleBtn && mobileServicesMenu) {
    mobileServicesToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileServicesMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!mobileServicesMenu.contains(e.target) && !mobileServicesToggleBtn.contains(e.target)) {
        mobileServicesMenu.classList.remove('active');
      }
    });
  }

  // === COLLAPSIBLE DROPDOWNS ===
  const employmentTypeToggle = document.getElementById('employment-type-toggle');
  const employmentTypeCheckboxes = document.getElementById('employment-type-checkboxes');
  const employmentDone = document.getElementById('employment-done');

  if (employmentTypeToggle && employmentTypeCheckboxes && employmentDone) {
    employmentTypeToggle.addEventListener('click', () => {
      employmentTypeCheckboxes.style.display = 'block';
      employmentTypeToggle.setAttribute('aria-expanded', 'true');
    });
    employmentDone.addEventListener('click', () => {
      employmentTypeCheckboxes.style.display = 'none';
      employmentTypeToggle.setAttribute('aria-expanded', 'false');
    });
  }

  const areasTrigger = document.getElementById('join-areas-trigger');
  const areasOptions = document.getElementById('join-areas-options');
  const areasDone = document.getElementById('areas-done');

  if (areasTrigger && areasOptions && areasDone) {
    areasTrigger.addEventListener('click', () => {
      const isOpen = areasTrigger.getAttribute('aria-expanded') === 'true';
      areasTrigger.setAttribute('aria-expanded', !isOpen);
      areasOptions.style.display = isOpen ? 'none' : 'block';
      const arrow = areasTrigger.querySelector('.arrow-down');
      if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
    });
    areasDone.addEventListener('click', () => {
      areasOptions.style.display = 'none';
      areasTrigger.setAttribute('aria-expanded', 'false');
      const arrow = areasTrigger.querySelector('.arrow-down');
      if (arrow) arrow.textContent = '▼';
    });
  }

  // === INLINE VALIDATION FEEDBACK ===
  const requiredFields = document.querySelectorAll('#join-form input[required], #join-form textarea[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => {
      if (!field.checkValidity()) field.classList.add('invalid');
      else field.classList.remove('invalid');
    });
  });

  // === SANITIZE FUNCTION ===
  function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#x27;")
                .trim();
  }

  // === FORM SUBMISSION: JOIN US ===
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = joinForm.querySelector('.submit-button');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      if (document.getElementById('honeypot-join').value) return;

      grecaptcha.ready(() => {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'join_us_submit' }).then((token) => {
          const formData = new FormData(joinForm);
          formData.append('g-recaptcha-response', token);

          fetch('https://join.gabrieloor-cv1.workers.dev/', {
            method: 'POST',
            body: formData
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              joinForm.reset();
              document.getElementById('join-success-msg').style.display = 'block';
              setTimeout(() => {
                document.getElementById('join-modal').classList.remove('active');
                toggleBodyScroll(false);
                document.getElementById('join-success-msg').style.display = 'none';
              }, 3000);
            } else {
              alert('Join submission failed.');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
        });
      });
    });
  }

  // === FORM SUBMISSION: CONTACT US ===
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.submit-button');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      if (document.getElementById('honeypot-contact').value) return;

      grecaptcha.ready(() => {
        grecaptcha.execute('6LfAOV0rAAAAAPBGgn2swZWj5SjANoQ4rUH6XIMz', { action: 'contact_us_submit' }).then((token) => {
          const formData = new FormData(contactForm);
          formData.append('g-recaptcha-response', token);

          fetch('https://contact.gabrieloor-cv1.workers.dev/', {
            method: 'POST',
            body: formData
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              contactForm.reset();
              document.getElementById('contact-success-msg').style.display = 'block';
              setTimeout(() => {
                document.getElementById('contact-modal').classList.remove('active');
                toggleBodyScroll(false);
                document.getElementById('contact-success-msg').style.display = 'none';
              }, 3000);
            } else {
              alert('Contact submission failed.');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          });
        });
      });
    });
  }
});
