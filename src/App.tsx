import { useState } from 'react'
import { PlayList } from './views/PlayList'
import { Reader } from './views/Reader'

type Route = { view: 'list' } | { view: 'reader'; playId: string; sceneIdx: number }

export default function App() {
  const [route, setRoute] = useState<Route>({ view: 'list' })

  if (route.view === 'reader') {
    return (
      <Reader
        playId={route.playId}
        sceneIdx={route.sceneIdx}
        onScene={i => { setRoute({ ...route, sceneIdx: i }); window.scrollTo({ top: 0 }) }}
        onExit={() => setRoute({ view: 'list' })}
      />
    )
  }
  return <PlayList onOpen={id => setRoute({ view: 'reader', playId: id, sceneIdx: 0 })} />
}
