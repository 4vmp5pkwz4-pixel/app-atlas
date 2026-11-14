# Evidence-informed Brahmi typing instruction

This application teaches a historical writing system through modern physical key positions, a distinct motor skill. There is no credible evidence that any single touch-typing method is universally fastest or ideal for every person. The design combines evidence with explicitly marked pedagogical defaults.

## Methods actually implemented
- **Immediate dual feedback.** Users type actual macOS `event.key` characters in their active RU/EN/DE input source; the same physical `event.code` produces Unicode Brahmi on the next line.
- **Visible two-part keyboard map.** Each physical key simultaneously shows native label and exact Brahmi output for Normal, Shift, Option or Shift+Option. Users can open a full matrix.
- **Progressive instruction.** Home row and unmodified Brahmi signs precede more difficult signs, dependent vowels, combinations, original inscriptions and dedicated Option / Shift+Option lessons.
- **Adaptive practice.** The app remembers confusing Brahmi symbols and builds an additional weak-key exercise. A mixed-modifier exercise provides **interleaving** to reduce pure sequence memorization.
- **Distributed review.** After correctly completed lessons, suggested review becomes due after 1, 3, 7 and 14 days. Low accuracy prompts earlier review. This interval set is a practical heuristic; it has not been optimized experimentally for Brahmi.
- **Quality and feedback.** Accuracy, characters/minute, elapsed time and errors are separate; a 96% target is an in-app guideline, **not** a universal human-performance threshold.
- **Active retrieval.** The app can hide Brahmi key legends while allowing learners to bring them back. Displaying the prompt and physical next-key hint preserves accessibility.

## Research rationale, not overstated

1. Donoghue & Hattie (2021), **A Meta-Analysis of Ten Learning Techniques**, *Frontiers in Education*. Based on 242 studies and 169,179 participants, distributed practice and practice testing performed strongly as general learning techniques. The finding does **not** establish an optimal interval schedule for Brahmi typing. https://doi.org/10.3389/feduc.2021.581216
2. A 2026 classroom meta-analysis based on 53 studies and 7,303 participants found mean effects for retrieval, spacing and interleaving, with substantial moderators. These concern classroom retention and transfer rather than this specific motor task. https://link.springer.com/article/10.1007/s10648-026-10225-5
3. Keith & Ericsson (2007), **A deliberate practice account of typing proficiency in everyday typists**, reports an association between purposeful speed goals, past training and proficiency, while not proving a universal optimal typing system. https://pubmed.ncbi.nlm.nih.gov/17924799/
4. **Typing expertise in a large student population** (2022) examined 1,301 participants and found that typing skills can develop outside formal touch-typing instruction. The result cautions against overclaiming ten fingers as the only viable high-performance technique. https://pmc.ncbi.nlm.nih.gov/articles/PMC9356123/
5. **Learning to type with mobile keyboards** (2022) describes adaptation of visual attention and finger motion with practice on touchscreen layouts. Its findings are relevant to visual scaffolding but cannot be directly substituted for desktop physical-motor training. https://doi.org/10.1016/j.chb.2021.106992

## Ethical, ergonomic and quality principles
- Avoid repetitive strain: encourage comfortable wrist posture, individualized breaks and reduced effort. Never imply users must push through pain.
- Avoid fabricated facts about proficiency gains. Measure personal before/after speed and accuracy in actual use, with consent if collecting research data.
- Browser access to input events is limited to the focused training field; never log background keyboard activity or sensitive data.
- Preserve inclusive paths for keyboard-only users and for touchscreen users; do not block progress behind a single teaching style.
- Actual OS Option characters can be dead keys or vary with installed keyboard. Brahmi output mapping is authoritative only for the selected original Prachya reference, not all possible Bra input methods.
- Keep the source data, agent skill, test suite and deployment instructions versioned together.

## Proposed future research experiments
- Randomized within-user order of interleaved vs blocked modifier practice, comparing retained accuracy on delayed tests rather than immediate speed only.
- Compare adaptive error-weighted reviews with uniform repetition using local consent-based data.
- Investigate grapheme-based vs code-point-based accuracy displays for conjuncts and matras.
- Empirically evaluate whether an online keyboard always visible vs optionally hidden improves transfer to real keys across novices and experienced typists.
