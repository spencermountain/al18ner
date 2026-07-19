# sentences

1,000 sample English sentences covering the common structures of the language, in
compromise's [`spec` format](https://github.com/spencermountain/compromise/blob/master/docs/spec-format.md) —
one sentence per line, one tag-slot per compromise term:

```
The boy kicked the ball. {Det,Noun,Vb,Det,Noun}
```

## Files

| file | structures |
|------|-----------|
| `01-basics.txt` | SV / SVO / SVOO / SVOC declaratives, copula predicates, possessives, adjective stacking, plurals, pronouns |
| `02-tenses.txt` | simple present/past, progressive, perfect, perfect-progressive, will / going-to future, used-to, time adverbials |
| `03-modals-negation.txt` | can/could/may/might/must/should/would/shall, have-to/ought-to, don't/isn't/can't/won't, never, nothing, nobody |
| `04-questions.txt` | yes-no (do-support, copula, modal), all wh-words, how-many/much/old/far, tag questions, embedded questions, negative questions |
| `05-commands-expressions.txt` | imperatives, negative imperatives, please-requests, let's, interjections, greetings, short answers |
| `06-conditionals-subordinate.txt` | if-conditionals (0/1st/2nd/3rd), unless, when/whenever/while/although/because/so, temporal preps, as-if/as-though |
| `07-clauses-reported.txt` | coordination and lists, relative clauses (that/whose/who/which/where/when), reported speech, that-clauses |
| `08-comparison-degree.txt` | comparatives, superlatives, as...as, too/enough, intensifiers, there-is/are, quantifiers, degree adverbs |
| `09-prepositions-phrasals.txt` | prepositional phrases (place/time/instrument), phrasal verbs, gerunds, infinitives, catenatives |
| `10-passives-values-dates.txt` | passives (be/get/modal/perfect), numbers, ordinals, money, ages, dates and times, hyphenated compounds, reflexives |

100 lines each. Every line was validated against compromise v14.16.0: term counts match
the tokenizer exactly (contractions and hyphenated words split), and 935/1000 lines pass
`nlp.testSpec()` as-is.

## Translations

1-to-1 translations of all 1,000 lines live in `fr/`, `es/`, `de/`, `ru/`, `pt/` —
same filenames, same line order, same spec format, tagged on the *translated*
sentence's own tokens and word order:

```
Le garçon a frappé le ballon. {Det,Noun,Vb,Vb,Det,Noun}
```

Translations are natural, not word-for-word, so slots grow and shrink: Russian
drops articles and the present-tense copula (`Суп горячий. {Noun,Adj}`), Romance
languages drop subject pronouns, French passé composé adds an auxiliary slot,
German separable prefixes add a trailing `Vb` (`Der Regen hörte auf.
{Det,Noun,Vb,Vb}`), and idioms restructure freely (`J'ai faim`, `Tengo hambre`,
`У меня болит голова`) with each token tagged by its own POS.

Register: informal singular (tu / tú / du / ты; Brazilian Portuguese você).
Russian assumes a male first-person speaker and writes ё consistently.

**Tokenization** — one tag per whitespace token, punctuation untagged (including
the Russian copular em-dash), plus:

- apostrophe clitics split into their own slot: `l'eau` → {Det,Noun}, `Je n'ai
  pas` → {Noun,Negative,Vb,Negative}; exceptions `aujourd'hui`, `quelqu'un`
- hyphenated words split, one slot per part: `Veux-tu` → {Vb,Noun},
  `levanta-se` → {Vb,Noun}, `bem-vestido` → {Adv,Adj}
- …except Russian, where hyphenated words are always ONE slot (`кто-то` → Noun,
  `из-за` → Prep, `по-английски` → Adv)

