// js/contact-form-handler.js
document.addEventListener('DOMContentLoaded', () => {
    // This handler is now for the "Contact Us" form which has ID "contact-form"
    const form = document.getElementById('contact-form');
    if (!form) {
        console.warn('Contact form with ID "contact-form" not found by contact-form-handler.js');
        return;
    }

    // The fields "Area of Interest" and "Comments" are already in the HTML for contact-form.
    // No need to dynamically add them here.
    // The original script was adding them, which would be duplicates for contact-form.

    // Apply translations if the function exists (it should be loaded by language-switcher.js)
    // This is useful if any elements within this form need dynamic translation updates,
    // though most translations are handled by data-attributes in the HTML.
    if (window.loadTranslations) {
        // window.loadTranslations(); // This might be too broad if called here,
                                 // language-switcher.js already calls it on load and language change.
                                 // Specific elements within this form could be targeted if needed.
    }

    // Simple form submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
        alert(currentLang === 'es'
            ? '¡Formulario de contacto enviado! Gracias por su interés.'
            : 'Contact form submitted! Thank you for your interest.');
        form.reset(); // Reset the form fields

        // Re-apply placeholder translations if they were cleared by form.reset()
        // or if their text depends on the selected language.
        if (window.loadTranslations) {
            // This ensures placeholders are correctly set after reset, especially if they are language-dependent
            // and language-switcher.js strategy of data-attributes is used.
            // For data-en/data-es placeholders, this might not be strictly necessary if language-switcher handles them globally.
            // However, explicitly calling it for form elements after reset is safer.
            form.querySelectorAll('[data-placeholder-en], [data-placeholder-es]').forEach(el => {
                const lang = currentLang || 'en';
                const placeholderText = el.getAttribute(`data-placeholder-${lang}`);
                if (placeholderText) {
                    el.setAttribute('placeholder', placeholderText);
                }
            });
        }
    });
});
