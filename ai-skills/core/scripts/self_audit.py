#!/usr/bin/env python3
"""Framework-level self-audit for the Saif Language Skills platform."""

import json
import py_compile
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "registry.json"
PLUGIN = ROOT / "plugin.json"
VALID_TASKS = {"translation", "mtpe", "lqa", "terminology", "structural_qa"}
VALID_SEVERITIES = {"critical", "major", "minor", "query"}
VALID_PROVENANCE = {"prior_conversation", "synthetic_fixture"}
VALID_CHECKS = {"tags", "placeholders", "linebreaks"}
VALID_REF_TYPES = {"terminology", "style", "rule", "example", "source", "dataset", "workflow"}
VALID_REF_STATUSES = {"draft", "verified", "deprecated"}
REQUIRED_CASE_FIELDS = {"id","source","expected_target","task","error_type","severity","checks","rationale","provenance"}
ALLOWED_CASE_FIELDS = REQUIRED_CASE_FIELDS | {"previous_target"}


def read_json(path, errors, label):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"{label}: missing file")
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{label}: invalid JSON: {exc}")
    return None


def contained(base, candidate):
    try:
        Path(candidate).resolve().relative_to(Path(base).resolve())
        return True
    except ValueError:
        return False


def audit_eval_suite(sid, path, errors):
    if not path.exists():
        return
    seen = set()
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        errors.append(f"{sid}: cannot read eval suite: {exc}")
        return
    for line_no, raw in enumerate(lines, 1):
        if not raw.strip():
            continue
        try:
            case = json.loads(raw)
        except json.JSONDecodeError as exc:
            errors.append(f"{sid}: eval line {line_no}: invalid JSON: {exc}")
            continue
        if not isinstance(case, dict):
            errors.append(f"{sid}: eval line {line_no}: case must be an object")
            continue
        missing = REQUIRED_CASE_FIELDS - set(case)
        extra = set(case) - ALLOWED_CASE_FIELDS
        if missing:
            errors.append(f"{sid}: eval line {line_no}: missing fields {sorted(missing)}")
        if extra:
            errors.append(f"{sid}: eval line {line_no}: unexpected fields {sorted(extra)}")
        cid = case.get("id")
        if not isinstance(cid, str) or not cid:
            errors.append(f"{sid}: eval line {line_no}: id must be a non-empty string")
        elif cid in seen:
            errors.append(f"{sid}: duplicate eval id {cid}")
        else:
            seen.add(cid)
        for field in ("source","expected_target","task","error_type","severity","rationale","provenance"):
            if field in case and not isinstance(case[field], str):
                errors.append(f"{sid}: eval line {line_no}: {field} must be a string")
        checks = case.get("checks")
        if not isinstance(checks, list) or not checks or not all(isinstance(x, str) for x in checks):
            errors.append(f"{sid}: eval line {line_no}: checks must be a non-empty string array")
        elif set(checks) - VALID_CHECKS:
            errors.append(f"{sid}: eval line {line_no}: unknown checks {sorted(set(checks) - VALID_CHECKS)}")
        if case.get("task") not in VALID_TASKS:
            errors.append(f"{sid}: eval line {line_no}: invalid task")
        if case.get("severity") not in VALID_SEVERITIES:
            errors.append(f"{sid}: eval line {line_no}: invalid severity")
        if case.get("provenance") not in VALID_PROVENANCE:
            errors.append(f"{sid}: eval line {line_no}: invalid provenance")
        if "previous_target" in case and not isinstance(case["previous_target"], str):
            errors.append(f"{sid}: eval line {line_no}: previous_target must be a string")


