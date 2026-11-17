# APP ATLAS · Interactive Explorations

[![Validate catalog](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml)
[![Browser tests](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml)
[![Live site health](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml)

**[Open APP ATLAS](https://4vmp5pkwz4-pixel.github.io/app-atlas/)** · **[Download latest release](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/latest)** · [All source repositories](https://github.com/4vmp5pkwz4-pixel?tab=repositories)

An independent, mobile-friendly, multilingual catalog of interactive learning applications, scientific visualization tools and experimental web instruments. The main catalog has a multilingual interface and contains no analytics or login.

## Available projects

| Project | Run | Source |
|---|---|---|
| Brahmi Atelier · touch-typing | [Start](https://4vmp5pkwz4-pixel.github.io/app-atlas/apps/brahmi/) | [APP ATLAS](apps/brahmi/index.html) |
| Buddhabrot · 4D volumetric explorer | [Start](https://4vmp5pkwz4-pixel.github.io/app-atlas/apps/buddhabrot/) | [Buddhabrot](https://github.com/4vmp5pkwz4-pixel/Buddhabrot) |
| NORMA · database normalization | [Start](https://4vmp5pkwz4-pixel.github.io/Normalisierung/) | [Normalisierung](https://github.com/4vmp5pkwz4-pixel/Normalisierung) |
| HCC · S³ scientific atlas | [Start](https://4vmp5pkwz4-pixel.github.io/HCC/) | [HCC](https://github.com/4vmp5pkwz4-pixel/HCC) |
| HOPF OmniAtlas | [Start](https://4vmp5pkwz4-pixel.github.io/HOPF-OmniAtlas/) | [HOPF-OmniAtlas](https://github.com/4vmp5pkwz4-pixel/HOPF-OmniAtlas) |
| UPRS Möbius–Hopf | [Start](https://4vmp5pkwz4-pixel.github.io/UPRS-M-BIUS-HOPF/) | [UPRS-M-BIUS-HOPF](https://github.com/4vmp5pkwz4-pixel/UPRS-M-BIUS-HOPF) |

**Status transparency:** Four apps launch on their existing GitHub Pages sites; Brahmi and the portable Buddhabrot edition are hosted inside APP ATLAS. The Buddhabrot HTML is mirrored verbatim from its owner-controlled public repository; the daily health check detects source drift but never overwrites code automatically. The private **Lean** repository is intentionally excluded.

## Download, test and distribute

- Download single HTML applications and prepared itch.io ZIP packages from the [GitHub Release](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.4.0-beta).
- GitHub Actions builds fresh packages on every push to `main`. [See downloads workflow](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/downloads.yml).
- Before release: `python3 scripts/validate.py`; `python3 scripts/package.py`; `npm install && npm run test:browser`.
- Live HTTPS health checks are scheduled daily; browser acceptance tests run weekly and on demand.
- For local preview, run `python3 -m http.server 8000` in repository root and open `http://localhost:8000/`.

## Project organization

```text
index.html               Public app catalog
catalog.json             Canonical project entries (RU/EN/DE)
projects/<project>/      Indexable multilingual detail pages
apps/brahmi/             Portable Brahmi trainer
apps/buddhabrot/         Portable mirrored Buddhabrot HTML
assets/                  Frontend, styles and icon
scripts/                 Validation, packaging and link checks
tests/browser/           Playwright desktop/mobile acceptance tests
docs/                    Distribution, release and legal checklists
.github/workflows/       Validation, ZIPs, releases, health, browser tests
```

## Roadmap, issues, and safety

- [Issues and launch blockers](https://github.com/4vmp5pkwz4-pixel/app-atlas/issues)
- [Distribution guide](docs/DISTRIBUTION.md)
- [Publishing workflow](docs/PUBLISHING.md)
- [German legal-readiness checklist](docs/LEGAL_READINESS.md)

**Licensing:** Owner-controlled original APP ATLAS and Brahmi Atelier software and documentation are licensed under [Apache-2.0](LICENSE), permitting commercial use, modification and redistribution. The Buddhabrot mirror remains MIT; linked projects retain their own terms. Third-party materials and ancient-text sources are excluded from the blanket grant; see [NOTICE](NOTICE), [third-party notices](THIRD_PARTY_NOTICES.txt), and [licensing audit](docs/LICENSING.md). Full historical-text and asset clearance remains open in [issue #2](https://github.com/4vmp5pkwz4-pixel/app-atlas/issues/2). Features in scientific demonstrators are not evidence of empirical validation. Complete applicable operator/legal information before wider promotion.

## Brahmi Atelier v0.9.6-beta · pronunciation and universal representations

[Pronunciation dictionary](apps/brahmi/pronunciation.html): all 115 Unicode 17 Brahmi signs; 75 broad phonetic profiles, 40 non-phonetic or control entries, 106 source-mapped signs. Includes an interactive articulatory matrix, syllable composer, reading recognition quiz, optional device-local modern Hindi speech examples and exact trainer/atlas links. BFG supports explicit user-defined feature projections on arbitrary Unicode. This is a pedagogical model, not a reconstruction of uniquely determined ancient speech.

## Brahmi Atelier v0.9.5-beta · BFG Research Lab and golden visual hierarchy

Local research companion: exact context-graph counting, Fibonacci fusion masks, AC/GT mask encoding, graph-cut tunnelling and flagged-loss analysis. Open from the home page or send the current converter text directly. The trainer keeps the original keymaps and two synchronized input tracks; wide workspaces use a golden-ratio exercise/reference split, with a 21:13 glyph/IAST scale in spacious inspect mode. [Technical methods and limits](docs/BFG_RESEARCH_LAB.md).

## Brahmi Atelier v0.9.4-beta · unified keycap sources and responsive readability

All eight keyboard label views now use their **documented Normal and Shift character sources**, without silently capitalizing Russian Mac source glyphs or substituting fallback Latin letters for Devanagari. The original Brahmi Unicode and IAST mappings remain independent. Five-row **Fit** mode preserves a complete keyboard overview; optional magnification provides sufficiently tall three-line keycaps, with bounded horizontal and vertical scrolling even in short landscape windows. The two original live typing tracks remain intact. APP ATLAS general introductory copy now says **multilingual**, while explicit language choices remain visible in selectors.

[Source and viewport audit](docs/BRAHMI_KEYCAP_FIDELITY_V094.md).

## Brahmi Atelier v0.9.3-beta · contained two-axis zoom on every orientation

Post-deployment visual inspection of v0.9.2 found that enlarging the keyboard could place the fourth or fifth key row beyond the visible keyboard region on very short screens. v0.9.3 gives the zoomed five-row keyboard **its own vertically bounded viewport with two-axis scrolling**, maintaining horizontal swipe/trackpad exploration, source-authenticated legends and access to every row without growing the overall page or replacing the primary two typing tracks. The original complete five-row fit view remains the default. [Audit and verification](docs/BRAHMI_CROSS_LAYOUT_RESPONSIVE_AUDIT.md).

## Brahmi Atelier v0.9.2-beta · responsive multilingual keyboard

The original two large typing tracks and the five-row full-width keyboard remain primary. Users can choose an optional **magnified keyboard with horizontal scrolling** for a legible inspection of complex characters on narrow screens. The macOS US ANSI physical shape and independently documented JIS Romaji Normal/Shift layers now have pinned references, rather than inheriting German Shift punctuation. Kana labels are physical keycap previews, not claims of native IME output. The ancient Brahmi source map and IAST stay independent and unchanged.

[Reproducible layout and orientation audit](docs/BRAHMI_CROSS_LAYOUT_RESPONSIVE_AUDIT.md) · [US/JIS reference data](data/macos-english-jis-keycaps.json).

## Brahmi Atelier v0.9.1-beta · restore dual-track learning cockpit

This focused ergonomic update **retains the entire v0.9 phrase atlas and every authenticated keymap**, but reverses the visual priority. The **actual two live tracks** (physical Mac input and automatic Unicode Brahmi) are shown before the atlas, with a small source-derived **upcoming chord ribbon and complete scrollable IAST** embedded horizontally in the existing labels — no extra full-width text rows added below them. On large screens the Atlas is a separately scrollable sidecar; on smaller screens it follows the main exercise. Within the Atlas, two primary reading lines (Brahmi and IAST) share a compact grid with tiny physical key chips on the right. In blind-practice mode all extra inline cues disappear; selecting another historical preview does not change the live input. The five-row keyboard remains pinned at its original height.

[Learning and layout invariants](docs/BRAHMI_DUAL_TRACK_PEDAGOGY.md) · [v0.9 complete source spec](docs/BRAHMI_TRAINER_PHRASE_ATLAS.md).

## Brahmi Atelier v0.9.0-beta · compact complete-phrase learning atlas

The **Typing Trainer** now contains an expanded-by-default, collapsible full-phrase reading panel. It displays the **entire Brahmi text**, a teaching-oriented **IAST transcription from the exact converter function**, and the **entire source-verified physical Mac key sequence**, with a second optional row for another selected layout. Select the active exercise, any of ten historical readings, or any of 25 source-linked quotations. Choose **eight Mac layouts** (German, English, three Russian modes, two Devanagari Mac modes and Japanese JIS), synchronize the primary layout to the virtual keyboard, and compare a secondary one without changing the current exercise. Explicit *Practice* or *Open converter* actions preserve user intent; unsupported signs are marked `—` and cannot silently become untypeable exercises. The five-row keyboard remains fixed while the phrase panel scrolls independently.

[Exact component specification and source integrity](docs/BRAHMI_TRAINER_PHRASE_ATLAS.md) · [Standalone app](apps/brahmi/index.html) · [Original verified keymap](data/macos-brahmi-reference.json).

## Brahmi Atelier v0.8.3-beta · visibly complete compact German legends

A post-deployment **visual** audit found that essential German Shift alternatives `3→§`, `^→°` and `ß→?` could disappear from narrow or short on-screen keys despite their correct data and DOM presence. The updated keycaps retain small, high-contrast corner labels for these *exceptional symbols* even when ordinary letter-case hints are suppressed for limited space. The key inspector also explains both Normal and Shift values. Dedicated mobile and short-landscape tests assert not only text values but actual visible, on-key pixel rectangles. The separate Mac / Brahmi / IAST source invariants remain intact.

## Brahmi Atelier v0.8.2-beta · authentic German Mac keycaps

The physical German Mac ISO visual problem is fixed with 48 **source-backed Normal/Shift key pairs** from Unicode CLDR 41 (`de-t-k0-osx`). The selected Normal-layer German output is large and legible without Shift (e.g. `a`, `ö`, `ü`, `ä`, `ß`); its verified Shift counterpart is displayed simultaneously beside it on desktop, including `3/§`, `^/°`, and `ß/?`. Shift reverses the emphasis rather than hiding the other value. Brahmi Unicode remains from the independent original 2019 keymap, with IAST on the bottom row. Physical Option/IME output is **not** inferred when source evidence is unavailable. The project detail page now uses matching gold/jade typography and three source-correct keycap specimens.

[Full design and keycap invariants](docs/BRAHMI_GERMAN_ISO_VISUAL_AUDIT.md) · [German macOS key data](data/macos-german-iso-keycaps.json).

## Brahmi Atelier v0.8.1-beta · source-checked teaching descriptions

This editorial revision updates the **public catalog, SEO detail page, five natural-language interfaces, and ten lessons** without replacing the verified keyboard source. It corrects the former claim that the displayed keyboard always uses German QWERTZ; the selected Mac layout determines the keycap, while Brahmi output continues to follow the 2019 source map. It also corrects a concrete teaching error: **KeyA and Shift+KeyA both output 𑀸**; KeyI versus Shift+KeyI yields 𑀺 versus 𑀻. The updated Shift lesson distinguishes aspiration from other consonant variants, and the numbers lesson separates Brahmi positional digits from historical additive numerals. Ancient inscriptions are now consistently described as **modern educational Unicode transcriptions of edited readings**, not exact photographs or literal historical pronunciation.

[Reproducible review and primary sources](docs/BRAHMI_EDITORIAL_AUDIT_20261115.md) · [Verified source maps](docs/MACOS_BRAHMI_SOURCE.md).

## Brahmi Atelier v0.8.0-beta · live Mac keyboard explorer

**[Launch Brahmi Atelier](https://4vmp5pkwz4-pixel.github.io/app-atlas/apps/brahmi/)** · [Technical design, modifier semantics and test gates](docs/BRAHMI_LIVE_KEY_EXPLORER.md).

The trainer's virtual physical Mac keys now show **selected physical legend → actual Unicode Brahmi → scholarly IAST** *simultaneously*, rather than relying on the converter alone. Keys update in real time while **Shift** and **Option** are held, with all four original 2019 source-backed Brahmi layers. **Control** and **Command** illuminate shortcut previews (e.g., ⌘C for Copy) rather than inventing a non-existent extra Brahmi text layer; the app does not execute OS commands. The three presentation modes are Compare / Brahmi / IAST, with local preference persistence, a key detail inspector and restrained Latin-IAST mnemonic markers (not historical proof). The converter can launch the chosen layout and pasted passage directly in the trainer. All six interface languages are supported, including experimental Brahmi and modern Hindi in Devanagari.

Automated Playwright runs cover desktop and mobile modifier press/release, native Devanagari key legends, shortcuts, transliteration, offline behavior and old lessons. A successful release pipeline packages both trainer and standalone atlas.

## Brahmi phonetic atlas · source-verified source audit

[Explore the full Brahmi phonetic atlas](apps/brahmi/phonetic-atlas.html) · [Research methodology, caveats and independent audit](docs/BRAHMI_PHONETIC_ATLAS_AUDIT.md).

This companion to Brahmi Atelier's converter enumerates all **115 Unicode-assigned Brahmi code points**, with **106 keymapped signs and 9 explicitly unmapped** in the authenticated 2019 Mac keyboard source. It compares **all 34 basic consonants** by a *specified Latin key-to-IAST metric* (US QWERTY 26/34, German QWERTZ 25/34), while keeping Russian ЙЦУКЕН and Japanese Kana/IME as physical-label views rather than manufacturing incompatible scores. Includes searchable group/status filters, Devanagari letter analogues where justified, localized RU/DE/EN/JA/HI presentation (plus experimental Brahmi-script UI) and local CSV export. The six-interface converter links to the atlas. A second, independently sourced **Keyman InScript ↔ Devanagari InScript** audit confirms **32/34 consonant** and **10/14 independent-vowel** exact-key correspondences between the two specified implementations; this is a different metric from the Latin key-to-IAST score. It is not a universal InScript ranking or a new tagged app release.

## v0.7.0-beta · Hindi/Devanagari and Russian/macOS keyboards

Brahmi Atelier now supports **nine physical-key legend views** across four national groups: German ISO QWERTZ, English US QWERTY, Russian ЙЦУКЕН (existing PC-style), Russian standard macOS, Russian–QWERTY/Phonetic macOS, Japanese JIS Romaji/Kana, and both native Mac Devanagari InScript and Devanagari–QWERTY. The four new Mac layouts are transcribed from the documented **Unicode CLDR** keyboard charts in `data/macos-extra-layouts.json`, without claiming exact Option/IME output.

The interface can now be switched to **हिन्दी · देवनागरी**. The localization includes 211 UI phrases plus full translations for all 24 lessons, 10 source-linked inscription exercises, 25 rotating Ashoka/Dhammapada quotations and the five-word glossary. Separate input handling preserves native Devanagari composition in the user's original input line while Brahmi training follows physical `KeyboardEvent.code` as before.

The standalone `brahmi-itch-html.zip` now includes the full companion `phonetic-atlas.html` for offline use. CI tests guard source fidelity, all locales, mixed-script input and the 48-pair independent Keyman InScript comparison. A release workflow runs all acceptance tests before publishing `v0.7.0-beta` and future versioned updates automatically when merged to `main`.

## Brahmi Atelier keyboard architecture and durable agent skill

The Brahmi trainer works with normal **Russian, English and German macOS keyboards without installing Brahmi**. See [the persistent contributor/agent skill](.agents/skills/brahmi-dual-layout/SKILL.md), [upstream Mac source mapping](docs/MACOS_BRAHMI_SOURCE.md) and the [reproducible JSON map](data/macos-brahmi-reference.json). All future changes are guarded by a JavaScript/authoritative-map check and Playwright tests.

## Universal Mac keyboard-independent Brahmi Atelier · v0.3.1-beta

Brahmi Atelier now accepts typing from existing **Russian ЙЦУКЕН, English US QWERTY, or German ISO QWERTZ macOS input sources**, without installing a Brahmi keyboard or changing the macOS input source. In the default mode, the editable top line records the OS input character (`KeyboardEvent.key`), while the read-only second line shows the Brahmi character derived from the corresponding physical key (`KeyboardEvent.code`) using the original Prachya Boonkwan 2019 four-layer mapping (Normal, Shift, Option, Shift+Option). The app has 24 lessons, dedicated modifier practice, interleaving, heuristic 1/3/7/14-day spaced review and Prakrit inscription lessons. Physical source-layout presets only alter on-screen labels; browsers cannot reliably infer the currently active OS keyboard source.

**[Verified standalone HTML and itch.io ZIP download · v0.3.1-beta](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.4.0-beta)**. This beta passed **48 desktop/mobile Chromium Playwright checks**, four-layer source validation and Pages deployment. Actual Mac Safari hardware input, dead keys and accessibility still warrant device testing.

Developer preservation: [Brahmi AI-agent skill](.agents/skills/brahmi-dual-layout/SKILL.md) · [Mac source mapping](docs/MACOS_BRAHMI_SOURCE.md) · [Learning method evidence](docs/TYPING_LEARNING_EVIDENCE.md) · [Release acceptance checklist](docs/BRAHMI_RELEASE_CHECKLIST.md).

### Premium always-visible Brahmi keyboard · v0.3.2-beta

The redesigned training view keeps all five physical Mac keyboard rows in a reserved bottom dock while the lesson and RU/EN/DE-to-Brahmi dual typing fields scroll independently above it. Screen widths/heights and landscape are guarded by geometry tests at twelve viewport sizes. [Evidence and safeguards](docs/KEYBOARD_VIEWPORT_QA.md) · [Download fixed standalone HTML](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/download/v0.4.0-beta/brahmi.html).

## Japanese Mac JIS + Brahmi-script interface

The standalone **Brahmi Atelier** now offers five interface locales: **Russian, German, English, Japanese and experimental modern Pāli-inspired microcopy in Unicode Brahmi script**. It has four independent physical keyboard presets, including a complete **Japanese Apple JIS layout** with 英数/Kana, ¥, ろ, Fn and punctuation positions, plus Kana/Romaji legend previews. The upper field keeps native Japanese IME composition while Brahmi follows physical key positions in the lower field. Some JIS-only keys have no source-authenticated Brahmi output; none is invented. The entire five-row keyboard remains permanently visible, including on short landscape screens.

**Historical accuracy:** Brahmi is a script, not a language. The script-only UI is modern editorial teaching material, *not* a historical inscriptional Prakrit translation. Read [Japanese/Brahmi provenance and limitations](docs/JAPANESE_JIS_AND_BRAHMI_SCRIPT.md) or the [persistent AI skill](.agents/skills/brahmi-dual-layout/SKILL.md). Production macOS Safari and a physical Japanese JIS Mac keyboard still need on-device input-method testing; Chromium cannot prove exact native IME behavior.

### Japanese Mac JIS and Brahmi-script interface · v0.4.0-beta

Five user-interface languages: Russian, German, English, Japanese, and an experimental modern Pāli-inspired interface rendered in Unicode Brahmi. Japanese Apple-style JIS physical keyboard includes 英数, かな, ¥, ろ, Fn, additional punctuation keys, and Romaji/Kana keycap preview. Mac Japanese IME composition is preserved in the source field while the second field generates Brahmi from physical key positions; the original Brahmi source has no verified output for Japanese-only extra keys. A full five-row keyboard remains visible on the screen. **48/48 Chromium desktop/mobile tests passed** in the [v0.4.0 release run](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/runs/43714306634). [Standalone HTML download](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/download/v0.4.0-beta/brahmi.html). See [Japanese JIS source, Brahmi-script editorial disclaimer and IME limitations](docs/JAPANESE_JIS_AND_BRAHMI_SCRIPT.md). Real Japanese Mac hardware and Safari input methods still require device validation.

### Complete key illumination + Brahmi reverse-conversion studio

All five keyboard rows still fit permanently in the training viewport, now with high-contrast held/release highlighting for **Space, Shift/Option/Command/Control, Tab, Enter, Backspace and Japanese JIS-only keys** as well as letters. A new dedicated **Convert ⇄** section accepts pasted Brahmi text and outputs **IAST scholarly transliteration** and separately **authentic physical Mac key chords** for DE/EN/RU/JA, with a four-layout table, explicit unsupported signs, offline copy controls and direct links from actual Ashokan inscription texts. This distinction prevents confusing transliteration of ancient languages with keyboard position labels. All 5 UI locales remain supported. See [scientific and test notes](docs/BRAHMI_CONVERTER_AND_KEY_FEEDBACK.md). Firmware-reserved shortcuts and physical Safari input still need on-device verification.

### Verified v0.5.0-beta delivery · 15 November 2026

- [Release v0.6.0-beta](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.6.0-beta), including `brahmi.html`, an itch.io-ready ZIP and checksums.
- [66/66 passed in release-gating desktop and mobile Chromium acceptance tests](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/runs/43717056113).
- [Independent live browser QA](https://agent.tinyfish.ai/runs/4810fbd3-db46-4827-81a3-7cf4cd19ab13) confirmed five full rows, highlighted Space/Shift/Option/Backspace/Enter/Command/Control and JIS special keys, live reverse conversion and all four Mac layouts.

This evidence is **browser-level**, not a guarantee that macOS Safari will emit key events for firmware Fn or every reserved Command shortcut. The virtual keyboard feedback can be verified even when macOS intercepts physical keys.

### Always-visible semantic version and 25 verified rotating passages · v0.6.0-beta

The Brahmi application now displays its **v0.6.0 β** number in the top navigation on **every page**, including the full-screen typing trainer and small landscape viewports. Version metadata is checked against `data/brahmi-release.json` by CI; the app is standalone and does not need a network request to display it.

The **Convert ⇄** workspace now has **25 independently source-linked excerpts**: 12 **Aśoka edicts in Prakrit** (Girnār editions, Hultzsch 1925) and 13 **Dhammapada verses in Pāli** (SuttaCentral). Repeated clicks load a new passage until the requested pool is exhausted, avoiding immediate repeats at the reset boundary. Buttons select all excerpts, only Aśoka, or only Dhammapada. Each card shows the scholarly Roman original, a locally generated educational Unicode Brahmi transliteration, a concise four-language interpretation and a direct source link. Editorially restored letters in the printed edition are **marked**, and partial excerpts are identified as such. Original Pāli verse texts are not attributed as quotations from Aśoka or mislabeled Girnār Prakrit. The published corpus is independently versioned in `data/brahmi-wisdom.json` and embedded byte-for-byte in the offline HTML, with strict CI verification.

For full provenance and editorial safeguards see [Wisdom corpus and semantic version policy](docs/WISDOM_CORPUS_AND_VERSION.md) and the [agent skill](.agents/skills/brahmi-dual-layout/SKILL.md). The example collection is an editorial selection, not an objective ranking of any religious or philosophical teaching.
