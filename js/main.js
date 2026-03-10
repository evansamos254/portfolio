const THEME_STORAGE_KEY = 'theme-preference';
const ADMIN_SESSION_KEY = 'admin-session-active';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_LOGIN_PAGE = 'admin-login.html';
const ADMIN_DASHBOARD_PAGE = 'admin-dashboard.html';
const ADMIN_PROJECTS_KEY = 'admin-projects';
const ADMIN_ARTICLES_KEY = 'admin-articles';
const ADMIN_PORTFOLIO_KEY = 'admin-portfolio';
const ADMIN_ENQUIRIES_KEY = 'admin-enquiries';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    handleAdminAccess();

    // Initialize all components
    initThemeMode();
    initTypingAnimation();
    initMobileMenu();
    initServiceDetails();
    initProjects();
    initActiveNavLink();
    initScrollReveal();
    initContactForm();
    initAdminLogin();
    initAdminDashboard();
    initArticles();
    applyPortfolioEdits();
    initEnquiryForm();
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
        id: 'portfolio-default',
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

    const projectList = loadStoredList(ADMIN_PROJECTS_KEY, projectsData);

    if (!projectList.length) {
        const empty = document.createElement('p');
        empty.className = 'projects-empty';
        empty.textContent = 'No projects published yet. Please check back later.';
        container.appendChild(empty);
        return;
    }

    projectList.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.style.transitionDelay = `${index * 0.1}s`;

        const imageSrc = project.image || 'https://via.placeholder.com/300x200?text=Project+Image';
        const links = [];

        if (project.live) {
            links.push(`<a href="${project.live}" target="_blank" rel="noopener noreferrer">Live Demo</a>`);
        }

        if (project.github) {
            links.push(`<a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
        }

        card.innerHTML = `
            <img src="${imageSrc}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Project+Image'">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            ${links.length ? `<div class="project-links">${links.join('')}</div>` : ''}
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

function handleAdminAccess() {
    const currentPage = getCurrentPage();
    const isAuthenticated = isAdminAuthenticated();

    if (currentPage === ADMIN_LOGIN_PAGE && isAuthenticated) {
        window.location.replace(ADMIN_DASHBOARD_PAGE);
        return;
    }

    if (currentPage === ADMIN_DASHBOARD_PAGE && !isAuthenticated) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.replace(ADMIN_LOGIN_PAGE);
    }
}

function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

function isAdminAuthenticated() {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function initAdminLogin() {
    const adminForm = document.getElementById('admin-login-form');
    if (!adminForm) return;

    const status = document.getElementById('admin-login-status');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');

    adminForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput?.value.trim() || '';
        const password = passwordInput?.value || '';

        if (!username || !password) {
            setAdminStatus(status, 'Enter the admin username and password.', 'error');
            return;
        }

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
            setAdminStatus(status, 'Access granted. Redirecting to the admin dashboard...', 'success');
            adminForm.reset();

            window.setTimeout(() => {
                window.location.href = ADMIN_DASHBOARD_PAGE;
            }, 1200);

            return;
        }

        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminStatus(status, 'Access denied. Admin credentials are required.', 'error');
    });
}

function setAdminStatus(statusElement, message, type) {
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `admin-login-status ${type}`;
}

function initAdminDashboard() {
    const adminDashboard = document.querySelector('[data-admin-dashboard]');
    if (!adminDashboard) return;

    const clearSession = () => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
    };

    window.addEventListener('pagehide', clearSession);
    window.addEventListener('beforeunload', clearSession);

    const logoutButton = document.querySelector('[data-admin-logout]');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutAdmin();
        });
    }

    initAdminProjects();
    initAdminArticles();
    initAdminPortfolio();
    initAdminEnquiries();
}

function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    window.location.href = ADMIN_LOGIN_PAGE;
}

function initArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;

    const articles = loadStoredList(ADMIN_ARTICLES_KEY, []);
    container.innerHTML = '';

    if (!articles.length) {
        const empty = document.createElement('p');
        empty.className = 'articles-empty';
        empty.textContent = 'No articles published yet. Check back soon.';
        container.appendChild(empty);
        return;
    }

    articles.forEach((article, index) => {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.style.transitionDelay = `${index * 0.08}s`;

        card.innerHTML = `
            <div class="article-meta">
                <i class="bx bx-notepad"></i>
                <span>${article.date || 'Draft'}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            ${article.link ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" class="article-link">Read Article</a>` : ''}
        `;

        container.appendChild(card);
    });
}

function applyPortfolioEdits() {
    const stored = loadStoredObject(ADMIN_PORTFOLIO_KEY, {});
    const editable = document.querySelectorAll('[data-portfolio-key]');

    if (!editable.length) return;

    editable.forEach(element => {
        const key = element.dataset.portfolioKey;
        if (!key || !(key in stored)) return;
        element.textContent = stored[key];
    });
}

function initAdminProjects() {
    const form = document.getElementById('admin-project-form');
    const list = document.getElementById('admin-project-list');
    if (!form || !list) return;

    const fields = {
        id: form.querySelector('[data-admin-project-id]'),
        title: form.querySelector('#admin-project-title'),
        description: form.querySelector('#admin-project-description'),
        image: form.querySelector('#admin-project-image'),
        imageData: form.querySelector('#admin-project-image-data'),
        imageFile: form.querySelector('#admin-project-image-file'),
        live: form.querySelector('#admin-project-live'),
        github: form.querySelector('#admin-project-github')
    };

    const resetButton = form.querySelector('[data-admin-project-reset]');

    const render = () => {
        const projects = loadStoredList(ADMIN_PROJECTS_KEY, projectsData);
        list.innerHTML = '';

        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'admin-item';
            item.innerHTML = `
                <div>
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                </div>
                <div class="admin-item-actions">
                    <button type="button" class="btn btn-outline" data-edit="${project.id}">Edit</button>
                    <button type="button" class="btn btn-outline" data-delete="${project.id}">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
    };

    render();

    if (fields.imageFile) {
        fields.imageFile.addEventListener('change', () => {
            const file = fields.imageFile?.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    fields.imageData.value = reader.result;
                    fields.image.value = '';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const projects = loadStoredList(ADMIN_PROJECTS_KEY, projectsData);
        const id = fields.id.value || `project-${Date.now()}`;

        const updated = {
            id,
            title: fields.title.value.trim(),
            description: fields.description.value.trim(),
            image: fields.imageData.value || fields.image.value.trim(),
            live: fields.live.value.trim(),
            github: fields.github.value.trim()
        };

        if (!updated.title || !updated.description) return;

        const index = projects.findIndex(item => item.id === id);
        if (index >= 0) {
            projects[index] = updated;
        } else {
            projects.unshift(updated);
        }

        saveStoredList(ADMIN_PROJECTS_KEY, projects);
        form.reset();
        fields.id.value = '';
        fields.imageData.value = '';
        render();
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            form.reset();
            fields.id.value = '';
            fields.imageData.value = '';
        });
    }

    list.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const editId = target.getAttribute('data-edit');
        const deleteId = target.getAttribute('data-delete');
        const projects = loadStoredList(ADMIN_PROJECTS_KEY, projectsData);

        if (editId) {
            const project = projects.find(item => item.id === editId);
            if (!project) return;
            fields.id.value = project.id;
            fields.title.value = project.title;
            fields.description.value = project.description;
            if (project.image && project.image.startsWith('data:image')) {
                fields.imageData.value = project.image;
                fields.image.value = '';
            } else {
                fields.imageData.value = '';
                fields.image.value = project.image || '';
            }
            fields.live.value = project.live || '';
            fields.github.value = project.github || '';
            return;
        }

        if (deleteId) {
            const next = projects.filter(item => item.id !== deleteId);
            saveStoredList(ADMIN_PROJECTS_KEY, next);
            render();
        }
    });
}