**Tag carry-overs from the English conventions**: possessive determiners
(mon, mi, mein, мой, meu) → `Noun` like English "my"; reflexive and object
clitics (se, me, lui, sich, lhe) → `Noun`; modals and auxiliaries → `Vb`;
conditional si/wenn/если/se → `Condition` exactly where the English line tags
it; jamais/nunca/nie/никогда → `Negative`; ne…pas both `Negative`; relativizers
mirror the English line (relative "that" = `Det` → que/der/который = `Det`;
whose = `QuestionWord` → dont/cuyo/dessen/чей/cujo = `QuestionWord`);
comparative than/as-words (que, como, als, wie, чем, как, quanto) → `Prep`
mirroring the source; fused prep+articles (au, del, im, do, pelo) → `Prep` by
function, partitive du/des → `Det`; infinitive-marker de/à/a/zu → `Conj` like
English "to". The `There` tag survives only in French `il y a`
({Noun,There,Vb}) — hay/es gibt/есть/tem are tagged by their own structure.

`validate.js` checks line counts, the closed tag vocabulary, and
tag-count-vs-token-count under these tokenization rules for all six languages
(the `en` rules reproduce compromise's term counts on all 1,000 source lines):

```
node sentences/validate.js sentences/fr/01-basics.txt fr
```

## Conventions

Follows the spec's closed tag vocabulary and compromise's own conventions:
pronouns and possessive pronouns → `Noun`, copulas/auxiliaries/modals → `Vb`,
infinitive "to" → `Conj`, `n't` → `Negative`, ordinals and "first" → `Val`,
"before" → `Conj`, clause-initial "after/since/as" → `Prep`, quantifiers per
compromise's lexicon (many → `Adj`, few/much → `Det`, half → `Val`/`Adj` by context).

## Deliberate disagreements with the current tagger (65 lines)

These lines keep the linguistically-correct tag where compromise v14.16.0 tags
differently — each one fails `testSpec()` on exactly that word. The full list, with
compromise's actual output and the per-word diff for every line, is in
[disagreements.md](./disagreements.md). They may point at lexicon gaps worth fixing:

1. **Conditional "if" → `Condition`** (26 lines, file 06) — compromise tags every "if"
   as `Conjunction`; only "unless" carries `Condition`. Embedded "if" (= whether:
   "He asked if I was ready") is tagged `Conj` here and passes.
2. **Wh-relatives → `QuestionWord`** (16 lines, files 06/07) — restrictive
   who/which/where/when after a noun get `Preposition` (or `Determiner`) from the
   tagger, and unstably so ("who" → `Prep` after "the man" but `Det` after "everyone").
   Appositive relatives after a comma ("My brother, who lives in Denver...") already
   tag `QuestionWord` and pass. Relative "that" is tagged `Det` throughout, matching
   the tagger.
3. **Embedded question words → `QuestionWord`** (9 lines, file 04) — "I know **what**
   you did", "Do you know **where** she went" get `Preposition` from the tagger.
4. **Spatial prepositions → `Prep`** (9 lines, file 09) — under, above, beside,
   against, below, near, behind, inside, over are tagged `Adjective` by the tagger
   even with a clear noun-phrase object ("The cat hid under the bed").
5. **Determiner "no" → `Negative`** (3 lines, file 03) — "She has **no** idea" gets
   `Expression` from the tagger.
6. **Complementizer "that" before a full NP → `Conj`** (2 lines, file 07) — "They said
   **that** the road was closed" gets `Det`; before a pronoun ("said that he...") the
   tagger agrees with `Conj` and those lines pass.
7. **Locative "here" → `Adv`** (1 line, file 05) — "Please wait **here**" gets
   `Noun/Uncountable`.

(One extra line, "Nobody knows who wrote it.", matches `out('spec')` exactly but hits a
`.has()` matcher quirk in `testSpec`.)

To make the whole corpus pass the current tagger instead, the mechanical rewrite is:
conditional `Condition` → `Conj`, the wh-words above → `Prep`, spatial preps → `Adj`,
"no" → `Expr`, NP-"that" → `Det`, "here" → `Noun` — but the point of keeping them is
that the corpus, not the tagger, is right on these.

## Validating

```js
import nlp from 'compromise'
import fs from 'fs'
nlp.testSpec(fs.readFileSync('sentences/01-basics.txt', 'utf8'))
```
