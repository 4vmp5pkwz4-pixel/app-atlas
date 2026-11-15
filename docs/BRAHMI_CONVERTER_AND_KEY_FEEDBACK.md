# Brahmi Atelier · complete key-press illumination and reverse transliteration

## 1. User acceptance contract

The training screen's complete five-row keyboard is permanently visible inside the viewport, with independent scrolling for the lesson above it. Every key is lighted when pressed, **including Space and non-printing/service keys**:

- **Modifiers:** left/right Shift, Option (Alt), Command (Meta), Control.
- **Editing/navigation:** Space, Backspace, Enter, Tab, CapsLock.
- **Japanese JIS:** Eisu `Lang2`, Kana `Lang1`, `IntlYen` (¥), `IntlRo` (ろ), Fn and Escape, in addition to alphabetic/numeric keys.
- **Both input channels:** actual hardware `keydown`/`keyup` and virtual keycap touch/pointer/click. The glow follows held and release states, persists through re-render and remains distinct from the selected Brahmi Shift/Option *layer*.

Do not claim a webpage can intercept firmware-level Fn or system-reserved Command shortcuts. Physical keys whose events never reach the browser cannot be highlighted from the operating system; clicking their virtual representations works. No global/background keyboard logging.

## 2. Dedicated “Convert” studio

Use the **Convert ⇄** tab (RU `Преобразование`, DE `Umwandeln`, JA `変換工房`; the fifth experimental localization is in Brahmi script). Paste Unicode Brahmi directly; the fields update live, locally, without any network requests.

- **Scientific IAST transliteration**, for example `𑀳𑀺𑀤 𑀩𑀼𑀥𑁂` → `hida budhe`. The algorithm interprets consonants' inherent `a`, independent and dependent vowels, virāma (suppressing the vowel), anusvāra and visarga. A standalone dependent sign is marked `◌`, not mistaken for a complete syllable; unsupported signs are explicitly bracketed `⟦...⟧`.
- **Physical Mac key combinations**, independently selectable for DE ISO QWERTZ / EN QWERTY / RU ЙЦУКЕН / Japanese JIS, including JIS Kana keycap preview. From the original Brahmi key map: `𑀳𑀺𑀤` → DE/EN `H I D`, RU `Р Ш В`, or Japanese Kana visual legends `く に し`. Shift/Option modifiers are displayed explicitly in chords. **These are key positions and keycap legends**, not guaranteed Unicode output from the OS source or from Japanese IME conversion.
- **Four-layout comparison table** for up to 160 glyphs visible at a time; the full selected layout sequence above includes all the user-provided text up to the input limit.
- **Unmapped signs** are shown as `—` in the key map; the original source's empty Brahmi modifier cells are not filled speculatively.
- Two **Copy** buttons for IAST and selected key combinations, with a fallback for offline/local HTML contexts.
- **Historical integration:** open any actual inscription from the Ancient texts section directly in the converter. Quick examples include the Lumbinī birthplace inscription and Girnār Major Rock Edict XII.

## 3. Scientific and linguistic limitations

**Transliteration is not translation.** It converts a Brahmi-encoded character sequence to conventional Roman letters using the supplied mapping; it does not determine whether the encoded historical text reflects Sanskrit, Pāli or a regional inscriptional Prakrit. Readers must use editions and original sources to evaluate damaged readings, archaic phonology, and editorial reconstructions.

Likewise, a keycap legend (such as Russian Р) is not an assertion about `event.key` produced by Option, dead keys, Mac Japanese Kana/Romaji conversion or third-party IMEs. Native macOS IME output varies by source, user settings, and composition. The only authenticated Brahmi output map is the four-layer original Mac `Brahmi.keylayout` documented in `docs/MACOS_BRAHMI_SOURCE.md`.

This mode does not upload pasted text or create persistent conversion records. Existing saved lesson progress remains separate.

## 4. Release gates

Run `python3 scripts/verify_brahmi.py`, `python3 scripts/validate.py` and `npm run test:browser`. Browser suite checks each physical and virtual pressed key, the Tab release/focus-change case, JIS-only keys, IAST consonant-vowel/virāma logic, unmapped characters, all Mac layout equivalents, five UI languages, clipboard copy, the historical text launcher, phone/landscape widths and five-row viewport geometry. Independently inspect rendered screenshots and physically verify macOS Safari, Fn/Command limitations, Japanese IME and tactile accessibility before claiming complete hardware support.
