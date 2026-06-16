import { PLAYS } from '../data/plays'
import type { Genre } from '../types'

const GENRE_LABEL: Record<Genre, string> = {
  comedy: 'Comedy', history: 'History', tragedy: 'Tragedy', romance: 'Romance',
}

export function PlayList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="playlist">
      <div className="hero">
        <h1 className="wordmark">The Living Stage</h1>
        <p className="tagline">All of Shakespeare, in order of writing — the full text, a modern gloss beside it, and the scene played out on a little stage as you read.</p>
      </div>

      <ol className="play-rows">
        {PLAYS.map((p, idx) => (
          <li key={p.id}>
            <button
              className={`play-row ${p.available ? '' : 'locked'} g-${p.genre}`}
              onClick={() => p.available && onOpen(p.id)}
              disabled={!p.available}
            >
              <span className="play-num">{idx + 1}</span>
              <span className="play-main">
                <span className="play-title">{p.title}</span>
                {p.blurb && <span className="play-blurb">{p.blurb}</span>}
              </span>
              <span className="play-meta">
                <span className={`genre-tag g-${p.genre}`}>{GENRE_LABEL[p.genre]}</span>
                <span className="play-year">c. {p.year}</span>
                {p.available ? <span className="play-go">Read ›</span> : <span className="play-soon">soon</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="list-foot">Then the 154 sonnets — and after those, the poetry, wit, philosophy, and scripture you've been collecting.</p>
    </div>
  )
}
