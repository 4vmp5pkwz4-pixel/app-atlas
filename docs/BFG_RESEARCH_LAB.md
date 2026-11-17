# BFG Research Lab 0.1.0

Experimental companion to Brahmi Atelier 0.9.4-beta. The trainer, physical key maps, transliteration data, corpora and licenses are unchanged. The research lab accepts arbitrary Unicode; it adds no historical transcription or external biological dataset.

## Use
Open research-lab.html from the trainer homepage or use the converter's explicit “Research this text” action. Text is passed through same-tab sessionStorage and consumed once. If storage is unavailable, copy and paste manually. No computation uses a server. The portable ZIP must include research-lab.html and bfg-core.js.

* Choose code-point normalization (raw, NFC, NFD), whitespace treatment, context radius 0–7 and independent erasure p.
* Count independent sets (looped vertices excluded), examine adjacency, select context classes and export the full input, options, graph and selected mask as JSON. Search is resource bounded. The worker is cancellable; the synchronous fallback has a smaller budget. A distinct-context path is solved directly via Fibonacci numbers.
* Compare positional partitions, not language quality. The base-4 molecular representation is an AC/GT two-base block encoding of the projected binary mask, not of the original text. There is no biological interpretation or mutation-correction claim.
* Compute exact rational cut sums on connected weighted graphs (2–12 vertices), or closed-form unit-weight presets up to 100 vertices. The reported J is a leading term, not a finite-penalty simulation.
* Compute classical monotone transport deficits between a correlated finite distribution of E/D/I flags and its complement. The result is not a formula for arbitrary quantum-channel capacity.

## Mathematical contract
For n preprocessed positions, context classes form the adjacency graph G. A valid binary projection is an independent set. With all positions free, dim H = F(n+2). Enumeration uses exact BigInt deletion and closed-neighborhood recursion; a greedy independent set gives a constructive lower bound if the budget is exhausted. The displayed maximum density interval uses weighted independent sets.

For independent flagged erasure of auxiliary binary labels, c_v=(1-p)^w_v-p^w_v for each eligible class. An independent set gives an unconstrained product of logical repetition blocks, hence a lower bound sum c_v. The diagonal-input conditional-entropy expression in BFG VIII–IX gives the upper bound min(log2 dim, sum c_v). At p=0 with exact dimension, capacity is log2 dim; at p=1/2 it is zero. Numerical logarithms and c_v are floating point (not directed interval certificates). The browser's capacity numbers must not be represented as certified scientific decimals. The auxiliary model is not physical anyon erasure.

For cut sums, dp(empty)=1; dp(S)=sum_{v in S}dp(S-v)/cut(S) for proper nonempty S; the full set omits the denominator. Exact fractions use BigInt. The noise transport calculation uses integer max flow with E<D<I coordinatewise and E/I exchange for the complement.

## Reproduce
Run node tests/bfg-core.test.cjs and npm run test:browser. The latter uses the existing desktop/mobile Playwright configurations. Run python3 scripts/package.py to verify offline integration. The BFG version is independent of the trainer version; merge/release should follow the repository's review and versioning policy (do not overwrite an existing release unknowingly). Scientific priority and physical implementation are not claimed.
