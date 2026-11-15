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
