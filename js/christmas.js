// ===== Christmas Animation =====
(function() {
    const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};
    const christmas = cfg.christmas || { startMonth: 12, startDay: 24, endMonth: 12, endDay: 26, forceTest: false };
    const newYear = cfg.newYear || { forceTest: false };

    // Check URL params: ?xmas=true or ?christmas=true
    const urlParams = new URLSearchParams(window.location.search);
    const urlForceXmas = urlParams.get('xmas') === 'true' || urlParams.get('christmas') === 'true';
    const urlForceNewYear = urlParams.get('newyear') === 'true';

    // Skip Christmas if New Year is forced (via config or URL)
    if (newYear.forceTest || urlForceNewYear) return;

    const now = new Date();
    const spTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const forceTest = christmas.forceTest || urlForceXmas;
    const currentMonth = forceTest ? christmas.startMonth : (spTime.getMonth() + 1); // 1-12
    const currentDay = forceTest ? christmas.startDay : spTime.getDate();

    // Check if within Christmas period
    const isChristmas = currentMonth === christmas.startMonth &&
                        currentDay >= christmas.startDay &&
                        currentDay <= christmas.endDay;

    if (!isChristmas) return;

    // Hide particle canvas - snow replaces it during Christmas
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        particleCanvas.style.display = 'none';
    }

    // Detect language from body data-lang attribute
    const lang = document.body.getAttribute('data-lang') || 'pt';
    const isEnglish = lang === 'en';
    const christmasMessage = isEnglish ? 'Merry Christmas!' : 'Feliz Natal!';

    // Inject Christmas banner (hidden initially)
    const christmasBanner = document.createElement('div');
    christmasBanner.className = 'christmas-banner active';
    christmasBanner.id = 'christmas-banner';
    christmasBanner.style.opacity = '0';
    christmasBanner.innerHTML = `
        <div class="christmas-banner-content">
            <span class="christmas-emoji">🎄</span>
            <span class="christmas-text">${christmasMessage}</span>
            <span class="christmas-emoji">🎅</span>
        </div>
    `;
    document.body.insertBefore(christmasBanner, document.body.firstChild);

    // Inject Christmas lights below banner (hidden initially)
    const lightColors = ['red', 'yellow', 'green', 'blue', 'pink'];
    let lightsHTML = '';
    for (let i = 0; i < 6; i++) {
        lightColors.forEach(color => {
            lightsHTML += `<span class="light light-${color}"></span>`;
        });
    }
    const lightsBar = document.createElement('div');
    lightsBar.className = 'christmas-lights-bar active';
    lightsBar.style.opacity = '0';
    lightsBar.innerHTML = `<div class="christmas-lights">${lightsHTML}</div>`;
    document.body.insertBefore(lightsBar, christmasBanner.nextSibling);

    const christmasCanvas = document.createElement('canvas');
    christmasCanvas.id = 'christmas-canvas';
    christmasCanvas.className = 'active';
    christmasCanvas.style.opacity = '0';
    document.body.insertBefore(christmasCanvas, christmasBanner.nextSibling);

    // Sequenced fade in (starts after 3s on page)
    // 1. Banner appears after 3s
    setTimeout(() => {
        document.body.classList.add('christmas-active');
        christmasBanner.style.transition = 'opacity 1s ease-in';
        christmasBanner.style.opacity = '1';
    }, 3000);

    // 2. Lights appear after 5s (3s + 2s)
    setTimeout(() => {
        lightsBar.style.transition = 'opacity 1s ease-in';
        lightsBar.style.opacity = '1';
    }, 5000);

    // 3. Snow (canvas) appears after 6s (3s + 3s) and snow starts building
    setTimeout(() => {
        christmasCanvas.style.transition = 'opacity 1s ease-in';
        christmasCanvas.style.opacity = '1';
        // Start adding snowflakes gradually after canvas is visible
        startSnowBuildup();
    }, 6000);

    // 4. Santa appears after 8s (3s + 5s)
    setTimeout(() => {
        // Reset Santa to start from right edge
        santa.x = window.innerWidth + 150;
        santa.y = santa.startY;
        santa.row = 0;
        santa.direction = -1;
        santa.visible = true;
    }, 8000);

    // Change greeting to Christmas message
    const greetingElement = document.querySelector('.hero-greeting');
    const greetingText = isEnglish ? 'Merry Christmas!' : 'Feliz Natal a todos!';

    if (greetingElement) {
        greetingElement.textContent = greetingText;
        greetingElement.classList.add('christmas-greeting');
    }

    // Add Christmas greeting animation styles
    const christmasStyle = document.createElement('style');
    christmasStyle.id = 'christmas-greeting-style';
    christmasStyle.textContent = `
        .christmas-greeting {
            background: linear-gradient(90deg, #ff6b6b, #ffd700, #69db7c, #ff6b6b);
            background-size: 300% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: christmas-shimmer 3s ease-in-out infinite;
            font-weight: 700 !important;
        }

        @keyframes christmas-shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(christmasStyle);

    const ctx = christmasCanvas.getContext('2d');

    let width, height;
    let snowflakes = [];

    let santa = {
        x: 0,
        y: 0,
        width: 180,
        height: 90,
        time: 0,
        visible: false,  // Starts hidden, appears after 5s
        speed: 3,
        direction: -1,
        row: 0,
        rowHeight: 120,
        startY: 80
    };

    function resizeChristmas() {
        width = christmasCanvas.width = window.innerWidth;
        height = christmasCanvas.height = window.innerHeight;
        santa.x = width + 150;
        santa.y = santa.startY;
        santa.row = 0;
        santa.direction = -1;
    }

    // Snowflake class
    class Snowflake {
        constructor(startFromTop = false) {
            this.reset(startFromTop);
        }

        reset(startFromTop = true) {
            this.x = Math.random() * width;
            this.y = startFromTop ? -Math.random() * 100 : Math.random() * height;
            this.radius = Math.random() * 3.5 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 1.5 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.swing = Math.random() * 1.5;
            this.swingSpeed = Math.random() * 0.02 + 0.005;
            this.angle = Math.random() * Math.PI * 2;
        }

        update() {
            this.angle += this.swingSpeed;
            this.x += Math.cos(this.angle) * this.swing + this.speedX;
            this.y += this.speedY;

            if (this.y > height + 10) {
                this.y = -10;
                this.x = Math.random() * width;
            }
            if (this.x > width + 10) this.x = -10;
            if (this.x < -10) this.x = width + 10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function createSnowflakes() {
        snowflakes = []; // Just initialize empty
    }

    let snowBuildupInterval = null;
    function startSnowBuildup() {
        const maxCount = Math.floor(width / 25); // Moderate snow (~50-80 flakes)
        // Start with 2 snowflakes
        snowflakes.push(new Snowflake(true));
        snowflakes.push(new Snowflake(true));

        // Gradually add snowflakes - one every 300ms
        snowBuildupInterval = setInterval(() => {
            if (snowflakes.length < maxCount) {
                snowflakes.push(new Snowflake(true));
            } else {
                clearInterval(snowBuildupInterval);
            }
        }, 300);
    }

    // Draw Santa with sleigh
    function drawSanta() {
        if (!santa.visible) return;

        const x = santa.x;
        const y = santa.y;
        const scale = 0.7;

        ctx.save();
        ctx.translate(x, y);

        if (santa.direction === 1) {
            ctx.scale(-scale, scale);
        } else {
            ctx.scale(scale, scale);
        }

        // Sleigh body
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.quadraticCurveTo(-20, 70, 0, 80);
        ctx.lineTo(120, 80);
        ctx.quadraticCurveTo(150, 75, 140, 50);
        ctx.lineTo(0, 50);
        ctx.fill();

        // Sleigh runner
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-10, 85);
        ctx.quadraticCurveTo(60, 95, 150, 85);
        ctx.stroke();

        // Sleigh decoration
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(5, 52, 130, 5);

        // Santa body
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.ellipse(70, 35, 25, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Santa head
        ctx.fillStyle = '#FFE4C4';
        ctx.beginPath();
        ctx.arc(70, 5, 18, 0, Math.PI * 2);
        ctx.fill();

        // Santa hat
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.moveTo(52, 5);
        ctx.lineTo(70, -25);
        ctx.lineTo(88, 5);
        ctx.fill();

        // Hat pom-pom
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(70, -25, 6, 0, Math.PI * 2);
        ctx.fill();

        // Hat trim
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(50, 0, 40, 8);

        // Beard
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(55, 10);
        ctx.quadraticCurveTo(70, 35, 85, 10);
        ctx.quadraticCurveTo(70, 25, 55, 10);
        ctx.fill();

        // Belt
        ctx.fillStyle = '#000000';
        ctx.fillRect(50, 35, 40, 8);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(65, 33, 10, 12);

        // Reindeer
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(-60, 50, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(-85, 40, 10, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Antlers
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-85, 32);
        ctx.lineTo(-95, 20);
        ctx.lineTo(-100, 25);
        ctx.moveTo(-95, 20);
        ctx.lineTo(-90, 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-80, 32);
        ctx.lineTo(-70, 20);
        ctx.lineTo(-65, 25);
        ctx.moveTo(-70, 20);
        ctx.lineTo(-75, 15);
        ctx.stroke();

        // Reindeer legs
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-50, 58);
        ctx.lineTo(-50, 75);
        ctx.moveTo(-70, 58);
        ctx.lineTo(-70, 75);
        ctx.stroke();

        // Red nose (Rudolph!)
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-95, 42, 4, 0, Math.PI * 2);
        ctx.fill();

        // Reins
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-40, 50);
        ctx.lineTo(0, 55);
        ctx.stroke();

        // Gift bag
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        ctx.moveTo(100, 30);
        ctx.lineTo(95, 55);
        ctx.lineTo(130, 55);
        ctx.lineTo(125, 30);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(105, 28, 15, 5);

        // Stars trailing
        const time = Date.now() / 100;
        for (let i = 0; i < 5; i++) {
            const starX = 160 + i * 25 + Math.sin(time + i) * 5;
            const starY = 60 + Math.cos(time + i * 0.5) * 10;
            const starSize = 3 - i * 0.4;
            const starOpacity = 1 - i * 0.15;

            ctx.fillStyle = `rgba(255, 215, 0, ${starOpacity})`;
            drawStar(starX, starY, starSize);
        }

        ctx.restore();
    }

    function drawStar(cx, cy, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = cx + Math.cos(angle) * size;
            const y = cy + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    function updateSanta() {
        if (!santa.visible) return;
        santa.time += 0.02;
        santa.x += santa.speed * santa.direction;
        santa.y = santa.startY + (santa.row * santa.rowHeight) + Math.sin(santa.time * 2) * 15;

        if (santa.direction === -1 && santa.x < -200) {
            santa.row++;
            santa.direction = 1;
            if (santa.startY + (santa.row * santa.rowHeight) > height - 100) {
                santa.row = 0;
                santa.x = -200;
            }
        } else if (santa.direction === 1 && santa.x > width + 200) {
            santa.row++;
            santa.direction = -1;
            if (santa.startY + (santa.row * santa.rowHeight) > height - 100) {
                santa.row = 0;
                santa.x = width + 200;
            }
        }
    }

    // Animation loop
    let christmasAnimationId;
    let christmasActive = true;

    // Initialize
    resizeChristmas();
    createSnowflakes();

    window.addEventListener('resize', () => {
        resizeChristmas();
        createSnowflakes();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(christmasAnimationId);
        } else if (christmasActive) {
            animateChristmas();
        }
    });

    // Total animation time: 30 seconds (8s sequence + 22s visible) then fade out
    const totalDuration = 30000;

    function fadeOutAll() {
        // Stop adding new snowflakes
        if (snowBuildupInterval) {
            clearInterval(snowBuildupInterval);
        }

        // Phase 1: Slow down snow, start accelerating Santa gently
        snowflakes.forEach(flake => {
            flake.speedY *= 0.2;
            flake.opacity *= 0.7;
        });
        santa.speed = 4;

        // Gradually accelerate Santa during fade out (smooth)
        const accelerateSanta = setInterval(() => {
            santa.speed += 0.15;
        }, 300);

        // Phase 2: Fade lights slowly, Santa a bit faster
        setTimeout(() => {
            santa.speed = 5;
            if (christmasBanner) {
                christmasBanner.style.transition = 'opacity 4s ease-out';
                christmasBanner.style.opacity = '0.3';
            }
            if (lightsBar) {
                lightsBar.style.transition = 'opacity 4s ease-out';
                lightsBar.style.opacity = '0.3';
            }
        }, 2000);

        // Phase 3: Fade canvas slowly, Santa flying away
        setTimeout(() => {
            santa.speed = 7;
            christmasCanvas.style.transition = 'opacity 5s ease-out';
            christmasCanvas.style.opacity = '0';

            if (christmasBanner) {
                christmasBanner.style.transition = 'opacity 3s ease-out, transform 4s ease-out';
                christmasBanner.style.opacity = '0';
                christmasBanner.style.transform = 'translateY(-100%)';
            }
            if (lightsBar) {
                lightsBar.style.transition = 'opacity 3s ease-out, transform 4s ease-out';
                lightsBar.style.opacity = '0';
                lightsBar.style.transform = 'translateY(-100%)';
            }
        }, 5000);

        // Phase 3.5: Santa at final speed
        setTimeout(() => {
            santa.speed = 10;
            clearInterval(accelerateSanta);
        }, 7000);

        // Phase 4: Clean up
        setTimeout(() => {
            christmasActive = false;
            cancelAnimationFrame(christmasAnimationId);
            christmasCanvas.classList.remove('active');

            if (christmasBanner) {
                christmasBanner.classList.remove('active');
            }

            if (lightsBar) {
                lightsBar.classList.remove('active');
            }

            document.body.classList.remove('christmas-active');

            // Show particle canvas again
            if (particleCanvas) {
                particleCanvas.style.display = 'block';
            }

            // Revert greeting text back to time-based greeting with smooth fade
            if (greetingElement) {
                greetingElement.style.transition = 'opacity 1s ease-out';
                greetingElement.style.opacity = '0';

                setTimeout(() => {
                    greetingElement.classList.remove('christmas-greeting');

                    // Get current São Paulo time for greeting
                    const spNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
                    const spHour = spNow.getHours();
                    let currentGreeting;
                    if (spHour >= 6 && spHour < 12) {
                        currentGreeting = 'Bom dia, eu sou';
                    } else if (spHour >= 12 && spHour < 18) {
                        currentGreeting = 'Boa tarde, eu sou';
                    } else {
                        currentGreeting = 'Boa noite, eu sou';
                    }
                    greetingElement.textContent = currentGreeting;

                    // Remove Christmas style
                    const styleEl = document.getElementById('christmas-greeting-style');
                    if (styleEl) styleEl.remove();

                    // Fade in smoothly
                    requestAnimationFrame(() => {
                        greetingElement.style.transition = 'opacity 1.5s ease-in';
                        greetingElement.style.opacity = '1';
                    });
                }, 1000);
            }

            console.log('%c🎄 Até o próximo Natal! 🎅', 'color: #DC143C; font-size: 18px;');
        }, 10000);
    }

    setTimeout(fadeOutAll, totalDuration);

    function animateChristmas() {
        if (!christmasActive) return;

        ctx.clearRect(0, 0, width, height);

        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        updateSanta();
        drawSanta();

        christmasAnimationId = requestAnimationFrame(animateChristmas);
    }

    animateChristmas();

    const consoleMsg1 = isEnglish ? '🎄 Merry Christmas! 🎅' : '🎄 Feliz Natal! 🎅';
    const consoleMsg2 = isEnglish ? '❄️ Snow falling and Santa flying! ❄️' : '❄️ Neve caindo e Papai Noel voando! ❄️';
    console.log(`%c${consoleMsg1}`, 'color: #DC143C; font-size: 24px; font-weight: bold;');
    console.log(`%c${consoleMsg2}`, 'color: #4169E1; font-size: 14px;');
})();
