// js/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-icon-toggle');
    const chatbotUi = document.getElementById('chatbot-ui');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Function to open the chatbot
    function openChatbot() {
        if (chatbotUi) {
            chatbotUi.style.display = 'flex'; // Or 'block' depending on modal styling
            // Focus on the input field when chat opens
            if (chatbotInput) {
                chatbotInput.focus();
            }
        }
    }

    // Function to close the chatbot
    function closeChatbot() {
        if (chatbotUi) {
            chatbotUi.style.display = 'none';
        }
    }

    // Event listener for the chatbot toggle icon
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', openChatbot);
    }

    // Event listener for the chatbot close button
    if (chatbotCloseButton) {
        chatbotCloseButton.addEventListener('click', closeChatbot);
    }

    // Event listener for clicking outside the modal content to close (optional, but good UX)
    if (chatbotUi) {
        chatbotUi.addEventListener('click', (event) => {
            if (event.target === chatbotUi) { // If click is on the overlay itself
                closeChatbot();
            }
        });
    }

    // Event listener for Escape key to close chatbot
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatbotUi && chatbotUi.style.display !== 'none') {
            closeChatbot();
        }
    });

    // Function to add a message to the chat window
    function addMessage(text, sender) {
        if (!chatbotMessages || !text.trim()) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender); // sender will be 'user' or 'ai'
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);

        // Scroll to the bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Event listener for the send button
    if (chatbotSendButton && chatbotInput) {
        chatbotSendButton.addEventListener('click', () => {
            const messageText = chatbotInput.value;
            if (messageText) {
                addMessage(messageText, 'user');
                chatbotInput.value = ''; // Clear input

                // Simulate AI response (for basic UI testing)
                setTimeout(() => {
                    addMessage('Thanks for your message! An AI agent will be with you shortly.', 'ai');
                }, 1000);
            }
        });

        // Allow sending message with Enter key
        chatbotInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                chatbotSendButton.click();
            }
        });
    }

    // Initial greeting from AI when chat opens for the first time (optional)
    // This could also be triggered by openChatbot if we add a flag for first open
    // For now, let's add a simple greeting if the chat is empty when opened.
    if (chatbotToggle) { // Re-using toggle check to ensure this runs if chatbot elements are present
         const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (chatbotUi.style.display === 'flex' && chatbotMessages && chatbotMessages.children.length === 0) {
                         setTimeout(() => {
                            addMessage('Hello! How can I help you today?', 'ai');
                        }, 500);
                    }
                }
            }
        });
        if(chatbotUi) {
            observer.observe(chatbotUi, { attributes: true });
        }
    }
});
