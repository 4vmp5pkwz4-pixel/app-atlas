# Brahmi Atelier · phonetic atlas (research audit, 2026-11-15)

## Scope and provenance

The standalone page `apps/brahmi/phonetic-atlas.html` lists **all 115 Unicode-assigned characters** in the Brahmi block U+11000–U+1107F, as defined in Unicode 15.1 (the assigned repertoire is unchanged in Unicode 17 in this range). Unassigned code points are not silently displayed as letters. The character inventory is constructed from three exact assigned intervals:

- U+11000–U+1104D (78 characters);
- U+11052–U+11075 (36 characters);
- U+1107F BRAHMI NUMBER JOINER (1 character).

The source for keyboard input is **Prachya Boonkwan, Brahmi Keyboard Layout for Mac OS X v1.0 (2019)**, MIT-licensed, source Git blob `c7713fa598f12815a0ee363cb3abade7ad55bc88`. All four modifier layers in `data/macos-brahmi-reference.json` are embedded unchanged, including empty cells; no fallback is fabricated. This source directly maps **106** of the 115 assigned characters; **9** lack a source key:

| Code point | Official Unicode name |
|---|---|
| U+11003 | BRAHMI SIGN JIHVAMULIYA |
| U+11004 | BRAHMI SIGN UPADHMANIYA |
| U+11070 | BRAHMI SIGN OLD TAMIL VIRAMA |
| U+11071 | BRAHMI LETTER OLD TAMIL SHORT E |
| U+11072 | BRAHMI LETTER OLD TAMIL SHORT O |
| U+11073 | BRAHMI VOWEL SIGN OLD TAMIL SHORT E |
| U+11074 | BRAHMI VOWEL SIGN OLD TAMIL SHORT O |
| U+11075 | BRAHMI LETTER OLD TAMIL LLA |
| U+1107F | BRAHMI NUMBER JOINER |

Because this is a keyboard *coverage* measurement, a source position and a phonetic transliteration are never conflated. For example, U+1107F is semantically meaningful as a number joiner but has no assignment in this Mac source. The atlas displays it rather than discarding it.

## Reproducible phonetic metric

The **34 basic consonants U+11013–U+11034** are treated as an unweighted set. For each:

1. Obtain its IAST roman label from the existing `cons` source of Brahmi Atelier.
2. Remove Latin combining diacritics and take the first letter (e.g. `ṭh` becomes `T`).
3. Find the first source-authenticated key chord in preference order: unmodified, Shift, Option, Shift+Option.
4. Compare that letter with the *unshifted physical Latin letter* at that key position. Shift for aspiration is allowed.
5. Count matches over all 34. Avoid counting display layout aliases as distinct historical keyboards.

**Results:** English US QWERTY **26/34**; German ISO QWERTZ **25/34**; Japanese JIS *Romaji key legends* **26/34**. The eight QWERTY mismatches are `ṅ` (Quote), `ñ` (Y), `ṭ/ṭh` (Z), `ḍ/ḍh` (X) and `ś/ṣ` (W). The German Y/Z swap reduces the count by one because the Brahmi Y mapping no longer has a matching Latin legend.

These scores quantify **a particular modern source layout's mnemonic affinity**, not historic preservation, universal language distance, or an independent InScript benchmark. Russian ЙЦУКЕН and Japanese JIS Kana are deliberately not assigned a Latin-letter score: a valid Cyrillic phoneme or Japanese input-method comparison would require a separate, explicitly documented and language-aware metric.

## Independent InScript-to-InScript comparison

We additionally retrieved, parsed, and pinned two *independent real keyboards*, as distinct from the original 2019 phonetic Mac Brahmi source:

