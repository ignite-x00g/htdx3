document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const recaptchaPlaceholder = document.getElementById('recaptcha-placeholder');
    const honeypotField = document.getElementById('honeypot-field');
    const chatContainer = document.getElementById('chat-container');
    const openChatbotButton = document.getElementById('open-chatbot-button');

    let recaptchaVerified = false;

    function showChatbotAndStartRecaptcha() {
        if (chatContainer) {
            // Ensure chat container gets the correct display style from CSS when made visible
            // The CSS has #chat-container { display: none; flex-direction: column; ... }
            // So, when we make it visible, we should use 'flex' to match its intended layout.
            chatContainer.style.display = 'flex';
        }
        if (openChatbotButton) {
            openChatbotButton.style.display = 'none';
        }

        userInput.disabled = true;
        sendButton.disabled = true;
        simulateRecaptcha();
    }

    if (openChatbotButton) {
        openChatbotButton.addEventListener('click', showChatbotAndStartRecaptcha);
    }

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

    function initializeChat() {
        // Initial state is now fully controlled by CSS (chat-container hidden)
        // and the openChatbotButton's event listener.
    }

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
        if (!chatMessages) return; // Guard against chatMessages not being found
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

        if (!chatContainer || chatContainer.style.display === 'none') {
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

    if (sendButton) sendButton.addEventListener('click', handleSendMessage);
    if (userInput) userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });

    initializeChat();

    // --- Moved from chatbot.html inline script ---
    // Basic anti-cloning / context menu prevention
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'c' || e.key === 'a')) {
            e.preventDefault();
            // console.warn('Operation prevented by security policy.'); // Optional
        }
        if (e.key === 'F12') {
            e.preventDefault();
            // console.warn('Developer tools access prevented.'); // Optional
        }
    });

    // Anti-Phishing Domain Check (Placeholder - requires actual domain)
    // const expectedDomain = "your-chatbot-domain.com";
    // if (window.location.hostname !== expectedDomain && window.location.hostname !== "localhost") {
    //     // Potentially disable functionality or warn user more prominently.
    //     // For example, by not initializing the chat or showing a warning.
    //     // if (chatContainer) chatContainer.innerHTML = "<h1>Security Alert: Invalid Domain for Chatbot</h1>";
    //     console.warn(`Domain mismatch for chatbot: current is ${window.location.hostname}`);
    // }
    // --- End moved script ---
});
