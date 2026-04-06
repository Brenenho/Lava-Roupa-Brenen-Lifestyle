# LavanTech — Testing Strategy

## Current State: No Automated Testing

This is a **static site project** (HTML/CSS/JavaScript) with no test framework installed or configured.

- ❌ No Jest, Mocha, Vitest, or other test runners
- ❌ No test files (*.test.js, *.spec.js)
- ❌ No package.json or npm/yarn setup
- ❌ No CI/CD pipeline or automated testing
- ✅ Browser-compatible vanilla JavaScript (no build step required)

---

## Manual Testing Approach

### 1. **Functional Testing** (Guide Pages)

#### Progress Tracking
- [ ] Open a guide page (e.g., percarbonato.html)
- [ ] Click "Marcar como feito" on Step 1
  - Expected: Step marked completed, progress bar updates, next step auto-expands
- [ ] Refresh page
  - Expected: Progress persists (localStorage working)
- [ ] Click "Reiniciar" (reset button)
  - Expected: All steps reset, progress bar back to 0%, localStorage cleared
- [ ] Navigate to another guide page and back
  - Expected: Each page has independent progress tracking

#### Step Expansion/Collapse
- [ ] Click step header (not completed step)
  - Expected: Step expands, shows step-body content
- [ ] Click another step header
  - Expected: Previous step collapses, new step expands (accordion behavior)
- [ ] Click completed step header
  - Expected: No expansion allowed (read-only state)

#### Completion Banner
- [ ] Complete all steps on a guide page
  - Expected: Banner appears with confetti animation, smooth scroll into view
- [ ] Reset progress
  - Expected: Banner disappears

### 2. **Visual/Layout Testing** (All Pages)

#### Responsive Design
- [ ] **Desktop (1920px):** Full layout, all elements visible
- [ ] **Tablet (768px):** Stack appropriately, touch targets >= 44px
- [ ] **Mobile (375px):** Single column, readable text, no horizontal scroll
  - Test on: `.guide-nav` (horizontal scroll enabled)
  - Test on: `.progress-sticky` bar (remains visible)
  - Test on: `.step-item` cards (readable on small screens)

