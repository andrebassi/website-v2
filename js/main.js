// ===== Feature Toggle: Available for Work Badge =====
if (!CONFIG.availableForWork) {
    const tagline = document.querySelector('.nav-tagline');
    if (tagline) tagline.style.display = 'none';
}

// ===== Force PDF to open in browser (not download) =====
document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pdfUrl = new URL(link.href, window.location.origin).href;
        const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';

        if (isLocal) {
            // Local: open directly
            window.open(link.href, '_blank');
        } else {
            // Production: use Google Docs Viewer
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
            window.open(viewerUrl, '_blank');
        }
    });
});

// ===== Console Easter Egg =====
console.log(`
%c               _            _                    _
%c  __ _ _ _  __| |_ _ ___| |__ __ _ ______ (_)
%c / _\` | ' \\/ _\` | '_/ -_) '_ \\ _\` (_-<_-< | |
%c \\__,_|_||_\\__,_|_| \\___|_.__/\\__,_/__/__/ |_|

%cStaff Platform Engineer | Cloud Native Architect
%cLooking at the code? Nice! Check out my projects:
%c- github.com/andrebassi/edgeproxy
%c- github.com/andrebassi/infra-operator
%c- github.com/andrebassi/runner.codes
`,
'color: #3b82f6; font-weight: bold;',
'color: #6366f1; font-weight: bold;',
'color: #8b5cf6; font-weight: bold;',
'color: #a855f7; font-weight: bold;',
'color: #a1a1aa; font-size: 12px;',
'color: #71717a; font-size: 11px;',
'color: #dea584; font-size: 11px;',
'color: #00add8; font-size: 11px;',
'color: #ff6b35; font-size: 11px;'
);

// ===== Performance: Defer non-critical operations =====
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        document.querySelectorAll('.project-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const prefetch = document.createElement('link');
                prefetch.rel = 'prefetch';
                prefetch.href = href;
                document.head.appendChild(prefetch);
            }
        });
    });
}
