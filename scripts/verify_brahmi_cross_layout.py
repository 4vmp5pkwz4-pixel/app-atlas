#!/usr/bin/env python3
"""Guard physical keycap provenance, independent Brahmi, and responsive UI."""
import json,re,subprocess,tempfile,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:(ROOT/p).read_text(encoding="utf-8")
app=read("apps/brahmi/index.html")
ref=json.loads(read("data/macos-english-jis-keycaps.json"))
brahmi=json.loads(read("data/macos-brahmi-reference.json"))
german=json.loads(read("data/macos-german-iso-keycaps.json"))
release=json.loads(read("data/brahmi-release.json"))
cat=json.loads(read("catalog.json"))
def embedded(name):
    start="const "+name+"="
    i=app.index(start)+len(start)
    j=app.index(";\n",i)
    return json.loads(app[i:j])
assert embedded("MAC_KEYCAP_EXTENDED")==ref
assert embedded("MAC_GERMAN_ISO")==german
assert embedded("BRAHMI_LAYERS")==brahmi["layers"]
assert release["version"]=="0.9.8-beta" and "v0.9.8 β" in app
assert "data/macos-english-jis-keycaps.json" in release["keyboardSources"]
assert len(ref["layouts"]["en"]["base"])==47
assert len(ref["layouts"]["ja"]["base"])==48
for name in ("en","ja"):
    d=ref["layouts"][name]
    assert set(d["base"])==set(d["shift"])
us=ref["layouts"]["en"]
jis=ref["layouts"]["ja"]
assert (us["base"]["KeyY"],us["base"]["KeyZ"])==("y","z")
assert (us["shift"]["Digit3"],jis["shift"]["Digit3"])==("#","#")
assert jis["shift"]["Quote"]=="*" and jis["base"]["Quote"]==":"
assert jis["shift"]["BracketLeft"]==chr(96) and jis["shift"]["IntlYen"]=="|"
assert "ROWS_US=ROWS_ANSI.map" in app and "i!==2||code!=='Backslash'" in app
assert "PHYSICAL_SHIFT_PRESETS={de:MAC_GERMAN_ISO.layers.shift,en:MAC_KEYCAP_EXTENDED.layouts.en.shift,ja:MAC_KEYCAP_EXTENDED.layouts.ja.shift" in app
assert "saved.physical==='ja'&&saved.jaPreview==='kana'" in app
assert "keyboardZoomToggle" in app and "keyboardScroll" in app
assert "max-height:min(36dvh,310px)" in app
assert "overflow-x:auto;overflow-y:auto" in app
assert "touch-action:pan-x pan-y" in app
assert 'data-zoom="true"' in app and "overscroll-behavior:contain" in app
assert "function renderCompactCue" in app and 'id="germanMirror"' in app and 'id="typingInput"' in app
p=next(p for p in cat["projects"] if p["id"]=="brahmi")
assert p["tags"][1]=="Multilingual learning studio"
assert "RU / DE / EN / JA / HI" not in str(p)
for locale in ("ru","en","de"):
    assert "0.9.8" in p["desc"][locale]
inline=re.search(r'<script id="embedded-catalog" type="application/json">([\s\S]*?)</script>',read("index.html"))
assert inline and json.loads(inline.group(1))==cat
with tempfile.TemporaryDirectory() as tmp:
    scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",app)
    assert scripts
    p=pathlib.Path(tmp)/"runtime.js"
    p.write_text("\n".join(scripts),encoding="utf-8")
    proc=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert proc.returncode==0,proc.stderr
print("PASS: US ANSI/JIS key layers, independent Brahmi source, multilingual copy, zoom UI and JS syntax")
