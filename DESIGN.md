# Saif AI Skills Console — Design System

Version: 1.0.0
Status: canonical visual contract for the public Skills Console
Scope: `public/skills/`

## Product intent

Saif AI Skills Console is a multilingual, tool-oriented workspace for translation, localization, quality checking, language research, and agent workflows. The interface should feel like a focused professional product rather than a generic AI chat application.

The visual system favors calm hierarchy, compact information density, precise controls, generous whitespace, neutral surfaces, and restrained luminous accents.

## Design principles

1. Clarity before decoration.
2. The task and primary workflow remain visually dominant.
3. Use color to communicate interaction, state, and hierarchy—not as decoration.
4. Prefer one coherent surface hierarchy over many nested cards.
5. Keep controls compact but touch-friendly.
6. Responsive behavior is part of the design, not a later adaptation.
7. RTL is a first-class layout mode.
8. Preserve the existing application architecture and behavior when changing presentation.
9. Accessibility, focus visibility, readable contrast, and reduced motion are required.
10. Never expose private Second Brain data, secrets, API keys, archives, or local filesystem paths in the public interface.

## Brand and color tokens

Primary interaction:
- Saif blue: `#007AFF`
- Indigo accent: `#5856D6`
- Purple accent: `#AF52DE`
- Pink accent: `#FF2D55`
- Orange accent: `#FF9500`
- Green success: `#34C759`
- Cyan accent: `#32ADE6`

Neutral foundation:
- Page background: `#F5F7FB`
- Primary text: `#101828`
- Secondary text: `#667085`
- Subtle text: `#98A2B3`
- Surface: translucent white, normally around 0.88–0.98 opacity
- Border: low-contrast neutral, normally rgba(16,24,40,.07–.10)
- Input background: near-white neutral
- Code/evidence background: dark neutral

Use blue as the primary action color. Indigo/purple are supporting intelligence accents. Green indicates success/readiness. Amber indicates review/caution. Red is reserved for errors or destructive states.

Do not introduce arbitrary new brand colors without a design-system reason.

## Typography

The interface supports Arabic, English, Urdu, and Persian.

Arabic:
- Primary UI font: Cairo.

Urdu:
- Primary UI font: Mehr Nastaliq.

Persian:
- Use a Persian-compatible UI font with correct RTL shaping; do not substitute Latin typography for Persian content.

English/Latin:
- Prefer a clean system/UI sans stack.

Typography characteristics:
- Headings use tight tracking and strong hierarchy.
- Body text is compact and readable.
- Kicker/metadata text may use uppercase or monospace treatment where it communicates product metadata.
- Do not use decorative serif typography for core application controls.
- Avoid excessive font-size variation.

## Direction and localization

Supported interface languages:
- English: `en`
- Arabic: `ar`
- Urdu: `ur`
- Persian: `fa`

Arabic, Urdu, and Persian use genuine RTL layout.

RTL requirements:
- Direction must change with the interface language.
- Text alignment and logical spacing must follow RTL.
- Directional icons and affordances should be mirrored when their meaning is directional.
- Do not solve RTL by merely translating strings.
- Inputs containing source code, XML, HTML, placeholders, filenames, or other inherently LTR content may remain LTR where necessary.
- Language switching must be directly selectable; do not rely on a cycling-only control.

## Layout

Desktop:
- Center the main application within a constrained content width, approximately 1180–1280px.
- Use generous outer whitespace.
- Prefer a single dominant workspace column unless a side panel materially improves the workflow.
- Use CSS Grid/Flexbox with `minmax(0, 1fr)` to prevent overflow.

Mobile:
- Collapse multi-column workspaces to one column.
- Keep controls full-width when necessary.
- Never allow horizontal scrolling caused by cards, buttons, labels, or textareas.
- Preserve comfortable touch targets.
- Test narrow widths around 320–390px.

Spacing:
- Use a compact 4/8px rhythm.
- Large section gaps: approximately 18–28px.
- Card internal padding: approximately 12–24px.
- Avoid excessive nested padding.

## Surfaces

Primary application panels:
- Large radius: approximately 24px.
- Light translucent surface.
- Low-contrast border.
- Soft shadow.
- Optional backdrop blur when it improves hierarchy.

Secondary controls/cards:
- Radius: approximately 8–18px depending on semantic level.
- Prefer flatter surfaces and lighter shadows than primary panels.

Do not stack multiple heavy shadows or glass effects inside one another.

## Buttons and controls

Primary action:
- Saif blue or the established primary dark neutral when the surrounding UI already uses a shadcn-inspired control system.
- High contrast.
- Clear action label.
- Disabled state must remain visually understandable.

Secondary action:
- Neutral surface.
- Visible border.
- Lower visual weight than primary.

Language selector:
- Four direct choices: English, العربية, اردو, فارسی.
- Active language must be visibly identifiable and accessible.
- Controls must remain usable in both LTR and RTL layouts.

Focus:
- Always preserve a visible keyboard focus state.
- Do not remove browser focus indicators without replacing them with a stronger equivalent.

