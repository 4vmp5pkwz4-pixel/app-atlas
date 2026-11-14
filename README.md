# APP ATLAS

A growing, multilingual collection of independent interactive learning tools, scientific explorers and digital experiments.

**Languages:** Russian, English, German  
**Maintainer:** [4vmp5pkwz4-pixel](https://github.com/4vmp5pkwz4-pixel)

## Project hub

The public catalog is served by `index.html`. It reads `catalog.json`, which contains only projects intended for public access. Four external apps link to GitHub Pages deployments; Brahmi and Buddhabrot portable editions run directly inside APP ATLAS.

- **Brahmi Atelier:** Offline-capable touch-typing trainer for the ancient Brahmi script.
- **Buddhabrot portable edition:** A second self-contained runnable HTML application, mirrored from the owner’s public Buddhabrot repository.
- **NORMA:** Interactive database-normalization studio.
- **Buddhabrot:** 4D-to-3D volumetric fractal explorer.
- **HCC:** S³ interactive scientific atlas.
- **HOPF OmniAtlas:** Research-oriented geometric and physical visualizations.
- **UPRS Möbius–Hopf:** Self-contained scientific instrument.

Existing scientific repositories remain separate and are only linked. The private Lean repository is deliberately excluded.

## Publish the site

GitHub repository **Settings → Pages → Deploy from a branch → main → / (root) → Save**. The expected address is `https://4vmp5pkwz4-pixel.github.io/app-atlas/` after GitHub Pages becomes active. A live URL must not be claimed until verified.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` from this repository's root.

## Repository structure

- `index.html` — accessible, responsive RU/EN/DE catalog
- `catalog.json` — machine-readable public project metadata
- `apps/brahmi/index.html` — hosted stand-alone Brahmi trainer
- `apps/buddhabrot/index.html` — hosted portable Buddhabrot HTML explorer
- `assets/` — local visual assets
- `scripts/validate.py` — local/CI integrity checks
- `.github/workflows/validate.yml` — CI check on every change
- `docs/PUBLISHING.md` — publication and quality checklist

## Privacy and licensing

The catalog does not collect user accounts or use third-party analytics. Individual linked apps may have their own dependencies and privacy behavior. No explicit open-source license is granted by this catalog; choose a license before inviting reuse or redistribution. This repository does not copy code from linked projects.

Published status, links, educational claims and scientific descriptions must be checked independently before each release.
