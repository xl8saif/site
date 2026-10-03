# Saif AI Skills Console — Stitch Workspace

## Vision

Use Google Stitch as a controlled design/prototyping specialist for the existing Saif AI Skills Console. Stitch designs are exploratory until explicitly accepted and implemented in the production frontend.

## Production boundary

Production remains the static GitHub Pages application under `public/skills/`.

Stitch must not replace production application logic, localization runtime, deterministic validators, Second Brain privacy boundaries, or GitHub Pages deployment.

## Design source of truth

`.stitch/DESIGN.md` is the Stitch-compatible visual contract.

The repository-root `DESIGN.md` is the broader human/agent design contract. If both are changed, keep them semantically synchronized; the root contract contains the wider product and implementation constraints.

## Current product areas

1. Main task console
2. Skill routing / skill cards
3. Localization Workbench
4. Source and target file workflows
5. OCR workflow
6. Execution pipeline
7. Results/evidence
8. Second Brain
9. Multilingual language switching
10. Agent/engineering skills

## Sitemap status

Existing production pages must not be recreated as if they were missing. Stitch is initially used for design exploration and screen variants of the existing console.

## Roadmap

### Phase A — Design foundation
- Extract and stabilize the current visual language.
- Keep `.stitch/DESIGN.md` synchronized with the accepted design system.

### Phase B — Screen studies
- Main console
- Localization Workbench
- Mobile console
- Second Brain
- Results/evidence

### Phase C — Controlled implementation
- Select an accepted Stitch design.
- Translate it into existing HTML/CSS architecture.
- Verify all four languages and responsive breakpoints.
- Run deterministic validation and browser verification.
- Deliver through the normal Git/Jules review process.

## Creative freedom

Stitch may propose layout variants, hierarchy improvements, component compositions, and responsive arrangements, but must preserve the product's established visual identity and multilingual requirements.

## Security boundary

Never upload or expose:
- ChatGPT archives;
- private Second Brain datasets;
- API keys;
- secrets;
- local filesystem paths;
- private user data.

Do not place Stitch credentials in public files or GitHub Pages assets.

## Stitch integration status

This repository currently contains design infrastructure only. A Stitch API key/project connection is intentionally not committed to the repository.

When a live Stitch connection is introduced, credentials must remain in a secure local/CI secret store.
