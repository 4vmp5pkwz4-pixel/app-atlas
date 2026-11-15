#!/usr/bin/env python3
"""Fail closed on source drift in macOS keyboard presets or Hindi (Devanagari) localization."""
import json, pathlib, re, subprocess, tempfile
root=pathlib.Path(__file__).resolve().parents[1]
html=(root/"apps/brahmi/index.html").read_text(encoding="utf-8")
read=lambda f: json.loads((root/f).read_text(encoding="utf-8"))
layouts=read("data/macos-extra-layouts.json")
hindi=read("data/brahmi-hindi-ui.json")
content=read("data/brahmi-hindi-content.json")
def embedded(name):
    prefix="const "+name+"="
    start=html.index(prefix)+len(prefix)
    end=html.index(";\n",start)
    return json.loads(html[start:end])
assert embedded("MAC_EXTRA_LAYOUTS")==layouts
assert embedded("HINDI_UI")==hindi
assert embedded("HINDI_CONTENT")==content
assert set(layouts["layouts"])=={"ruMac","ruPh","dev","devq"}
for name in layouts["layouts"]:
    assert "base" in layouts["layouts"][name] and "shift" in layouts["layouts"][name]
assert layouts["layouts"]["ruPh"]["base"]["KeyH"]=="ч"
assert layouts["layouts"]["ruPh"]["base"]["KeyA"]=="а"
assert layouts["layouts"]["ruMac"]["base"]["Backslash"]=="ё"
assert layouts["layouts"]["dev"]["base"]["KeyK"]=="क"
assert layouts["layouts"]["dev"]["shift"]["KeyK"]=="ख"
assert layouts["layouts"]["devq"]["base"]["KeyF"]=="्"
assert layouts["layouts"]["devq"]["shift"]["KeyX"]=="क्ष"
assert len(hindi["ui"])==211
assert len(content["lessons"])==24
assert len(content["texts"])==10
assert len(content["wisdom"])==25
assert len(content["glossary"])==5
assert all(len(x)==3 for x in content["lessons"].values())
assert all(len(x)==2 for x in content["texts"].values())
assert all(len(x)==2 for x in content["wisdom"].values())
assert '<option value="hi">हिन्दी · देवनागरी</option>' in html
for code in ("ruMac","ruPh","dev","devq"):
    assert html.count('<option value="'+code+'">')==3
assert "['ja','dev','devq'].includes(saved.physical)" in html
assert "function setLanguage(" in html
with tempfile.TemporaryDirectory() as t:
    p=pathlib.Path(t)/"app.js"
    source=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",html)
    assert source
    p.write_text("\n".join(source),encoding="utf-8")
    proc=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert proc.returncode==0,proc.stderr
print("PASS: four native Mac layouts, 211 Hindi interface labels, 24 lessons, 10 source passages, 25 quotes, syntax")
