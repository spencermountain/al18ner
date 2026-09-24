# al18ner
heuristics for comparing multi-lingual sentences

## Sentence tests

Requires Node.js 20 or newer. Install dependencies with `pnpm install`.

Run one language independently:

```sh
pnpm test:fr
```

Also available: `test:de`, `test:en`, `test:es`, `test:it`, `test:ja`, `test:pt`, and
`test:ru`. Run `pnpm test` to run all eight, continuing after failures.

Each nonblank line in every `sentences/<language>/*.txt` file becomes a Tape
assertion using that language's `nlp.testSpec(spec, false)`. Failures show the
source file and line, followed by word-level differences such as
`'word' #Noun!=#Vb`, missing terms, and mismatched term counts. The diagnostics
loop through each expected tag slot, including implicit terms in contractions.
Exceptions fail the affected sentence and the remaining sentences still run.
Any failure gives the command a nonzero exit status.

English uses `compromise` and the sentence files in `sentences/*.txt`, with the
same reporter as the other languages: `pnpm test:en`.

Tap-dancer displays a summary and details for the first ten failures. To see
every failure (or save the full TAP output), use:

```sh
node test/fr.js
node test/fr.js > /tmp/al18ner-fr.tap
```

The runner expands the corpus abbreviations (`Adj`, `Adv`, `Conj`, `Det`, `Expr`,
`Prep`, `Val`, `Vb`) to full tag names before calling `testSpec`, because the
language packages do not register these aliases. Assertions follow `testSpec`'s
tag matching rules, rather than comparing output strings literally. Existing
corpus or tagger disagreements are reported as failures.

## Accuracy scores

Run `npm run test:score` (or `pnpm test:score`) for a CLI table of sentence totals,
passes, failures, and percentage accuracy for all eight languages, sorted from
highest to lowest accuracy. Percentages display as whole numbers; sorting and
colors use the unrounded score. Accuracy colors use the failure red below 50%,
amber below 75%, light green below 90%, and green at 90% and above.
Accuracy is the percentage of sentences passing the same `testSpec` check used
by the Tape tests, not the percentage of individual words tagged correctly.
Ordinary tagging failures do not make this reporting command exit unsuccessfully;
malformed specs and runtime errors do, and are included as failed sentences.