function initAdminArticles() {
    const form = document.getElementById('admin-article-form');
    const list = document.getElementById('admin-article-list');
    if (!form || !list) return;

    const fields = {
        id: form.querySelector('[data-admin-article-id]'),
        title: form.querySelector('#admin-article-title'),
        date: form.querySelector('#admin-article-date'),
        excerpt: form.querySelector('#admin-article-excerpt'),
        link: form.querySelector('#admin-article-link')
    };

    const resetButton = form.querySelector('[data-admin-article-reset]');

    const render = () => {
        const articles = loadStoredList(ADMIN_ARTICLES_KEY, []);
        list.innerHTML = '';

        articles.forEach(article => {
            const item = document.createElement('div');
            item.className = 'admin-item';
            item.innerHTML = `
                <div>
                    <h4>${article.title}</h4>
                    <p>${article.excerpt}</p>
                </div>
                <div class="admin-item-actions">
                    <button type="button" class="btn btn-outline" data-article-edit="${article.id}">Edit</button>
                    <button type="button" class="btn btn-outline" data-article-delete="${article.id}">Delete</button>
                </div>
            `;
            list.appendChild(item);
        });
    };

    render();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const articles = loadStoredList(ADMIN_ARTICLES_KEY, []);
        const id = fields.id.value || `article-${Date.now()}`;

        const updated = {
            id,
            title: fields.title.value.trim(),
            date: fields.date.value.trim(),
            excerpt: fields.excerpt.value.trim(),
            link: fields.link.value.trim()
        };

        if (!updated.title || !updated.excerpt) return;

        const index = articles.findIndex(item => item.id === id);
        if (index >= 0) {
            articles[index] = updated;
        } else {
            articles.unshift(updated);
        }

        saveStoredList(ADMIN_ARTICLES_KEY, articles);
        form.reset();
        fields.id.value = '';
        render();
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            form.reset();
            fields.id.value = '';
        });
    }

    list.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const editId = target.getAttribute('data-article-edit');
        const deleteId = target.getAttribute('data-article-delete');
        const articles = loadStoredList(ADMIN_ARTICLES_KEY, []);

        if (editId) {
            const article = articles.find(item => item.id === editId);
            if (!article) return;
            fields.id.value = article.id;
            fields.title.value = article.title;
            fields.date.value = article.date || '';
            fields.excerpt.value = article.excerpt;
            fields.link.value = article.link || '';
            return;
        }

        if (deleteId) {
            const next = articles.filter(item => item.id !== deleteId);
            saveStoredList(ADMIN_ARTICLES_KEY, next);
            render();
        }
    });
}

function initAdminPortfolio() {
    const form = document.getElementById('admin-portfolio-form');
    if (!form) return;

    const fields = {
        name: form.querySelector('#admin-portfolio-name'),
        role: form.querySelector('#admin-portfolio-role'),
        intro: form.querySelector('#admin-portfolio-intro'),
        about1: form.querySelector('#admin-portfolio-about-1'),
        about2: form.querySelector('#admin-portfolio-about-2'),
        about3: form.querySelector('#admin-portfolio-about-3')
    };

    const resetButton = form.querySelector('[data-admin-portfolio-reset]');
    const clearButton = form.querySelector('[data-admin-portfolio-clear]');

    const stored = loadStoredObject(ADMIN_PORTFOLIO_KEY, {});
    Object.entries(fields).forEach(([key, input]) => {
        if (!input) return;
        input.value = stored[key] || '';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const next = {};

        Object.entries(fields).forEach(([key, input]) => {
            if (input && input.value.trim()) {
                next[key] = input.value.trim();
            }
        });

        saveStoredObject(ADMIN_PORTFOLIO_KEY, next);
        applyPortfolioEdits();
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            form.reset();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            localStorage.removeItem(ADMIN_PORTFOLIO_KEY);
            form.reset();
        });
    }
}

function loadStoredList(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return Array.isArray(fallback) ? fallback : [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        return fallback;
    }
}

