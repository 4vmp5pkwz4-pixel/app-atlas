# German macOS ISO · visual and source-integrity audit

**Target release:** Brahmi Atelier v0.8.2-beta · **Date:** 2026-11-15.

## Observed defect and correction

The earlier virtual keyboard made the Mac label a low-priority 7–12 px element while Brahmi could be ~23 px. The German keyboard model also showed **A, Ä, Ö, Ü in uppercase even with Shift off**, and the generic Shift fallback was incomplete for some macOS-specific keys. The earlier visual inspection found no pervasive container clipping, but the normal character labels were not faithful to the selected input layer. A clean-looking layout is not sufficient if it represents the wrong symbols.

In v0.8.2 the **selected Normal character is large and high-contrast**; the verified Shift character is printed alongside it where viewport width allows. With Shift held the emphasis reverses. At very narrow widths (≤420 px) the secondary shift preview is intentionally suppressed to prevent unreadable stacked text, but the active Normal character remains visible and the physical Shift layer still works.

## Invariant chain: source → transform → display → input → QA

1. **Canonical hardware label data:** `data/macos-german-iso-keycaps.json` contains 48 Normal and 48 Shift mappings from the German macOS keyboard chart [Unicode CLDR 41, de-t-k0-osx](https://www.unicode.org/cldr/charts/41/keyboards/layouts/de.html). Its exact JSON is embedded as `MAC_GERMAN_ISO` in the offline HTML app. Physical key positions use `KeyboardEvent.code`, not language-dependent `event.key`.
2. **Verified output:** `physicalLayerLabel` uses the German source mapping for Normal/Shift. `macKeycapPair` selects the active symbol and its alternate. Browser key events and virtual Shift use the same function. A cached, user-observed key mapping may take precedence for an explicitly calibrated key, and is not silently presented as the source.
3. **Independent Brahmi truth:** the source-pinned four-layer 2019 `Brahmi.keylayout` remains in `data/macos-brahmi-reference.json`, without any changes. `charMap` selects a Brahmi glyph from this map, never by phonetic guessing or German letters.
4. **Independent IAST:** the third keycap row is an educational isolated-sign transliteration. The presence of a Latin mnemonic does **not** establish historical keyboard descent or exact pronunciation in 3rd-century BCE Prakrit.
5. **Reproducibility:** `scripts/verify_brahmi_german_visual.py` checks all 48 source key pairs, exact byte-equivalence of embedded and external JSON, the separation of German/Brahmi sources, and the project's demonstrative keycaps. `tests/browser/brahmi-german-visual.spec.cjs` checks every rendered key, Shift transitions, screenshots and desktop/mobile geometry.

## Examples (both legends visible on desktop)

| Physical ISO position | Normal | Shift | Independent Brahmi Normal |
| --- | --- | --- | --- |
| KeyA | a | A | 𑀸 (dependent ā) |
| KeyK | k | K | 𑀓 (ka) |
| BracketLeft | ü | Ü | 𑀾 |
| Semicolon | ö | Ö | 𑁉 |
| Quote | ä | Ä | 𑀗 |
| Digit3 | 3 | § | 𑁩 (Brahmi digit 3) |
| Backquote | ^ | ° | 𑁍 |
| Minus | ß | ? | source-controlled in original layout |

The keycap **primary** label reflects the selected character layer; this differs from a printed hardware-cap legend, which normally uses uppercase on alphabetic keys. Distinguishing the two prevents the misleading earlier representation.

## Visual/product design QA criteria

- **Semantics and correctness:** original keys are not labeled with imaginary output; Shift symbols are source-backed; Control/Command previews are non-printing. Option/dead-key/IME output remains uncertain without live macOS observation.
- **Legibility:** German physical glyph is raised above ancillary Shift glyph; Brahmi and IAST retain separate rows and distinct labels. Automated desktop tests require a readable primary size; narrow/mobile views prioritize normal input while keeping whole keyboard reachable.
- **Layout invariance:** five keyboard rows retained, no document-level horizontal overflow at representative laptop/mobile viewports. Separate Playwright desktop/mobile screenshots are emitted into test artifacts.
- **Brand continuity:** project detail page shares the trainer's understated emerald/jade, warm gold, typography, spacing and authentic source-backed keycap examples. Branding is not treated as a substitute for accessible focus states or accurate data.
- **Honesty about quality:** “premium” and “world class” are subjective; test evidence supports technical and visual consistency, **not** a verified global ranking or claim to be incomparable to all competing apps.

## Verifying on an actual Mac

Open **System Settings → Keyboard → Text Input → Edit → German**, or open Apple's Keyboard Viewer. Hold Shift and Option to inspect the real keyboard OS source. Compare against the app. If actual Apple output differs because of keyboard hardware, macOS version, dead keys, IME or source selection, save the observed result as an explicit calibration rather than modifying the canonical source.

Sources: [Apple Keyboard Viewer](https://support.apple.com/en-euro/guide/mac-help/mchlp1015/mac), [Unicode CLDR Mac German chart](https://www.unicode.org/cldr/charts/41/keyboards/layouts/de.html), [2019 original Brahmi Mac keyboard](https://github.com/kaamanita/brahmi).

**Limitation:** browser screenshot testing is not native macOS Safari testing. The final published page must be viewed visually after deployment; neither automated Chromium tests nor the reference chart alone proves every Mac hardware input combination.
