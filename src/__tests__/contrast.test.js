import { readFileSync } from 'node:fs'

const css = readFileSync('src/index.css', 'utf8')
const root = css.match(/:root\s*{([^}]*)}/)[1]

function token(name) {
  const match = root.match(new RegExp(`--${name}: *(#[0-9a-fA-F]{6})`))
  if (!match) throw new Error(`Missing color token --${name}`)
  return match[1]
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('color contrast (WCAG 2.2 AA)', () => {
  const textPairs = [
    ['text', 'bg'],
    ['text', 'surface'],
    ['muted', 'bg'],
    ['muted', 'surface'],
    ['accent', 'bg'],
    ['accent', 'surface'],
    ['accent-contrast', 'accent'],
  ]
  it.each(textPairs)('text --color-%s on --color-%s is >= 4.5:1', (fg, bg) => {
    expect(ratio(token(`color-${fg}`), token(`color-${bg}`))).toBeGreaterThanOrEqual(4.5)
  })

  const uiPairs = [
    ['control-border', 'bg'],
    ['control-border', 'surface'],
    ['accent', 'bg'],
    ['accent', 'surface'],
  ]
  it.each(uiPairs)('UI component --color-%s on --color-%s is >= 3:1', (fg, bg) => {
    expect(ratio(token(`color-${fg}`), token(`color-${bg}`))).toBeGreaterThanOrEqual(3)
  })
})
