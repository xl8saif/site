/* Saif AI Skills Console — Motion runtime
 * Motion for JavaScript, the current Motion library behind the former Framer Motion ecosystem.
 * Static GitHub Pages compatible: no React migration required.
 */
import { animate, inView } from "https://cdn.jsdelivr.net/npm/motion@13.4.5/+esm";

const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function setup() {
  if (reduced) return;

  const intro = document.querySelector(".intro");
  const workbench = document.querySelector(".localization-workbench");
  const brain = document.querySelector(".second-brain-panel");
  const pipeline = document.querySelector(".pipeline");
  const buttons = document.querySelectorAll(".primary, .secondary, .attach-btn, .lang-choice");

  if (intro) {
    animate(intro, { opacity: [0, 1], y: [-10, 0] }, {
      duration: 0.45,
      ease: "easeOut"
    });
  }

  [workbench, brain, pipeline].forEach((section, index) => {
    if (!section) return;
    section.style.opacity = "0";
    section.style.transform = "translateY(14px)";
    inView(section, (element) => {
      animate(element, { opacity: 1, y: 0 }, {
        duration: 0.45,
        delay: index * 0.04,
        ease: "easeOut"
      });
    }, { amount: "some" });
  });

  buttons.forEach((button) => {
    button.addEventListener("pointerdown", () => {
      if (button.disabled) return;
      animate(button, { scale: 0.97 }, { duration: 0.08, ease: "easeOut" });
    });
    button.addEventListener("pointerup", () => {
      if (button.disabled) return;
      animate(button, { scale: 1 }, { type: "spring", stiffness: 500, damping: 28 });
    });
    button.addEventListener("pointercancel", () => {
      animate(button, { scale: 1 }, { duration: 0.12, ease: "easeOut" });
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("#localize, #run, #brainRemember, #brainExport, #brainClear, #exportLocalized");
    if (!button || button.disabled) return;
    animate(button, { scale: [1, 1.025, 1] }, {
      duration: 0.28,
      ease: "easeOut"
    });
  }, { passive: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup, { once: true });
} else {
  setup();
}
