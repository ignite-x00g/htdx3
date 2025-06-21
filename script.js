document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const recaptchaPlaceholder = document.getElementById('recaptcha-placeholder');
    const honeypotField = document.getElementById('honeypot-field');
    // --- START NEW/MODIFIED CODE ---
    const chatContainer = document.getElementById('chat-container');
    const openChatbotButton = document.getElementById('open-chatbot-button');

    let recaptchaVerified = false;

    // Function to show the chatbot and start ReCaptcha
    function showChatbotAndStartRecaptcha() {
        if (chatContainer) {
            chatContainer.style.display = 'flex'; // Or 'block' if that was its original display for visibility
        }
        if (openChatbotButton) {
            openChatbotButton.style.display = 'none'; // Hide the button itself
        }

        // Disable input until ReCaptcha is "verified"
        userInput.disabled = true;
        sendButton.disabled = true;
        simulateRecaptcha(); // Start ReCaptcha simulation
    }

    // Add event listener to the new button
    if (openChatbotButton) {
        openChatbotButton.addEventListener('click', showChatbotAndStartRecaptcha);
    }
    // --- END NEW/MODIFIED CODE ---

    // ReCaptcha Placeholder Logic
    function simulateRecaptcha() {
        recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Click to verify (simulated)</em>';
        recaptchaPlaceholder.style.cursor = 'pointer';
        recaptchaPlaceholder.onclick = () => {
            recaptchaVerified = true;
            recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Verified! (simulated)</em>';
            recaptchaPlaceholder.style.color = 'green';
            recaptchaPlaceholder.onclick = null;
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        };
    }
    // Modified initializeChat: Now it doesn't directly start ReCaptcha or disable inputs.
    // It just ensures the chatbot is ready if it were to be shown.
    // The actual showing and ReCaptcha start is handled by openChatbotButton click.
    function initializeChat() {
        // Chatbot is hidden by CSS initially.
        // Inputs will be disabled by showChatbotAndStartRecaptcha before ReCaptcha.
        // No direct action needed here for initial state regarding visibility or ReCaptcha.
    }

    // Honeypot Detection (remains the same)
    honeypotField.addEventListener('input', () => {
        if (honeypotField.value !== '') {
            console.warn('Honeypot triggered! Possible bot activity.');
            alert('Chat disabled due to suspicious activity.');
            userInput.disabled = true;
            sendButton.disabled = true;
            userInput.placeholder = 'Chat disabled.';
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSendMessage() {
        const userText = userInput.value.trim();

        if (honeypotField.value !== '') {
            alert('Cannot send message. Chat disabled due to suspicious activity.');
            return;
        }
        // --- MODIFIED CHECK ---
        // Ensure chat container is visible AND recaptcha is verified
        if (!chatContainer || chatContainer.style.display === 'none') {
             // Should not happen if UI logic is correct, but as a safeguard
            alert('Chat is not active.');
            return;
        }
        if (!recaptchaVerified) {
            alert('Please complete the ReCaptcha verification first.');
            return;
        }
        // --- END MODIFIED CHECK ---
        if (userText === '') {
            return;
        }

        addMessage(userText, 'user');
        userInput.value = '';
        userInput.focus();
        sendButton.disabled = true;
        setTimeout(async () => {
            try {
                const botReply = "This is a simulated response from the AI. Cloudflare integration is pending.";
                addMessage(botReply, 'bot');
            } catch (error) {
                console.error("Error fetching AI response:", error);
                addMessage("Sorry, I couldn't connect to the AI. Please try again later.", 'bot');
            } finally {
                sendButton.disabled = false;
            }
        }, 1000);
    }

    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
    initializeChat(); // Call initializeChat (it does less now)
});
