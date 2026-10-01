# Saif Ullah — Professional Portfolio

Production portfolio for **Saif Ullah**, a multilingual translator, localization specialist, AI data specialist and language technology professional.

**Live portfolio:** https://xl8saif.github.io/site/

## Professional focus

Saif Ullah’s work connects **Arabic ↔ Urdu translation** with **multilingual localization, game LQA/MTPE, AI language data, language technology and low-resource language preservation**. The portfolio also documents practical work in Indus-Kohistani and Shina language research and digital preservation.

## Focus

- Arabic ↔ Urdu ↔ Persian ↔ English translation and localization
- Game localization, MTPE and linguistic quality assurance (LQA)
- AI data, speech/transcription QA and language technology
- Indus-Kohistani and Shina language documentation and digital preservation
- Multilingual web/app development and localization-aware product design

## Site stack

- Vite + React
- Responsive, accessible single-page portfolio
- GitHub Pages deployment via GitHub Actions
- Technical SEO: canonical URL, robots.txt, XML sitemap, Open Graph, structured data and Google Search Console verification
- Local image assets with lazy loading where appropriate

## Professional profiles

- LinkedIn: https://www.linkedin.com/in/xl8saif/
- ProZ: https://www.proz.com/profile/3150554
- Upwork: https://www.upwork.com/freelancers/~011ed3711aa3cf98f4
- GitHub: https://github.com/xl8saif
- FiKR&CD: https://fikrcd.org/
- Email: xl8.saif@gmail.com

## Related projects

- Waraq Legal AI: https://github.com/xl8saif/Waraq-LegalAi
- WEMS: https://github.com/xl8saif/wemsapp
- FiKR&CD Digital Platform: https://fikrcd.pages.dev/

## Search indexing

The site publishes a root-level sitemap and robots.txt and includes structured Person/ProfilePage/WebSite data. Google Search Console can be used to inspect the homepage, request indexing, monitor queries and review discovered backlinks.

## AI Skills Console

The repository includes a static, GitHub Pages-compatible AI Skills Console:

- GitHub Pages UI: https://xl8saif.github.io/site/skills/
- Local API for development: `python api/skills/run.py`
- Local console API endpoint: `http://127.0.0.1:8787/api/skills/run`

The browser console uses the deterministic pipeline:

`Router → Planner → Execution Engine → Human Review Gate`

On GitHub Pages, the console uses its browser-side deterministic runtime and clearly reports when server-side validation is unavailable. It does not depend on a server deployment for the static interface.

## Deployment

The `main` branch is deployed to GitHub Pages through `.github/workflows/deploy.yml`. The Vite base path is fixed to `/site/`, matching the repository Pages URL.

The AI Skills validation workflow independently runs the framework audits, deterministic tests, JavaScript checks, shell checks and production build.
