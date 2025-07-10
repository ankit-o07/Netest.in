// Enhanced theme management and mobile navigation with smooth animations
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Set initial theme
    setTheme(defaultTheme);

    // Theme toggle functionality with smooth transition
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class for smooth theme change
            body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTheme(newTheme);
            
            // Remove transition after animation completes
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }

    // Enhanced mobile menu toggle with animations
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const isActive = mainNav.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav && mainNav.classList.contains('active') && 
            !e.target.closest('.header-container')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Enhanced dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown > .nav-link');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const parentDropdown = this.closest('.dropdown');
                const dropdownContent = parentDropdown.querySelector('.dropdown-content');
                const isActive = parentDropdown.classList.contains('active');

                // Close other open dropdowns
                document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== parentDropdown) {
                        otherDropdown.classList.remove('active');
                        const otherContent = otherDropdown.querySelector('.dropdown-content');
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    }
                });

                // Toggle current dropdown with animation
                if (isActive) {
                    parentDropdown.classList.remove('active');
                    if (dropdownContent) {
                        dropdownContent.style.display = 'none';
                    }
                } else {
                    parentDropdown.classList.add('active');
                    if (dropdownContent) {
                        dropdownContent.style.display = 'block';
                    }
                }
            }
        });
    });

    // Smooth scroll for anchor links
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

    // Enhanced intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('menu-grid')) {
                    const items = entry.target.querySelectorAll('.menu-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Initialize menu items with staggered opacity
    document.querySelectorAll('.menu-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    });

    // Add active state to current navigation link
    setActiveNavLink();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Handle window resize for mobile menu
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Add loading animation completion
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Functions
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update button icon with animation
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                // Add rotation animation
                icon.style.transform = 'rotate(180deg)';
                
                setTimeout(() => {
                    if (theme === 'dark') {
                        icon.classList.remove('fa-moon');
                        icon.classList.add('fa-sun');
                        themeToggle.setAttribute('aria-label', 'Switch to light mode');
                    } else {
                        icon.classList.remove('fa-sun');
                        icon.classList.add('fa-moon');
                        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                    }
                    
                    // Reset rotation
                    setTimeout(() => {
                        icon.style.transform = 'rotate(0deg)';
                    }, 150);
                }, 150);
            }
        }
    }

    function openMobileMenu() {
        mainNav.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Animate hamburger to X
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(90deg)';
            setTimeout(() => {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mainNav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Animate X to hamburger
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.style.transform = 'rotate(90deg)';
            setTimeout(() => {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.style.transform = 'rotate(0deg)';
            }, 150);
        }
        
        // Reset dropdown states
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                content.style.display = 'none';
            }
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href && (href === currentPath || 
                (currentPath === '/' && href === '/index.html') ||
                (currentPath === '/index.html' && href === '/') ||
                (currentPath.includes('/blogs') && href === '/blogs.html') ||
                (currentPath.includes('/tests') && href === '/tests.html') ||
                (currentPath.includes('/labs') && href.includes('Labs')) ||
                (currentPath.includes('/ascalc') && href === '/ascalc.html') ||
                (currentPath.includes('/ip_address') && href === '/ip_address.html'))) {
                link.classList.add('active');
            }
        });
        
        // Handle dropdown links
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href && href === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // Add hover effects for cards
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click ripple effect for buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .loaded .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});