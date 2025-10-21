// 📱 Navbar Loader
class NavbarLoader {
  constructor() {
    this.navbarContainer = 'navbar-container';
    this.navbarPath = 'assets/components/navbar.html';
    this.init();
  }

  async init() {
    await this.loadNavbar();
    this.setupActiveLinks();
  }

  async loadNavbar() {
    try {
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
      
    } catch (error) {
      console.error('Error loading navbar:', error);
      // Fallback: show error message
      this.showNavbarError();
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
      document.documentElement.setAttribute('data-theme', savedTheme);
      this.updateThemeIcon(savedTheme, themeIcon);
      
      // Add click listener
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
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
    const errorHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top px-3">
        <a class="navbar-brand fw-bold text-primary" href="index.html">Noway</a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="index.html">Trang chủ</a>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', errorHTML);
  }
}

// Initialize navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NavbarLoader();
});
