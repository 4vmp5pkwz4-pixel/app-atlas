# Japanese Mac JIS and Brahmi-script user interface

The Brahmi Atelier UI now offers **Russian, German, English, Japanese, and an experimental user interface written entirely in Unicode Brahmi**. Physical keycap presets are separately selectable: **RU / DE / EN / Japanese Mac JIS**. Choosing a keycap preset never changes macOS itself.

## Apple Japanese hardware

The five-row JIS keyboard includes **¥ (IntlYen), ろ (IntlRo), 英数 (Lang2), かな (Lang1), Fn, Japanese punctuation and Mac modifiers**. Romaji and Kana preview modes show alternate legends without altering the macOS input source. The physical reference JSON is in `data/macos-jis-layout.json`.

Sources: [W3C UI Events KeyboardEvent codes](https://www.w3.org/TR/2025/REC-uievents-code-20250422/), [Apple: Japanese input mode and Eisu/Kana](https://support.apple.com/en-md/guide/japanese-input-method/jpimf6ffb247/mac), [Apple: user-selectable Japanese input options](https://support.apple.com/en-tm/guide/japanese-input-method/jpim662a12b9/mac), [Japan Foundation's Kana legend reference](https://sydney.jpf.go.jp/jpf/jpfmedia/Digital-Learning-Tools-Student-Handbook.pdf), [Mac JIS layout picture](https://commons.wikimedia.org/wiki/File:KB_Japanese_Mac_-_Apple_Keyboard_(MB869JA).svg).

### Actual Japanese input remains native to macOS

The normal upper field allows macOS IME to handle its kana/kanji **composition**. The lower field independently derives Brahmi from each physical key's `KeyboardEvent.code` and Shift/Option. One committed Japanese glyph may require multiple key presses, so the two lines need not contain the same number of characters. When composing, Space/Enter can select candidates, not Brahmi characters. Tests of desktop/mobile Chromium simulate this; physical Safari on Japanese Mac hardware remains a separate acceptance requirement.

**Do not invent native Brahmi key assignments** for Japanese-only physical `IntlYen`, `IntlRo`, `Lang1`, `Lang2` or `Fn`. The verified Prachya Boonkwan 2019 Mac ANSI `Brahmi.keylayout` does not specify outputs for these keys. Standard alphanumeric keys retain all four original Brahmi layers.

## Language and script are not interchangeable

Brahmi is an ancient *script*, not a spoken language. The experimental fifth UI is **modern editorial Pāli-inspired language rendered with Unicode Brahmi**, not historically attested Prakrit and not the wording of Ashoka's inscriptions. Exact Girnār inscription passages remain separate original historical sources. See [Unicode Brahmi encoding](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/) and [Pāli versus inscriptional Prakrit](https://pustakalaya-org.github.io/vol10_sabda/chapter09_prakrit_pali.html).

## Quality gate

Run `python3 scripts/verify_brahmi.py`, `python3 scripts/validate.py` and `npm run test:browser`; verify Japanese translations, four modifier layers, full extra JIS keys and no clipping on phone/landscape, independent IME composition, full Brahmi-script interface translation and all 24 lessons. Recheck Mac Safari in real hardware before promising 100% IME fidelity.
