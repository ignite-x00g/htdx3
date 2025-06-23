// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Modal opening logic for "Join Us" (fabJoin button) is now handled by dynamic-modal-manager.js
    // because #fab-join has the 'data-modal-target="join-us-modal"' attribute.
    // The ID in HTML is "join-us-modal", not "join-modal". This was a point of confusion.
    // dynamic-modal-manager.js will correctly pick up #fab-join and open #join-us-modal.
    // No specific modal opening code is needed here anymore.

    // Add submit handler for the "Join Us" form
    const joinForm = document.getElementById('join-form'); // This is inside #join-us-modal
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';
            alert(currentLang === 'es'
                ? '¡Formulario de Únete enviado! Gracias por tu interés.'
                : 'Join Us form submitted! Thank you for your interest.');
            joinForm.reset();
            // Re-apply placeholders if needed, similar to contact-form-handler
            joinForm.querySelectorAll('[data-placeholder-en], [data-placeholder-es]').forEach(el => {
                const lang = currentLang || 'en';
                const placeholderText = el.getAttribute(`data-placeholder-${lang}`);
                if (placeholderText) {
                    el.setAttribute('placeholder', placeholderText);
                }
            });
        });
    }
});
