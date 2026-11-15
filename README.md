# APP ATLAS · Interactive Explorations

[![Validate catalog](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/validate.yml)
[![Browser tests](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/browser.yml)
[![Live site health](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml/badge.svg)](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/workflows/health.yml)

**[Open APP ATLAS](https://4vmp5pkwz4-pixel.github.io/app-atlas/)** · **[Download latest v0.5.0 beta](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.5.0-beta)** · [All source repositories](https://github.com/4vmp5pkwz4-pixel?tab=repositories)

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

- Download single HTML applications and prepared itch.io ZIP packages from the [GitHub Release](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.4.0-beta).
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

## Universal Mac keyboard-independent Brahmi Atelier · v0.3.1-beta

Brahmi Atelier now accepts typing from existing **Russian ЙЦУКЕН, English US QWERTY, or German ISO QWERTZ macOS input sources**, without installing a Brahmi keyboard or changing the macOS input source. In the default mode, the editable top line records the OS input character (`KeyboardEvent.key`), while the read-only second line shows the Brahmi character derived from the corresponding physical key (`KeyboardEvent.code`) using the original Prachya Boonkwan 2019 four-layer mapping (Normal, Shift, Option, Shift+Option). The app has 24 lessons, dedicated modifier practice, interleaving, heuristic 1/3/7/14-day spaced review and Prakrit inscription lessons. Physical source-layout presets only alter on-screen labels; browsers cannot reliably infer the currently active OS keyboard source.

**[Verified standalone HTML and itch.io ZIP download · v0.3.1-beta](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.4.0-beta)**. This beta passed **48 desktop/mobile Chromium Playwright checks**, four-layer source validation and Pages deployment. Actual Mac Safari hardware input, dead keys and accessibility still warrant device testing.

Developer preservation: [Brahmi AI-agent skill](.agents/skills/brahmi-dual-layout/SKILL.md) · [Mac source mapping](docs/MACOS_BRAHMI_SOURCE.md) · [Learning method evidence](docs/TYPING_LEARNING_EVIDENCE.md) · [Release acceptance checklist](docs/BRAHMI_RELEASE_CHECKLIST.md).

### Premium always-visible Brahmi keyboard · v0.3.2-beta

The redesigned training view keeps all five physical Mac keyboard rows in a reserved bottom dock while the lesson and RU/EN/DE-to-Brahmi dual typing fields scroll independently above it. Screen widths/heights and landscape are guarded by geometry tests at twelve viewport sizes. [Evidence and safeguards](docs/KEYBOARD_VIEWPORT_QA.md) · [Download fixed standalone HTML](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/download/v0.4.0-beta/brahmi.html).

## Japanese Mac JIS + Brahmi-script interface

The standalone **Brahmi Atelier** now offers five interface locales: **Russian, German, English, Japanese and experimental modern Pāli-inspired microcopy in Unicode Brahmi script**. It has four independent physical keyboard presets, including a complete **Japanese Apple JIS layout** with 英数/Kana, ¥, ろ, Fn and punctuation positions, plus Kana/Romaji legend previews. The upper field keeps native Japanese IME composition while Brahmi follows physical key positions in the lower field. Some JIS-only keys have no source-authenticated Brahmi output; none is invented. The entire five-row keyboard remains permanently visible, including on short landscape screens.

**Historical accuracy:** Brahmi is a script, not a language. The script-only UI is modern editorial teaching material, *not* a historical inscriptional Prakrit translation. Read [Japanese/Brahmi provenance and limitations](docs/JAPANESE_JIS_AND_BRAHMI_SCRIPT.md) or the [persistent AI skill](.agents/skills/brahmi-dual-layout/SKILL.md). Production macOS Safari and a physical Japanese JIS Mac keyboard still need on-device input-method testing; Chromium cannot prove exact native IME behavior.

### Japanese Mac JIS and Brahmi-script interface · v0.4.0-beta

Five user-interface languages: Russian, German, English, Japanese, and an experimental modern Pāli-inspired interface rendered in Unicode Brahmi. Japanese Apple-style JIS physical keyboard includes 英数, かな, ¥, ろ, Fn, additional punctuation keys, and Romaji/Kana keycap preview. Mac Japanese IME composition is preserved in the source field while the second field generates Brahmi from physical key positions; the original Brahmi source has no verified output for Japanese-only extra keys. A full five-row keyboard remains visible on the screen. **48/48 Chromium desktop/mobile tests passed** in the [v0.4.0 release run](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/runs/43714306634). [Standalone HTML download](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/download/v0.4.0-beta/brahmi.html). See [Japanese JIS source, Brahmi-script editorial disclaimer and IME limitations](docs/JAPANESE_JIS_AND_BRAHMI_SCRIPT.md). Real Japanese Mac hardware and Safari input methods still require device validation.

### Complete key illumination + Brahmi reverse-conversion studio

All five keyboard rows still fit permanently in the training viewport, now with high-contrast held/release highlighting for **Space, Shift/Option/Command/Control, Tab, Enter, Backspace and Japanese JIS-only keys** as well as letters. A new dedicated **Convert ⇄** section accepts pasted Brahmi text and outputs **IAST scholarly transliteration** and separately **authentic physical Mac key chords** for DE/EN/RU/JA, with a four-layout table, explicit unsupported signs, offline copy controls and direct links from actual Ashokan inscription texts. This distinction prevents confusing transliteration of ancient languages with keyboard position labels. All 5 UI locales remain supported. See [scientific and test notes](docs/BRAHMI_CONVERTER_AND_KEY_FEEDBACK.md). Firmware-reserved shortcuts and physical Safari input still need on-device verification.

### Verified v0.5.0-beta delivery · 15 November 2026

- [Release v0.5.0-beta](https://github.com/4vmp5pkwz4-pixel/app-atlas/releases/tag/v0.5.0-beta), including `brahmi.html`, an itch.io-ready ZIP and checksums.
- [66/66 passed in release-gating desktop and mobile Chromium acceptance tests](https://github.com/4vmp5pkwz4-pixel/app-atlas/actions/runs/43717056113).
- [Independent live browser QA](https://agent.tinyfish.ai/runs/4810fbd3-db46-4827-81a3-7cf4cd19ab13) confirmed five full rows, highlighted Space/Shift/Option/Backspace/Enter/Command/Control and JIS special keys, live reverse conversion and all four Mac layouts.

This evidence is **browser-level**, not a guarantee that macOS Safari will emit key events for firmware Fn or every reserved Command shortcut. The virtual keyboard feedback can be verified even when macOS intercepts physical keys.
