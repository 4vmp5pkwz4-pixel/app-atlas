# GitHub discoverability and repository hygiene

APP ATLAS is the central project hub, not a replacement for independently developed scientific repositories.

## Manual account-level settings not exposed by the current ChatGPT GitHub connector

- Pin **app-atlas**, **HCC**, **Normalisierung**, **Buddhabrot**, **HOPF-OmniAtlas** and another public favorite from the profile's **Customize your pins**.
- Add a clear public profile bio and a link to https://4vmp5pkwz4-pixel.github.io/app-atlas/
- Add appropriate repository topics (e.g. `interactive-learning`, `webgl`, `scientific-visualization`, `brahmi`, `database-normalization`) only where genuinely relevant.
- Consider a GitHub profile README repository named exactly `4vmp5pkwz4-pixel` if you want a profile landing page; creating a new repository requires account-side access not exposed through this connector.
- Enable GitHub Discussions only if you are ready to maintain it; Issues already support bug reports and suggestions.
- Do not change private/public visibility automatically.

## Existing repository default branches

- `Normalisierung` currently defaults to `claude/exciting-bohr-lhrume`.
- `Buddhabrot` currently defaults to `claude/3d-buddhabrot-explorer-v10m6m`.

These are not necessarily wrong, but long-lived publication workflows typically benefit from a stable default branch such as `main`. Verify branch contents, CI, Pages source, and pending PRs before any change. **Do not rename or merge blindly.**

## Promotion principles

- Publish working demos rather than only screenshots.
- Give each app a specific searchable title and a stable landing-page URL.
- Keep source, license, download and live demo distinct.
- Record real validation evidence, avoid inflated performance/scientific claims.
- Use releases for permanent downloadable versions; Action artifacts are temporary.
