// ===== Terminal Portfolio - André Bassi =====

class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.body = document.getElementById('terminal-body');
        this.pathEl = document.querySelector('.prompt .path');

        this.currentPath = '~';
        this.history = [];
        this.historyIndex = -1;

        this.setupEventListeners();
        this.showWelcome();
    }

    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Focus input when clicking terminal
        this.body.addEventListener('click', () => {
            this.input.focus();
        });

        // Mobile hint disappears after first command
        this.input.addEventListener('input', () => {
            const hint = document.querySelector('.mobile-hint');
            if (hint) hint.style.opacity = '0.3';
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand(this.input.value);
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            this.clear();
        }
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        this.historyIndex += direction;

        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.history[this.historyIndex];
    }

    autoComplete() {
        const value = this.input.value.toLowerCase();
        const commands = Object.keys(this.commands);
        const match = commands.find(cmd => cmd.startsWith(value));
        if (match) {
            this.input.value = match;
        }
    }

    executeCommand(cmdLine) {
        const trimmed = cmdLine.trim();

        // Echo command
        this.print(`<span class="prompt-echo">andrebassi@portfolio:${this.currentPath}$</span> <span class="cmd-echo">${this.escapeHtml(trimmed)}</span>`, 'command');

        if (!trimmed) {
            this.scrollToBottom();
            return;
        }

        // Add to history
        if (this.history[this.history.length - 1] !== trimmed) {
            this.history.push(trimmed);
        }
        this.historyIndex = this.history.length;

        // Parse command and args
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Execute
        if (this.commands[cmd]) {
            this.commands[cmd].call(this, args);
        } else {
            this.print(`bash: ${cmd}: comando não encontrado. Digite 'help' para ver comandos disponíveis.`, 'error');
        }

        this.scrollToBottom();
    }

    print(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
    }

    printRaw(html) {
        const container = document.createElement('div');
        container.innerHTML = html;
        this.output.appendChild(container);
    }

    clear() {
        this.output.innerHTML = '';
    }

    scrollToBottom() {
        this.body.scrollTop = this.body.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updatePath(path) {
        this.currentPath = path;
        this.pathEl.textContent = path;
    }

    showWelcome() {
        const ascii = `
<pre class="ascii-art">
    _              _          ____                 _
   / \\   _ __   __| |_ __ ___| __ )  __ _ ___ ___(_)
  / _ \\ | '_ \\ / _\` | '__/ _ \\  _ \\ / _\` / __/ __| |
 / ___ \\| | | | (_| | | |  __/ |_) | (_| \\__ \\__ \\ |
/_/   \\_\\_| |_|\\__,_|_|  \\___|____/ \\__,_|___/___/_|
</pre>`;

        const welcome = `
<div class="welcome-banner">
${ascii}
<span class="version">Platform Engineer & Cloud Architect v20.0.0</span>

<span style="color: var(--gray)">────────────────────────────────────────────────────</span>

<span style="color: var(--green)">Bem-vindo ao meu portfolio interativo!</span>
Use comandos de terminal para navegar.

<span style="color: var(--yellow)">Comandos rápidos:</span>
  <span style="color: var(--cyan)">whoami</span>      → Sobre mim
  <span style="color: var(--cyan)">ls</span>          → Listar diretórios
  <span style="color: var(--cyan)">cat skills</span>  → Ver minhas skills
  <span style="color: var(--cyan)">help</span>        → Todos os comandos

<span style="color: var(--gray)">────────────────────────────────────────────────────</span>
</div>`;

        this.printRaw(welcome);
        this.scrollToBottom();
    }

    // ===== COMMANDS =====
    commands = {
        help: function() {
            const helpText = `
<div class="file-content">
<h2>Comandos Disponíveis</h2>

<h3>Navegação</h3>
<ul>
<li><span style="color: var(--cyan)">ls</span> - Listar conteúdo do diretório</li>
<li><span style="color: var(--cyan)">cd [dir]</span> - Mudar de diretório</li>
<li><span style="color: var(--cyan)">cat [arquivo]</span> - Ver conteúdo de um arquivo</li>
<li><span style="color: var(--cyan)">pwd</span> - Mostrar diretório atual</li>
</ul>

<h3>Informações</h3>
<ul>
<li><span style="color: var(--cyan)">whoami</span> - Sobre mim</li>
<li><span style="color: var(--cyan)">skills</span> - Minhas tecnologias</li>
<li><span style="color: var(--cyan)">projects</span> - Projetos open source</li>
<li><span style="color: var(--cyan)">experience</span> - Experiência profissional</li>
<li><span style="color: var(--cyan)">contact</span> - Informações de contato</li>
</ul>

<h3>Sistema</h3>
<ul>
<li><span style="color: var(--cyan)">clear</span> - Limpar terminal (ou Ctrl+L)</li>
<li><span style="color: var(--cyan)">history</span> - Histórico de comandos</li>
<li><span style="color: var(--cyan)">neofetch</span> - Informações do sistema</li>
<li><span style="color: var(--cyan)">matrix</span> - Easter egg</li>
</ul>

<p style="color: var(--gray); margin-top: 15px;">Dica: Use ↑↓ para navegar no histórico e Tab para autocompletar</p>
</div>`;
            this.printRaw(helpText);
        },

        whoami: function() {
            const content = `
<div class="file-content">
<h2>André Bassi</h2>
<p><strong>Platform Engineer & Cloud Architect</strong></p>
<p>Mais de 20 anos construindo infraestruturas escaláveis, plataformas Kubernetes e sistemas distribuídos. Apaixonado por open source e por resolver desafios complexos.</p>

<h3>O que eu faço</h3>
<ul>
<li>Arquitetura de plataformas cloud-native</li>
<li>Kubernetes em produção (18+ clusters)</li>
<li>Infraestrutura como Código</li>
<li>CI/CD & DevOps</li>
<li>Infraestrutura para IA/LLM</li>
</ul>

<h3>Links</h3>
<ul>
<li><a href="https://github.com/andrebassi" target="_blank">github.com/andrebassi</a></li>
<li><a href="https://linkedin.com/in/andrebassi" target="_blank">linkedin.com/in/andrebassi</a></li>
</ul>
</div>`;
            this.printRaw(content);
        },

        skills: function() {
            const content = `
<div class="file-content">
<h2>Skills & Tecnologias</h2>

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
<span class="tag cyan">Kubernetes</span>
<span class="tag cyan">Docker</span>
<span class="tag cyan">Helm</span>
<span class="tag cyan">Istio</span>
<span class="tag cyan">ArgoCD</span>
</div>

<h3>IaC & Automação</h3>
<div class="tags">
<span class="tag yellow">Terraform</span>
<span class="tag yellow">Ansible</span>
<span class="tag yellow">Pulumi</span>
<span class="tag yellow">GitLab CI</span>
</div>

<h3>Linguagens</h3>
<div class="tags">
<span class="tag">Go</span>
<span class="tag">Rust</span>
<span class="tag">Python</span>
<span class="tag">TypeScript</span>
<span class="tag">Bash</span>
</div>

<h3>Observabilidade</h3>
<div class="tags">
<span class="tag">Prometheus</span>
<span class="tag">Grafana</span>
<span class="tag">Datadog</span>
<span class="tag">ELK Stack</span>
</div>
</div>`;
            this.printRaw(content);
        },

        projects: function() {
            const content = `
<div class="file-content">
<h2>Projetos Open Source</h2>
<p>Ferramentas que construí para resolver problemas reais de infraestrutura.</p>

<div class="project-list">
<div class="project-item">
<h4>edgeProxy</h4>
<p>Proxy TCP distribuído de alta performance escrito em Rust. Suporta load balancing, health checks e hot reload de configuração.</p>
<div class="tags">
<span class="tag">Rust</span>
<span class="tag">TCP</span>
<span class="tag">Proxy</span>
</div>
<a href="https://edgeproxy-docs.runner.codes/" target="_blank">→ Documentação</a>
</div>

<div class="project-item">
<h4>infra-operator</h4>
<p>Kubernetes Operator para gerenciar recursos AWS usando CRDs. Automatiza criação de buckets S3, filas SQS e mais.</p>
<div class="tags">
<span class="tag">Go</span>
<span class="tag">Kubernetes</span>
<span class="tag">AWS</span>
</div>
<a href="https://github.com/andrebassi/infra-operator" target="_blank">→ GitHub</a>
</div>

<div class="project-item">
<h4>runner.codes</h4>
<p>Execução segura de código em microVMs Firecracker isoladas. Ideal para plataformas de coding e avaliação técnica.</p>
<div class="tags">
<span class="tag">Go</span>
<span class="tag">Firecracker</span>
<span class="tag">KVM</span>
</div>
<a href="https://runner.codes/" target="_blank">→ Site</a>
</div>
</div>
</div>`;
            this.printRaw(content);
        },

        experience: function() {
            const content = `
<div class="file-content">
<h2>Experiência</h2>
<p>Mais de 20 anos construindo sistemas de alta escala.</p>

<div class="stats-grid">
<div class="stat-item">
<div class="stat-value">20+</div>
<div class="stat-label">ANOS DE EXPERIÊNCIA</div>
</div>
<div class="stat-item">
<div class="stat-value">18+</div>
<div class="stat-label">CLUSTERS K8S EM PROD</div>
</div>
<div class="stat-item">
<div class="stat-value">3</div>
<div class="stat-label">PROJETOS OPEN SOURCE</div>
</div>
<div class="stat-item">
<div class="stat-value">4</div>
<div class="stat-label">CLOUD PROVIDERS</div>
</div>
</div>

<h3>Áreas de Atuação</h3>
<ul>
<li>Staff Platform Engineer</li>
<li>Cloud Native Architect</li>
<li>SRE & DevOps</li>
<li>Infraestrutura de IA/LLM</li>
</ul>

<h3>Multi-cloud</h3>
<div class="tags">
<span class="tag">AWS</span>
<span class="tag">GCP</span>
<span class="tag">Azure</span>
<span class="tag">OCI</span>
</div>
</div>`;
            this.printRaw(content);
        },

        contact: function() {
            const content = `
<div class="file-content">
<h2>Contato</h2>
<p>Vamos conversar! Estou sempre aberto a discutir novos projetos e oportunidades.</p>

<h3>Entre em contato</h3>
<ul>
<li><span style="color: var(--yellow)">Email:</span> <a href="mailto:contato@andrebassi.com.br">contato@andrebassi.com.br</a></li>
<li><span style="color: var(--yellow)">LinkedIn:</span> <a href="https://linkedin.com/in/andrebassi" target="_blank">linkedin.com/in/andrebassi</a></li>
<li><span style="color: var(--yellow)">GitHub:</span> <a href="https://github.com/andrebassi" target="_blank">github.com/andrebassi</a></li>
</ul>

<h3>Como posso ajudar</h3>
<ul>
<li>Consultoria em arquitetura cloud</li>
<li>Mentoria em DevOps/SRE</li>
<li>Projetos de infraestrutura Kubernetes</li>
<li>Colaboração em projetos open source</li>
</ul>
</div>`;
            this.printRaw(content);
        },

        ls: function(args) {
            const directories = {
                '~': [
                    { name: 'about/', type: 'directory' },
                    { name: 'projects/', type: 'directory' },
                    { name: 'skills/', type: 'directory' },
                    { name: 'experience/', type: 'directory' },
                    { name: 'contact/', type: 'directory' },
                    { name: 'README.md', type: 'file' },
                    { name: '.gitconfig', type: 'file' },
                ],
                '~/about': [
                    { name: 'bio.txt', type: 'file' },
                    { name: 'links.txt', type: 'file' },
                ],
                '~/projects': [
                    { name: 'edgeproxy/', type: 'directory' },
                    { name: 'infra-operator/', type: 'directory' },
                    { name: 'runner.codes/', type: 'directory' },
                ],
                '~/skills': [
                    { name: 'cloud.txt', type: 'file' },
                    { name: 'kubernetes.txt', type: 'file' },
                    { name: 'languages.txt', type: 'file' },
                    { name: 'tools.txt', type: 'file' },
                ],
                '~/experience': [
                    { name: 'stats.txt', type: 'file' },
                    { name: 'roles.txt', type: 'file' },
                ],
                '~/contact': [
                    { name: 'email.txt', type: 'file' },
                    { name: 'social.txt', type: 'file' },
                ],
            };

            const items = directories[this.currentPath] || directories['~'];
            let output = '<div style="display: flex; flex-wrap: wrap;">';

            for (const item of items) {
                const typeClass = item.type === 'directory' ? 'directory' : 'file';
                output += `<span class="dir-entry ${typeClass}">${item.name}</span>`;
            }

            output += '</div>';
            this.printRaw(output);
        },

        cd: function(args) {
            const target = args[0];

            if (!target || target === '~') {
                this.updatePath('~');
                return;
            }

            if (target === '..') {
                if (this.currentPath !== '~') {
                    const parts = this.currentPath.split('/');
                    parts.pop();
                    this.updatePath(parts.join('/') || '~');
                }
                return;
            }

            const validPaths = ['~/about', '~/projects', '~/skills', '~/experience', '~/contact'];
            let newPath = target.startsWith('~') ? target : `${this.currentPath}/${target}`.replace('//', '/');
            newPath = newPath.replace(/\/$/, ''); // Remove trailing slash

            if (validPaths.includes(newPath) || newPath === '~') {
                this.updatePath(newPath);
            } else {
                this.print(`bash: cd: ${target}: Diretório não encontrado`, 'error');
            }
        },

        cat: function(args) {
            const file = args[0];

            if (!file) {
                this.print('cat: faltando operando de arquivo', 'error');
                return;
            }

            // Direct file shortcuts
            const shortcuts = {
                'skills': 'skills',
                'projects': 'projects',
                'experience': 'experience',
                'contact': 'contact',
                'whoami': 'whoami',
                'README.md': 'readme',
                'bio.txt': 'whoami',
            };

            if (shortcuts[file]) {
                this.commands[shortcuts[file]].call(this, []);
                return;
            }

            this.print(`cat: ${file}: Arquivo não encontrado. Tente 'ls' para ver arquivos disponíveis.`, 'error');
        },

        pwd: function() {
            this.print(this.currentPath, 'info');
        },

        clear: function() {
            this.clear();
        },

        history: function() {
            if (this.history.length === 0) {
                this.print('Histórico vazio', 'muted');
                return;
            }

            this.history.forEach((cmd, i) => {
                this.print(`  ${i + 1}  ${cmd}`, 'muted');
            });
        },

        neofetch: function() {
            const ascii = `
<pre class="ascii-art" style="color: var(--cyan);">
       _,met$$$$$gg.
    ,g$$$$$$$$$$$$$$$P.
  ,g$$P"     """Y$$.".
 ,$$P'              \`$$$.
',$$P       ,ggs.     \`$$b:
\`d$$'     ,$P"'   .    $$$
 $$P      d$'     ,    $$P
 $$:      $$.   -    ,d$$'
 $$;      Y$b._   _,d$P'
 Y$$.    \`.\`"Y$$$$P"'
 \`$$b      "-.__
  \`Y$$
   \`Y$$.
     \`$$b.
       \`Y$$b.
          \`"Y$b._
              \`"""
</pre>`;

            const info = `
<div style="display: flex; gap: 30px; align-items: flex-start; flex-wrap: wrap;">
${ascii}
<div style="font-size: 13px;">
<span style="color: var(--cyan)">andrebassi</span>@<span style="color: var(--cyan)">portfolio</span>
<span style="color: var(--gray)">─────────────────────</span>
<span style="color: var(--cyan)">OS:</span> Linux (Cloud Native)
<span style="color: var(--cyan)">Host:</span> Kubernetes v1.28+
<span style="color: var(--cyan)">Kernel:</span> Platform Engineering
<span style="color: var(--cyan)">Uptime:</span> 20+ years
<span style="color: var(--cyan)">Packages:</span> 18+ K8s clusters
<span style="color: var(--cyan)">Shell:</span> bash 5.0
<span style="color: var(--cyan)">Terminal:</span> Portfolio v2.0
<span style="color: var(--cyan)">CPU:</span> Multi-cloud @ 99.9%
<span style="color: var(--cyan)">Memory:</span> Go, Rust, Python

<div style="margin-top: 10px;">
<span style="background: #ff5555; padding: 0 8px;">&nbsp;</span>
<span style="background: #ffbd2e; padding: 0 8px;">&nbsp;</span>
<span style="background: #27c93f; padding: 0 8px;">&nbsp;</span>
<span style="background: #00d4ff; padding: 0 8px;">&nbsp;</span>
<span style="background: #bd93f9; padding: 0 8px;">&nbsp;</span>
<span style="background: #ff79c6; padding: 0 8px;">&nbsp;</span>
</div>
</div>
</div>`;
            this.printRaw(info);
        },

        matrix: function() {
            this.print('Iniciando Matrix...', 'success');
            document.body.classList.add('glitch');
            setTimeout(() => {
                document.body.classList.remove('glitch');
                this.print('Wake up, Neo...', 'success');
                this.print('The Matrix has you...', 'success');
                this.print('Follow the white rabbit.', 'success');
                this.print('', '');
                this.print('Knock, knock, Neo.', 'muted');
            }, 300);
        },

        sudo: function(args) {
            if (args[0] === 'rm' && args.includes('-rf') && args.includes('/')) {
                this.print('Nice try! 😏', 'warning');
                this.print('Permissão negada: Você não tem superpoderes aqui.', 'error');
            } else if (args.join(' ').includes('hire')) {
                this.print('Permissão concedida! 🎉', 'success');
                this.print('Envie um email para: contato@andrebassi.com.br', 'info');
            } else {
                this.print(`[sudo] senha para andrebassi: `, 'muted');
                setTimeout(() => {
                    this.print('andrebassi não está no arquivo sudoers. Este incidente será relatado.', 'error');
                }, 500);
            }
        },

        echo: function(args) {
            this.print(args.join(' '), 'info');
        },

        date: function() {
            this.print(new Date().toLocaleString('pt-BR'), 'info');
        },

        uptime: function() {
            this.print('up 20 years, 0 users, load average: 0.42, 0.42, 0.42', 'info');
        },

        man: function(args) {
            const cmd = args[0];
            if (!cmd) {
                this.print('Qual manual você quer ver? Ex: man whoami', 'warning');
                return;
            }

            if (this.commands[cmd]) {
                this.print(`${cmd.toUpperCase()}(1)                     User Commands                     ${cmd.toUpperCase()}(1)`, 'info');
                this.print('', '');
                this.print('NAME', 'info');
                this.print(`       ${cmd} - comando do portfolio interativo`, 'muted');
                this.print('', '');
                this.print('SYNOPSIS', 'info');
                this.print(`       ${cmd} [opções]`, 'muted');
                this.print('', '');
                this.print('DESCRIPTION', 'info');
                this.print('       Execute o comando para ver mais informações.', 'muted');
            } else {
                this.print(`Nenhuma entrada de manual para ${cmd}`, 'error');
            }
        },

        exit: function() {
            this.print('logout', 'muted');
            this.print('', '');
            this.print('Obrigado por visitar! 👋', 'success');
            this.print('', '');
            setTimeout(() => {
                this.print('Connection to portfolio closed.', 'muted');
            }, 1000);
        },

        // Aliases
        about: function() { this.commands.whoami.call(this); },
        bio: function() { this.commands.whoami.call(this); },
        tech: function() { this.commands.skills.call(this); },
        stack: function() { this.commands.skills.call(this); },
        exp: function() { this.commands.experience.call(this); },
        trabalho: function() { this.commands.experience.call(this); },
        contato: function() { this.commands.contact.call(this); },
        projetos: function() { this.commands.projects.call(this); },
        repos: function() { this.commands.projects.call(this); },
        github: function() {
            this.print('Abrindo GitHub...', 'info');
            window.open('https://github.com/andrebassi', '_blank');
        },
        linkedin: function() {
            this.print('Abrindo LinkedIn...', 'info');
            window.open('https://linkedin.com/in/andrebassi', '_blank');
        },
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});
