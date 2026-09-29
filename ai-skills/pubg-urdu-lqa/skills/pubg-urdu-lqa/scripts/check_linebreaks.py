#!/usr/bin/env python3
"""Check that source and target have the same number of newline characters."""
import sys
if len(sys.argv) != 3:
    print("Usage: check_linebreaks.py SOURCE TARGET"); raise SystemExit(2)
source, target = (open(p, encoding="utf-8").read() for p in sys.argv[1:3])
a, b = source.count("\n"), target.count("\n")
if a == b:
    print(f"PASS: line breaks match ({a})"); raise SystemExit(0)
print(f"FAIL: line breaks mismatch — source={a}, target={b}"); raise SystemExit(1)
