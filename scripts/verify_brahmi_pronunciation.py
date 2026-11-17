#!/usr/bin/env python3
"""Independent coverage, source integrity and executable syntax for the dictionary."""
import json, pathlib, re, subprocess, tempfile
root=pathlib.Path(__file__).resolve().parents[1]
read=lambda path:(root/path).read_text(encoding="utf-8")
data=json.loads(read("data/brahmi-pronunciation.json"))
html=read("apps/brahmi/pronunciation.html")
m=re.search(r'<script id="pronunciation-data" type="application/json">([\s\S]+?)</script>',html)
assert m and json.loads(m.group(1))==data
rows=data["rows"]
expected=list(range(0x11000,0x1104e))+list(range(0x11052,0x11076))+[0x1107f]
assert [r["n"] for r in rows]==expected
assert len(rows)==115
assert sum(bool(r["ipa"]) for r in rows)==75
assert sum(bool(r["chords"]) for r in rows)==106
source=json.loads(read("data/macos-brahmi-reference.json"))["layers"]
by={r["n"]:r for r in rows}
for r in rows:
    assert r["glyph"]==chr(r["n"])
    assert r["code"]==f'U+{r["n"]:04X}'
    assert r["name"].startswith("BRAHMI ")
    assert r["chords"]==[{"layer":layer,"key":key} for layer,table in source.items() for key,value in table.items() if value==r["glyph"]]
    if r["kind"] in ("control","number","punctuation"):
        assert r["ipa"] is None and not r["hindi"]
    else:
        assert r["ipa"] and r["roman"]
    if r["kind"]=="vowelSign":
        assert by[r["base"]]["kind"]=="vowel"
        assert by[r["base"]]["ipa"]==r["ipa"]
assert by[0x11013]["ipa"]=="k"
assert by[0x11014]["ipa"]=="kʰ"
assert by[0x1101d]["ipa"]=="ʈ" and by[0x11022]["ipa"]=="t̪"
assert by[0x1103a]["roman"]=="i" and by[0x11044]["roman"]=="o"
assert by[0x11039]["base"]==0x11006 and by[0x11046]["ipa"] is None
assert by[0x11075]["kind"]=="consonant"
assert "localService" in html and "speechSynthesis" in html
assert "brahmi-dictionary-practice-v1" in html
trainer=read("apps/brahmi/index.html")
assert "brahmi-dictionary-practice-v1" in trainer and "phraseUnmapped(raw)" in trainer
assert all(k in trainer for k in ("dictHome","dictConvert","keyInspectorText"))
assert "pronunciation.html" in read("apps/brahmi/phonetic-atlas.html")
assert "pronunciation.html" in read("scripts/package.py")
assert "bfg-feature-projection/1" in read("apps/brahmi/research-lab.html")
rel=json.loads(read("data/brahmi-release.json"))
assert rel["pronunciation"]["assignedSigns"]==115 and rel["version"]=="0.9.8-beta"
with tempfile.TemporaryDirectory() as tmp:
    for name in ("pronunciation.html","research-lab.html"):
        text=read("apps/brahmi/"+name)
        bits=re.findall(r"<script>([\s\S]*?)</script>",text)
        assert bits
        p=pathlib.Path(tmp)/"check.js"
        p.write_text("\n".join(bits),encoding="utf-8")
        subprocess.run(["node","--check",str(p)],check=True)
print("PASS: 115 Unicode signs, 75 sound profiles, 106 exact source chords; no autonomous pronunciation for controls/numerals; handoff and JS syntax")
