#!/usr/bin/env python3
"""Shared deterministic localization QA engine."""

import argparse
import json
import re
from collections import Counter
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
PLACEHOLDER_RE = re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")


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


def structural_findings(source, target):
    sc, tc = counts(source), counts(target)
    findings = []
    if sc["tags"] != tc["tags"]:
        findings.append(issue("TAG_MISMATCH", "critical",
                              "XML/HTML tags differ between source and target."))
    if sc["placeholders"] != tc["placeholders"]:
        findings.append(issue("PLACEHOLDER_MISMATCH", "critical",
                              "Placeholders differ between source and target."))
    if sc["linebreaks"] != tc["linebreaks"]:
        findings.append(issue(
            "LINEBREAK_MISMATCH", "major",
            "Line-break count differs: source={}, target={}.".format(
                sc["linebreaks"], tc["linebreaks"])))
    return findings


def load_reference_rules(index_path):
    index = json.loads(Path(index_path).read_text(encoding="utf-8"))
    base = Path(index_path).parent
    terminology, protected = {}, set()
    for ref in index.get("references", []):
        if ref.get("status") != "verified" or not ref.get("path"):
            continue
        path = base / ref["path"]
        if not path.is_file():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        if ref.get("type") == "terminology" and isinstance(data, dict):
            terminology.update({k: v for k, v in data.items() if not k.startswith("_")})
        elif "protected-terms" in ref.get("tags", []) and isinstance(data, list):
            protected.update(data)
    return terminology, protected


def run(source, target, terminology=None, protected=None):
    findings = structural_findings(source, target)
    terminology = terminology or {}
    protected = protected or set()

    for term in protected:
        if term in source and term not in target:
            findings.append(issue(
                "PROTECTED_TERM_CHANGED", "major",
                "Protected term '{}' is missing or changed in the target.".format(term),
                term))

    for source_term, rule in terminology.items():
        preferred = rule[0]
        rejected = rule[1] if len(rule) > 1 else []
        if source_term in source:
            if preferred not in target:
                findings.append(issue(
                    "TERMINOLOGY_MISSING", "major",
                    "Preferred terminology for '{}' is not present.".format(source_term),
                    preferred))
            for bad in rejected:
                if bad in target:
                    findings.append(issue(
                        "TERMINOLOGY_REJECTED", "major",
                        "Rejected terminology '{}' used for '{}'.".format(bad, source_term),
                        preferred))

    return findings


def result(source_path, target_path, findings):
    structural_codes = {"TAG_MISMATCH", "PLACEHOLDER_MISMATCH", "LINEBREAK_MISMATCH"}
    terminology_codes = {"TERMINOLOGY_MISSING", "TERMINOLOGY_REJECTED"}
    protected_codes = {"PROTECTED_TERM_CHANGED"}
    return {
        "status": "PASS" if not findings else "FAIL",
        "source": str(source_path),
        "target": str(target_path),
        "findings": findings,
        "checks": {
            "tags": "fail" if any(f["code"] == "TAG_MISMATCH" for f in findings) else "pass",
            "placeholders": "fail" if any(f["code"] == "PLACEHOLDER_MISMATCH" for f in findings) else "pass",
            "linebreaks": "fail" if any(f["code"] == "LINEBREAK_MISMATCH" for f in findings) else "pass",
            "terminology": "fail" if any(f["code"] in terminology_codes for f in findings) else "pass",
            "protected_terms": "fail" if any(f["code"] in protected_codes for f in findings) else "pass",
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Run shared deterministic localization QA checks.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    parser.add_argument("--terminology", help="JSON file containing source-term rules.")
    parser.add_argument("--protected", help="JSON file containing protected terms.")
    parser.add_argument("--reference-index", help="Verified Reference Layer index; preferred over individual reference files.")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    source = Path(args.source).read_text(encoding="utf-8")
    target = Path(args.target).read_text(encoding="utf-8")
    terminology = {}
    protected = set()

    if args.reference_index:
        terminology, protected = load_reference_rules(args.reference_index)
    else:
        if args.terminology:
            terminology = json.loads(Path(args.terminology).read_text(encoding="utf-8"))
        if args.protected:
            protected = set(json.loads(Path(args.protected).read_text(encoding="utf-8")))

    findings = run(source, target, terminology, protected)
    output = result(args.source, args.target, findings)

    if args.json:
        print(json.dumps(output, ensure_ascii=False, indent=2))
    else:
        print(output["status"])
        for f in findings:
            correction = " -> " + f["suggested_correction"] if "suggested_correction" in f else ""
            print("[{}] {}: {}{}".format(f["severity"].upper(), f["code"], f["issue"], correction))
        if not findings:
            print("No deterministic structural or terminology findings.")
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
