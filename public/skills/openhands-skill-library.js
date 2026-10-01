/* OpenHands-derived Agent Skills library for Saif AI Skills Console.
   Concepts are adapted from the public OpenHands Extensions / AgentSkills model.
   This file contains focused workflow metadata for the browser console. */
window.SaifOpenHandsSkills = {
  source: "OpenHands/extensions",
  standard: "AgentSkills",
  skills: {
    "openhands-code-review": {
      title: "OpenHands Code Review",
      purpose: "Review current changes for concrete correctness, compatibility, security and maintainability risks.",
      workflow: ["Establish the exact change and acceptance criteria", "Trace the affected data/control flow", "Check correctness, compatibility, lifecycle and security", "Verify tests/evidence on the current change", "Report only proven material findings"],
      triggers: ["code review", "review code", "review changes", "PR review", "codereview", "security review"]
    },
    "openhands-iterate-verify": {
      title: "OpenHands Iterate & Verify",
      purpose: "Drive implementation through build, CI, review and QA verification until the current change is green or a concrete blocker remains.",
      workflow: ["Discover available verification layers", "Run build/tests and inspect failures", "Fix the root cause", "Re-run verification on the latest change", "Repeat until all applicable checks pass"],
      triggers: ["iterate", "verify", "regression", "CI", "build failure", "test failure", "QA"]
    },
    "openhands-skill-creator": {
      title: "OpenHands Skill Creator",
      purpose: "Design reusable Agent Skills with precise triggers, lean core instructions and progressive-disclosure references.",
      workflow: ["Define concrete use cases and triggers", "Keep SKILL.md focused on core behavior", "Move detailed variants to references", "Use imperative operational instructions", "Validate trigger behavior and resources"],
      triggers: ["create skill", "new skill", "skill design", "skill creator", "agent skill", "AgentSkills"]
    },
    "openhands-review-learning": {
      title: "OpenHands Review Learning",
      purpose: "Extract recurring, actionable patterns from code-review feedback and turn them into reusable project guidance.",
      workflow: ["Collect meaningful review feedback", "Filter low-signal and automated noise", "Cluster recurring patterns", "Convert stable patterns into focused skills or guidelines", "Avoid duplicating existing rules"],
      triggers: ["learn from reviews", "review learning", "distill reviews", "coding standards", "extract review patterns"]
    }
  },
  get(id) { return this.skills[id] || null; },
  all() { return Object.values(this.skills); }
};
