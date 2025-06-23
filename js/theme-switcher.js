// js/theme-switcher.js
document.addEventListener('DOMContentLoaded', () => {
    const desktopThemeToggle = document.getElementById('theme-toggle-button');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle'); // Added for mobile
    const body = document.body;

    function updateButtonText(theme) {
        const buttonText = theme === 'light' ? 'Light' : 'Dark';
        // The mobile button also has data-en/es attributes for its text "Light/Claro"
        // This script primarily controls the theme name display.
        // Language switcher will handle its data-en/es translation.
        if (desktopThemeToggle) {
            desktopThemeToggle.textContent = buttonText;
        }
        if (mobileThemeToggle) {
            // For mobile, we want to ensure the text reflects the current theme state,
            // similar to the desktop. Language switcher will translate "Light" or "Dark".
            // Let's assume its data-en/data-es are "Light"/"Claro" and "Dark"/"Oscuro"
            // This setTheme function should set its English base text, then lang switcher handles translation.
             mobileThemeToggle.textContent = buttonText;
             // If mobile button has data-en/es like data-en="Light", data-es="Claro" for its state
             // we need to update these if they are meant to be dynamic, or ensure lang switcher picks up textContent.
             // For now, setting textContent is fine, lang switcher will translate this text if it has matching data-en/es.
        }
    }

    function setTheme(theme) {
        body.classList.remove('light-theme', 'dark-theme');
        if (theme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.add('dark-theme');
        }
        localStorage.setItem('theme', theme);
        updateButtonText(theme); // Update text on both buttons

        // Dispatch an event for language switcher to potentially re-translate button text
        // if the button text itself ("Light", "Dark") is translatable.
        // The mobile button has data-en="Light" data-es="Claro".
        // The desktop button's text is set directly.
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));

    }

    function toggleTheme() {
        const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        setTheme(newTheme);
    }

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme); // Apply initial theme and update button texts

    // Attach event listeners
    if (desktopThemeToggle) {
        desktopThemeToggle.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for language changes to re-translate theme button text if necessary
    // This is for the case where "Light" / "Dark" text on buttons is translatable
    // via data-en/data-es attributes on the buttons themselves.
    document.addEventListener('languageChanged', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        updateButtonText(currentTheme); // Update text based on current theme

        // Specifically for mobile toggle, re-apply its own translation from data-en/es
        if (mobileThemeToggle && window.getCurrentLanguage) {
            const lang = window.getCurrentLanguage();
            const mobileText = mobileThemeToggle.getAttribute(`data-${lang === 'en' ? 'en' : 'es'}`);
            // This assumes the mobile button's data-en/es *is* "Light"/"Claro" or "Dark"/"Oscuro"
            // The current HTML for mobile toggle is: <button ... id="mobile-theme-toggle" data-en="Light" data-es="Claro">Light</button>
            // So its data-en/es are the states, not the action.
            // The `updateButtonText` function sets the correct English state ("Light" or "Dark").
            // Then, the main language switcher's `applyTranslations` should handle translating this text if the mobile button
            // has `data-en="Light"` and `data-en="Dark"` corresponding to these states.
            // The current HTML for mobile theme toggle is:
            // <button class="mobile-nav-item" id="mobile-theme-toggle" data-en="Light" data-es="Claro">Light</button>
            // This setup is slightly problematic if "Dark" is also a state.
            // Let's assume updateButtonText sets the correct English text, and language switcher handles its translation based on that.
            // The language switcher will iterate all [data-en] elements.
            // If mobileThemeToggle.textContent is "Light", and it has data-en="Light" data-es="Claro", it will be translated.
            // If mobileThemeToggle.textContent is "Dark", and it has data-en="Dark" data-es="Oscuro", it will be translated.
            // So, the mobileThemeToggle needs both sets of data attributes if its text changes between "Light" and "Dark".

            // Let's simplify: the updateButtonText sets the textContent.
            // The language switcher will find this button if its textContent matches one of its data-xx attributes.
            // This is already handled by applyTranslations in language-switcher.js.
        }
    });
});
