# Brahmi Atelier v0.9.1 · dual-track learning cockpit

## What changed in v0.9.0 and why the layout needed correction

The substantial v0.9.0 release introduced an **Inline Phrase Atlas** with current lesson, ten authenticated historical teaching items, 25 referenced quotations, Brahmi and academic IAST, sourced Mac physical chords, eight keyboard presets and optional second-layout comparison. It also preserved the two older input controls: `#germanMirror` (what the user presses on the Mac) and `#typingInput` (the resulting Unicode Brahmi). However the initially expanded Phrase Atlas was inserted **before** the primary exercise and presented three or four wide text rows vertically. The resulting scroll cost obscured the pedagogically most important immediate stimulus–action–result relationship, especially on smaller screens.

A read-only browser audit of published v0.9.0 observed the two inputs at approximately 373px/453px on 1440×900, but estimated an extra 150–220px of default expanded atlas content and reported a serious compact/mobile visibility problem. Values are browser-agent approximations, not precision instrument measurements.

## Priority and hierarchy

**Primary:** preserve two large, simultaneously legible, operational lines:
1. `#germanMirror` — real input in the user's selected Mac physical layout.
2. `#typingInput` — automatically produced Brahmi Unicode.

**Secondary and directly attached:** an inline **upcoming physical-chord ribbon** in the Mac input's existing header, and a source-derived **whole-exercise IAST micro-ribbon** within the Brahmi output header. No additional tall block underneath the two main fields. The active chord moves as the learner types; previous chords fade. Scoring, timers, editable fields and typing history remain unchanged. Blind practice hides all such hints. All source and transliteration functions are reused; no new guessing or invented shortcut mapping.

**Reference / investigation:** keep the complete v0.9.0 Phrase Atlas expanded and available, but in a bounded right-hand sidecar on wide desktop views. Its two major reading lines (full Brahmi and full IAST) share the left column while small mapped physical-chord chips occupy a narrow right column; optional comparison uses a compact second chip group rather than introducing another full-width row.

**Small screens:** show both main input rows **before** the reference atlas; the micro-cues stay in the headings of the original rows. The full atlas remains below the primary exercise in the independently scrollable lesson workspace, while the original five-row physical keyboard stays in its separate permanent dock. A very short phone landscape orientation has finite available height and may still require scrolling; the app must not promise simultaneous full-page visibility beyond the physical pixel budget.

## Pedagogical principles

- **Immediate feedback / minimal eye travel.** What the learner types and the Brahmi result stay together; micro-cues are adjacent, not three separate blocks away.
- **Progressive disclosure.** Full source texts, alternate layout, links and rare characters remain available in the expanded atlas/converter, but do not block everyday typing.
- **Visual hierarchy.** Main data remains readable at the previous textarea size; IAST and physical cues use low-footprint, lower-contrast labels, with the *next* chord marked visibly.
- **Learning rather than copying.** Hints disappear when blind mode is enabled; all main controls remain keyboard-accessible.
- **Cross-script accuracy.** IAST is the converter's `brahmiToIAST(prompt).text` and cannot be assumed to align one-to-one by code point with each Brahmi consonant/vowel grapheme. Mac micro-chips are source-authenticated `brahmiKeyChord()`, not an ad-hoc per-language romanization.
- **No interference.** A preview of a historical text in the Atlas never changes typed input or scoring until the learner explicitly chooses to practise it.

## Invariant implementation

- `renderCompactCue(position)` reads `prompt`, `mainPrefix()`, the current `saved.physical` and `saved.jaPreview`; it only updates `#liveMacRail` and `#liveRomanRail` and does **not** write `#germanMirror`, `#typingInput`, `prompt`, timer or error counts.
- `renderLive()` calls `renderCompactCue` with the same source-codepoint progress position as `highlightPhraseProgress`.
- `renderPhraseLab()` still uses the same converter and corpus functions; the only additional layout flag controls compact placement of the optional second source-key view.
- `trainer-workspace > .exercise` precedes `#trainerPhraseLab` in source DOM order (correct keyboard/screen-reader order), and CSS positions them side-by-side at larger viewports. At ≤1150px the exercise precedes the full Atlas.
- Fixed five-row keyboard dock dimensions, existing lesson progression, all six UI languages and every original mapping source remain unchanged.

## Checks before publishing

`scripts/verify_brahmi_dual_cockpit.py` checks source markup order, two unchanged input identifiers, two integrated cue holders, independent source and version. `tests/browser/brahmi-dual-cockpit.spec.cjs` checks geometry and live data in desktop/mobile Chromium, active chord tracking, blind-mode behavior, source-layout changes and exact corpus preview compatibility. Existing phrase atlas and trainer tests must continue to pass without removal.

For a scientifically useful future iteration, study task completion time, error rate, gaze travel and retention in actual learners across the old v0.9 layout and this compact layout. The current usability rationale is evidence-informed but not an experimental claim of measured learning superiority.
