// Main JavaScript for Noway's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-moon-fill';
        } else {
            themeIcon.className = 'bi bi-sun-fill';
        }
    }
    
    // Starfield animation
    createStarfield();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation classes on scroll
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
    
    // Observe elements for animation
    document.querySelectorAll('.post-card, .hero-section, .language-card').forEach(el => {
        observer.observe(el);
    });
    
    // Language proficiency bars animation
    animateLanguageBars();
    
    // Back to top button functionality
    initBackToTop();
    
    // Typewriter effect
    initTypewriterEffect();
    
    // Avatar double-click functionality
    initAvatarToggle();
    
    // Code copy functionality
    initCodeCopyButtons();
});

// Starfield creation function
function createStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createStars() {
        stars = [];
        const numStars = Math.floor((canvas.width * canvas.height) / 10000);
        
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random()
            });
        }
    }
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;
            
            // Wrap around screen
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }
    
    resizeCanvas();
    createStars();
    animateStars();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
    });
}

// Language proficiency bars animation
function animateLanguageBars() {
    const levelFills = document.querySelectorAll('.level-fill');
    
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
      if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                setTimeout(() => {
                    entry.target.style.width = level + '%';
                }, 500); // Delay for smooth entrance
            }
        });
    }, { threshold: 0.5 });
    
    levelFills.forEach(fill => {
        barObserver.observe(fill);
    });
}

// Back to Top Button functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const progressRingFill = document.querySelector('.progress-ring-fill');
    const progressRingCircle = document.querySelector('.progress-ring-circle');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        // Show button when scrolled down 300px
        if (scrollTop > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Update progress ring
        const circumference = 2 * Math.PI * 25; // radius = 25
        const offset = circumference - (scrollPercent / 100) * circumference;
        
        if (progressRingFill && progressRingCircle) {
            progressRingFill.style.strokeDashoffset = offset;
            progressRingCircle.style.strokeDashoffset = offset;
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typewriter Effect
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter-text');
    
    if (typewriterElements.length === 0) return;
    
    // Intersection Observer for typewriter effect
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typewriter-started')) {
                entry.target.classList.add('typewriter-started');
                startTypewriter(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    // Observe all typewriter elements
    typewriterElements.forEach(element => {
        typewriterObserver.observe(element);
    });
}

function startTypewriter(element) {
    const text = element.getAttribute('data-text') || element.textContent;
    const speed = getTypewriterSpeed(element);
    
    element.textContent = '';
    element.classList.add('typing');
    
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            const char = text.charAt(index);
            element.textContent += char;
            index++;
        } else {
            clearInterval(typeInterval);
            element.classList.remove('typing');
            element.classList.add('completed');
            
            // Add a small delay before removing cursor
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }, speed);
}

function getTypewriterSpeed(element) {
    // Different speeds for different elements
    if (element.classList.contains('text-gradient')) return 100; // Fast for names
    if (element.classList.contains('text-gradient-blog')) return 80; // Medium for titles
    if (element.classList.contains('text-gradient-lang')) return 80; // Medium for titles
    if (element.classList.contains('text-gradient-cert')) return 80; // Medium for certificate titles
    if (element.tagName === 'H4') return 50; // Medium for subtitles
    if (element.tagName === 'P') return 30; // Slow for paragraphs
    return 50; // Default speed
}

// Avatar Toggle Functionality
function initAvatarToggle() {
    const profileImage = document.getElementById('profileImage');
    const profileContainer = document.getElementById('profileContainer');
    
    if (!profileImage || !profileContainer) return;
    
    // Avatar images array
    const avatars = [
        'assets/images/ava/noway.jpg',
        'assets/images/ava/noway2.jpg'
    ];
    
    let currentAvatarIndex = 0;
    let clickCount = 0;
    let clickTimer = null;
    
    // Double-click detection
    profileImage.addEventListener('click', function(e) {
        e.preventDefault();
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300); // 300ms timeout for double-click
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            toggleAvatar();
        }
    });
    
    // Toggle avatar function
    function toggleAvatar() {
        // Add transition effect
        profileImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        profileImage.style.opacity = '0';
        profileImage.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            // Switch to next avatar
            currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
            profileImage.src = avatars[currentAvatarIndex];
            
            // Wait for image to load, then adjust container size
            profileImage.onload = function() {
                adjustContainerSize();
            };
            
            // Add glow effect
            profileContainer.classList.add('avatar-switch-glow');
            
            // Fade in with scale effect
            profileImage.style.opacity = '1';
            profileImage.style.transform = 'scale(1.1)';
            
            // Remove glow effect after animation
            setTimeout(() => {
                profileImage.style.transform = 'scale(1)';
                profileContainer.classList.remove('avatar-switch-glow');
            }, 300);
        }, 150);
    }
    
    // Function to adjust container size based on image
    function adjustContainerSize() {
        const img = new Image();
        img.onload = function() {
            const aspectRatio = this.width / this.height;
            const screenWidth = window.innerWidth;
            
            // Get base size based on screen width
            let baseSize;
            if (screenWidth <= 768) {
                baseSize = 240; // Mobile
            } else if (screenWidth <= 992) {
                baseSize = 300; // Tablet
            } else {
                baseSize = 320; // Desktop
            }
            
            let newSize;
            
            // Adjust size based on aspect ratio
            if (aspectRatio > 1.1) {
                // Wide image - increase width
                const maxSize = baseSize + 40;
                newSize = Math.min(maxSize, baseSize + (aspectRatio - 1) * 50);
            } else if (aspectRatio < 0.9) {
                // Tall image - increase height
                const maxSize = baseSize + 40;
                newSize = Math.min(maxSize, baseSize + (1 - aspectRatio) * 50);
            } else {
                // Square-ish image - default size
                newSize = baseSize;
            }
            
            // Apply new size with smooth transition
            profileContainer.style.width = newSize + 'px';
            profileContainer.style.height = newSize + 'px';
            
            // Update image size to fit container
            const imageSize = newSize - 20; // Account for padding
            profileImage.style.width = imageSize + 'px';
            profileImage.style.height = imageSize + 'px';
        };
        img.src = avatars[currentAvatarIndex];
    }
}

// Code Copy Functionality
function initCodeCopyButtons() {
    // Find all code blocks and add copy buttons
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach((codeBlock, index) => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="bi bi-copy"></i> Copy';
        copyBtn.setAttribute('data-code-index', index);
        
        // Add button to code block
        codeBlock.appendChild(copyBtn);
        
        // Add click event listener
        copyBtn.addEventListener('click', function() {
            copyCodeToClipboard(codeBlock, copyBtn);
        });
    });
}

async function copyCodeToClipboard(codeBlock, button) {
    const codeElement = codeBlock.querySelector('code');
    if (!codeElement) return;
    
    // Get the text content
    const codeText = codeElement.textContent || codeElement.innerText;
    
    try {
        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(codeText);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        
        // Update button to show success
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check"></i> Copied!';
        button.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy code: ', err);
        
        // Show error state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-x"></i> Error';
        button.style.background = 'rgba(239, 68, 68, 0.8)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }
}