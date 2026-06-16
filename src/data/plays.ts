import type { PlayMeta, PlayText, Translations } from '../types'

/**
 * All the plays in (approximate) order of composition — the Oxford/Folger
 * chronology. Each play's text is a separate lazily-loaded chunk (6.7 MB of
 * JSON across the canon — far too much to ship in the initial bundle), so the
 * index stays light and a play loads only when opened.
 */
const RAW: Omit<PlayMeta, 'available'>[] = [
  { id: 'two-gentlemen', title: 'The Two Gentlemen of Verona', year: 1590, genre: 'comedy', blurb: 'Two friends, one city apart, undone by the same woman — Shakespeare\'s first comedy, and his first run at love and betrayal.' },
  { id: 'taming-shrew', title: 'The Taming of the Shrew', year: 1591, genre: 'comedy' },
  { id: 'henry-vi-2', title: 'Henry VI, Part 2', year: 1591, genre: 'history' },
  { id: 'henry-vi-3', title: 'Henry VI, Part 3', year: 1591, genre: 'history' },
  { id: 'henry-vi-1', title: 'Henry VI, Part 1', year: 1592, genre: 'history' },
  { id: 'titus', title: 'Titus Andronicus', year: 1592, genre: 'tragedy' },
  { id: 'richard-iii', title: 'Richard III', year: 1593, genre: 'history' },
  { id: 'comedy-errors', title: 'The Comedy of Errors', year: 1594, genre: 'comedy' },
  { id: 'loves-labours', title: "Love's Labour's Lost", year: 1594, genre: 'comedy' },
  { id: 'richard-ii', title: 'Richard II', year: 1595, genre: 'history' },
  { id: 'romeo-juliet', title: 'Romeo and Juliet', year: 1595, genre: 'tragedy' },
  { id: 'midsummer', title: "A Midsummer Night's Dream", year: 1595, genre: 'comedy' },
  { id: 'king-john', title: 'King John', year: 1596, genre: 'history' },
  { id: 'merchant', title: 'The Merchant of Venice', year: 1596, genre: 'comedy' },
  { id: 'henry-iv-1', title: 'Henry IV, Part 1', year: 1597, genre: 'history' },
  { id: 'merry-wives', title: 'The Merry Wives of Windsor', year: 1597, genre: 'comedy' },
  { id: 'henry-iv-2', title: 'Henry IV, Part 2', year: 1598, genre: 'history' },
  { id: 'much-ado', title: 'Much Ado About Nothing', year: 1598, genre: 'comedy' },
  { id: 'henry-v', title: 'Henry V', year: 1599, genre: 'history' },
  { id: 'julius-caesar', title: 'Julius Caesar', year: 1599, genre: 'tragedy' },
  { id: 'as-you-like-it', title: 'As You Like It', year: 1599, genre: 'comedy' },
  { id: 'hamlet', title: 'Hamlet', year: 1600, genre: 'tragedy' },
  { id: 'twelfth-night', title: 'Twelfth Night', year: 1601, genre: 'comedy' },
  { id: 'troilus', title: 'Troilus and Cressida', year: 1602, genre: 'tragedy' },
  { id: 'measure', title: 'Measure for Measure', year: 1603, genre: 'comedy' },
  { id: 'othello', title: 'Othello', year: 1603, genre: 'tragedy' },
  { id: 'alls-well', title: "All's Well That Ends Well", year: 1604, genre: 'comedy' },
  { id: 'timon', title: 'Timon of Athens', year: 1605, genre: 'tragedy' },
  { id: 'king-lear', title: 'King Lear', year: 1605, genre: 'tragedy' },
  { id: 'macbeth', title: 'Macbeth', year: 1606, genre: 'tragedy' },
  { id: 'antony', title: 'Antony and Cleopatra', year: 1606, genre: 'tragedy' },
  { id: 'pericles', title: 'Pericles', year: 1607, genre: 'romance' },
  { id: 'coriolanus', title: 'Coriolanus', year: 1608, genre: 'tragedy' },
  { id: 'winters-tale', title: "The Winter's Tale", year: 1609, genre: 'romance' },
  { id: 'cymbeline', title: 'Cymbeline', year: 1610, genre: 'romance' },
  { id: 'tempest', title: 'The Tempest', year: 1611, genre: 'romance' },
  { id: 'henry-viii', title: 'Henry VIII', year: 1613, genre: 'history' },
  { id: 'two-noble-kinsmen', title: 'The Two Noble Kinsmen', year: 1613, genre: 'romance' },
]

// Lazy chunks: each play's JSON / translation file loads on demand.
const playGlob = import.meta.glob('./plays/*.json')
const modernGlob = import.meta.glob('./translations/*.ts')
const idFromPath = (p: string) => p.slice(p.lastIndexOf('/') + 1).replace(/\.(json|ts)$/, '')

export const AVAILABLE: Set<string> = new Set(Object.keys(playGlob).map(idFromPath))

export const PLAYS: PlayMeta[] = RAW.map(p => ({ ...p, available: AVAILABLE.has(p.id) }))

export function playMeta(id: string): PlayMeta | undefined {
  return PLAYS.find(p => p.id === id)
}

export async function loadPlay(id: string): Promise<PlayText> {
  const fn = playGlob[`./plays/${id}.json`]
  if (!fn) throw new Error(`No text for play "${id}"`)
  const mod = (await fn()) as { default: PlayText }
  return mod.default
}

export async function loadModern(id: string): Promise<Translations> {
  const fn = modernGlob[`./translations/${id}.ts`]
  if (!fn) return {}
  const mod = (await fn()) as { default?: Translations }
  return mod.default ?? {}
}
