const THEME_STORAGE_KEY = 'theme-preference';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initThemeMode();
    initTypingAnimation();
    initMobileMenu();
    initServiceDetails();
    initProjects();
    initActiveNavLink();
    initScrollReveal();
    initContactForm();
});

function initThemeMode() {
    const themeSelects = document.querySelectorAll('.theme-select');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedPreference = localStorage.getItem(THEME_STORAGE_KEY) || 'system';

    applyTheme(savedPreference);

    themeSelects.forEach(select => {
        select.value = savedPreference;
        select.addEventListener('change', (event) => {
            applyTheme(event.target.value);
        });
    });

    const syncSystemTheme = () => {
        const activePreference = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
        if (activePreference === 'system') {
            applyTheme('system');
        }
    };

    if (typeof systemTheme.addEventListener === 'function') {
        systemTheme.addEventListener('change', syncSystemTheme);
    } else if (typeof systemTheme.addListener === 'function') {
        systemTheme.addListener(syncSystemTheme);
    }
}

function applyTheme(preference) {
    const resolvedTheme = preference === 'system'
        ? getSystemTheme()
        : preference;

    localStorage.setItem(THEME_STORAGE_KEY, preference);
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = resolvedTheme;

    document.querySelectorAll('.theme-select').forEach(select => {
        select.value = preference;
    });
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement && typeof Typed !== 'undefined') {
        new Typed('.typing-text', {
            strings: ['Cybersecurity Specialist', 'Web Developer', 'CS Student', 'Tech Enthusiast'],
            typeSpeed: 70,
            backSpeed: 70,
            backDelay: 1000,
            loop: true
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!menuToggle || !nav) return;

    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Projects Data and Display
const projectsData = [
    {
        title: "My Portfolio",
        description: "A responsive personal portfolio built with HTML, CSS, and JavaScript featuring modern design and animations.",
        image: "Images/project-1.png",
        live: "https://evansamo.netlify.app",
        github: "https://github.com/evansamos254/portfolio"
    }
];

function initProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    // Clear loading state if any
    container.innerHTML = '';

    projectsData.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.style.transitionDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
                <a href="${project.live}" target="_blank" rel="noopener noreferrer">Live Demo</a>
                <a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
        `;

        container.appendChild(card);
    });

    // Observe project cards for scroll animation
    observeProjects();
}

function initServiceDetails() {
    const toggleButtons = document.querySelectorAll('.service-toggle');
    if (!toggleButtons.length) return;

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.service-card');
            if (!card) return;

            const isExpanded = card.classList.toggle('expanded');
            button.setAttribute('aria-expanded', String(isExpanded));
            button.textContent = isExpanded ? 'Read Less' : 'Read More';
        });
    });
}

function observeProjects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });

    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
}

// Active Navigation Link
function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
}

// Contact Form Validation (if exists)
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#00ff88' : '#ff4444'};
        color: var(--bg-color);
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style)