#### Color Contrast (WCAG AA)
- [ ] Text on primary color (#C95272): readable
- [ ] Text on secondary color (#6B9E83): readable
- [ ] Muted text on light backgrounds: sufficient contrast
- [ ] Links: underline or color distinction visible

#### Typography
- [ ] Headings (h1, h2, h3): correct sizes via `clamp()`
- [ ] Body text: 16px base, 1.65 line-height
- [ ] "Playfair Display" loads correctly (not fallback Georgia)
- [ ] "Nunito" font loads correctly (not fallback sans-serif)

### 3. **Browser Compatibility Testing**

**Desktop:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile:**
- Chrome (iOS)
- Safari (iOS 13+)
- Chrome (Android 11+)
- Samsung Internet

**Key Features to Test Per Browser:**
- [ ] CSS custom properties (--color-primary, etc.)
- [ ] `clamp()` function for fluid typography
- [ ] Flexbox layout
- [ ] `backdrop-filter` blur (Safari requires -webkit prefix)
- [ ] Grid layout
- [ ] CSS animations (@keyframes)
- [ ] localStorage API
- [ ] SVG inline rendering
- [ ] Intersection Observer API
- [ ] Modern CSS (gap, inset, etc.)

**Known Compatibility Notes:**
- `backdrop-filter` requires `-webkit-backdrop-filter` for Safari (already included)
- `100dvh` (dynamic viewport height) supported in modern browsers only
- CSS custom properties supported in all modern browsers
- localStorage supported in all modern browsers (no IE10 support)

### 4. **Interaction Testing** (JavaScript)

#### Calculator (Homepage)
- [ ] Click category tabs (Brancas, Pretas, Coloridas, Toalhas, Cama, Edredom)
  - Expected: Category switches, results update
- [ ] Toggle load size (Meia máquina / Máquina cheia)
  - Expected: Product amounts adjust, temperature updates
- [ ] Verify temperature badge displays correct color class
  - temp-hot: red background
  - temp-warm: yellow background
  - temp-cold: blue background

#### Scroll Reveal Animations
- [ ] Scroll down on homepage
  - Expected: Cards fade in sequentially (`.visible` class added)
  - Expected: Bubble animation plays on scroll
- [ ] Scroll on guide pages
  - Expected: Steps animate in (staggered timing)

#### LocalStorage Persistence
- [ ] Open guide page, mark 3 steps done
- [ ] Refresh page
  - Expected: 3 steps still marked, progress bar shows correct %
- [ ] Open DevTools, inspect localStorage
  - Expected: Keys like `lavar__brancas__bra-1` with value `1`
- [ ] Clear localStorage, refresh
  - Expected: Progress reset to 0%

#### Navigation
- [ ] Click "Voltar para guias" (back button on guide pages)
  - Expected: Returns to index.html
- [ ] Click guide nav pills (Brancas, Pretas, etc.)
  - Expected: Navigates to that page, active state shows correct tab
- [ ] Active tab styling correct on each page

### 5. **Performance Testing** (Manual)

#### Page Load Performance
- [ ] DevTools Performance tab: First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No JavaScript errors in console

#### Animation Performance
- [ ] Scroll smooth without jank (60fps)
- [ ] Progress bar animation smooth
- [ ] Step expand/collapse animation smooth
- [ ] Confetti animation (completion) performs well

#### Asset Sizes
- [ ] CSS (styles.css + guide.css combined): < 100KB
- [ ] JavaScript (app.js + guide.js combined): < 50KB
- [ ] No unused CSS (verify via DevTools Coverage)

### 6. **Accessibility Testing** (a11y)

#### Keyboard Navigation
- [ ] Tab through all interactive elements
  - .done-btn, reset button, nav links, tabs
- [ ] Shift+Tab reverse navigation works
- [ ] Focus indicator visible on all focusable elements
- [ ] No keyboard traps

#### Screen Reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Heading hierarchy correct (h1 > h2 > h3)
- [ ] Button text descriptive: "Marcar como feito", not just "Click"
- [ ] Links have descriptive text: "Voltar para guias", not "Click here"
- [ ] Form inputs have associated labels
- [ ] No empty button/link elements

#### Color Dependency
- [ ] Progress bar color + text (not just color)
- [ ] Active states indicated with icon/text, not just color
- [ ] Status indicators (completed/not completed) use icon + styling

#### Mobile Accessibility
- [ ] Touch targets >= 44x44px (buttons, links)
- [ ] No hover-only interactions
- [ ] Zoom and text resize work correctly
- [ ] Page readable at 200% zoom

### 7. **Cross-Page Testing**

#### Navigation Flow
- [ ] From index.html → click guide card → navigates to guide
- [ ] From guide page → click guide nav tab → switches guide
- [ ] From guide page → click back button → returns to index
- [ ] All internal links functional

#### Progress Independence
- [ ] Progress on brancas.html independent from percarbonato.html
- [ ] Each page's localStorage keys unique
- [ ] No cross-page progress pollution

### 8. **Content Testing** (Portuguese, Tone)

#### Language Consistency
- [ ] All user text is Brazilian Portuguese (pt-BR)
- [ ] No English UI text visible to users
- [ ] Grammar and spelling correct
- [ ] Tone is conversational and friendly

#### Content Accuracy
- [ ] Product recommendations align with guide content
- [ ] Dosages match between calculator and step descriptions
- [ ] Temperature recommendations consistent
- [ ] No contradictory information

---

## Recommended Testing Approach Going Forward

### Phase 1: Establish Manual Testing Checklist
- Create checklist as issue/document in repo
- Run before each release
- Document results per browser/device

### Phase 2: Browser Testing
- Set up free cross-browser testing via BrowserStack or LambdaTest
- Test on: Safari 14, Chrome 90, Firefox 88
- Run on: iPhone 12, Samsung Galaxy S21

### Phase 3: Automated Visual Testing (Optional)
If visual consistency becomes critical:
- Consider **Playwright** or **Cypress** for E2E testing
- Screenshot testing with tools like Percy or Chromatic
- No additional dependencies needed (vanilla JS compatible)

### Phase 4: Performance Monitoring
- Set up Lighthouse CI to track Core Web Vitals
- Monitor page speed over time
- Alert on regressions

---

## Testing Gaps & Known Issues

### Current Gaps
1. **No automated testing** — manual checklist only
2. **No E2E tests** — cannot catch regressions automatically
3. **No visual regression tests** — CSS changes not caught
4. **No accessibility audit** — rely on manual testing only
5. **No CI/CD pipeline** — no automated checks before deployment
6. **Limited browser coverage** — only manual testing possible

### Testing-Unfriendly Code Patterns
- **localStorage usage:** Hard to test without mocking (consider wrapper function)
- **Inline event handlers:** `onclick="markStepDone(this)"` — harder to unit test
- **Global function scope:** `window.markDone()` exposed globally (OK for small project)
- **No separation of concerns:** Logic mixed with DOM manipulation

### Recommendations to Improve Testability
1. **Create wrapper functions for localStorage:**
   ```javascript
   const Storage = {
     setStep: (key, val) => localStorage.setItem(key, val),
     getStep: (key) => localStorage.getItem(key),
     removeStep: (key) => localStorage.removeItem(key),
     clearAll: () => localStorage.clear()
   };
   ```
   Makes mocking in tests easier.

2. **Separate business logic from DOM:**
   ```javascript
   // Pure function: returns new state
   function getNewProgress(steps) {
     const completed = steps.filter(s => s.completed).length;
     return { done: completed, total: steps.length };
   }
   
   // DOM function: applies state to DOM
   function updateProgressUI(progress) {
     document.getElementById('progressPct').textContent = `${progress.pct}%`;
   }
   ```

3. **Add data-testid attributes** to key elements:
   ```html
   <button class="done-btn" data-testid="step-done-btn" ...>
   <div class="step-item" data-testid="step-item-1" data-step-id="bra-1">
   ```

4. **Export core functions as modules** (if using ES modules):
   ```javascript
   // progress.js
   export function calculateProgress(completed, total) {
     return total ? Math.round((completed / total) * 100) : 0;
   }
   ```

---

## Testing Tools Evaluation

If implementing automated tests in the future:

| Tool | Pros | Cons | Fit |
|------|------|------|-----|
| **Playwright** | Cross-browser, E2E, modern | Overkill for static site | Medium |
| **Cypress** | Developer-friendly, visual debugger | Heavier, Chromium-only | Medium |
| **Vitest** | Fast, Vite-compatible | Needs build setup | Low (no build step) |
| **Jest** | Mature, excellent for unit tests | Slower startup | Low |
| **Lighthouse** | Performance & a11y built-in | Limited to core metrics | High |
| **axe DevTools** | Accessibility auditing | Manual usage | High |

**Recommendation:** For this project's scope, stick with manual testing + Lighthouse CI for performance tracking.

---

## Deployment Testing Checklist

Before deploying to production:

- [ ] All guide pages load without errors
- [ ] No console errors (DevTools console)
- [ ] Progress tracking persists across refresh
- [ ] Calculator renders correctly
- [ ] Animations smooth on target devices
- [ ] Mobile layout responsive (tested on real device or DevTools)
- [ ] Links to external resources (if any) functional
- [ ] Fonts load correctly (no FOUT)
- [ ] SVG icons render correctly
- [ ] No mixed HTTP/HTTPS (all secure)
- [ ] Meta tags correct (title, description, og:tags if social sharing enabled)

