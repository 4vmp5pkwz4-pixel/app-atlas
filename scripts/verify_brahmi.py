#!/usr/bin/env python3
"""Validate Brahmi Atelier against authoritative four-layer Mac source. Python stdlib + Node."""
import json
import pathlib
import re
import subprocess
import tempfile

ROOT=pathlib.Path(__file__).resolve().parents[1]
html=(ROOT/"apps/brahmi/index.html").read_text(encoding="utf-8")
reference=json.loads((ROOT/"data/macos-brahmi-reference.json").read_text(encoding="utf-8"))
match=re.search(r"const BRAHMI_LAYERS=(\{[^\n;]+\});",html)
assert match, "Missing embedded Brahmi source layer data"
actual=json.loads(match.group(1))
assert actual==reference["layers"], "Web app Brahmi layers diverged from verified Mac .keylayout source"
assert set(actual)=={"base","shift","option","shiftOption"}
for layer in actual.values():
    assert len(layer)>=45, "Incomplete physical key map"
assert actual["base"]["KeyQ"]=="𑀅"
assert actual["shift"]["KeyQ"]=="𑀆"
assert actual["option"]["KeyA"]=="𑀹"
assert actual["shiftOption"]["KeyI"]=="𑀈"
assert actual["option"]["KeyS"]=="", "Empty original Option layer must stay empty"
assert actual["base"]["Space"]==" ", "Preserve source Unicode en-space; normalize at exercise runtime only"
assert 'id="germanMirror"' in html and 'id="typingInput"' in html
assert 'id="sourceLayout"' in html and all('value="'+x+'"' in html for x in ("ru","de","en"))
assert 'data-layer="shiftOption"' in html
assert "event.code" in (ROOT/"docs/MACOS_BRAHMI_SOURCE.md").read_text(encoding="utf-8")
assert "if(!saved.independentModeInitialized)" in html

jis=json.loads((ROOT/"data/macos-jis-layout.json").read_text(encoding="utf-8"))
def read_jis_constant(name):
    start=html.find("const "+name+"=")
    assert start>=0, f"Missing {name}"
    start+=len("const "+name+"=")
    end=html.find(";\n",start)
    assert end>=0, f"Missing terminator for {name}"
    return json.loads(html[start:end])
assert jis["rows"]==read_jis_constant("ROWS_JIS"), "Mac JIS key row mismatch"
assert jis["labels"]==read_jis_constant("physJa"), "Mac JIS physical labels mismatch"
assert jis["kana"]==read_jis_constant("JIS_KANA"), "Mac JIS Kana preview mismatch"
assert len(jis["rows"])==5
assert {"IntlYen","IntlRo","Lang1","Lang2","Fn"}.issubset(set(sum(jis["rows"],[])))
assert 'id="japaneseMode"' in html and all('value="'+x+'"' in html for x in ("ru","de","en","ja","br"))
assert "japaneseComposing" in html and "const BRAHMI_UI_ROMAN=" in html

# Version badge and sourced quotation corpus must agree with offline datasets.
release=json.loads((ROOT/"data/brahmi-release.json").read_text(encoding="utf-8"))
def embedded_json_constant(name):
    token="const "+name+"="
    pos=html.find(token)
    assert pos>=0, f"Missing {name} in the standalone HTML"
    pos+=len(token)
    end=html.find(";\n",pos)
    assert end>=0, f"Missing terminator for {name}"
    return json.loads(html[pos:end])
assert embedded_json_constant("APP_VERSION")==release["version"], "Version constant differs from release data"
assert 'id="versionBadge"' in html and '>'+release["display"]+'</span>' in html, "Visible version badge missing"
wisdom=json.loads((ROOT/"data/brahmi-wisdom.json").read_text(encoding="utf-8"))
assert embedded_json_constant("WISDOM_CORPUS")==wisdom["items"], "Embedded wisdom source differs from curated data"
assert len(wisdom["items"])>=25 and len({item["id"] for item in wisdom["items"]})==len(wisdom["items"])
assert len([x for x in wisdom["items"] if x["group"]=="ashoka"])>=12
assert len([x for x in wisdom["items"] if x["group"]=="dhammapada"])>=13
for item in wisdom["items"]:
    assert all(item["meaning"].get(lang) for lang in ("ru","de","en","ja")), item["id"]
    assert item["source_url"].startswith(("https://indike.org/","https://suttacentral.net/"))
assert 'id="wisdomSpotlight"' in html and 'id="wisdomCategory"' in html
assert "function nextWisdom(" in html

scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",html)
assert scripts, "No inline executable JS"
for i,script in enumerate(scripts):
    if not script.strip():continue
    with tempfile.TemporaryDirectory() as work:
        p=pathlib.Path(work)/f"brahmi-{i}.js"
        p.write_text(script,encoding="utf-8")
        result=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
        assert result.returncode==0, f"Brahmi JS syntax failed: {result.stderr}"
print("OK: authentic Mac maps, visible version "+release["version"]+", 25 source-linked quotations, and JS syntax")
