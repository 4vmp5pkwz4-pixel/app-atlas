#!/usr/bin/env python3
"""Brahmi Atelier source/viewport invariants for the complete eight-layout keyboard."""
import json, pathlib, re, subprocess, tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
read=lambda name:(ROOT/name).read_text(encoding="utf-8")
app=read("apps/brahmi/index.html")
release=json.loads(read("data/brahmi-release.json"))
catalog=json.loads(read("catalog.json"))
mac_extra=json.loads(read("data/macos-extra-layouts.json"))
mac_extended=json.loads(read("data/macos-english-jis-keycaps.json"))
mac_de=json.loads(read("data/macos-german-iso-keycaps.json"))
brahmi=json.loads(read("data/macos-brahmi-reference.json"))

def embedded(name):
    marker="const "+name+"="
    a=app.index(marker)+len(marker)
    b=app.index(";\n",a)
    return json.loads(app[a:b])

assert release["version"]=="0.9.4-beta"
assert release["display"]=="v0.9.4 β"
assert 'const APP_VERSION="0.9.4-beta";' in app
assert embedded("MAC_EXTRA_LAYOUTS")==mac_extra
assert embedded("MAC_KEYCAP_EXTENDED")==mac_extended
assert embedded("MAC_GERMAN_ISO")==mac_de
assert embedded("BRAHMI_LAYERS")==brahmi["layers"]

# The original Brahmi mapping is independent from the selected Mac key legend.
assert brahmi["layers"]["base"]["KeyK"]=="𑀓"
assert brahmi["layers"]["shift"]["KeyK"]=="𑀔"
assert brahmi["layers"]["base"]["KeyA"]==brahmi["layers"]["shift"]["KeyA"]=="𑀸"

# An unaltered, auditable canonical Normal/Shift map must exist for every view.
assert "PHYSICAL_BASE_PRESETS.ru=RU_REFERENCE_BASE;" in app
for item in ("ruMac","ruPh","dev","devq"):
    assert f"{item}:MAC_EXTRA_LAYOUTS.layouts.{item}.base" in app
for item in ("de","en","ja"):
    assert f"{item}:" in app and f"MAC_" in app
for key in ("ruMac","ruPh","dev","devq"):
    obj=mac_extra["layouts"][key]
    assert len(obj["base"])>=35 and len(obj["shift"])>=35
    assert set(obj["base"]).issubset(set(obj["shift"]))
    assert obj["base"]["KeyK"]!=None
assert mac_extra["layouts"]["ruMac"]["base"]["KeyQ"]=="й"
assert mac_extra["layouts"]["ruMac"]["shift"]["KeyQ"]=="Й"
assert mac_extra["layouts"]["dev"]["base"]["KeyK"]=="क"
assert mac_extra["layouts"]["devq"]["shift"]["KeyX"]=="क्ष"

# In short windows, magnified legends use three legible lines, never infinite dock growth.
assert "max-height:min(36dvh,310px)" in app
assert "overflow-x:auto;overflow-y:auto" in app
assert "height:60px;min-height:60px" in app
assert "height:58px;min-height:58px" in app
assert "function renderCompactCue" in app
assert 'id="germanMirror"' in app and 'id="typingInput"' in app
assert 'zoomPanHint' in app
for lang in ("ru","de","en","ja","hi"):
    assert lang in app

# General catalog copy uses the semantic concept 'multilingual', not a hardcoded language list.
index=read("index.html")
site=read("assets/site.js")
assert "RU · EN · DE" not in index and "RU · EN · DE" not in read("README.md")
assert '<span data-i="multilingual">' in index
for phrase in ('multilingual:"Многоязыковой"','multilingual:"Multilingual"','multilingual:"Mehrsprachig"'):
    assert phrase in site
entry=next(p for p in catalog["projects"] if p["id"]=="brahmi")
assert entry["tags"][0]=="v0.9.4 β"
for lang in ("ru","en","de"):
    assert "0.9.4" in entry["desc"][lang]
assert all(lang not in entry["tags"] for lang in ("RU / DE / EN","RU · EN · DE"))
m=re.search(r'<script id="embedded-catalog" type="application/json">([\s\S]*?)</script>',index)
assert m and json.loads(m.group(1))==catalog
assert "v0.9.4-beta" in read("projects/brahmi/index.html")

with tempfile.TemporaryDirectory() as tmp:
    scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",app)
    assert scripts
    path=pathlib.Path(tmp)/"all-layouts.js"
    path.write_text("\n".join(scripts),encoding="utf-8")
    res=subprocess.run(["node","--check",str(path)],capture_output=True,text=True)
    assert res.returncode==0,res.stderr
print("PASS: all eight Normal/Shift layouts are source-backed; Brahmi independent, responsive zoom, catalog synchronized and JavaScript valid")
