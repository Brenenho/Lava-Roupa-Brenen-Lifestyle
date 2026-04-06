# LavanTech Architecture

## Application Type
**Multi-page static website** with enhanced client-side interactivity. This is a traditional HTML/CSS/JS site (no framework) designed for fast loading and accessibility.

## Overall Architecture Pattern
- **Static HTML pages** served as-is
- **Global CSS design system** with shared tokens (colors, typography, spacing)
- **JavaScript enhancers** that layer interactivity on top of semantic HTML
- **No build process** — files are served directly

This follows a **progressive enhancement** philosophy: all content is readable without JavaScript, and JS adds interactive features like animations, state management, and progress tracking.

## Page Structure & Navigation

### Homepage (index.html)
- **Purpose**: Main landing page and navigation hub
- **Key sections**:
  - Hero section with animated floating bubbles
  - Guide cards linking to 8 dedicated guide pages
  - Full product calculator (interactive)
  - Visual accent cards for color washing guides
  - Footer with return link
- **Role**: Entry point for users; contains the main calculator

### Guide Pages (8 dedicated pages)
1. **brancas.html** — White clothes washing guide
2. **pretas.html** — Black clothes washing guide
3. **coloridas.html** — Colored clothes washing guide
4. **toalha.html** — Towels washing guide
5. **cama.html** — Bedding (sheets, pillowcases) guide
6. **edredom.html** — Quilts and comforters guide
7. **percarbonato.html** — Sodium percarbonate product guide
8. **utensilios.html** — Washing utensils and tools guide

**Guide page architecture** (all guide pages follow identical structure):
- Hero section with title, description, and visual theme
- Sticky progress bar showing completion percentage
- Horizontal scrollable navigation (guide-nav) linking to other guides
- Main content: step-by-step accordion
- Completion banner (hidden until all steps marked done)
- Footer with return link

**Navigation pattern**: 
- Guides link back to index via hero "back" button
- Guides link to each other via horizontal nav strip
- All pages form a web, not a linear sequence

## How Pages Relate to Each Other

```
index.html (hub)
    ├─→ brancas.html
    ├─→ pretas.html
    ├─→ coloridas.html
    ├─→ toalha.html
    ├─→ cama.html
    ├─→ edredom.html
    ├─→ percarbonato.html
    └─→ utensilios.html

Guide pages:
  - All link back to index.html
  - All link to each other horizontally (guide-nav)
  - No single "next page" flow — user chooses
```

## JavaScript Architecture

### File Organization
- **js/app.js** — Homepage JavaScript only
  - Calculator logic and rendering
  - Card animations
  - Scroll reveal effects
  - Bubble generation
  
- **js/guide.js** — Guide pages JavaScript only
  - Step expansion/collapse
  - Progress tracking
  - localStorage persistence
  - Completion animations
  - Guide nav highlighting

### Module Pattern (No Explicit Modules)
JavaScript is **procedurally organized** with functions grouped by feature:
- Calculator functions in app.js
- Step lifecycle functions in guide.js
- Each file initializes on DOMContentLoaded
- Global scope used for all logic (no module pattern or bundling)

### Initialization Flow

**On index.html (app.js)**:
```
DOMContentLoaded
  → spawnBubbles()           [create animated bubbles]
  → animateCards()           [setup IntersectionObserver for card reveal]
  → initScrollReveal()       [setup reveal animations]
  → initFullCalculator()     [setup calculator tabs and toggle]
```

**On guide pages (guide.js)**:
```
DOMContentLoaded
  → initScrollAnimations()   [setup step entrance animations]
  → initSteps()              [setup step expand/collapse, localStorage restore]
  → initReset()              [attach reset button listener]
  → initGuideNav()           [highlight current guide]
  → MutationObserver setup   [watch completion banner for confetti]
```

## Data Flow

### Calculator (app.js)
```
HTML form inputs (category tabs, load toggle)
    ↓
User click → event listener
    ↓
Update state: calcCategory, calcLoad
    ↓
renderCalcResults()
    ↓
Read CALC_DATA[category][load]
    ↓
Generate HTML cards dynamically
    ↓
Insert into #calcResults
```

**CALC_DATA structure**:
```javascript
{
  brancas: {
    label, emoji, temp, tempClass, tip,
    half: [{emoji, name, amount, note}, ...],
    full: [{emoji, name, amount, note}, ...]
  },
  pretas: {...},
  coloridas: {...},
  ...
}
```

