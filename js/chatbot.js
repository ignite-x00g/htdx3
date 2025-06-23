// js/chatbot.js - Main script for controlling chatbot visibility and loading
document.addEventListener('DOMContentLoaded', () => {
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
    const contactModal = document.getElementById('contact-modal'); // To close it if open

    let chatbotHtmlLoaded = false; // Renamed for clarity
    let chatContainerElement = null; // Renamed for clarity

    // Function to fetch and load chatbot HTML
    async function loadChatbotHTMLOnce() {
        if (!chatbotHtmlLoaded && chatbotPlaceholder) {
            try {
                const response = await fetch('chatbot/chatbot.html');
                if (!response.ok) {
                    throw new Error(`Failed to load chatbot HTML: ${response.statusText}`);
                }
                const html = await response.text();
                chatbotPlaceholder.innerHTML = html;
                chatbotHtmlLoaded = true;
                chatContainerElement = document.getElementById('chat-container');

                if (chatContainerElement) {
                    // Dispatch event for chatbot/chatbot.js to perform its one-time setup
                    document.dispatchEvent(new CustomEvent('chatbotloadedandready'));
                } else {
                    console.error("Chat container element not found after loading HTML.");
                }
                return chatContainerElement;
            } catch (error) {
                console.error('Error loading chatbot HTML:', error);
                if (chatbotPlaceholder) chatbotPlaceholder.innerHTML = '<p>Error loading chatbot. Please try again later.</p>';
                return null;
            }
        }
        return chatContainerElement;
    }

    // Function to open the chatbot
    async function openChatbot() {
        if (contactModal && contactModal.classList.contains('active')) {
            contactModal.classList.remove('active');
        }

        // Ensure HTML is loaded
        const currentChatContainer = await loadChatbotHTMLOnce();

        if (currentChatContainer) {
            currentChatContainer.style.display = 'flex';
            // Dispatch event for chatbot/chatbot.js to prepare for opening (e.g., reset ReCaptcha, focus)
            document.dispatchEvent(new CustomEvent('chatbotopened'));
            // Focusing here might conflict with focus logic inside chatbotopened listener in chatbot.js
            // It's better to let chatbot.js handle its own focus after 'chatbotopened' event.
            // const userInput = document.getElementById('user-input');
            // if (userInput) userInput.focus();
        }
    }

    // Function to close the chatbot
    function closeChatbot() {
        if (chatContainerElement) {
            chatContainerElement.style.display = 'none';
            // Optionally, dispatch a 'chatbotclosed' event if chatbot/chatbot.js needs to react
            // document.dispatchEvent(new CustomEvent('chatbotclosed'));
        }
    }

    // Event listener for the FAB to open/close chatbot
    if (chatbotFab) {
        chatbotFab.addEventListener('click', async (event) => {
            event.stopPropagation();
            // Ensure HTML is loaded before trying to access chatContainerElement's style
            await loadChatbotHTMLOnce();

            if (chatContainerElement && chatContainerElement.style.display === 'none') {
                openChatbot();
            } else {
                closeChatbot();
            }
        });
    }

    // Event listener for clicking outside the chat container OR floating icons to close
    document.addEventListener('click', (event) => {
        const floatingIconsContainer = document.querySelector('.floating-icons');

        // Ensure chatContainerElement is defined (HTML loaded) before checking its style
        if (chatContainerElement && chatContainerElement.style.display !== 'none') {
            const clickedInsideChat = chatContainerElement.contains(event.target);
            const clickedOnFab = chatbotFab ? chatbotFab.contains(event.target) : false;
            // Allow clicks on floating icons without closing the chat
            const clickedInsideFloatingIcons = floatingIconsContainer ? floatingIconsContainer.contains(event.target) : false;

            if (!clickedInsideChat && !clickedOnFab && !clickedInsideFloatingIcons) {
                closeChatbot();
            }
        }
    });

    // Event listener for Escape key to close chatbot
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatContainerElement && chatContainerElement.style.display !== 'none') {
            closeChatbot();
        }
    });

    // Security features (commented out as per previous state, can be enabled if desired)
    // document.addEventListener('contextmenu', event => { /* event.preventDefault(); */ });
    // document.addEventListener('keydown', function(e) { /* ... */ });
});
