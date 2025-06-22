// Scripts for Contact Us Modal

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const contactModal = document.getElementById('contact-modal'); // Ensure this is the correct ID

    // Language-specific messages (can be expanded or fetched from a global config)
    const alertMessages = {
        contactThankYou: {
            en: "Thank you for contacting us! We will get back to you soon.",
            es: "¡Gracias por contactarnos! Nos pondremos en contacto contigo pronto."
        }
    };

    let currentLang = localStorage.getItem('language') || 'en'; // Get current language

    // Update language if needed (e.g. on a global language change event)
    // For now, we assume currentLang is correctly set when this script runs.
    // document.body.addEventListener('languageChanged', (event) => {
    // currentLang = event.detail.lang;
    // });


    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Determine which language to use for the alert
            const message = alertMessages.contactThankYou[currentLang] || alertMessages.contactThankYou['en'];
            alert(message);

            contactForm.reset();

            if (contactModal) {
                contactModal.classList.remove('active'); // Hide the modal
            }
        });
    }

    // Add any other JS logic specific to the Contact Us modal here.
    // For example, custom validation, character counters, etc.

    // Example: Specific validation for contact number (if different from global or other forms)
    const contactNumberInput = document.getElementById('contact-number');
    if (contactNumberInput) {
        contactNumberInput.addEventListener('input', () => {
            // Custom validation logic for contact number
            // console.log('Contact number changed:', contactNumberInput.value);
        });
    }
});
