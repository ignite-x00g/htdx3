// js/language-switcher.js
document.addEventListener('DOMContentLoaded', () => {
    const desktopLangToggle = document.getElementById('language-toggle-button'); // For header
    const mobileLangToggle = document.getElementById('mobile-language-toggle'); // For mobile nav
    let currentLanguage = localStorage.getItem('language') || 'en'; // Default to English

    function applyTranslations(language) {
        // Update text content for elements with data-en/data-es attributes
        document.querySelectorAll('[data-en], [data-es]').forEach(el => {
            const text = el.getAttribute(`data-${language}`);
            if (text) {
                // Preserve child elements like <i> tags if they exist, only change text nodes.
                let firstChild = el.firstChild;
                if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
                    firstChild.nodeValue = text;
                } else if (el.tagName === 'INPUT' || el.tagName === 'BUTTON' || el.tagName === 'OPTION' || !el.children.length) {
                     // For buttons, options, or elements that typically don't have mixed content, set innerHTML or textContent.
                     // For select options, textContent is better. For buttons, innerHTML to support icons, but here we have data attributes on button text.
                    if(el.tagName === 'OPTION') el.textContent = text;
                    else if(el.matches('button') && el.querySelector('i')) {
                        // If button has an icon, only change the text node part if it exists.
                        // Assuming text is usually the last child or inside a span.
                        // This part might need refinement based on exact HTML of buttons needing translation.
                        // For now, let's assume data-en/es is on a span inside or the button itself if no icon.
                        // The current HTML has text directly in buttons or spans.
                        let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
                        if(textNode) textNode.textContent = text; else el.innerHTML = text; // Fallback if no distinct text node
                    } else {
                        el.innerHTML = text; // General case
                    }
                } else { // Element has children, be more careful
                    // This case is tricky if translation applies to text around child elements.
                    // For simplicity, if element has children and data-en/es, assume the attribute is for the main text node.
                    // A more robust solution would be to wrap translatable text parts in <span> tags.
                    // The current HTML structure seems to mostly have direct text or spans for FABs.
                    let textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "");
                    if(textNode) textNode.textContent = text;
                    // If no direct text node, it might be a span like in FABs
                    else if (el.querySelector('span[data-en], span[data-es]')) {
                         // This case is handled by the querySelectorAll itself if spans also have data-en/es
                    }
                }
            }
        });

        // Update placeholders for input/textarea elements
        document.querySelectorAll('[data-placeholder-en], [data-placeholder-es]').forEach(el => {
            const placeholderText = el.getAttribute(`data-placeholder-${language}`);
            if (placeholderText) {
                el.setAttribute('placeholder', placeholderText);
            }
        });

        // Update ARIA labels if needed (example, could add data-aria-label-en/es)
        // document.querySelectorAll('[data-aria-label-en], [data-aria-label-es]').forEach(el => {
        //     const ariaLabelText = el.getAttribute(`data-aria-label-${language}`);
        //     if (ariaLabelText) {
        //         el.setAttribute('aria-label', ariaLabelText);
        //     }
        // });

        // Update language toggle button texts
        updateLangToggleButtonsText(language);
    }

    function updateLangToggleButtonsText(language) {
        const nextLang = language === 'en' ? 'ES' : 'EN';
        const nextLangAria = language === 'en' ? 'Cambiar a español' : 'Switch to English';
        if (desktopLangToggle) {
            desktopLangToggle.textContent = nextLang;
            desktopLangToggle.setAttribute('aria-label', nextLangAria);
        }
        if (mobileLangToggle) {
            mobileLangToggle.textContent = nextLang;
            mobileLangToggle.setAttribute('aria-label', nextLangAria);
             // The mobile toggle also has data-en/es itself for "ES" / "EN" text,
             // but its primary text should be what it switches TO.
             // The HTML for mobile toggle is <button ... data-en="ES" data-es="EN">ES</button>
             // This means its visible text is also its current state indicator.
             // The applyTranslations function would handle its data-en/es if it's meant to show current lang.
             // Let's clarify: The button should show what it *will switch to*.
             // So if current is 'en', button shows 'ES'. If current is 'es', button shows 'EN'.
             // The data-en/es attributes on the button itself were for its own text if it were static.
             // The code above correctly sets textContent to nextLang.
        }
    }

    function toggleLanguage() {
        currentLanguage = (currentLanguage === 'en' ? 'es' : 'en');
        localStorage.setItem('language', currentLanguage);
        applyTranslations(currentLanguage);
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
    }

    // Set initial language
    applyTranslations(currentLanguage);

    // Add event listeners to toggle buttons
    if (desktopLangToggle) {
        desktopLangToggle.addEventListener('click', toggleLanguage);
    }
    if (mobileLangToggle) {
        mobileLangToggle.addEventListener('click', toggleLanguage);
    }

    // Expose functions for other scripts if needed (e.g., for forms to re-translate on reset)
    window.getCurrentLanguage = function() {
        return currentLanguage;
    };
    // loadTranslations is effectively applyTranslations now
    window.loadTranslations = function() { // Keep this name if other scripts use it
        applyTranslations(currentLanguage);
    };
});
