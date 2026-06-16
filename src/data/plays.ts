import type { PlayMeta, PlayText, Translations } from '../types'
import twoGentlemenJson from './plays/two-gentlemen.json'
import { twoGentlemenModern } from './translations/two-gentlemen'

/**
 * All the plays in (approximate) order of composition — the Oxford/Folger
 * chronology. `available` flips to true as each play's text is wired in;
 * reading proceeds top to bottom.
 */
export const PLAYS: PlayMeta[] = [
  { id: 'two-gentlemen', title: 'The Two Gentlemen of Verona', year: 1590, genre: 'comedy', available: true, blurb: 'Two friends, one city apart, undone by the same woman — Shakespeare\'s first comedy, and his first run at love and betrayal.' },
  { id: 'taming-shrew', title: 'The Taming of the Shrew', year: 1591, genre: 'comedy', available: false },
  { id: 'henry-vi-2', title: 'Henry VI, Part 2', year: 1591, genre: 'history', available: false },
  { id: 'henry-vi-3', title: 'Henry VI, Part 3', year: 1591, genre: 'history', available: false },
  { id: 'henry-vi-1', title: 'Henry VI, Part 1', year: 1592, genre: 'history', available: false },
  { id: 'titus', title: 'Titus Andronicus', year: 1592, genre: 'tragedy', available: false },
  { id: 'richard-iii', title: 'Richard III', year: 1593, genre: 'history', available: false },
  { id: 'comedy-errors', title: 'The Comedy of Errors', year: 1594, genre: 'comedy', available: false },
  { id: 'loves-labours', title: "Love's Labour's Lost", year: 1594, genre: 'comedy', available: false },
  { id: 'richard-ii', title: 'Richard II', year: 1595, genre: 'history', available: false },
  { id: 'romeo-juliet', title: 'Romeo and Juliet', year: 1595, genre: 'tragedy', available: false },
  { id: 'midsummer', title: "A Midsummer Night's Dream", year: 1595, genre: 'comedy', available: false },
  { id: 'king-john', title: 'King John', year: 1596, genre: 'history', available: false },
  { id: 'merchant', title: 'The Merchant of Venice', year: 1596, genre: 'comedy', available: false },
  { id: 'henry-iv-1', title: 'Henry IV, Part 1', year: 1597, genre: 'history', available: false },
  { id: 'merry-wives', title: 'The Merry Wives of Windsor', year: 1597, genre: 'comedy', available: false },
  { id: 'henry-iv-2', title: 'Henry IV, Part 2', year: 1598, genre: 'history', available: false },
  { id: 'much-ado', title: 'Much Ado About Nothing', year: 1598, genre: 'comedy', available: false },
  { id: 'henry-v', title: 'Henry V', year: 1599, genre: 'history', available: false },
  { id: 'julius-caesar', title: 'Julius Caesar', year: 1599, genre: 'tragedy', available: false },
  { id: 'as-you-like-it', title: 'As You Like It', year: 1599, genre: 'comedy', available: false },
  { id: 'hamlet', title: 'Hamlet', year: 1600, genre: 'tragedy', available: false },
  { id: 'twelfth-night', title: 'Twelfth Night', year: 1601, genre: 'comedy', available: false },
  { id: 'troilus', title: 'Troilus and Cressida', year: 1602, genre: 'tragedy', available: false },
  { id: 'measure', title: 'Measure for Measure', year: 1603, genre: 'comedy', available: false },
  { id: 'othello', title: 'Othello', year: 1603, genre: 'tragedy', available: false },
  { id: 'alls-well', title: "All's Well That Ends Well", year: 1604, genre: 'comedy', available: false },
  { id: 'timon', title: 'Timon of Athens', year: 1605, genre: 'tragedy', available: false },
  { id: 'king-lear', title: 'King Lear', year: 1605, genre: 'tragedy', available: false },
  { id: 'macbeth', title: 'Macbeth', year: 1606, genre: 'tragedy', available: false },
  { id: 'antony', title: 'Antony and Cleopatra', year: 1606, genre: 'tragedy', available: false },
  { id: 'pericles', title: 'Pericles', year: 1607, genre: 'romance', available: false },
  { id: 'coriolanus', title: 'Coriolanus', year: 1608, genre: 'tragedy', available: false },
  { id: 'winters-tale', title: "The Winter's Tale", year: 1609, genre: 'romance', available: false },
  { id: 'cymbeline', title: 'Cymbeline', year: 1610, genre: 'romance', available: false },
  { id: 'tempest', title: 'The Tempest', year: 1611, genre: 'romance', available: false },
  { id: 'henry-viii', title: 'Henry VIII', year: 1613, genre: 'history', available: false },
  { id: 'two-noble-kinsmen', title: 'The Two Noble Kinsmen', year: 1613, genre: 'romance', available: false },
]

const TEXTS: Record<string, PlayText> = {
  'two-gentlemen': twoGentlemenJson as PlayText,
}

const MODERN: Record<string, Translations> = {
  'two-gentlemen': twoGentlemenModern,
}

export function getPlayText(id: string): PlayText | undefined {
  return TEXTS[id]
}

export function getModern(id: string): Translations {
  return MODERN[id] ?? {}
}

export function playMeta(id: string): PlayMeta | undefined {
  return PLAYS.find(p => p.id === id)
}
