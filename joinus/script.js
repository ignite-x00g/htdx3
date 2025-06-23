// Script for Join Us page (joinus/index.html)

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = localStorage.getItem('language') || 'en';
    const bodyElement = document.body; // For setting theme and lang attribute

    // Theme initialization (basic, assuming theme might be set globally)
    let currentTheme = localStorage.getItem('theme') || 'light';
    bodyElement.setAttribute('data-theme', currentTheme);
    // No theme toggle button is present on joinus/index.html, so no event listener for it here.

    const alertMessages = {
        addEntry: {
          en: "Please add at least one entry in {sectionName}.",
          es: "Agrega al menos una entrada en {sectionName}."
        },
        formSubmitted: {
          en: "Form submitted. Thank you!", // Slightly modified from main.js
          es: "Formulario enviado ¡Gracias!" // From original joinus.html script
        }
    };

    function updateLanguageDisplay() {
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder && el.hasAttribute(`data-placeholder-${currentLang}`)) {
                    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
                } else if (el.placeholder && el.hasAttribute('data-en') && !el.hasAttribute(`data-placeholder-${currentLang}`)) {
                     el.placeholder = el.getAttribute(`data-${currentLang}`); // Fallback for simple placeholders
                }
            } else {
              if (text) el.textContent = text;
            }
        });

        // Update ARIA labels if any (none in current joinus.html structure but good practice)
        document.querySelectorAll('[data-aria-label-en], [data-aria-label-es]').forEach(el => {
          const ariaLabel = el.getAttribute(`data-aria-label-${currentLang}`);
          if (ariaLabel) el.setAttribute('aria-label', ariaLabel);
        });
        // Removed specific update for local langToggleModalEl as the element is removed
        // const langToggleModalEl = document.querySelector('.lang-toggle');
        // if (langToggleModalEl) {
        //     langToggleModalEl.textContent = currentLang === 'en' ? 'EN | ES' : 'ES | EN';
        // }

        const pageTitleTag = document.querySelector('title[data-en]');
        if (pageTitleTag) {
            document.title = pageTitleTag.getAttribute(`data-${currentLang}`);
        }
        bodyElement.setAttribute('lang', currentLang);
    }

    function toggleLang() {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        localStorage.setItem('language', currentLang);
        updateLanguageDisplay();
        // After language change, re-evaluate placeholders for dynamically added inputs
        document.querySelectorAll('.form-section').forEach(section => {
            const sectionTitleElement = section.querySelector('h2');
            const sectionNameEn = sectionTitleElement ? sectionTitleElement.getAttribute('data-en') : 'info';
            const sectionNameEs = sectionTitleElement ? sectionTitleElement.getAttribute('data-es') : 'información';
            section.querySelectorAll('.inputs input[type="text"]').forEach(input => {
                // Update placeholder based on the new currentLang
                input.placeholder = currentLang === 'es'
                    ? `Ingresa ${sectionNameEs}`
                    : `Enter ${sectionNameEn}`;
            });
        });
    }
    // Removed event listener for the local .lang-toggle as the element is removed.
    // The page will now rely on localStorage for language setting.
    // const langToggleElement = document.querySelector('.lang-toggle');
    // if (langToggleElement) {
    //     langToggleElement.addEventListener('click', toggleLang);
    // }
    // Initial language setup - this will run on page load and use localStorage
    updateLanguageDisplay();
    // Dynamic Form Sections Logic (from original joinus.html)
    document.querySelectorAll('.form-section').forEach(section => {
        const addBtn = section.querySelector('.add');
        const removeBtn = section.querySelector('.remove');
        const acceptBtn = section.querySelector('.accept-btn');
        const editBtn = section.querySelector('.edit-btn');
        const inputsContainer = section.querySelector('.inputs');
        const sectionTitleElement = section.querySelector('h2');

        // Ensure all elements are found before proceeding
        if (!addBtn || !removeBtn || !acceptBtn || !editBtn || !inputsContainer || !sectionTitleElement) {
            console.warn('Skipping section setup, missing one or more elements:', section);
            return;
        }

        const sectionNameEn = sectionTitleElement.getAttribute('data-en') || 'info';
        const sectionNameEs = sectionTitleElement.getAttribute('data-es') || 'información';

        addBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            const placeholderEn = `Enter ${sectionNameEn}`; // Simpler placeholder
            const placeholderEs = `Ingresa ${sectionNameEs}`;
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

            // Update accept button text to its completed state if defined, or keep as is
            const completedText = acceptBtn.getAttribute(`data-${currentLang}-completed`);
            if (completedText) acceptBtn.textContent = completedText;
        });

        editBtn.addEventListener('click', () => {
            const inputs = inputsContainer.querySelectorAll('input');
            inputs.forEach(inputField => inputField.disabled = false);
            section.classList.remove('completed');
            acceptBtn.style.display = 'inline-block';
            editBtn.style.display = 'none';
            addBtn.disabled = false;
            removeBtn.disabled = false;

            // Restore accept button text to its original state
            const originalText = acceptBtn.getAttribute(`data-${currentLang}`);
            if(originalText) acceptBtn.textContent = originalText;
        });
    });

    // Form Submission Logic (from original joinus.html and main.js)
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert(alertMessages.formSubmitted[currentLang]);

            // Reset basic form fields (name, email, phone, comment)
            joinForm.reset();

            // Reset dynamic sections
            document.querySelectorAll('.form-section').forEach(section => {
                const inputsContainer = section.querySelector('.inputs');
                if (inputsContainer) inputsContainer.innerHTML = ''; // Clear dynamic inputs

                section.classList.remove('completed');
                const acceptBtn = section.querySelector('.accept-btn');
                const editBtn = section.querySelector('.edit-btn');
                const addBtn = section.querySelector('.circle-btn.add');
                const removeBtn = section.querySelector('.circle-btn.remove');

                if (acceptBtn) {
                    acceptBtn.style.display = 'inline-block';
                    const originalText = acceptBtn.getAttribute(`data-${currentLang}`);
                    if(originalText) acceptBtn.textContent = originalText; // Restore original text
                    acceptBtn.disabled = false;
                }
                if (editBtn) editBtn.style.display = 'none';
                if (addBtn) addBtn.disabled = false;
                if (removeBtn) removeBtn.disabled = false;
            });

            // Optionally, close the modal if it's designed to be closable
            // const modalOverlay = document.getElementById('join-modal'); // Assuming this is the ID of the overlay
            // if (modalOverlay) modalOverlay.style.display = 'none';
        });
    }

    // Close button for the modal (if it's part of this standalone page)
    const closeModalButton = document.querySelector('.close-modal');
    const modalOverlay = document.getElementById('join-modal'); // This is the overlay for the joinus/index.html page

    // For the 'X' close button
    if(closeModalButton && modalOverlay) { // closeModalButton is already defined as document.querySelector('.close-modal')
        closeModalButton.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // For clicking outside the .modal-content (i.e., on .modal-overlay itself)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            // Check if the direct target of the click is the overlay itself
            if (event.target === modalOverlay) {
                window.location.href = '../index.html';
            }
        });
    }

    // Floating label logic for "Cuéntanos sobre ti"
    const commentTextarea = document.getElementById('comment');
    if (commentTextarea) {
        const commentWrapper = commentTextarea.closest('.form-field-float-label-wrapper');

        if (commentWrapper) {
            // Function to update label state based on content
            const updateLabelState = () => {
                if (commentTextarea.value) {
                    commentWrapper.classList.add('has-value');
                } else {
                    commentWrapper.classList.remove('has-value');
                }
            };

            // Initial check in case of pre-filled values (e.g., browser auto-fill)
            updateLabelState();

            commentTextarea.addEventListener('focus', () => {
                commentWrapper.classList.add('is-focused');
            });

            commentTextarea.addEventListener('blur', () => {
                commentWrapper.classList.remove('is-focused');
                // Value check on blur is important: if user focuses, types, then clears and blurs.
                updateLabelState();
            });

            commentTextarea.addEventListener('input', updateLabelState);
        }
    }
});
