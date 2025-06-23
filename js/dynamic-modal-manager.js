// js/dynamic-modal-manager.js
document.addEventListener('DOMContentLoaded', () => {
    // The main backdrop for all modals, defined in index.html
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Helper to find focusable elements
    function getFocusableElements(parent) {
        if (!parent) return [];
        return Array.from(
            parent.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter(el => el.offsetParent !== null && !el.closest('[style*="display: none"]'));
    }
    window.getFocusableElements = getFocusableElements; // Make it globally available if needed by other scripts

    // Function to show a modal
    function showModal(modal, triggerElement) {
        if (!modal || !modalBackdrop) return;

        modal.style.display = 'flex'; // Assuming modals are flex containers for centering content
        modalBackdrop.style.display = 'block'; // Show the backdrop
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        modal.triggerElement = triggerElement; // Store the trigger for focus return

        // Focus management: focus the first focusable element in the modal
        const focusable = getFocusableElements(modal);
        if (focusable.length > 0) {
            focusable[0].focus();
        } else {
            modal.setAttribute('tabindex', '-1'); // Make modal focusable if no elements are
            modal.focus();
        }
    }

    // Function to hide a modal
    function hideModal(modal) {
        if (!modal || !modalBackdrop) return;

        modal.style.display = 'none';
        // Check if any other modal is still open before hiding the backdrop
        const anyModalOpen = document.querySelector('.modal-overlay[style*="display: flex"], .modal-overlay[style*="display: block"]');
        if (!anyModalOpen) {
            modalBackdrop.style.display = 'none';
            document.body.style.overflow = ''; // Restore background scrolling
        }

        // Return focus to the element that triggered the modal
        if (modal.triggerElement && typeof modal.triggerElement.focus === 'function') {
            modal.triggerElement.focus();
        }
    }
    window.hideModal = hideModal; // Make hideModal globally accessible if needed

    // Attach modal open logic to triggers
    // HTML uses `data-modal-target` (e.g., on FABs, service nav items, mobile chat link)
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-target');
            if (!modalId) return;
            const modal = document.getElementById(modalId);
            if (modal) {
                showModal(modal, trigger);
            } else {
                console.warn(`Modal with ID "${modalId}" not found.`);
            }
        });
    });

    // Attach close logic to close buttons within modals
    // HTML uses `data-close-modal` on close buttons (e.g., <button class="close-modal" data-close-modal="join-us-modal">)
    // Also, the class "close-modal" is on these buttons.
    document.querySelectorAll('[data-close-modal], .close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // The value of data-close-modal is the ID of the modal it's supposed to close.
            // Or, find the closest .modal-overlay parent.
            const modalId = closeBtn.getAttribute('data-close-modal');
            let modalToClose;
            if (modalId) {
                modalToClose = document.getElementById(modalId);
            } else {
                modalToClose = closeBtn.closest('.modal-overlay');
            }

            if (modalToClose) {
                hideModal(modalToClose);
            } else {
                console.warn('Could not find modal to close for button:', closeBtn);
            }
        });
    });

    // Global ESC key to close the topmost open modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Find all visible modals
            const openModals = Array.from(document.querySelectorAll('.modal-overlay[style*="display: flex"], .modal-overlay[style*="display: block"]'));
            if (openModals.length > 0) {
                // Hide the last one in DOM order, assuming it's the topmost
                // A more robust way might involve z-index or an active class, but this is simpler.
                hideModal(openModals[openModals.length - 1]);
            }
        }
    });

    // Optional: Click on backdrop to close modal (if desired)
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (event) => {
            // If the click is directly on the backdrop (not its children / the modal content)
            if (event.target === modalBackdrop) {
                const openModals = Array.from(document.querySelectorAll('.modal-overlay[style*="display: flex"], .modal-overlay[style*="display: block"]'));
                if (openModals.length > 0) {
                    hideModal(openModals[openModals.length - 1]); // Close the current "active" modal
                }
            }
        });
    }
});
