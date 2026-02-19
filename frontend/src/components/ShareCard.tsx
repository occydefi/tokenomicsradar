import { useState, useCallback } from 'react';

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
  const ePart = 'E se $';
  const symXPart = tokenX.symbol;
  const midPart = ` tivesse o Market Cap${mode === 'ath' ? ' (ATH)' : ''} de $`;
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
  const [sharing, setSharing] = useState(false);
  const isGain = multiplier >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';
  const sign = pctChange >= 0 ? '+' : '';

  const appUrl = `${window.location.origin}/?sim=${tokenX.symbol}&ref=${tokenY.symbol}&mode=${mode}`;
  const shareText =
    `🔮 Se $${tokenX.symbol} tivesse o Market Cap ${mode === 'ath' ? 'na máxima histórica ' : ''}de $${tokenY.symbol}:\n` +
    `💰 ${fmt(projectedPrice)}  ${multiplier.toFixed(2)}X (${sign}${pctChange.toFixed(1)}%)\n\n` +
    `tokenomicsradar.vercel.app`;

  // Generate canvas PNG → Blob
  const generateBlob = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const W = 800, H = 430;
      const canvas = document.createElement('canvas');
      canvas.width = W * 2;
      canvas.height = H * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('no ctx')); return; }
      ctx.scale(2, 2);
      drawCard(ctx, W, H, tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('no blob')), 'image/png');
    });
  }, [tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode]);

  // Mobile: native share sheet with image (WhatsApp, Telegram, Instagram, X, etc.)
  const handleNativeShare = async () => {
    setSharing(true);
    try {
      const blob = await generateBlob();
      const file = new File([blob], `tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`, { type: 'image/png' });
      await navigator.share({ files: [file], text: shareText });
    } catch {
      // user cancelled or not supported — fallback: just download
      const blob = await generateBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSharing(false);
    }
  };

  const handleSaveImage = async () => {
    const blob = await generateBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const canNativeShare = !!navigator.share && isMobile;

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
            E se <strong style={{ color:'#39d353' }}>${tokenX.symbol}</strong> tivesse o Market Cap{mode==='ath'?' (ATH)':''} de <strong style={{ color:'#00e5ff' }}>${tokenY.symbol}</strong>?
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

        {/* Share buttons — 2×2 grid */}
        <div className="grid grid-cols-2 gap-2">

          {/* X / Twitter — SVG logo only, no "X" text */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor:'#000', color:'#fff', border:'1px solid #444', textDecoration:'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.748-8.855L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            SHARE
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor:'#128c1e20', color:'#25d366', border:'1px solid #25d36650', textDecoration:'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor:'#229ed920', color:'#229ed9', border:'1px solid #229ed950', textDecoration:'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </a>

          {/* Mobile native share (image) OR desktop copy link */}
          {canNativeShare ? (
            <button
              onClick={handleNativeShare}
              disabled={sharing}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background:'linear-gradient(135deg,#39d353,#a855f7)', color:'#fff', border:'none' }}
            >
              {sharing ? '⏳' : '📤'} {sharing ? 'gerando...' : 'COMPARTILHAR'}
            </button>
          ) : (
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor:copied?'#39d353':'#0f2010', color:copied?'#060d06':'#39d353', border:`1px solid ${copied?'#39d353':'#39d35340'}` }}
            >
              {copied ? '✓ COPIADO' : '🔗 COPIAR LINK'}
            </button>
          )}
        </div>

        {/* Save image row */}
        <button
          onClick={handleSaveImage}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-mono font-bold text-xs transition-all hover:opacity-90"
          style={{ backgroundColor:'#a855f715', color:'#a855f7', border:'1px solid #a855f730' }}
        >
          ⬇ SALVAR IMAGEM (PNG)
        </button>

        <button onClick={onClose} className="text-center font-mono text-xs opacity-30 hover:opacity-70 py-1" style={{ color:'#9ca3af' }}>fechar</button>
      </div>
    </div>
  );
}
