// ===================================
// Navigation & Scroll Effects
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Chatbot Functionality
// ===================================
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWidget = document.getElementById('chatbotWidget');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotSuggestions = document.getElementById('chatbotSuggestions');
const clearChat = document.getElementById('clearChat');
const greetingMessage = document.getElementById('greetingMessage');

// Smart greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return "Good morning! How can I help you today?";
    } else if (hour < 18) {
        return "Good afternoon! How can I assist you?";
    } else {
        return "Good evening! How can I help you?";
    }
}

// Set initial greeting
greetingMessage.textContent = getGreeting();

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.add('active');
    chatbotToggle.style.display = 'none';
    chatbotInput.focus();
});

chatbotClose.addEventListener('click', () => {
    chatbotWidget.classList.remove('active');
    chatbotToggle.style.display = 'flex';
});

// Add user message to chat
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Add bot message to chat
function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator-wrapper';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingDiv;
}

// Remove typing indicator
function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

// Send message to API
async function sendMessage(message) {
    addUserMessage(message);
    
    const typingIndicator = showTypingIndicator();
    
    try {
        const response = await fetch('/api/worker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        removeTypingIndicator(typingIndicator);
        
        if (data.response) {
            addBotMessage(data.response);
        } else {
            addBotMessage("I'm sorry, I couldn't process that. Please try again or call us at +44 300 131 9797.");
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingIndicator);
        addBotMessage("I'm having trouble connecting right now. Please try again later or call us directly at +44 300 131 9797 for immediate assistance.");
    }
    
    chatbotInput.value = '';
}

// Send button click
chatbotSend.addEventListener('click', () => {
    const message = chatbotInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Enter key to send
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatbotInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    }
});

// Suggestion chips
const suggestionChips = document.querySelectorAll('.suggestion-chip');
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const message = chip.getAttribute('data-message');
        sendMessage(message);
    });
});

// Clear chat
clearChat.addEventListener('click', () => {
    chatbotMessages.innerHTML = `
        <div class="bot-message">
            <div class="message-content">
                <p>${getGreeting()}</p>
            </div>
        </div>
    `;
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Form Validation (if needed)
// ===================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===================================
// Performance Optimization
// ===================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🦷 Willows Dental Group', 'color: #1C2B39; font-size: 24px; font-weight: bold;');
console.log('%cWebsite built with care for exceptional patient experience', 'color: #5FB0DA; font-size: 14px;');
console.log('%cNeed help? Call us at +44 300 131 9797', 'color: #D97A3A; font-size: 12px;');
