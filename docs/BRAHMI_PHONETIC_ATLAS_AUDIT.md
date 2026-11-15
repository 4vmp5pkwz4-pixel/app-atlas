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

## What the reader can do

- Browse all 115 assigned signs with glyph, code point, group, available educational Roman value, aligned Devanagari for 34 common consonants and 14 independent vowels, original four-layer Mac source chord, and alternate physical keycap labels.
- Search/filter across characters and all 5 physical-label views (DE, EN, RU, Japanese Romaji, Japanese Kana); show only the 9 source-unmapped signs.
- Download the currently filtered comparison as CSV, without uploading text or opening network connections.
- Follow the localized **Phonetic Atlas** link from the existing converter (RU/DE/EN/JA, plus an editorial Brahmi-script link). The original five-row typing trainer is unchanged.

**Important:** This atlas offers a **verified transcription/typing aid**, not precise sound values of 3rd-century BCE inscriptions. Old Tamil or exceptional Brahmi signs are intentionally not assigned fictional Devanagari, IAST or physical-key analogues. Japanese kana legends are only physical preview labels; Japanese IME composition may map multiple keystrokes to one committed character. `Option` character output must be checked on real macOS hardware when required.

## Source hierarchy

1. Unicode: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/
2. Primary macOS Brahmi keymap: https://github.com/kaamanita/brahmi/blob/master/Brahmi.keylayout
3. Existing in-repo source transcription: `data/macos-brahmi-reference.json`
4. Japanese physical legends: `data/macos-jis-layout.json`
5. Independently comparable Indic layout, not conflated with QWERTY: https://keyman.com/keyboards/brahmi_inscript

## Reproducibility and release gate

- `python3 scripts/verify_phonetic_atlas.py` checks source fidelity, 115/106/9, exact nine missing code points, physical preset consistency and JS syntax.
- `npm run test:browser` checks 115 rendered rows, scores 26/25/26, layouts, filters, CSV, localizations and the link from the parent converter.
- `python3 scripts/verify_brahmi.py` and `python3 scripts/validate.py` must still pass.
- Real Safari, installed keyboard layouts, screen-reader readability of Brahmi fonts and Japanese IME output still require Mac hardware testing. Successful Chromium tests do not prove that OS-reserved shortcuts can be intercepted.

No claim of a new versioned public release is made by this feature branch; the existing `v0.6.0 beta` badge remains as-is until the project's normal release gates pass.