def audit_references(sid, skill_root, errors):
    index = skill_root / "references" / "index.json"
    if not index.exists():
        return
    data = read_json(index, errors, f"{sid}: references/index.json")
    if not isinstance(data, dict):
        errors.append(f"{sid}: reference index must be an object")
        return
    if data.get("schema_version") != "1.0":
        errors.append(f"{sid}: reference schema_version must be 1.0")
    if data.get("skill_id") != sid:
        errors.append(f"{sid}: reference skill_id does not match directory")
    refs = data.get("references")
    if not isinstance(refs, list):
        errors.append(f"{sid}: references must be an array")
        return
    seen = set()
    ref_root = skill_root / "references"
    for ref in refs:
        if not isinstance(ref, dict):
            errors.append(f"{sid}: every reference entry must be an object")
            continue
        rid = ref.get("id")
        if not isinstance(rid, str) or not rid:
            errors.append(f"{sid}: reference id must be a non-empty string")
        elif rid in seen:
            errors.append(f"{sid}: duplicate reference id {rid}")
        else:
            seen.add(rid)
        if not isinstance(ref.get("title"), str) or not ref.get("title"):
            errors.append(f"{sid}: {rid}: title must be a non-empty string")
        if ref.get("type") not in VALID_REF_TYPES:
            errors.append(f"{sid}: {rid}: invalid reference type")
        if ref.get("status") not in VALID_REF_STATUSES:
            errors.append(f"{sid}: {rid}: invalid reference status")
        path_value = ref.get("path")
        if path_value is not None:
            if not isinstance(path_value, str):
                errors.append(f"{sid}: {rid}: path must be a string")
                continue
            target = ref_root / path_value
            if not contained(ref_root, target):
                errors.append(f"{sid}: {rid}: reference path escapes references/: {path_value}")
                continue
            if not target.is_file():
                errors.append(f"{sid}: {rid}: referenced file missing: {path_value}")
            elif target.suffix.lower() == ".json":
                read_json(target, errors, f"{sid}: {rid}: referenced JSON")
        entries = ref.get("entries")
        if entries is not None and not isinstance(entries, (list, dict)):
            errors.append(f"{sid}: {rid}: entries must be an array or object")


def audit_registry(registry, errors):
    if not isinstance(registry, dict):
        errors.append("registry: top-level value must be an object")
        return
    if registry.get("schema_version") != "1.0":
        errors.append("registry: schema_version must be 1.0")
    for key in ("name","owner","version","skills","core"):
        if key not in registry:
            errors.append(f"registry: missing {key}")
    if not isinstance(registry.get("skills"), list):
        errors.append("registry: skills must be an array")
        return
    ids = set()
    for item in registry["skills"]:
        if not isinstance(item, dict):
            errors.append("registry: every Skill entry must be an object")
            continue
        sid = item.get("id")
        if not isinstance(sid, str) or not sid:
            errors.append("registry: Skill missing string id")
            continue
        if sid in ids:
            errors.append(f"{sid}: duplicate Skill id")
        ids.add(sid)
        status = item.get("status")
        if status not in {"draft","production","deprecated"}:
            errors.append(f"{sid}: invalid status {status!r}")
        path_value = item.get("path")
        if not isinstance(path_value, str) or not path_value:
            errors.append(f"{sid}: missing path")
            continue
        skill_root = ROOT / path_value
        if not contained(ROOT, skill_root):
            errors.append(f"{sid}: path escapes ai-skills/: {path_value}")
            continue
        if not skill_root.is_dir():
            errors.append(f"{sid}: Skill directory missing: {path_value}")
        entrypoint = item.get("entrypoint")
        if not isinstance(entrypoint, str) or not entrypoint:
            errors.append(f"{sid}: missing entrypoint")
        else:
            ep = ROOT / entrypoint
            if not contained(skill_root, ep):
                errors.append(f"{sid}: entrypoint escapes Skill directory: {entrypoint}")
            elif not ep.is_file():
                errors.append(f"{sid}: entrypoint is missing: {entrypoint}")
        tools = item.get("deterministic_tools", [])
        if not isinstance(tools, list) or not all(isinstance(x, str) for x in tools):
            errors.append(f"{sid}: deterministic_tools must be a string array")
            tools = []
        for tool in tools:
            target = skill_root / tool
            if not contained(skill_root, target):
                errors.append(f"{sid}: deterministic tool escapes Skill directory: {tool}")
            elif not target.is_file():
                errors.append(f"{sid}: missing deterministic tool: {tool}")
        for required in ("evals/cases.jsonl","references/index.json"):
            if status == "production" and not (skill_root / required).is_file():
                errors.append(f"{sid}: production Skill missing {required}")
        audit_eval_suite(sid, skill_root / "evals" / "cases.jsonl", errors)
        audit_references(sid, skill_root, errors)
        legacy = skill_root / "skills"
        if legacy.is_dir() and any(legacy.rglob("SKILL.md")):
            print(f"AUDIT WARNING: {sid}: legacy nested skills/ structure detected; registry uses the direct Skill path")


