# desktop.andrebassi.com.br

Ubuntu Desktop-style portfolio website showcasing my work as a Staff Platform Engineer & Cloud Native Architect.

## Features

- **Ubuntu Desktop Interface** - Interactive desktop environment with draggable/resizable windows
- **Bilingual Support** - Automatic language detection (PT-BR/EN) based on visitor's country via Cloudflare geo headers
- **Seasonal Animations** - Christmas snow with Santa Claus and New Year fireworks
- **Window System** - Multiple windows with minimize/maximize/close functionality
- **Desktop Icons** - Click to open different sections (About, Skills, Experience, Contact, etc.)
- **Dock Bar** - Quick access to main windows and external links
- **Wallpaper Rotation** - Auto-rotating DevOps/Infrastructure themed backgrounds
- **Performance Optimized** - Lightweight, no frameworks, pure vanilla JS/CSS

## Tech Stack

- **Hosting**: Cloudflare Pages
- **Language Detection**: Cloudflare Pages Functions (Edge Middleware)
- **Styling**: Custom CSS with Ubuntu-inspired design
- **Window Manager**: Custom JavaScript class (DesktopOS)
- **Animations**: Canvas API for snow and fireworks

## Project Structure

```
├── index.html              # Portuguese version (default)
├── index-en.html           # English version
├── css/
│   ├── desktop.css         # Ubuntu desktop styles
│   ├── christmas.css       # Christmas effects styles
│   └── newyear.css         # New Year effects styles
├── js/
│   ├── desktop.js          # Window manager (PT-BR)
│   ├── desktop-en.js       # Window manager (EN)
│   ├── christmas.js        # Christmas snow animation
│   ├── newyear.js          # New Year fireworks
│   └── variables.js        # Season configuration
├── functions/
│   └── _middleware.js      # Cloudflare geo-based language detection
├── assets/
│   └── photo.jpg           # Profile photo
├── docs/
│   ├── carta-apresentacao.pdf
│   └── curriculo.pdf
└── Taskfile.yaml           # Deployment automation
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (for Wrangler CLI)
- [Task](https://taskfile.dev/) (optional, for automation)

### Local Development

```bash
# Simple HTTP server
task dev

# Or with Python
python3 -m http.server 8080
```

### Deploy

```bash
# Using Task
export CLOUDFLARE_API_TOKEN=your_token
task deploy

# Or directly with Wrangler
npx wrangler pages deploy . --project-name=andrebassi-website-v2
```

### Testing Seasonal Effects

Add query parameters to test seasonal animations:

- Christmas: `?xmas=true`
- New Year: `?newyear=true`
- Language: `?lang=en` or `?lang=ptbr`

## Windows Available

| Window | Description |
|--------|-------------|
| About Me | Personal introduction and links |
| Technical Articles | Notion articles on DevOps topics |
| Open Source | Projects I maintain (edgeProxy, infra-operator, runner.codes) |
| Skills | Technology stack |
| Experience | Career stats and expertise areas |
| Contact | Email, LinkedIn, GitHub |
| Terminal | Neofetch-style system info |
| Videos | YouTube videos embedded |
| PDFs | Cover letter and resume |

## Seasonal Animations

### Christmas (Dec 24-26)
- Animated snowfall with gradual intensity buildup
- Santa Claus flying across the screen
- Christmas lights at bottom of screen
- Festive greeting banner

### New Year (Dec 31 - Jan 7)
- Colorful fireworks display at varying heights
- Celebratory banner with wishes

## License

MIT License - feel free to use this as inspiration for your own portfolio!

---

**Live Site**: [desktop.andrebassi.com.br](https://desktop.andrebassi.com.br)
