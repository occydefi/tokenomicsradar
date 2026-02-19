import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function fmtPrice(v: number): string {
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (v >= 1) return '$' + v.toFixed(4);
  if (v >= 0.0001) return '$' + v.toFixed(6);
  return '$' + v.toExponential(3);
}

function fmtMC(v: number): string {
  if (v >= 1e12) return '$' + (v / 1e12).toFixed(2) + 'T';
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  return '$' + v.toLocaleString('en-US');
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);

  const symX   = (searchParams.get('symX')  ?? 'TOKEN').toUpperCase();
  const symY   = (searchParams.get('symY')  ?? 'TOKEN').toUpperCase();
  const mode   = searchParams.get('mode')   ?? 'current';
  const price  = parseFloat(searchParams.get('price')  ?? '0');
  const mult   = parseFloat(searchParams.get('mult')   ?? '1');
  const pct    = parseFloat(searchParams.get('pct')    ?? '0');
  const mcY    = parseFloat(searchParams.get('mcY')    ?? '0');

  const isGain = mult >= 1;
  const accent = isGain ? '#39d353' : '#ff6d00';
  const sign   = pct >= 0 ? '+' : '';

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #060d06 0%, #0a1a0f 50%, #08101a 100%)',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '60px 80px',
        position: 'relative',
      }}
    >
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Gradient border */}
      <div style={{
        position: 'absolute', inset: 0,
        border: `2px solid transparent`,
        borderRadius: 24,
        background: `linear-gradient(#060d06, #060d06) padding-box, linear-gradient(135deg, ${accent}80, #a855f780, #00e5ff40) border-box`,
      }} />

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: -80, left: '25%', right: '25%', height: 160,
        background: `radial-gradient(ellipse, ${accent}20 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📡</div>
        <div style={{
          fontSize: 22, fontWeight: 900, letterSpacing: -1,
          background: 'linear-gradient(135deg, #39d353, #a855f7)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          TokenomicsRadar
        </div>
        <div style={{ fontSize: 12, color: '#2a4a2a', letterSpacing: 4, marginTop: 4 }}>
          SIMULADOR DE MARKET CAP
        </div>
      </div>

      {/* Separator */}
      <div style={{ width: '80%', height: 1, background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`, marginBottom: 28 }} />

      {/* Question */}
      <div style={{ display: 'flex', fontSize: 22, color: '#9ca3af', marginBottom: 20, textAlign: 'center' }}>
        E se&nbsp;
        <span style={{ color: '#39d353', fontWeight: 700 }}>{symX}</span>
        &nbsp;tivesse o MC {mode === 'ath' ? '(ATH) ' : ''}de&nbsp;
        <span style={{ color: '#00e5ff', fontWeight: 700 }}>{symY}</span>
        ?
      </div>

      {/* BIG PRICE */}
      <div style={{
        fontSize: 96, fontWeight: 900, color: '#ffffff', letterSpacing: -4, lineHeight: 1,
        textShadow: `0 0 60px ${accent}`,
        marginBottom: 16,
      }}>
        {fmtPrice(price)}
      </div>

      {/* Multiplier badge */}
      <div style={{
        display: 'flex',
        background: `${accent}20`,
        border: `1.5px solid ${accent}60`,
        borderRadius: 100,
        padding: '8px 28px',
        fontSize: 28,
        fontWeight: 700,
        color: accent,
        marginBottom: 36,
      }}>
        {mult.toFixed(2)}X &nbsp;·&nbsp; {sign}{pct.toFixed(1)}%
      </div>

      {/* Separator */}
      <div style={{ width: '60%', height: 1, background: `linear-gradient(90deg, transparent, #1a2e1a, transparent)`, marginBottom: 24 }} />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 80, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 6, letterSpacing: 2 }}>MC ALVO</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#9ca3af' }}>{fmtMC(mcY)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 6, letterSpacing: 2 }}>MODO</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#9ca3af' }}>{mode === 'ath' ? 'ATH' : 'ATUAL'}</div>
        </div>
      </div>

      {/* Bottom URL */}
      <div style={{ position: 'absolute', bottom: 24, fontSize: 14, color: '#1a3a1a', letterSpacing: 3 }}>
        tokenomicsradar.vercel.app
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
