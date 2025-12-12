# andrebassi.com.br

Personal portfolio website showcasing my work as a Staff Platform Engineer & Cloud Native Architect.

## Features

- **Bilingual Support** - Automatic language detection (PT-BR/EN) based on visitor's country via Cloudflare geo headers
- **Seasonal Animations** - Christmas snow effect with Santa Claus and New Year fireworks
- **Smooth Navigation** - Single Page Application feel with friendly URLs (`/opensource`, `/contact`, etc.)
- **Responsive Design** - Mobile-first approach with dark theme
- **Typewriter Effect** - Dynamic role display with smooth animations
- **Performance Optimized** - Lightweight, no frameworks, pure vanilla JS/CSS

## Tech Stack

- **Hosting**: Cloudflare Pages
- **Language Detection**: Cloudflare Pages Functions (Edge Middleware)
- **Styling**: Custom CSS with CSS Variables
- **Animations**: Canvas API for particles, snow and fireworks
- **Routing**: History API for SPA-like navigation

## Project Structure

```
├── index.html              # Portuguese version (default)
├── index-en.html           # English version
├── css/
│   ├── base.css            # CSS variables and reset
│   ├── navigation.css      # Header and nav styles
│   ├── hero.css            # Hero section
│   ├── projects.css        # Projects grid
│   ├── about.css           # About section
│   └── seasonal.css        # Christmas/New Year styles
├── js/
│   ├── animations.js       # Typewriter and scroll effects
│   ├── navigation.js       # URL routing (PT-BR)
│   ├── navigation-en.js    # URL routing (EN)
│   ├── particles.js        # Background particles
│   ├── christmas.js        # Christmas snow animation
│   └── newyear.js          # New Year fireworks
├── functions/
│   └── _middleware.js      # Cloudflare geo-based language detection
├── _headers                # Cache control headers
├── _redirects              # SPA routing rules
└── Taskfile.yaml           # Deployment automation
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (for Wrangler CLI)
- [Task](https://taskfile.dev/) (optional, for automation)

### Local Development

```bash
# Install Wrangler CLI
npm install -g wrangler

# Run local dev server
npx wrangler pages dev .
```

### Deploy

```bash
# Using Task
task deploy

# Or directly with Wrangler
npx wrangler pages deploy . --project-name=andrebassi-website
```

### Testing Seasonal Effects

Add query parameters to test seasonal animations:

- Christmas: `?xmas=true`
- New Year: `?newyear=true`
- Language: `?lang=en` or `?lang=ptbr`

## Seasonal Animations

### Christmas (Dec 24-26)
- Animated snowfall with gradual intensity buildup
- Santa Claus flying across the screen with his sleigh
- Christmas lights bar below the banner
- Festive greeting messages

### New Year (Dec 31 - Jan 7)
- Colorful fireworks display
- Celebratory banner and messages

## License

MIT License - feel free to use this as inspiration for your own portfolio!

---

**Live Site**: [andrebassi.com.br](https://andrebassi.com.br)
