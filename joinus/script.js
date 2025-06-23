// joinus/script.js
document.addEventListener('DOMContentLoaded', () => {
  let currentLang = localStorage.getItem('language') || 'en';
  const bodyElement = document.body; // For setting overall page lang attribute
  const theme = localStorage.getItem('theme') || 'light'; // Get theme from localStorage

  // Apply theme immediately
  bodyElement.setAttribute('data-theme', theme);


  const langToggleBtn = document.getElementById('lang-toggle-joinus-page');

  function updateLanguageDisplay() {
    bodyElement.setAttribute('lang', currentLang);
    // Update text content for elements with data-en/data-es
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${currentLang}`);
      if (text) { // Ensure text is not null
        // Handle specific elements like button text or placeholders if needed
        if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) {
             // For inputs/textareas, data-en/es might be for the label,
             // so we need a specific data-placeholder-en/es or handle it carefully.
             // The current joinus/index.html doesn't use data-placeholder for inputs in dynamic sections.
             // It's handled in the section input placeholder update below.
             // For the main "about-textarea", we'll use specific attributes.
        } else if (el.id === 'lang-toggle-joinus-page') {
            el.textContent = el.getAttribute(`data-${currentLang === 'en' ? 'es' : 'en'}_text`) || (currentLang === 'en' ? 'ES' : 'EN');
        }
        else {
          el.textContent = text;
        }
      }
    });

    // Specifically update placeholders for inputs within .form-section
    document.querySelectorAll('.form-section').forEach(section => {
      const sectionTitleElement = section.querySelector('h2[data-en]');
      if (sectionTitleElement) {
        const sectionNameInCurrentLang = sectionTitleElement.getAttribute(`data-${currentLang}`);
        section.querySelectorAll('.inputs input[type="text"]').forEach(input => {
          if (!input.disabled) { // Only update placeholder if not disabled (i.e., not part of an accepted section)
            input.placeholder = currentLang === 'es'
              ? `Ingrese ${sectionNameInCurrentLang}`
              : `Enter ${sectionNameInCurrentLang} info`;
          }
        });
      }
    });

    // Update textarea placeholder using specific data attributes
    const aboutTextarea = document.getElementById('about-textarea');
    if (aboutTextarea) {
      const placeholderText = aboutTextarea.getAttribute(`data-placeholder-${currentLang}`);
      if (placeholderText) {
        aboutTextarea.placeholder = placeholderText;
      }
    }

    // Update lang toggle button text (already handled above by its own data-en/es logic if set up that way)
    // Re-confirming for the new attribute convention:
    if (langToggleBtn) {
      langToggleBtn.textContent = langToggleBtn.getAttribute(`data-${currentLang === 'en' ? 'es' : 'en'}_text`) || (currentLang === 'en' ? 'ES' : 'EN');
      // Also update its data attributes for the next toggle
      langToggleBtn.setAttribute('data-en_text', 'ES');
      langToggleBtn.setAttribute('data-es_text', 'EN');
    }

    // Update page title
    const pageTitleTag = document.querySelector('title[data-en]');
    if (pageTitleTag) {
        document.title = pageTitleTag.getAttribute(`data-${currentLang}`);
    }
  }

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('language', currentLang);
    updateLanguageDisplay();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', toggleLang);
     // Set initial data attributes for the button text switching
    langToggleBtn.setAttribute('data-en_text', 'ES');
    langToggleBtn.setAttribute('data-es_text', 'EN');
  }

  // Initialize all add/remove/accept/edit handlers
  document.querySelectorAll('.form-section').forEach(section => {
    const addBtn = section.querySelector('.circle-btn.add');
    const removeBtn = section.querySelector('.circle-btn.remove');
    const acceptBtn = section.querySelector('.accept-btn');
    const editBtn = section.querySelector('.edit-btn');
    const inputsContainer = section.querySelector('.inputs');
    const sectionTitleElement = section.querySelector('h2[data-en]'); // Ensure h2 has data-en

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        if (sectionTitleElement) {
            const sectionNameInCurrentLang = sectionTitleElement.getAttribute(`data-${currentLang}`);
            input.placeholder = currentLang === 'es'
              ? `Ingrese ${sectionNameInCurrentLang}`
              : `Enter ${sectionNameInCurrentLang} info`;
        }
        inputsContainer.appendChild(input);
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        const inputs = inputsContainer.querySelectorAll('input:not([type="month"]), textarea'); // Exclude month inputs from simple removal if they are paired
        if (inputs.length > 0) {
          inputsContainer.removeChild(inputs[inputs.length - 1]);
        }
      });
    }

    if (acceptBtn && editBtn) {
      acceptBtn.addEventListener('click', () => {
        const inputs = inputsContainer.querySelectorAll('input:not([type="month"]), textarea');
        let hasValue = false;
        if (inputs.length === 0 && inputsContainer.querySelectorAll('input[type="month"]').length === 0) { // Also check month inputs for experience
            hasValue = true; // Allow accepting empty sections
        } else {
            inputs.forEach(input => {
                if (input.value.trim() !== '') hasValue = true;
            });
            // Add check for month inputs if this section is "Experience"
            if (sectionTitleElement && sectionTitleElement.getAttribute('data-en') === "Experience") {
                 inputsContainer.querySelectorAll('input[type="month"]').forEach(monthInput => {
                     if(monthInput.value.trim() !== '') hasValue = true;
                 });
            }
        }

        if (!hasValue && (inputs.length > 0 || (sectionTitleElement && sectionTitleElement.getAttribute('data-en') === "Experience" && inputsContainer.querySelectorAll('input[type="month"]').length > 0))) {
          const titleText = sectionTitleElement ? sectionTitleElement.getAttribute(`data-${currentLang}`) : "esta sección";
          const alertMsg = currentLang === 'es'
            ? `Agregue al menos una entrada en "${titleText}" o deje la sección vacía para continuar.`
            : `Please add at least one entry in "${titleText}" or leave the section empty to continue.`;
          alert(alertMsg);
          return;
        }

        inputsContainer.querySelectorAll('input, textarea').forEach(input => input.disabled = true);
        section.classList.add('completed');
        if(sectionTitleElement) {
            sectionTitleElement.classList.add('section-accepted');
            let checkmark = sectionTitleElement.querySelector('.accept-checkmark');
            if (!checkmark) {
                checkmark = document.createElement('span');
                checkmark.classList.add('accept-checkmark');
                checkmark.innerHTML = '&#10004;'; // Checkmark icon
                sectionTitleElement.appendChild(checkmark);
            }
        }

        acceptBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
        if(addBtn) addBtn.style.display = 'none';
        if(removeBtn) removeBtn.style.display = 'none';
      });

      editBtn.addEventListener('click', () => {
        inputsContainer.querySelectorAll('input, textarea').forEach(input => input.disabled = false);
        section.classList.remove('completed');
        if(sectionTitleElement) {
            sectionTitleElement.classList.remove('section-accepted');
            const checkmark = sectionTitleElement.querySelector('.accept-checkmark');
            if(checkmark) sectionTitleElement.removeChild(checkmark);
        }

        acceptBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        if(addBtn) addBtn.style.display = 'inline-flex';
        if(removeBtn) removeBtn.style.display = 'inline-flex';
        const allInputs = inputsContainer.querySelectorAll('input:not([type="month"]), textarea');
        if (allInputs.length > 0) allInputs[allInputs.length-1].focus();
      });
    }
  });

  // Collapsible interest section
  const collapsibleHeader = document.querySelector('.collapsible-header');
  const collapsibleContent = document.querySelector('.collapsible-checkbox-content');
  const collapsibleArrow = document.querySelector('.collapsible-arrow');

  if (collapsibleHeader && collapsibleContent && collapsibleArrow) {
      collapsibleHeader.addEventListener('click', () => {
          const isVisible = collapsibleContent.style.display === 'block';
          collapsibleContent.style.display = isVisible ? 'none' : 'block';
          collapsibleArrow.classList.toggle('open', !isVisible);
      });
  }

  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.onsubmit = function(e) {
      e.preventDefault();
      let allAccepted = true;
      document.querySelectorAll('.form-section').forEach(s => {
          if (!s.classList.contains('completed')) {
              allAccepted = false;
          }
      });

      if (!allAccepted) {
          alert(currentLang === 'es' ? "Por favor, complete (acepte) todas las secciones antes de enviar." : "Please complete (accept) all sections before submitting.");
          return;
      }

      alert(currentLang === 'es'
        ? "¡Formulario enviado! (Esto es una demostración, los datos están listos para enviar)."
        : "Form submitted! (This is a demo, data is ready to send.)"
      );
    };
  }

  updateLanguageDisplay();

  document.querySelectorAll('.form-section .edit-btn').forEach(btn => {
    btn.style.display = 'none';
  });
  document.querySelectorAll('.form-section .circle-btn.add, .form-section .circle-btn.remove').forEach(btn => {
    btn.style.display = 'inline-flex';
  });

});
