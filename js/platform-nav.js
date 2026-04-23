/* ============================================
   Platform Page Navigation Handler
   ============================================ */

class PlatformNav {
  constructor() {
    this.nav = document.querySelector('.platform-nav');
    this.links = document.querySelectorAll('.platform-nav__link');
    this.sections = document.querySelectorAll('section[id]');
    
    if (this.nav && this.links.length && this.sections.length) {
      this.init();
    }
  }

  init() {
    // Handle click navigation
    this.links.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Handle scroll-based highlighting
    this.handleScroll = this.throttle(this.updateActiveLink.bind(this), 100);
    window.addEventListener('scroll', this.handleScroll);
    
    // Set initial active link
    this.updateActiveLink();
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const targetId = href.substring(1); // Remove #
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      // Calculate offset accounting for fixed nav
      const navHeight = document.querySelector('.nav').offsetHeight;
      const platformNavHeight = this.nav.offsetHeight;
      const offset = navHeight + platformNavHeight + 20; // 20px extra padding
      
      const targetPosition = targetSection.offsetTop - offset;
      
      // Smooth scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update active state immediately
      this.setActiveLink(e.target);
    }
  }

  updateActiveLink() {
    const navHeight = document.querySelector('.nav').offsetHeight;
    const platformNavHeight = this.nav.offsetHeight;
    const offset = navHeight + platformNavHeight + 100; // Extra offset for better UX
    
    let currentSection = null;
    const scrollPosition = window.scrollY + offset;

    // Find the current section
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section.id;
      }
    });

    // Update active link
    if (currentSection) {
      const activeLink = document.querySelector(`.platform-nav__link[href="#${currentSection}"]`);
      if (activeLink) {
        this.setActiveLink(activeLink);
      }
    }
  }

  setActiveLink(activeLink) {
    // Remove active class from all links
    this.links.forEach(link => link.classList.remove('active'));
    
    // Add active class to current link
    activeLink.classList.add('active');
  }

  // Throttle function for scroll performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Initialize platform navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PlatformNav();
});