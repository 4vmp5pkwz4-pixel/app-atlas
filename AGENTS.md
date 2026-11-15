# APP ATLAS · Working rules for coding agents

This public repository hosts several independent applications. Never expose the private Lean repository or connected-account secrets.

For every change under `apps/brahmi/` **read [the persistent Brahmi agent skill](.agents/skills/brahmi-dual-layout/SKILL.md)** and the original [macOS source map documentation](docs/MACOS_BRAHMI_SOURCE.md) first. The skill applies to both new features and bug fixes.

Before merging/publishing any changes, run:
```bash
python3 scripts/validate.py
python3 scripts/verify_brahmi.py
python3 scripts/package.py
npm install --no-audit --no-fund
npx playwright install chromium
npm run test:browser
```
Do not claim successful browser verification from syntax checks alone. Never silently replace the canonical four-layer Mac Brahmi map. If verification fails, fix issues rather than disabling regression checks.

APP ATLAS is deployed through GitHub Pages, and GitHub Actions publishes downloadable artifacts. Private repositories and personal data must never enter the public site or release archives.

**NON-NEGOTIABLE LAYOUT INVARIANT:** In Brahmi training mode, all five Mac keyboard rows must always fit in the visible viewport. Only the teaching panel may scroll; the keyboard dock must never move, crop, or require horizontal scrolling. Every style change must pass 12-size geometric Playwright QA (see `docs/KEYBOARD_VIEWPORT_QA.md`).

**Five-language Japanese/JIS extension:** Consult `docs/JAPANESE_JIS_AND_BRAHMI_SCRIPT.md`, use `data/macos-jis-layout.json` as verified JIS model, preserve full keyboard, IME composition, Japanese lessons and the modern (not historical) Brahmi-script interface. Never claim Brahmi is a single spoken language.

**Brahmi Atelier: all keys illuminate and reverse conversion:** Read `docs/BRAHMI_CONVERTER_AND_KEY_FEEDBACK.md`. Never break keydown/keyup feedback for Space, all modifiers, system keys and JIS extras. Keep the separately accessible Unicode Brahmi→IAST→DE/EN/RU/JA physical-key converter. Use authentic source layers; don't fake unmapped signs or claim that OS IME/Option output equals visible physical legends. Preserve offline/privacy and five-row visibility regression tests.

**Visible release number and sourced rotating wisdom (non-negotiable):** Keep the app's version badge visible in every viewport, including typing mode, synchronized with `data/brahmi-release.json`. The converter's source-linked 25-entry `data/brahmi-wisdom.json` corpus must match embedded offline `WISDOM_CORPUS`, preserve separate Ashokan Prakrit and Dhammapada Pāli sources, clear editorial-restoration notes, anti-repeat selection, and user-locale meanings. Read `docs/WISDOM_CORPUS_AND_VERSION.md` before changes. No fabricated ancient quotations or unsupported claims of historical glyph exactness.
