/* -------------------------------------------------------
   Epic Background — Tron grid + Jungle + Ships + Monsters
   ------------------------------------------------------- */
export default function Background() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ── Base gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 0%, rgba(57,211,83,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 80% 100%, rgba(168,85,247,0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 30% at 10% 80%, rgba(0,229,255,0.04) 0%, transparent 50%),
            #070d07
          `,
        }}
      />

      {/* ── Tron perspective grid ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.18 }}
      >
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39d353" stopOpacity="0" />
            <stop offset="40%" stopColor="#39d353" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#39d353" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="hGridFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#39d353" stopOpacity="0" />
            <stop offset="50%" stopColor="#39d353" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#39d353" stopOpacity="0" />
          </linearGradient>
          <filter id="gridGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Vertical converging lines */}
        {[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map((i) => (
          <line
            key={`v${i}`}
            x1={600 + i * 18}
            y1={320}
            x2={600 + i * 240}
            y2={800}
            stroke="url(#gridFade)"
            strokeWidth="0.8"
            filter="url(#gridGlow)"
          />
        ))}
        {/* Horizontal lines fading to horizon */}
        {[0,1,2,3,4,5,6,7,8].map((j) => {
          const y = 320 + (480 / 8) * Math.pow(j / 8, 0.5) * 8;
          const xLeft = 600 - (j + 1) * 240;
          const xRight = 600 + (j + 1) * 240;
          return (
            <line
              key={`h${j}`}
              x1={Math.max(0, xLeft)}
              y1={y}
              x2={Math.min(1200, xRight)}
              y2={y}
              stroke="url(#hGridFade)"
              strokeWidth="0.6"
              filter="url(#gridGlow)"
            />
          );
        })}
        {/* Horizon glow line */}
        <line x1="0" y1="320" x2="1200" y2="320" stroke="#39d353" strokeWidth="1.5" opacity="0.4" filter="url(#gridGlow)" />
      </svg>

      {/* ── Stars ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.6 }}>
        {[
          [80,40],[200,80],[340,25],[480,60],[620,35],[750,70],[900,45],[1050,85],[1120,30],
          [150,120],[310,95],[470,140],[640,110],[810,130],[980,100],[1100,155],
          [50,180],[220,160],[400,200],[580,170],[760,195],[930,175],[1080,210],
          [100,250],[280,230],[450,260],[700,240],[870,265],[1020,235],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 5 === 0 ? 1.2 : 0.7}
            fill={i % 7 === 0 ? '#a855f7' : i % 4 === 0 ? '#00e5ff' : '#39d353'}
            opacity={0.4 + (i % 3) * 0.2}
          >
            <animate
              attributeName="opacity"
              values={`${0.3 + (i % 3) * 0.2};${0.8 + (i % 2) * 0.1};${0.3 + (i % 3) * 0.2}`}
              dur={`${2.5 + (i % 4)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* ── Futuristic ship 1 — slow drift left to right ── */}
      <svg
        className="absolute ship-drift-1"
        viewBox="0 0 120 40"
        style={{ width: 120, top: '8%', left: '-130px', opacity: 0.55 }}
      >
        <defs>
          <filter id="shipGlow1"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g filter="url(#shipGlow1)">
          {/* Main hull */}
          <polygon points="10,20 90,12 110,20 90,28" fill="#0a1a0a" stroke="#39d353" strokeWidth="1.2" />
          {/* Cockpit */}
          <ellipse cx="85" cy="20" rx="14" ry="6" fill="#0d2a0d" stroke="#39d353" strokeWidth="1" />
          <ellipse cx="85" cy="20" rx="8" ry="3.5" fill="#00ff4120" />
          {/* Wing left */}
          <polygon points="30,20 60,28 50,36 20,22" fill="#091409" stroke="#39d35360" strokeWidth="0.8" />
          {/* Wing right */}
          <polygon points="30,20 60,12 50,4 20,18" fill="#091409" stroke="#39d35360" strokeWidth="0.8" />
          {/* Engine glow */}
          <ellipse cx="12" cy="20" rx="6" ry="4" fill="#39d35340" />
          <ellipse cx="12" cy="20" rx="3" ry="2" fill="#39d353" opacity="0.8" />
          {/* Accent lines */}
          <line x1="30" y1="20" x2="90" y2="16" stroke="#39d35350" strokeWidth="0.5" />
          <line x1="30" y1="20" x2="90" y2="24" stroke="#39d35350" strokeWidth="0.5" />
        </g>
      </svg>

      {/* ── Futuristic ship 2 — purple, faster, higher ── */}
      <svg
        className="absolute ship-drift-2"
        viewBox="0 0 80 28"
        style={{ width: 80, top: '18%', left: '-90px', opacity: 0.4 }}
      >
        <defs>
          <filter id="shipGlow2"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g filter="url(#shipGlow2)">
          <polygon points="5,14 65,8 75,14 65,20" fill="#0d0a1a" stroke="#a855f7" strokeWidth="1" />
          <ellipse cx="62" cy="14" rx="10" ry="5" fill="#1a0d2a" stroke="#a855f7" strokeWidth="0.8" />
          <ellipse cx="8" cy="14" rx="5" ry="3" fill="#a855f740" />
          <ellipse cx="8" cy="14" rx="2.5" ry="1.5" fill="#a855f7" opacity="0.9" />
        </g>
      </svg>

      {/* ── Jungle silhouettes (bottom) ── */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1200 260"
        preserveAspectRatio="xMidYMax slice"
        style={{ opacity: 0.45 }}
      >
        <defs>
          <linearGradient id="jungleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#112011" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#050d05" stopOpacity="1" />
          </linearGradient>
          <filter id="jungleGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Back layer — large trees */}
        <g fill="url(#jungleFill)" filter="url(#jungleGlow)">
          {/* Giant tree left */}
          <rect x="40" y="80" width="18" height="180" rx="3" />
          <ellipse cx="49" cy="75" rx="55" ry="70" />
          <ellipse cx="30" cy="95" rx="30" ry="45" />
          <ellipse cx="70" cy="90" rx="28" ry="40" />

          {/* Big tree center-left */}
          <rect x="220" y="100" width="14" height="160" rx="2" />
          <ellipse cx="227" cy="95" rx="45" ry="60" />
          <ellipse cx="210" cy="115" rx="25" ry="35" />

          {/* Tall tree center */}
          <rect x="500" y="60" width="20" height="200" rx="3" />
          <ellipse cx="510" cy="55" rx="60" ry="75" />
          <ellipse cx="490" cy="85" rx="35" ry="50" />
          <ellipse cx="535" cy="75" rx="35" ry="55" />

          {/* Tree center-right */}
          <rect x="760" y="90" width="16" height="170" rx="2" />
          <ellipse cx="768" cy="85" rx="50" ry="65" />
          <ellipse cx="748" cy="110" rx="28" ry="38" />

          {/* Giant tree right */}
          <rect x="1060" y="70" width="20" height="190" rx="3" />
          <ellipse cx="1070" cy="65" rx="58" ry="72" />
          <ellipse cx="1045" cy="90" rx="32" ry="48" />
          <ellipse cx="1095" cy="85" rx="30" ry="42" />

          {/* Small filler trees */}
          <rect x="140" y="130" width="10" height="130" rx="2" />
          <ellipse cx="145" cy="125" rx="30" ry="40" />

          <rect x="360" y="140" width="10" height="120" rx="2" />
          <ellipse cx="365" cy="135" rx="28" ry="38" />

          <rect x="640" y="120" width="12" height="140" rx="2" />
          <ellipse cx="646" cy="115" rx="35" ry="45" />

          <rect x="890" y="130" width="10" height="130" rx="2" />
          <ellipse cx="895" cy="125" rx="28" ry="38" />

          <rect x="980" y="150" width="8" height="110" rx="2" />
          <ellipse cx="984" cy="145" rx="22" ry="30" />
        </g>

        {/* Neon edge glow on tree tops */}
        <g fill="none" stroke="#39d353" strokeWidth="1.5" opacity="0.25" filter="url(#jungleGlow)">
          <ellipse cx="49" cy="75" rx="55" ry="70" />
          <ellipse cx="510" cy="55" rx="60" ry="75" />
          <ellipse cx="1070" cy="65" rx="58" ry="72" />
        </g>

        {/* Large tropical leaves foreground */}
        <g fill="#0d1f0d" stroke="#39d35325" strokeWidth="0.8">
          <path d="M0,260 Q40,180 0,120 Q-20,180 0,260Z" />
          <path d="M0,260 Q80,200 120,150 Q60,210 0,260Z" />
          <path d="M1200,260 Q1160,180 1200,120 Q1220,180 1200,260Z" />
          <path d="M1200,260 Q1120,200 1080,155 Q1140,215 1200,260Z" />
          <path d="M550,260 Q520,220 480,180 Q560,210 600,260Z" />
          <path d="M650,260 Q680,215 720,185 Q660,220 650,260Z" />
        </g>
      </svg>

      {/* ── Floating monsters / Occy spirits ── */}
      {/* Occy goblin — large, left side */}
      <div
        className="absolute monster-float-1"
        style={{ left: '3%', top: '30%', fontSize: '72px', opacity: 0.12, filter: 'drop-shadow(0 0 16px #39d353)' }}
      >
        🧌
      </div>
      {/* Small goblin — right */}
      <div
        className="absolute monster-float-2"
        style={{ right: '4%', top: '45%', fontSize: '48px', opacity: 0.1, filter: 'drop-shadow(0 0 12px #a855f7)' }}
      >
        🧌
      </div>
      {/* Alien — top right */}
      <div
        className="absolute monster-float-3"
        style={{ right: '12%', top: '12%', fontSize: '40px', opacity: 0.1, filter: 'drop-shadow(0 0 10px #00e5ff)' }}
      >
        👾
      </div>
      {/* Dragon — left mid */}
      <div
        className="absolute monster-float-1"
        style={{ left: '10%', top: '60%', fontSize: '56px', opacity: 0.08, filter: 'drop-shadow(0 0 12px #39d353)', animationDelay: '2s' }}
      >
        🐉
      </div>
      {/* Skull — center top */}
      <div
        className="absolute monster-float-2"
        style={{ left: '48%', top: '6%', fontSize: '36px', opacity: 0.1, filter: 'drop-shadow(0 0 10px #a855f7)', animationDelay: '1s' }}
      >
        💀
      </div>
      {/* Robot — right bottom */}
      <div
        className="absolute monster-float-3"
        style={{ right: '8%', bottom: '22%', fontSize: '44px', opacity: 0.08, filter: 'drop-shadow(0 0 10px #00e5ff)', animationDelay: '3s' }}
      >
        🤖
      </div>

      {/* ── Neon circuit lines (decoration) ── */}
      <svg
        className="absolute"
        viewBox="0 0 200 300"
        style={{ width: 200, left: 0, top: '25%', opacity: 0.1 }}
      >
        <g stroke="#39d353" strokeWidth="1" fill="none" filter="url(#gridGlow)">
          <path d="M0,50 H60 V100 H120 V80 H160" />
          <circle cx="60" cy="50" r="3" fill="#39d353" />
          <circle cx="120" cy="100" r="3" fill="#39d353" />
          <circle cx="160" cy="80" r="3" fill="#39d353" />
          <path d="M0,150 H40 V180 H80 V160 H140 V200" />
          <circle cx="40" cy="150" r="3" fill="#39d353" />
          <circle cx="80" cy="160" r="3" fill="#39d353" />
        </g>
      </svg>
      <svg
        className="absolute"
        viewBox="0 0 200 300"
        style={{ width: 200, right: 0, top: '35%', opacity: 0.1, transform: 'scaleX(-1)' }}
      >
        <g stroke="#a855f7" strokeWidth="1" fill="none">
          <path d="M0,60 H50 V110 H110 V90 H170" />
          <circle cx="50" cy="60" r="3" fill="#a855f7" />
          <circle cx="110" cy="110" r="3" fill="#a855f7" />
          <circle cx="170" cy="90" r="3" fill="#a855f7" />
          <path d="M0,160 H40 V190 H90 V170 H150" />
          <circle cx="40" cy="160" r="3" fill="#a855f7" />
          <circle cx="90" cy="170" r="3" fill="#a855f7" />
        </g>
      </svg>
    </div>
  );
}
