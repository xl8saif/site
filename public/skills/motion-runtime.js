/* Saif AI Skills Console — Motion runtime
 * Motion for JavaScript, static GitHub Pages compatible.
 * Presentation only: no application state is owned here.
 */
import { animate, inView } from "https://cdn.jsdelivr.net/npm/motion@13.4.5/+esm";

const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function reveal(selector, options = {}) {
  document.querySelectorAll(selector).forEach((element, index) => {
    inView(element, (target) => {
      animate(
        target,
        { opacity: [0, 1], y: [options.y ?? 18, 0], scale: options.scale ? [0.985, 1] : 1 },
        {
          duration: options.duration ?? 0.62,
          delay: Math.min(index * (options.stagger ?? 0.06), 0.24),
          ease: "easeOut"
        }
      );
    }, { amount: options.amount ?? 0.12 });
  });
}

function setup() {
  const intro = document.querySelector(".intro");

  // Never hide content before Motion loads. If the CDN is unavailable,
  // the normal static UI remains fully visible.
  if (!reduced) {
    if (intro) {
      animate(intro, { opacity: [0, 1], y: [-22, 0] }, {
        duration: 0.72,
        ease: "easeOut"
      });
    }

    reveal(".localization-workbench", { y: 24, duration: 0.7 });
    reveal(".second-brain-panel", { y: 24, duration: 0.7, delay: 0.08 });
    reveal(".pipeline", { y: 20, duration: 0.62 });
    reveal(".loc-source-card, .loc-target-card", { y: 20, scale: true, stagger: 0.1 });
    reveal(".brain-capture, .brain-library-head, .brain-search-row", { y: 14, stagger: 0.05 });
  }

  const interactive = document.querySelectorAll(
    ".primary, .secondary, .attach-btn, .lang-choice, .loc-option, .smart-skill, .brain-type, .brain-result"
  );

  if (reduced) return;

  interactive.forEach((element) => {
    element.addEventListener("pointerenter", () => {
      if (element.disabled) return;
      animate(element, { scale: 1.018, y: -1 }, {
        type: "spring",
        stiffness: 520,
        damping: 30
      });
    });

    element.addEventListener("pointerleave", () => {
      animate(element, { scale: 1, y: 0 }, {
        type: "spring",
        stiffness: 520,
        damping: 32
      });
    });

    element.addEventListener("pointerdown", () => {
      if (element.disabled) return;
      animate(element, { scale: 0.965 }, {
        duration: 0.09,
        ease: "easeOut"
      });
    });

    element.addEventListener("pointerup", () => {
      if (element.disabled) return;
      animate(element, { scale: 1.018, y: -1 }, {
        type: "spring",
        stiffness: 520,
        damping: 28
      });
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.(
      "#localize, #run, #brainRemember, #brainExport, #brainClear, #exportLocalized"
    );
    if (!button || button.disabled) return;

    animate(button, {
      scale: [1, 1.045, 1],
      y: [0, -2, 0]
    }, {
      duration: 0.38,
      ease: "easeOut"
    });
  }, { passive: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup, { once: true });
} else {
  setup();
}
