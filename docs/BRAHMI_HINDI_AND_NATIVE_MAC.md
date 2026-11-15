# Brahmi Atelier 0.7.0-beta: Hindi UI and native Mac keyboard presets

## Preset names and evidence

`data/macos-extra-layouts.json` preserves the source keycap *legends* for four additional native macOS layouts. These mappings are read-only and never switch the operating-system input source.

| App preset | CLDR 41 keyboard id | Notes |
|---|---|---|
| `ruMac` | `ru-t-k0-osx` | Apple's standard Russian layout, distinct from the existing PC-style Cyrillic `ru` |
| `ruPh` | `ru-t-k0-osx-qwerty` | Russian–Phonetic / Russian–QWERTY; example `KeyA=а`, `KeyH=ч`, `KeyY=ы` |
| `dev` | `hi-t-k0-osx` | Native Mac Devanagari, InScript positions; `KeyK=क`, `Shift+K=ख` |
| `devq` | `hi-t-k0-osx-qwerty` | Native Mac Devanagari–QWERTY; `KeyF=्`, `Shift+X=क्ष` |

Sources: [Unicode CLDR macOS Russian charts](https://www.unicode.org/cldr/charts/41/keyboards/layouts/ru.html), [Unicode CLDR macOS Hindi/Devanagari charts](https://www.unicode.org/cldr/charts/41/keyboards/layouts/hi.html). Keyman Devanagari INSCRIPT Basic is a **separate** source file and only used for the independent phonetic atlas comparison.

**Layer limits:** The source data directly records documented Normal and Shift output. Option on a real macOS keyboard may be a dead key, composed text or be unavailable for a given source; the app does **not** manufacture those outputs. The Brahmi training destination still follows the source-authenticated Prachya Boonkwan 2019 `KeyboardEvent.code` layers. Native Devanagari source text is preserved without `preventDefault()` while composition is active, analogously to existing Japanese JIS behavior.

## Complete Hindi interface (Devanagari script)

- `data/brahmi-hindi-ui.json`: **211/211** baseline UI and converter keys translated into modern Hindi (not labelled as an ancient Sanskrit or Prakrit inscription).
- `data/brahmi-hindi-content.json`: the **24** lessons (title, description, tip), **10** historical teaching items (title, meaning), **25** curated Ashoka/Dhammapada passages (summary and source-label), **5** glossary entries, plus 2 Japanese JIS menu hints.
- The same translations are embedded in `apps/brahmi/index.html` so the app works offline with no runtime data fetch.
- The converter launches `phonetic-atlas.html` with the current UI locale shared via the existing non-sensitive local preference; the atlas has its own Hindi translation and both Devanagari/Russian Mac keycap views.

**Scientific context:** Brahmi is a writing system, not a spoken language; the modern Hindi user interface is not presented as a historical translation of Aśoka's inscriptions. IAST is transliteration, not translation. Teaching material is linked to identifiable sources and should not be mistaken for photographs or palaeographic facsimiles.

## Automated unattended releases

`.github/workflows/release-brahmi.yml` is triggered after changes reach `main` (and manually on demand). It validates the project and all provenance files, runs the full desktop/mobile browser acceptance test suite, packages the Brahmi HTML and accompanying offline atlas, then creates/refreshes the matching GitHub release derived from `data/brahmi-release.json`. A failed gate stops publication. It never requires an individual user confirmation for merge/release, as requested.

Manual macOS Safari and actual native IME hardware fidelity remain an independent post-release check; automated Chromium tests cannot guarantee interception of Fn or macOS-reserved shortcuts.
