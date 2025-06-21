document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const recaptchaPlaceholder = document.getElementById('recaptcha-placeholder');
    const honeypotField = document.getElementById('honeypot-field');

    let recaptchaVerified = false; // This will be set by ReCaptcha callback

    // --- ReCaptcha Placeholder Logic ---
    // In a real scenario, you would load Google ReCaptcha script and it would call a function like this.
    // For now, we'll simulate it.
    function simulateRecaptcha() {
        recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Click to verify (simulated)</em>';
        recaptchaPlaceholder.style.cursor = 'pointer';
        recaptchaPlaceholder.onclick = () => {
            recaptchaVerified = true;
            recaptchaPlaceholder.innerHTML = '<em>ReCaptcha: Verified! (simulated)</em>';
            recaptchaPlaceholder.style.color = 'green';
            recaptchaPlaceholder.onclick = null; // Remove click listener
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        };
    }

    function initializeChat() {
        // Disable input until ReCaptcha is "verified"
        userInput.disabled = true;
        sendButton.disabled = true;
        simulateRecaptcha(); // Start ReCaptcha simulation
    }

    // --- Honeypot Detection ---
    honeypotField.addEventListener('input', () => {
        if (honeypotField.value !== '') {
            console.warn('Honeypot triggered! Possible bot activity.');
            alert('Chat disabled due to suspicious activity.');
            // Disable chat functionality
            userInput.disabled = true;
            sendButton.disabled = true;
            userInput.placeholder = 'Chat disabled.';
            // In a real application, you would also send an alert to your backend/workers
            // and potentially block the IP.
        }
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the latest message
    }

    async function handleSendMessage() {
        const userText = userInput.value.trim();

        if (honeypotField.value !== '') {
            alert('Cannot send message. Chat disabled due to suspicious activity.');
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

        // --- Cloudflare AI Integration Placeholder ---
        // Simulate bot thinking and response
        sendButton.disabled = true;
        setTimeout(async () => {
            try {
                // Replace this with actual API call to your backend,
                // which then interacts with Cloudflare AI.
                // const response = await fetch('/api/chat', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ message: userText })
                // });
                // if (!response.ok) {
                //     throw new Error('Network response was not ok');
                // }
                // const data = await response.json();
                // addMessage(data.reply, 'bot');

                // Simulated bot response:
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

    initializeChat();
});