### Guide Steps (guide.js)
```
HTML step elements (with data-step-id)
    ↓
User clicks header or done button
    ↓
toggleExpand() OR markDone()
    ↓
Update DOM: add/remove .expanded, .completed classes
    ↓
Persist to localStorage: lavar__[page]__[stepId]
    ↓
updateProgress()
    ↓
Calculate done/total steps
    ↓
Update progress bar width, percentage, and count
    ↓
Show completion banner if all done
```

**localStorage key format**: `lavar__brancas__brancas-1`
**Value**: `'1'` if done, absent if not done

## State Management Approach

### No External State Management
This application does **not use Redux, Vuex, or similar**. State is managed through:

1. **HTML classes** (for visual state)
   - `.expanded` — step is open
   - `.completed` — step is marked done
   - `.active` — tab/button is active
   - `.visible` — animation trigger

2. **Dataset attributes** (for data association)
   - `data-step-id="brancas-1"` — unique step identifier
   - `data-category="brancas"` — calculator category
   - `data-load="half"` — calculator load size
   - `data-delay` — animation stagger delay

3. **Global variables** (minimal)
   - `calcCategory`, `calcLoad` in app.js
   - `CALC_DATA` object (static, never modified)

4. **Browser localStorage** (persistent state across sessions)
   - Stores completed step flags
   - Key: `lavar__[page]__[stepId]`
   - Only used on guide pages

### Why This Approach?
- No need for complex state when HTML attributes can represent state
- localStorage gives free persistence without a database
- Reduces JavaScript bundle size
- Each page is independent; no app-wide state needed

## Key Design Patterns Used

### 1. Intersection Observer (Performance)
Used in **app.js** and **guide.js** for:
- Card entrance animations (staggered reveal as user scrolls)
- Step entrance animations (same pattern)
- Threshold-based lazy triggering of CSS classes

**Benefits**: 
- Animations only compute when element is near viewport
- No scroll event listeners (performant)
- Built into modern browsers

### 2. Event Delegation
Used in **app.js** for calculator:
```javascript
tabsEl.addEventListener('click', (e) => {
  const tab = e.target.closest('.calc-tab');
  if (!tab) return;
  // Handle click
});
```

**Benefits**: Single listener on parent, not per child

### 3. CSS Class Toggle (State Machine)
Steps have implicit state machine via classes:
```
.step-item (initial)
  ↓ user clicks header
.step-item.expanded (open)
  ↓ user marks done
.step-item.completed (closed + grayed out)
  ↓ user clicks undo
.step-item (back to initial)
```

CSS handles all visual changes; JavaScript only toggles classes.

### 4. Micro-interactions & Animations
- **Entrance animations**: elements fade/slide up as they scroll into view
- **Check bounce**: checkmark animates when step completed
- **Confetti**: colored dots fly up when guide completes
- **Bubble float**: decorative bubbles animate continuously in hero
- **Progress bar**: width animates smoothly with cubic-bezier easing

All via CSS `@keyframes`, triggered by JavaScript class changes.

### 5. Callback & Stagger Pattern
```javascript
cards.forEach((card, i) => {
  card.dataset.delay = i * 70;  // Stagger delay
  observer.observe(card);        // Add to observer
});

// Later, in observer callback:
setTimeout(() => card.classList.add('visible'), delay);
```

Creates waterfall entrance effect without complex timing code.

## Architecture Strengths

1. **Lightweight** — No framework overhead, static files only
2. **Fast** — No build step, minimal JavaScript
3. **Accessible** — Semantic HTML, works without JS
4. **Reusable** — CSS design system shared across all pages
5. **Maintainable** — Clear separation of concerns (HTML structure, CSS styling, JS behavior)
6. **Persistent** — localStorage preserves user progress per guide
7. **Responsive** — Mobile-first CSS with viewport-relative sizing (clamp(), vw units)

## Architecture Tradeoffs

1. **No routing** — Each guide is a separate HTML file, not single-page app
2. **Repeated HTML** — Guide pages have duplicated structure (no templating)
3. **Global scope** — No module system means variable collisions possible
4. **Limited state** — No complex multi-page workflows (each page is independent)

This is intentional: the app prioritizes simplicity and performance over framework features.
