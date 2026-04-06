# LavanTech — Technology Stack

## Overview
LavanTech is a **static, browser-based web application** with no build tools or backend infrastructure. It delivers interactive guides for laundry care through vanilla JavaScript, custom CSS, and HTML.

---

## Frontend Framework & Libraries

### Core Architecture
- **Framework**: None — **Pure Vanilla JavaScript** (ES6+)
- **Runtime**: Browser-only (DOM API, Web APIs)
- **Approach**: Multi-page static site (HTML files + shared JS/CSS)

### Key Capabilities
- DOM manipulation via `querySelector()`, `querySelectorAll()`
- Event handling with `addEventListener()`
- Intersection Observer API for scroll-triggered animations
- localStorage for persistent state (progress tracking)
- CSS custom properties (CSS variables) for theming

---

## CSS Approach

### Design System
- **Type**: Custom CSS with design tokens
- **Framework**: None (no Tailwind, Bootstrap, or utility frameworks)
- **Fonts**:
  - **Headings**: Playfair Display (700, 800 weights) via Google Fonts
  - **Body**: Nunito (400, 500, 600, 700, 800 weights) via Google Fonts
  - Loaded via single `@import` in styles.css

### Design Tokens
- **Color Palette**: 
  - Primary: `#C95272` (rosé pink)
  - Secondary: `#6B9E83` (sage green)
  - Accent: `#E8854A` (warm orange)
  - Lavender: `#9B8ECF`
  - Background: `#FEF6EE` (warm cream)
  - 24 semantic color tokens defined as CSS custom properties

- **Spacing System**: 12 scales (sp-1 to sp-16, ranging 4px to 64px)
- **Border Radius**: 5 scales (sm: 10px, md: 14px, lg: 20px, xl: 28px, full: 9999px)
- **Shadows**: 5 variants (clay-sm, clay-md, clay-lg, clay-card, hover) with warm pink tint
- **Transitions**: 3 speeds (fast: 150ms, normal: 250ms, slow: 400ms)

### Stylesheets
1. **css/styles.css** (24KB)
   - Global reset, typography, layout components
   - Design system tokens
   - Responsive utilities
   
2. **css/guide.css** (17.8KB)
   - Page-specific styles for guide pages
   - Animations (slideUp, popIn, bounceEmoji, floatBlob, stepAppear)
   - Guide-specific hero, progress bar, step items

### Animation & Effects
- **Keyframes**: 10+ custom animations for entrance effects, confetti, floating elements
- **Techniques**: 
  - CSS transitions for micro-interactions
  - Cubic-bezier timing functions
  - Transform-based animations (translate, scale, rotate)
  - Backdrop blur filters for glass-morphism effect

---

## Build Tools & Deployment

### Build System
- **Type**: None — No build pipeline
- **Bundling**: Not applicable
- **Transpilation**: Not used (pure ES6 JavaScript)
- **Development**: File-based (direct edit, open in browser)

### Package Manager
- **Type**: None
- **Dependencies**: Managed via CDN (Google Fonts only)
- **Version Management**: Not tracked

### Deployment
- **Type**: Static file hosting
- **Files**: All source files are production-ready
- **No build step required**

---

## Runtime Environment

### Browser APIs Used
- **DOM APIs**: `querySelector`, `querySelectorAll`, `classList`, `addEventListener`
- **Intersection Observer API**: Scroll-triggered animations for entrance effects
- **localStorage**: Persistent progress tracking across page reloads
- **`window.location`**: URL-based page routing
- **Timing APIs**: `setTimeout` for animation delays
- **Mutation Observer API**: Watching completion banner visibility

### Browser Requirements
- ES6+ support (arrow functions, const/let, template literals)
- Intersection Observer support
- localStorage support
- Modern CSS support (custom properties, backdrop-filter, grid, flexbox)
- **Minimum**: Chrome/Safari/Firefox/Edge from 2015+

### No External Frameworks
- No jQuery
- No React, Vue, Svelte
- No TypeScript
- No Node.js/Express backend

---

## File Organization

```
/Users/brenenho/Lavar roupa/
├── index.html                  # Homepage with calculator
├── brancas.html                # White clothes guide
├── pretas.html                 # Black clothes guide
├── coloridas.html              # Colored clothes guide
├── toalhas.html                # Towels guide
├── cama.html                   # Bedding guide
├── edredom.html                # Duvet/comforter guide
├── percarbonato.html           # Oxygen bleach guide
├── utensilios.html             # Tools/supplies guide
├── css/
│   ├── styles.css              # Global design system & components
│   └── guide.css               # Guide-page specific styles
├── js/
│   ├── app.js                  # Homepage calculator + animations
│   └── guide.js                # Guide page interactivity + progress
└── .planning/codebase/
    ├── STACK.md                # This file
    └── INTEGRATIONS.md         # External resources & APIs
```

---

## Key Dependencies Summary

### External Resources
1. **Google Fonts** (CDN)
   - Playfair Display (headings)
   - Nunito (body text)
   - Single HTTP/2 request

### Internal Dependencies
- **None** — Self-contained application

---

## Architecture Notes

### Client-Side Data
- **Calculator Data**: Hardcoded in `js/app.js` (product amounts by category & load)
- **State Management**: localStorage only (no global state library)
- **Routing**: File-based (separate .html files, no single-page app routing)

### Performance Characteristics
- **No network requests** for data (static content only)
- **Two HTTP requests** (styles.css + one Google Fonts import)
- **Minimal JavaScript** (20KB combined app.js + guide.js)
- **Gzip-friendly** CSS with reused custom properties

### Scalability Limitations
- Manual page routing (no dynamic routing)
- Data duplication between pages (no centralized data source)
- Local storage limited to ~5-10MB per origin
- No server-side rendering or API integration

---

## Technology Summary Table

| Aspect | Technology | Version/Status |
|--------|-----------|----------------|
| **Language** | JavaScript (ES6+) | No build step |
| **HTML** | HTML5 | Standard |
| **CSS** | Custom (design tokens) | No framework |
| **Build Tools** | None | N/A |
| **Package Manager** | None | N/A |
| **Fonts** | Google Fonts | CDN-loaded |
| **State** | localStorage | Browser-native |
| **Backend** | None | Static site |
| **Runtime** | Browser | Modern (2015+) |

