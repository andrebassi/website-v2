// ===== Mobile Navigation Toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== URL Mapping: Hash to Friendly URLs =====
const urlMap = {
    '#': '/',
    '#projects': '/opensource',
    '#highlights': '/destaques',
    '#about': '/sobre',
    '#experience': '/experiencia',
    '#contact': '/contato'
};

// Handle logo click to go home
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ section: null }, '', '/');
});

const reverseUrlMap = {
    '/opensource': '#projects',
    '/projetos': '#projects',
    '/destaques': '#highlights',
    '/sobre': '#about',
    '/experiencia': '#experience',
    '/contato': '#contact'
};

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const hash = this.getAttribute('href');
        const target = document.querySelector(hash);
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL to friendly path
            const friendlyUrl = urlMap[hash] || hash;
            history.pushState({ section: hash }, '', friendlyUrl);
        }
    });
});

// ===== Navbar Background on Scroll =====
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Add active nav styles
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-links a.active {
        color: var(--accent-primary) !important;
    }
`;
document.head.appendChild(navStyle);

// ===== Handle URL on Page Load =====
// Scrolls to section when accessing URLs like /opensource or /#projects
function scrollToSection(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function handleUrlOnLoad() {
    // Check for hash first (from redirects like /#projects)
    if (window.location.hash) {
        setTimeout(() => scrollToSection(window.location.hash), 100);
        // Update URL to friendly path
        const friendlyUrl = urlMap[window.location.hash];
        if (friendlyUrl) {
            history.replaceState({ section: window.location.hash }, '', friendlyUrl);
        }
        return;
    }

    // Check for path-based URL (direct access to /opensource)
    const path = window.location.pathname;
    const hash = reverseUrlMap[path];
    if (hash) {
        setTimeout(() => scrollToSection(hash), 100);
    }
}

// Run on page load
window.addEventListener('load', handleUrlOnLoad);

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        scrollToSection(event.state.section);
    } else {
        // Check current path
        const hash = reverseUrlMap[window.location.pathname];
        if (hash) {
            scrollToSection(hash);
        } else if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
