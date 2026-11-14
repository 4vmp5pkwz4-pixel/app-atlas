# Authoritative macOS Brahmi source and keyboard independence

Source: [Prachya Boonkwan, Brahmi Keyboard Layout for Mac OS X v1.0 (2019)](https://github.com/kaamanita/brahmi), original `Brahmi.keylayout`, Git blob `c7713fa598f12815a0ee363cb3abade7ad55bc88`, **MIT License**, copyright © 2019 Prachya Boonkwan. Preserve the upstream copyright/license notice with any distribution of the copied layout data. Mapping provenance is encoded in `data/macos-brahmi-reference.json`.

The source contains four relevant ANSI keyMap modifier indexes: 0 for unmodified, 1 for any Shift, 2 for any Option and 4 for Shift+Option. **Index 3 is Caps Lock, NOT Shift+Option**. macOS `Option` is reported as `KeyboardEvent.altKey` in the browser.

**Key correction:** original source assigns base `KeyQ → 𑀅`, `Equal → 𑀉`, `Minus → 𑀇`, `Comma → 𑀑`. Earlier simulator assumptions differed. Full matrices are included for all physical keys and four layers; missing outputs are empty, never silently inherited from base. Standard `Space` is U+2002 (en-space) in base source but normalized to U+0020 in the teaching app to maintain ordinary word spacing.

Physical keyboard layers are separate from Brahmi:
- `event.code`: physical key position, unaffected by user's OS input source.
- `event.key`: actual character sent by the user's active macOS layout and modifier state. Capture it when available for the **upper physical input line**.
- User-selected **RU / EN / DE** label presets visualize typical layouts; browser pages **cannot reliably discover a user's active OS input source**. The user can change the preset and see actual entered characters.
- `event.key = Dead`, IME composition, shortcut interception and OS-specific Option behavior cannot be assumed to be a printable character; indicate that exact output is unavailable and allow optional layout calibration.
- Native installed Brahmi keyboard remains an *optional* compatibility mode. Main practice works with an ordinary layout, without installing/switching macOS Brahmi.
- Never capture global keystrokes. Listen only when the training field is focused. Do not record passwords or sensitive text.
- On-screen key displays both current physical preset and the chosen Brahmi layer (base / Shift / Option / Shift+Option). Exact reference for Brahmi is always the source map; the physical preset for Option may be unknown until a key is actually pressed.

Sources:
- Apple Keyboard Viewer and modifiers: https://support.apple.com/guide/mac-help/write-in-another-language-on-mac-mchlp1406/mac
- W3C UI Events code: https://www.w3.org/TR/uievents-code/
- MDN KeyboardEvent.key: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

## Non-negotiable tests

Test all RU/EN/DE presets with the same physical codes, verify four distinct modifier layers, confirm no Brahmi installation is required, confirm actual Cyrillic `event.key` is preserved, Unicode Brahmi values follow source exactly, and keyboard does not crop at widths 320, 375, 768 and 1440 pixels. Test physical and virtual key clicks, Backspace, Space, Shift, Option, Shift+Option, text imports, progress scoring and the source reference.
