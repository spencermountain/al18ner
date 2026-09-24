import { readdirSync, readFileSync } from 'node:fs'

const corpusAliases = {
  Adj: 'Adjective', Adv: 'Adverb', Conj: 'Conjunction', Det: 'Determiner',
  Expr: 'Expression', Prep: 'Preposition', Val: 'Value', Vb: 'Verb',
}

export const languages = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt', 'ru']

export function readCorpus(language) {
  const sourceDirectory = language === 'en' ? 'sentences' : `sentences/${language}`
  const directory = new URL(`../${sourceDirectory}/`, import.meta.url)
  const files = readdirSync(directory).filter(file => file.endsWith('.txt')).sort()
  if (files.length === 0) throw new Error(`No sentence files found for ${language}`)
  return files.map(file => {
    const source = `${sourceDirectory}/${file}`
    const sentences = readFileSync(new URL(file, directory), 'utf8').split(/\r?\n/)
      .map((line, index) => ({ spec: line.trim(), line: index + 1 }))
      .filter(({ spec }) => spec.length > 0)
    if (sentences.length === 0) throw new Error(`${source}: no sentences found`)
    return { source, sentences }
  })
}

export function checkSpec(nlp, spec) {
  const parts = spec.match(/^(.+)\{([^{}]+)\}(\s*#.*)?$/)
  if (!parts) throw new Error('missing or malformed {tags}')
  const sentence = parts[1].trim()
  const aliases = { ...corpusAliases }
  for (const [tag, info] of Object.entries(nlp.world().model.one.tagSet)) {
    if (info.alias) aliases[info.alias] = tag
  }
  const slots = parts[2].split(',').map(slot => slot.split('|').map(tag => tag.trim()))
  if (slots.some(slot => slot.some(tag => !tag))) throw new Error('empty tag in {tags}')
  const tags = slots.map(slot => slot.map(tag => aliases[tag] || tag).join('|')).join(',')
  const failing = nlp.testSpec(`${sentence} {${tags}}`, false)
  const differences = []
  if (failing.found) {
    failing.compute('tagRank')
    const terms = failing.docs.flat()
    slots.forEach((expected, i) => {
      const term = terms[i]
      if (!term) {
        differences.push(`term ${i + 1}: missing, expected ${expected.join('|')}`)
        return
      }
      const missing = expected.filter(tag => !term.tags.has(aliases[tag] || tag))
      if (missing.length > 0) {
        const word = term.implicit || term.text
        const actual = term.tagRank?.[0] || 'Untagged'
        differences.push(`'${word}' #${actual}!=#${missing.join('|#')}`)
      }
    })
    if (terms.length !== slots.length) {
      differences.push(`expected ${slots.length} terms, got ${terms.length}`)
    }
    if (differences.length === 0) differences.push('tags align, but the sentence pattern did not match')
  }
  return { passed: !failing.found, sentence, differences }
}
