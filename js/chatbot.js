// js/chatbot.js - Merged from chatbot/script.js and original js/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    // Elements from original chatbot/script.js (now integrated into index.html)
    const chatMessages = document.getElementById('chat-messages'); // Corrected ID
    const userInput = document.getElementById('user-input'); // Corrected ID
    const sendButton = document.getElementById('send-button'); // Corrected ID
    const recaptchaPlaceholder = document.getElementById('recaptcha-placeholder');
    const honeypotField = document.getElementById('honeypot-field');
    const chatContainer = document.getElementById('chat-container'); // This is the main chatbot UI container

    // Elements from original js/chatbot.js (some might be redundant or need aliasing)
    // const chatbotToggle = document.getElementById('chatbot-icon-toggle'); // This will be the new FAB
    // const chatbotUi = document.getElementById('chatbot-ui'); // This is now chatContainer
    const chatbotCloseButtonMain = document.getElementById('chatbot-close-button-main'); // Close button in the new integrated chat header

    // Reference to the contact modal (assuming its ID is 'contact-modal')
    const contactModal = document.getElementById('contact-modal');

    let recaptchaVerified = false;

    // Function to close the chatbot (modified from original js/chatbot.js)
    function closeChatbot() {
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
        // If there was an "open chatbot" button that was hidden, show it again.
        // const openChatbotButton = document.getElementById('open-chatbot-button'); // Example ID
        // if (openChatbotButton) {
        //     openChatbotButton.style.display = 'block'; // Or 'inline', 'flex', etc.
        // }
    }

    // Placeholder for FAB - to be created in index.html
    // const openChatbotButton = document.getElementById('open-chatbot-fab'); // Example ID for a FAB
    // if (openChatbotButton) {
    //     openChatbotButton.addEventListener('click', openChatbot);
    // }


    // Event listener for the main close button inside the chat header
    if (chatbotCloseButtonMain) {
        chatbotCloseButtonMain.addEventListener('click', closeChatbot);
    }

    // Simulate ReCaptcha (from chatbot/script.js)
    function simulateRecaptcha() {
        if (!recaptchaPlaceholder || !userInput || !sendButton) return; // Ensure elements exist

        recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Click to verify (simulated)</em>';
        recaptchaPlaceholder.style.cursor = 'pointer';
        recaptchaPlaceholder.onclick = () => {
            recaptchaVerified = true;
            recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Verified! (simulated)</em>';
            recaptchaPlaceholder.style.color = 'green';
            recaptchaPlaceholder.onclick = null; // Prevent re-clicking
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        };
    }

    // Honeypot field check (from chatbot/script.js)
    if (honeypotField && userInput && sendButton) { // Ensure elements exist
        honeypotField.addEventListener('input', () => {
            if (honeypotField.value !== '') {
                console.warn('Honeypot triggered! Possible bot activity.');
                alert('Chat disabled due to suspicious activity.');
                userInput.disabled = true;
                sendButton.disabled = true;
                userInput.placeholder = 'Chat disabled.';
            }
        });
    }

    // Function to add a message to the chat window (from chatbot/script.js, ensures correct class names)
    function addMessageToChat(text, sender) { // Renamed to avoid conflict if any other addMessage exists
        if (!chatMessages || !text || !text.trim()) return; // Guard against chatMessages not being found and empty text

        const messageDiv = document.createElement('div');
        // Using class names consistent with chatbot/style.css
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text; // Basic sanitization - prefer more robust methods for production
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    // Event listener for the send button (from chatbot/script.js's handleSendMessage)
    async function handleSendMessage() {
        if (!userInput || !chatContainer || !sendButton) return; // Ensure elements exist

        const userText = userInput.value.trim();

        if (honeypotField && honeypotField.value !== '') {
            alert('Cannot send message. Chat disabled due to suspicious activity.');
            return;
        }

        if (chatContainer.style.display === 'none') {
            // This case should ideally not happen if send button is part of the container
            alert('Chat is not active.');
            return;
        }
        if (!recaptchaVerified) {
            alert('Please complete the ReCaptcha verification first.');
            return;
        }

        if (userText === '') {
            return;
        }

        addMessageToChat(userText, 'user'); // Use the correctly scoped addMessage
        userInput.value = '';
        userInput.focus();

        sendButton.disabled = true; // Disable send button while waiting for reply
        // Simulate AI response (for basic UI testing)
        setTimeout(async () => {
            try {
                // Placeholder for actual API call to Cloudflare Worker or other backend
                const botReply = "This is a simulated response from the AI. Cloudflare integration is pending.";
                addMessageToChat(botReply, 'bot'); // Use the correctly scoped addMessage
            } catch (error) {
                console.error("Error fetching AI response:", error);
                addMessageToChat("Sorry, I couldn't connect to the AI. Please try again later.", 'bot');
            } finally {
                sendButton.disabled = false; // Re-enable send button
            }
        }, 1000);
    }

    if (sendButton) sendButton.addEventListener('click', handleSendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission if wrapped in a form
                handleSendMessage();
            }
        });
    }

    // Event listener for clicking outside the chat container to close
    document.addEventListener('click', (event) => {
        if (chatContainer && chatContainer.style.display !== 'none') {
            // Check if the click is outside the chatContainer
            // And also not on the button that opens the chat (if such a button exists and should be ignored)
            // const openChatButton = document.getElementById('open-chatbot-fab'); // Example FAB ID
            // if (openChatButton && openChatButton.contains(event.target)) {
            //     return; // Don't close if clicking the open button itself
            // }
            if (!chatContainer.contains(event.target)) {
                // This logic needs refinement: if a FAB is used to open, clicking the FAB
                // should not immediately close the chat if the chat is already open.
                // This will be handled when FAB is implemented. For now, any click outside closes.
                // A common pattern is to check if event.target is the FAB itself.
                // Let's assume for now the FAB is separate and this logic is fine.

                // Check if the click is on the FAB itself
                const fab = document.getElementById('chatbot-fab'); // Assuming FAB has this ID
                if (fab && fab.contains(event.target)) {
                    return; // Do nothing if clicking the FAB
                }
                closeChatbot();
            }
        }
    });


    // Event listener for Escape key to close chatbot (from original js/chatbot.js, adapted)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatContainer && chatContainer.style.display !== 'none') {
            closeChatbot();
        }
    });

    // Security: Basic anti-cloning / context menu prevention (from chatbot/script.js inline)
    document.addEventListener('contextmenu', event => {
        // Consider if this is too broad. Maybe only prevent on chat container?
        // For now, applying globally as in original script.
        // event.preventDefault(); // Temporarily disable if it interferes with development
    });

    document.addEventListener('keydown', function(e) {
        // Basic protection against common shortcuts for viewing source or saving page
        if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'c' || e.key === 'a')) {
            // e.preventDefault(); // Temporarily disable
            // console.warn('Operation prevented by security policy.');
        }
        // Basic protection against F12 developer tools
        if (e.key === 'F12') {
            // e.preventDefault(); // Temporarily disable
            // console.warn('Developer tools access prevented.');
        }
    });

    // Initial greeting (optional, can be refined)
    // Check if chatMessages is empty when chatContainer becomes visible
    // This is a bit more complex with the new structure, might need an observer or specific call in openChatbot
    // For simplicity, let's assume no automatic greeting for now, or it's added by openChatbot.
    // If openChatbot is called, and chatMessages is empty, then add greeting.
    // This was previously tied to chatbotUi.style.display === 'flex'
    // Let's refine openChatbot to handle this:
    function openChatbot() {
        // ... (existing openChatbot code) ...
        if (contactModal && contactModal.classList.contains('active')) {
            contactModal.classList.remove('active');
        }

        if (chatContainer) {
            chatContainer.style.display = 'flex';
            if (chatMessages && chatMessages.children.length === 0) { // Check if messages area is empty
                 setTimeout(() => { // Add a slight delay for effect
                    addMessageToChat('Hello! How can I help you today?', 'ai');
                }, 500);
            }
        }

        if (userInput && sendButton) {
            userInput.disabled = true;
            sendButton.disabled = true;
            simulateRecaptcha();
        }
        if (userInput) {
             userInput.focus();
        }
    }

    // The actual FAB button needs to be added to index.html
    // For now, let's assume a button with id="chatbot-fab" will exist
    const fabButton = document.getElementById('chatbot-fab'); // This ID needs to be created in HTML
    if (fabButton) {
        fabButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling to the document listener
            if (chatContainer && chatContainer.style.display === 'none') {
                openChatbot();
            } else {
                // If chat is open and FAB is clicked, standard behavior might be to do nothing or toggle.
                // For now, let's assume clicking FAB when open does nothing, or it's a toggle.
                // If it's a toggle:
                // closeChatbot();
                // If it should only open: handled by the condition above.
            }
        });
    }

    // Call initializeChat if it had any specific setup logic, though most is event-driven now.
    // initializeChat(); // from chatbot/script.js - seems to be empty, so can be omitted.
});
