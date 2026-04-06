# LavanTech Project Structure

## Directory Tree with File Purposes

```
Lavar roupa/
├── index.html              [Main page — calculator + guide cards]
├── brancas.html            [Guide: White clothes]
├── pretas.html             [Guide: Black clothes]
├── coloridas.html          [Guide: Colored clothes]
├── toalha.html             [Guide: Towels]
├── cama.html               [Guide: Bedding/sheets]
├── edredom.html            [Guide: Quilts & comforters]
├── percarbonato.html       [Guide: Sodium percarbonate product]
├── utensilios.html         [Guide: Washing tools & utensils]
│
├── css/
│   ├── styles.css          [Design system: tokens, components, homepage layout]
│   └── guide.css           [Guide pages specific styles: steps, progress, animations]
│
└── js/
    ├── app.js              [Homepage: calculator, bubbles, animations]
    └── guide.js            [Guide pages: steps, progress, localStorage]
```

## CSS Files

### css/styles.css (897 lines)
**Purpose**: Global design system and shared component styles

**Sections**:
- **Tokens** (variables): Colors, shadows, spacing, typography, transitions
  - Color palette: primary (#C95272), secondary (#6B9E83), accent (#E8854A), lavender (#9B8ECF)
  - Shadows: clay-sm, clay-md, clay-lg, clay-card, hover
  - Spacing scale: sp-1 through sp-16 (4px to 64px)
  - Typography: Playfair Display (headings), Nunito (body)

- **Global reset**: Box-sizing, HTML scroll behavior, body baseline

- **Typography**: H1-H4 sizing with clamp() for responsiveness, paragraph styles, text utilities

- **Layout**: Container width, grid system, flexbox utilities

- **Navbar**: Sticky header with logo, nav links, backdrop blur

- **Guide cards**: Product/tip cards with shadows and hover effects

- **Buttons**: Variants (btn-white, btn-primary, btn-lg), sizing, states

- **Callout boxes**: Tips, warnings, info (with icons and colored backgrounds)

- **Utility classes**: .text-muted, .text-primary, .text-center, etc.

**Not included**: This file does NOT contain:
- Calculator styles (those are inline in index.html)
- Guide page step styles (see guide.css)
- Animations (mixed: some in styles.css, most in guide.css)

### css/guide.css (745 lines)
**Purpose**: Styles specific to guide pages (all 8 guide HTML files)

**Sections**:
- **Keyframe animations**: slideUp, heroIconPop, bodyReveal, popIn, bounceEmoji, floatBlob, stepAppear, confettiFly, checkBounce

- **Guide hero banner**: Full-width gradient header with blobs, title, description, tags, back button
  - Gradient background varies by guide (injected inline in each HTML file)
  - Decorative blob animations (floating movement)
  - Hero text with staggered entrance animations

- **Progress sticky bar**: Fixed header below hero showing progress percentage, step count, reset button
  - Uses CSS custom properties to theme per guide
  - Progress fill bar with smooth width animation
  - Hover states for reset button

- **Guide navigation strip**: Horizontal scrollable list of guide links
  - Pills with borders and hover effects
  - Active state highlights current guide
  - Scrolls horizontally on mobile

- **Steps section**: Main accordion-style step list

- **Step cards**: Individual step-item elements
  - Header (clickable): number, icon, title, subtitle, chevron
  - Body (expandable): detailed content, callout boxes, done button
  - State styling: collapsed, expanded, completed
  - Animations: entrance stagger, chevron rotation, completion indicator

- **Step header**: Flexbox layout with number circle, text content, chevron
  - Number circle: 44x44px, bold font, color-coded
  - Text: title + subtitle with different font weights/sizes
  - Chevron: rotates 180° when expanded

- **Step body**: Content area only visible when expanded
  - Padding adjusted to align with number circle
  - Background color contrasts with header
  - Animation: fadeIn slide-up (bodyReveal)

- **Step states**:
  - `.step-item` — collapsed, normal
  - `.step-item.expanded` — open, shows body, elevated shadow
  - `.step-item.completed` — grayed out, green check icon, strikethrough title

- **Done button**: Mark step complete/undo
  - Primary color text, black border with shadow
  - Hover: green background, success color
  - Icon changes: circle → checkmark
  - Inline SVG icons

- **Completion banner**: Full-width celebration section
  - Hidden until all steps completed
  - Emoji + heading + description + action buttons
  - Animated confetti particles created by JavaScript
  - Buttons link to index or next guide

- **Visual accents**: Color swatches, science boxes, callout boxes with icons

## JavaScript Files

### js/app.js (252 lines)
**Purpose**: Homepage interactivity

**Key data structure**:
```javascript
CALC_DATA = {
  brancas: { label, emoji, temp, tempClass, tip, half: [...], full: [...] },
  pretas: { ... },
  coloridas: { ... },
  toalhas: { ... },
  cama: { ... },
  edredom: { ... }
}
```

**Main functions**:
- `renderCalcResults()` — Reads CALC_DATA[category][load], generates HTML cards, injects into #calcResults
- `initFullCalculator()` — Sets up event listeners on calc-tabs and calc-load-toggle
  - Tab click updates `calcCategory` and re-renders
  - Load toggle updates `calcLoad` and re-renders
  - Both use event delegation on parent elements

- `animateCards()` — IntersectionObserver for card entrance
  - Observes .guide-card elements
  - Adds .visible class with stagger delay (i * 70ms)
  - Removes observer once card is visible (one-time)

- `initScrollReveal()` — IntersectionObserver for [data-reveal] elements
  - Simpler than animateCards, adds .revealed class
  - Used for sections that fade in as user scrolls

- `spawnBubbles()` — Creates 18 decorative bubbles dynamically
  - Random size (10-50px), position, color, animation duration
  - Appended to #heroBubbles
  - Uses CSS animation (bubbleFloat) for floating effect

**Event listeners**:
- `DOMContentLoaded` — Initializes all features
- Tab/toggle clicks — Update calculator state and re-render

**Global state**:
- `calcCategory = 'brancas'`
- `calcLoad = 'half'`
- `CALC_DATA` (static, never modified)

### js/guide.js (257 lines)
**Purpose**: Guide page interactivity (shared by all 8 guide HTML files)

**Key functions**:
- `getPageKey()` — Returns current page name (e.g., 'brancas')
- `getStepKey(stepId)` — Builds localStorage key: `lavar__brancas__brancas-1`

- `updateProgress()` — Calculates progress percentage
  - Counts .completed steps
  - Updates #progressFill width, #progressPct text, #progressSteps count
  - Shows/hides #completionBanner based on completion

- `toggleExpand(step)` — Accordion expand/collapse
  - Closes all expanded steps first
  - Opens clicked step (or closes if already open)
  - Scrolls to step on mobile if needed

- `markDone(step, done, animate)` — Mark step as complete/incomplete
  - Adds/removes .completed class on step
  - Hides/shows step-completed-icon
  - Changes done-btn innerHTML to show checkmark or circle
  - Triggers check bounce animation
  - Auto-opens next uncompleted step
  - Persists to localStorage
  - Calls updateProgress()

- `initSteps()` — Main initialization
  - Attaches click listeners to step headers and done buttons
  - Restores completion state from localStorage
  - Opens first uncompleted step
  - Calls updateProgress()

- `initScrollAnimations()` — IntersectionObserver for step entrance
  - Observes .step-item elements
  - Adds .visible class with stagger delay (i * 70ms)

- `initReset()` — Reset button functionality
  - Confirms action with dialog
  - Clears all .completed states
  - Removes all localStorage keys
  - Re-opens first step

- `launchConfetti()` — Particle animation on completion
  - Creates 30 colored dots in #completionBanner
  - Random position, size, color
  - Animates upward and fade out (confettiFly keyframe)
  - Self-removes after 2 seconds

- `initGuideNav()` — Highlights current guide in nav
  - Compares current page URL to .guide-nav-link hrefs
  - Adds .active class to matching link

**Inline SVG icons**: CHECK_SVG, CIRCLE_SVG, UNDO_SVG as constants

**Event listeners**:
- `DOMContentLoaded` — Initializes all features
- Header click — toggleExpand()
- Done button click — markDone() toggle
- Completion banner mutation — launchConfetti()
- Reset button click — initReset()

**Persistent state**: localStorage with keys like `lavar__brancas__brancas-1`

## HTML Pages

### index.html
**Sections**:
1. **Navbar** — Logo + nav links (sticky)
2. **Hero section** — Title, subtitle, #heroBubbles (animated backdrop)
3. **Hero bubbles container** — 18 floating animated divs
4. **Main section** — Four visual cards (color guides preview)
5. **Guide cards grid** — 8 interactive cards linking to guides
   - Each card: emoji, title, description, 2 meta items
   - Hover effects, box shadows
   - Links to guide HTML files

6. **Calculator section** (#calculadora)
   - Header with description
   - Tab navigation: 6 clothing categories (brancas, pretas, coloridas, toalhas, cama, edredom)
   - Load toggle: "half" vs "full" máquina size
   - Results container (#calcResults) — populated by JavaScript
   - Product cards: emoji + amount + name + note

7. **Footer** — Simple copyright + return link

**Inline styles**: 
- Hero bubbles styling
- Bubble float animation
- Navbar styling
- Page-level layout

**Scripts**:
- Loads css/styles.css
- Inline <style> block (page-specific CSS)
- Loads js/app.js

### Guide pages (brancas.html, pretas.html, coloridas.html, toalha.html, cama.html, edredom.html, percarbonato.html, utensilios.html)

**Shared structure** (all 8 pages identical except content):

1. **Head section**:
   - Charset, viewport, title, description
   - Loads css/styles.css
   - Loads css/guide.css
   - **Inline <style> block**: Page-specific color theme
     - `--guide-primary`, `--guide-dark`, `--guide-light`
     - `--guide-gradient` — unique gradient per guide
     - `--step-color` — primary color for step numbers

2. **Navbar** — Same as index.html

3. **Hero section** (.guide-hero)
   - Three floating blobs (for visual interest)
   - Back button → index.html
   - Hero inner layout:
     - Hero icon (emoji as SVG or emoji char)
     - Hero text: h1 title + p description
     - Guide tags: checkmark "N passos", clock icon, key ingredient

4. **Progress sticky bar** (.progress-sticky)
   - Progress track (#progressFill) — width animated by JS
   - Percentage display (#progressPct)
   - Step count (#progressSteps)
   - Reset button (#resetBtn)

5. **Guide nav** (.guide-nav)
   - Horizontal scrollable links to other guides
   - Current guide marked .active

6. **Steps section** (.steps-section)
   - Section heading icon + "Passo a Passo" title
   - Steps list (.steps-list)
     - Multiple .step-item elements (usually 6-8 per guide)

7. **Step item pattern** (.step-item with data-step-id)
   - Step header (.step-header)
     - Step number (.step-number) — emoji-like circle with number
     - Step completed icon — hidden, shown when completed
     - Step text:
       - Title (h4-like)
       - Subtitle (secondary text)
     - Chevron icon — rotates on expand
   
   - Step body (.step-body) — hidden until .expanded
     - Visual card (usually with emoji and chemistry/info)
     - Description paragraphs with <strong> and <em> tags
     - Callout boxes:
       - .callout.callout--tip (lightbulb icon)
       - .callout.callout--warning (triangle icon)
       - .callout--info (info icon)
     - Additional content (lists, bolded text, etc.)
     - Done button: calls markStepDone(btn)

8. **Completion banner** (#completionBanner)
   - Initially hidden (display: none via CSS until .visible added)
   - Emoji (🌟)
   - h2 congratulations message
   - Description paragraph
   - Action buttons:
     - "Ver todos os guias" (white button)
     - "Próximo guia" (white outline button)

9. **Footer** — Return link to index.html

10. **Scripts**:
    - Inline helper function markStepDone(btn)
    - Loads js/guide.js

**Inline style customization**:
Each guide page has unique color theme in <style> block:
- brancas: gray gradient (#334155 → #475569)
- pretas: dark gradient
- coloridas: colorful accents
- etc.

This reuses the same HTML structure but applies different color schemes.

## Notable HTML Patterns

### 1. Step Item Pattern (Reusable)
```html
<div class="step-item" data-step-id="brancas-1">
  <div class="step-header">
    <div class="step-number">1</div>
    <div class="step-completed-icon">
      <svg>... checkmark ...</svg>
    </div>
    <div class="step-text">
      <div class="step-title">Title</div>
      <div class="step-subtitle">Subtitle</div>
    </div>
    <svg class="step-chevron">... chevron ...</svg>
  </div>
  <div class="step-body">
    <p>Content here...</p>
    <button class="done-btn" onclick="markStepDone(this)">Mark done</button>
  </div>
</div>
```

**Repeated** 6-8 times per guide page with unique `data-step-id`.

### 2. Callout Box Pattern (Reusable)
```html
<div class="callout callout--tip">
  <svg>... icon ...</svg>
  <div class="callout-body">
    <div class="callout-title">Title</div>
    <p>Content...</p>
  </div>
</div>
```

**Variants**: callout--tip, callout--warning, callout--info

### 3. Guide Nav Pattern
```html
<nav class="guide-nav">
  <a href="brancas.html" class="guide-nav-link active">Brancas</a>
  <a href="pretas.html" class="guide-nav-link">Pretas</a>
  ...
</nav>
```

**Same on all guide pages**; current page marked with .active via JS.

### 4. Card Pattern (Index.html)
```html
<div class="guide-card" data-delay="...">
  <div class="guide-card-emoji">🤍</div>
  <h3>Roupas Brancas</h3>
  <p>Description...</p>
  <div class="guide-card-meta">
    <span>Item 1</span>
    <span>Item 2</span>
  </div>
  <a href="brancas.html">Ver guia</a>
</div>
```

**Animated** with IntersectionObserver (staggered entrance).

## Progress Bar Implementation

**HTML**:
```html
<div class="progress-sticky">
  <div class="progress-track-wrap">
    <div class="progress-fill" id="progressFill"></div>
  </div>
  <div class="progress-text-wrap">
    <span id="progressPct">0%</span>
    <span id="progressSteps">0 de 8</span>
  </div>
  <button id="resetBtn">Reset</button>
</div>
```

**CSS** (guide.css):
- `.progress-sticky` — sticky positioning (top: 0, z-index: 100)
- `.progress-track-wrap` — light background, rounded pill shape
- `.progress-fill` — colored gradient bar, animates width smoothly
  - Gradient: primary → primary-light
  - Transition: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
  - Pseudo-element ::after adds subtle shine

**JavaScript** (guide.js):
```javascript
function updateProgress() {
  const done = document.querySelectorAll('.step-item.completed').length;
  const total = document.querySelectorAll('.step-item').length;
  const pct = (done / total) * 100;
  
  fill.style.width = pct + '%';    // Animates via CSS transition
  pctEl.textContent = pct + '%';
  stepsEl.textContent = done + ' de ' + total;
}
```

**Per-guide customization**: Each guide page sets color via CSS variable:
```css
.progress-fill { background: linear-gradient(90deg, #475569, #94A3B8); }
```

**Theme-aware**: Progress bar color matches guide hero gradient.

## Step Accordion Pattern

**Structure**: Each .step-item is a miniature accordion

**Interaction flow**:
1. User clicks .step-header
2. toggleExpand(step) runs:
   - Closes all other .expanded steps
   - Adds .expanded to clicked step (or removes if already expanded)
   - Scrolls to step on mobile
3. CSS shows/hides .step-body based on .expanded class
4. Chevron rotates 180° (transform: rotate(180deg))

**Styling**:
- `.step-item.expanded` → elevated shadow, border highlight
- `.step-body` inside expanded → visible with bodyReveal animation
- Chevron icon → rotates via CSS transition

**Completion overlay**:
- When step completed: .step-item.completed class added
- Visual changes:
  - Number circle hidden, checkmark icon shown
  - Title grayed out with strikethrough
  - Background fades to light green
  - Step collapses automatically

**Auto-open behavior**:
- On load: first uncompleted step opens automatically
- On complete: next uncompleted step opens (with 350ms delay)
- Creates natural progression through guide

**Keyboard/mobile**: 
- Click entire header to expand/collapse
- Done button has :active state for touch feedback
- No keyboard navigation (arrow keys), but semantic HTML allows Tab to access buttons

## Animations Overview

**In guide.css**:
- `slideUp` (500ms) — Hero title + subtitle entrance
- `heroIconPop` (600ms) — Hero emoji scale + reveal
- `stepAppear` (400ms) — Step card entrance with stagger
- `bodyReveal` (220ms) — Step body fade + slide up on expand
- `checkBounce` (350ms) — Checkmark scale bounce when step marked done
- `confettiFly` (0.8-2s) — Colored dots fly up + fade on guide completion
- `floatBlob` (7s) — Hero decorative blobs float and rotate infinitely
- `bounceEmoji` — Not used (commented out in guide.css)

**Trigger mechanism**:
- CSS class added by JavaScript
- Animations play automatically (no JS timing needed)
- Stagger delays applied per element (via data-delay or nth-child)

**Performance**:
- Using transform (GPU-accelerated) not position properties
- Intersection Observer ensures animations only compute in viewport
- No heavy JavaScript loops during animations
