#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fail = [];
const required = [
  "DESIGN.md","JULES.md","public/skills/index.html","public/skills/app.js",
  "public/skills/ux-premium.css","public/skills/ux-premium.js",
  "public/skills/second-brain-memory.js","ai-skills/registry.json"
];
for (const p of required) if (!fs.existsSync(path.join(root,p))) fail.push("missing: " + p);

function must(p, items) {
  if (!fs.existsSync(path.join(root,p))) return;
  const s = fs.readFileSync(path.join(root,p),"utf8");
  for (const x of items) if (!s.includes(x)) fail.push(p + ": missing " + x);
}

must("public/skills/index.html",["ux-premium.css","ux-premium.js","lang-choice","English","العربية","اردو","فارسی"]);
must("public/skills/app.js",["setLanguage","pubg-urdu-lqa","jules-agent-workflow","stitch-design-system"]);
must("public/skills/ux-premium.css",["--saif-blue","Cairo","Mehr Nastaliq","language-switcher","prefers-reduced-motion"]);
must("DESIGN.md",["Arabic, English, Urdu, and Persian","Cairo","Mehr Nastaliq","GitHub Pages remains the public deployment target"]);
must("JULES.md",["Never expose private Second Brain data","Never auto-merge solely from Jules success"]);

let registry;
try { registry = JSON.parse(fs.readFileSync(path.join(root,"ai-skills/registry.json"),"utf8")); }
catch { fail.push("registry JSON invalid"); }

if (registry) {
  for (const s of registry.skills || []) {
    if (!s.id || !s.entrypoint) fail.push("incomplete registry entry");
    else {
      if (!fs.existsSync(path.join(root,"ai-skills",s.entrypoint))) fail.push("missing skill: " + s.id);
      if (s.ecosystem === true && !fs.existsSync(path.join(root,".agents/skills",s.entrypoint))) fail.push("missing mirror: " + s.id);
    }
  }
}

if (fail.length) {
  console.error("Skills Console verification FAILED");
  fail.forEach(x => console.error(" - " + x));
  process.exit(1);
}
console.log("Skills Console verification PASSED");
console.log("Registered skills checked: " + ((registry && registry.skills) ? registry.skills.length : 0));
