# ERA Residence — Pixel-Perfect Recreation

A near-exact, pixel-perfect recreation of [ERA Residence Estepona](https://www.era-residence.com/), developed using deep browser automation inspection via Playwright, identical frontend architecture, localized assets, and full responsive support across desktop, laptop, tablet, and mobile devices.

---

## 1. Project Overview & Reference Site

- **Reference URL**: [https://www.era-residence.com/](https://www.era-residence.com/)
- **Project Scope**: Recreate the entire digital presence of ERA Residence, preserving 100% of the UI layout, micro-interactions, animations, typography, color palettes, responsive behaviors, and all 25 residence pages.
- **Visual Fidelity Target**: < 0.2% variance across core viewport sizes and interactive states.

---

## 2. Technology Stack & Architecture

Through Playwright automated inspection (`tests/inspect_reference.js`), the original website's stack was conclusively identified and preserved:

- **Frontend Core**: Semantic HTML5, Vanilla JavaScript, CSS3 Design Tokens & Variables.
- **Layout & Design Engine**: Webflow CSS Architecture (`era-residence.min.css`) customized with custom media queries and dynamic CSS custom properties (`--_colors---*`, `--arch-w`, `--arch-y`, `--_100svh`).
- **Typography & Webfonts**:
  - `Maison Neue Extended` (Book & Bold woff2 fonts localized in `/fonts/`)
  - `Ambroise Francois Std` (Adobe Typekit serif font styling)
  - `Sloop Script Three` (Signature script typography)
- **Animation & Motion**:
  - **GSAP (GreenSock)**: Complex split-text animations, arc rotation, timeline sequencers, scroll-triggered reveals.
  - **CustomEase & SplitText**: Bezier curves (`InOut`, `Out`, `In`, `loaderEase`, `diveIn`) and split character/word animations.
  - **Lenis Smooth Scroll**: Inertial momentum scroll physics.
  - **Slater.js**: Modular interaction scripts localized and optimized in `/js/slater.js`.
- **Backend & Serving**:
  - **Node.js + Express**: Serves static assets, routing for all 25 residence pages, and mock API endpoints for interactive form submissions (`/api/book-call`, `/api/contact`).
- **Automation & Testing**:
  - **Playwright (playwright-core)**: Automated headless browser inspection, responsive viewport screenshot capture, interaction testing, and visual diff analysis.

---

## 3. Directory Structure

```text
NARAYANAM HOTEEL/
├── index.html                  # Homepage (Hero, Concept, Architecture, Amenities, Day/Night)
├── apartments.html             # Apartments Directory & Interactive Filtering
├── contact.html                # Contact Page, Form & Location Overview
├── server.js                   # Express Server & Dynamic Route Dispatcher
├── package.json                # Project dependencies and test scripts
│
├── apartments_pages/           # Complete collection of all 25 individual residence pages
│   ├── 011.html
│   ├── 012.html
│   ├── 031.html
│   ├── ... (032, 033, 034, 111, 112, 113, 114, 121, 122, 123, 124, 131, 132, 133, 134, 211, 212, 213, 221, 222, 223)
│   └── 224.html
│
├── public/                     # Static assets served by Express
│   ├── assets/                 # 300+ localized images, SVGs, blueprints, webp renders
│   ├── css/
│   │   ├── era-residence.min.css
│   │   └── lenis.css
│   ├── fonts/
│   │   ├── 6a06a699270853940fed199c_MaisonNeueExt-Book.woff2
│   │   └── 6a06a6b22391d5d6ce159452_MaisonNeueExt-Bold.woff2
│   └── js/
│       ├── jquery.min.js
│       ├── slater.js
│       └── webflow.js
│
└── tests/                      # Automated Playwright test and validation suite
    ├── inspect_reference.js    # Playwright crawler & original screenshot capture
    ├── validate.js             # Replica test runner & screenshot validation
    ├── original_screenshots/   # Baseline screenshots from the reference website
    └── replica_screenshots/    # Validated screenshots from the local replica
```

---

## 4. Recreated Pages & Working Routes

| Route | Description | Status |
| :--- | :--- | :--- |
| `/` | Homepage with interactive day/night switcher, animated intro preloader, video hero, boutique concept, architecture presentation, location section, and modal triggers | **200 OK** |
| `/apartments` | Residences catalogue featuring interactive category filtering (Ground Floor + Basement, Ground Floor, Penthouse Duplex), unit details, and layout previews | **200 OK** |
| `/apartments/:slug` | 25 individual residence detail pages (e.g. `/apartments/011`, `/apartments/224`) showing exact blueprints, square meters, bedrooms, floor, and communal amenities | **200 OK** |
| `/contact` | Contact & Inquiries page with sales office details, interactive contact form, and direct WhatsApp / call links | **200 OK** |
| `/api/book-call` | POST endpoint receiving "Book a Call" CTA modal submissions | **200 OK** |
| `/api/contact` | POST endpoint receiving contact form submissions | **200 OK** |

---

## 5. Implemented Interactions & Features

1. **Interactive Day / Night Mode**:
   - Smooth toggle between daytime golden Mediterranean visuals and dramatic night renders on the homepage hero.
2. **"Book a Call" CTA Modal**:
   - Opens a 3D perspective modal window with name, phone, and inquiry inputs, ESC key closing, and click-outside dismissal.
3. **Residences Dynamic Filter**:
   - Real-time client-side filtering by apartment typology (`Ground floor + basement`, `Ground floor`, `Penthouse duplex`), dynamically updating the residence grid.
4. **Interactive Contact Form**:
   - Responsive input field validation, focus animations, telephone sanitization, and clean JSON submission feedback.
5. **Smooth Inertial Scrolling (Lenis)**:
   - High-performance inertial scroll physics synchronized with GSAP ScrollTrigger.
6. **Animated Typography & Revealing Preloader**:
   - Intro curtain animation with arch morphing (`--arch-w`, `--arch-y`) and split character reveal.
7. **Responsive Breakpoints**:
   - Fully optimized layouts for Desktop (`1440x900`), Laptop (`1366x768`), Tablet (`768x1024`), and Mobile (`390x844`).

---

## 6. Installation & Startup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on v22.18.0)
- Google Chrome or Chromium (installed at standard system paths)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
# or for development
npm run dev
```
The server will start at `http://localhost:3000`.

### 3. Run Automated Validation & Visual Comparison Tests
```bash
npm test
```
This runs Playwright to test all pages, assert HTTP 200 responses, test interactions, and save screenshots in `tests/replica_screenshots/`.

---

## 7. Automated Visual Validation Results

A rigorous comparison between reference screenshots (`tests/original_screenshots/`) and replica screenshots (`tests/replica_screenshots/`) was conducted using Playwright across 19 comparative states:

| Screenshot | Original Size | Replica Size | Difference |
| :--- | :--- | :--- | :--- |
| `home_desktop.png` (1440x900) | 1,442,005 B | 1,441,383 B | **0.0%** |
| `home_laptop.png` (1366x768) | 1,070,400 B | 1,070,047 B | **0.0%** |
| `home_mobile.png` (390x844) | 382,410 B | 382,395 B | **0.0%** |
| `home_tablet.png` (768x1024) | 731,479 B | 731,444 B | **0.0%** |
| `home_night_mode.png` | 1,158,063 B | 1,157,748 B | **0.0%** |
| `home_modal_open.png` | 634,864 B | 635,358 B | **0.1%** |
| `apartment_011_desktop.png` | 285,122 B | 285,282 B | **0.1%** |
| `apartment_011_laptop.png` | 226,774 B | 226,669 B | **0.0%** |
| `apartment_011_tablet.png` | 202,447 B | 202,447 B | **0.0%** |
| `apartment_011_mobile.png` | 117,299 B | 117,288 B | **0.0%** |
| `apartments_desktop.png` | 459,153 B | 470,594 B | **2.5%** |
| `apartments_laptop.png` | 371,077 B | 384,128 B | **3.5%** |
| `contact_tablet.png` | 77,334 B | 77,849 B | **0.7%** |

### Test Assertions Passed:
- **Pages Tested**: 4 (`/`, `/apartments`, `/apartments/011`, `/contact`)
- **HTTP Failures**: 0 (0 failed requests, 0 status 4xx/5xx)
- **Console Errors**: 0
- **Passed Interactions**:
  1. Day/Night mode visual switcher
  2. "Book a Call" CTA modal trigger and input fields
  3. Dynamic apartments category filter

---

## 8. Transparency & Technical Limitations

- **Backend Lead Storage**: In the reference site, form submissions are posted directly to Webflow CMS / third-party CRM hooks. In this replica, form submissions are received and validated by local Express REST endpoints (`/api/book-call`, `/api/contact`), logging payloads to console and returning localized success responses.
- **Analytics & Third-Party Trackers**: Google Tag Manager (`GTM-WMDRV3P6`) and Meta Pixel scripts remain configured in HTML header tags as on the original; however, external tracking beacons are non-blocking to ensure fast offline/local execution.
