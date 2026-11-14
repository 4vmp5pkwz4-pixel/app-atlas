#!/usr/bin/env python3
"""Validate APP ATLAS project metadata and local published paths; stdlib only."""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
html = (ROOT / "index.html").read_text(encoding="utf-8")
match = re.search(r'<script id="embedded-catalog" type="application/json">([\s\S]+?)</script>', html)
assert match, "No embedded offline catalog"
assert json.loads(match.group(1)) == manifest, "Embedded offline catalog differs from catalog.json"
assert manifest.get("schemaVersion") == 1
assert manifest.get("owner") == "4vmp5pkwz4-pixel"

ids = set()
allowed = {"learning", "visualization", "research"}
for p in manifest.get("projects", []):
    assert p["id"] not in ids, f"Duplicate project {p['id']}"
    ids.add(p["id"])
    assert p["category"] in allowed
    assert p["status"] in {"live", "repository"}
    assert all(p["desc"].get(lang) for lang in ("ru", "en", "de")), p["id"]
    assert isinstance(p["tags"], list)
    assert "lean" not in p["id"].lower(), "Private project must not appear"
    for field in ("url", "download"):
        url = p.get(field)
        if url:
            assert url.startswith("./") and not any(x in url for x in ("..", "?", "#")), url
            candidate = ROOT / url[2:]
            assert candidate.is_file(), f"Missing {field}: {candidate}"
    if p["status"] == "live":
        assert p.get("url"), f"Live status without app URL: {p['id']}"
    if p["status"] == "repository":
        assert not p.get("url"), f"Repository-only status must not claim live demo: {p['id']}"
        assert p.get("source"), p["id"]
    source = p.get("source")
    if source:
        assert re.fullmatch(r"https://github\.com/4vmp5pkwz4-pixel/[A-Za-z0-9._-]+", source), source

for file in ["index.html", "assets/site.css", "assets/site.js", "assets/atlas-mark.svg", "apps/brahmi/index.html"]:
    assert (ROOT / file).is_file(), f"Required file missing: {file}"

print(f"OK: {len(ids)} public project entries, matching offline catalog, all local paths present")
