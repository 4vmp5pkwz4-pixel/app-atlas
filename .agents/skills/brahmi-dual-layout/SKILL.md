---
name: brahmi-dual-layout
description: Develop and maintain the accessible RU/EN/DE macOS keyboard-independent Brahmi touch-typing studio with verified original four-layer mapping, synchronized source and Brahmi input, and rigorous visual and browser tests.
---

# Brahmi dual-layout trainer — durable project skill

## Immutable product contract
1. Any user may type with their normal **Russian, English (US QWERTY) or German (ISO QWERTZ) macOS input source**, **without switching to or installing Brahmi**. The separate installed Brahmi input mode is strictly optional.
2. **Top, editable line:** actual printed character from the user’s current OS keyboard input, obtained from `KeyboardEvent.key`. Never substitute a presumed QWERTY Latin character for actual Cyrillic input. Unicode output may be multi-codepoint (composition/dead keys); do not claim impossible exact detection of macOS input language.
3. **Bottom, read-only training line:** Brahmi Unicode derived from the same physical key **`KeyboardEvent.code`** and `shiftKey` / `altKey` (Option on Mac); independent from the OS input language. This line drives accuracy/progress/completion. Preserve a genuinely editable native Brahmi mode only when explicitly selected.
4. **Visual keyboard:** always show ALL FIVE complete rows and keys simultaneously INSIDE THE CURRENT VISUAL VIEWPORT at desktop and phone widths (including short landscape screens). Only the exercise above the keyboard may scroll; the keyboard may never be pushed below the viewport, cropped, horizontally scrolled or hidden. Each key shows the selected physical RU/EN/DE legend and its Brahmi output for the selected modifier layer. Use correct QWERTZ Y/Z positions, Ä Ö Ü ß and the extra ISO `IntlBackslash` and `Backslash` keys; Command/Option/Control/Shift keys must be recognizable.
5. Show **all four documented Brahmi layers**: Normal, Shift, Option, Shift+Option. Include a complete searchable/scrollable reference matrix, separate from the keyboard. **A source-map blank is blank; never fall back to Normal or other layers.**
6. Honor user-selected physical label preset. Browser pages cannot reliably identify the OS input source; changing the preset must not change macOS itself. The actual top-row input always reflects the key events even if the selected label preset differs. For Option dead keys and IMEs, show uncertainty rather than fabricating text.
7. Existing educational material, progress data, all historic inscriptions, user language RU/DE/EN, and working downloads are preserved through every update. Respect copyright and do not turn didactic transcription into a claimed stone facsimile.

## Primary source
- `data/macos-brahmi-reference.json` is machine-readable ground truth, **transcribed from Prachya Boonkwan's original MIT-licensed `Brahmi.keylayout`** and tied to its Git blob SHA.
- `docs/MACOS_BRAHMI_SOURCE.md` describes source indexes: 0 Normal, 1 Shift, 2 Option, 4 Shift+Option. Note that index 3 is Caps, not Shift+Option.
- Verify 48 physical keys per layer. Examples: base `KeyQ → 𑀅`; Shift `KeyQ → 𑀆`; Option `KeyA → 𑀹`; Shift+Option `KeyI → 𑀈`. Many Option keys are deliberately empty.
- The source's unmodified Space is U+2002 EN SPACE. Keep the source record faithful, but explicitly normalize to U+0020 for the lesson engine.
- Updating a map demands renewed inspection of an exact upstream version, visible provenance, licensing review and test snapshots.

