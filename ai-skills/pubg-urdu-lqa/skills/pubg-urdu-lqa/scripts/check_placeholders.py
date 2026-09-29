#!/usr/bin/env python3
"""Check common placeholder forms for count and identity preservation."""
import re, sys
from collections import Counter
PATTERN = re.compile(r"\{[^{}]+\}|\$\{[^{}]+\}|%(?:\d+\$)?[sdif]|%%")
def placeholders(text): return Counter(PATTERN.findall(text))
if len(sys.argv) != 3:
    print("Usage: check_placeholders.py SOURCE TARGET"); raise SystemExit(2)
source, target = (open(p, encoding="utf-8").read() for p in sys.argv[1:3])
a, b = placeholders(source), placeholders(target)
if a == b:
    print("PASS: placeholder structure matches"); raise SystemExit(0)
print("FAIL: placeholder mismatch")
print("SOURCE:", dict(a)); print("TARGET:", dict(b)); raise SystemExit(1)
