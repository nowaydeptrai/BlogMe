// Main JavaScript for Noway's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Theme functionality is handled by navbar.js
    // No need to duplicate theme toggle logic here
    
    // Starfield animation
    createStarfield();
    
    // Cosmic particles
    createCosmicParticles();
    
    // Backup starfield - đảm bảo luôn có sao
    setTimeout(() => {
        createBackupStarfield();
        console.log('Backup starfield created');
    }, 2000);
    
    // Đảm bảo starfield hoạt động
    setTimeout(() => {
        const canvas = document.getElementById('starfield');
        if (canvas) {
            console.log('Starfield canvas found and should be working');
            // Thêm một số sao đơn giản để test
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                for (let i = 0; i < 20; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                console.log('Test stars added to canvas');
            }
        }
    }, 1000);
    
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

// Enhanced Starfield creation function with cosmic effects
function createStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) {
        console.error('Starfield canvas not found!');
        return;
    }
    
    console.log('Creating starfield...', canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Cannot get 2D context from canvas');
        return;
    }
    
    console.log('Canvas context created successfully');
    let stars = [];
    let shootingStars = [];
    let nebula = [];
    let planets = [];
    let sparkles = [];
    let moon = null;
    let animationId;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createStars() {
        stars = [];
        const numStars = Math.floor((canvas.width * canvas.height) / 8000); // Giảm số sao để nhẹ nhàng hơn
        
        for (let i = 0; i < numStars; i++) {
            const size = Math.random();
            const isStatic = Math.random() < 0.9; // 90% sao tĩnh, 10% sao di chuyển nhẹ
            
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: size < 0.8 ? Math.random() * 0.8 + 0.3 : Math.random() * 1.2 + 0.5, // Sao nhỏ và tinh tế
                vx: isStatic ? 0 : (Math.random() - 0.5) * 0.1, // Chuyển động rất nhẹ
                vy: isStatic ? 0 : (Math.random() - 0.5) * 0.1,
                opacity: Math.random() * 0.4 + 0.2, // Độ sáng thấp, tinh tế
                twinkle: Math.random() * 0.1,
                twinkleSpeed: Math.random() * 0.01 + 0.005, // Nhấp nháy rất chậm
                type: size < 0.8 ? 'normal' : 'bright',
                isStatic: isStatic
            });
        }
        
        // Thêm một số sao sáng nhẹ nhàng ở các vị trí đẹp
        const fixedStars = [
            {x: 0.1, y: 0.1, size: 1.2, opacity: 0.6},
            {x: 0.9, y: 0.2, size: 1.0, opacity: 0.5},
            {x: 0.2, y: 0.8, size: 0.8, opacity: 0.4},
            {x: 0.8, y: 0.9, size: 1.1, opacity: 0.5},
            {x: 0.5, y: 0.3, size: 1.3, opacity: 0.7},
            {x: 0.3, y: 0.6, size: 0.9, opacity: 0.4},
            {x: 0.7, y: 0.7, size: 1.0, opacity: 0.5}
        ];
        
        fixedStars.forEach(star => {
            stars.push({
                x: star.x * canvas.width,
                y: star.y * canvas.height,
                radius: star.size,
                vx: 0,
                vy: 0,
                opacity: star.opacity,
                twinkle: Math.random() * 0.1,
                twinkleSpeed: Math.random() * 0.01 + 0.005, // Nhấp nháy chậm
                type: 'bright',
                isStatic: true
            });
        });
    }
    
    function createShootingStars() {
        if (Math.random() < 0.003) { // 0.3% chance per frame
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.3,
                vx: Math.random() * 8 + 4,
                vy: Math.random() * 3 + 1,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                length: Math.random() * 50 + 20
            });
        }
    }
    
    function createNebula() {
        if (nebula.length < 3) {
            nebula.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 100 + 50,
                opacity: Math.random() * 0.1 + 0.05,
                color: Math.random() < 0.5 ? [102, 126, 234] : [118, 75, 162],
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }
    
    function createPlanets() {
        if (planets.length < 2) {
            planets.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 8 + 4,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: Math.random() < 0.5 ? [255, 165, 0] : [100, 149, 237],
                glow: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    function createSparkles() {
        if (Math.random() < 0.1) {
            sparkles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                life: 1,
                decay: Math.random() * 0.05 + 0.02,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
    }
    
    function createMoon() {
        if (!moon) {
            moon = {
                x: canvas.width * 0.8,
                y: canvas.height * 0.2,
                radius: 25,
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: 0.01
            };
        }
    }
    
    function drawNebula() {
        nebula.forEach(n => {
            const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
            gradient.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity})`);
            gradient.addColorStop(1, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fill();
            
            n.x += n.vx;
            n.y += n.vy;
            
            if (n.x < -n.radius || n.x > canvas.width + n.radius || 
                n.y < -n.radius || n.y > canvas.height + n.radius) {
                n.x = Math.random() * canvas.width;
                n.y = Math.random() * canvas.height;
            }
        });
    }
    
    function drawStars() {
        stars.forEach(star => {
            star.twinkle += star.twinkleSpeed;
            const twinkleOpacity = star.opacity + Math.sin(star.twinkle) * 0.1; // Giảm hiệu ứng nhấp nháy
            
            if (star.type === 'bright') {
                // Bright star với glow nhẹ nhàng
                const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 2);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkleOpacity * 0.8})`);
                gradient.addColorStop(0.5, `rgba(255, 255, 255, ${twinkleOpacity * 0.4})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Main star - đơn giản và tinh tế
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(twinkleOpacity, 0.8)})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            
            star.x += star.vx;
            star.y += star.vy;
            
            // Wrap around screen
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        });
    }
    
    function drawShootingStars() {
        shootingStars.forEach((star, index) => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.life})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.length, star.y - star.length * 0.3);
            ctx.stroke();
            
            star.x += star.vx;
            star.y += star.vy;
            star.life -= star.decay;
            
            if (star.life <= 0) {
                shootingStars.splice(index, 1);
            }
        });
    }
    
    function drawPlanets() {
        planets.forEach(planet => {
            // Planet glow
            const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 2);
            gradient.addColorStop(0, `rgba(${planet.color[0]}, ${planet.color[1]}, ${planet.color[2]}, ${planet.glow})`);
            gradient.addColorStop(1, `rgba(${planet.color[0]}, ${planet.color[1]}, ${planet.color[2]}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Planet
            ctx.fillStyle = `rgba(${planet.color[0]}, ${planet.color[1]}, ${planet.color[2]}, 0.8)`;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
            ctx.fill();
            
            planet.x += planet.vx;
            planet.y += planet.vy;
            
            if (planet.x < -planet.radius || planet.x > canvas.width + planet.radius || 
                planet.y < -planet.radius || planet.y > canvas.height + planet.radius) {
                planet.x = Math.random() * canvas.width;
                planet.y = Math.random() * canvas.height;
            }
        });
    }
    
    function drawSparkles() {
        sparkles.forEach((sparkle, index) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.life})`;
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
            ctx.fill();
            
            sparkle.x += sparkle.vx;
            sparkle.y += sparkle.vy;
            sparkle.life -= sparkle.decay;
            
            if (sparkle.life <= 0) {
                sparkles.splice(index, 1);
            }
        });
    }
    
    function drawMoon() {
        if (moon) {
            moon.phase += moon.phaseSpeed;
            
            // Moon glow
            const gradient = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, moon.radius * 2);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0.3)`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(moon.x, moon.y, moon.radius * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Moon
            ctx.fillStyle = `rgba(200, 200, 200, 0.9)`;
            ctx.beginPath();
            ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Moon phase (crescent)
            ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
            ctx.beginPath();
            ctx.arc(moon.x + Math.cos(moon.phase) * moon.radius * 0.3, moon.y, moon.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw in order (back to front)
        drawNebula();
        drawSimpleStars(); // Thêm sao đơn giản để đảm bảo có sao hiển thị
        drawStars();
        drawPlanets();
        drawShootingStars();
        drawSparkles();
        drawMoon();
        
        // Create new effects
        createShootingStars();
        createNebula();
        createPlanets();
        createSparkles();
        createMoon();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Simple star test - sao nhẹ nhàng và tinh tế
    function drawSimpleStars() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Độ sáng thấp
        for (let i = 0; i < 50; i++) { // Giảm số sao
            const x = (i * 137.5) % canvas.width;
            const y = (i * 137.5) % canvas.height;
            const size = Math.random() * 0.8 + 0.3; // Sao nhỏ hơn
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Thêm một số sao sáng nhẹ nhàng
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Độ sáng vừa phải
        const brightStars = [
            {x: canvas.width * 0.1, y: canvas.height * 0.1, size: 1.2},
            {x: canvas.width * 0.9, y: canvas.height * 0.2, size: 1.0},
            {x: canvas.width * 0.2, y: canvas.height * 0.8, size: 0.8},
            {x: canvas.width * 0.8, y: canvas.height * 0.9, size: 1.1},
            {x: canvas.width * 0.5, y: canvas.height * 0.3, size: 1.3}
        ];
        
        brightStars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    resizeCanvas();
    createStars();
    createMoon();
    
    // Test canvas với một hình vuông đơn giản
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(10, 10, 20, 20);
    console.log('Test rectangle drawn on canvas');
    
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
        moon = null; // Reset moon position
    });
}

// Cosmic particles creation function
function createCosmicParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cosmic-particles';
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        // Random position and timing
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 25000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 1000);
    }
}

// Backup starfield function - đảm bảo luôn có sao
function createBackupStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Vẽ sao đơn giản
    function drawBackupStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Nền gradient
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0a0a0a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Vẽ sao nhẹ nhàng
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Độ sáng thấp
        for (let i = 0; i < 100; i++) { // Giảm số sao
            const x = (i * 137.5) % canvas.width;
            const y = (i * 137.5) % canvas.height;
            const size = Math.random() * 0.8 + 0.3; // Sao nhỏ hơn
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Sao sáng nhẹ nhàng
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Độ sáng vừa phải
        const brightStars = [
            {x: canvas.width * 0.1, y: canvas.height * 0.1, size: 1.2},
            {x: canvas.width * 0.9, y: canvas.height * 0.2, size: 1.0},
            {x: canvas.width * 0.2, y: canvas.height * 0.8, size: 0.8},
            {x: canvas.width * 0.8, y: canvas.height * 0.9, size: 1.1},
            {x: canvas.width * 0.5, y: canvas.height * 0.3, size: 1.3}
        ];
        
        brightStars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawBackupStars();
    
    // Redraw khi resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawBackupStars();
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
        
        // Show button when scrolled down 100px (reduced threshold)
        if (scrollTop > 100) {
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