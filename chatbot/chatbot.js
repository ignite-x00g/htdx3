// chatbot/chatbot.js

let chatContainer, chatMessages, userInput, sendButton, recaptchaPlaceholder, honeypotField, chatbotCloseButtonMain;
let recaptchaVerified = false;

function queryInternalElements() {
    chatContainer = document.getElementById('chat-container');
    chatMessages = document.getElementById('chat-messages');
    userInput = document.getElementById('user-input');
    sendButton = document.getElementById('send-button');
    recaptchaPlaceholder = document.getElementById('recaptcha-placeholder');
    honeypotField = document.getElementById('honeypot-field');
    chatbotCloseButtonMain = document.getElementById('chatbot-close-button-main');

    return chatContainer && chatMessages && userInput && sendButton && recaptchaPlaceholder && honeypotField && chatbotCloseButtonMain;
}

function addMessageToChat(text, sender) {
    if (!chatMessages || !text || !text.trim()) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateRecaptcha() {
    if (!recaptchaPlaceholder || !userInput || !sendButton) return;
    recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Click to verify (simulated)</em>';
    recaptchaPlaceholder.style.cursor = 'pointer';

    // Define the click handler function
    const recaptchaClickHandler = () => {
        recaptchaVerified = true;
        recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Verified! (simulated)</em>';
        recaptchaPlaceholder.style.color = 'green';
        // Remove the event listener after it has run once
        recaptchaPlaceholder.removeEventListener('click', recaptchaClickHandler);
        recaptchaPlaceholder.style.cursor = 'default'; // Optional: change cursor back
        if (userInput) userInput.disabled = false;
        if (sendButton) sendButton.disabled = false;
        if (userInput) userInput.focus();
    };

    // Add the event listener
    // Ensure to remove any old listener if this function could be called multiple times on the same element
    // However, given innerHTML is set before, this might not be strictly necessary but good practice.
    // For simplicity now, assuming innerHTML reset handles old listeners.
    recaptchaPlaceholder.addEventListener('click', recaptchaClickHandler);
}

async function handleSendMessage() {
    if (!userInput || !chatContainer || !sendButton || !honeypotField) return;
    const userText = userInput.value.trim();

    if (honeypotField.value !== '') {
        alert('Cannot send message. Chat disabled due to suspicious activity.');
        return;
    }
    if (chatContainer.style.display === 'none') {
        alert('Chat is not active.');
        return;
    }
    if (!recaptchaVerified) {
        alert('Please complete the ReCaptcha verification first.');
        return;
    }
    if (userText === '') return;

    addMessageToChat(userText, 'user');
    userInput.value = '';
    userInput.focus();
    sendButton.disabled = true;

    setTimeout(async () => {
        try {
            const botReply = "This is a simulated response from the AI. Cloudflare integration is pending.";
            addMessageToChat(botReply, 'bot');
        } catch (error) {
            console.error("Error fetching AI response:", error);
            addMessageToChat("Sorry, I couldn't connect to the AI. Please try again later.", 'bot');
        } finally {
            if(sendButton) sendButton.disabled = false;
        }
    }, 1000);
}

function setupInternalEventListeners() {
    if (sendButton) sendButton.addEventListener('click', handleSendMessage);
    if (userInput) {
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSendMessage();
            }
        });
    }
    if (chatbotCloseButtonMain) {
        chatbotCloseButtonMain.addEventListener('click', () => {
            if (chatContainer) {
                chatContainer.style.display = 'none';
                // Optionally dispatch: document.dispatchEvent(new CustomEvent('chatbotclosedinternally'));
            }
        });
    }
    if (honeypotField && userInput && sendButton) {
        honeypotField.addEventListener('input', () => {
            if (honeypotField.value !== '') {
                console.warn('Honeypot triggered! Possible bot activity.');
                alert('Chat disabled due to suspicious activity.');
                if (userInput) userInput.disabled = true;
                if (sendButton) sendButton.disabled = true;
                if (userInput) userInput.placeholder = 'Chat disabled.';
            }
        });
    }
}

function performFirstTimeSetup() {
    if (chatMessages && chatMessages.children.length === 0) {
        setTimeout(() => addMessageToChat('Hello! How can I help you today?', 'bot'), 300);
    }
}

function prepareChatForOpening() {
    if (!userInput || !sendButton || !recaptchaPlaceholder) {
        // Attempt to re-query elements if they are missing, could happen if 'chatbotopened' fires too early
        if (!queryInternalElements()) {
            console.error("Chatbot elements missing in prepareChatForOpening.");
            return;
        }
    }

    recaptchaVerified = false; // Reset verification status
    userInput.disabled = true;
    sendButton.disabled = true;
    simulateRecaptcha();
    userInput.focus();
}

// Listener for when the main script has loaded the chatbot's HTML
document.addEventListener('chatbotloadedandready', () => {
    if (queryInternalElements()) {
        setupInternalEventListeners();
        performFirstTimeSetup(); // For initial greeting
        // prepareChatForOpening(); // Initial ReCaptcha setup and focus after load.
                                 // This will also be called by 'chatbotopened'.
                                 // Call it here to ensure setup on first load if 'chatbotopened' is missed or delayed.
                                 // However, 'chatbotopened' should be the primary trigger for this.
                                 // Let's rely on 'chatbotopened' from the main script.
    } else {
        console.error("Chatbot internal elements not found after 'chatbotloadedandready' event.");
    }
});

// Listener for when the main script signals the chatbot is being opened
document.addEventListener('chatbotopened', () => {
    // Ensure elements are queried, especially if this event fires before chatbotloadedandready somehow (unlikely)
    // or if queryInternalElements failed initially.
    if (!chatContainer) { // Simple check, assumes others are also not set if container isn't
        if (!queryInternalElements()) {
            console.error("Chatbot elements not found when 'chatbotopened' event received.");
            return;
        }
    }
    // Ensure the container is actually visible as the event implies
    if (chatContainer && chatContainer.style.display !== 'none') {
        prepareChatForOpening();
    } else {
        // This case might happen if 'chatbotopened' is dispatched optimistically by the main script
        // It's better if the main script dispatches 'chatbotopened' *after* making it visible.
        // console.warn("'chatbotopened' received, but chat container is not visible or not found.");
        // If it's not visible, prepareChatForOpening() might try to focus a non-visible element.
        // However, the current openChatbot in js/chatbot.js makes it visible then dispatches.
        prepareChatForOpening(); // Assuming it's made visible right before this event.
    }
});
