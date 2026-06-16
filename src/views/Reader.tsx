import { useMemo, useRef, useState, useEffect } from 'react'
import { getPlayText, getModern, playMeta } from '../data/plays'
import { computeStaging, titleCase } from '../lib/staging'
import { Stage } from '../components/Stage'

export function Reader({ playId, sceneIdx, onScene, onExit }: {
  playId: string
  sceneIdx: number
  onScene: (i: number) => void
  onExit: () => void
}) {
  const play = getPlayText(playId)!
  const modern = getModern(playId)
  const meta = playMeta(playId)!
  const scene = play.scenes[sceneIdx]
  const frames = useMemo(() => computeStaging(scene, play.characters), [scene, play.characters])

  const speechUnitIdxs = useMemo(
    () => scene.units.map((u, i) => (u.kind === 'speech' ? i : -1)).filter(i => i >= 0),
    [scene],
  )
  const [active, setActive] = useState(speechUnitIdxs[0] ?? 0)
  const [showModern, setShowModern] = useState(true)
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({})

  // Reset to the top of each new scene.
  useEffect(() => { setActive(speechUnitIdxs[0] ?? 0) }, [sceneIdx]) // eslint-disable-line

  const frame = frames[active] ?? { onstage: [] }

  function step(dir: 1 | -1) {
    const pos = speechUnitIdxs.indexOf(active)
    const next = speechUnitIdxs[Math.min(speechUnitIdxs.length - 1, Math.max(0, pos + dir))]
    if (next != null) {
      setActive(next)
      rowRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const sceneLabel = `Act ${scene.act}, Scene ${scene.scene}`
  const hasModernAny = speechUnitIdxs.some(i => modern[`${scene.act}.${scene.scene}.${scene.units[i].i}`])

  return (
    <div className="reader">
      <header className="reader-top">
        <button className="link" onClick={onExit}>‹ All plays</button>
        <span className="reader-title">{meta.title}</span>
        <button className={`modern-toggle ${showModern ? 'on' : ''}`} onClick={() => setShowModern(m => !m)}>
          Modern
        </button>
      </header>

      <div className="stage-wrap">
        <Stage onstage={frame.onstage} speaker={frame.speaker} setting={scene.setting} />
        <div className="scene-bar">
          <button className="nav-btn" disabled={sceneIdx === 0} onClick={() => onScene(sceneIdx - 1)}>‹</button>
          <span className="scene-label">{sceneLabel}</span>
          <button className="nav-btn" disabled={sceneIdx === play.scenes.length - 1} onClick={() => onScene(sceneIdx + 1)}>›</button>
        </div>
        <div className="step-bar">
          <button className="nav-btn small" onClick={() => step(-1)}>▲ prev line</button>
          <button className="nav-btn small" onClick={() => step(1)}>next line ▼</button>
        </div>
      </div>

      <div className="script">
        {!hasModernAny && showModern && (
          <p className="gloss-note">Modern gloss is being written scene by scene — the original is complete; tap any speech to stage it.</p>
        )}
        {scene.units.map((u, i) => {
          if (u.kind === 'stage') {
            return <p key={i} className="stage-dir">[ {u.text} ]</p>
          }
          const key = `${scene.act}.${scene.scene}.${u.i}`
          const gloss = modern[key]
          return (
            <div
              key={i}
              ref={el => { rowRefs.current[i] = el }}
              className={`speech ${active === i ? 'active' : ''} ${u.speaker ? '' : 'cont'}`}
              onClick={() => setActive(i)}
            >
              {u.speaker && <div className="speech-speaker">{titleCase(u.speaker)}</div>}
              <div className="speech-body">
                <div className="orig">
                  {(u.lines || []).map((l, k) => <span className="vline" key={k}>{l}</span>)}
                </div>
                {showModern && gloss && <div className="modern">{gloss}</div>}
              </div>
            </div>
          )
        })}
        <div className="script-end">
          {sceneIdx < play.scenes.length - 1
            ? <button className="btn" onClick={() => onScene(sceneIdx + 1)}>Next scene · Act {play.scenes[sceneIdx + 1].act}, Scene {play.scenes[sceneIdx + 1].scene} ›</button>
            : <p className="muted">End of the play. <button className="link" onClick={onExit}>Back to all plays ›</button></p>}
        </div>
      </div>
    </div>
  )
}
