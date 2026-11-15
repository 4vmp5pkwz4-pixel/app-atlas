#!/usr/bin/env python3
"""Source-backed German Mac ISO glyph and invariant visual QA; stdlib only."""
import json, pathlib, re, subprocess, tempfile
R=pathlib.Path(__file__).resolve().parents[1]
def read(p):return (R/p).read_text(encoding="utf-8")
source=json.loads(read("data/macos-german-iso-keycaps.json"))
html=read("apps/brahmi/index.html")
project=read("projects/brahmi/index.html")
def embedded(name):
    t="const "+name+"="
    i=html.index(t)+len(t)
    j=html.index(";\n",i)
    return json.loads(html[i:j])
assert embedded("MAC_GERMAN_ISO")==source,"Embedded Mac ISO source does not match canonical JSON"
assert source["layout"]=="de-t-k0-osx"
assert "unicode.org/cldr/" in source["sourceUrl"]
base,shift=source["layers"]["base"],source["layers"]["shift"]
assert set(base)==set(shift) and len(base)==48, "Incomplete/unsynchronized 48-key layers"
assert all(len(v)==1 for v in base.values()),"Unexpected German base key Unicode"
assert all(len(v)==1 for v in shift.values()),"Unexpected German Shift key Unicode"
pairs={
"KeyA":("a","A"),"KeyK":("k","K"),"KeyY":("z","Z"),"KeyZ":("y","Y"),
"BracketLeft":("ü","Ü"),"Semicolon":("ö","Ö"),"Quote":("ä","Ä"),
"Digit1":("1","!"),"Digit3":("3","§"),"Backquote":("^","°"),
"Minus":("ß","?"),"Equal":("´",chr(96)),"Backslash":("#","'"),
"IntlBackslash":("<",">"),"Comma":(",",";"),"Period":(".",":"), "Slash":("-","_")
}
for k,(normal,upper) in pairs.items():
    assert (base[k],shift[k])==(normal,upper),f"{k}: expected {normal}/{upper}"
assert "de:MAC_GERMAN_ISO.layers.shift" in html
assert "de:MAC_GERMAN_ISO.layers.base" in html
assert "if(!shift)return PHYSICAL_BASE_PRESETS[saved.physical]?.[code]??basic;" in html
assert "function macKeycapPair(" in html
assert "shift-peek" in html
assert "body.training-mode #keyboard .key .physical-cap .latin" in html
assert "body.training-mode #keyboard .key .shift-peek" in html
assert "Shift+A" in read("docs/BRAHMI_EDITORIAL_AUDIT_20261115.md")
assert "brahmi-detail" in project and "proof-samples" in project
assert all(x in project for x in ("⇧§","𑀓","𑀸","𑁩","data-proof-lang"))
reference=json.loads(read("data/macos-brahmi-reference.json"))
assert embedded("BRAHMI_LAYERS")==reference["layers"]
assert (base["KeyK"],reference["layers"]["base"]["KeyK"])==("k","𑀓")
assert (shift["KeyK"],reference["layers"]["shift"]["KeyK"])==("K","𑀔")
with tempfile.TemporaryDirectory() as tmp:
    scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",html)
    assert scripts
    p=pathlib.Path(tmp)/"app.js"
    p.write_text("\n".join(scripts),encoding="utf-8")
    node=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert node.returncode==0,node.stderr
print("PASS: 48 German ISO key pairs, Normal/Shift visibility, independent Brahmi glyphs, consistent page specimen and JS syntax")