def audit_plugin(registry, errors):
    plugin = read_json(PLUGIN, errors, "plugin.json")
    if not isinstance(plugin, dict):
        return
    if plugin.get("version") != registry.get("version"):
        errors.append("plugin.json: version does not match registry")
    plugin_skills = plugin.get("skills")
    if not isinstance(plugin_skills, list):
        errors.append("plugin.json: skills must be an array")
        return
    if len(plugin_skills) != len(set(plugin_skills)):
        errors.append("plugin.json: duplicate Skill entries")
    production = {
        "./" + item["entrypoint"]
        for item in registry.get("skills", [])
        if isinstance(item, dict) and item.get("status") == "production" and isinstance(item.get("entrypoint"), str)
    }
    if set(plugin_skills) != production:
        errors.append(f"plugin.json: production Skill set mismatch; expected {sorted(production)}, got {sorted(plugin_skills)}")


def audit_python(errors):
    for path in ROOT.rglob("*.py"):
        try:
            py_compile.compile(str(path), doraise=True)
        except py_compile.PyCompileError as exc:
            errors.append(f"Python syntax failure: {path.relative_to(ROOT)}: {exc}")


def audit_production_retrieval(registry, errors):
    retriever = ROOT / "core" / "scripts" / "retrieve_references.py"
    if not retriever.is_file():
        errors.append("core: missing retrieve_references.py")
        return
    for skill in registry.get("skills", []):
        if skill.get("status") != "production":
            continue
        sid = skill["id"]
        index = ROOT / skill["path"] / "references" / "index.json"
        data = read_json(index, errors, f"{sid}: retrieval preflight")
        if not isinstance(data, dict):
            continue
        verified = [r for r in data.get("references", []) if isinstance(r, dict) and r.get("status") == "verified"]
        if not verified:
            errors.append(f"{sid}: production Skill has no verified references")
            continue
        query = verified[0].get("title") or verified[0].get("id")
        result = subprocess.run(
            [sys.executable, str(retriever), sid, query, "--limit", "1"],
            cwd=ROOT.parent, capture_output=True, text=True
        )
        if result.returncode:
            errors.append(f"{sid}: production reference retrieval failed: {result.stderr.strip() or result.stdout.strip()}")
            continue
        try:
            payload = json.loads(result.stdout)
        except json.JSONDecodeError as exc:
            errors.append(f"{sid}: retrieval returned invalid JSON: {exc}")
            continue
        if not payload.get("results"):
            errors.append(f"{sid}: retrieval returned no result for verified reference query {query!r}")


def main():
    errors = []
    registry = read_json(REGISTRY, errors, "registry.json")
    if isinstance(registry, dict):
        audit_registry(registry, errors)
        audit_plugin(registry, errors)
        audit_production_retrieval(registry, errors)
    audit_python(errors)
    if errors:
        print("SELF-AUDIT FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    print("SELF-AUDIT PASS")
    print("Registry, Skill paths, eval contracts, references, plugin manifest, Python syntax, and production retrieval are consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
