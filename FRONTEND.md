# Curator AI — Frontend Documentation

> **Stack:** React 19 + Vite 8 · CSS Modules (manual prefix scoping) · No routing library  
> **Last updated:** 2026-04-21

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Directory Structure](#2-directory-structure)
3. [Architecture & Routing](#3-architecture--routing)
4. [Design System](#4-design-system)
5. [Pages](#5-pages)
6. [Dashboard Views](#6-dashboard-views)
7. [Components (Legacy)](#7-components-legacy)
8. [Data Flow](#8-data-flow)
9. [UI/UX Issues Found](#9-uiux-issues-found)
10. [Applied Improvements](#10-applied-improvements)
11. [Recommended Folder Refactor](#11-recommended-folder-refactor)
12. [Missing Components & Future Work](#12-missing-components--future-work)

---

## 1. Project Overview

Curator AI is a **career intelligence SaaS** that analyzes a user's resume against a job database, surfaces skill gaps, and provides personalized learning pathways. The frontend is a single-page React app with two primary surfaces:

| Surface | Path | Theme | Purpose |
|---|---|---|---|
| **Landing Page** | `/` (pre-analysis) | Light — `#faf8ff` | Marketing + resume submission |
| **Dashboard** | `/` (post-analysis) | Light — Cognitive Core | Career intelligence workspace |

State-based routing (no React Router) switches between surfaces based on `results !== null` in `App.jsx`.

---

## 2. Directory Structure

### Current Structure

```
client/
├── index.html                      # Entry HTML, Google Fonts (Manrope + Inter)
├── package.json                    # React 19.2.5, Vite 8
├── src/
│   ├── main.jsx                    # React root mount
│   ├── App.jsx                     # Root — state owner, API caller, surface router
│   ├── App.css                     # Sticky nav bar styles (legacy, partially dead)
│   ├── index.css                   # Global dark theme tokens + old component styles
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/                 # ⚠ LEGACY — not rendered by current UI
│   │   ├── CircularProgress.jsx    #   SVG radial progress (dark theme)
│   │   ├── Header.jsx              #   Static h1 header (dark theme)
│   │   ├── JobCard.jsx             #   Job match card (dark theme)
│   │   ├── Recommendations.jsx     #   Collapsible learning links
│   │   ├── ResumeInput.jsx         #   Textarea + sample paste
│   │   ├── ResultsSection.jsx      #   Stats bar + job list wrapper
│   │   └── SkillTag.jsx            #   Skill badge pill
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx         # Full marketing landing page
│   │   └── LandingPage.css         # Light theme — `.lp-` prefix
│   │
│   └── dashboard/
│       ├── Dashboard.jsx           # Sidebar + view router
│       ├── Dashboard.css           # Light "Cognitive Core" design system — `.db-` prefix
│       └── views/
│           ├── Overview.jsx        # Executive dashboard — skills + top jobs
│           ├── SkillGap.jsx        # Job detail — readiness score + gap analysis
│           ├── CareerPath.jsx      # 4 strategic career trajectories
│           ├── SkillLab.jsx        # Learning modules + badges + certs
│           ├── ResourceLibrary.jsx # Curated course library + goal ring
│           ├── ResumeBuilder.jsx   # Split-pane resume editor + live preview
│           └── Settings.jsx        # Profile + toggles + privacy cards
```

### Recommended Structure (post-refactor)

```
client/src/
├── main.jsx
├── App.jsx
│
├── shared/
│   ├── components/
│   │   ├── RadialProgress.jsx      # Unified radial (replaces 3 inline versions)
│   │   ├── SkillChip.jsx           # Unified skill badge (replaces SkillTag + db-chip)
│   │   ├── Badge.jsx               # Status badge pill
│   │   ├── EmptyState.jsx          # Reusable zero-data placeholder
│   │   └── LoadingSpinner.jsx      # Reusable spinner
│   └── hooks/
│       ├── useAnalyze.js           # Extract API call logic from App.jsx
│       └── useLocalStorage.js      # Persist user prefs
│
├── styles/
│   ├── tokens.css                  # Single source of truth for all CSS vars
│   ├── reset.css                   # Box-sizing, margin, padding reset
│   └── animations.css              # Shared keyframes
│
├── pages/
│   ├── landing/
│   │   ├── LandingPage.jsx
│   │   └── LandingPage.css
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── Dashboard.css
│       └── views/
│           ├── Overview.jsx
│           ├── SkillGap.jsx
│           ├── CareerPath.jsx
│           ├── SkillLab.jsx
│           ├── ResourceLibrary.jsx
│           ├── ResumeBuilder.jsx
│           └── Settings.jsx
│
└── legacy/                         # Archive — not rendered, kept for reference
    └── components/
        ├── CircularProgress.jsx
        ├── Header.jsx
        ├── JobCard.jsx
        ├── Recommendations.jsx
        ├── ResumeInput.jsx
        ├── ResultsSection.jsx
        └── SkillTag.jsx
```

---

## 3. Architecture & Routing

### State Machine

```
App.jsx (results state)
 │
 ├── results === null ──→ LandingPage
 │                           │
 │                           └── onAnalyze(resumeText) ──→ POST /api/analyze
 │                                                              │
 │                                   setResults(data) ◄────────┘
 │
 └── results !== null ──→ Dashboard
                              │
                              ├── useState('overview')  ← current view
                              │
                              ├── 'overview'       → Overview.jsx
                              ├── 'match-engine'   → SkillGap.jsx
                              ├── 'career-path'    → CareerPath.jsx
                              ├── 'skill-lab'      → SkillLab.jsx
                              ├── 'resources'      → ResourceLibrary.jsx
                              ├── 'resume-builder' → ResumeBuilder.jsx
                              └── 'settings'       → Settings.jsx
```

### API

| Method | Endpoint | Payload | Response |
|--------|----------|---------|----------|
| `POST` | `http://localhost:5000/api/analyze` | `{ resumeText: string }` | `{ extractedSkills, totalSkillsFound, totalJobsMatched, results[] }` |

### Results Shape

```typescript
interface AnalysisResult {
  extractedSkills: string[];
  totalSkillsFound: number;
  totalJobsMatched: number;
  results: JobMatch[];
}

interface JobMatch {
  id: string;
  job_title: string;
  description: string;
  matchScore: number;          // 0–100
  matchedSkills: string[];
  missingSkills: string[];
  matchedCount: number;
  totalRequired: number;
  recommendations: Recommendation[];
}

interface Recommendation {
  skill: string;
  resources: { title: string; url: string }[];
}
```

---

## 4. Design System

### Three CSS Layers (current)

| File | Scope | Theme | Prefix | Status |
|------|-------|-------|--------|--------|
| `index.css` | Global | Dark (`#06080f`) | none | Partially dead — body bg overridden by Dashboard |
| `LandingPage.css` | Landing only | Light (`#faf8ff`) | `.lp-` | Active |
| `Dashboard.css` | Dashboard only | Light (`#faf8ff`) | `.db-` | Active |

### Cognitive Core Tokens (Dashboard)

```css
/* Surfaces */
--bg:         #faf8ff   /* page background */
--bg-low:     #f2f3ff   /* sidebar, recessed surfaces */
--bg-high:    #dae2fd   /* hover states, active chips */
--card:       #ffffff   /* elevated cards */

/* Primary */
--primary:    #1e3a8a
--primary-dk: #00236f

/* Accents */
--cyan:       #0891b2
--purple:     #37007e
--green:      #059669
--amber:      #d97706
--red:        #dc2626

/* Text */
--ink:        #131b2e   /* alias: --text */
--ink-2:      #44496b   /* alias: --text-2 */
--ink-3:      #8b91a8   /* alias: --text-3 */

/* Shadows (min 24px blur, 4–7% opacity) */
--sh-xs:  0 1px 12px rgba(19,27,46,0.04)
--sh-sm:  0 2px 24px rgba(19,27,46,0.07)
--sh-md:  0 6px 32px rgba(19,27,46,0.10)

/* Border radius */
--r-sm: 6px  --r-md: 10px  --r-lg: 14px  --r-xl: 20px  --r-2xl: 28px
```

### No-Line Rule

Separation between surfaces is achieved through **tonal background shifts**, not 1px borders. Ghost borders (`rgba(197,197,211,0.22)`) are only permitted on interactive elements (buttons, focused inputs).

### Typography

| Role | Font | Weight |
|------|------|--------|
| Display / Headlines | Manrope | 700–900 |
| Body / Labels | Inter | 400–600 |

---

## 5. Pages

### LandingPage (`src/pages/LandingPage.jsx`)

**Sections:**

| Section | Description |
|---------|-------------|
| `NavBar` | Sticky top nav with logo, links, CTA button |
| `HeroSection` | Headline, stats row, animated Extraction Engine glassmorphism card |
| `ResumeSection` | Textarea (paste) + drag-drop upload zone + submit button |
| `FeaturesSection` | 3 feature cards — AI Match, Skill Gap, Learning Path |
| `FooterSection` | 4-column footer with newsletter input |

**Props:**

```jsx
<LandingPage
  onAnalyze={fn}      // (resumeText: string) => void
  isLoading={bool}    // disables submit, shows spinner
  error={string|null} // renders error banner below textarea
/>
```

**Key behaviors:**
- Drag-and-drop `.txt` / `.pdf` file reading via `FileReader`
- Character count display on textarea
- Error banner with server error messages
- `isLoading` disables the entire form

---

### Dashboard (`src/dashboard/Dashboard.jsx`)

**Layout:**

```
┌──────────────┬─────────────────────────────────────────┐
│   Sidebar    │              Main Content                 │
│  (240px)     │   (flex: 1, scrollable)                  │
│              │                                           │
│  Brand logo  │   <current view rendered here>           │
│  Nav items   │                                           │
│  CTA button  │                                           │
└──────────────┴─────────────────────────────────────────┘
```

**Props:**

```jsx
<Dashboard
  results={AnalysisResult}    // API response object
  onAnalyzeAgain={fn}         // () => void — returns to LandingPage
/>
```

**Internal state:**

| State | Type | Purpose |
|-------|------|---------|
| `view` | `string` | Active nav item id |
| `activeJob` | `JobMatch\|null` | Job selected from Overview → passed to SkillGap |

---

## 6. Dashboard Views

### Overview (`views/Overview.jsx`)

**Data used:** `results.extractedSkills`, `results.results` (job matches)

**Layout:**
- Left column: Extracted Skills card (3 tiers: Advanced / Intermediate / Beginner) + AI Career Coaching gradient card
- Right column: Top 3 job match cards with circular radial progress, salary, location, apply/details buttons

**Skill tiering logic:** Hardcoded `Set` membership — `ADVANCED_SKILLS` and `INTERMEDIATE_SKILLS` sets determine tier; anything else is Beginner.

---

### SkillGap / Match Engine (`views/SkillGap.jsx`)

**Data used:** `job` (from Overview selection or `results.results[0]`)

**Layout:**
- Job header: title, description, meta chips (location, salary, contract type)
- Left: Large radial readiness score + career path simulator bar + skill gap analysis (matched vs. missing chips) + Curator's Tip (glassmorphism)
- Right: Fastest Path to Hire bar chart + Market Competitiveness stack + Salary Benchmark card (indigo gradient)

---

### CareerPath (`views/CareerPath.jsx`)

**Data used:** Static mock data (4 paths)

**Layout:** 2×2 grid of path cards. Each card shows gradient icon, stats (growth/demand/salary), progression nodes, core skills chips, AI recommendation box, and action buttons.

**Paths:** Data Science & AI · Product Management · Cloud Engineering · Full-Stack Development

---

### SkillLab (`views/SkillLab.jsx`)

**Data used:** `results.results[0].missingSkills[0]` (for Curator suggestion)

**Layout:**
- Header with badge count
- Current Focus card (gradient, 86% progress bar)
- Badges + Certificates row
- Filterable module grid (All / Beginner / Intermediate / Advanced)
- Curator suggestion + 2 lab cards

---

### ResourceLibrary (`views/ResourceLibrary.jsx`)

**Data used:** `results.results` (to count total matched skills)

**Layout:**
- Header with goal progress ring (SVG)
- Resource sections: Data Visualization + Cloud Architecture (3 cards each)
- Newsletter subscribe CTA (indigo gradient banner)

---

### ResumeBuilder (`views/ResumeBuilder.jsx`)

**Data used:** `results.extractedSkills`, `results.results[0]`

**Layout (split pane):**
- Left: Collapsible accordion sections (Executive Summary / Skill Intelligence / Professional Tenure) + support/save buttons + Analyze Resume CTA
- Right: Live PDF-style preview card (white, hardcoded Alexander Sterling persona)

---

### Settings (`views/Settings.jsx`)

**Data used:** None (fully static mock data)

**Layout:**
- Profile card (hardcoded: Alexander Sterling)
- Intelligence Feed toggles (4 toggles with local state)
- Security/Privacy/AI Data cards grid
- Danger zone (delete account button)

---

## 7. Components (Legacy)

> These components exist in `src/components/` but are **not imported or rendered** by any current page or view. They represent the original MVP dark-theme analyzer UI.

| Component | Description | Status |
|-----------|-------------|--------|
| `Header.jsx` | Static page header with badge + h1 | Dead code |
| `ResumeInput.jsx` | Textarea + sample paste + submit | Dead code — replaced by LandingPage's inline form |
| `ResultsSection.jsx` | Stats bar + skills list + job card grid | Dead code |
| `JobCard.jsx` | Dark-theme job match card | Dead code |
| `CircularProgress.jsx` | SVG radial progress | Dead code — dashboard uses inline versions |
| `SkillTag.jsx` | `matched / missing / extracted` pill badge | Dead code — dashboard uses `.db-chip` |
| `Recommendations.jsx` | Collapsible learning resource links | Dead code |

**Recommendation:** Move to `src/legacy/` or remove entirely after confirming they will not be reused.

---

## 8. Data Flow

```
User pastes resume text
        │
        ▼
LandingPage.jsx
  └── onAnalyze(text) ──→ App.jsx handleAnalyze()
                                    │
                                    ▼
                          POST /api/analyze
                                    │
                          { extractedSkills, results[] }
                                    │
                                    ▼
                          setResults(data)
                                    │
                    ┌───────────────┘
                    ▼
             Dashboard.jsx
              results prop
                    │
      ┌─────────────┼──────────────────────────────┐
      ▼             ▼                               ▼
 Overview.jsx  SkillGap.jsx             ResumeBuilder.jsx
 (all jobs)    (selected job)           (extractedSkills)

```

**Mock data sources (not from API):**
- CareerPath — 4 hardcoded paths with static growth/salary numbers
- SkillLab — 3 hardcoded modules, BADGE_COLORS, CERTS array
- ResourceLibrary — SECTIONS array with course cards
- Settings — TOGGLES, SETTING_CARDS, profile (Alexander Sterling)
- Overview — MOCK_SALARIES, MOCK_LOCATIONS, MOCK_COMPANIES arrays

---

## 9. UI/UX Issues Found

### Critical Bugs

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **Unreachable route** — `'resources'` case exists in `renderView()` but no nav item triggers it | `Dashboard.jsx:119` | ResourceLibrary is inaccessible |
| 2 | **Import order violation** — `import { useState }` is on line 50, after all constant declarations | `Settings.jsx:50` | React Fast Refresh warnings, unpredictable HMR |
| 3 | **Dead component folder** — `src/components/` (7 files) not imported anywhere | `components/*` | Bloated bundle concern; misleads contributors |

### Design Inconsistencies

| # | Issue | Location |
|---|-------|----------|
| 4 | Three competing CSS design systems coexist (`index.css` dark, `LandingPage.css` light, `Dashboard.css` light) with no shared token file | Global |
| 5 | `index.css` sets `body { background: #06080f }` (dark); Dashboard overrides with `body:has(.dashboard)` selector hack | `index.css`, `Dashboard.css` |
| 6 | `App.css` defines `.results-nav` styles for a navbar that no longer exists in the rendered UI | `App.css` |
| 7 | Emoji used as UI icons (`⭐ 📄 📋 🎯 💼 🏆 🔍`) in legacy components — violates design system no-emoji rule | `components/*` |
| 8 | Settings profile card is fully hardcoded (Alexander Sterling) — shows no real user data from the resume | `Settings.jsx` |
| 9 | `RadialProgress` component duplicated 3 times inline (Overview, SkillGap, ResourceLibrary) with slight variations | Multiple views |

### Responsiveness Gaps

| # | Issue | Location |
|---|-------|----------|
| 10 | Dashboard has no mobile sidebar — at `<768px` the 240px sidebar takes too much horizontal space | `Dashboard.jsx/css` |
| 11 | Dashboard two-column grids (`db-overview__grid`, `db-skillgap__grid`) don't collapse on mobile | `Dashboard.css` |
| 12 | SkillLab 3-column curator row (`grid-template-columns: 1fr 1fr 1fr`) doesn't have a mobile breakpoint | `SkillLab.jsx:182` |

### Accessibility Gaps

| # | Issue | Location |
|---|-------|----------|
| 13 | Dashboard sidebar nav uses `<button>` for navigation — should use `role="navigation"` with `aria-current="page"` | `Dashboard.jsx` |
| 14 | Toggle buttons in Settings lack `aria-pressed` attribute | `Settings.jsx` |
| 15 | SVG icons throughout dashboard have no `aria-label` or `aria-hidden` | All views |

---

## 10. Applied Improvements

The following improvements have been applied directly to the codebase:

### ✅ Fixed: Settings.jsx import order
`import { useState }` moved from line 50 to line 1, before all constant declarations.

### ✅ Fixed: Resource Library unreachable route
Added `Resources` (`BookIcon`) to the Dashboard NAV array with `id: 'resources'`, making `ResourceLibrary` accessible from the sidebar.

### ✅ Fixed: Mobile responsive sidebar
Added `sidebarOpen` state to Dashboard with a hamburger toggle button visible on mobile (`<768px`). Sidebar slides in as an overlay with a backdrop dismiss. Dashboard.css updated with mobile breakpoints for all major grids.

### ✅ Fixed: Settings profile shows real data
Settings profile card now reads `extractedSkills.length` and top job title from the `results` prop instead of fully hardcoded values.

### ✅ Fixed: CSS variable aliases
Added `--text`, `--text-2`, `--text-3`, `--border` aliases in Dashboard.css so all existing JSX inline styles resolve correctly without a mass rename.

### ✅ Fixed: Light theme inline color overrides
All hardcoded dark-theme hex colors (`#4ade80`, `rgba(255,255,255,0.06)`, `#070d1d`) in view components converted to design token references.

---

## 11. Recommended Folder Refactor

```
src/
├── shared/
│   ├── components/
│   │   ├── RadialProgress.jsx      # Single source — accepts size, score, label
│   │   ├── SkillChip.jsx           # Unified pill: variant (match/miss/skill/gray)
│   │   ├── StatCard.jsx            # Reusable metric tile
│   │   ├── EmptyState.jsx          # Zero-data placeholder
│   │   └── LoadingSpinner.jsx
│   └── hooks/
│       ├── useAnalyze.js           # Lift API logic out of App.jsx
│       └── useLocalStorage.js      # Persist toggle preferences
│
├── styles/
│   ├── tokens.css                  # All --var tokens in one file
│   ├── reset.css                   # Reset only
│   └── animations.css              # @keyframes only
│
└── pages/
    ├── landing/
    │   ├── LandingPage.jsx
    │   └── LandingPage.css
    └── dashboard/
        ├── Dashboard.jsx
        ├── Dashboard.css
        └── views/
```

---

## 12. Missing Components & Future Work

### Suggested New Components

| Component | Purpose |
|-----------|---------|
| `Toast / Notification` | Success/error feedback after actions (save resume, subscribe) |
| `Modal` | Confirmation dialogs (delete account, discard changes) |
| `Skeleton` | Loading placeholders for async content |
| `Tooltip` | Explanatory hints on skill chips and score meters |
| `ProgressStepper` | Multi-step onboarding flow |
| `SearchBar` | Filter jobs/skills across views |

### Suggested Features

| Feature | View | Priority |
|---------|------|----------|
| Real user profile from resume parsing | Settings | High |
| Job bookmarking | Overview, SkillGap | High |
| Resume PDF export | ResumeBuilder | High |
| Skill comparison chart (radar) | SkillGap | Medium |
| Dark mode toggle | Global | Medium |
| React Router integration | App.jsx | Medium |
| Persistent state via localStorage | App.jsx | Medium |
| Onboarding walkthrough | Dashboard | Low |
