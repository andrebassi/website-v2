// ===== Dynamic Greeting based on São Paulo time =====
function updateGreeting() {
    const greetingElement = document.querySelector('.hero-greeting');
    if (!greetingElement) return;

    // Get current time in São Paulo timezone
    const now = new Date();
    const spTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const hour = spTime.getHours();

    let greeting;
    if (hour >= 6 && hour < 12) {
        greeting = 'Bom dia, eu sou';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Boa tarde, eu sou';
    } else {
        greeting = 'Boa noite, eu sou';
    }

    // Only update if not in Christmas mode
    if (!greetingElement.classList.contains('christmas-greeting')) {
        greetingElement.textContent = greeting;
    }

    // Store original greeting for Christmas revert
    greetingElement.dataset.originalGreeting = greeting;
}

// Update greeting on load
updateGreeting();

// Update greeting every minute to catch time changes
setInterval(updateGreeting, 60000);

// ===== Typewriter Effect =====
const lang = document.body.getAttribute('data-lang') || 'pt';
const isEnglish = lang === 'en';

const typewriterTexts = isEnglish ? [
    'Staff Platform Engineer',
    'Cloud Native Architect',
    'Open Source Contributor',
    'AI/LLM Infrastructure',
    'Distributed Systems Expert'
] : [
    'Engenheiro de Plataforma',
    'Arquiteto Cloud Native',
    'Contribuidor Open Source',
    'Infraestrutura IA/LLM',
    'Especialista em Sistemas Distribuídos'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.querySelector('.typewriter');

function typeWriter() {
    const currentText = typewriterTexts[textIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typewriterTexts.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

if (typewriterElement) {
    setTimeout(typeWriter, 1000);
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .timeline-item, .skills-group').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

const style = document.createElement('style');
style.textContent = `
    .project-card.visible,
    .timeline-item.visible,
    .skills-group.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Stats Counter Animation =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const value = parseInt(stat.textContent);
                if (!isNaN(value) && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, value);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== Hide Scroll Indicator After Scroll =====
const scrollIndicator = document.querySelector('.hero-scroll');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100 && scrollIndicator) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
    } else if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
    }
});

// ===== Project Cards Hover Effect =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== Clickable Project Cards =====
document.querySelectorAll('.project-card[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        window.open(card.dataset.href, '_blank');
    });
});

// ===== Respect Reduced Motion =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('.project-card, .timeline-item, .skills-group').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
    });
}

// ===== Articles Carousel with Pause =====
(function() {
    const carouselItems = document.querySelector('.carousel-items');
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselItems || !carouselTrack) return;

    const items = carouselItems.querySelectorAll('.carousel-item:not(.duplicate)');
    const totalItems = items.length / 2; // Half are duplicates
    let currentIndex = 0;
    let isPaused = false;

    function getItemWidth() {
        const item = items[0];
        if (!item) return 0;
        const style = getComputedStyle(carouselItems);
        const gap = parseFloat(style.gap) || 32;
        return item.offsetWidth + gap;
    }

    function scrollToItem(index) {
        const item = items[index];
        if (!item) return;
        const style = getComputedStyle(carouselItems);
        const gap = parseFloat(style.gap) || 32;

        // Calcula posição do item
        let itemPosition = 0;
        for (let i = 0; i < index; i++) {
            itemPosition += items[i].offsetWidth + gap;
        }

        // Centraliza o item mais à esquerda do centro (avança mais antes de parar)
        const trackWidth = carouselTrack.offsetWidth;
        const itemWidth = item.offsetWidth;
        const offset = itemPosition - (trackWidth * 0.30) + (itemWidth / 2);

        carouselItems.style.transform = `translateX(-${Math.max(0, offset)}px)`;
    }

    function nextItem() {
        if (isPaused) return;
        currentIndex++;
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            carouselItems.style.transition = 'none';
            scrollToItem(0);
            setTimeout(() => {
                carouselItems.style.transition = 'transform 0.8s ease-in-out';
            }, 50);
        } else {
            scrollToItem(currentIndex);
        }
    }

    // Pause on hover
    carouselItems.addEventListener('mouseenter', () => isPaused = true);
    carouselItems.addEventListener('mouseleave', () => isPaused = false);

    // Drag to navigate - fluid version
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let startTranslate = 0;

    const carousel = document.querySelector('.articles-carousel');

    function getTranslateX() {
        const style = window.getComputedStyle(carouselItems);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
    }

    function setTranslateX(x) {
        carouselItems.style.transform = `translateX(${x}px)`;
    }

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.clientX;
        startTranslate = getTranslateX();
        carouselItems.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.touches[0].clientX;
        startTranslate = getTranslateX();
        carouselItems.style.transition = 'none';
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - startX;
        currentTranslate = startTranslate + diff;
        setTranslateX(currentTranslate);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;
        currentTranslate = startTranslate + diff;
        setTranslateX(currentTranslate);
    }, { passive: true });

    function endDrag(endX) {
        if (!isDragging) return;
        isDragging = false;
        isPaused = false;
        carousel.style.cursor = 'grab';
        carouselItems.style.transition = 'transform 0.5s ease-out';

        const diff = startX - endX;
        if (diff > 30) {
            // Dragged left - next
            currentIndex++;
            if (currentIndex >= totalItems) currentIndex = 0;
        } else if (diff < -30) {
            // Dragged right - previous
            currentIndex--;
            if (currentIndex < 0) currentIndex = totalItems - 1;
        }
        // Always go forward, never snap back
        scrollToItem(currentIndex);
    }

    document.addEventListener('mouseup', (e) => endDrag(e.clientX));
    document.addEventListener('touchend', (e) => endDrag(e.changedTouches[0].clientX));

    // Set grab cursor
    carousel.style.cursor = 'grab';
    carousel.style.userSelect = 'none';

    // Start carousel
    scrollToItem(0);
    setInterval(nextItem, 5000);
})();
