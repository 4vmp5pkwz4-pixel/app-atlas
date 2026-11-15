# Brahmi Atelier v0.8.0-beta · Live Mac → Brahmi → IAST keyboard

## Scope

The trainer now shows the three distinct mappings **on the same physical key** by default:

1. **Top**: current physical Mac legend (German QWERTZ, English QWERTY, Russian, Japanese JIS, and both native Devanagari Mac views; physical position from `KeyboardEvent.code`).
2. **Middle**: Unicode Brahmi glyph *actually assigned* in the source-authenticated 2019 four-layer Prachya Boonkwan Mac Brahmi keymap. Unknown signs remain `—`.
3. **Bottom**: scholarly **IAST symbol label** (`𑀓 → ka`, `𑀔 → kha`, dependent `𑀸 → ◌ā`, `𑁆 → virāma`). This is a *didactic transcription of one glyph*, **not** a claim about the exact pronunciation of every ancient inscription.

An optional display selector provides **compare**, **Mac + Brahmi**, or **Mac + IAST** views, persisted alongside existing local trainer preferences. The default is **compare**, including for returning users who do not yet have this preference.

### Source-driven live modifiers

| Modifier | Physical press | On-screen press | Display and training behavior |
|---|---|---|---|
| **Shift** (⇧) | Changes visible legends while held; reverts on keyup | Toggles a sticky preview | Selects source-authenticated Shift Brahmi layer. |
| **Option** (⌥) | Changes visible legends while held; reverts on keyup | Toggles a sticky preview | Selects source-authenticated Option Brahmi layer. Physical Option Unicode output is unverified unless directly observed/calibrated. |
| **Shift+Option** | Both keys held | Either modifier toggled | Selects fourth source-backed Brahmi layer; absent assignments stay absent. |
| **Control** (⌃) | Key held | Sticky visual key toggled | Previews combination and common macOS text-editing shortcuts, **without inventing a Brahmi glyph**. |
| **Command** (⌘) | Key held, when accessible to browser | Sticky visual key toggled | Previews common macOS combinations (e.g., ⌘C, ⌘V); does **not** execute a system command or insert a Brahmi letter. |

Keycap legends, IAST and inspector update only when a modifier is pressed/released or the displayed layout changes. Ordinary keydown/keyup highlights pressed physical keys. Window blur and tab visibility reset the physical held-key state; on-screen sticky preview modifiers remain under user control. Reserved macOS/firmware events, Fn, secure input and some Option dead keys may not be delivered to the browser and are **not** guaranteed.

### Phonetic mnemonics versus historical evidence

For Latin layouts only, a subtle outline and bottom-label tint indicate whether the **first base Latin letter** of a Brahmi consonant's IAST label matches the *unmodified physical Latin key* (e.g., K ↔ 𑀓 ↔ ka). This is a mnemonic aid about a **modern** teaching layout, not evidence that ancient Brahmi historically influenced modern QWERTY or QWERTZ. Cyrillic, Devanagari, and Japanese Kana are **not** forced into a Latin score.

The full [phonetic atlas](../apps/brahmi/phonetic-atlas.html) continues to offer 115 Unicode signs, source coverage 106/115 and independently verified Keyman InScript ↔ Devanagari InScript 48-pair comparison. The UI also links to it directly from the converter.

### Accessibility and safety

- Each screen key exposes `aria-label` and a hover/focus inspector stating current code position, Brahmi glyph and IAST label or conventional shortcut preview.
- Key colors have additional textual labels; the language-neutral `IAST` notation remains visible.
- Escape all user-facing generated text. No runtime network calls for the key explorer; no keystrokes are uploaded or persistently logged.
- Preserve macOS native keyboard composition: **do not** call `preventDefault()` for Command/Control shortcuts or active Japanese/Devanagari IMEs. Browser rendering cannot reproduce OS-level Command/Control actions.
- The keycap rendering is responsive: larger 3-line keys for desktop and compact sizing for mobile and short viewports. No fonts bundled.

## Test and release gates

- `python3 scripts/verify_brahmi.py`: source-map fidelity, embedded JS syntax, manifest version.
- `python3 scripts/verify_brahmi_extended_locales.py`: native Mac Russian/Devanagari maps, six-language Hindi baseline.
- `python3 scripts/verify_phonetic_atlas.py`: complete Unicode and Keyman source audit.
- `npm run test:browser`: the regression suite and dedicated 8-test Key Explorer suite, on desktop and mobile Chromium.
- `scripts/package.py`: offline ZIP includes both trainer and atlas.
- `.github/workflows/release-brahmi.yml` publishes the version specified in `data/brahmi-release.json` on `main` only after all gates pass.

Physical testing on the user's real Mac is additionally advisable to verify actual Option/dead-key responses and OS-intercepted shortcuts; automated Chromium success alone is not that verification.

## Editorial clarification (v0.8.1-beta)

The title *phonetic* describes a modern typing mnemonic, not proof of ancient/modern letter-form identity or a reconstruction of spoken Prakrit. The visually paired K → 𑀓 → ka means **physical Latin key, Unicode Brahmi, conventional isolated-sign IAST**. A dependent vowel sign is displayed as an attachment (e.g., ◌ā), not an independent syllable. Shift+A does **not** introduce an independent new ā character in the pinned source; KeyA and Shift+KeyA both map to 𑀸. See [editorial audit](BRAHMI_EDITORIAL_AUDIT_20261115.md).
