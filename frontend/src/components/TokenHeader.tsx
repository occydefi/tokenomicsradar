import type { AnalysisResult } from '../types';
import { formatNumber, getScoreColor } from '../utils/analyzer';

interface Props {
  analysis: AnalysisResult;
}

const VERDICT_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  'Excelente': { color: '#00ff41', icon: '🔥', label: 'EXCELENTE' },
  'Bom':       { color: '#39d353', icon: '✅', label: 'BOM' },
  'Regular':   { color: '#ffd600', icon: '⚠️', label: 'REGULAR' },
  'Ruim':      { color: '#ff6d00', icon: '☣️', label: 'RUIM' },
  'Evitar':    { color: '#ff3d3d', icon: '💀', label: 'EVITAR' },
};

export default function TokenHeader({ analysis }: Props) {
  const { token, scores, verdict, tokenomicsLastUpdated } = analysis;
  const md = token.market_data;
  const scoreColor = getScoreColor(scores.total);
  const vc = VERDICT_CONFIG[verdict] ?? { color: '#6b7280', icon: '❓', label: verdict.toUpperCase() };

  const priceChange = md.price_change_percentage_24h;
  const marketCap = md.market_cap?.usd;
  const fdv = md.fully_diluted_valuation?.usd;
  const highDilution = fdv && marketCap && fdv > marketCap * 3;

  return (
    <div
      className="rounded-2xl border relative overflow-hidden"
      style={{
        backgroundColor: '#080d08',
        borderColor: `${scoreColor}50`,
        boxShadow: `0 0 32px ${scoreColor}18, inset 0 0 60px #00000050`,
      }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: scoreColor }} />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: scoreColor }} />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: scoreColor }} />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: scoreColor }} />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,211,83,0.012) 3px, rgba(57,211,83,0.012) 6px)',
        }}
      />

      <div className="relative p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

          {/* ── Token Identity ── */}
          <div className="flex items-center gap-4 flex-1">
            {token.image?.large ? (
              <div className="relative flex-shrink-0">
                <img
                  src={token.image.large}
                  alt={token.name}
                  className="w-16 h-16 rounded-full"
                  style={{
                    border: `2px solid ${scoreColor}`,
                    boxShadow: `0 0 16px ${scoreColor}50`,
                  }}
                />
                {/* Rank badge */}
                {token.market_cap_rank && (
                  <div
                    className="absolute -bottom-1 -right-1 text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: '#0d1a0d', color: scoreColor, border: `1px solid ${scoreColor}60`, fontSize: '10px' }}
                  >
                    #{token.market_cap_rank}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: '#0d1a0d', border: `2px solid ${scoreColor}60` }}
              >
                🪙
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="text-2xl font-bold font-mono"
                  style={{ color: '#e8f5e8', textShadow: `0 0 12px ${scoreColor}30` }}
                >
                  {token.name}
                </h2>
                <span
                  className="text-sm font-mono font-bold px-3 py-1 rounded"
                  style={{
                    backgroundColor: `${scoreColor}12`,
                    color: scoreColor,
                    border: `1px solid ${scoreColor}40`,
                    letterSpacing: '2px',
                  }}
                >
                  {token.symbol?.toUpperCase()}
                </span>
              </div>

              {/* Categories — filter out institutional/noise tags from CoinGecko */}
              {token.categories?.length > 0 && (() => {
                const BLOCKLIST = [
                  'Holdings', 'Celsius', 'FTX', 'Alameda', 'DCG', 'Grayscale',
                  'Three Arrows', 'Multicoin', 'Pantera', 'a16z', 'Binance Labs',
                ];
                const filtered = token.categories.filter(cat =>
                  !BLOCKLIST.some(bl => cat.toLowerCase().includes(bl.toLowerCase()))
                ).slice(0, 3);
                return filtered.length > 0 ? (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {filtered.map((cat, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'rgba(168,85,247,0.08)',
                        color: '#a855f7',
                        border: '1px solid rgba(168,85,247,0.25)',
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : null;
              })()}

              {/* Last updated */}
              <p className="text-xs mt-1 font-mono" style={{ color: '#2a4a2a' }}>
                &gt; data_tokenomics: {tokenomicsLastUpdated}
              </p>
            </div>
          </div>

          {/* ── Market Data ── */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* Price */}
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: '#0d1a0d', border: '1px solid #1a2e1a' }}
            >
              <p className="text-xs font-mono mb-1" style={{ color: '#4a7a4a' }}>
                💲 PREÇO
              </p>
              <p className="font-bold font-mono" style={{ color: '#e8f5e8', fontSize: '15px' }}>
                {md.current_price?.usd
                  ? `$${md.current_price.usd.toLocaleString('en-US', { maximumFractionDigits: 6 })}`
                  : 'N/D'}
              </p>
              {priceChange !== undefined && (
                <p
                  className="text-xs font-mono mt-0.5"
                  style={{ color: priceChange >= 0 ? '#39d353' : '#ff4444' }}
                >
                  {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                </p>
              )}
            </div>

            {/* Market Cap */}
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: '#0d1a0d', border: '1px solid #1a2e1a' }}
            >
              <p className="text-xs font-mono mb-1" style={{ color: '#4a7a4a' }}>
                🌐 MKT CAP
              </p>
              <p className="font-bold font-mono" style={{ color: '#e8f5e8', fontSize: '15px' }}>
                {formatNumber(marketCap)}
              </p>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#2a4a2a' }}>
                circulação atual
              </p>
            </div>

            {/* FDV */}
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: '#0d1a0d', border: '1px solid #1a2e1a' }}
            >
              <p className="text-xs font-mono mb-1" style={{ color: '#4a7a4a' }}>
                🔮 FDV
              </p>
              <p className="font-bold font-mono" style={{ color: '#e8f5e8', fontSize: '15px' }}>
                {formatNumber(fdv)}
              </p>
              {highDilution && (
                <p className="text-xs font-mono mt-0.5" style={{ color: '#ff6d00' }}>
                  ⚠ diluição alta
                </p>
              )}
            </div>
          </div>

          {/* ── Score Ring ── */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Outer ring with pulsing glow */}
            <div className="relative">
              <svg width="100" height="100" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2e1a" strokeWidth="6" />
                {/* Score arc */}
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${scores.total * 26.4} 264`}
                  strokeDashoffset="66"
                  transform="rotate(-90 50 50)"
                  style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
                />
                {/* Inner decoration ring */}
                <circle cx="50" cy="50" r="34" fill="none" stroke={`${scoreColor}20`} strokeWidth="1" strokeDasharray="4 4" />
                {/* Score text */}
                <text x="50" y="44" textAnchor="middle" fill={scoreColor} fontSize="22" fontWeight="bold" fontFamily="monospace">
                  {scores.total.toFixed(1)}
                </text>
                <text x="50" y="58" textAnchor="middle" fill="#4a7a4a" fontSize="9" fontFamily="monospace">
                  /10
                </text>
              </svg>
              {/* Corner icon */}
              <span
                className="absolute -top-1 -right-1 text-lg"
                style={{ filter: `drop-shadow(0 0 6px ${vc.color})` }}
              >
                {vc.icon}
              </span>
            </div>

            {/* Verdict badge */}
            <span
              className="text-xs font-mono font-bold px-3 py-1.5 rounded tracking-widest"
              style={{
                backgroundColor: `${vc.color}15`,
                color: vc.color,
                border: `1px solid ${vc.color}50`,
                boxShadow: `0 0 8px ${vc.color}20`,
              }}
            >
              {vc.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
