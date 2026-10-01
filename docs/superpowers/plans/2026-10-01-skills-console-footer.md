# Skills Console Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the AI Skills Console footer with the existing Saif Ullah portfolio footer style while preserving its four-language UI, GitHub Pages deployment, and existing visitor/brand links.

**Architecture:** Keep the existing footer HTML and localize its text through the existing Skills Console runtime. Replace only the footer presentation rules with a portfolio-style two-column desktop layout, compact visitor panel, and circular brand marks; collapse to one column on narrow screens.

**Tech Stack:** Vite, vanilla HTML/CSS/JS in `public/skills/`, GitHub Pages.

**Spec:** User requirements supplied in chat: inspect, plan, implement incrementally, build/test, browser/console verification, responsive verification, RTL/localization verification, fix issues, final regression verification, and report only verified results.

## Global Constraints

- Deployment remains GitHub Pages; do not introduce Vercel deployment.
- Preserve existing visitor counter and visitor-country URLs.
- Preserve Waraq Enterprises and CloudTrans image assets.
- Preserve Arabic, English, Urdu, and Persian support and RTL behavior.
- Preserve existing footer content and accessibility labels unless a verification issue requires a change.
- Do not alter unrelated Skills Console functionality.

## Review Focus

- Desktop footer hierarchy and side-by-side alignment.
- Mobile collapse without overflow.
- Circular logo rendering without distortion.
- RTL footer alignment and readable typography.
- Existing visitor badge and country link remain functional.
- Build output remains valid for the `/site/` GitHub Pages base path.

---

### Task 1: Inspect baseline

**Files:** `public/skills/index.html`, `public/skills/styles.css`, project `package.json`

- [ ] Confirm footer markup, asset paths, language IDs, and current CSS.
- [ ] Confirm available build command and absence/presence of automated tests.
- [ ] Record current main branch commit before implementation.

### Task 2: Implement portfolio-style footer

**Files:** Modify `public/skills/styles.css`

- [ ] Add a scoped footer presentation override matching the portfolio: dark/navy footer, compact mono metadata, two-column desktop grid, centered circular logos.
- [ ] Add responsive one-column behavior below 620px.
- [ ] Preserve existing selectors and avoid unrelated style changes.

### Task 3: Build verification

- [ ] Run `npm install` and `npm run build`.
- [ ] Confirm Vite exits successfully and produces the expected `dist` output.

### Task 4: Browser and responsive verification

- [ ] Start the Vite dev server.
- [ ] Verify the page loads with agent-browser.
- [ ] Check console/error overlay and key footer elements.
- [ ] Check desktop and narrow viewport rendering.
- [ ] Verify Arabic/Urdu/Persian RTL state and localized footer text.

### Task 5: Regression and review

- [ ] Re-fetch changed source from GitHub and confirm only intended footer rules changed.
- [ ] Check GitHub Actions for the implementation commit.
- [ ] If verification passes, merge the branch into `main`; otherwise fix and repeat verification.
