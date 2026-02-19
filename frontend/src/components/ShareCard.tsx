import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  tokenX: { name: string; symbol: string; price: number };
  tokenY: { name: string; symbol: string };
  projectedPrice: number;
  multiplier: number;
  pctChange: number;
  targetMC: number;
  mode: 'current' | 'ath';
  shareUrl: string;
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
  tokenX, tokenY, projectedPrice, multiplier, pctChange, targetMC, mode, shareUrl, onClose,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const isGain = multiplier >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';

  // Share page URL with OG meta tags for Twitter card preview
  const sharePageUrl = (() => {
    const base = window.location.origin;
    const p = new URLSearchParams({
      symX: tokenX.symbol,
      symY: tokenY.symbol,
      mode,
      price: projectedPrice.toString(),
      mult: multiplier.toString(),
      pct: pctChange.toString(),
      mcY: targetMC.toString(),
    });
    return `${base}/api/share?${p.toString()}`;
  })();

  const tweetText = encodeURIComponent(
    `🔮 Se ${tokenX.name} (${tokenX.symbol}) tivesse o MC ` +
    `${mode === 'ath' ? '(ATH) ' : ''}de ${tokenY.name} (${tokenY.symbol}):\n\n` +
    `💰 ${fmt(projectedPrice)}  ${multiplier.toFixed(2)}X (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%)\n\n` +
    sharePageUrl
  );

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#060d06',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: el => el.tagName === 'BUTTON',
      });
      const link = document.createElement('a');
      link.download = `tokenomicsradar-${tokenX.symbol}-${tokenY.symbol}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('html2canvas error:', e);
      alert('Erro ao gerar imagem. Tente fazer um print da tela.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
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

        {/* ── THE BEAUTIFUL SHARE CARD (what gets captured as image) ── */}
        <div
          ref={cardRef}
          style={{
            background: 'linear-gradient(145deg, #060d06 0%, #0a1a0f 50%, #08101a 100%)',
            border: '1.5px solid transparent',
            backgroundClip: 'padding-box',
            borderRadius: '20px',
            padding: '28px 28px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 60px ${accent}25, 0 0 120px rgba(168,85,247,0.08)`,
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          }}
        >
          {/* Gradient border overlay — html2canvas compatible (outline trick) */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px',
            border: `1.5px solid ${accent}50`,
            boxShadow: `inset 0 0 0 1px #a855f730, 0 0 30px ${accent}15`,
            pointerEvents: 'none',
          }} />

          {/* Scan lines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,211,83,0.015) 3px, rgba(57,211,83,0.015) 6px)',
          }} />

          {/* Corner dots */}
          {['0,0','0,auto','auto,0','auto,auto'].map((pos, i) => {
            const [t, b] = pos.split(',');
            return (
              <div key={i} style={{
                position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                top: t === '0' ? 12 : undefined, bottom: b === 'auto' ? 12 : undefined,
                left: i < 2 ? 12 : undefined, right: i >= 2 ? 12 : undefined,
                backgroundColor: accent, opacity: 0.5, boxShadow: `0 0 6px ${accent}`,
              }} />
            );
          })}

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 4, filter: `drop-shadow(0 0 10px ${accent}90)` }}>📡</div>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.5px', color: '#39d353' }}>
              Token<span style={{ color: '#a855f7' }}>omics</span>Radar
            </div>
            <div style={{ fontSize: 10, color: '#2a4a2a', letterSpacing: 3, marginTop: 2 }}>SIMULADOR DE MARKET CAP</div>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`, marginBottom: 18 }} />

          {/* Question */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>E se </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#39d353' }}>{tokenX.symbol}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}> tivesse o MC {mode === 'ath' ? '(ATH)' : 'atual'} de </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#00e5ff' }}>{tokenY.symbol}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>?</span>
          </div>

          {/* BIG PRICE */}
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{
              fontSize: 'clamp(2.2rem, 10vw, 3.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1,
              textShadow: `0 0 40px ${accent}60, 0 0 80px ${accent}30`,
            }}>
              {fmt(projectedPrice)}
            </div>
          </div>

          {/* Multiplier badge */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: `${accent}20`,
              border: `1px solid ${accent}60`,
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: 14,
              fontWeight: 700,
              color: accent,
              boxShadow: `0 0 14px ${accent}30`,
            }}>
              {multiplier.toFixed(2)}X &nbsp;·&nbsp; {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
            </span>
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, #1a2e1a, transparent)`, marginBottom: 16 }} />

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: 18 }}>
            {[
              { label: 'Preço Atual', value: fmt(tokenX.price), color: '#9ca3af' },
              { label: 'MC Alvo', value: fmtMC(targetMC), color: '#9ca3af' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: '#374151', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Footer URL */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${accent}20, transparent)`, marginBottom: 12 }} />
          <div style={{ textAlign: 'center', fontSize: 10, color: '#2a4a2a', letterSpacing: 2 }}>
            tokenomicsradar.vercel.app
          </div>
        </div>

        {/* ── ACTION BUTTONS (outside card, not captured in image) ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* X Share — opens Twitter with link; Twitter auto-shows OG card preview */}
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #333', textDecoration: 'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.748-8.855L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            X SHARE
          </a>

          {/* Download image */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#a855f720', color: '#a855f7', border: '1px solid #a855f740' }}
          >
            {downloading ? '⏳ gerando...' : '⬇ SALVAR IMAGEM'}
          </button>

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
            {copied ? '✓ COPIADO!' : '🔗 LINK'}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-center font-mono text-xs opacity-40 hover:opacity-80 py-1"
          style={{ color: '#9ca3af' }}
        >
          fechar
        </button>
      </div>
    </div>
  );
}
