import type { AnalysisResult } from '../types';
import { formatNumber, getScoreColor } from '../utils/analyzer';

interface Props {
  analysis: AnalysisResult;
}

export default function TokenHeader({ analysis }: Props) {
  const { token, scores, verdict } = analysis;
  const md = token.market_data;
  const scoreColor = getScoreColor(scores.total);

  const verdictColors: Record<string, string> = {
    'Excelente': '#00c853',
    'Bom': '#69f0ae',
    'Regular': '#ffd600',
    'Ruim': '#ff6d00',
    'Evitar': '#ff3d3d',
  };

  const priceChange = md.price_change_percentage_24h;

  const marketCap = md.market_cap?.usd;
  const fdv = md.fully_diluted_valuation?.usd;
  const highDilution = fdv && marketCap && fdv > marketCap * 3;

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Token Info */}
        <div className="flex items-center gap-4 flex-1">
          {token.image?.large && (
            <img
              src={token.image.large}
              alt={token.name}
              className="w-16 h-16 rounded-full"
              style={{ border: '2px solid #1e2a45' }}
            />
          )}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{token.name}</h2>
              <span
                className="text-sm font-mono font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: '#1e2a45', color: '#00e5ff' }}
              >
                {token.symbol?.toUpperCase()}
              </span>
              {token.market_cap_rank && (
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: '#1e2a45', color: '#9ca3af' }}
                >
                  #{token.market_cap_rank}
                </span>
              )}
            </div>
            {token.categories?.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {token.categories.slice(0, 3).map((cat, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(79, 142, 255, 0.1)', color: '#4f8eff' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Market Data */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p style={{ color: '#6b7280' }}>Preço</p>
            <p className="font-bold text-white text-lg">
              {md.current_price?.usd ? `$${md.current_price.usd.toLocaleString('en-US', { maximumFractionDigits: 6 })}` : 'N/D'}
            </p>
            {priceChange !== undefined && (
              <p style={{ color: priceChange >= 0 ? '#00c853' : '#ff3d3d' }} className="text-xs">
                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}% (24h)
              </p>
            )}
          </div>
          <div>
            <p style={{ color: '#6b7280' }}>Market Cap</p>
            <p className="font-bold text-white">{formatNumber(marketCap)}</p>
            <p className="text-xs italic mt-1" style={{ color: '#6b7280' }}>
              ⓘ Valor atual de todos os tokens em circulação
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280' }}>FDV</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-white">{formatNumber(fdv)}</p>
              {highDilution && (
                <span
                  className="text-xs px-2 py-1 rounded-full font-bold"
                  title="FDV muito maior que Market Cap indica alto risco de diluição futura"
                  style={{ backgroundColor: 'rgba(255, 109, 0, 0.15)', color: '#ff6d00', whiteSpace: 'nowrap' }}
                >
                  ⚠️ Alta Diluição
                </span>
              )}
            </div>
            <p className="text-xs italic mt-1" style={{ color: '#6b7280' }}>
              ⓘ FDV: valor total se todos os tokens já existissem. FDV muito maior que Market Cap = muita diluição futura.
            </p>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full flex flex-col items-center justify-center border-4"
            style={{
              borderColor: scoreColor,
              boxShadow: `0 0 20px ${scoreColor}40`,
              backgroundColor: '#0a0e1a',
            }}
          >
            <span className="text-2xl font-bold text-white font-mono">{scores.total.toFixed(1)}</span>
            <span className="text-xs" style={{ color: '#6b7280' }}>/10</span>
          </div>
          <span
            className="mt-2 text-sm font-bold px-3 py-1 rounded-full"
            style={{ color: verdictColors[verdict], backgroundColor: `${verdictColors[verdict]}20` }}
          >
            {verdict}
          </span>
        </div>
      </div>
    </div>
  );
}
