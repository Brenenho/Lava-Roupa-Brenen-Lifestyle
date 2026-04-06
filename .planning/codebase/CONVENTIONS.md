# LavanTech — Code Conventions

## Overview
LavanTech is a static HTML/CSS/JavaScript project with a warm, feminine design system. It provides interactive guides for laundry care with step-by-step tutorials, a product calculator, and progress tracking via localStorage.

---

## CSS Conventions

### Naming Style: Custom System (Not BEM)
- Uses semantic class names with hyphens: `.step-item`, `.guide-nav-link`, `.completion-banner`
- Modifier classes use descriptive suffixes: `.step-item.completed`, `.guide-nav-link.active`, `.callout--tip`
- Semantic naming over utility classes: `.step-completed-icon` rather than `.bg-green`

### CSS Custom Properties (Design Tokens)
The design system uses comprehensive CSS variables in `:root`:

**Colors:**
```css
--color-primary:       #C95272         /* Warm rosé pink */
--color-primary-dark:  #A63C5A
--color-primary-light: #F2A8BC
--color-secondary:     #6B9E83         /* Soft green */
--color-accent:        #E8854A         /* Warm orange */
--color-lavender:      #9B8ECF
--color-bg:            #FEF6EE         /* Off-white */
--color-surface:       #FFFFFF
--color-muted:         #FDF0EA
--color-fg:            #2A1C18         /* Dark brown text */
--color-fg-muted:      #7A625E
--color-success:       #4A9670
--color-error:         #D94F4F
--color-warning:       #D48B24
--color-info:          #4A8CC9
```

**Spacing (8px base):**
```css
--sp-1: 4px,  --sp-2: 8px,  --sp-3: 12px,  --sp-4: 16px,
--sp-5: 20px, --sp-6: 24px, --sp-8: 32px,  --sp-10: 40px,
--sp-12: 48px, --sp-16: 64px
```

**Typography:**
- `--font-heading: 'Playfair Display', Georgia, serif` (headings)
- `--font-body: 'Nunito', system-ui, sans-serif` (body text)

**Border Radius:**
- `--radius-sm: 10px`, `--radius-md: 14px`, `--radius-lg: 20px`, `--radius-xl: 28px`, `--radius-full: 9999px`

**Transitions:**
- `--transition-fast: 150ms ease-out`
- `--transition-normal: 250ms ease-out`
- `--transition-slow: 400ms ease-out`

**Shadows:**
- Clay-inspired, warm shadows using primary color: `--shadow-clay-sm`, `--shadow-clay-md`, `--shadow-clay-lg`, `--shadow-clay-card`, `--shadow-hover`

### CSS Structure
- **styles.css:** Global design system, resets, layouts, containers, buttons, forms
- **guide.css:** Page-specific styles for guide pages (hero, steps, progress bar, callouts)

### Responsive Design
- Uses `clamp()` for fluid typography: `clamp(2rem, 5vw, 3.8rem)`
- Mobile-first approach
- Breakpoint handling via flexbox and grid layout
- No explicit media queries in base files; inline styles in HTML for page-specific overrides

### Animation & Transitions
- Uses CSS keyframes: `@keyframes slideUp`, `@keyframes bubbleFloat`, `@keyframes checkBounce`, etc.
- All transitions use custom easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot effect)
- Animation delays for staggered effects: `animation-delay` on repeated elements

### Indentation & Formatting
- 2-space indentation
- Section headers: `/* ── Section Name ── */` (using en-dash ornaments)
- Logical grouping by feature/component
- Comments link to related CSS sections for clarity

---

## JavaScript Conventions

### JavaScript Style: ES6+ with Modern Features
- Uses `const` by default, avoids `var`
- Arrow functions: `() => {}`
- Template literals: backticks with `${}`
- Const objects for data: `const CALC_DATA = { ... }`
- ES6 class-like patterns (though mostly function-based)

### Function Naming
- Camelcase: `renderCalcResults()`, `initFullCalculator()`, `markStepDone()`
- Descriptive verbs: `init*`, `render*`, `spawn*`, `toggle*`, `mark*`, `launch*`, `update*`
- No underscore prefixes for private functions (all are module-level)

### Code Organization
**app.js (Homepage Calculator):**
- Data object: `CALC_DATA` with category structure
- Functions: `renderCalcResults()`, `initFullCalculator()`, `animateCards()`, `initScrollReveal()`, `spawnBubbles()`
- Entry point: `document.addEventListener('DOMContentLoaded', ...)`

**guide.js (Guide Page Interactivity):**
- Scroll animations: `initScrollAnimations()`
- Progress system: `getPageKey()`, `getStepKey()`, `updateProgress()`
- Step management: `toggleExpand()`, `markDone()`, `initSteps()`
- Confetti effect: `launchConfetti()`, injected keyframes
- Reset button: `initReset()`
- Navigation highlight: `initGuideNav()`

### Data Management
- **localStorage** for progress persistence: `localStorage.setItem(key, '1')`, `localStorage.removeItem(key)`
- Keys follow pattern: `lavar__[pageName]__[stepId]`
- No backend API calls; fully client-side state

