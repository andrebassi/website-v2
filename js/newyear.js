// ===== New Year Effects =====
(function() {
    const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
    const newYear = cfg.newYear || { startMonth: 12, startDay: 31, endMonth: 1, endDay: 7, forceTest: false };

    // Check URL param: ?newyear=true
    const urlParams = new URLSearchParams(window.location.search);
    const urlForceNewYear = urlParams.get('newyear') === 'true';

    const now = new Date();
    const spTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const forceTest = newYear.forceTest || urlForceNewYear;
    const currentMonth = forceTest ? newYear.startMonth : (spTime.getMonth() + 1); // 1-12
    const currentDay = forceTest ? newYear.startDay : spTime.getDate();

    // Check if it's New Year period (Dec 31 - Jan 7)
    const isNewYear = (currentMonth === newYear.startMonth && currentDay >= newYear.startDay) ||
                      (currentMonth === newYear.endMonth && currentDay <= newYear.endDay);

    if (!isNewYear) return;

    // Detect language from body data-lang attribute
    const lang = document.body.getAttribute('data-lang') || 'pt';
    const isEnglish = lang === 'en';
    const newYearMessage = isEnglish ? 'Happy New Year!' : 'Feliz Ano Novo!';

    // Hide particle canvas - fireworks replace it during New Year
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        particleCanvas.style.display = 'none';
    }

    // Inject New Year HTML elements
    const banner = document.createElement('div');
    banner.className = 'newyear-banner active';
    banner.id = 'newyear-banner';
    banner.innerHTML = `
        <div class="newyear-banner-content">
            <span class="newyear-emoji">🎉</span>
            <span class="newyear-text">${newYearMessage}</span>
            <span class="newyear-emoji">🎊</span>
        </div>
    `;
    document.body.insertBefore(banner, document.body.firstChild);

    const canvas = document.createElement('canvas');
    canvas.id = 'fireworks-canvas';
    canvas.className = 'active';
    document.body.insertBefore(canvas, banner.nextSibling);

    // Add new year active class to body
    document.body.classList.add('newyear-active');

    // Update greeting
    const greetingElement = document.querySelector('.hero-greeting');
    if (greetingElement) {
        const greetingText = isEnglish ? '✨ Happy New Year with peace, success and health! ✨' : '✨ Feliz Ano Novo com muita paz, sucesso e saúde! ✨';
        greetingElement.innerHTML = `<span class="newyear-greeting">${greetingText}</span>`;
        greetingElement.classList.add('newyear-greeting');
    }

    // Fireworks Canvas Animation
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Firework class
    class Firework {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.5) + 50;
            this.speed = Math.random() * 3 + 4;
            this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.trail = [];
            this.exploded = false;
            this.particles = [];
            this.hue = Math.random() * 360;
            this.brightness = Math.random() * 20 + 50;
        }

        update() {
            if (!this.exploded) {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 10) this.trail.shift();

                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.05; // gravity

                if (this.y <= this.targetY || this.vy >= 0) {
                    this.explode();
                }
            } else {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    const p = this.particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.03; // gravity
                    p.alpha -= 0.01;
                    p.size *= 0.98;

                    if (p.alpha <= 0) {
                        this.particles.splice(i, 1);
                    }
                }

                if (this.particles.length === 0) {
                    this.reset();
                }
            }
        }

        explode() {
            this.exploded = true;
            const particleCount = Math.random() * 50 + 50;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 / particleCount) * i;
                const speed = Math.random() * 4 + 2;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    size: Math.random() * 3 + 1,
                    hue: this.hue + Math.random() * 30 - 15
                });
            }
        }

        draw() {
            if (!this.exploded) {
                // Draw trail
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const alpha = i / this.trail.length;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${alpha})`;
                    ctx.fill();
                }

                // Draw firework head
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
                ctx.fill();
            } else {
                // Draw particles
                for (const p of this.particles) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
                    ctx.fill();
                }
            }
        }
    }

    // Create fireworks
    const fireworks = [];
    const maxFireworks = 5;

    for (let i = 0; i < maxFireworks; i++) {
        const fw = new Firework();
        fw.y = Math.random() * canvas.height; // Stagger initial positions
        fireworks.push(fw);
    }

    // Randomly add new fireworks
    function maybeAddFirework() {
        if (fireworks.length < maxFireworks && Math.random() < 0.03) {
            fireworks.push(new Firework());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        maybeAddFirework();

        for (const fw of fireworks) {
            fw.update();
            fw.draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
