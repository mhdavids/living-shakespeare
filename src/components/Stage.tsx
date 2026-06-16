import { charDesign } from '../lib/staging'

const SKIN = ['#f1c9a5', '#e0aa7c', '#c68642', '#8d5524', '#ffdbac', '#a86b3c']

/** Pick a backdrop scene from the setting text. */
function Backdrop({ setting }: { setting: string }) {
  const s = setting.toLowerCase()
  if (/garden|orchard|wood|forest|grove|field/.test(s)) return <Trees />
  if (/palace|court|duke|throne|chamber|hall/.test(s)) return <Columns />
  if (/abbey|friar|cell|monastery|church|nunnery/.test(s)) return <Arches />
  if (/sea|ship|coast|shore|harbour|harbor/.test(s)) return <Waves />
  if (/prison|jail/.test(s)) return <Bars />
  if (/street|open place|road|highway|verona|milan|mantua|town|city|the same/.test(s)) return <Houses />
  return <Curtain />
}

const Trees = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />
    {[40, 360, 120, 300].map((x, i) => (
      <g key={i} transform={`translate(${x},${190 - (i % 2) * 14})`}>
        <rect x="-6" y="0" width="12" height="48" fill="#6b4a2b" rx="3" />
        <circle cx="0" cy="-6" r="34" fill={i % 2 ? '#4f7a3a' : '#5d8a44'} />
        <circle cx="-22" cy="8" r="22" fill="#557f3d" />
        <circle cx="22" cy="8" r="22" fill="#4f7a3a" />
      </g>
    ))}
  </g>
)
const Columns = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="url(#hall)" />
    {[60, 150, 250, 340].map((x, i) => (
      <g key={i}>
        <rect x={x - 14} y="40" width="28" height="180" fill="#d8cdb6" />
        <rect x={x - 20} y="30" width="40" height="14" fill="#c3b596" />
        <rect x={x - 20} y="216" width="40" height="14" fill="#c3b596" />
      </g>
    ))}
  </g>
)
const Houses = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />
    {[[20, 150, '#caa46a'], [120, 120, '#b98c54'], [250, 140, '#c9a36a'], [330, 110, '#a87f4d']].map(([x, h, c], i) => (
      <g key={i}>
        <rect x={x as number} y={230 - (h as number)} width="70" height={h as number} fill={c as string} />
        <polygon points={`${x},${230 - (h as number)} ${(x as number) + 35},${200 - (h as number)} ${(x as number) + 70},${230 - (h as number)}`} fill="#7a4b32" />
        <rect x={(x as number) + 26} y={190} width="18" height="40" fill="#5a3c28" />
      </g>
    ))}
  </g>
)
const Arches = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="url(#hall)" />
    {[70, 200, 330].map((x, i) => (
      <path key={i} d={`M${x - 36} 220 V120 a36 36 0 0 1 72 0 V220`} fill="none" stroke="#cabfa4" strokeWidth="12" />
    ))}
  </g>
)
const Waves = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />
    <rect x="0" y="170" width="400" height="130" fill="#3f6f8f" />
    {[185, 205, 225].map((y, i) => (
      <path key={i} d={`M0 ${y} q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} fill="none" stroke="#5e8aa6" strokeWidth="4" opacity="0.7" />
    ))}
  </g>
)
const Bars = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="#2b2622" />
    {[80, 140, 200, 260, 320].map(x => <rect key={x} x={x} y="20" width="8" height="210" fill="#5a5048" />)}
  </g>
)
const Curtain = () => (
  <g>
    <rect x="0" y="0" width="400" height="300" fill="#5a1722" />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={i * 46} y="0" width="30" height="300" fill="#6e1e2c" opacity={i % 2 ? 0.5 : 0.8} rx="14" />
    ))}
  </g>
)

function Puppet({ name, x, scale, speaking }: { name: string; x: number; scale: number; speaking: boolean }) {
  const d = charDesign(name)
  const body = `hsl(${d.hue} 52% 46%)`
  const trim = `hsl(${d.hue} 52% 60%)`
  const hair = `hsl(${(d.hue + 30) % 360} 30% 22%)`
  const skin = SKIN[Math.abs(d.hue * 7) % SKIN.length]
  return (
    <g transform={`translate(${x},230) scale(${scale})`} className={`puppet ${speaking ? 'speaking' : ''}`}>
      <ellipse cx="0" cy="2" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
      <g className="puppet-body">
        {/* legs */}
        <rect x="-9" y="-30" width="7" height="32" rx="3" fill="#3a2f28" />
        <rect x="2" y="-30" width="7" height="32" rx="3" fill="#3a2f28" />
        {/* body: dress or tunic */}
        {d.female
          ? <path d="M-22 -2 L-9 -58 H9 L22 -2 Z" fill={body} stroke={trim} strokeWidth="2" />
          : <rect x="-15" y="-58" width="30" height="58" rx="8" fill={body} stroke={trim} strokeWidth="2" />}
        {/* arms */}
        <rect x="-24" y="-56" width="9" height="34" rx="4" fill={body} transform="rotate(12 -20 -50)" />
        <rect x="15" y="-56" width="9" height="34" rx="4" fill={body} transform="rotate(-12 20 -50)" />
        {/* head */}
        <circle cx="0" cy="-72" r="15" fill={skin} />
        <path d={d.female ? 'M-16 -74 a16 16 0 0 1 32 0 q-16 -16 -32 0' : 'M-15 -78 a15 13 0 0 1 30 0 Z'} fill={hair} />
        {/* eyes */}
        <circle cx="-5" cy="-73" r="1.7" fill="#2a2320" />
        <circle cx="5" cy="-73" r="1.7" fill="#2a2320" />
        {/* mouth */}
        <ellipse className="mouth" cx="0" cy="-66" rx="3" ry="1.4" fill="#7a2b2b" />
      </g>
      <text x="0" y="22" textAnchor="middle" className="puppet-label">{d.label}</text>
    </g>
  )
}

export function Stage({ onstage, speaker, setting }: { onstage: string[]; speaker?: string; setting: string }) {
  const n = onstage.length
  const span = 300
  const left = 50
  const scale = n > 6 ? 0.62 : n > 4 ? 0.78 : 0.95
  return (
    <div className="stage">
      <svg viewBox="0 0 400 300" className="stage-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bcd6e6" /><stop offset="1" stopColor="#e7d8b8" />
          </linearGradient>
          <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6b5f4d" /><stop offset="1" stopColor="#8a7c63" />
          </linearGradient>
        </defs>
        <Backdrop setting={setting} />
        {/* stage floor */}
        <rect x="0" y="228" width="400" height="72" fill="#7a5436" />
        <rect x="0" y="228" width="400" height="4" fill="#9a6b44" />
        {onstage.map((name, i) => {
          const x = n === 1 ? 200 : left + (span * i) / (n - 1)
          return <Puppet key={name} name={name} x={x} scale={scale} speaking={name === speaker} />
        })}
        {n === 0 && <text x="200" y="150" textAnchor="middle" className="empty-stage">— empty stage —</text>}
      </svg>
      <p className="stage-setting">{setting || 'A stage'}</p>
    </div>
  )
}
