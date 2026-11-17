# Brahmi Atelier — pronunciation and universal representation

## Scope and provenance
The dictionary covers the 115 assigned code points of the Unicode 17 Brahmi block. It is a sign registry, not a word lexicon or a phonological reconstruction of a single language. Unicode is the basis for identity and sign function; broad pedagogical IPA and articulation are informed by the University of Texas Sanskrit phonetics reference, with separate regional and contextual caveats. Historical Ashokan Prakrit is a dialect continuum. No historical audio survives, and the precise phonetic values across regions and dates are not determined by a script code point.

- Unicode 17: https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/
- UT Austin: https://lrc.la.utexas.edu/eieol/vedol/0
- IPA chart: https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html
- Ashokan Prakrit: https://aclanthology.org/2021.udw-1.4/

Seventy-five entries have a broad segmental or contextual description. The remaining forty entries carry numerical, punctuation or control function, not an autonomous IPA sound. Dependent vowel signs use a carrier in practice, never a dotted circle in the encoded text. The default broad model has classical Sanskrit-oriented values; phoneme variation and Tamil-Brahmi marks are explicitly marked, including the ambiguity of early AA. A Hindi speech synthesis demonstration is optional and uses only a device-reported local Hindi voice for entries with modern examples. It does not produce authenticated IPA or ancient speech, and it must remain disabled when unavailable. No IPA chart audio is copied into the repository.

## Logical flow
Home → pronunciation → sign profile → syllable builder → live keyboard practice.
Atlas and converter link directly to code-point profiles. The trainer inspector links to the evaluated key's profile without changing the original key mapping. Local one-time session storage transfers only the explicitly selected practice text or research input. No historical corpus or keyboard data is changed.

## Beyond a script
BFG projection accepts arbitrary Unicode after an explicit normalization/whitespace policy. The JSON map merges selected code points into named classes; unmapped symbols retain identity. Private-use code points serve as reversible identifiers of the *classes*, not the original text. A position partition induced by a feature map is coarser than the original at any fixed context radius, because equal original contexts remain equal after a positionwise map. Thus the corresponding equality-constrained Fibonacci space embeds into the original finer space. Strict inequalities require additional proof or computation. Feature labels are user-provided, not automatically inferred, and mathematical equivalence does not establish linguistic identity, biology or physical anyons.

Tests: python3 scripts/verify_brahmi_pronunciation.py and npm run test:browser. The complete ZIP contains the original trainer, atlas, dictionary and research lab. Five natural-language dictionary interfaces are provided; the trainer's experimental Brahmi-only chrome is preserved and external technical pages default to English when that mode is selected.
