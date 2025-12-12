// ===== Ubuntu Desktop Portfolio - André Bassi =====

class DesktopOS {
    constructor() {
        this.windowsContainer = document.getElementById('windows-container');
        this.windowTemplate = document.getElementById('window-template');
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 100;

        this.setupEventListeners();
        this.startClock();
        this.startWallpaperRotation();
    }

    startWallpaperRotation() {
        const wallpapers = document.querySelectorAll('.wallpaper');
        let currentIndex = 0;

        // Rotate every 10 seconds
        setInterval(() => {
            wallpapers[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % wallpapers.length;
            wallpapers[currentIndex].classList.add('active');
        }, 10000);
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
            document.getElementById('clock').textContent = now.toLocaleDateString('pt-BR', options);
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    setupEventListeners() {
        // Desktop icons - single or double click to open
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
                icon.classList.add('selected');
                const windowId = icon.dataset.window;
                if (windowId) this.openWindow(windowId);
            });
            icon.addEventListener('dblclick', () => {
                const windowId = icon.dataset.window;
                if (windowId) this.openWindow(windowId);
            });
        });

        // Dock items - single click
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => {
                const windowId = item.dataset.window;
                const link = item.dataset.link;

                if (link) {
                    window.open(link, '_blank');
                } else if (windowId) {
                    const existingWindow = this.windows.get(windowId);
                    if (existingWindow) {
                        if (existingWindow.element.classList.contains('minimized')) {
                            this.restoreWindow(windowId);
                        } else {
                            this.focusWindow(windowId);
                        }
                    } else {
                        this.openWindow(windowId);
                    }
                }
            });
        });

        // Click on desktop to deselect icons
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target.id === 'desktop' || e.target.classList.contains('desktop-icons')) {
                document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            }
        });
    }

    openWindow(windowId) {
        // Check if window already exists
        if (this.windows.has(windowId)) {
            this.focusWindow(windowId);
            return;
        }

        const content = this.getWindowContent(windowId);
        if (!content) return;

        // Create window from template
        const windowEl = this.windowTemplate.content.cloneNode(true).querySelector('.window');
        windowEl.dataset.id = windowId;

        // Set title
        windowEl.querySelector('.window-title').textContent = content.title;

        // Set content
        windowEl.querySelector('.window-content').innerHTML = content.html;

        // Window size
        const width = parseInt(content.width) || 750;
        const height = parseInt(content.height) || 550;

        // Center the window in the viewport (excluding dock and panel)
        const viewportWidth = window.innerWidth - 68; // subtract dock width
        const viewportHeight = window.innerHeight - 28; // subtract panel height
        const centerX = (viewportWidth - width) / 2;
        const centerY = (viewportHeight - height) / 2;

        windowEl.style.width = `${width}px`;
        windowEl.style.height = `${height}px`;
        windowEl.style.left = `${Math.max(20, centerX)}px`;
        windowEl.style.top = `${Math.max(40, centerY)}px`;

        // Add to container
        this.windowsContainer.appendChild(windowEl);

        // Store reference
        this.windows.set(windowId, {
            element: windowEl,
            minimized: false
        });

        // Setup window controls
        this.setupWindowControls(windowId, windowEl);

        // Make draggable and resizable
        this.makeDraggable(windowEl);
        this.makeResizable(windowEl);

        // Focus this window
        this.focusWindow(windowId);

        // Update dock
        this.updateDock(windowId, true);

        // Open maximized if specified
        if (content.maximized) {
            this.maximizeWindow(windowId);
        }

        // Setup click handlers for opensource cards
        if (windowId === 'opensource') {
            windowEl.querySelectorAll('.opensource-card').forEach(card => {
                card.addEventListener('click', () => {
                    const project = card.dataset.project;
                    if (project) this.openWindow(project);
                });
            });
        }
    }

    setupWindowControls(windowId, windowEl) {
        const closeBtn = windowEl.querySelector('.window-btn.close');
        const minimizeBtn = windowEl.querySelector('.window-btn.minimize');
        const maximizeBtn = windowEl.querySelector('.window-btn.maximize');

        closeBtn.addEventListener('click', () => this.closeWindow(windowId));
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => this.maximizeWindow(windowId));

        // Double click header to maximize
        windowEl.querySelector('.window-header').addEventListener('dblclick', (e) => {
            if (!e.target.classList.contains('window-btn')) {
                this.maximizeWindow(windowId);
            }
        });

        // Focus on click
        windowEl.addEventListener('mousedown', () => this.focusWindow(windowId));
    }

    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.style.animation = 'windowOpen 0.15s ease-out reverse';
        setTimeout(() => {
            windowData.element.remove();
            this.windows.delete(windowId);
            this.updateDock(windowId, false);
        }, 150);
    }

    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.add('minimized');
        windowData.minimized = true;
    }

    restoreWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.classList.remove('minimized');
        windowData.minimized = false;
        this.focusWindow(windowId);
    }

    maximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const el = windowData.element;

        if (el.classList.contains('maximized')) {
            el.classList.remove('maximized');
            if (windowData.prevStyle) {
                el.style.top = windowData.prevStyle.top;
                el.style.left = windowData.prevStyle.left;
                el.style.width = windowData.prevStyle.width;
                el.style.height = windowData.prevStyle.height;
            }
        } else {
            windowData.prevStyle = {
                top: el.style.top,
                left: el.style.left,
                width: el.style.width,
                height: el.style.height
            };
            el.classList.add('maximized');
        }
    }

    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        this.windows.forEach(w => w.element.classList.remove('focused'));
        windowData.element.classList.add('focused');
        windowData.element.style.zIndex = ++this.zIndex;
        this.activeWindow = windowId;
    }

    updateDock(windowId, isOpen) {
        const dockItem = document.querySelector(`.dock-item[data-window="${windowId}"]`);
        if (dockItem) {
            if (isOpen) {
                dockItem.classList.add('active');
            } else {
                dockItem.classList.remove('active');
            }
        }
    }

    makeDraggable(windowEl) {
        const header = windowEl.querySelector('.window-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return;
            if (windowEl.classList.contains('maximized')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = windowEl.offsetLeft;
            initialY = windowEl.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowEl.style.left = `${initialX + dx}px`;
            windowEl.style.top = `${initialY + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // Touch support
        header.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('window-btn')) return;
            if (windowEl.classList.contains('maximized')) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = windowEl.offsetLeft;
            initialY = windowEl.offsetTop;

            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        });

        const onTouchMove = (e) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            windowEl.style.left = `${initialX + dx}px`;
            windowEl.style.top = `${initialY + dy}px`;
        };

        const onTouchEnd = () => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }

    makeResizable(windowEl) {
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        windowEl.appendChild(handle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', (e) => {
            if (windowEl.classList.contains('maximized')) return;

            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = windowEl.offsetWidth;
            startHeight = windowEl.offsetHeight;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);

            windowEl.style.width = `${Math.max(500, width)}px`;
            windowEl.style.height = `${Math.max(400, height)}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    getWindowContent(windowId) {
        const contents = {
            about: {
                title: 'Sobre Mim',
                width: '650px',
                height: '550px',
                html: `
                    <div class="profile-header">
                        <img class="profile-photo" src="assets/photo.jpg" alt="André Bassi">
                        <div class="profile-info">
                            <h1>André Bassi</h1>
                            <p class="subtitle">Platform Engineer & Cloud Architect</p>
                        </div>
                    </div>
                    <p>Mais de 20 anos construindo infraestruturas escaláveis, plataformas Kubernetes e sistemas distribuídos. Apaixonado por open source e por resolver desafios complexos.</p>

                    <h2>O que eu faço</h2>
                    <ul>
                        <li>Arquitetura de plataformas cloud-native</li>
                        <li>Kubernetes em produção (18+ clusters)</li>
                        <li>Infraestrutura como Código</li>
                        <li>CI/CD & DevOps</li>
                        <li>Infraestrutura para IA/LLM</li>
                    </ul>

                    <h2>Links</h2>
                    <p>
                        <a href="https://github.com/andrebassi" target="_blank">GitHub</a> •
                        <a href="https://linkedin.com/in/andrebassi" target="_blank">LinkedIn</a>
                    </p>
                `
            },

            edgeproxy: {
                title: 'edgeProxy',
                width: '1000px',
                height: '700px',
                maximized: true,
                html: `
                    <div class="browser-window">
                        <div class="browser-toolbar">
                            <div class="browser-buttons">
                                <span class="browser-btn red"></span>
                                <span class="browser-btn yellow"></span>
                                <span class="browser-btn green"></span>
                            </div>
                            <div class="browser-address-bar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span class="browser-url">edgeproxy-docs.runner.codes</span>
                            </div>
                            <div class="browser-actions">
                                <a href="https://edgeproxy-docs.runner.codes/" target="_blank" class="browser-external" title="Abrir em nova aba">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15 3 21 3 21 9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <iframe src="https://edgeproxy-docs.runner.codes/" class="browser-iframe"></iframe>
                    </div>
                `
            },

            'infra-operator': {
                title: 'infra-operator',
                width: '1000px',
                height: '700px',
                maximized: true,
                html: `
                    <div class="browser-window">
                        <div class="browser-toolbar">
                            <div class="browser-buttons">
                                <span class="browser-btn red"></span>
                                <span class="browser-btn yellow"></span>
                                <span class="browser-btn green"></span>
                            </div>
                            <div class="browser-address-bar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span class="browser-url">infra-operator-aws.runner.codes</span>
                            </div>
                            <div class="browser-actions">
                                <a href="https://infra-operator-aws.runner.codes/" target="_blank" class="browser-external" title="Abrir em nova aba">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15 3 21 3 21 9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <iframe src="https://infra-operator-aws.runner.codes/" class="browser-iframe"></iframe>
                    </div>
                `
            },

            'runner-codes': {
                title: 'runner.codes',
                width: '1000px',
                height: '700px',
                maximized: true,
                html: `
                    <div class="browser-window">
                        <div class="browser-toolbar">
                            <div class="browser-buttons">
                                <span class="browser-btn red"></span>
                                <span class="browser-btn yellow"></span>
                                <span class="browser-btn green"></span>
                            </div>
                            <div class="browser-address-bar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span class="browser-url">runner.codes</span>
                            </div>
                            <div class="browser-actions">
                                <a href="https://runner.codes/" target="_blank" class="browser-external" title="Abrir em nova aba">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15 3 21 3 21 9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <iframe src="https://runner.codes/" class="browser-iframe"></iframe>
                    </div>
                `
            },

            opensource: {
                title: 'Open Source',
                width: '650px',
                height: '550px',
                html: `
                    <h1>Projetos Open Source</h1>
                    <p class="subtitle">Projetos que desenvolvo e mantenho.</p>

                    <div class="opensource-grid">
                        <div class="opensource-card" data-project="edgeproxy">
                            <div class="opensource-icon" style="background: linear-gradient(135deg, #3ECC5F 0%, #2DA44E 100%);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                                    <circle cx="5" cy="12" r="2"/>
                                    <circle cx="19" cy="6" r="2"/>
                                    <circle cx="19" cy="18" r="2"/>
                                    <path d="M7 12h6"/>
                                    <path d="M13 12l4-6"/>
                                    <path d="M13 12l4 6"/>
                                </svg>
                            </div>
                            <div class="opensource-info">
                                <h3>edgeProxy</h3>
                                <p>TCP proxy distribuído em Rust para edge computing com routing geo-aware.</p>
                                <div class="opensource-tags">
                                    <span class="tag green">Rust</span>
                                    <span class="tag">TCP Proxy</span>
                                    <span class="tag">GeoIP</span>
                                </div>
                            </div>
                        </div>

                        <div class="opensource-card" data-project="infra-operator">
                            <div class="opensource-icon" style="background: linear-gradient(135deg, #326CE5 0%, #4A90D9 100%);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="12" cy="12" r="4"/>
                                    <path d="M12 2v4"/>
                                    <path d="M12 18v4"/>
                                    <path d="M2 12h4"/>
                                    <path d="M18 12h4"/>
                                </svg>
                            </div>
                            <div class="opensource-info">
                                <h3>infra-operator</h3>
                                <p>Kubernetes operator em Go para automação de infraestrutura AWS.</p>
                                <div class="opensource-tags">
                                    <span class="tag blue">Go</span>
                                    <span class="tag">Kubernetes</span>
                                    <span class="tag">AWS</span>
                                </div>
                            </div>
                        </div>

                        <div class="opensource-card" data-project="runner-codes">
                            <div class="opensource-icon" style="background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
                                    <polygon points="10,8 16,12 10,16" fill="white" stroke="none"/>
                                </svg>
                            </div>
                            <div class="opensource-info">
                                <h3>runner.codes</h3>
                                <p>Ambiente de execução LLM com Firecracker microVMs e suporte a 40+ linguagens.</p>
                                <div class="opensource-tags">
                                    <span class="tag cyan">Go</span>
                                    <span class="tag">Firecracker</span>
                                    <span class="tag">LLM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },

            skills: {
                title: 'Skills',
                width: '650px',
                height: '550px',
                html: `
                    <h1>Tecnologias</h1>
                    <p class="subtitle">Stack técnico que utilizo no dia a dia.</p>

                    <h3>Cloud & Plataformas</h3>
                    <div class="tags">
                        <span class="tag">AWS</span>
                        <span class="tag">GCP</span>
                        <span class="tag">Azure</span>
                        <span class="tag">OCI</span>
                        <span class="tag">Cloudflare</span>
                    </div>

                    <h3>Containers & Orquestração</h3>
                    <div class="tags">
                        <span class="tag blue">Kubernetes</span>
                        <span class="tag blue">Docker</span>
                        <span class="tag blue">Helm</span>
                        <span class="tag blue">Istio</span>
                        <span class="tag blue">ArgoCD</span>
                    </div>

                    <h3>IaC & Automação</h3>
                    <div class="tags">
                        <span class="tag orange">Terraform</span>
                        <span class="tag orange">Ansible</span>
                        <span class="tag orange">Pulumi</span>
                        <span class="tag orange">GitLab CI</span>
                    </div>

                    <h3>Linguagens</h3>
                    <div class="tags">
                        <span class="tag green">Go</span>
                        <span class="tag green">Rust</span>
                        <span class="tag green">Python</span>
                        <span class="tag green">TypeScript</span>
                        <span class="tag green">Bash</span>
                    </div>

                    <h3>Observabilidade</h3>
                    <div class="tags">
                        <span class="tag purple">Prometheus</span>
                        <span class="tag purple">Grafana</span>
                        <span class="tag purple">Datadog</span>
                        <span class="tag purple">ELK Stack</span>
                    </div>
                `
            },

            experience: {
                title: 'Experiência',
                width: '650px',
                height: '550px',
                html: `
                    <h1>Experiência</h1>
                    <p class="subtitle">Mais de 20 anos construindo sistemas de alta escala.</p>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">20+</div>
                            <div class="stat-label">Anos de Experiência</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">18+</div>
                            <div class="stat-label">Clusters K8s em Prod</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Projetos Open Source</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">4</div>
                            <div class="stat-label">Cloud Providers</div>
                        </div>
                    </div>

                    <h2>Áreas de Atuação</h2>
                    <ul>
                        <li>Staff Platform Engineer</li>
                        <li>Cloud Native Architect</li>
                        <li>SRE & DevOps</li>
                        <li>Infraestrutura de IA/LLM</li>
                    </ul>

                    <h2>Multi-cloud</h2>
                    <div class="tags">
                        <span class="tag">AWS</span>
                        <span class="tag">GCP</span>
                        <span class="tag">Azure</span>
                        <span class="tag">OCI</span>
                    </div>
                `
            },

            contact: {
                title: 'Contato',
                width: '650px',
                height: '550px',
                html: `
                    <h1>Contato</h1>
                    <p class="subtitle">Vamos conversar! Estou sempre aberto a novos projetos.</p>

                    <div class="contact-links">
                        <a href="mailto:contato@andrebassi.com.br" class="contact-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span>contato@andrebassi.com.br</span>
                        </a>
                        <a href="https://linkedin.com/in/andrebassi" target="_blank" class="contact-item">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            <span>linkedin.com/in/andrebassi</span>
                        </a>
                        <a href="https://github.com/andrebassi" target="_blank" class="contact-item">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>github.com/andrebassi</span>
                        </a>
                    </div>

                    <h2>Como posso ajudar</h2>
                    <ul>
                        <li>Consultoria em arquitetura cloud</li>
                        <li>Mentoria em DevOps/SRE</li>
                        <li>Projetos Kubernetes</li>
                        <li>Colaboração open source</li>
                    </ul>
                `
            },

            'video-edge-resiliente': {
                title: 'Edge Resiliente',
                width: '854px',
                height: '520px',
                html: `
                    <div class="video-window">
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/oVotf8lFOJ0?rel=0&modestbranding=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe>
                    </div>
                `
            },

            'video-edgeproxy-caos': {
                title: 'Do Caos ao Controle com o edgeProxy',
                width: '854px',
                height: '520px',
                html: `
                    <div class="video-window">
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/Qf6TmgFsq1o?rel=0&modestbranding=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe>
                    </div>
                `
            },

            'video-runner-codes': {
                title: 'Runner Codes',
                width: '854px',
                height: '520px',
                html: `
                    <div class="video-window">
                        <iframe
                            src="https://www.youtube-nocookie.com/embed/72ngZRru15Q?rel=0&modestbranding=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe>
                    </div>
                `
            },

            terminal: {
                title: 'Terminal',
                width: '650px',
                height: '550px',
                html: `
                    <div class="terminal-content">
                        <div class="terminal-line">
                            <span class="terminal-prompt">andrebassi@ubuntu:~$</span>
                            <span class="terminal-command"> neofetch</span>
                        </div>
                        <div class="terminal-line terminal-output" style="margin-top: 10px;">
                            <pre style="color: #e95420; font-size: 11px;">
            .-/+oossssoo+/-.
        \`:+ssssssssssssssssss+:\`
      -+ssssssssssssssssssyyssss+-
    .osssssssssssssssssdMMMNysssso.
   /ssssssssssshdmmNNmmyNMMMMhssssss/
  +ssssssssshmydMMMMMMMNddddyssssssss+
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .osssssssssssssssssdMMMNysssso.
      -+sssssssssssssssyyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.
                            </pre>
                        </div>
                        <div class="terminal-line terminal-output" style="margin-left: 280px; margin-top: -280px;">
                            <span style="color: #e95420; font-weight: bold;">andrebassi</span>@<span style="color: #e95420; font-weight: bold;">portfolio</span><br>
                            <span style="color: #e95420;">-------------------------</span><br>
                            <span style="color: #e95420;">OS:</span> Ubuntu 24.04 LTS<br>
                            <span style="color: #e95420;">Host:</span> Kubernetes v1.28+<br>
                            <span style="color: #e95420;">Uptime:</span> 20+ years<br>
                            <span style="color: #e95420;">Packages:</span> 18+ clusters<br>
                            <span style="color: #e95420;">Shell:</span> bash 5.2<br>
                            <span style="color: #e95420;">Terminal:</span> GNOME Terminal<br>
                            <span style="color: #e95420;">CPU:</span> Multi-cloud @ 99.9%<br>
                            <span style="color: #e95420;">Memory:</span> Go, Rust, Python<br><br>
                            <span style="background: #e95420; padding: 0 8px;">&nbsp;</span>
                            <span style="background: #77216f; padding: 0 8px;">&nbsp;</span>
                            <span style="background: #0a8754; padding: 0 8px;">&nbsp;</span>
                            <span style="background: #f99b11; padding: 0 8px;">&nbsp;</span>
                            <span style="background: #3498db; padding: 0 8px;">&nbsp;</span>
                            <span style="background: #9b59b6; padding: 0 8px;">&nbsp;</span>
                        </div>
                        <div class="terminal-line" style="margin-top: 120px;">
                            <span class="terminal-prompt">andrebassi@ubuntu:~$</span>
                            <span class="terminal-command"> echo "Obrigado por visitar!"</span>
                        </div>
                        <div class="terminal-line terminal-success">
                            Obrigado por visitar!
                        </div>
                        <div class="terminal-line" style="margin-top: 10px;">
                            <span class="terminal-prompt">andrebassi@ubuntu:~$</span>
                            <span class="terminal-command" style="animation: blink 1s step-end infinite;">_</span>
                        </div>
                    </div>
                    <style>
                        @keyframes blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                        }
                    </style>
                `
            }
        };

        return contents[windowId];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.desktop = new DesktopOS();
});
