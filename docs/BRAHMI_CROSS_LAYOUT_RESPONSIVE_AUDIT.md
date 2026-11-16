# Brahmi Atelier v0.9.2 · Multilingual keyboard and responsive QA

**Audit updated:** 2026-11-16 · **Scope:** visually inspectable physical keyboard previews, Normal/Shift labels, viewport ergonomics, documentation and source separation. This does **not** replace the source-authenticated 2019 Brahmi layout or claim native macOS keyboard installation.

## Why this changes the product

The primary pedagogical link remains **physical key → Unicode Brahmi → conventional isolated-sign IAST**, while the trainer preserves its **two large simultaneous lines** (Mac input and Brahmi result), the entire Phrase Atlas and the unchanged fixed-height five-row keyboard. Tiny attached cues aid recognition but must not supplant the large lines.

A small screen cannot physically display a full keyboard with intricate Devanagari, kana, Latin diacritics, Brahmi and modifier hints at desktop typographic sizes. The deliberate tradeoff is **fit by default**, preserving spatial memory of all rows, plus an optional **magnified/pannable inspection** mode with full source labels and accessible key details. Zoom persists as a local preference; opening it cannot change lesson scoring or input content.

## Source independence and verified scope

| Selected preview | Source and confidence | Normal/Shift behavior |
| --- | --- | --- |
| German Mac ISO | [Unicode CLDR 41 de-t-k0-osx](https://www.unicode.org/cldr/charts/41/keyboards/layouts/de.html) in `data/macos-german-iso-keycaps.json` | Complete 48-key documented reference |
| US Mac ANSI | [Unicode CLDR 41 en-t-k0-osx](https://www.unicode.org/cldr/charts/41/keyboards/layouts/en.html) in `data/macos-english-jis-keycaps.json` | 47 distinct letter, digit and symbol positions; remove the extraneous ISO key and locate Backslash on the upper letter row |
| Japanese JIS Romaji | [Unicode CLDR ja-Latn JIS reference](https://www.unicode.org/cldr/charts/48/keyboards/static/index.html) in `data/macos-english-jis-keycaps.json` | JIS-specific Shift labels; Shift+3 is #, **never the German §**; `Quote` Shift is * and `IntlYen` Shift is `|` |
| Japanese JIS Kana | `data/macos-jis-layout.json` keycap labels, plus annotated source | Printed Kana legend remains unchanged under Shift. This is **not** a prediction of live Japanese IME composition or voiced kana conversion |
| Native Mac Russian and Devanagari variants | [Unicode CLDR 41](https://www.unicode.org/cldr/charts/41/keyboards/) via `data/macos-extra-layouts.json` | Base/Shift previews as given by their independent charts; unverified Option/dead-key outputs are never invented |
| Russian ЙЦУКЕН reference | Existing standard **PC-style physical comparison**, not an Apple-native source | Conventional lowercase and upper/shift preview; explicitly marked reference rather than an authoritative macOS layout |

**Brahmi truth:** `data/macos-brahmi-reference.json` pins the 2019 Prachya Boonkwan macOS keymap (base, Shift, Option, Shift+Option). Neither keycap chart, new US ANSI arrangement nor keyboard zoom changes these Brahmi output layers. Control/Command preview browser shortcuts only; they do not produce fictional Brahmi Unicode. `brahmiToIAST` is educational transliteration, not a semantic or epigraphic proof.

## Visual acceptance criteria

1. Keycap *Normal* symbol must match the selected physical preview, not a hardcoded German symbol or upper-case placeholder. Alt/Option may show a shortcut label when its exact native output is unknown.
2. *Shift* layer must come from the selected layout's own documented reference; JIS must never fall through to German punctuation. Printed Kana under Shift must not be misrepresented as composed Unicode.
3. Full mode shows five rows without document-level horizontal overflow. Zoom mode scrolls **within the keyboard region only**, preserving the original two reading/input lines and the outer viewport width.
4. Physical layout controls remain accessible at 320×568, 375×812, 390×844, 768×1024, 844×390, 1280×720 and 1440×900. A short landscape viewport may need scrolling of the *training content*, never silently clip the source map.
5. Focus outlines, `aria-pressed` zoom state, accessible source/key inspector and separate meaningful `Mac`, `Brahmi`, `IAST` labels remain available for keyboard-only and assistive-tech use. Zoom is optional, not a forced accessibility feature.
6. Public homepage, catalog, project card and launch text describe the app as **multilingual**, without an exhaustive and inevitably stale list of specific languages in the general description. Explicit options remain available in language and layout selectors.

## Automated checks

- `scripts/verify_brahmi_cross_layout.py` compares runtime maps to canonical JSON, checks 47 US and 48 JIS positions, confirms source-independent Brahmi, correct current version and multilingual metadata, and runs `node --check`.
- `tests/browser/brahmi-responsive-multilingual.spec.cjs` checks both source maps, JIS Shift/# and Kana, the correct US ANSI physical arrangement, all layout previews, seven portrait/landscape/tablet/desktop viewports, horizontal zoom geometry, preference persistence, dual input and multilingual UI copy.
- Existing browser and source checks remain in release CI; **do not merge or publish if a gate fails**.

## Limitations and future empirical testing

Browser-rendered `KeyboardEvent.code` describes a physical position; `KeyboardEvent.key` comes from the currently active OS input source, which a web page cannot reliably change or always detect. Apple hardware variants, Option-dead keys, IME candidates and browser-reserved shortcuts require independent real-Mac Safari acceptance. The cited CLDR JIS reference is not the same as proof of each macOS input method. Automated accessibility/layout checks are necessary, not sufficient to claim a universal design optimum.

The learning hypothesis is that stable key positions, large immediate dual feedback, small contextual prompts and progressive disclosure reduce eye travel and improve retention. Proving that against alternatives requires opt-in learner studies, not a design superlative.

## v0.9.3 post-deployment visual correction

A read-only browser inspection of the actually published v0.9.2 identified a short-screen problem: magnified keys could visually extend below the fourth/fifth row, with the keyboard dock potentially pushing the main typing area out of the viewport. The inspector is therefore **bounded to at most min(36dvh, 310px)** and deliberately supports **both horizontal and vertical scroll axes**, with zoomed keys given enough height for three labels. Users can traverse to the bottom modifier row without abandoning the two primary typing tracks. This preserves the normal, spatially complete, five-row fit mode. Responsive Playwright checks must verify last-row scrollability on mobile portrait and short landscape, no document-level horizontal overflow, and unchanged typed input.
