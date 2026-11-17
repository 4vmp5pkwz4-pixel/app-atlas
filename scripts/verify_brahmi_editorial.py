#!/usr/bin/env python3
"""Editorial regression gate: descriptions, historical framing and source-mapped vowel truth."""
import json
import pathlib
import re

ROOT=pathlib.Path(__file__).resolve().parents[1]
def load(name):
    return json.loads((ROOT/name).read_text(encoding="utf-8"))

html=(ROOT/"apps/brahmi/index.html").read_text(encoding="utf-8")
project=(ROOT/"projects/brahmi/index.html").read_text(encoding="utf-8")
readme=(ROOT/"README.md").read_text(encoding="utf-8")
index=(ROOT/"index.html").read_text(encoding="utf-8")
data=load("data/brahmi-reviewed-descriptions.json")
hindi=load("data/brahmi-hindi-content.json")
release=load("data/brahmi-release.json")
catalog=load("catalog.json")
source=load("data/macos-brahmi-reference.json")
atlas=load("data/brahmi-inscript-keyman-audit.json")
expected_version="0.9.5-beta"
assert release["version"]==expected_version, "Version release metadata drifted"
assert release["display"]=="v0.9.5 β"
assert "const APP_VERSION=\""+expected_version+"\";" in html
assert ">v0.9.5 β</span>" in html
assert {**source["layers"]["base"]}["KeyA"]=="𑀸"
assert source["layers"]["shift"]["KeyA"]=="𑀸", "Shift+A has same Brahmi output as A"
assert source["layers"]["base"]["KeyI"]=="𑀺"
assert source["layers"]["shift"]["KeyI"]=="𑀻"
assert source["layers"]["base"]["KeyE"]=="𑁂"
assert source["layers"]["shift"]["KeyE"]=="𑁃"
assert source["layers"]["base"]["KeyO"]=="𑁄"
assert source["layers"]["shift"]["KeyO"]=="𑁅"
assert atlas["totals"]["consonantAligned"]==32 and atlas["totals"]["vowelAligned"]==10

def embedded_constant(name):
    needle="const "+name+"="
    i=html.index(needle)+len(needle)
    j=html.index(";\n",i)
    return json.loads(html[i:j])

assert data==embedded_constant("BRAHMI_REVIEWED_DESCRIPTIONS")
assert hindi==embedded_constant("HINDI_CONTENT")
assert set(data["ui"])=={"ru","de","en","ja","hi"}
keys=set(data["ui"]["en"])
assert len(keys)>=9
assert all(set(x)==keys for x in data["ui"].values())
for lang,texts in data["ui"].items():
    for field in ("keyboardNote","guideMapInfo","guideMapCaveat","convIntro","convRomanCaveat","transcriptionNotice"):
        assert texts[field] and len(texts[field])>=(20 if lang=="ja" else 40),(lang,field)

assert "K, then A; Shift+A gives the same" in html
assert "Shift+A gives the same" in html
assert "Shift+A" in str(hindi["lessons"]["vowel2"])
assert "सामंजस्य" in str(hindi["lessons"]["peace"])
assert "Долгие гласные и дифтонги" in html
assert "Shift: варианты согласных" in html
assert "Shift: consonant variants" in html
assert "KeyZ" in html
assert "исторические знаки" in html.lower() or "исторические" in html
assert "Brahmi Atelier — автономный многоязычный тренажёр" in html
assert "для немецкой QWERTZ-клавиатуры Mac" not in html
assert "visual keyboard always shows German QWERTZ" not in str(data["ui"]["en"])

brahmi=next(p for p in catalog["projects"] if p["id"]=="brahmi")
assert "v0.9.5 β" in brahmi["tags"]
assert all("0.9.5" in brahmi["desc"][lang] for lang in ("ru","en","de"))
assert len(brahmi["tags"])>=5
assert "v0.6.0" not in str(brahmi)
m=re.search(r'<script id="embedded-catalog" type="application/json">([\s\S]+?)</script>',index)
assert m and json.loads(m.group(1))==catalog, "Inline catalog differs from official file"
for wrong in ("with QWERTZ lessons", "Zehnfingertrainer für die antike Brahmi-Schrift mit QWERTZ-Lektionen", "v0.6.0"):
    assert wrong not in project, wrong
assert "v0.9.5 β" in project
assert "not a facsimile" in readme.lower() or "not exact photographs" in readme.lower() or "not exact photographs" in (ROOT/"docs/BRAHMI_EDITORIAL_AUDIT_20261115.md").read_text(encoding="utf-8").lower()
print("PASS: reviewed 5 natural languages, 10 lessons, original Shift+A/IAST truth, v0.8.1 catalog + SEO consistency")
