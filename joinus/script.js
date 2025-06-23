// Set your desired language here: 'en' or 'es'
let currentLang = 'en';

// Language update for all data-en/data-es elements and select/option placeholders
function updateLang() {
  document.querySelectorAll('[data-en]').forEach(el => {
    // Check if the element is part of the collapsible interest section, handle separately if needed
    const parentInterestSection = el.closest('.interest-section-collapsible');
    if (parentInterestSection && el.tagName !== 'H4' && !el.classList.contains('collapsible-header-title')) { // H4 is the header, don't change its text content here
         // For checkboxes and their labels inside collapsible
        if (el.tagName === 'LABEL' || (el.tagName === 'SPAN' && !el.classList.contains('collapsible-arrow'))) {
             el.textContent = el.getAttribute(`data-${currentLang}`);
        }
    } else if (el.tagName !== 'TITLE' && !el.closest('.collapsible-checkbox-content')) { // Avoid touching title and checkbox labels again
      el.textContent = el.getAttribute(`data-${currentLang}`);
    }
  });

  // Update page title separately
  const pageTitleTag = document.querySelector('title[data-en]');
  if (pageTitleTag) {
      document.title = pageTitleTag.getAttribute(`data-${currentLang}`);
  }

  // Interest dropdown options (original code, will be adapted for checkboxes)
  // This part needs to be changed when interest-select is replaced by checkboxes
  document.querySelectorAll('#interest-select option').forEach(opt => { // KEEPING FOR NOW, will be removed/changed in step 4
    opt.textContent = opt.getAttribute(`data-${currentLang}`) || opt.textContent;
  });

  // Update label for textarea
  let aboutLabel = document.querySelector('.about-section label');
  if (aboutLabel) aboutLabel.textContent = aboutLabel.getAttribute(`data-${currentLang}`);
  // Update placeholder for textarea
  let aboutTextarea = document.getElementById('about-textarea');
  if (aboutTextarea) {
    aboutTextarea.placeholder = currentLang === 'es'
      ? 'Escribe una breve introducción sobre ti.'
      : 'Write a short introduction about you.';
  }
  // Section input placeholders
  document.querySelectorAll('.form-section').forEach(section => {
    const sectionH2 = section.querySelector('h2');
    if (sectionH2) {
        const sectionName = sectionH2.getAttribute(`data-${currentLang}`);
        section.querySelectorAll('.inputs input').forEach(input => {
          input.placeholder = currentLang === 'es'
            ? `Ingrese ${sectionName}`
            : `Enter ${sectionName} info`;
        });
    }
  });

  // Update texts for the new collapsible interest section (will be fully handled in step 4)
  const interestHeaderTitle = document.querySelector('.collapsible-header-title');
  if (interestHeaderTitle) {
    interestHeaderTitle.textContent = interestHeaderTitle.getAttribute(`data-${currentLang}`);
  }
  document.querySelectorAll('.collapsible-checkbox-content label').forEach(label => {
    label.textContent = label.getAttribute(`data-${currentLang}`);
  });

}

// Initialize all add/remove/accept/edit handlers and auto-sample input
document.querySelectorAll('.form-section').forEach(section => {
  const addBtn = section.querySelector('.add');
  const removeBtn = section.querySelector('.remove');
  const acceptBtn = section.querySelector('.accept-btn');
  const editBtn = section.querySelector('.edit-btn');
  const inputsContainer = section.querySelector('.inputs');
  const sectionH2 = section.querySelector('h2');

  if (!addBtn || !removeBtn || !acceptBtn || !editBtn || !inputsContainer || !sectionH2) {
    console.warn("Skipping section setup, missing elements in: ", section);
    return;
  }
  const sectionNameEn = sectionH2.getAttribute('data-en'); // Always use EN as base

  addBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    const currentSectionNameInLang = sectionH2.getAttribute(`data-${currentLang}`);
    input.placeholder = currentLang === 'es'
      ? `Ingrese ${currentSectionNameInLang}`
      : `Enter ${currentSectionNameInLang} info`;
    // Add a sample value for demo
    // input.value = currentLang === 'es'
    //   ? (sectionNameEn === 'Skills' ? 'Liderazgo' : sectionNameEn === 'Education' ? 'Universidad Central' : '')
    //   : (sectionNameEn === 'Skills' ? 'Leadership' : sectionNameEn === 'Education' ? 'Central University' : '');
    inputsContainer.appendChild(input);
    // updateLang(); // Update placeholder in new input - this might be too broad, handled by specific placeholder setting
  });

  removeBtn.addEventListener('click', () => {
    const inputs = inputsContainer.querySelectorAll('input');
    if (inputs.length > 0) {
      inputsContainer.removeChild(inputs[inputs.length - 1]);
    }
  });

  acceptBtn.addEventListener('click', () => {
    const inputs = inputsContainer.querySelectorAll('input');
    if (inputs.length === 0) {
      alert(currentLang === 'es'
        ? `Agregue al menos una entrada de ${sectionH2.getAttribute('data-es')} antes de aceptar.`
        : `Please add at least one ${sectionH2.getAttribute('data-en')} entry before accepting.`);
      return;
    }
    inputs.forEach(input => input.disabled = true);
    section.classList.add('completed');
    acceptBtn.style.display = 'none';
    editBtn.style.display = 'inline-block';
  });

  editBtn.addEventListener('click', () => {
    const inputs = inputsContainer.querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
    section.classList.remove('completed');
    acceptBtn.style.display = 'inline-block';
    editBtn.style.display = 'none';
  });
});

// Submit handler
const joinForm = document.getElementById('join-form');
if (joinForm) {
    joinForm.onsubmit = function(e) {
        e.preventDefault();
        alert(currentLang === 'es'
          ? "¡Formulario enviado! (Esto es una demostración, los datos están listos para enviar)."
          : "Form submitted! (This is a demo, data is ready to send.)"
        );
        // Here you would collect and process the data, e.g. send to server or display summary
    };
}

// Close modal button functionality (from new HTML)
const closeModalButton = document.querySelector('.close-modal');
const modalOverlay = document.getElementById('join-modal');

if (closeModalButton && modalOverlay) {
    closeModalButton.onclick = function() { // Changed to direct assignment from new HTML
        modalOverlay.style.display = 'none';
    };
}


// Call once on page load
// Ensure this is called after DOM is ready, or wrap in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    updateLang();

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

    // Language update needs to handle the new collapsible section title and checkbox labels correctly
    // The updateLang function was already modified to query for these new elements.
    // Ensure that the initial call to updateLang() correctly sets the text for these elements.

    // Example: switch to Spanish after 1 second for demo:
    // setTimeout(() => { currentLang = 'es'; updateLang(); }, 1000);
    // Any other JS that needs to run on load and depends on the DOM for this page
});

// Note: The `updateLang` function in the provided script directly manipulates textContent.
// It was slightly adjusted to better handle the page title and avoid conflicts with
// elements that might be dynamically added or have complex structures like the planned collapsible section.
// The logic for updating #interest-select options will be revised in step 4.
// The sample value logic in addBtn was commented out as it's for demo purposes.
// Ensured form submission and modal close are attached to existing elements.
// Wrapped initial updateLang call in DOMContentLoaded.