## Ergonomics and teaching method
- Progressive touch-typing curriculum: **home row → neighbouring keys → Brahmi dependent vowels → independent vowels → Shift → Option → Shift+Option → combinations → authentic words and sentences → historical passages**.
- Begin with unhurried, explicit finger-key mapping and on-screen prompts. Encourage F/J tactile home markers, minimal hand and wrist travel, and regular micro-breaks.
- Use adaptive high-error-key repetitions, spaced retrieval across sessions, interleaved practice and self-monitoring of accuracy. Preserve separate speed (characters/min), precision, error count and elapsed time.
- Recommend approximately 96% accuracy as this app's **pedagogical target**, not an evidence-proven universal optimum; accuracy improves practice quality before speed increases. Never promise one method is scientifically best for every person.
- Give detailed finger hints and optional visually hidden cues, not compulsory blind mode. Provide an assisted route for users without physical keyboards. Prevent user data leakage: progress stays in localStorage unless user explicitly exports it.
- Historical material must retain Prakrit, scholarly provenance, three translations and explicit editorial/Unicode reconstruction caveats.

## Implementation/review checklist
- Stable DOM: `#germanMirror` editable physical-source textarea, `#typingInput` derived Brahmi output textarea, `#sourceLayout` 3-way preset, `[data-layer]` four-way Brahmi state, `#mapTable` complete matrix.
- Use `event.code` for canonical Brahmi mapping; use `event.key` for actual source characters; respect `altKey` / `shiftKey`. Store only optional non-sensitive observed key labels per user-selected preset.
- Guard Tab/Command/Control shortcuts; do not globally capture keystrokes. Handle Backspace, Space, Shift and both Option layers. Distinguish no-output source map from a disabled key.
- Use Unicode code-point accounting for training and grapheme clusters for Brahmi shaping. Validate IME/dead-key limitations explicitly. Test reset, focus and lesson transitions.
- Run and retain: `python3 scripts/verify_brahmi.py`, `python3 scripts/validate.py`, `npm run test:browser` (desktop and mobile Chromium), and verify website/download archives. Run Safari manually on macOS if possible.
- Regression cases: at 320, 375, 390, 768 and 1440 px no keyboard clipping; RU `KeyA` actual `ф` and Brahmi `𑀸`; EN `KeyA` `a`; German ISO special keys; base/Shift/Option/Shift+Option Brahmi; empty Option output; dead keys; backspacing both fields; saved progress, offline HTML, language switch.
- Block releases if tests fail; keep source map, skill and workflows current together.

## Improvement discipline
Every future request: classify requirements and sources; preserve invariant behaviors; implement in the same commit as regression tests and documentation; review failures against evidence; publish only after CI success. Do not drop features or claims without explaining why.

## Unbreakable viewport and premium UI contract (Nov 2026)
- The `#page-train` view is an isolated `100dvh` grid. `#trainerWorkspace` is a separately scrollable teaching area; `#keyboardDock` reserves screen space at the bottom for all five keyboard rows **at the same time**. Do not revert to the long document flow that previously left most of the keyboard below the fold.
- All actual key rectangles (not only DOM elements), all five rows and the complete keyboard must remain within viewport bounds, and the lesson must retain at least 40 CSS px. The keyboard must have no horizontal scroll; on portrait and landscape, the workspace may scroll without moving the dock.
- Preserve geometry regression tests in `tests/browser/brahmi-typing.spec.cjs` for `320×568`, `360×640`, `375×667`, `390×844`, `430×932`, `667×375`, `844×390`, `768×1024`, `1024×768`, `1312×1172`, `1440×900`, `1920×1080`. Browser screenshots from representative viewports must remain available.
- Prioritize keyboard visibility over labels and surrounding chrome on short screens. Use responsive key height driven by BOTH viewport width and height. Do not hide a row or substitute horizontal swipe scrolling. Use a compact sidebar only where it fits.
- Visual direction: futuristic luxury with midnight graphite, restrained emerald/jade and champagne-gold, high-fidelity keycaps, subtle glass surfaces and precise typography. Maintain legibility, WCAG-minded contrast and keyboard-focus affordances.
- Source input and generated Brahmi lines must remain intact (RU/EN/DE macOS physical typing, no Brahmi installation). When a native touchscreen keyboard would cover the trainer, the full clickable in-app keyboard takes priority; document input-method limitations.
- Any layout change must pass all geometry, functionality and source-mapping checks BEFORE release. Actual physical Safari and hardware behavior still require human verification.