- [Keyman Brahmi Inscript 1.0.1 `brahmi_inscript.kmn`](https://github.com/keymanapp/keyboards/blob/master/release/b/brahmi_inscript/source/brahmi_inscript.kmn), Git blob `a8a936af5a2b7fa3a0c3de77cf9a40b59ecae2fa`.
- [Keyman Devanagari INSCRIPT Basic 1.1 `basic_kbdindev.kmn`](https://github.com/keymanapp/keyboards/blob/master/release/basic/basic_kbdindev/source/basic_kbdindev.kmn), Git blob `9f6eeb18e0010f26eb26a8e45bf8384a85773a48`.

Machine-readable, test-gated data: `data/brahmi-inscript-keyman-audit.json`, embedded byte-equivalently in the standalone atlas. Each source chord includes its actual modifiers (e.g., `SHIFT K_Z`). `RALT` and `ALT` notation are normalized for comparing modifier *names*, not asserting all OS-level Option behavior is identical.

**Consonants:** **32/34** of the exact paired Brahmi/Devanagari consonants share the *same chord*. The two exceptions are `𑀬 य` (Brahmi `K_Z`; Devanagari `K_SLASH`) and `𑀱 ष` (Brahmi `SHIFT K_Z`; Devanagari `SHIFT K_COMMA`).

**Independent vowels:** **10/14** match. Exceptions are vocalic R (`𑀋 ऋ`), RR (`𑀌 ॠ`), L (`𑀍 ऌ`) and LL (`𑀎 ॡ`), assigned different chords in the two selected implementations.

**Keymap coverage:** the Keyman Brahmi Inscript input directly produces **108/115** assigned Brahmi Unicode characters, compared with **106/115** in Prachya Boonkwan's 2019 Mac layout. Keyman adds direct U+11003 (JIHVAMULIYA) and U+11004 (UPADHMANIYA) mappings; both versions still lack separate assignments for six Old Tamil U+11070–U+11075 code points and the Brahmi Number Joiner U+1107F.

Neither the 32/34 structural correspondence nor the 26/34 Latin-key mnemonic score is a universal or historical ranking: they assess **different pairings** and **specific source-controlled products**. This cross-script result provides stronger evidence for the systematic reuse of positions *within these two InScript implementations*, not ancient keyboard inheritance.

## What the reader can do

- Browse all 115 assigned signs with glyph, code point, group, available educational Roman value, aligned Devanagari for 34 common consonants and 14 independent vowels, original four-layer Mac source chord, and alternate physical keycap labels.
- Search/filter across characters and nine physical-label views (DE, EN, RU ЙЦУКЕН, RU Mac standard, RU Mac phonetic/QWERTY, Japanese JIS Romaji, Japanese JIS Kana, Devanagari Mac InScript, Devanagari Mac QWERTY); show only the 9 source-unmapped signs.
- Download the currently filtered comparison as CSV, without uploading text or opening network connections.
- Follow the localized **Phonetic Atlas** link from the existing converter (RU/DE/EN/JA/HI and experimental Brahmi-script). The five-row typing trainer now shows Mac legends, Brahmi output and IAST in parallel.

**Important:** This atlas offers a **verified transcription/typing aid**, not precise sound values of 3rd-century BCE inscriptions. Old Tamil or exceptional Brahmi signs are intentionally not assigned fictional Devanagari, IAST or physical-key analogues. Japanese kana legends are only physical preview labels; Japanese IME composition may map multiple keystrokes to one committed character. `Option` character output must be checked on real macOS hardware when required.

## Source hierarchy

1. Unicode: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/
2. Primary macOS Brahmi keymap: https://github.com/kaamanita/brahmi/blob/master/Brahmi.keylayout
3. Existing in-repo source transcription: `data/macos-brahmi-reference.json`
4. Japanese physical legends: `data/macos-jis-layout.json`
5. Independently comparable Indic layout, not conflated with QWERTY: https://keyman.com/keyboards/brahmi_inscript

## Reproducibility and release gate

- `python3 scripts/verify_phonetic_atlas.py` checks source fidelity, 115/106/9, exact nine missing code points, physical preset consistency and JS syntax.
- `npm run test:browser` checks 115 rendered rows, scores 26/25/26, the independent 48-pair InScript audit (32/34, 10/14), layouts, filters, CSV, localizations and the link from the parent converter.
- `python3 scripts/verify_brahmi.py` and `python3 scripts/validate.py` must still pass.
- Real Safari, installed keyboard layouts, screen-reader readability of Brahmi fonts and Japanese IME output still require Mac hardware testing. Successful Chromium tests do not prove that OS-reserved shortcuts can be intercepted.

The research dataset and keyboard counts remain versioned independently of the application UI; the current reviewed application release is `v0.8.1-beta`. The nine physical-label views do not mean nine independently verified historical keyboards.
