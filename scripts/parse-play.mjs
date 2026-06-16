// Parse a TheMITTech/MIT "full.html" Shakespeare play into structured JSON.
// Usage: node parse-play.mjs <input.html> <playId> <out.json>
import { readFileSync, writeFileSync } from 'node:fs'

const [, , inPath, playId, outPath] = process.argv
const html = readFileSync(inPath, 'utf8')

const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 }
function roman(s) {
  let n = 0
  for (let i = 0; i < s.length; i++) {
    const cur = ROMAN[s[i]], next = ROMAN[s[i + 1]] || 0
    n += cur < next ? -cur : cur
  }
  return n
}
function decode(s) {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&rsquo;|&#8217;/g, '’').replace(/&lsquo;|&#8216;/g, '‘')
    .replace(/&rdquo;/g, '”').replace(/&ldquo;/g, '“')
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/&hyphen;/g, '-').replace(/&[a-z]+;/gi, '')
    .trim()
}

const lines = html.split('\n')
const scenes = []
let cur = null            // current scene
let curSpeech = null      // current speech unit
let act = 0
const characters = new Set()

function pushStage(text) {
  if (!cur) return
  curSpeech = null
  cur.units.push({ kind: 'stage', text })
}

for (const raw of lines) {
  const line = raw.trim()
  if (!line) continue

  let m
  if ((m = line.match(/<H3>\s*ACT\s+([IVXLC]+)/i))) { act = roman(m[1].toUpperCase()); continue }
  if ((m = line.match(/<h3>\s*SCENE\s+([IVXLC]+)\.?\s*(.*?)<\/h3>/i))) {
    cur = { act, scene: roman(m[1].toUpperCase()), setting: decode(m[2]), units: [] }
    curSpeech = null
    scenes.push(cur)
    continue
  }
  // Prologue / Induction / Epilogue / Chorus etc. — a labelled section, not "SCENE N".
  if ((m = line.match(/<h3>\s*(.*?)\s*<\/h3>/i))) {
    const label = decode(m[1])
    if (label) {
      cur = { act, scene: 0, setting: '', label, units: [] }
      curSpeech = null
      scenes.push(cur)
    }
    continue
  }
  // Speaker heading: <A NAME=speechN><b>NAME</b></a>
  if ((m = line.match(/<A NAME=speech\d+>\s*<b>(.*?)<\/b>/i))) {
    const speaker = decode(m[1])
    characters.add(speaker)
    curSpeech = { kind: 'speech', speaker, lines: [] }
    if (cur) cur.units.push(curSpeech)
    continue
  }
  // Stage direction: a line that is (or contains) <i>...</i>
  if ((m = line.match(/<i>(.*?)<\/i>/i))) { pushStage(decode(m[1])); continue }
  // Spoken line: <A NAME=a.s.l>text</A>
  if ((m = line.match(/<A NAME=[\d.]+>(.*?)<\/A>/i))) {
    const text = decode(m[1])
    if (curSpeech) curSpeech.lines.push(text)
    else if (cur) cur.units.push({ kind: 'speech', speaker: '', lines: [text] })
    continue
  }
}

// Assign a per-scene speech index (for aligning translations).
for (const s of scenes) {
  let i = 0
  for (const u of s.units) if (u.kind === 'speech') u.i = i++
}

const out = {
  id: playId,
  scenes: scenes.map(s => ({ act: s.act, scene: s.scene, setting: s.setting, label: s.label, units: s.units })),
  characters: [...characters],
}
writeFileSync(outPath, JSON.stringify(out))

const speechCount = scenes.reduce((n, s) => n + s.units.filter(u => u.kind === 'speech').length, 0)
const lineCount = scenes.reduce((n, s) => n + s.units.reduce((k, u) => k + (u.lines?.length || 0), 0), 0)
console.error(`${playId}: ${scenes.length} scenes, ${speechCount} speeches, ${lineCount} spoken lines, ${characters.size} characters`)
console.error('scenes: ' + scenes.map(s => `${s.act}.${s.scene}`).join(' '))
console.error('characters: ' + [...characters].join(', '))
