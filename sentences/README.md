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

1-to-1 translations of all 1,000 lines live in `fr/`, `es/`, `de/`, `ru/`,
`pt/`, `it/`, `sv/`, `pl/`, `sw/`, `ja/` — same filenames, same line order, same spec
format, tagged on the *translated* sentence's own tokens and word order:

```
Le garçon a frappé le ballon. {Det,Noun,Vb,Vb,Det,Noun}
```

Translations are natural, not word-for-word, so slots grow and shrink: Russian
drops articles and the present-tense copula (`Суп горячий. {Noun,Adj}`), Romance
languages drop subject pronouns, French passé composé adds an auxiliary slot,
German separable prefixes add a trailing `Vb` (`Der Regen hörte auf.
{Det,Noun,Vb,Vb}`), and idioms restructure freely (`J'ai faim`, `Tengo hambre`,
`У меня болит голова`) with each token tagged by its own POS.

Register: informal singular (tu / tú / du / ты / tu / du / ty). Brazilian Portuguese
uses você; Polish uses the bare 2nd person rather than pan/pani; Swahili uses the
plain singular (unasoma). Russian assumes a male first-person speaker and writes ё
consistently.
Japanese is uniformly polite (です/ます), since that is the register a learner corpus
wants and it keeps the copula and the negative auxiliary visible on every line.
Italian and Spanish enclitic imperatives are one token, one slot (Siéntate,
Siediti → Vb); Portuguese hyphenated enclitics split (Sente-se → {Vb,Noun}).

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
comparative than/as-words (que, como, als, wie, чем, как, quanto, di, che) →
`Prep` mirroring the source; fused prep+articles (au, del, im, do, pelo,
alla) → `Prep` by function, partitive du/des/dei → `Det`; infinitive-marker
de/à/a/zu/di → `Conj` like English "to"; politeness interjections (Merci,
Gracias, Danke, Спасибо, Obrigado, Grazie) → `Expr`. The `There` tag survives
only in French `il y a` ({Noun,There,Vb}) and Italian `c'è` ({There,Vb}) —
hay/es gibt/есть/tem are tagged by their own structure.

`validate.js` checks line counts, the closed tag vocabulary, and
tag-count-vs-token-count under these tokenization rules for every space-separated
language (the `en` rules reproduce compromise's term counts on all 1,000 source
lines). For `ja` it checks format, vocabulary and line count only — there is no
whitespace to count against:

```
node sentences/validate.js sentences/fr/01-basics.txt fr
node sentences/validate.js sentences/ja/01-basics.txt ja
```

### Swedish

Nothing unusual: no apostrophe clitics, definiteness is a suffix rather than an
article (`Telefonen ringde. {Noun,Vb}`), the genitive `-s` stays on its noun
(`Toms bil` → {Noun,Noun}), and particle verbs get a trailing `Vb` like German
separable prefixes (`Ge aldrig upp. {Vb,Negative,Vb}`, `De bjöd in oss.
{Noun,Vb,Vb,Noun}`), while the predicative `sönder` in `Glaset gick sönder` is `Adj`. The
future/infinitive marker `att` is `Conj` like English "to", `inte` and `aldrig`
are `Negative`, and existential `Det finns/var/sitter` keeps `There` on `Det`.

### Polish

Free word order and rich case marking, so slots move but the vocabulary is the
familiar one: no articles (the `Det` slot survives only on real demonstratives,
`ten / ta / to`), subject pronouns are usually dropped (`Napisał list.
{Vb,Noun}`), and the infinitive is a single word, so the infinitive-marker `Conj`
of English "to" disappears — it comes back on purposive `żeby/aby`.

- `nie` → `Negative`, and Polish negative concord means two slots where English
  has one: `Nigdy nie pije herbaty. {Negative,Negative,Vb,Noun}`
- the yes-no particle `czy` → `QuestionWord`, matching Japanese か; so does the
  tag question `prawda?` (`Wygraliśmy, prawda? {Vb,QuestionWord}`)
- reflexive/object clitics (`się`, `mi`, `go`) → `Noun` like the other languages
- `jeśli / jeżeli / gdyby` → `Condition`; comparative `niż` and `jak` → `Prep`
- possessives `mój / twój / swój` → `Noun` like English "my"

