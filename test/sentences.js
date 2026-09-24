import test from 'tape'
import { readCorpus, checkSpec } from './corpus.js'

export default function testSentences(language, nlp) {
  for (const { source, sentences } of readCorpus(language)) {
    test(source, t => {
      t.plan(sentences.length)
      for (const { spec, line } of sentences) {
        const location = `${source}:${line}`
        try {
          const { passed, sentence, differences } = checkSpec(nlp, spec)
          const detail = differences.length ? ` — ${differences.join('; ')}` : ''
          t.equal(passed, true, `${location} — ${sentence}${detail}`)
        } catch (error) {
          t.fail(`${location} — ${spec} — ${error.message}`, {
            actual: error.stack || String(error),
            expected: 'a valid spec that can be evaluated',
          })
        }
      }
    })
  }
}