## Skill cards

Skill cards are compact routing affordances.

They should:
- communicate the human-readable skill name;
- avoid exposing internal skill IDs unless explicitly needed;
- support hover/focus/selected states;
- remain readable at narrow widths;
- use restrained accent treatment;
- not overwhelm the task input.

Internal IDs such as `pubg-urdu-lqa` and `jules-agent-workflow` belong to the runtime/registry, not the primary user-facing presentation.

## Localization Workbench

The Localization Workbench is a primary workflow surface.

Information hierarchy:
1. Workbench title and short explanation.
2. Target language and selected skill.
3. Source and target/result areas.
4. Optional knowledge/reference input.
5. Primary run action.
6. Export/review state.

Source and target areas should be visually related but clearly distinct.

The interface should make the next required action obvious without requiring the user to understand the internal Router → Planner → Execution → Human Review architecture.

## Execution pipeline

The pipeline represents deterministic orchestration:
- Router
- Planner
- Execution
- Review Gate

Stages should communicate:
- pending;
- active;
- completed;
- review required.

Do not imply that an AI-only result is final when human review is required.

## Second Brain

The Second Brain is local-first/private-by-default.

Visual language:
- calm and subdued;
- clearly separated from the translation workbench;
- searchable;
- evidence/provenance should be visually discoverable;
- status and confidence should be explicit;
- destructive actions should be visually restrained and require appropriate confirmation.

The public application must not embed private memory datasets.

## Evidence and results

Results should prioritize:
1. status;
2. concise summary;
3. findings/metrics;
4. traceability;
5. raw technical data.

Raw JSON and traces may use LTR/code styling even in RTL interfaces.

Severity/status colors must remain semantically consistent:
- success/pass: green;
- review/caution: amber;
- failure/error: red;
- informational/active: blue.

## File and OCR workflows

File controls should clearly distinguish:
- source;
- target;
- knowledge/reference;
- OCR source;
- OCR target.

Attachment names must wrap rather than force horizontal overflow.

OCR runs locally in the browser for the current public workflow. UI must not imply server-side processing when it is not available.

## Accessibility

Required:
- semantic controls;
- labels for form controls;
- keyboard operation;
- visible focus;
- sufficient contrast;
- `aria-live` for important asynchronous status;
- reduced-motion support;
- no information conveyed by color alone;
- usable touch targets;
- meaningful accessible names.

## Motion

Motion is restrained and functional:
- short transitions;
- subtle elevation/translation on hover;
- progress animation only where it communicates activity;
- honor `prefers-reduced-motion`.

Do not add continuous decorative animation.

## Responsive verification contract

Any visual change must be checked at minimum for:
- desktop wide;
- tablet/intermediate width;
- mobile around 390px;
- narrow mobile around 320px;
- LTR;
- Arabic RTL;
- Urdu RTL;
- Persian RTL.

Check specifically for:
- horizontal overflow;
- clipped text;
- broken language controls;
- overflowing cards;
- inaccessible buttons;
- incorrect font application;
- broken RTL alignment.

## Implementation constraints

- GitHub Pages remains the public deployment target.
- Keep the existing static-browser architecture unless an explicit architectural change is approved.
- Do not replace deterministic validators with opaque AI-only checks.
- Do not introduce a frontend framework solely for visual changes.
- Prefer additive, focused CSS/HTML changes.
- Preserve existing IDs and runtime contracts when possible.
- Preserve localization behavior and direct language switching.
- Keep cache-busting versions synchronized when static assets change.
- Do not expose private Second Brain data or credentials.

## Design evolution

When a new visual decision is accepted:
1. update this contract;
2. update the relevant CSS/component;
3. verify all four languages;
4. verify responsive behavior;
5. record significant architectural/design decisions in the appropriate private knowledge layer.

This file is the bridge between human product decisions, Stitch design work, and coding agents.


## Verification gate

The public Skills Console should pass deterministic source, registry, asset, syntax, and build checks before deployment. Browser/visual verification remains a separate evidence layer.

## Motion interaction layer

The public Skills Console uses **Motion for JavaScript** (the current Motion library behind the former Framer Motion ecosystem) as a progressive enhancement for the static GitHub Pages UI. The integration must remain framework-free: do not migrate the Console to React solely for animation.

Use Motion for interaction patterns that benefit from spring physics or viewport-triggered transitions:
- restrained section entrance transitions
- button press/release feedback
- primary action confirmation pulses
- viewport reveal for the Localization Workbench, Second Brain, and pipeline
- future layout/shared-element transitions only where they materially improve comprehension

Keep simple hover/focus/colour transitions in CSS. Respect `prefers-reduced-motion`; when reduced motion is requested, Motion enhancements must become inert and the underlying UI must remain fully usable. Keep the Motion CDN version pinned and avoid `@latest`.

Motion must never control localization state, routing, validation, file processing, Second Brain persistence, or security boundaries. Animation is presentation-only and must degrade gracefully if the CDN is unavailable.
