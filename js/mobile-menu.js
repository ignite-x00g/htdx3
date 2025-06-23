// js/mobile-menu.js
document.addEventListener('DOMContentLoaded', () => {
    // IDs from index.html:
    // Toggle button: id="mobile-services-toggle"
    // Menu panel: id="mobile-services-panel"
    const servicesToggleButton = document.getElementById('mobile-services-toggle');
    const servicesPanel = document.getElementById('mobile-services-panel');
    const mainSiteHeader = document.querySelector('.site-header'); // Used to manage z-index

    if (servicesToggleButton && servicesPanel) {
        servicesToggleButton.addEventListener('click', () => {
            const isOpen = servicesPanel.classList.toggle('open');
            servicesToggleButton.setAttribute('aria-expanded', String(isOpen));

            // Update icon inside the button: assuming the button contains an <i> element for the icon
            const icon = servicesToggleButton.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            // The text content of the button ("Services") should remain, only icon changes.
            // The original script changed innerHTML to &times; or ☰ which would remove the text.

            if(mainSiteHeader) {
                // Ensure header doesn't overlap the open menu if it has a lower z-index
                // Or, ensure menu is above header. Adjust as per actual CSS.
                // For now, this z-index adjustment might not be necessary if panel is positioned correctly.
                // Let's comment it out unless visual testing shows it's needed.
                // mainSiteHeader.style.zIndex = isOpen ? '999' : ''; // Lower than panel if panel is e.g. 1000+
            }
        });

        // If clicking a link/button inside the services panel should close it
        servicesPanel.querySelectorAll('button, a').forEach(item => {
            item.addEventListener('click', () => {
                if (servicesPanel.classList.contains('open')) {
                    servicesPanel.classList.remove('open');
                    servicesToggleButton.setAttribute('aria-expanded', 'false');
                    const icon = servicesToggleButton.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    // if(mainSiteHeader) mainSiteHeader.style.zIndex = '';
                }
            });
        });

        // The languageChanged event listener that changed button innerHTML might be problematic
        // if the button also contains text like "Services".
        // The icon should change, not the whole button content.
        // Let's assume the icon is handled as above and this event is not needed to change the toggle icon itself based on language.
        // document.addEventListener('languageChanged', () => {
        //     const icon = servicesToggleButton.querySelector('i');
        //     if (icon) {
        //         if (servicesPanel.classList.contains('open')) {
        //             icon.classList.remove('fa-bars');
        //             icon.classList.add('fa-times');
        //         } else {
        //             icon.classList.remove('fa-times');
        //             icon.classList.add('fa-bars');
        //         }
        //     }
        // });

    } else {
        if (!servicesToggleButton) console.warn("Mobile services toggle button (#mobile-services-toggle) not found.");
        if (!servicesPanel) console.warn("Mobile services panel (#mobile-services-panel) not found.");
    }
});
