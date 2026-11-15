#!/usr/bin/env python3
"""Regression gate: source-frozen and non-speculative Brahmi phonetic atlas."""
import json
import pathlib
import re
import subprocess
import tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
atlas=(ROOT/"apps/brahmi/phonetic-atlas.html").read_text(encoding="utf-8")
trainer=(ROOT/"apps/brahmi/index.html").read_text(encoding="utf-8")
ref=json.loads((ROOT/"data/macos-brahmi-reference.json").read_text(encoding="utf-8"))
jis=json.loads((ROOT/"data/macos-jis-layout.json").read_text(encoding="utf-8"))

m=re.search(r'<script id="atlas-data" type="application/json">(.*?)</script>',atlas,re.S)
assert m, "Missing standalone atlas map"
data=json.loads(m.group(1))
assert data["layers"]==ref["layers"], "The atlas must reuse the verified 2019 Mac map exactly"
assert data["sourceBlobSha"]==ref["sourceBlobSha"]
assert data["license"]==ref["license"]
assert data["physical"]["kana"]==jis["kana"]
assert data["physical"]["ja"]==jis["labels"]
assert data["physical"]["de"]["KeyY"]=="Z"
assert data["physical"]["de"]["KeyZ"]=="Y"
assert data["physical"]["ru"]["KeyK"]=="Л"

assigned=set(range(0x11000,0x1104e)) | set(range(0x11052,0x11076)) | {0x1107f}
assert len(assigned)==115
actual={}
for layer,entries in data["layers"].items():
    assert layer in ("base","shift","option","shiftOption")
    for key,value in entries.items():
        if len(value)==1 and ord(value) in assigned:
            actual.setdefault(ord(value),[]).append((layer,key))
assert len(actual)==106, len(actual)
missing=sorted(assigned-actual.keys())
assert missing==[0x11003,0x11004,0x11070,0x11071,0x11072,0x11073,0x11074,0x11075,0x1107f]
assert 'id="atlasLaunch"' in trainer and 'href="./phonetic-atlas.html"' in trainer
assert '"en"' in atlas and '"ru"' in atlas and '"de"' in atlas and '"ja"' in atlas
assert "InScript" in atlas
scripts=re.findall(r"<script>([\s\S]*?)</script>",atlas)
assert len(scripts)==1, "Expected one executable inline JS"
with tempfile.TemporaryDirectory() as temporary:
    p=pathlib.Path(temporary)/"phonetic-atlas.js"
    p.write_text(scripts[0],encoding="utf-8")
    result=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert result.returncode==0, result.stderr
print("PASS: 115 assigned, 106 mapped, 9 explicitly missing; original layers, localized trainer launcher and valid JavaScript")
