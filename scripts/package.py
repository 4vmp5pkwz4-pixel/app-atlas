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

legal = [(name, ROOT / name) for name in ("LICENSE", "NOTICE", "THIRD_PARTY_NOTICES.txt")]
for name, path in legal:
    assert path.is_file(), f"Missing legal notice: {name}"
    shutil.copyfile(path, OUT / name)
buddhabrot_license = ROOT / "licenses/Buddhabrot-MIT.txt"
assert buddhabrot_license.is_file()
shutil.copyfile(buddhabrot_license, OUT / "Buddhabrot-MIT.txt")

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
    bundle=[("index.html",source)]
    if project["id"] == "buddhabrot":
        bundle.extend([("LICENSE", buddhabrot_license), ("THIRD_PARTY_NOTICES.txt", ROOT / "THIRD_PARTY_NOTICES.txt")])
    else:
        bundle.extend(legal)
    if project["id"]=="brahmi":
        atlas=ROOT/"apps/brahmi/phonetic-atlas.html"
        assert atlas.is_file(), "Brahmi atlas missing"
        shutil.copyfile(atlas,OUT/"phonetic-atlas.html")
        bundle.append(("phonetic-atlas.html",atlas))
        for name in ("research-lab.html", "bfg-core.js", "pronunciation.html", "atelier-workspace.js"):
            lab_file = ROOT / "apps/brahmi" / name
            assert lab_file.is_file(), f"BFG lab component missing: {name}"
            shutil.copyfile(lab_file, OUT / name)
            bundle.append((name, lab_file))
    zip_items(OUT / (project["id"] + "-itch-html.zip"),bundle)

public = legal + [("licenses/Buddhabrot-MIT.txt", buddhabrot_license)]
for name in ("docs/LICENSING.md", "docs/PUBLISHING.md", "docs/DISTRIBUTION.md"):
    public.append((name, ROOT / name))
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
