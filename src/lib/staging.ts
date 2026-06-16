import type { Scene, Unit } from '../types'

/** Characters we draw in a dress rather than a tunic (cosmetic; spans many plays). */
const FEMALE = new Set([
  'JULIA', 'LUCETTA', 'SILVIA', 'HERMIA', 'HELENA', 'PORTIA', 'NERISSA', 'VIOLA', 'OLIVIA',
  'MARIA', 'BEATRICE', 'HERO', 'ROSALIND', 'CELIA', 'PHEBE', 'AUDREY', 'JULIET', 'NURSE',
  'OPHELIA', 'GERTRUDE', 'DESDEMONA', 'EMILIA', 'CORDELIA', 'REGAN', 'GONERIL', 'MIRANDA',
  'PERDITA', 'HERMIONE', 'PAULINA', 'CLEOPATRA', 'TITANIA', 'CRESSIDA', 'BIANCA', 'KATHARINA',
])

export interface CharDesign {
  hue: number
  female: boolean
  label: string
  initials: string
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

export function titleCase(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/\bOf\b|\bThe\b/g, w => w.toLowerCase())
}

export function charDesign(name: string): CharDesign {
  const key = name.toUpperCase()
  const hue = hash(key) % 360
  const label = titleCase(name)
  const words = label.split(/\s+/)
  const initials = (words.length > 1 ? words[0][0] + words[1][0] : label.slice(0, 2)).toUpperCase()
  return { hue, female: FEMALE.has(key), label, initials }
}

export interface Frame {
  onstage: string[]
  speaker?: string
}

/** Match play characters named in a stage direction (longest names first). */
function namedIn(text: string, chars: string[]): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []
  for (const c of [...chars].sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`\\b${c.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (re.test(lower)) found.push(c)
  }
  return found
}

/**
 * Walk a scene and compute, for each unit, which characters are on stage and
 * who (if anyone) is speaking — driven by Enter/Exit/Exeunt directions plus a
 * defensive "the speaker must be present" rule.
 */
export function computeStaging(scene: Scene, allChars: string[]): Frame[] {
  let onstage: string[] = []
  let lastSpeaker = ''
  const add = (names: string[]) => { for (const n of names) if (!onstage.includes(n)) onstage.push(n) }
  const remove = (names: string[]) => { onstage = onstage.filter(n => !names.includes(n)) }

  return scene.units.map((u: Unit) => {
    if (u.kind === 'stage') {
      const t = u.text ?? ''
      const lower = t.toLowerCase()
      const names = namedIn(t, allChars)
      if (/\bexeunt\b/.test(lower)) {
        if (names.length) remove(names); else onstage = []
      } else if (/\bexit\b/.test(lower)) {
        if (names.length) remove(names); else if (lastSpeaker) remove([lastSpeaker])
      }
      if (/\benter\b|\bre-enter\b/.test(lower)) add(names)
      return { onstage: [...onstage] }
    }
    // speech
    const sp = u.speaker ?? ''
    if (sp && !onstage.includes(sp)) onstage.push(sp)
    lastSpeaker = sp
    return { onstage: [...onstage], speaker: sp }
  })
}
