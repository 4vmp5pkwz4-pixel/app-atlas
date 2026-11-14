#!/usr/bin/env python3
"""Check known public Pages endpoints and mirror freshness, without modifying data."""
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request
import hashlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
BASE = "https://4vmp5pkwz4-pixel.github.io/app-atlas/"
HEADERS = {"User-Agent": "app-atlas-health-check/1.0 (+GitHub Actions)"}
checks = [(BASE, "APP ATLAS")]

for project in data["projects"]:
    u = project.get("url")
    if not u:
        continue
    if u.startswith("./"):
        u = BASE + u[2:]
    checks.append((u, "<html"))

errors = []
for url, marker in checks:
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(request, timeout=20) as response:
                content = response.read(1048576)
                code = response.status
                typ = response.headers.get("Content-Type", "")
            if code != 200 or "html" not in typ.lower():
                raise RuntimeError(f"HTTP {code}, Content-Type={typ}")
            sample = content.decode("utf-8", "replace").lower()
            if marker.lower() not in sample:
                raise RuntimeError(f"HTML signature missing: {marker}")
            print(f"OK  {url} ({code})")
            break
        except Exception as exc:
            if attempt == 2:
                errors.append(f"{url}: {type(exc).__name__}: {exc}")
            else:
                time.sleep(3 * (attempt + 1))

# Mirror provenance is checked as an alert, not automatically overwritten.
try:
    request = urllib.request.Request(
        "https://api.github.com/repos/4vmp5pkwz4-pixel/Buddhabrot/contents/buddhabrot.html",
        headers={"User-Agent": HEADERS["User-Agent"], "Accept": "application/vnd.github+json"}
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        canonical = json.loads(response.read())
    local = (ROOT / "apps/buddhabrot/index.html").read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(local)).encode() + b"\0" + local).hexdigest()
    if canonical.get("sha") != blob:
        errors.append(f"Portable Buddhabrot mirror differs: upstream {canonical.get('sha')} vs local {blob}")
    else:
        print("OK  Buddhabrot portable mirror matches canonical source")
except Exception as exc:
    errors.append(f"Buddhabrot source check could not complete: {exc}")

if errors:
    for error in errors:
        print("FAILED", error, file=sys.stderr)
    sys.exit(1)
print(f"OK: {len(checks)} public URLs and upstream mirror consistency.")
