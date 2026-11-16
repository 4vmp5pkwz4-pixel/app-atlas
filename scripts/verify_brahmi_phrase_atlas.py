#!/usr/bin/env python3
"""Full phrase trainer source-identity and release invariants; Python stdlib + Node."""
import json,pathlib,re,subprocess,tempfile
R=pathlib.Path(__file__).resolve().parents[1]
def read(name):return (R/name).read_text(encoding="utf-8")
html=read("apps/brahmi/index.html")
release=json.loads(read("data/brahmi-release.json"))
catalog=json.loads(read("catalog.json"))
assert release["version"]=="0.9.2-beta"
assert release["phraseAtlas"]["source"]=="docs/BRAHMI_TRAINER_PHRASE_ATLAS.md"
assert release["phraseAtlas"]["layouts"]==["de","en","ru","ruMac","ruPh","dev","devq","ja"]
assert release["phraseAtlas"]["noInventedMappings"]
assert "<details id=\"trainerPhraseLab\" class=\"phrase-lab\" open>" in html
for node in ("phraseChoice","phraseLayout","phraseCompare","phraseBrahmi","phraseRoman",
             "phraseKeys","phraseKeysCompare","phrasePractice","phraseToConvert","phraseSourceLink"):
    assert 'id="'+node+'"' in html,node
assert html.index('id="trainerPhraseLab"')<html.index('id="keyboardDock"')
assert 'function brahmiKeySequence(' in html and 'function brahmiToIAST(' in html
assert 'brahmiToIAST(text).text' in html
assert 'brahmiKeyChord(c,layout,jis)' in html
assert "sourceLayout').options" in html
assert "function phraseSelectionData(" in html and "function phraseUnmapped(" in html
assert "function phrasePracticeSelected(" in html
assert "const bad=phraseUnmapped(item.text)" in html
assert "setCustom(item.text,item.roman||brahmiToIAST(item.text).text)" in html
assert "saved.phraseCompare=" in html and "persist();renderPhraseLab()" in html
assert "phraseChoice='current';" in html
assert "function highlightPhraseProgress(" in html
assert "highlightPhraseProgress(longest)" in html
assert "new Option(T('phraseCurrent'),'current')" in html
assert "for(const item of TEXTS)" in html
assert "for(const item of WISDOM_CORPUS)" in html
assert "querySelectorAll('#keyboard" not in html or "id=\"keyboardDock\"" in html
# All six UI variants must have the same localizable phrase controls.
needle="const PHRASE_ATLAS_I18N="
start=html.find(needle)
assert start>=0,"Missing embedded six-interface phrase labels"
start+=len(needle)
stop=html.index(";\n",start)
labels=json.loads(html[start:stop])
assert set(labels)=={"ru","de","en","ja","hi","br"}
keys=set(labels["en"])
assert len(keys)>=16
assert all(set(obj)==keys for obj in labels.values())
assert all(obj["phrasePractice"] and obj["phraseCaveat"] for obj in labels.values())
assert "phrase-lab" in html and "max-height:60px" in html
# Actual training source is not cloned or substituted.
reference=json.loads(read("data/macos-brahmi-reference.json"))
match=re.search(r"const BRAHMI_LAYERS=(\{[^\n;]+\});",html)
assert match and json.loads(match.group(1))==reference["layers"],"Original four-layer Brahmi mapping changed!"
mac=json.loads(read("data/macos-german-iso-keycaps.json"))
key="const MAC_GERMAN_ISO="
start=html.index(key)+len(key)
assert json.loads(html[start:html.index(";\n",start)])==mac
project=next(x for x in catalog["projects"] if x["id"]=="brahmi")
assert "v0.9.2 β" in project["tags"]
assert "multilingual" in project["desc"]["en"]
with tempfile.TemporaryDirectory() as tmp:
    p=pathlib.Path(tmp)/"app.js"
    p.write_text("\n".join(re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",html)),encoding="utf-8")
    result=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert result.returncode==0,result.stderr
print("PASS: v0.9 full-phrase atlas, 8 layout sources, 10+25 corpus reuse, 6 localizations, unchanged physical/Brahmi maps, JS syntax")
