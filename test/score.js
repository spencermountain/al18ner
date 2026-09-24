import { languages, readCorpus, checkSpec } from './corpus.js'

const useColor = process.env.NO_COLOR === undefined && (
  process.env.FORCE_COLOR !== undefined
    ? process.env.FORCE_COLOR !== '0'
    : Boolean(process.stdout.isTTY)
)
const color = (code, text) => useColor ? `\x1b[${code}m${text}\x1b[0m` : text
const number = new Intl.NumberFormat('en-US')
const scores = []
const accuracyColor = accuracy => {
  if (accuracy === null) return '90'
  if (accuracy < 50) return '31' // same red as failures
  if (accuracy < 75) return '38;5;178' // amber
  if (accuracy < 90) return '38;5;108' // soft sage
  return '32' // terminal green, matching passes
}
for (const language of languages) {
  let total = 0
  let passed = 0
  let errors = 0
  try {
    const packageName = language === 'en' ? 'compromise' : `${language}-compromise`
    const { default: nlp } = await import(packageName)
    for (const { source, sentences } of readCorpus(language)) {
      for (const { spec, line } of sentences) {
        total += 1
        try {
          if (checkSpec(nlp, spec).passed) passed += 1
        } catch (error) {
          errors += 1
          process.stderr.write(`${source}:${line}: ${error.message}\n`)
        }
      }
    }
  } catch (error) {
    errors += 1
    process.stderr.write(`${language}: ${error.message}\n`)
  }
  if (errors) process.exitCode = 1
  scores.push({ language, total, passed, accuracy: total ? 100 * passed / total : null })
}

// Sort and color by the full precision score; round only for display.
scores.sort((a, b) => (b.accuracy ?? -1) - (a.accuracy ?? -1))
const rows = [
  ['lang', 'Accuracy', 'Passed', 'Failed', 'Sentences'],
  ...scores.map(({ language, total, passed, accuracy }) => [
    language, accuracy === null ? 'N/A' : `${Math.round(accuracy)}%`,
    number.format(passed), number.format(total - passed), number.format(total),
  ]),
]
const widths = rows[0].map((_, i) => Math.max(...rows.map(row => row[i].length)))
const border = (left, middle, right) => color('90',
  left + widths.map(width => '─'.repeat(width + 2)).join(middle) + right)
const divider = color('90', '│')
const format = (row, header = false, accuracy = null) => divider + ' ' + row.map((cell, i) => {
  // Pad before adding ANSI escapes so colors do not affect column alignment.
  const padded = i === 0 ? cell.padEnd(widths[i]) : cell.padStart(widths[i])
  if (header) return color('2;37', padded)
  if (i === 0) return color('1;33', padded)
  if (i === 1) return color(accuracyColor(accuracy), padded)
  if (i === 2) return color('2;32', padded)
  if (i === 3) return color(cell === '0' ? '90' : '2;31', padded)
  return color('2', padded)
}).join(` ${divider} `) + ' ' + divider
process.stdout.write(
  [
    '',
    color('1', 'Sentence accuracy'),
    color('90', 'Passing testSpec / total sentences'),
    '',
    border('╭', '┬', '╮'),
    format(rows[0], true),
    border('├', '┼', '┤'),
    ...rows.slice(1).map((row, i) => format(row, false, scores[i].accuracy)),
    border('╰', '┴', '╯'),
    ''
  ]
    .map((line) => (line ? `  ${line}` : line))
    .join('\n') + '\n'
)
