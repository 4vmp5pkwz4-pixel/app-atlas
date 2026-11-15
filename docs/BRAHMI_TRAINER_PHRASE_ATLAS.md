# Brahmi Atelier 0.9 · Inline Phrase Atlas · specification and audit

**Scope:** Full phrase transliteration and physical chord comparisons **inside the typing trainer**, in a compact disclosure that does **not** steal the five-row keyboard dock's height.

## Intended learning journey

1. Open **Typing Trainer**. A compact **Phrase / Brahmi · IAST · Mac keys** disclosure is initially expanded above the exercise, inside its independently scrollable workspace. The five-row keyboard remains pinned to the bottom.
2. Its selector offers **Current exercise**, all ten historically referenced texts in `TEXTS`, and the twenty-five source-referenced quotations in `WISDOM_CORPUS`. These are the *existing* curated corpus records; no fabricated or unreferenced new inscriptions are added. Selecting a passage is **preview only**: score, timer and typed input are unchanged.
3. The full text appears in separate readable rows: (a) Unicode Brahmi, (b) conventionally decoded IAST from the **same function used in the converter**, and (c) the **complete physical Mac key sequence** from the **same Brahmi source-keymap reverse mapping as the converter**. Rows can scroll vertically for long passages; their DOM text is never abbreviated.
4. **Mac layout** can be changed directly in the phrase panel. This synchronizes the keyboard's `sourceLayout` and `saved.physical` so the whole page uses **one active layout**. Supported presets: German ISO QWERTZ, US English QWERTY, conventional Russian, native Mac Russian, Russian QWERTY/Phonetic, Devanagari Mac InScript, Devanagari Mac QWERTY, and Japanese Mac JIS.
5. The optional **Compare with** selector shows the same text as a fourth, independent key-sequence row on another layout. It does not change the active input layout. This comparison preference is stored locally, while the previewed historical passage is kept ephemeral to avoid unexpected exercise changes on reload. JIS romanji/kana follows the current explicit Japanese-mode switch.
6. Each key is a separate, keyboard-readable chip, showing `⇧`/`⌥` when the historical Brahmi source uses a modified layer; spaces display `␣`. Unmapped signs display `—` and are **never silently assigned invented key chords**.
7. **Practice passage** is an explicit action. It moves the selected passage into the actual typing exercise and resets the typing timer *only at this point*. Unsupported signs block the practice action, since the verified physical keyboard cannot type them. Long passages over 1,000 code points also remain read-only.
8. **Open converter** transfers the *entire* selected Brahmi text and active Mac layout to the existing full converter; it never loses the source phrase or changes the active training result merely by previewing.

## One set of invariants, not three separately maintained translations

| Layer | Source of truth | Transform | Never assume |
| --- | --- | --- | --- |
| Source phrase | Original trainer prompt, `TEXTS[].brahmi`, or `iastToBrahmi(WISDOM_CORPUS[].roman)` (same implementation as the converter) | `phraseSelectionData` | Exact archaeological facsimile from modern Unicode typesetting |
| Reading | `brahmiToIAST(text).text` | Identical to full converter | Semantic translation; exact reconstructed ancient pronunciation |
| First physical key line | `brahmiKeyChord` per Unicode code point | Exact same underlying keymap as `brahmiKeySequence` | That an Option or IME chord must produce the same final OS character |
| Second physical line | Same mapped source and selected second layout | Separate readonly comparison | That the comparison layout is installed or active on user's macOS |
| Actual exercise | `prompt`, `lessonMeta`, `mainPrefix()`, `renderLive()` | Only changed by `phrasePracticeSelected` | That changing visual layout alters the lesson or past scoring |
| Runtime source integrity | `data/macos-brahmi-reference.json`, `data/macos-german-iso-keycaps.json`, `data/macos-extra-layouts.json` | Pinned checks in CI | Historical evolutionary connection between Brahmi and QWERTY |

## Accessibility and premium interface criteria

- Exact label/selection associations and a native `<details>` control for mouse, keyboard and assistive technologies.
- All six interface variants (RU, DE, EN, JA, HI, experimental Brahmi-script) receive consistent labels and actions. Experimental Brahmi-script UI is a *teaching convention*, not a claim to reconstruct classical spoken Prakrit.
- The instructor keyboard remains five rows, and its fixed layout height does not change when the phrase disclosure opens or closes.
- Full text is visible on demand in independently scrollable rows, with no CSS `text-overflow:ellipsis` on source phrase or chord content.
- Current active typing target's next chord is highlighted in both layouts. Browsing other texts does not modify progress or produce fake active states.
- Selected source references link to existing published editions/collections. Language-specific meaning lines are **not** substituted for the original Roman source text.
- Data never leaves the local browser as a result of typing, choosing examples or converting. The only external navigation is an explicit user click on an editorial source link.
- Desktop and mobile Chromium tests assert full-source equality, all eight layout selections, optional comparison, one-click practice and converter handoff, unknown sign safety, six translations and zero keyboard-height regression.

**Known limits:** the abstract sequence is tied to the verified 2019 virtual Brahmi keyboard layout, not to a native Mac-installed Brahmi input source; actual Option outputs, dead-key composition, Japanese/Devanagari IMEs and browser-reserved shortcuts must be evaluated on macOS hardware. IAST represents conventional scholarly reading, not the text's translation.
