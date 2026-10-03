---
name: Saif AI Skills Console
description: >
  Canonical visual design system for the multilingual Saif AI Skills Console.
  Use this file when generating or editing Stitch screens for the public console.
colors:
  primary: "#007AFF"
  indigo: "#5856D6"
  purple: "#AF52DE"
  pink: "#FF2D55"
  orange: "#FF9500"
  green: "#34C759"
  cyan: "#32ADE6"
  background: "#F5F7FB"
  foreground: "#101828"
  muted: "#667085"
  border: "#E4E7EC"
  surface: "#FFFFFF"

# Design System: Saif AI Skills Console

## 1. Visual Theme & Atmosphere

A calm, precise AI workbench for professional translation, localization, language research, quality checking, and agent engineering. The interface should feel like a finished product: restrained, information-dense where useful, spacious where decisions matter, and visually confident without becoming decorative.

Use a light neutral foundation with translucent white surfaces, subtle depth, and controlled luminous accents. Blue is the primary interaction signal; indigo and purple support AI/intelligence states. Avoid generic "AI neon" aesthetics, excessive gradients, excessive glass, and nested cards.

## 2. Color Palette & Roles

### Primary Foundation
- Background: #F5F7FB — page canvas.
- Surface: #FFFFFF — primary work surfaces.
- Foreground: #101828 — primary text.
- Muted: #667085 — secondary text.
- Border: #E4E7EC — structure and separation.

### Accent & Interactive
- Saif Blue: #007AFF — primary actions, active controls, links.
- Indigo: #5856D6 — secondary intelligence accent.
- Purple: #AF52DE — AI/creative accent.
- Cyan: #32ADE6 — informational accent.
- Orange: #FF9500 — attention and transitional states.
- Pink: #FF2D55 — rare emphasis only.

### Functional States
- Green #34C759 — success/readiness.
- Amber — review/caution.
- Red — failure/destructive state.
- Blue — active/in-progress state.

Functional colors communicate state; they are not decorative.

## 3. Typography Rules

English/Latin uses a clean system/UI sans stack.

Arabic uses Cairo as the primary UI font.

Urdu uses Mehr Nastaliq as the primary UI font.

Persian uses a Persian-compatible RTL UI font with correct shaping.

Headings are strong, compact, and tightly tracked. Body text is readable and moderately dense. Metadata may use small monospace text where it communicates technical state.

Do not use decorative serif typography for application controls.

## 4. Component Stylings

### Buttons
Primary buttons have high contrast, compact height, approximately 9–12px radius, and clear action labels. Secondary buttons use neutral white surfaces with visible borders.

The language switcher has four direct choices: English, العربية, اردو, فارسی. The active language is visibly distinct and accessible.

### Cards & Containers
Primary panels use approximately 20–24px radius, low-contrast borders, and soft shadows. Secondary cards use smaller radii and flatter depth. Avoid heavy shadow stacking and excessive nested containers.

### Navigation
The top bar is compact, sticky, neutral/translucent, and separated by a subtle bottom border. Navigation must remain usable in LTR and RTL.

### Inputs & Forms
Inputs use near-white surfaces, subtle borders, approximately 8–12px radius, clear labels, visible focus states, and no horizontal overflow. Textareas should have comfortable line height.

### Domain Components
Skill cards are compact routing affordances and should show human-readable names, not internal IDs.

The Localization Workbench is the primary workflow surface. Keep source, target/result, knowledge/reference, and execution controls visually distinct.

The execution pipeline represents Router → Planner → Execution → Human Review Gate. It must distinguish pending, active, completed, and review-required states.

Second Brain surfaces are subdued and privacy-oriented. Evidence/provenance and confidence should be discoverable.

## 5. Layout Principles

### Grid & Structure
Use a constrained desktop workspace around 1180–1280px. Use CSS Grid/Flexbox with minmax(0, 1fr) and explicit overflow prevention.

### Whitespace Strategy
Use a compact 4/8px spacing rhythm. Typical section gaps are 18–28px; panel padding is approximately 12–24px.

### Alignment & Visual Balance
The task and primary workflow dominate the visual hierarchy. Secondary information should never compete with the primary action.

### Responsive Behavior & Touch
At tablet and mobile widths, collapse multi-column areas to one column. Test approximately 320px, 390px, tablet, and wide desktop. No component may introduce horizontal scrolling.

## 6. Design System Notes for Stitch Generation

### Language to Use
Describe interfaces as professional multilingual tooling, localization workbenches, agent consoles, and language-technology products. Avoid generic startup dashboards and generic chatbot aesthetics.

### Color References
Always preserve the named roles and exact core hex values above. Prefer blue for primary actions and restrained indigo/purple accents for AI-related emphasis.

### Component Prompts
When generating a screen, explicitly preserve:
- multilingual English/Arabic/Urdu/Persian support;
- genuine RTL behavior;
- Cairo for Arabic;
- Mehr Nastaliq for Urdu;
- compact professional controls;
- responsive behavior;
- the established neutral/light visual foundation.

### Incremental Iteration
Modify one coherent screen or component group at a time. Preserve existing information architecture. Do not recreate production pages that already exist merely to produce a visual variant. Treat this file as the design source of truth and reconcile accepted changes back into the repository.
