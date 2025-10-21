// Contact page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ accordion
    initFAQAccordion();
    
    // Initialize contact animations
    initContactAnimations();
    
    // Initialize email reveal
    initEmailReveal();
});

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual backend integration)
    setTimeout(() => {
        // Show success message
        showNotification('Tin nhắn đã được gửi thành công! Tôi sẽ phản hồi trong vòng 24 giờ.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // In a real application, you would send the data to your backend
        console.log('Form data:', Object.fromEntries(formData));
        
    }, 2000);
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Clear previous errors
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Trường này là bắt buộc';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email không hợp lệ';
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Tên phải có ít nhất 2 ký tự';
    }
    
    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Tin nhắn phải có ít nhất 10 ký tự';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// FAQ Accordion functionality
function initFAQAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add smooth animation
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
                target.style.transition = 'all 0.3s ease';
            }
        });
    });
}

// Contact animations
function initContactAnimations() {
    // Animate contact cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe contact cards
    document.querySelectorAll('.contact-form-card, .contact-info-card, .faq-section').forEach(card => {
        observer.observe(card);
    });
}

// Social links click tracking (optional)
function trackSocialClick(platform) {
    // In a real application, you might want to track social link clicks
    console.log(`Social link clicked: ${platform}`);
}

// Add click tracking to social links
document.addEventListener('click', function(e) {
    if (e.target.closest('.social-link')) {
        const platform = e.target.closest('.social-link').classList[1]; // Get the platform class
        trackSocialClick(platform);
    }
});

// Email reveal functionality
function initEmailReveal() {
    const revealBtn = document.getElementById('reveal-email-btn');
    const emailDisplay = document.getElementById('email-display');
    
    if (!revealBtn || !emailDisplay) return;
    
    const email = 'tandung29022004@gmail.com';
    let isRevealed = false;
    
    revealBtn.addEventListener('click', function() {
        if (!isRevealed) {
            // Reveal email
            emailDisplay.textContent = email;
            emailDisplay.classList.remove('email-hidden');
            emailDisplay.classList.add('email-revealed');
            
            // Update button
            revealBtn.innerHTML = '<i class="bi bi-envelope me-1"></i> Gửi email';
            revealBtn.onclick = function() {
                window.location.href = `mailto:${email}`;
            };
            
            isRevealed = true;
        }
    });
}
