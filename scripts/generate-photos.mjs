// Procedurally generates 24 abstract "evidence" images (4 categories x 6) as WebP.
// Deterministic and idempotent: re-running overwrites files with identical output.
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const OUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'photos')
const W = 1200
const H = 900
const SIZES = [400, 1200]
const QUALITY = 70

const PALETTES = [
  { name: 'deep blue', from: '#0b3d91', to: '#1e6fd9' },
  { name: 'forest green', from: '#145a32', to: '#2e9e5b' },
  { name: 'burnt orange', from: '#8a3b05', to: '#e07b1a' },
  { name: 'royal purple', from: '#4a1f7a', to: '#8e55d1' },
  { name: 'crimson red', from: '#7a1020', to: '#d23b4f' },
  { name: 'teal', from: '#0b5c63', to: '#1fb0b8' },
]

const CATEGORIES = {
  documents: { prefix: 'DOC', motif: documentsMotif },
  devices: { prefix: 'DEV', motif: devicesMotif },
  locations: { prefix: 'LOC', motif: locationsMotif },
  exhibits: { prefix: 'EXH', motif: exhibitsMotif },
}

const rect = (x, y, w, h, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`

function documentsMotif(i) {
  const sheets = [0, 1, 2].map((n) => {
    const x = 330 + n * 40 + i * 6
    const y = 150 + n * 30
    const lines = Array.from({ length: 8 }, (_, l) =>
      rect(x + 40, y + 60 + l * 48, l % 3 === 2 ? 220 : 340, 14, 'rx="7" fill="#9aa5b1"'),
    ).join('')
    return `<g transform="rotate(${(n - 1) * 3 + (i - 3)} 600 450)">${rect(x, y, 440, 560, 'rx="12" fill="#ffffff" fill-opacity="0.95"')}${lines}</g>`
  })
  return sheets.join('')
}

function devicesMotif(i) {
  const shift = i * 8
  return `
    ${rect(220 + shift, 230, 560, 360, 'rx="20" fill="#14181d"')}
    ${rect(244 + shift, 254, 512, 312, 'rx="8" fill="#e8f1ff"')}
    ${rect(180 + shift, 590, 640, 26, 'rx="13" fill="#2a3138"')}
    ${rect(780 - shift / 2, 330, 190, 340, 'rx="28" fill="#14181d"')}
    ${rect(796 - shift / 2, 362, 158, 276, 'rx="8" fill="#e8f1ff"')}
    <circle cx="${875 - shift / 2}" cy="${650}" r="9" fill="#9aa5b1"/>`
}

function locationsMotif(i) {
  const grid = Array.from({ length: 7 }, (_, n) =>
    `<line x1="${150 + n * 150}" y1="120" x2="${150 + n * 150}" y2="700" stroke="#ffffff" stroke-opacity="0.25" stroke-width="6"/>` +
    `<line x1="150" y1="${120 + n * 100}" x2="1050" y2="${120 + n * 100}" stroke="#ffffff" stroke-opacity="0.25" stroke-width="6"/>`,
  ).join('')
  const px = 420 + i * 60
  return `${grid}
    <path d="M150 620 Q500 ${420 + i * 15} 1050 320" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="14" stroke-linecap="round"/>
    <path d="M${px} 200 C${px - 90} 200 ${px - 110} 330 ${px} 470 C${px + 110} 330 ${px + 90} 200 ${px} 200Z" fill="#ffffff"/>
    <circle cx="${px}" cy="320" r="42" fill="#14181d"/>`
}

function exhibitsMotif(i) {
  const cx = 470 + i * 20
  return `
    ${rect(220, 300, 420, 300, 'rx="14" fill="#ffffff" fill-opacity="0.95"')}
    ${rect(220, 300, 420, 70, 'rx="14" fill="#14181d" fill-opacity="0.75"')}
    <circle cx="170" cy="335" r="22" fill="#ffffff"/>
    ${rect(270, 410, 320, 16, 'rx="8" fill="#9aa5b1"')}
    ${rect(270, 460, 240, 16, 'rx="8" fill="#9aa5b1"')}
    <circle cx="${cx + 230}" cy="470" r="120" fill="#ffffff" fill-opacity="0.2" stroke="#ffffff" stroke-width="24"/>
    <line x1="${cx + 316}" y1="556" x2="${cx + 440}" y2="680" stroke="#ffffff" stroke-width="30" stroke-linecap="round"/>`
}

function buildSvg(category, index) {
  const { prefix, motif } = CATEGORIES[category]
  const palette = PALETTES[index]
  const label = `EXHIBIT ${prefix}-${String(index + 1).padStart(2, '0')}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.from}"/>
      <stop offset="1" stop-color="${palette.to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${motif(index)}
  <rect x="0" y="780" width="${W}" height="120" fill="#000000" fill-opacity="0.45"/>
  <text x="60" y="855" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700" fill="#ffffff" letter-spacing="4">${label}</text>
</svg>`
}

await mkdir(OUT_DIR, { recursive: true })
let count = 0
for (const category of Object.keys(CATEGORIES)) {
  for (let i = 0; i < 6; i++) {
    const id = `${CATEGORIES[category].prefix.toLowerCase().slice(0, 3)}-${String(i + 1).padStart(2, '0')}`
    const svg = Buffer.from(buildSvg(category, i))
    for (const size of SIZES) {
      await sharp(svg, { density: 72 })
        .resize(size, Math.round((size * H) / W))
        .webp({ quality: QUALITY })
        .toFile(path.join(OUT_DIR, `${id}-${size}.webp`))
      count++
    }
  }
}
console.log(`Generated ${count} files in ${path.relative(process.cwd(), OUT_DIR)}`)
