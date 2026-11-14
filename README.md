# APP ATLAS · Interactive Explorations

[![Validate catalog](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml)
[![Browser tests](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml)
[![Live site health](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml)

**[Open APP ATLAS](https://4vmp5pkwz4-pixel.github.io/app-atlas/)** · **[Download beta release](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.1.0-beta)** · [All source repositories](https://github.com/4vmp5pkwz4-pixel?tab=repositories)

An independent, mobile-friendly, multilingual catalog of interactive learning applications, scientific visualization tools and experimental web instruments. **RU · EN · DE.** The main catalog contains no analytics or login.

## Available projects

| Project | Run | Source |
|---|---|---|
| Brahmi Atelier · touch-typing | [Start](https://4vmp5pkwz4-pixel.github.io/app-atlas/apps/brahmi/) | [APP ATLAS](apps/brahmi/index.html) |
| Buddhabrot · 4D volumetric explorer | [Start](https://4vmp5pkwz4-pixel.github.io/app-atlas/apps/buddhabrot/) | [Buddhabrot](https://github.com/4vmp5pkwz4-pixel/Buddhabrot) |
| NORMA · database normalization | [Start](https://4vmp5pkwz4-pixel.github.io/Normalisierung/) | [Normalisierung](https://github.com/4vmp5pkwz4-pixel/Normalisierung) |
| HCC · S³ scientific atlas | [Start](https://4vmp5pkwz4-pixel.github.io/HCC/) | [HCC](https://github.com/4vmp5pkwz4-pixel/HCC) |
| HOPF OmniAtlas | [Start](https://4vmp5pkwz4-pixel.github.io/HOPF-OmniAtlas/) | [HOPF-OmniAtlas](https://github.com/4vmp5pkwz4-pixel/HOPF-OmniAtlas) |
| UPRS Möbius–Hopf | [Start](https://4vmp5pkwz4-pixel.github.io/UPRS-M-BIUS-HOPF/) | [UPRS-M-BIUS-HOPF](https://github.com/4vmp5pkwz4-pixel/UPRS-M-BIUS-HOPF) |

**Status transparency:** Four apps launch on their existing GitHub Pages sites; Brahmi and the portable Buddhabrot edition are hosted inside APP ATLAS. The Buddhabrot HTML is mirrored verbatim from its owner-controlled public repository; the daily health check detects source drift but never overwrites code automatically. The private **Lean** repository is intentionally excluded.

## Download, test and distribute

- Download single HTML applications and prepared itch.io ZIP packages from the [GitHub Release](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.1.0-beta).
- GitHub Actions builds fresh packages on every push to `main`. [See downloads workflow](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/downloads.yml).
- Before release: `python3 scripts/validate.py`; `python3 scripts/package.py`; `npm install && npm run test:browser`.
- Live HTTPS health checks are scheduled daily; browser acceptance tests run weekly and on demand.
- For local preview, run `python3 -m http.server 8000` in repository root and open `http://localhost:8000/`.

## Project organization

```text
index.html               Public app catalog
catalog.json             Canonical project entries (RU/EN/DE)
projects/<project>/      Indexable multilingual detail pages
apps/brahmi/             Portable Brahmi trainer
apps/buddhabrot/         Portable mirrored Buddhabrot HTML
assets/                  Frontend, styles and icon
scripts/                 Validation, packaging and link checks
tests/browser/           Playwright desktop/mobile acceptance tests
docs/                    Distribution, release and legal checklists
.github/workflows/       Validation, ZIPs, releases, health, browser tests
```

## Roadmap, issues, and safety

- [Issues and launch blockers](https://github.com/4vmp5pkwz4-pixel/app-atlas/issues)
- [Distribution guide](docs/DISTRIBUTION.md)
- [Publishing workflow](docs/PUBLISHING.md)
- [German legal-readiness checklist](docs/LEGAL_READINESS.md)

**Licensing:** No open-source license has yet been selected for this repository. Visibility on GitHub does not in itself grant redistribution rights for third-party materials. Confirm the rights to any bundled and historical content and complete applicable operator/legal information before wider promotion. Features in scientific demonstrators are not evidence of empirical validation.

## Brahmi Atelier keyboard architecture and durable agent skill

The Brahmi trainer works with normal **Russian, English and German macOS keyboards without installing Brahmi**. See [the persistent contributor/agent skill](.agents/skills/brahmi-dual-layout/SKILL.md), [upstream Mac source mapping](docs/MACOS_BRAHMI_SOURCE.md) and the [reproducible JSON map](data/macos-brahmi-reference.json). All future changes are guarded by a JavaScript/authoritative-map check and Playwright tests.
