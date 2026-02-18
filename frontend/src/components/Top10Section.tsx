import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { getQuickScore } from '../utils/analyzer';

interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  fully_diluted_valuation: number | null;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

interface Top10SectionProps {
  onAnalyzeToken: (ticker: string) => void;
}

function formatLargeNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'N/D';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  }
  return `$${price.toPrecision(4)}`;
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span style={{ color: '#6b7280', fontSize: 13 }}>—</span>
    );
  }
  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';
  return (
    <span
      style={{
        color,
        fontWeight: 700,
        fontSize: 14,
        background: `${color}18`,
        borderRadius: 8,
        padding: '2px 8px',
        border: `1px solid ${color}40`,
      }}
    >
      {score.toFixed(1)}
    </span>
  );
}

export default function Top10Section({ onAnalyzeToken }: Top10SectionProps) {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTop10 = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<CoinMarket[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h',
          },
        }
      );
      setCoins(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Erro ao buscar dados do CoinGecko. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop10();
    intervalRef.current = setInterval(fetchTop10, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchTop10]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="text-2xl font-bold text-white">🏆 Top 10 por Market Cap</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
            Dados em tempo real via CoinGecko
            {lastUpdated && (
              <span style={{ color: '#4f8eff', marginLeft: 8 }}>
                • Atualizado às {formatTime(lastUpdated)}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchTop10}
          disabled={loading}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
          style={{
            backgroundColor: 'rgba(79,142,255,0.12)',
            color: '#4f8eff',
            border: '1px solid #4f8eff40',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
          Atualizar
        </button>
      </div>

      {/* Loading state */}
      {loading && coins.length === 0 && (
        <div className="text-center py-16">
          <div
            className="inline-block w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
            style={{ borderColor: '#4f8eff', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#9ca3af' }}>Buscando top 10 criptoativos... 🔍</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="p-4 rounded-xl border text-center mb-6"
          style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: '#ef4444', color: '#ef4444' }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Table — desktop */}
      {coins.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border" style={{ borderColor: '#1e2a45' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0d1421', borderBottom: '1px solid #1e2a45' }}>
                  {['#', 'Token', 'Preço', '24h', 'Market Cap', 'FDV', 'Score', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '12px 16px',
                        textAlign: h === '#' || h === '' ? 'center' : 'left',
                        color: '#6b7280',
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coins.map((coin, i) => {
                  const score = getQuickScore(coin.id);
                  const change = coin.price_change_percentage_24h;
                  const positive = change >= 0;
                  return (
                    <tr
                      key={coin.id}
                      style={{
                        backgroundColor: i % 2 === 0 ? '#0d1421' : 'rgba(30,42,69,0.3)',
                        borderBottom: i < coins.length - 1 ? '1px solid #1e2a4530' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(79,142,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#0d1421' : 'rgba(30,42,69,0.3)')}
                    >
                      {/* Rank */}
                      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#6b7280', fontWeight: 700, fontSize: 15 }}>
                        {coin.market_cap_rank}
                      </td>
                      {/* Name + logo */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                          />
                          <div>
                            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{coin.name}</div>
                            <div style={{ color: '#6b7280', fontSize: 12 }}>{coin.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      {/* Price */}
                      <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                        {formatPrice(coin.current_price)}
                      </td>
                      {/* 24h */}
                      <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
                        <span style={{ color: positive ? '#22c55e' : '#ef4444' }}>
                          {positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                        </span>
                      </td>
                      {/* Market Cap */}
                      <td style={{ padding: '14px 16px', color: '#c8d4f0', fontSize: 14, whiteSpace: 'nowrap' }}>
                        {formatLargeNumber(coin.market_cap)}
                      </td>
                      {/* FDV */}
                      <td style={{ padding: '14px 16px', color: '#c8d4f0', fontSize: 14, whiteSpace: 'nowrap' }}>
                        {formatLargeNumber(coin.fully_diluted_valuation)}
                      </td>
                      {/* Score */}
                      <td style={{ padding: '14px 16px' }}>
                        <ScoreBadge score={score} />
                      </td>
                      {/* Action */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => onAnalyzeToken(coin.symbol.toUpperCase())}
                          className="text-sm px-3 py-1.5 rounded-lg font-semibold transition-all hover:opacity-80"
                          style={{
                            backgroundColor: 'rgba(79,142,255,0.15)',
                            color: '#4f8eff',
                            border: '1px solid #4f8eff40',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                          }}
                        >
                          Analisar →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {coins.map((coin) => {
              const score = getQuickScore(coin.id);
              const change = coin.price_change_percentage_24h;
              const positive = change >= 0;
              return (
                <div
                  key={coin.id}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: '#0d1421', borderColor: '#1e2a45' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#6b7280', fontWeight: 700, fontSize: 13, minWidth: 20 }}>
                        #{coin.market_cap_rank}
                      </span>
                      <img src={coin.image} alt={coin.name} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{coin.name}</div>
                        <div style={{ color: '#6b7280', fontSize: 11 }}>{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                    <ScoreBadge score={score} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 2 }}>Preço</div>
                      <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{formatPrice(coin.current_price)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 2 }}>24h</div>
                      <div style={{ color: positive ? '#22c55e' : '#ef4444', fontWeight: 600, fontSize: 13 }}>
                        {positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 2 }}>Market Cap</div>
                      <div style={{ color: '#c8d4f0', fontSize: 13 }}>{formatLargeNumber(coin.market_cap)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 2 }}>FDV</div>
                      <div style={{ color: '#c8d4f0', fontSize: 13 }}>{formatLargeNumber(coin.fully_diluted_valuation)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAnalyzeToken(coin.symbol.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: 10,
                      backgroundColor: 'rgba(79,142,255,0.12)',
                      color: '#4f8eff',
                      border: '1px solid #4f8eff40',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Analisar →
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Auto-refresh notice */}
      <p className="text-center mt-6" style={{ color: '#4b5563', fontSize: 12 }}>
        🔄 Atualização automática a cada 60 segundos
      </p>
    </div>
  );
}
