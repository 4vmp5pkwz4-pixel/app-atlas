# itch.io API publishing · prepared

The optional **Publish selected HTML app to itch.io** workflow is installed. It does **not** run automatically and has never been given credentials.

To authorize a publication:
1. Create each app's HTML project on the correct itch.io account. The workflow cannot create itch.io pages.
2. Obtain a Butler/Wharf API key through the account's itch.io settings or `butler login`.
3. In GitHub repository **Settings → Secrets and variables → Actions**, create the encrypted repository secret `BUTLER_API_KEY`. Never paste the key into a chat, Issue or workflow file.
4. In GitHub **Actions → Publish selected HTML app to itch.io → Run workflow**, choose the app and type the exact existing `username/slug` target and desired version.
5. The workflow builds the app from canonical repository sources, validates the catalog, packages the chosen HTML and uploads via Butler. It uses a dedicated `itch-publishing` environment; you can add required reviewers to that environment.
6. On itch.io's project editor, choose **HTML Game** and mark the uploaded `html5` channel as **HTML5 / Playable in browser**. Verify embedded focus, permissions, mobile layout and public visibility before promoting.
7. Only after the store URL is publicly tested, add a verified link to the catalog.

The Butler manual confirms that the push command can accept a ZIP archive, and the browser-playable HTML status is configured on itch.io after the upload:
- https://itch.io/docs/butler/pushing.html
- https://itch.io/docs/butler/login.html
- https://itch.io/docs/creators/html5

**Security:** This is intentionally a manual workflow requiring a secret and an exact existing target. It does not automatically post to third-party accounts when source files change.
