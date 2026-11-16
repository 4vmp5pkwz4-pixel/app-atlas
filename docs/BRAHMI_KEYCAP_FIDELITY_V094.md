# Brahmi Atelier v0.9.4-beta · multilingual keycap fidelity & adaptive learning design

**Date:** 16 November 2026 · **Scope:** eight available physical-label views, native-case fidelity, crowded keycaps, portrait/landscape, accessible focus and public copy. **Baseline:** merged `v0.9.3-beta` including the other agent's bounded two-axis magnified keyboard. The 2019 Brahmi source is not modified.

## Source-identity invariants

Physical position `KeyboardEvent.code` ≠ native Mac Normal output ≠ source-pinned Brahmi glyph ≠ scholarly isolated-sign IAST reading. The original Mac input line and resulting Brahmi text line remain separate, visible learning tracks. Do not equate keyboard mnemonic letter similarity with historical transmission, and do not describe keycap previews as switching a real macOS input source.

The canonical mappings are:

| Physical view | Normal & Shift data | Important distinction |
| --- | --- | --- |
| German Mac ISO | `data/macos-german-iso-keycaps.json` | German ISO shape; original special characters (`ß`, `§`, `°`) |
| US Mac ANSI | `data/macos-english-jis-keycaps.json` | ANSI Backslash and Enter positions; not German punctuation |
| Russian ЙЦУКЕН reference | `RU_REFERENCE_BASE` & `RU_REFERENCE_SHIFT` | Reference comparison, **not certified native Apple input source** |
| Russian macOS | `data/macos-extra-layouts.json`: `ruMac` | Source Normal is lower-case Cyrillic (`й`, `ф`, `ё`), not uppercase printed keycap text |
| Russian macOS phonetic | `data/macos-extra-layouts.json`: `ruPh` | Independent QWERTY-phonetic positions, source Normal is lower-case |
| Devanagari Mac InScript | `data/macos-extra-layouts.json`: `dev` | Dependent vowels, virāma, source-defined Shift signs |
| Devanagari Mac QWERTY | `data/macos-extra-layouts.json`: `devq` | Some shifted labels are multi-codepoint clusters (e.g. `क्ष`) |
| Japanese Mac JIS | `data/macos-english-jis-keycaps.json`: `ja` | Extra JIS keys; optional Kana is a printed-keycap preview, **not native IME output** |

The source-backed Brahmi four-layer `Brahmi.keylayout` remains `data/macos-brahmi-reference.json` and is **independent** of every modern Mac view.

### Fixed consistency defect

Previously the keyboard renderer sourced its Normal legends directly for DE/EN/JIS and the reference Russian comparison, while **ruMac/ruPh/dev/devq** sometimes fell back to a generic `physicalLabel()` path. Russian Mac lowercase glyphs were capitalized in the preview and an unverified fallback could replace a source-defined Indian sign. `PHYSICAL_BASE_PRESETS` now includes all eight canonical Normal tables. The legacy uppercase key *name* used in converter key chord listings is intentionally preserved, but its lettercase no longer overrides the actual Normal-layer keycap.

## Visual information hierarchy

Every ordinary key is logically the same source-derived structure:

1. Main, most readable: **currently selected Mac Normal/Shift symbol**.
2. Secondary, smaller: **opposite Shift/Normal symbol** where documented. Complex source signs may need enlarged mode.
3. Central: **Unicode Brahmi character** from the original source map.
4. Footnote: **IAST transcription** of that isolated sign. An attached vowel `◌ā` is not an independent syllable.

A complete **Fit** view preserves five on-screen rows and the two original live text tracks. At 320 CSS px a key can be narrower than a complex Devanagari glyph. No honest design can keep several complex strings fully readable on every tiny fitted key *and* show every key at once: instead, **Magnify** gives source-faithful larger labels in internally scrollable 60 px keycaps; even short landscape windows preserve access to row five inside the bounded keyboard viewport.

The v0.9.3 internal scroll fix is preserved: `max-height:min(36dvh,310px)`, both axes `auto`, `touch-action:pan-x pan-y`, bounded dock and intact exercise inputs. The zoom now makes room for all three semantically different information lines rather than squeezing them into a 48 px button.

## Usability and accessibility benchmarks

- **Responsive reflow:** test 320×568, 375×812, 390×844, 667×375, 768×1024, 844×390, 1280×720 and 1440×900. The *page* must not gain unintended horizontal scrolling; the explicitly labeled keyboard inspection region may scroll in two dimensions because a keyboard is inherently spatial. This follows the functional exceptions and limits in [WCAG 2.2 Reflow 1.4.10](https://www.w3.org/TR/WCAG22/#reflow).
- **Do not obscure focus:** the keyboard's contained scrolling should not cover the two original text fields. The practical benchmark is [WCAG 2.2 Focus Not Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum).
- **Precision and touch:** maintain visible focus indicators and tactile target separation. [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility) notes comfortable interactive control sizing; the complete Fit keyboard is a spatial *overview*, not a promise that 320-pixel buttons meet desktop or phone touch-target recommendations. Magnified mode supplies larger inspection targets.
- **Modifier truth:** Shift/Option select original Brahmi layers. Native macOS Option, dead-key and IME output require physical hardware verification; Control/Command preview non-printing shortcuts, not additional Brahmi signs.
- **Language scalability:** the general product and collection copy uses **multilingual / mehrsprachig / многоязыковой**, while the full explicit list of available interface languages and keyboard previews remains in selectors and specialized accessibility labels.

## Quality gates

`scripts/verify_brahmi_all_layouts.py`: checks all source files match the exact embedded JSON, case invariants, a stable independent original Brahmi map, the two-axis zoom design, source-safe general copy, matching standalone and embedded catalog, and JavaScript syntax.

`tests/browser/brahmi-all-layout-invariants.spec.cjs`: tests both source layers on every physical view, representative native Cyrillic and Devanagari, 8 screen/orientation combinations, actual physical three-line keycap geometry and complete fifth-row scroll reachability. Every other established lesson/corpus/IME/typing test must also pass.

These are **software quality checks**, not a validated claim of being the best keyboard trainer worldwide. Real Mac hardware with Safari, various OS input sources and actual learners remains a further evaluation step.
