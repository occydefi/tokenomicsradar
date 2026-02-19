import { useState } from 'react';

interface ShareCardProps {
  tokenX: { name: string; symbol: string; price: number };
  tokenY: { name: string; symbol: string };
  projectedPrice: number;
  multiplier: number;
  pctChange: number;
  targetMC: number;
  mode: 'current' | 'ath';
  onClose: () => void;
}

function fmt(v: number) {
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (v >= 1) return '$' + v.toFixed(4);
  if (v >= 0.0001) return '$' + v.toFixed(6);
  return '$' + v.toExponential(3);
}
function fmtMC(v: number) {
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(2) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  return '$' + v.toLocaleString('en-US');
}

export default function ShareCard({
  tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode, onClose,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const isGain = multiplier >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';
  const sign = pctChange >= 0 ? '+' : '';

  const base = window.location.origin;

  // URL to server-generated OG image (1200x630 PNG)
  const ogParams = new URLSearchParams({
    symX: tokenX.symbol, symY: tokenY.symbol, mode,
    price: projectedPrice.toString(), mult: multiplier.toString(),
    pct: pctChange.toString(), mcY: targetMC.toString(),
  });
  const ogImageUrl = `${base}/api/og?${ogParams}`;

  // URL to share page (Twitter scrapes OG meta tags from this)
  const sharePageUrl = `${base}/api/share?${ogParams}`;

  // App URL (deep link back to simulator)
  const appUrl = `${base}/?sim=${tokenX.symbol}&ref=${tokenY.symbol}&mode=${mode}`;

  const tweetText = encodeURIComponent(
    `🔮 Se ${tokenX.symbol} tivesse o MC ${mode === 'ath' ? '(ATH) ' : ''}de ${tokenY.symbol}:\n` +
    `💰 ${fmt(projectedPrice)}  ${multiplier.toFixed(2)}X (${sign}${pctChange.toFixed(1)}%)\n\n` +
    sharePageUrl
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md flex flex-col gap-4">

        {/* ── BEAUTIFUL CARD (visual preview) ── */}
        <div style={{
          background: 'linear-gradient(145deg, #060d06 0%, #0a1a0f 50%, #08101a 100%)',
          border: `1.5px solid ${accent}50`,
          borderRadius: '20px',
          padding: '28px 28px 20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 0 60px ${accent}25, 0 0 120px rgba(168,85,247,0.08)`,
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        }}>
          {/* Scan lines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,211,83,0.012) 3px, rgba(57,211,83,0.012) 6px)',
          }} />
          {/* Corner dots */}
          {[[12,undefined,12,undefined],[12,undefined,undefined,12],[undefined,12,12,undefined],[undefined,12,undefined,12]].map(([top,bottom,left,right], i) => (
            <div key={i} style={{ position:'absolute', width:7, height:7, borderRadius:'50%', top, bottom, left, right, backgroundColor: accent, opacity:0.5, boxShadow:`0 0 5px ${accent}` }} />
          ))}

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ fontSize:26, marginBottom:4, filter:`drop-shadow(0 0 8px ${accent}90)` }}>📡</div>
            <div style={{ fontSize:15, fontWeight:900, letterSpacing:'-0.5px' }}>
              <span style={{ color:'#39d353' }}>Token</span><span style={{ color:'#a855f7' }}>omics</span><span style={{ color:'#39d353' }}>Radar</span>
            </div>
            <div style={{ fontSize:9, color:'#2a4a2a', letterSpacing:3, marginTop:2 }}>SIMULADOR DE MARKET CAP</div>
          </div>

          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${accent}40,transparent)`, marginBottom:16 }} />

          {/* Question */}
          <div style={{ textAlign:'center', marginBottom:12, fontSize:13, color:'#9ca3af' }}>
            E se <strong style={{ color:'#39d353' }}>{tokenX.symbol}</strong> tivesse o MC{mode==='ath'?' (ATH)':''} de <strong style={{ color:'#00e5ff' }}>{tokenY.symbol}</strong>?
          </div>

          {/* BIG PRICE */}
          <div style={{ textAlign:'center', marginBottom:8 }}>
            <div style={{
              fontSize:'clamp(2rem,9vw,3.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-2px', lineHeight:1,
              textShadow:`0 0 40px ${accent}60, 0 0 80px ${accent}30`,
            }}>{fmt(projectedPrice)}</div>
          </div>

          {/* Multiplier badge */}
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <span style={{
              display:'inline-block', background:`${accent}20`, border:`1px solid ${accent}60`,
              borderRadius:100, padding:'4px 16px', fontSize:14, fontWeight:700, color:accent,
              boxShadow:`0 0 12px ${accent}30`,
            }}>{multiplier.toFixed(2)}X &nbsp;·&nbsp; {sign}{pctChange.toFixed(1)}%</span>
          </div>

          <div style={{ height:1, background:'linear-gradient(90deg,transparent,#1a2e1a,transparent)', marginBottom:14 }} />

          {/* Stats */}
          <div style={{ display:'flex', justifyContent:'space-around', textAlign:'center', marginBottom:16 }}>
            {[
              { label:'Preço Atual', value:fmt(tokenX.price), color:'#9ca3af' },
              { label:'MC Alvo', value:fmtMC(targetMC), color:'#9ca3af' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize:10, color:'#374151', marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${accent}20,transparent)`, marginBottom:10 }} />
          <div style={{ textAlign:'center', fontSize:9, color:'#2a4a2a', letterSpacing:2 }}>tokenomicsradar.vercel.app</div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="flex flex-col gap-2">

          {/* X Share — opens Twitter directly with text + link (card shows as OG preview in tweet) */}
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#000', color: '#fff', border: '1.5px solid #333', textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.748-8.855L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            POSTAR NO X (TWITTER)
          </a>

          <div className="flex gap-2">
            {/* Save Image — opens server-generated PNG directly */}
            <a
              href={ogImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#a855f720', color: '#a855f7', border: '1px solid #a855f740', textDecoration: 'none' }}
            >
              ⬇ SALVAR IMAGEM
            </a>

            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: copied ? '#39d353' : '#0f2010',
                color: copied ? '#060d06' : '#39d353',
                border: `1px solid ${copied ? '#39d353' : '#39d35340'}`,
              }}
            >
              {copied ? '✓ COPIADO' : '🔗 LINK'}
            </button>
          </div>
        </div>

        <button onClick={onClose} className="text-center font-mono text-xs opacity-30 hover:opacity-70 py-1" style={{ color: '#9ca3af' }}>
          fechar
        </button>
      </div>
    </div>
  );
}
