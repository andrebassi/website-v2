// ===== Room Content Definitions =====
const ROOM_CONTENT = {
    office: {
        title: 'Sobre Mim',
        icon: '💼',
        content: `
            <p>Olá! Eu sou <strong>André Bassi</strong>, Engenheiro de Plataforma e Arquiteto Cloud com mais de 20 anos de experiência.</p>

            <h3>O que eu faço</h3>
            <p>Construo infraestruturas escaláveis, plataformas Kubernetes e sistemas de IA/LLM. Sou apaixonado por open source e por resolver desafios complexos em sistemas distribuídos.</p>

            <h3>Especialidades</h3>
            <ul>
                <li>Kubernetes & Cloud Native (AWS, GCP, Azure)</li>
                <li>Infraestrutura como Código (Terraform, Ansible)</li>
                <li>CI/CD & DevOps</li>
                <li>Sistemas Distribuídos</li>
                <li>IA/LLM Infrastructure</li>
            </ul>

            <h3>Links</h3>
            <p>
                <a href="https://github.com/andrebassi" target="_blank">GitHub</a> |
                <a href="https://linkedin.com/in/andrebassi" target="_blank">LinkedIn</a>
            </p>
        `
    },

    library: {
        title: 'Artigos Técnicos',
        icon: '📚',
        content: `
            <p>Artigos e conteúdos sobre tecnologia, arquitetura e desenvolvimento.</p>

            <div class="project-grid">
                <a href="https://andrebassi.notion.site/" target="_blank" class="project-card">
                    <h4>📝 Notion - Artigos</h4>
                    <p>Coleção completa de artigos técnicos sobre Kubernetes, DevOps e Cloud.</p>
                </a>

                <div class="project-card">
                    <h4>🔒 Runtime Seguro para IA</h4>
                    <p>Como criar um ambiente seguro para executar código gerado por IA.</p>
                </div>

                <div class="project-card">
                    <h4>☸️ Segurança no Kubernetes</h4>
                    <p>Melhores práticas de segurança para clusters Kubernetes.</p>
                </div>

                <div class="project-card">
                    <h4>🐳 Dockerfiles Seguros</h4>
                    <p>Uma abordagem segura e eficiente para criar imagens Docker.</p>
                </div>
            </div>
        `
    },

    trophy: {
        title: 'Experiência',
        icon: '🏆',
        content: `
            <p>Mais de 20 anos construindo sistemas de alta escala.</p>

            <h3>Conquistas</h3>
            <ul>
                <li><strong>20+</strong> Anos de Experiência</li>
                <li><strong>18+</strong> Clusters Kubernetes em Produção</li>
                <li><strong>3</strong> Projetos Open Source</li>
                <li><strong>Multi-cloud:</strong> AWS, GCP, Azure, OCI</li>
            </ul>

            <h3>Áreas de Atuação</h3>
            <ul>
                <li>Staff Platform Engineer</li>
                <li>Cloud Native Architect</li>
                <li>SRE & DevOps</li>
                <li>Infraestrutura de IA/LLM</li>
            </ul>

            <h3>Tecnologias</h3>
            <div class="project-tags" style="margin-top: 10px;">
                <span class="tag">Kubernetes</span>
                <span class="tag">Docker</span>
                <span class="tag">Terraform</span>
                <span class="tag">Go</span>
                <span class="tag">Rust</span>
                <span class="tag">Python</span>
                <span class="tag">AWS</span>
                <span class="tag">GCP</span>
            </div>
        `
    },

    projects: {
        title: 'Projetos Open Source',
        icon: '💻',
        content: `
            <p>Ferramentas que construí para resolver problemas reais de infraestrutura.</p>

            <div class="project-grid">
                <a href="https://edgeproxy-docs.runner.codes/" target="_blank" class="project-card">
                    <h4>edgeProxy</h4>
                    <p>Proxy TCP distribuído de alta performance escrito em Rust.</p>
                    <div class="project-tags">
                        <span class="tag">Rust</span>
                        <span class="tag">TCP</span>
                        <span class="tag">Proxy</span>
                    </div>
                </a>

                <a href="https://github.com/andrebassi/infra-operator" target="_blank" class="project-card">
                    <h4>infra-operator</h4>
                    <p>Kubernetes Operator para gerenciar recursos AWS usando CRDs.</p>
                    <div class="project-tags">
                        <span class="tag">Go</span>
                        <span class="tag">Kubernetes</span>
                        <span class="tag">AWS</span>
                    </div>
                </a>

                <a href="https://runner.codes/" target="_blank" class="project-card">
                    <h4>runner.codes</h4>
                    <p>Execução segura de código em microVMs Firecracker isoladas.</p>
                    <div class="project-tags">
                        <span class="tag">Go</span>
                        <span class="tag">Firecracker</span>
                        <span class="tag">KVM</span>
                    </div>
                </a>
            </div>
        `
    },

    meeting: {
        title: 'Contato',
        icon: '🤝',
        content: `
            <p>Vamos conversar! Estou sempre aberto a discutir novos projetos e oportunidades.</p>

            <h3>Entre em contato</h3>
            <ul>
                <li>📧 <a href="mailto:contato@andrebassi.com.br">contato@andrebassi.com.br</a></li>
                <li>💼 <a href="https://linkedin.com/in/andrebassi" target="_blank">LinkedIn</a></li>
                <li>🐙 <a href="https://github.com/andrebassi" target="_blank">GitHub</a></li>
            </ul>

            <h3>O que posso ajudar</h3>
            <ul>
                <li>Consultoria em arquitetura cloud</li>
                <li>Mentoria em DevOps/SRE</li>
                <li>Projetos de infraestrutura Kubernetes</li>
                <li>Colaboração em projetos open source</li>
            </ul>
        `
    },

    skills: {
        title: 'Tecnologias',
        icon: '⚡',
        content: `
            <h3>Cloud & Plataformas</h3>
            <div class="project-tags">
                <span class="tag">AWS</span>
                <span class="tag">GCP</span>
                <span class="tag">Azure</span>
                <span class="tag">OCI</span>
                <span class="tag">Cloudflare</span>
            </div>

            <h3>Containers & Orquestração</h3>
            <div class="project-tags">
                <span class="tag">Kubernetes</span>
                <span class="tag">Docker</span>
                <span class="tag">Helm</span>
                <span class="tag">Istio</span>
                <span class="tag">ArgoCD</span>
            </div>

            <h3>IaC & Automação</h3>
            <div class="project-tags">
                <span class="tag">Terraform</span>
                <span class="tag">Ansible</span>
                <span class="tag">Pulumi</span>
                <span class="tag">GitLab CI</span>
            </div>

            <h3>Linguagens</h3>
            <div class="project-tags">
                <span class="tag">Go</span>
                <span class="tag">Rust</span>
                <span class="tag">Python</span>
                <span class="tag">TypeScript</span>
                <span class="tag">Bash</span>
            </div>

            <h3>Observabilidade</h3>
            <div class="project-tags">
                <span class="tag">Prometheus</span>
                <span class="tag">Grafana</span>
                <span class="tag">Datadog</span>
                <span class="tag">ELK Stack</span>
            </div>
        `
    },

    reception: {
        title: 'Bem-vindo!',
        icon: '🏠',
        content: `
            <p>Bem-vindo ao meu escritório virtual!</p>
            <p>Explore as diferentes salas para conhecer meu trabalho:</p>
            <ul>
                <li><strong>💼 Meu Escritório</strong> - Sobre mim</li>
                <li><strong>📚 Biblioteca</strong> - Artigos técnicos</li>
                <li><strong>🏆 Sala de Troféus</strong> - Experiência</li>
                <li><strong>💻 Sala de Projetos</strong> - Open Source</li>
                <li><strong>🤝 Sala de Reuniões</strong> - Contato</li>
                <li><strong>⚡ Sala de Skills</strong> - Tecnologias</li>
            </ul>
            <p>Use <strong>WASD</strong> ou as <strong>setas</strong> para se mover e <strong>ESPAÇO</strong> para interagir!</p>
        `
    }
};

window.ROOM_CONTENT = ROOM_CONTENT;
