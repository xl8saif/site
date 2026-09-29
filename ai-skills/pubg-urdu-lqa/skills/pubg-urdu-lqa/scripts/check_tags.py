#!/usr/bin/env python3
"""Check that XML/HTML-like tags occur with the same multiset in source and target."""
import re, sys
from collections import Counter
TAG_RE = re.compile(r"<[^>]+>")
def tags(text): return Counter(TAG_RE.findall(text))
if len(sys.argv) != 3:
    print("Usage: check_tags.py SOURCE TARGET"); raise SystemExit(2)
source, target = (open(p, encoding="utf-8").read() for p in sys.argv[1:3])
a, b = tags(source), tags(target)
if a == b:
    print("PASS: tag structure matches"); raise SystemExit(0)
print("FAIL: tag structure mismatch")
print("SOURCE:", dict(a)); print("TARGET:", dict(b)); raise SystemExit(1)