function initEnquiryForm() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const nameInput = document.getElementById('enquiry-name');
    const emailInput = document.getElementById('enquiry-email');
    const subjectInput = document.getElementById('enquiry-subject');
    const messageInput = document.getElementById('enquiry-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const entry = {
            id: `enquiry-${Date.now()}`,
            name: nameInput?.value.trim() || '',
            email: emailInput?.value.trim() || '',
            subject: subjectInput?.value.trim() || '',
            message: messageInput?.value.trim() || '',
            createdAt: new Date().toLocaleString()
        };

        if (!entry.name || !entry.email || !entry.message) {
            showNotification('Please fill in your name, email, and message.', 'error');
            return;
        }

        const enquiries = loadStoredList(ADMIN_ENQUIRIES_KEY, []);
        enquiries.unshift(entry);
        saveStoredList(ADMIN_ENQUIRIES_KEY, enquiries);

        showNotification('Thanks! Your enquiry has been sent.', 'success');
        form.reset();
    });
}

function initAdminEnquiries() {
    const list = document.getElementById('admin-enquiry-list');
    if (!list) return;

    const clearButton = document.querySelector('[data-admin-enquiry-clear]');

    const render = () => {
        const enquiries = loadStoredList(ADMIN_ENQUIRIES_KEY, []);
        list.innerHTML = '';

        if (!enquiries.length) {
            const empty = document.createElement('p');
            empty.className = 'admin-empty';
            empty.textContent = 'No enquiries yet.';
            list.appendChild(empty);
            return;
        }

        enquiries.forEach(item => {
            const card = document.createElement('div');
            card.className = 'admin-item';
            const subject = item.subject || 'Enquiry';
            const hasEmail = Boolean(item.email);

            card.innerHTML = `
                <div>
                    <h4>${subject}</h4>
                    <p><strong>${item.name || 'Anonymous'}</strong> &bull; ${item.email || 'No email provided'}</p>
                    <p>${item.message}</p>
                    <p class="admin-item-meta">${item.createdAt || ''}</p>
                </div>
                <div class="admin-item-actions">
                    ${hasEmail ? `<button type="button" class="btn btn-outline" data-enquiry-reply="${item.id}">Reply</button>` : ''}
                    ${hasEmail ? `<button type="button" class="btn btn-outline" data-enquiry-copy-email="${item.id}">Copy Email</button>` : ''}
                    <button type="button" class="btn btn-outline" data-enquiry-copy-message="${item.id}">Copy Message</button>
                    <button type="button" class="btn btn-outline" data-enquiry-delete="${item.id}">Delete</button>
                </div>
            `;
            list.appendChild(card);
        });
    };

    render();

    list.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const deleteId = target.getAttribute('data-enquiry-delete');
        const replyId = target.getAttribute('data-enquiry-reply');
        const copyEmailId = target.getAttribute('data-enquiry-copy-email');
        const copyMessageId = target.getAttribute('data-enquiry-copy-message');
        const enquiries = loadStoredList(ADMIN_ENQUIRIES_KEY, []);

        const findEntry = (id) => enquiries.find(item => item.id === id);

        if (replyId) {
            const entry = findEntry(replyId);
            if (!entry || !entry.email) return;
            const subject = entry.subject || 'Enquiry';
            const replySubject = `Re: ${subject}`;
            const replyBody = `Hello ${entry.name || ''},\n\nThanks for your enquiry. I will get back to you shortly.\n\n---\nYour message:\n${entry.message || ''}`;
            const mailto = `mailto:${entry.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
            window.location.href = mailto;
            return;
        }

        if (copyEmailId) {
            const entry = findEntry(copyEmailId);
            if (!entry || !entry.email) return;
            navigator.clipboard?.writeText(entry.email);
            showNotification('Email copied to clipboard.', 'success');
            return;
        }

        if (copyMessageId) {
            const entry = findEntry(copyMessageId);
            if (!entry) return;
            const message = entry.message || '';
            navigator.clipboard?.writeText(message);
            showNotification('Message copied to clipboard.', 'success');
            return;
        }

        if (deleteId) {
            const next = enquiries.filter(item => item.id !== deleteId);
            saveStoredList(ADMIN_ENQUIRIES_KEY, next);
            render();
        }
    });

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            localStorage.removeItem(ADMIN_ENQUIRIES_KEY);
            render();
        });
    }
}

function saveStoredList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function loadStoredObject(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveStoredObject(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
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


