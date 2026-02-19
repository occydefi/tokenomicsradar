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

// Draw the share card using Canvas API — no dependencies, works everywhere
function drawCard(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  tokenX: ShareCardProps['tokenX'],
  tokenY: ShareCardProps['tokenY'],
  projectedPrice: number,
  multiplier: number,
  pctChange: number,
  targetMC: number,
  mode: string,
) {
  const isGain = multiplier >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';
  const sign = pctChange >= 0 ? '+' : '';

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060d06');
  bg.addColorStop(0.5, '#0a1a0f');
  bg.addColorStop(1, '#08101a');
  ctx.fillStyle = bg;
  ctx.roundRect(0, 0, W, H, 24);
  ctx.fill();

  // Grid lines
  ctx.strokeStyle = accent + '12';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Border
  ctx.strokeStyle = accent + '60';
  ctx.lineWidth = 2;
  ctx.roundRect(1, 1, W - 2, H - 2, 23);
  ctx.stroke();

  // Top glow
  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 200);
  glow.addColorStop(0, accent + '30');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 200);

  // Corner dots
  [[16, 16], [W - 16, 16], [16, H - 16], [W - 16, H - 16]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = accent + '80';
    ctx.fill();
  });

  // Logo emoji
  ctx.font = '42px serif';
  ctx.textAlign = 'center';
  ctx.fillText('📡', W / 2, 78);

  // Logo text
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillStyle = '#39d353';
  ctx.fillText('Token', W / 2 - 54, 108);
  ctx.fillStyle = '#a855f7';
  ctx.fillText('omics', W / 2 + 6, 108);
  ctx.fillStyle = '#39d353';
  ctx.fillText('Radar', W / 2 + 64, 108);

  // Subtitle
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#2a4a2a';
  ctx.letterSpacing = '3px';
  ctx.fillText('SIMULADOR DE MARKET CAP', W / 2, 126);
  ctx.letterSpacing = '0px';

  // Separator
  const sep1 = ctx.createLinearGradient(80, 0, W - 80, 0);
  sep1.addColorStop(0, 'transparent');
  sep1.addColorStop(0.5, accent + '50');
  sep1.addColorStop(1, 'transparent');
  ctx.strokeStyle = sep1;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 142); ctx.lineTo(W - 80, 142); ctx.stroke();

  // Question
  ctx.font = '16px "Courier New", monospace';
  ctx.textAlign = 'center';
  const qY = 172;
  const ePart = 'E se ';
  const symXPart = tokenX.symbol;
  const midPart = ` tivesse o MC${mode === 'ath' ? ' (ATH)' : ''} de `;
  const symYPart = tokenY.symbol;
  const endPart = '?';
  ctx.fillStyle = '#9ca3af';
  const totalW = ctx.measureText(ePart + symXPart + midPart + symYPart + endPart).width;
  let curX = W / 2 - totalW / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9ca3af'; ctx.fillText(ePart, curX, qY); curX += ctx.measureText(ePart).width;
  ctx.fillStyle = '#39d353'; ctx.fillText(symXPart, curX, qY); curX += ctx.measureText(symXPart).width;
  ctx.fillStyle = '#9ca3af'; ctx.fillText(midPart, curX, qY); curX += ctx.measureText(midPart).width;
  ctx.fillStyle = '#00e5ff'; ctx.fillText(symYPart, curX, qY); curX += ctx.measureText(symYPart).width;
  ctx.fillStyle = '#9ca3af'; ctx.fillText(endPart, curX, qY);

  // Big price
  const priceStr = fmt(projectedPrice);
  ctx.textAlign = 'center';
  ctx.font = `bold ${priceStr.length > 10 ? 62 : 72}px "Courier New", monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 40;
  ctx.fillText(priceStr, W / 2, 258);
  ctx.shadowBlur = 0;

  // Multiplier badge
  const badgeText = `${multiplier.toFixed(2)}X  ·  ${sign}${pctChange.toFixed(1)}%`;
  const badgeW = ctx.measureText(badgeText).width + 40;
  const badgeX = W / 2 - badgeW / 2;
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.fillStyle = accent + '25';
  ctx.strokeStyle = accent + '70';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(badgeX, 270, badgeW, 38, 19); ctx.fill(); ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillText(badgeText, W / 2, 294);

  // Separator 2
  const sep2 = ctx.createLinearGradient(120, 0, W - 120, 0);
  sep2.addColorStop(0, 'transparent');
  sep2.addColorStop(0.5, '#1a2e1a');
  sep2.addColorStop(1, 'transparent');
  ctx.strokeStyle = sep2;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(120, 326); ctx.lineTo(W - 120, 326); ctx.stroke();

  // Stats
  ctx.font = '11px "Courier New", monospace';
  const stats = [
    { label: 'PREÇO ATUAL', value: fmt(tokenX.price), x: W * 0.3 },
    { label: 'MC ALVO', value: fmtMC(targetMC), x: W * 0.7 },
  ];
  stats.forEach(({ label, value, x }) => {
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, 348);
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(value, x, 368);
    ctx.font = '11px "Courier New", monospace';
  });

  // Footer
  const sep3 = ctx.createLinearGradient(80, 0, W - 80, 0);
  sep3.addColorStop(0, 'transparent');
  sep3.addColorStop(0.5, accent + '25');
  sep3.addColorStop(1, 'transparent');
  ctx.strokeStyle = sep3;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 388); ctx.lineTo(W - 80, 388); ctx.stroke();

  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#1a3a1a';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('tokenomicsradar.vercel.app', W / 2, 410);
  ctx.letterSpacing = '0px';
}

export default function ShareCard({
  tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode, onClose,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const isGain = multiplier >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';
  const sign = pctChange >= 0 ? '+' : '';

  const appUrl = `${window.location.origin}/?sim=${tokenX.symbol}&ref=${tokenY.symbol}&mode=${mode}`;

  const tweetText = encodeURIComponent(
    `🔮 Se ${tokenX.symbol} tivesse o MC ${mode === 'ath' ? '(ATH) ' : ''}de ${tokenY.symbol}:\n` +
    `💰 ${fmt(projectedPrice)}  ${multiplier.toFixed(2)}X (${sign}${pctChange.toFixed(1)}%)\n\n` +
    `📡 tokenomicsradar.vercel.app`
  );

  const handleSaveImage = () => {
    const W = 800, H = 430;
    const canvas = document.createElement('canvas');
    canvas.width = W * 2; // 2x for retina
    canvas.height = H * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(2, 2);
    drawCard(ctx, W, H, tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode);
    const link = document.createElement('a');
    link.download = `tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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

        {/* Visual card preview */}
        <div style={{
          background: 'linear-gradient(145deg, #060d06 0%, #0a1a0f 50%, #08101a 100%)',
          border: `1.5px solid ${accent}50`,
          borderRadius: '20px',
          padding: '24px 24px 18px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          boxShadow: `0 0 50px ${accent}20`,
        }}>
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(57,211,83,0.012) 3px,rgba(57,211,83,0.012) 6px)' }} />
          {[[10,undefined,10,undefined],[10,undefined,undefined,10],[undefined,10,10,undefined],[undefined,10,undefined,10]].map(([t,b,l,r], i) => (
            <div key={i} style={{ position:'absolute', width:6, height:6, borderRadius:'50%', top:t, bottom:b, left:l, right:r, backgroundColor:accent, opacity:0.5 }} />
          ))}
          <div style={{ textAlign:'center', marginBottom:14 }}>
            <div style={{ fontSize:22, filter:`drop-shadow(0 0 7px ${accent})` }}>📡</div>
            <div style={{ fontSize:13, fontWeight:900 }}>
              <span style={{ color:'#39d353' }}>Token</span><span style={{ color:'#a855f7' }}>omics</span><span style={{ color:'#39d353' }}>Radar</span>
            </div>
            <div style={{ fontSize:8, color:'#2a4a2a', letterSpacing:3, marginTop:1 }}>SIMULADOR DE MARKET CAP</div>
          </div>
          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${accent}40,transparent)`, marginBottom:12 }} />
          <div style={{ textAlign:'center', marginBottom:10, fontSize:12, color:'#9ca3af' }}>
            E se <strong style={{ color:'#39d353' }}>{tokenX.symbol}</strong> tivesse o MC{mode==='ath'?' (ATH)':''} de <strong style={{ color:'#00e5ff' }}>{tokenY.symbol}</strong>?
          </div>
          <div style={{ textAlign:'center', marginBottom:6 }}>
            <div style={{ fontSize:'clamp(1.8rem,8vw,2.8rem)', fontWeight:900, color:'#fff', letterSpacing:'-2px', lineHeight:1, textShadow:`0 0 35px ${accent}60` }}>{fmt(projectedPrice)}</div>
          </div>
          <div style={{ textAlign:'center', marginBottom:14 }}>
            <span style={{ display:'inline-block', background:`${accent}20`, border:`1px solid ${accent}60`, borderRadius:100, padding:'3px 14px', fontSize:13, fontWeight:700, color:accent }}>
              {multiplier.toFixed(2)}X &nbsp;·&nbsp; {sign}{pctChange.toFixed(1)}%
            </span>
          </div>
          <div style={{ height:1, background:'linear-gradient(90deg,transparent,#1a2e1a,transparent)', marginBottom:10 }} />
          <div style={{ display:'flex', justifyContent:'space-around', textAlign:'center', marginBottom:12 }}>
            {[{label:'Preço Atual',value:fmt(tokenX.price)},{label:'MC Alvo',value:fmtMC(targetMC)}].map(s=>(
              <div key={s.label}><div style={{ fontSize:9, color:'#374151', marginBottom:3 }}>{s.label}</div><div style={{ fontSize:12, fontWeight:700, color:'#9ca3af' }}>{s.value}</div></div>
            ))}
          </div>
          <div style={{ textAlign:'center', fontSize:8, color:'#2a4a2a', letterSpacing:2 }}>tokenomicsradar.vercel.app</div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor:'#000', color:'#fff', border:'1.5px solid #333', textDecoration:'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.748-8.855L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            SHARE
          </a>
          <div className="flex gap-2">
            <button
              onClick={handleSaveImage}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor:'#a855f720', color:'#a855f7', border:'1px solid #a855f740' }}
            >
              ⬇ SALVAR IMAGEM
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor:copied?'#39d353':'#0f2010', color:copied?'#060d06':'#39d353', border:`1px solid ${copied?'#39d353':'#39d35340'}` }}
            >
              {copied ? '✓ COPIADO' : '🔗 LINK'}
            </button>
          </div>
        </div>
        <button onClick={onClose} className="text-center font-mono text-xs opacity-30 hover:opacity-70 py-1" style={{ color:'#9ca3af' }}>fechar</button>
      </div>
    </div>
  );
}
