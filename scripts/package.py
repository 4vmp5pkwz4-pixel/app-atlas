#!/usr/bin/env python3
"""Build reproducible portable HTML downloads and website package. Stdlib only."""
import hashlib
import json
import pathlib
import shutil
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "dist"
OUT.mkdir(exist_ok=True)
catalog = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))

def zip_items(dest, items):
    with zipfile.ZipFile(dest, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for arcname, path in sorted(items, key=lambda x: x[0]):
            info = zipfile.ZipInfo(arcname, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

for project in catalog["projects"]:
    href = project.get("download")
    if not href or not href.startswith("./"):
        continue
    source = ROOT / href[2:]
    assert source.is_file(), source
    simple = OUT / (project["id"] + ".html")
    shutil.copyfile(source, simple)
    zip_items(OUT / (project["id"] + "-itch-html.zip"), [("index.html", source)])

public = []
for relative in ["index.html", "catalog.json", "sitemap.xml", "robots.txt", ".nojekyll"]:
    p = ROOT / relative
    if p.is_file():
        public.append((relative, p))
for folder in ["assets", "apps", "projects"]:
    for p in (ROOT / folder).rglob("*"):
        if p.is_file():
            public.append((p.relative_to(ROOT).as_posix(), p))
zip_items(OUT / "app-atlas-website.zip", public)

artifacts = sorted(p for p in OUT.iterdir() if p.is_file() and p.name != "SHA256SUMS.txt")
lines = [f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}" for p in artifacts]
(OUT / "SHA256SUMS.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("Built:", ", ".join(p.name for p in artifacts))
