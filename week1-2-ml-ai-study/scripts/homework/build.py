"""Regenerate src/data/homework.js from the problem definitions (needs numpy).

    python3 scripts/homework/build.py

Every answer is computed here rather than typed, and `npm run check` then confirms that each stored
answer passes the site's own answer checker.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import lib, math_hw, ml_hw  # noqa: F401  (importing registers the homework sets)

lib.emit(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'data', 'homework.js'))
print(f"{len(lib.SETS)} sets, {sum(len(s['problems']) for s in lib.SETS.values())} problems")
