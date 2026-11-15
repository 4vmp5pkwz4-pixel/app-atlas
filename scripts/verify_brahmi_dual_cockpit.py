#!/usr/bin/env python3
"""Fail-closed source/presentation contract for the two-track Brahmi trainer."""
from pathlib import Path
import json,re,subprocess,tempfile
R=Path(__file__).resolve().parents[1]
app=(R/"apps/brahmi/index.html").read_text(encoding="utf-8")
release=json.loads((R/"data/brahmi-release.json").read_text(encoding="utf-8"))
assert release["version"]=="0.9.1-beta"
assert 'const APP_VERSION="0.9.1-beta";' in app
assert ">v0.9.1 β</span>" in app
assert app.count('id="germanMirror"')==1
assert app.count('id="typingInput"')==1
assert app.count('id="liveMacRail"')==1
assert app.count('id="liveRomanRail"')==1
assert app.count('id="trainerPhraseLab"')==1
assert app.index('id="germanMirror"')<app.index('id="typingInput"')<app.index('id="trainerPhraseLab"')
assert app.index('id="trainerPhraseLab"')<app.index('id="layoutMatrix"')
assert "function renderCompactCue(" in app
assert "renderCompactCue(longest)" in app
assert "brahmiKeyChord(sign,saved.physical,saved.jaPreview)" in app
assert "brahmiToIAST(prompt).text" in app
assert "const blind=Boolean(saved.blind||forceBlind)" in app
assert "keys.hidden=blind;roman.hidden=blind||!showRoman" in app
assert 'grid-template-columns:minmax(0,1.3fr) minmax(320px,.85fr)' in app
assert "body.training-mode .trainer-workspace>.exercise{grid-column:1;grid-row:3" in app
assert "body.training-mode .trainer-workspace>.phrase-lab" in app
assert "body.training-mode .trainer-workspace{display:block}" in app
assert '.phrase-lines[data-comparing="true"]>.phrase-line:nth-child(3)' in app
assert 'id="phraseKeysCompare"' in app
assert 'id="phrasePractice"' in app and 'id="phraseToConvert"' in app
# The keyboard's 2019 source map and both macOS map JSON files are still independently verified by existing gates.
assert '"keyboardSources"' in (R/"data/brahmi-release.json").read_text(encoding="utf-8")
with tempfile.TemporaryDirectory() as d:
    scripts=re.findall(r"<script(?:\s[^>]*)?>([\s\S]*?)</script>",app)
    assert scripts
    p=Path(d)/"atelier.js";p.write_text("\n".join(scripts),encoding="utf-8")
    node=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    assert node.returncode==0,node.stderr
print("PASS: two live inputs precede intact v0.9 phrase atlas; source-derived compact hints; blind mode; JS syntax")
