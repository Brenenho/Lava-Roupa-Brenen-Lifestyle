# LavanTech — External Integrations & APIs

## Overview
LavanTech is a **self-contained static site** with minimal external dependencies. All content is client-side with no backend services.

---

## CDN Resources

### Google Fonts
**URL**: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Nunito:wght@400;500;600;700;800&display=swap`

**Location**: Imported in `css/styles.css` via `@import`

**Fonts Loaded**:
1. **Playfair Display**
   - Weights: 700 (bold), 800 (extra bold)
   - Usage: All headings (h1, h2, h3, h4)
   - Style: Serif, elegant, feminine

2. **Nunito**
   - Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra bold)
   - Usage: Body text, buttons, labels
   - Style: Rounded sans-serif, modern

**Performance**: Single HTTP/2 request with display=swap (font loading strategy)

---

## No External APIs or Services

### Missing Integrations
- No analytics (Google Analytics, Mixpanel, etc.)
- No backend API calls
- No third-party authentication
- No payment processing
- No email/SMS services
- No cloud storage
- No tracking pixels
- No real-time data sources

---

## Browser APIs & Storage

### localStorage
**Purpose**: Persistent progress tracking across page reloads

**Implementation**: `js/guide.js`

**Data Structure**:
```javascript
// Key format: lavar__<page>__<stepId>
// Example: lavar__brancas__step-1
localStorage.setItem(getStepKey(stepId), '1')
localStorage.removeItem(getStepKey(stepId))
```

**Stored Data**:
- **Page**: Current guide page (brancas, pretas, coloridas, toalha, cama, edredom)
- **Steps**: Completion status (1 = done, absent = not done)
- **Persistence**: Per-page progress (user can undo completion)

**Storage Limit**: ~5-10MB (browser-dependent)

**Scope**: Per origin (domain-specific, no cross-domain access)

### No sessionStorage
Not used in application.

---

## Notable Browser APIs Used

### Intersection Observer API
**File**: `js/guide.js` (initScrollAnimations)

**Purpose**: Detect when page elements enter viewport for scroll-triggered animations

**Usage**:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
```

**Applied To**: `.step-item` elements with staggered delays

**Performance**: Efficient, replaced scroll event listeners

### Mutation Observer API
**File**: `js/guide.js` (launchConfetti)

**Purpose**: Watch completion banner visibility to trigger confetti animation

**Usage**:
```javascript
const observer = new MutationObserver((mutations) => {
  if (m.target.classList.contains('visible')) launchConfetti();
});
observer.observe(banner, { attributes: true, attributeFilter: ['class'] });
```

### DOM Events
**Files**: `js/app.js`, `js/guide.js`

**Events**:
- `DOMContentLoaded`: Initialize animations & components on page load
- `click`: Tab selection, button interactions, step expansion/collapse
- `submit`: Form handling (if applicable)

---

## Network Requests

### Initial Page Load
1. **HTML file** (main document)
2. **CSS**
   - `css/styles.css` (24KB)
   - `css/guide.css` (17.8KB, guide pages only)
3. **JavaScript**
   - `js/app.js` (10.4KB, homepage)
   - `js/guide.js` (9.1KB, guide pages)
4. **Fonts**
   - Google Fonts CSS (single request with font files bundled by Google)

**Total Requests**: 3-4 HTTP/2 requests
**Total Payload**: ~60-70KB (uncompressed), ~15-20KB (gzip)

### Zero Data Requests
- No API calls
- No dynamic content fetching
- No analytics pings
- No third-party scripts

---

## Meta Tags & Page Metadata

### Global Meta Tags (all pages)
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[Page-specific description]">
```

**Standard HTML5 metadata** — No tracking or OG tags observed.

---

## No Authentication or User Accounts
- No login system
- No user registration
- No API tokens or credentials
- All data is public and client-side

---

## No Data Collection
- No cookies (no analytics)
- No user tracking
- No behavioral data collection
- No telemetry
- No advertising pixels

**Privacy**: All user progress stored locally in browser (no server sync)

---

## No Third-Party Libraries from npm/CDN
- No jQuery
- No Bootstrap
- No UI component libraries
- No animation libraries (Animate.css, AOS, etc.)
- No utility libraries (Lodash, moment.js, etc.)
- No data visualization libraries

All functionality implemented in vanilla JavaScript.

---

## File Serving Considerations

### Static File Requirements
- Web server must serve `.html`, `.css`, `.js` files with correct MIME types
- `Content-Type: text/html` for `.html`
- `Content-Type: text/css` for `.css`
- `Content-Type: application/javascript` for `.js`

### No Special Configuration
- No `.htaccess` redirects needed
- No CORS configuration
- No CSP (Content Security Policy) headers
- No authentication headers

### Recommended Headers
- `Cache-Control: max-age=3600` (CSS/JS)
- `Cache-Control: no-cache` (HTML)
- `Vary: Accept-Encoding` (for gzip)

---

## Performance Optimizations Observed

### Already Implemented
1. **CSS Variables** for reduced file size and theme flexibility
2. **Intersection Observer** for efficient scroll animations (no scroll event spam)
3. **localStorage** for persistent state (no network round-trips)
4. **Lazy font loading** via Google Fonts `display=swap`

### Opportunities (Not Implemented)
- Image optimization (none currently used)
- Service Workers for offline support
- Minification of CSS/JS (production build step)
- Compression (relies on web server)
- CDN distribution for static assets

---

## Integration Points Summary

| Integration | Type | Status | Details |
|-------------|------|--------|---------|
| **Google Fonts** | External CDN | Active | Playfair Display + Nunito |
| **localStorage** | Browser API | Active | Progress tracking per page |
| **Intersection Observer** | Browser API | Active | Scroll animations |
| **Mutation Observer** | Browser API | Active | Completion banner detection |
| **Analytics** | Missing | None | No tracking |
| **Backend API** | Missing | None | Static content only |
| **Authentication** | Missing | None | No user accounts |
| **Email** | Missing | None | No email integration |
| **Payment** | Missing | None | No e-commerce |

---

## Security Considerations

### Minimal Attack Surface
- No user input validation (static content only)
- No backend vulnerabilities
- No database injection risks
- No authentication bypasses

### XSS Protection
- No user-generated content rendered
- All content hardcoded in HTML/JavaScript
- No `innerHTML` with untrusted data
- `localStorage` only stores completion flags ('1' or absent)

### CORS & Cross-Origin
- Not applicable (all resources same-origin)
- Google Fonts loaded from `fonts.googleapis.com` (trusted CDN, read-only)

---

## Compliance & Privacy

### GDPR
- No cookies or tracking → no consent banner needed
- No personal data collection → GDPR compliance automatic

### Analytics Opt-in
- Not applicable (no analytics)

### Accessibility
- HTML5 semantic markup
- ARIA attributes (if used, not observed in sample)
- Keyboard navigation support via native browser behavior

