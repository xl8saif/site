#!/usr/bin/env python3
import argparse,json,re
from pathlib import Path
TAG_RE=re.compile(r"<[^>]+>")
PLACEHOLDER_RE=re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")
def parts(text): return TAG_RE.findall(text),sorted(PLACEHOLDER_RE.findall(text)),text.count("\n")
def main():
    p=argparse.ArgumentParser(); p.add_argument("cases"); a=p.parse_args(); errors=[]; count=0
    for n,raw in enumerate(Path(a.cases).read_text(encoding="utf-8").splitlines(),1):
        if not raw.strip(): continue
        count+=1; c=json.loads(raw); source=c["source"]; expected=c["expected_target"]; checks=set(c.get("checks",[])); s,e=parts(source),parts(expected)
        if "tags" in checks and s[0]!=e[0]: errors.append("{} line {}: tag regression".format(c["id"],n))
        if "placeholders" in checks and s[1]!=e[1]: errors.append("{} line {}: placeholder regression".format(c["id"],n))
        if "linebreaks" in checks and s[2]!=e[2]: errors.append("{} line {}: line-break regression".format(c["id"],n))
        if c["task"]=="terminology" and expected==c.get("previous_target"): errors.append("{} line {}: expected_target equals previous_target".format(c["id"],n))
    if errors: print("FAIL"); print("\n".join(errors)); return 1
    print("PASS: regression checks completed for {} cases".format(count)); return 0
if __name__=="__main__": raise SystemExit(main())
