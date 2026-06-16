export interface Unit {
  kind: 'stage' | 'speech'
  /** stage-direction text (kind === 'stage') */
  text?: string
  /** speaker (kind === 'speech') */
  speaker?: string
  /** spoken lines, verse/prose (kind === 'speech') */
  lines?: string[]
  /** index among speeches in this scene, for aligning translations */
  i?: number
}

export interface Scene {
  act: number
  scene: number
  setting: string
  units: Unit[]
}

export interface PlayText {
  id: string
  scenes: Scene[]
  characters: string[]
}

export type Genre = 'comedy' | 'history' | 'tragedy' | 'romance'

export interface PlayMeta {
  id: string
  title: string
  /** approximate year of composition (Oxford/Folger chronology) */
  year: number
  genre: Genre
  available: boolean
  blurb?: string
}

/** Modern-English gloss, keyed by `${act}.${scene}.${speechIndex}`. */
export type Translations = Record<string, string>