### DOM Interaction
- Uses modern DOM APIs: `document.querySelectorAll()`, `classList` for state management
- Event delegation where appropriate: `addEventListener()` on parent elements
- No jQuery or libraries; vanilla JavaScript
- String templates for HTML generation: `` `<div class="...">...</div>` ``

### Comments & Documentation
- Minimal comments; code is self-documenting
- Section headers in ASCII art: `// ── Section Name ───────────────────`
- Rare inline comments; prefer descriptive function/variable names
- Leading comment block in files: file purpose and context

### Error Handling
- Defensive null checks: `if (!element) return;`
- Optional chaining patterns: `step?.classList.add(...)`
- No explicit error throwing; graceful degradation

---

## HTML Conventions

### DOCTYPE & Metadata
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Lavar Roupa</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/guide.css">
</head>
```

- Always `lang="pt-BR"` (Brazilian Portuguese)
- Viewport meta for responsive design
- Semantic title format: `[Main Title] — Lavar Roupa`
- Description meta tags for SEO

### Structure Patterns

**Guide Pages (brancas.html, percarbonato.html, etc.):**
1. Hero banner with gradient background, icon, title, subtitle, tags
2. Sticky progress bar
3. Navigation strip (guide tabs)
4. Main content: step-by-step accordion
5. Completion banner (hidden by default)
6. Footer with link back to home

**Home Page (index.html):**
1. Navbar (sticky)
2. Hero section with floating bubbles
3. Product calculator section (tabs + toggle)
4. Guide cards grid
5. Footer

### CSS Class Patterns
- Container: `.container` (max-width wrapper)
- Sections: `.guide-hero`, `.steps-section`, `.progress-sticky`
- Cards: `.guide-card`, `.step-item`, `.calc-product-card`
- State: `.active`, `.completed`, `.expanded`, `.visible`
- Modifiers: `.hero-blob-1`, `.step-number`, `.guide-nav-link.active`

### ID Conventions
- Reserved for JavaScript hooks: `id="progressFill"`, `id="calcResults"`, `id="resetBtn"`
- Data attributes for step tracking: `data-step-id="perc-1"`
- Rarely used for styling (prefer classes)

### Script Loading
- Styles: in `<head>`
- Scripts: at end of `<body>`, after content
- No async/defer (synchronous load acceptable for small scripts)
- Inline styles: reserved for page-specific overrides only

### HTML Indentation & Formatting
- 2-space indentation
- Semantic HTML5: `<main>`, `<section>`, `<nav>`, `<footer>`
- SVG icons embedded inline (no external icon files)
- HTML comments for section separation: `<!-- Step 1 -->`, `<!-- Hero Section -->`
- Self-closing tags: `<meta>`, `<link>`, `<img>`

---

## Language & Content

### Language: Brazilian Portuguese (pt-BR)
- All user-facing text is in Brazilian Portuguese
- Technical naming in English: class names, function names, data keys
- Comments in English (when present)
- Emoji used for visual emphasis and personality (✨, 🧴, 🤍, 🖤, 🌈, etc.)

### Content Style
- Conversational, friendly tone
- Exclamation marks for enthusiasm
- Contextual help via "callout" boxes (tips, warnings, info)
- Instructional language: imperative verbs ("Adicione", "Mexa", "Despeje")

---

## File Organization

```
/Users/brenenho/Lavar roupa/
├── css/
│   ├── styles.css          # Global design system
│   └── guide.css           # Guide page-specific styles
├── js/
│   ├── app.js              # Homepage calculator & animations
│   └── guide.js            # Guide page interactivity
├── index.html              # Homepage
├── brancas.html            # White clothes guide
├── pretas.html             # Black clothes guide
├── coloridas.html          # Colored clothes guide
├── percarbonato.html       # Sodium percarbonate guide
├── toalha.html             # Towels guide
├── cama.html               # Bedding guide
├── edredom.html            # Comforters guide
├── utensilios.html         # Utensils/dishes guide
└── README.md
```

---

## Naming Conventions Summary

| Category | Example | Pattern |
|----------|---------|---------|
| CSS Classes | `.step-item`, `.guide-nav-link` | kebab-case, semantic |
| CSS Modifiers | `.step-item.completed`, `.guide-nav-link.active` | descriptive suffix |
| CSS Variables | `--color-primary`, `--sp-4` | kebab-case with prefix |
| HTML IDs | `id="progressFill"`, `id="resetBtn"` | camelCase, JS-only |
| Data Attributes | `data-step-id="perc-1"` | kebab-case |
| JavaScript Functions | `renderCalcResults()`, `markStepDone()` | camelCase, verb-first |
| JavaScript Objects | `CALC_DATA`, `CHECK_SVG` | UPPER_SNAKE_CASE for constants |
| HTML Files | `brancas.html`, `percarbonato.html` | kebab-case Portuguese names |

---

## Design System Summary

**Theme:** Warm, feminine, soft rosé with earth tones
**Primary Color:** #C95272 (warm rosé pink)
**Secondary:** #6B9E83 (soft green)
**Fonts:** Playfair Display (headings), Nunito (body)
**Shadows:** Warm, clay-inspired with primary color tint
**Radius:** Soft, rounded corners (10–28px)
**Spacing:** 8px base unit system
**Interactions:** Overshoot easing, smooth transitions, playful animations
