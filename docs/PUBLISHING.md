# APP ATLAS · Publication protocol

## First deployment

1. The `app-atlas` repository is public, with its root `index.html`.
2. In GitHub visit **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`, and save.
3. Wait for the first successful build, then manually verify the live site and Brahmi route on both desktop and mobile.
4. The expected address is `https://4vmp5pkwz4-pixel.github.io/app-atlas/` once Pages is enabled and published.
5. Run `python3 scripts/validate.py` before major changes; GitHub Actions also checks commits and PRs.

## Add an application

1. Decide whether it should have its own repository. Established apps should keep a separate source repository.
2. For a portable single HTML application, add `apps/<slug>/index.html` to this repo. Keep app-specific relative paths working.
3. Update `catalog.json` and the matching fallback JSON in `index.html` (the JSON contained in the `embedded-catalog` script element). The CI validator checks for exact equality.
4. Use `status: "live"` and `url` only after checking that the app really launches. For repository-only entries use `status: "repository"`, `url: null` and a public GitHub `source`.
5. Check mobile layouts, keyboard access, multilingual content, no broken resources, accurate scientific claims and actual download.
6. Prefer pull requests for code reviews. Do not force-push over active development.
7. Do not publish private repositories or private files. In particular, the private `Lean` repository is excluded.

## Licensing, safety and privacy

- Links to repositories are not permission to redistribute their code or images.
- No license is assigned by this catalog. Select an explicit license separately when appropriate.
- Before advertising a public web page in Germany, review **Impressum**, applicable GDPR information and third-party assets.
- The catalog has no analytics, login or server-side storage. Embedded/linked apps should be evaluated independently.
- Public historical/academic descriptions should include relevant source information.

## Other storefronts

- itch.io: package one app and its relative assets as a ZIP, choose the **HTML** project type, set playable-in-browser appropriately, and provide its GitHub link.
- Product Hunt: use an already functioning product landing page, screenshots and honest launch description.
- Hugging Face Spaces: consider for genuinely AI-powered demos, not as a requirement for every HTML site.

## External apps

The catalog offers live GitHub Pages links where existing deployment runs succeeded, plus a source ZIP archive for each public project. External live-page links should be checked after every related project release. The hosted `apps/buddhabrot/index.html` is a copy of the portable edition from the public Buddhabrot repository; its source of truth remains there, so refresh the mirror from the canonical source when necessary. Pages deployment success does not prove all browser features are functional.

## Discovery pages

Every catalog project has a trilingual, indexable page at `projects/<id>/`. Keep those pages, `catalog.json`, the offline JSON embedded in `index.html`, and `sitemap.xml` synchronized. Test the launch and ZIP links after each update.
