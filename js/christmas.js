// ===== Christmas Animation for Ubuntu Desktop =====
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
    const currentMonth = forceTest ? christmas.startMonth : (spTime.getMonth() + 1);
    const currentDay = forceTest ? christmas.startDay : spTime.getDate();

    // Check if within Christmas period
    const isChristmas = currentMonth === christmas.startMonth &&
                        currentDay >= christmas.startDay &&
                        currentDay <= christmas.endDay;

    if (!isChristmas) return;

    const christmasMessage = 'Feliz Natal!';

    // Inject Christmas banner
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
    document.body.appendChild(christmasBanner);

    // Inject Christmas lights below banner
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
    document.body.appendChild(lightsBar);

    const christmasCanvas = document.createElement('canvas');
    christmasCanvas.id = 'christmas-canvas';
    christmasCanvas.className = 'active';
    christmasCanvas.style.opacity = '0';
    document.body.appendChild(christmasCanvas);

    // Sequenced fade in
    setTimeout(() => {
        document.body.classList.add('christmas-active');
        christmasBanner.style.transition = 'opacity 1s ease-in';
        christmasBanner.style.opacity = '1';
    }, 1000);

    setTimeout(() => {
        lightsBar.style.transition = 'opacity 1s ease-in';
        lightsBar.style.opacity = '1';
    }, 2000);

    setTimeout(() => {
        christmasCanvas.style.transition = 'opacity 1s ease-in';
        christmasCanvas.style.opacity = '1';
        startSnowBuildup();
    }, 3000);

    setTimeout(() => {
        santa.x = window.innerWidth + 150;
        santa.y = santa.startY;
        santa.row = 0;
        santa.direction = -1;
        santa.visible = true;
    }, 5000);

    const ctx = christmasCanvas.getContext('2d');

    let width, height;
    let snowflakes = [];

    let santa = {
        x: 0,
        y: 0,
        width: 180,
        height: 90,
        time: 0,
        visible: false,
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

    let snowBuildupInterval = null;
    function startSnowBuildup() {
        const maxCount = Math.floor(width / 8);
        // Start with more snowflakes
        for (let i = 0; i < 10; i++) {
            snowflakes.push(new Snowflake(true));
        }

        snowBuildupInterval = setInterval(() => {
            if (snowflakes.length < maxCount) {
                snowflakes.push(new Snowflake(true));
                snowflakes.push(new Snowflake(true));
            } else {
                clearInterval(snowBuildupInterval);
            }
        }, 100);
    }

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

    let christmasAnimationId;
    let christmasActive = true;

    resizeChristmas();

    window.addEventListener('resize', resizeChristmas);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(christmasAnimationId);
        } else if (christmasActive) {
            animateChristmas();
        }
    });

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

    console.log('%c🎄 Feliz Natal! 🎅', 'color: #DC143C; font-size: 24px; font-weight: bold;');
    console.log('%c❄️ Neve caindo e Papai Noel voando! ❄️', 'color: #4169E1; font-size: 14px;');
})();
