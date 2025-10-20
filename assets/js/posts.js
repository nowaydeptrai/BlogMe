// Posts data and functionality

const posts = [
    {
        id: 1,
        title: "Java Spring Boot: Xây dựng RESTful API",
        excerpt: "Hướng dẫn chi tiết tạo RESTful API với Spring Boot, JPA và MySQL. Từ cơ bản đến nâng cao.",
        date: "2025-01-20",
        category: "Java",
        tags: ["Java", "Spring Boot", "REST API", "JPA"],
        content: "Chi tiết về Spring Boot...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/java-spring-boot.jpg"
    },
    {
        id: 2,
        title: "JavaScript ES6+ và Modern Web Development",
        excerpt: "Khám phá các tính năng mới của JavaScript ES6+, async/await, modules và best practices.",
        date: "2025-01-18",
        category: "JavaScript",
        tags: ["JavaScript", "ES6", "Async/Await", "Modules"],
        content: "Hướng dẫn JavaScript hiện đại...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/javascript-es6.jpg"
    },
    {
        id: 3,
        title: "Mạng máy tính: TCP/IP và HTTP Protocol",
        excerpt: "Tìm hiểu sâu về giao thức TCP/IP, HTTP/HTTPS và cách chúng hoạt động trong web development.",
        date: "2025-01-16",
        category: "Network",
        tags: ["TCP/IP", "HTTP", "Network", "Protocol"],
        content: "Kiến thức mạng máy tính...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/tcp-http-protocol.jpg"
    },
    {
        id: 4,
        title: "Java Multithreading và Concurrency",
        excerpt: "Lập trình đa luồng trong Java: Thread, Executor, Synchronization và Concurrent Collections.",
        date: "2025-01-14",
        category: "Java",
        tags: ["Java", "Multithreading", "Concurrency", "Thread"],
        content: "Hướng dẫn multithreading...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/java-multithreading.jpg"
    },
    {
        id: 5,
        title: "Node.js và Real-time Web Applications",
        excerpt: "Xây dựng ứng dụng real-time với Node.js, Socket.io và WebSocket cho chat và notification.",
        date: "2025-01-12",
        category: "JavaScript",
        tags: ["Node.js", "Socket.io", "WebSocket", "Real-time"],
        content: "Ứng dụng real-time...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/nodejs-realtime.jpg"
    },
    {
        id: 6,
        title: "Network Security và Penetration Testing",
        excerpt: "Bảo mật mạng máy tính: Firewall, VPN, SSL/TLS và các kỹ thuật kiểm tra bảo mật.",
        date: "2025-01-10",
        category: "Network",
        tags: ["Security", "Firewall", "VPN", "SSL/TLS"],
        content: "Bảo mật mạng...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/network-security.jpg"
    },
    {
        id: 7,
        title: "Java Design Patterns trong thực tế",
        excerpt: "Áp dụng các Design Patterns phổ biến trong Java: Singleton, Factory, Observer và MVC.",
        date: "2025-01-08",
        category: "Java",
        tags: ["Java", "Design Patterns", "Singleton", "Factory"],
        content: "Design Patterns Java...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/java-design-patterns.jpg"
    },
    {
        id: 8,
        title: "React.js và Modern Frontend Architecture",
        excerpt: "Xây dựng ứng dụng React.js với hooks, context API, state management và performance optimization.",
        date: "2025-01-06",
        category: "JavaScript",
        tags: ["React", "Hooks", "Context API", "State Management"],
        content: "React.js hiện đại...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/react-modern.jpg"
    },
    {
        id: 9,
        title: "Mạng LAN và WAN: Thiết kế và Triển khai",
        excerpt: "Thiết kế mạng LAN/WAN cho doanh nghiệp: Router, Switch, VLAN và Network Topology.",
        date: "2025-01-04",
        category: "Network",
        tags: ["LAN", "WAN", "Router", "Switch", "VLAN"],
        content: "Thiết kế mạng doanh nghiệp...",
        avatar: "assets/images/ava/noway.jpg",
        author: "Noway",
        thumbnail: "assets/images/post/lan-wan-design.jpg"
    }
];

// Blog Slider functionality
let currentSlide = 0;
let totalSlides = 0;
let autoSlideInterval = null;
const SLIDE_INTERVAL = 5000; // 5 seconds

// Render posts to the page with slider
function renderPosts() {
    const blogSlider = document.getElementById('blog-slider');
    const sliderDots = document.getElementById('sliderDots');
    if (!blogSlider || !sliderDots) return;
    
    // Calculate slides needed (3 posts per slide)
    const postsPerSlide = 3;
    totalSlides = Math.ceil(posts.length / postsPerSlide);
    
    // Create slides
    blogSlider.innerHTML = '';
    sliderDots.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const slidePosts = posts.slice(i * postsPerSlide, (i + 1) * postsPerSlide);
        
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'blog-slide';
        slide.innerHTML = `
            <div class="row g-4">
                ${slidePosts.map(post => `
                    <div class="col-md-4 mb-4">
                        <div class="post-card animate__animated animate__fadeInUp">
                            <!-- Thumbnail -->
                            <div class="post-thumbnail mb-3">
                                <img src="${post.thumbnail}" alt="${post.title}" class="img-fluid rounded" style="width: 100%; height: 200px; object-fit: cover;">
                            </div>
                            
                            <!-- Avatar và thông tin tác giả -->
                            <div class="d-flex align-items-center mb-3">
                                <img src="${post.avatar}" alt="${post.author}" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
                                <div>
                                    <h6 class="mb-0 text-light">${post.author}</h6>
                                    <small class="text-muted">
                                        <i class="bi bi-calendar3 me-1"></i> ${post.date}
                                    </small>
                                </div>
                            </div>
                            
                            <h5 class="fw-bold text-primary mb-2">${post.title}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-tag me-1"></i> ${post.category}
                            </p>
                            <p class="text-light">${post.excerpt}</p>
                            <div class="d-flex flex-wrap gap-1 mb-3">
                                ${post.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
                            </div>
                            <a href="posts/post${post.id}.html" class="btn-read-more">
                                <span>Đọc thêm</span>
                                <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        blogSlider.appendChild(slide);
        
        // Create dot
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-slide', i);
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
    
    // Initialize slider
    initSlider();
}

// Initialize slider functionality
function initSlider() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', () => prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.blog-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', pauseAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Touch/swipe support
    addTouchSupport();
}

// Navigation functions
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

function updateSlider() {
    const slider = document.getElementById('blog-slider');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slider) {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Auto-slide functionality
function startAutoSlide() {
    if (totalSlides <= 1) return;
    
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, SLIDE_INTERVAL);
}

function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Touch/swipe support
function addTouchSupport() {
    const sliderWrapper = document.querySelector('.blog-slider-wrapper');
    if (!sliderWrapper) return;
    
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    
    sliderWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        pauseAutoSlide();
    });
    
    sliderWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    sliderWrapper.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only trigger if horizontal swipe is greater than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        startAutoSlide();
    });
}

// Initialize posts when DOM is loaded
document.addEventListener('DOMContentLoaded', renderPosts);