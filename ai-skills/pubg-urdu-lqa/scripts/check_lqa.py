#!/usr/bin/env python3
"""Deterministic structural and terminology checks for PUBG MOBILE Urdu LQA."""

import argparse
import json
import re
from collections import Counter
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
PLACEHOLDER_RE = re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")

# Preferred production terminology and common rejected alternatives.
TERMS = {
    "Official": ("آفیشل", ["سرکاری"]),
    "Esports": ("ای سپورٹس", []),
    "Hidden Leaf Center": ("پوشیدہ پتّا سینٹر", []),
    "Valley of the End": ("اختتام کی وادی", []),
    "Brainrot": ("برین راٹ", []),
    "Creation Mode": ("تخلیق موڈ", []),
    "Creator": ("کریئٹر", []),
    "Creation": ("کریئیشن", []),
    "World of Wonder (WOW)": ("ورلد آف ونڈر (WOW)", []),
    "Creation Shop": ("کریئیشن شاپ", []),
    "Claim": ("حاصل کریں", ["وصول کریں"]),
    "Redeem": ("وصول کریں", ["ریڈیم کریں"]),
    "Equip": ("استعمال کریں", ["لیس کریں"]),
    "Loadout": ("جنگی سیٹ اپ", ["سامان"]),
    "Revive": ("دوبارہ زندہ کریں", ["زندہ کریں"]),
    "Knocked": ("ناک آؤٹ ہوا", ["گر گیا"]),
    "Finish": ("حریف کا خاتمہ کریں", ["ختم کریں"]),
    "Match Result": ("مقابلے کا نتیجہ", ["میچ کا نتیجہ"]),
    "Limited Time": ("محدود مدت", ["محدود وقت"]),
}

PROTECTED = {"Discord", "Mission Card", "WOW Tokens"}

def counts(text):
    return {
        "tags": Counter(TAG_RE.findall(text)),
        "placeholders": Counter(PLACEHOLDER_RE.findall(text)),
        "linebreaks": text.count("\n"),
    }

def issue(code, severity, message, correction=None):
    item = {"code": code, "severity": severity, "issue": message}
    if correction:
        item["suggested_correction"] = correction
    return item

def main():
    parser = argparse.ArgumentParser(description="Run deterministic PUBG Urdu LQA checks.")
    parser.add_argument("--source", required=True, help="Source text file, UTF-8.")
    parser.add_argument("--target", required=True, help="Target text file, UTF-8.")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON.")
    args = parser.parse_args()

    source = Path(args.source).read_text(encoding="utf-8")
    target = Path(args.target).read_text(encoding="utf-8")
    sc = counts(source)
    tc = counts(target)
    findings = []

    if sc["tags"] != tc["tags"]:
        findings.append(issue("TAG_MISMATCH", "critical",
                              "XML/HTML tags differ between source and target."))
    if sc["placeholders"] != tc["placeholders"]:
        findings.append(issue("PLACEHOLDER_MISMATCH", "critical",
                              "Placeholders differ between source and target."))
    if sc["linebreaks"] != tc["linebreaks"]:
        findings.append(issue("LINEBREAK_MISMATCH", "major",
                              f"Line-break count differs: source={sc['linebreaks']}, target={tc['linebreaks']}."))

    for protected in PROTECTED:
        if protected in source and protected not in target:
            findings.append(issue("PROTECTED_TERM_CHANGED", "major",
                                  f"Protected term '{protected}' is missing or changed in the target.",
                                  protected))

    for english, (preferred, rejected) in TERMS.items():
        if english in source:
            if preferred not in target:
                findings.append(issue("TERMINOLOGY_MISSING", "major",
                                      f"Preferred terminology for '{english}' is not present.",
                                      preferred))
            for bad in rejected:
                if bad in target:
                    findings.append(issue("TERMINOLOGY_REJECTED", "major",
                                          f"Rejected terminology '{bad}' used for '{english}'.",
                                          preferred))

    status = "PASS" if not findings else "FAIL"
    result = {
        "status": status,
        "source": str(args.source),
        "target": str(args.target),
        "findings": findings,
        "checks": {
            "tags": "pass" if sc["tags"] == tc["tags"] else "fail",
            "placeholders": "pass" if sc["placeholders"] == tc["placeholders"] else "fail",
            "linebreaks": "pass" if sc["linebreaks"] == tc["linebreaks"] else "fail",
            "terminology": "pass" if not any(f["code"].startswith("TERMINOLOGY") for f in findings) else "fail",
            "protected_terms": "pass" if not any(f["code"] == "PROTECTED_TERM_CHANGED" for f in findings) else "fail",
        },
    }

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(status)
        for f in findings:
            correction = f" -> {f['suggested_correction']}" if "suggested_correction" in f else ""
            print(f"[{f['severity'].upper()}] {f['code']}: {f['issue']}{correction}")
        if not findings:
            print("No deterministic structural or terminology findings.")

    return 1 if findings else 0

if __name__ == "__main__":
    raise SystemExit(main())
