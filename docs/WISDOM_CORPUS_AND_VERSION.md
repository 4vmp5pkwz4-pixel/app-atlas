# Verified wisdom, source integrity and visible version

## Release identity

The Brahmi Atelier app is released as **v0.6.0-beta**, visibly rendered as **v0.6.0 β** in its topbar. The version must be visible in **home, typing, converter, source library, guide, settings and progress**, including phone portrait and short landscape. Its machine-readable authority is `data/brahmi-release.json`. Build validation checks `APP_VERSION`, `#versionBadge` and the metadata together.

## Curated 25-item primary-source corpus

The converter includes **25 excerpts**:

- **12 excerpts from Aśoka's own Major Rock Edicts** (primarily Girnār, Edict XII, but also Edicts I, II and V), written in **inscriptional Prakrit**, based on Eugen Hultzsch's 1925 scholarly edition as hosted by [Indike / Pramāṇa](https://indike.org/pramana/inp.epigraphy.asoka.re.re12%2Agirnar). Passages about `vaci-gutī`, `samavayo`, respect for other traditions, charity, non-harm and concrete public works are explicitly labeled as Aśoka's words.
- **13 passages from the Pāli Dhammapada**, including Dhp 1–2 (mind), 5 (non-hatred), 160 (self-reliance), 183–184 (practice and patience), 204 (health and contentment), 223 (anger), 232 (speech), 276–279 (effort, impermanence, suffering and not-self). Source: [SuttaCentral's Pāli Dhammapada](https://suttacentral.net/dhp273-289/pli/ms). These are canonical Pāli verses and **not** inscriptions by Aśoka; they do not establish what wording the historical Buddha personally uttered.

Each item has: immutable ID, source group, verse/section reference, original **scholarly Roman transcription**, local **new interpretive RU/DE/EN/JA meanings**, a direct `https://` source link and any editorial note. The original scholarly brackets `[...]` remain in displayed transcription when the edition indicates uncertain or restored letters. The generated Unicode Brahmi text omits editorial brackets, so it is labeled a **modern didactic rendering**, not a facsimile of a third-century stone inscription.

Brahmi itself is a writing system, not one language; Prakrit and Pāli are different linguistic traditions. Reading the meaning of an inscription and mechanically transliterating a Unicode sequence are distinct operations. Do not fabricate passages, fabricate Brahmi-key mappings for JIS-only keys or present modern interpretive translations as exact ancient wording.

## Rotation behavior

`#convExample` (“Another passage ↻”) loads a new item from the genre selected in `#wisdomCategory` (all / Aśoka / Dhammapada). `#convAshoka` and `#convDhammapada` select their groups explicitly. A shared in-memory `WISDOM_HISTORY` avoids repeats across groups until all remaining items in the requested pool have been shown; a new cycle avoids immediate repetition of the last displayed item.

When the user edits the Brahmi source textarea manually, the active quote attribution is hidden to prevent incorrect provenance. The primary-source link opens in a separate tab with `noopener noreferrer`. All selection, conversion, copying and reading is **local/offline**: no user-input text is uploaded or tracked. The curated corpus is checked against `data/brahmi-wisdom.json` on every CI build and embedded in a standalone offline HTML.

## Scientific and ethical notes

“Greatest” is a subjective editorial choice, not a measurable historic or religious ranking. Choose passages for textual authenticity, philosophical depth and pedagogical variety. Distinguish original texts from editorial reconstruction and from paraphrases; Pāli verses should not be advertised as direct transcriptions of Aśoka's own voice. Source URLs serve as verifiable pointers, not an implied endorsement by source providers.

## Tests

Run `python3 scripts/verify_brahmi.py`, `python3 scripts/validate.py`, and `npm run test:browser`. Tests must cover every key and keyboard geometry, all 5 UI languages, source links, 25 source-linked data records and 4-language meanings, genre-specific no-repeat cycling, manual input attribution clearing, version badge visibility in mobile/landscape and mapping integrity. Publish only when CI is green.