### Swahili

The most agglutinative language in the set: subject, tense, object and relative
markers are all prefixes inside the verb, so an entire English clause can land in
a single slot — `They invited us.` → `Walitualika. {Vb}`, `I believe you.` →
`Ninakuamini. {Vb}`. Adjectives and demonstratives follow their noun, so `Det`
and `Adj` sit to the right of `Noun` (`gari lile {Noun,Det}`).

- **negation is affixal** (si-, hu-, ha-), so a negated verb is one `Vb` slot and
  `Negative` survives only on free words: `si` (negative copula), `kamwe`
  (never), `wala` (nor), and the negative existential `hakuna / hakukuwa`
  (`Hakuna viti vilivyobaki. {Negative,Noun,Vb}`)
- **relative markers are infixed** (-ye-, -yo-, -o-), so the relativizer slot of
  the English line simply isn't there: `The boy who won the race smiled.` →
  `Mvulana aliyeshinda mbio alitabasamu. {Noun,Vb,Noun,Vb}`. Only the free-standing
  `ambaye / ambapo / ambalo` gets `QuestionWord`, matching the English wh-relative
- existential `kuna / kulikuwa` → `There`; `ku-` infinitives are part of the verb
  word, so the infinitive `Conj` disappears the way Polish's does
- `kama / ikiwa` and `isipokuwa` (unless) → `Condition`; `kwamba` (that) → `Conj`;
  comparative `kuliko` and equative `kama` → `Prep` mirroring the source
- genitive connectors (`wa / ya / la / cha / vya`) → `Prep`, possessives
  (`yangu / yake`) → `Noun`; superlatives are the postposed adverb `zaidi` → `Adv`
- the yes-no particle `Je` and the tag `sivyo?` → `QuestionWord`
- multi-word connectives get one tag per word, mirroring English "because of":
  `kwa sababu ya` → {Conj,Conj,Prep}

### Japanese

Japanese is written normally, **unspaced**, and the tags follow the sentence's
morphemes left to right — there is no whitespace for `validate.js` to count, so
these lines are the one place in the corpus where tag count is not machine-checked
against the sentence. The segmentation the tags assume:

- particles are their own slot and are tagged `Prep` by function — case and topic
  (は が を に で と へ から まで より), genitive の, and the relational nouns that
  follow it (上/中/後ろ/近く/ため) when they carry a preposition's meaning
- verb inflection stays attached to its stem (`行きました` = one `Vb`), but these
  split off: the negative auxiliary (ない / ません / ませんでした → `Negative`),
  auxiliaries after て-form (`読んでいます` → {Vb,Vb}), the copula です/だ/でした
  (`先生です` → {Noun,Vb}), and modal-ish tails (でしょう, かもしれません, ください)
- い/な-adjectives are `Adj`, so a predicate adjective plus copula is {Adj,Vb}
  (`スープは熱いです。 {Noun,Prep,Adj,Vb}`); potential verbs are a single `Vb`
  (`泳げます`), and obligation 〜なければなりません is {Vb,Vb}
- number+counter is one `Val` slot (三個, 二十歳, 三百メートル, 2019年)
- interrogative-final か is `QuestionWord`, as are the wh-words (何 誰 どこ いつ
  なぜ どう どの); sentence-final ね/よ are `Expr`, and they carry the English tag
  questions ("…, doesn't she?" → `…ですね。 {…,Vb,Expr}`)
- subordinators keep the English line's tag on the Japanese word that does the job:
  もし and 〜ない限り → `Condition`, と/たとえ/とき/たび/間/ので/けれど/ため → `Conj`,
  quotative と before 言う/思う → `Conj` like complementizer "that", 前 → `Conj` and
  後 → `Prep` mirroring "before"/"after"
- relative clauses have no relativizer, so the `Det`/`QuestionWord` slot of the
  English line simply isn't there: `The book that she wrote is long.` →
  `彼女が書いた本は長いです。 {Noun,Prep,Vb,Noun,Prep,Adj,Vb}`
- `There` does not survive: あります/います are tagged by their own structure

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
