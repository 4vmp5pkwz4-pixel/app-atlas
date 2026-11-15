# Brahmi Atelier — permanent full-keyboard viewport QA

## Root cause
On a 1312×1172 screen, earlier Brahmi Atelier showed only the first keyboard row at the screen's bottom. The keyboard followed a tall exercise card in ordinary document flow. Making it responsive by width alone did not correct the vertical clipping.

## Corrected layout
- The training view is confined to the browser's dynamic viewport height (`100dvh`), with an independently scrollable `#trainerWorkspace` and a permanently allocated `#keyboardDock` beneath it.
- All five keyboard rows are fully visible at once. Key height adapts to viewport height and width; no horizontal keyboard scrolling is used.
- The source-layout selector and four Brahmi modifier layers stay visible. The expandable full source matrix lives in the scrollable workspace and therefore cannot push the keyboard off screen.
- The design uses midnight-graphite and jade/champagne-gold glass-inspired surfaces, subtle borders and tactile keycaps without compromising visibility.

## Validation evidence
The successful <https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/runs/43711109006> run reported **38 passed**, including mobile and desktop Chromium. Tests inspect every individual key and row rectangle at 12 viewport sizes:
320×568, 360×640, 375×667, 390×844, 430×932, 667×375, 844×390, 768×1024, 1024×768, 1312×1172, 1440×900, 1920×1080.
The test also scrolls the lesson panel and verifies the keyboard position remains constant. Representative screenshots were saved in the Playwright artifact.

**Scope:** Chromium emulation and screenshots are not a substitute for an independent check on physical macOS Safari, iPhone Safari, unusual accessibility zoom, dead-key/IME behavior, or system keyboard overlays. Those require separate device acceptance.

## Release gate
Do not publish future layout changes without passing `python3 scripts/validate.py`, `python3 scripts/verify_brahmi.py` and `npm run test:browser`. Do not weaken the viewport geometry tests to hide regressions.
