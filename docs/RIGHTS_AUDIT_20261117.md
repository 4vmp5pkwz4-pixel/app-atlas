# Historical text and third-party rights audit · 2026-11-17

Baseline: `541a9eea688ce5624fcaa37b4558909d425b33e2` (105 tracked blobs). Scope: APP ATLAS itself, the two hosted applications and the portable phonetic atlas, not separate linked repositories or previously issued release archives. See [machine-readable snapshot](RIGHTS_INVENTORY.json).

## Historical corpus

- 25 converter records (12 Aśoka and 13 Dhammapada); 16 historical-library entries including six XII segments and one composite. A record count is not a count of independent inscriptions.
- All 13 Pāli excerpts matched the corresponding verse in the SuttaCentral Mahāsaṅgīti root JSON after case, punctuation, whitespace and anusvāra normalization. Each source blob is recorded. Ancient root texts are public domain under [SuttaCentral licensing](https://suttacentral.net/licensing); [Bilara license](https://github.com/suttacentral/bilara-data/blob/published/LICENSE.md) also addresses its own translations. Local interpretive meanings are not claimed to be verbatim ancient translations.
- E. Hultzsch, *Inscriptions of Asoka*, CII I (1925), is public domain (author died 1927). [Wikimedia scan](https://commons.wikimedia.org/wiki/File:Corpus_Inscriptionum_Indicarum_Vol_1.pdf); [Archive.org original](https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch). Germany: [§64 UrhG](https://www.gesetze-im-internet.de/urhg/__64.html), [§70 UrhG](https://www.gesetze-im-internet.de/urhg/__70.html).
- [Bibliotheca Polyglotta](https://polyglotta.uio.no/index.php?bid=14&page=library) identifies 2014 digital input by Jens Braarvig and corrections by Matthew Milligan; it asserts rights in its texts. The software GPL does not license the text corpus. [Pramāṇa](https://indike.org/pramana/inp.epigraphy.asoka.re.re12%2Agirnar) distinguishes public-domain Hultzsch from copyrighted digital input. No commercial redistribution license for protectable modern additions established.
- Compared every independent Aśoka record to the scan-derived public-domain transcription witness at [Theosis Girnar](https://theosislibrary.com/library/verified-ashoka-edicts-girnar), [Rummindei](https://theosislibrary.com/library/verified-ashoka-edicts-rummindei), and [Bairat](https://theosislibrary.com/library/verified-ashoka-edicts-calcutta-bairat). Only capitalization, dot placement for anusvāra, spaces and hyphens normalized for the preliminary match; other differences not silently removed. The witness explicitly identifies the 1925 source but is not a direct inspection of the printed page. A screenshot request for the original [alternate scan](https://indianhistorybooks3.wordpress.com/wp-content/uploads/2014/04/99999990332476-corpus-inscriptionum-indicarum-vol-1-inscriptions-of-asoka.pdf) failed because of file-size limits. Do not describe the comparison as a completed diplomatic edition or rights clearance.

| Record | Context | Printed pages | Result |
| --- | --- | --- | --- |
| asoka-xii-i | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-xii-d | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-xii-e | wisdom | 20–22 | match after case/anusvara/spacing/hyphen normalization |
| asoka-xii-f | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-xii-g | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-xii-c | wisdom | 20–22 | match after case/anusvara/spacing/hyphen normalization |
| asoka-xii-j | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-v-b | wisdom | 9–11 | match after case/anusvara/spacing/hyphen normalization |
| asoka-ii-d | wisdom | 2–4 | variant or normalization beyond exact-match rule |
| asoka-i-b | wisdom | 1–2 | variant or normalization beyond exact-match rule |
| asoka-xii-n | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| asoka-xii-h | wisdom | 20–22 | variant or normalization beyond exact-match rule |
| dhp-1 | wisdom | Pāli verse 1 | matched public-domain Pali excerpt |
| dhp-2 | wisdom | Pāli verse 2 | matched public-domain Pali excerpt |
| dhp-5 | wisdom | Pāli verse 5 | matched public-domain Pali excerpt |
| dhp-160 | wisdom | Pāli verse 160 | matched public-domain Pali excerpt |
| dhp-183 | wisdom | Pāli verse 183 | matched public-domain Pali excerpt |
| dhp-184 | wisdom | Pāli verse 184 | matched public-domain Pali excerpt |
| dhp-204 | wisdom | Pāli verse 204 | matched public-domain Pali excerpt |
| dhp-223 | wisdom | Pāli verse 223 | matched public-domain Pali excerpt |
| dhp-232 | wisdom | Pāli verse 232 | matched public-domain Pali excerpt |
| dhp-276 | wisdom | Pāli verse 276 | matched public-domain Pali excerpt |
| dhp-277 | wisdom | Pāli verse 277 | matched public-domain Pali excerpt |
| dhp-278 | wisdom | Pāli verse 278 | matched public-domain Pali excerpt |
| dhp-279 | wisdom | Pāli verse 279 | matched public-domain Pali excerpt |
| lumbini | library | 164–165 | match after case/anusvara/spacing/hyphen normalization |
| lumbini2 | library | 164–165 | match after case/anusvara/spacing/hyphen normalization |
| bairat | library | 172–174 | variant or normalization beyond exact-match rule |
| harmony | library | 20–22 | variant or normalization beyond exact-match rule |
| speech | library | 20–22 | variant or normalization beyond exact-match rule |
| respect | library | 20–22 | variant or normalization beyond exact-match rule |
| many | library | 20–22 | variant or normalization beyond exact-match rule |
| well | library | 2–4 | variant or normalization beyond exact-match rule |
| medicine | library | 2–4 | variant or normalization beyond exact-match rule |
| edict12-d | library | 20–22 | variant or normalization beyond exact-match rule |
| edict12-e | library | 20–22 | match after case/anusvara/spacing/hyphen normalization |
| edict12-f | library | 20–22 | variant or normalization beyond exact-match rule |
| edict12-g | library | 20–22 | variant or normalization beyond exact-match rule |
| edict12-h | library | 20–22 | variant or normalization beyond exact-match rule |
| edict12-i | library | 20–22 | variant or normalization beyond exact-match rule |
| edict12di | library | 20–22 | derived from six pending segments d–i |

Examples requiring scholarly attention: Girnar XII i has samavāyo in the 1925 witness, while the app uses samavayo; the witness uses vachi/cha/kochi rather than the app's vaci/ca/koci convention. Bairat includes restored letters and an additional word se in the witness. These are not copyright infringement findings; they are reasons not to assert exact Hultzsch provenance until reconciled. Preserve both original readings and editorial conventions in the eventual comparison. Next action: re-transcribe from printed pp. 1–4, 9–11, 20–22, 164–165, 172–174 or obtain written permission, synchronize JSON/embedded corpus/lesson data and run tests. No historical reading changed during this audit.

## Runtime assets and dependencies

The complete runtime file set at the baseline was inspected (catalog HTML, three hosted HTML pages, six detail pages, four asset files). It contains one local SVG icon and no separate font, photo, video, audio, binary, library or WebAssembly files. The Buddhabrot inline SVG favicon is data-URI artwork; source mirror previously matched upstream. No remote script/CSS, font-face, iframe or other embedded media import identified in the static scan. Catalog fetches its own catalog.json. System-font names (Noto, Segoe, Inter, Georgia, Kohinoor, etc.) select installed fonts; no font files redistributed. A font download link is not a bundled font.

| Component | License / treatment |
| --- | --- |
| Owner-controlled catalog and code | Apache-2.0 (runtime) |
| Buddhabrot portable | MIT (runtime) |
| Prachya Boonkwan Brahmi map | MIT (runtime) |
| Joshua Wong Keyman Brahmi Inscript | MIT (source-derived data) |
| SIL International Devanagari Inscript | MIT (source-derived data) |
| Unicode CLDR 41 | Unicode-DFS-2016 (source-derived data) |
| Unicode CLDR 48 | Unicode-3.0 (source-derived data) |
| Unicode character names | Unicode data license (factual names) |
| JIS factual key legends / W3C code names | reference only; no external SVG file bundled (source-derived factual data) |
| System fonts | not distributed (runtime local) |
| SuttaCentral Pali Dhammapada | public domain (runtime) |
| Hultzsch 1925 original | public domain (historical reference) |
| Pramāṇa digital editorial layer | permission not established (unresolved) |
| @playwright/test 1.65.0 | Apache-2.0 (build-only) |
| Playwright Chromium and OS dependencies | separate vendor licenses (build-only; installed graph not audited) |
| actions/checkout@v4 | MIT (build-only) |
| actions/setup-node@v4 | MIT (build-only) |
| actions/upload-artifact@v4 | MIT (build-only) |
| jdno/setup-butler@v2.0.0 | MIT (build-only) |
| itch.io butler | MIT upstream (build-only) |

The upstream Brahmi.keylayout MIT notice was independently retrieved from the actual XML file (blob c7713fa598f12815a0ee363cb3abade7ad55bc88), not merely inferred from README. Keyman and release-specific CLDR license texts are in THIRD_PARTY_NOTICES.txt. JIS reference drawing, Apple documents and W3C reference are source links; no SVG drawing from Wikimedia is shipped. Factual key legends and physical codes are represented in original UI; if a third-party graphic or expressive text is added, review its original license separately. The owner-controlled icon/code is Apache-2.0 only to the extent the owner holds its rights.

CI: 15 workflows inspected for uses and install commands. Playwright is a dev dependency; installation also downloads Chromium and OS packages. Actions checkout, setup-node, upload-artifact, setup-butler, and itch.io butler were identified; licenses checked at upstream repository level (not complete immutable action-transitive snapshot). No package-lock.json in baseline; no exact installed dependency inventory available. These build tools are excluded from the static portable packages. The inventory is not a claim of an installed SBOM. For complete CI supply-chain audit, generate npm lockfile, inspect installed license files/optional dependencies, pin action commit SHA and inventory downloaded browser/OS packages. Separate linked applications and old release downloads need separate audits.

## Disposition

The static distributed asset inventory is complete for the reviewed tree, with unresolved historical editorial rights recorded above. CI transitive inventory remains pending. Do not close issue #2 or claim blanket permission for all embedded content. The current license grant remains limited to owner-controlled original work; retain notices and independently confirm rights before wider commercial promotion.
