# Distribution workflow · APP ATLAS

## Automatic downloads

Every commit to `main` runs **Build portable downloads**. The workflow produces:
- `dist/brahmi.html` and `dist/brahmi-itch-html.zip` (browser-ready, `index.html` at ZIP root)
- `dist/buddhabrot.html` and `dist/buddhabrot-itch-html.zip`
- `dist/app-atlas-website.zip` (complete static portal, 6 project pages and 2 hosted apps)
- `dist/SHA256SUMS.txt` for integrity verification

Download the artifact **app-atlas-downloads** from a successful GitHub Actions run. Workflow artifacts expire (30 days); permanent public downloads should be published as tagged GitHub Releases.

For a permanent release, create a repository tag such as `v1.0.0` pointing to a validated commit. The **Publish versioned downloads** workflow creates a GitHub Release with the ZIPs, standalone HTMLs and SHA-256 list. Do not create a tag for a broken build.

## Licenses in every distribution

Owner-controlled original catalog and Brahmi Atelier software are Apache-2.0; Buddhabrot is MIT. Retain LICENSE, NOTICE and THIRD_PARTY_NOTICES.txt. The Buddhabrot ZIP uses its MIT license at the archive root. Historical-text clearance and full asset review remain open; do not advertise all embedded material as commercially cleared until issue #2 is resolved. See [licensing audit](LICENSING.md). Existing versioned archives are unchanged.

## itch.io publication

1. Sign in to the correct itch.io account, create a new project, choose project type **HTML**.
2. Upload `brahmi-itch-html.zip` or `buddhabrot-itch-html.zip` from a validated release. Each contains `index.html` at its root.
3. Enable **This file will be played in the browser** if the app behaves correctly in itch.io's sandboxed iframe. Check fullscreen, keyboard focus, iPhone and Android.
4. Add verified title, clear description, screenshots, accessibility notes, privacy/contact information, app-specific license and third-party notices, canonical source repository and project URL.
5. Test the actual uploaded page and controls in an incognito window before announcing.
6. Repeat for each ready app. Complex multi-file and WebXR applications require project-specific packaging and testing.

## Product Hunt

Launch selected fully functioning applications individually only after completing the live-demo, screenshot and legal checks. Do not invent reviews, usage metrics or endorsements. A project can link back to its APP ATLAS detail page.

## Hugging Face Spaces

Use where an app actually demonstrates an ML model or a meaningful AI capability. Static HTML tools do not need Hugging Face. Deployment requires account credentials/permissions not granted by GitHub access alone.

## Release checklist

- [ ] App behavior tested on desktop and mobile
- [ ] Public URLs and downloads load
- [ ] No credentials, personal records or private source files
- [ ] Licensing and copyright of text, images and dependencies verified
- [ ] Metadata, screenshots, attribution and sources are accurate
- [ ] German Impressum and privacy compliance reviewed before promotion
- [ ] `Build portable downloads` and `Validate public catalog` passed
- [ ] Version tagged; downloadable release assets and checksums verified
