// Validates a sentence-spec file: each line `<sentence> {Tag,Tag,...}`
// checks line count, tag vocabulary, and tag count === token count.
//   node sentences/validate.js sentences/fr/01-basics.txt fr
// langs: en | fr | es | de | ru | pt
import fs from 'fs'

const VOCAB = new Set(['Noun', 'Vb', 'Det', 'Adj', 'Adv', 'Prep', 'Conj',
  'QuestionWord', 'Negative', 'Val', 'Date', 'Expr', 'Condition', 'There'])

// apostrophe-words that stay a single token
const KEEP_WHOLE = new Set(["aujourd'hui", "quelqu'un", "quelqu'une", "o'clock"])

const tokenize = function (text, lang) {
  let s = text.replace(/['’]/g, "'").replace(/[«»„“”"—–…]/g, ' ')
  const out = []
  for (let t of s.split(/\s+/).filter(Boolean)) {
    t = t.replace(/^[¿¡('\[]+/, '').replace(/[.,!?;:)\]']+$/, '')
    if (!t) continue
    // russian: hyphenated words are always one token (кто-то, по-моему, из-за)
    const parts = lang === 'ru' ? [t] : t.split('-').filter(Boolean)
    for (const p of parts) {
      if (KEEP_WHOLE.has(p.toLowerCase())) {
        out.push(p)
        continue
      }
      if (lang === 'en' && p.toLowerCase() === 'cannot') {
        out.push('can', 'not') // compromise splits "cannot"
        continue
      }
      // english possessive 's is one term; contraction 's (let's, it's...) splits
      if (lang === 'en' && /'s$/i.test(p) &&
        !/^(let|it|she|he|that|what|there|who|here)'s$/i.test(p)) {
        out.push(p)
        continue
      }
      if (lang !== 'ru' && p.includes("'")) {
        out.push(...p.split(/(?<=')/).filter(Boolean)) // "l'eau" → ["l'", "eau"]
      } else {
        out.push(p)
      }
    }
  }
  return out
}

const file = process.argv[2]
const lang = process.argv[3] || 'en'
const lines = fs.readFileSync(file, 'utf8').split('\n').filter(l => l.trim().length > 0)
let errs = 0
if (lines.length !== 100) {
  console.log(`LINE COUNT: expected 100, got ${lines.length}`)
  errs += 1
}
lines.forEach((line, i) => {
  const m = line.match(/^(.*?)\s*\{([^}]*)\}\s*$/)
  if (!m) {
    console.log(`line ${i + 1}: bad format: ${line}`)
    errs += 1
    return
  }
  const tags = m[2].split(',').map(s => s.trim())
  const bad = tags.filter(t => !VOCAB.has(t))
  if (bad.length) {
    console.log(`line ${i + 1}: unknown tag(s) [${bad.join(',')}]: ${line}`)
    errs += 1
  }
  const toks = tokenize(m[1], lang)
  if (toks.length !== tags.length) {
    console.log(`line ${i + 1}: ${toks.length} tokens vs ${tags.length} tags`)
    console.log(`   tokens: [${toks.join('|')}]  tags: {${m[2]}}`)
    errs += 1
  }
})
console.log(errs === 0 ? `PASS ${file}` : `${errs} error(s) in ${file}`)
process.exit(errs === 0 ? 0 : 1)
