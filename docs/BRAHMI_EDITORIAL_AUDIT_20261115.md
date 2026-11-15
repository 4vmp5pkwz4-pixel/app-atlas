# Brahmi Atelier · editorial and scientific re-audit

**Edition:** 2026-11-15 · target version **v0.8.1-beta** · scope: descriptions, lesson hints, public catalogue, epigraphic and Unicode framing. The authenticated Brahmi Mac keymap and the existing lesson exercise sequences are preserved.

## Five distinct objects — never conflate them

| Object | Example | What is and is not claimed |
| --- | --- | --- |
| Physical Mac key position | `KeyK` via `KeyboardEvent.code` | Stable physical position; the displayed letter differs across DE/EN/RU/JA/Devanagari key layouts |
| Selected Mac key legend | `K`, `Л`, `क` | Label preview from a selected layout; does not switch the macOS input method or guarantee Option/IME composition |
| Sourced Brahmi code point | `𑀓` | From Prachya Boonkwan's 2019 Mac `Brahmi.keylayout`, not an inferred correspondence |
| Sign-level scholarly romanization | `ka` (consonant), `◌ā` (dependent vowel) | Isolated-sign didactic IAST, including the abugida's conventional inherent vowel; neither complete semantic translation nor certain 3rd-century BCE phonetics |
| Critical historical inscription reading | `hida budhe jāte sakyamunī ti` | Edited Prakrit reading transcribed in modern Unicode Brahmi; historical glyph forms and epigraphic variants depend on the edition |

**Latin keyboard resemblance is a deliberately defined mnemonic metric, not historical evidence that QWERTY descends from Brahmi.** The 26/34 (English) and 25/34 (German) mnemonic values in the independent atlas are not commensurable with the separate 32/34 Keyman InScript-to-InScript correspondence. Neither proves evolutionary continuity from ancient lettering into keyboard positions.

## Concrete correction: Shift+A and the vowel-sign lesson

The **actual source keymap** assigns:

| Physical chord | Sourced output | Educational explanation |
|---|---|---|
| `KeyA` | `𑀸` U+11038 | Dependent long ā sign, not a free-standing letter |
| `Shift+KeyA` | `𑀸` U+11038 | The **same** source output — Shift+A is optional, not required |
| `KeyI` | `𑀺` U+1103A | Dependent i |
| `Shift+KeyI` | `𑀻` U+1103B | Dependent ī |
| `KeyU` / `Shift+KeyU` | `𑀼` / `𑀽` | Dependent u / ū |
| `KeyE` / `Shift+KeyE` | `𑁂` / `𑁃` | Dependent e / ai |
| `KeyO` / `Shift+KeyO` | `𑁄` / `𑁅` | Dependent o / au |

The former instruction “type K and then Shift+A for 𑀓𑀸” was unnecessarily restrictive and the statement “Shift+A makes the long ā sign” was misleading about the layer distinction. The revised instructions explicitly use **K then A**, mention Shift+A's identical output, and contrast short i with long ī.

Similarly, the “aspirated sounds” Shift lesson included other consonants (for example `KeyY → 𑀬` / `Shift+KeyY → 𑀜`); it is correctly titled **consonant variants**, not exclusively aspirates.

## Brahmi numbers are two writing systems

The Unicode Standard distinguishes **historical additive/multiplicative number signs U+11052–U+11065** from the **later positional digits U+11066–U+1106F**. U+1107F NUMBER JOINER has a specific combining function for numerals and must not be treated as an ordinary printable digit. The numerals lesson exercises positional digits 0–9 and punctuation, **not** all historic Brahmi number signs.

Source: [Unicode 17, Chapter 14.1, Brahmi](https://unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/).

## What was corrected

- **Ten lessons** revised in RU/DE/EN/JA/HI: physical row labels in multilingual layouts; Shift+A vowel sign; nonaspirated Shift variants; number-system distinction; precise historical transcription labels for Lumbinī and Bairāt; and editorial 96% goal framing.
- **Nine descriptions per natural-language UI**, with synchronized data in `data/brahmi-reviewed-descriptions.json`: keyboard layers, IAST limitations, physical `KeyboardEvent.code`, the non-printing Command/Control preview, and non-facsimile inscriptions.
- **Public catalogue metadata** in `catalog.json` and its exact offline copy in `index.html`; `projects/brahmi/index.html` SEO metadata and all three public catalog languages; outdated `v0.6.0` and single-QWERTZ claims replaced.
- **Versioned docs and original-source guide** brought into agreement with 9 supported key-label views and 6 UI variants: RU, DE, EN, JA, HI, plus experimental Brahmi-script presentation.

The experimental Brahmi-script *interface* is a constructed teaching presentation, **not** a verified historical translation into Ashokan Prakrit. Modern Hindi interface descriptions are translated editorial explanations, not antique Sanskrit inscriptions.

## Primary and reproducible sources

1. [Source Mac Brahmi.keylayout — Prachya Boonkwan, MIT (2019)](https://github.com/kaamanita/brahmi/blob/master/Brahmi.keylayout) · preserved in `data/macos-brahmi-reference.json`.
2. [Unicode 17 Brahmi technical specification](https://unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/); [Unicode Brahmi code chart](https://www.unicode.org/Public/17.0.0/charts/PDF/U11000.pdf).
3. [Rummindeī/Lumbinī pillar reading and its editorial tradition](https://en.wikisource.org/wiki/Asoka_-_the_Buddhist_Emperor_of_India/Chapter_5). See also `TEXTS.lumbini` source in the app; its modern Brahmi typesetting is **not** a facsimile.
4. [Bairāt/Bhabru rock-edict edition information](https://pmml.nic.in/downloadSeries/342). The quoted evaluation of Buddha's words is **Aśoka's description**, not a direct quotation of a Buddha discourse.
5. [Unicode CLDR macOS Russian layout charts](https://www.unicode.org/cldr/charts/41/keyboards/layouts/ru.html) and [Hindi layouts](https://www.unicode.org/cldr/charts/41/keyboards/layouts/hi.html); not evidence for exact live Option/IME output.
6. `data/brahmi-inscript-keyman-audit.json` for a distinct, source-pinned Keyman InScript ↔ Devanagari InScript comparison.

## Release quality gate

- `python3 scripts/validate.py` validates the project catalog and exact in-page offline catalogue.
- `python3 scripts/verify_brahmi.py`, `scripts/verify_phonetic_atlas.py`, `scripts/verify_brahmi_extended_locales.py` preserve authentic source maps and localization records.
- `python3 scripts/verify_brahmi_editorial.py` verifies the reviewed descriptions against the embedded app, catalog, version and the counterintuitive Shift+A source mapping.
- Playwright desktop and mobile browser tests assert key descriptions and the correct vowel sequences, while preserving training behavior and UI layout.

**Limitations:** the teaching app cannot date or reconstruct every ancient pronunciation, resolve uncertain readings automatically, detect the exact user's macOS input source, reproduce all native Option/dead-key/IME outputs, or intercept OS-reserved shortcuts. Hardware validation on macOS Safari remains separately required.
