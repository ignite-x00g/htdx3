// Scripts for Join Us Modal in index.html

document.addEventListener('DOMContentLoaded', function() {
    const joinModal = document.getElementById('join-modal'); // The modal in index.html
    const joinForm = joinModal ? joinModal.querySelector('form') : null; // Assuming the form inside #join-modal has id 'join-form' as per index.html

    // Language-specific messages
    const alertMessages = {
        formSubmitted: { // Using the generic one from main.js, or define specific if needed
            en: "Form submitted.",
            es: "Formulario enviado."
        }
        // Add other specific messages for this modal if any
    };

    let currentLang = localStorage.getItem('language') || 'en';

    // Event listener for language change (if this modal needs to react to it)
    // document.body.addEventListener('languageChanged', (event) => {
    //     currentLang = event.detail.lang;
    //     // Update any text specific to this modal if not handled by global updateLanguageDisplay
    // });

    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const message = alertMessages.formSubmitted[currentLang] || alertMessages.formSubmitted['en'];
            alert(message);

            joinForm.reset();

            if (joinModal) {
                joinModal.classList.remove('active'); // Hide the modal
            }
        });
    }

    // The #join-modal in index.html is simple: Name, Email, Contact, Date, Time, Resume, Cover Letter, Comment.
    // It does not currently use the dynamic .form-section, .circle-btn, .accept-btn, .edit-btn logic
    // that was present in the standalone joinus.html page (now joinus/index.html).
    // Therefore, that complex JS logic is NOT included here.
    // If the #join-modal in index.html were to be enhanced to include those dynamic sections,
    // the relevant JS from joinus/script.js would need to be adapted and included here.

    // For example, if the "Upload Your Resume" or "Upload Your Cover Letter" fields needed
    // specific client-side validation or handling for this modal:
    const resumeInput = document.getElementById('join-resume');
    if (resumeInput) {
        resumeInput.addEventListener('change', () => {
            // Handle resume file selection if needed
            // console.log('Resume file selected:', resumeInput.files[0] ? resumeInput.files[0].name : 'No file selected');
        });
    }

    const coverLetterInput = document.getElementById('join-cover');
    if (coverLetterInput) {
        coverLetterInput.addEventListener('change', () => {
            // Handle cover letter file selection
            // console.log('Cover letter file selected:', coverLetterInput.files[0] ? coverLetterInput.files[0].name : 'No file selected');
        });
    }
});
