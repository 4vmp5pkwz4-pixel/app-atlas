# Release quality gate for Brahmi Atelier

No new version is ready for public announcement until **all checks pass**:

1. Source verification: `python3 scripts/verify_brahmi.py` compares all four Mac Brahmi mapping layers with `data/macos-brahmi-reference.json`.
2. Catalog integrity: `python3 scripts/validate.py`.
3. Visual and browser acceptance: `npm run test:browser` covers desktop and mobile Chromium, RU/EN/DE labels, normal/Shift/Option/Shift+Option, real `event.key` echo, Backspace, ISO key positions and no horizontal clipping.
4. Browser test must assert app runtime initialization succeeded and report any page error, not infer success merely from HTTP 200.
5. Verify physical Mac Safari with German hardware while macOS text input is German, English or Russian; browser emulation cannot replace the physical test. Especially check Option/Shift+Option and dead keys.
6. Confirm Hebrew/Cyrillic/Prakrit source text has not been altered by general UI refactors. Retain source links, copyright notices and original Unicode tables.
7. Verify package output `brahmi.html`, GitHub release and public Pages demo; only then announce a new version.

If a check fails, fix the source, tests or provenance. Do not hide the failing job, weaken assertions, or announce the build as tested.
