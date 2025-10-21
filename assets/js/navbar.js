// 📱 Navbar Loader
class NavbarLoader {
  constructor() {
    this.navbarContainer = 'navbar-container';
    // Determine the correct path based on current location
    this.navbarPath = this.getNavbarPath();
    this.init();
  }
  
  getNavbarPath() {
    const currentPath = window.location.pathname;
    // If we're in posts folder, need to go up one level
    if (currentPath.includes('/posts/')) {
      return '../assets/components/navbar.html';
    }
    // If we're in root directory
    return 'assets/components/navbar.html';
  }

  async init() {
    await this.loadNavbar();
    this.setupActiveLinks();
  }

  async loadNavbar() {
    try {
      console.log('Loading navbar from:', this.navbarPath);
      const response = await fetch(this.navbarPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const navbarHTML = await response.text();
      
      // Insert navbar into container
      const container = document.getElementById(this.navbarContainer);
      if (container) {
        container.innerHTML = navbarHTML;
      } else {
        // If no container, insert after body tag
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);
      }
      
      // Initialize theme toggle after navbar is loaded
      this.initThemeToggle();
      
      // Fix all links for posts directory
      this.fixNavbarLinks();
      
      console.log('Navbar loaded successfully');
      
    } catch (error) {
      console.error('Error loading navbar:', error);
      // Try alternative path if first attempt failed
      if (this.navbarPath.includes('../')) {
        console.log('Trying alternative path...');
        this.navbarPath = 'assets/components/navbar.html';
        try {
          const response = await fetch(this.navbarPath);
          if (response.ok) {
            const navbarHTML = await response.text();
            const container = document.getElementById(this.navbarContainer);
            if (container) {
              container.innerHTML = navbarHTML;
            } else {
              document.body.insertAdjacentHTML('afterbegin', navbarHTML);
            }
            this.initThemeToggle();
            console.log('Navbar loaded with alternative path');
            return;
          }
        } catch (altError) {
          console.error('Alternative path also failed:', altError);
        }
      }
      // Fallback: show error message
      this.showNavbarError();
    }
  }

  fixNavbarLinks() {
    const currentPath = window.location.pathname;
    const isInPosts = currentPath.includes('/posts/');
    
    if (isInPosts) {
      // Fix navbar brand link
      const brandLink = document.querySelector('.navbar-brand');
      if (brandLink && brandLink.getAttribute('href') === 'index.html') {
        brandLink.setAttribute('href', '../index.html');
      }
      
      // Fix all nav links
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          if (href === 'index.html') {
            link.setAttribute('href', '../index.html');
          } else if (href === 'certificates.html') {
            link.setAttribute('href', '../certificates.html');
          } else if (href === 'contact.html') {
            link.setAttribute('href', '../contact.html');
          } else if (href === 'index.html#about') {
            link.setAttribute('href', '../index.html#about');
          } else if (href === 'index.html#posts') {
            link.setAttribute('href', '../index.html#posts');
          } else if (href === 'index.html#timeline') {
            link.setAttribute('href', '../index.html#timeline');
          }
        }
      });
    }
  }

  setupActiveLinks() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if this link matches current page
      if (href === currentPage || 
          (currentPage === 'index.html' && href === 'index.html#about') ||
          (currentPage === 'certificates.html' && href === 'certificates.html') ||
          (currentPage === 'contact.html' && href === 'contact.html')) {
        link.classList.add('active');
      }
    });
  }

  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    if (themeToggle && themeIcon) {
      // Load saved theme
      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.body.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme, themeIcon);
      
      // Add click listener
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme, themeIcon);
      });
    }
  }

  updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
      icon.className = 'bi bi-moon-fill';
    } else {
      icon.className = 'bi bi-sun-fill';
    }
  }

  showNavbarError() {
    // Determine correct paths based on current location
    const currentPath = window.location.pathname;
    const isInPosts = currentPath.includes('/posts/');
    const homePath = isInPosts ? '../index.html' : 'index.html';
    const aboutPath = isInPosts ? '../index.html#about' : 'index.html#about';
    const postsPath = isInPosts ? '../index.html#posts' : 'index.html#posts';
    const certPath = isInPosts ? '../certificates.html' : 'certificates.html';
    const contactPath = isInPosts ? '../contact.html' : 'contact.html';
    
    const errorHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top px-3">
        <a class="navbar-brand fw-bold text-primary" href="${homePath}">Noway</a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
          <i class="bi bi-list fs-2 text-light"></i>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="menu">
          <ul class="navbar-nav gap-3 align-items-center">
            <li class="nav-item">
              <a class="nav-link" href="${aboutPath}">Giới thiệu</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${postsPath}">Blog</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${homePath}#timeline">Timeline</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${certPath}">Chứng chỉ</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${contactPath}">Liên hệ</a>
            </li>
            <li class="nav-item">
              <a class="btn btn-outline-primary px-3 py-1" href="https://github.com/nowaydeptrai" target="_blank">
                <i class="bi bi-github"></i> GitHub
              </a>
            </li>
            <li class="nav-item">
              <button id="theme-toggle" class="btn btn-outline-light rounded-3 ms-3">
                <i class="bi bi-moon-fill" id="theme-icon"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
    
    // Initialize theme toggle for fallback navbar
    setTimeout(() => {
      this.initThemeToggle();
    }, 100);
  }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NavbarLoader();
});
