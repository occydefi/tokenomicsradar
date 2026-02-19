import { useState } from 'react';
import React from 'react';
import { searchToken } from '../services/coingecko';
import type { TokenData } from '../types';

interface TokenSlot {
  data: TokenData | null;
  loading: boolean;
  error: string | null;
  query: string;
}

const empty = (): TokenSlot => ({ data: null, loading: false, error: null, query: '' });

function formatPrice(v: number): string {
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (v >= 1) return '$' + v.toFixed(4);
  if (v >= 0.0001) return '$' + v.toFixed(6);
  return '$' + v.toExponential(3);
}

function formatMC(v: number): string {
  if (v >= 1_000_000_000_000) return '$' + (v / 1_000_000_000_000).toFixed(2) + 'T';
  if (v >= 1_000_000_000) return '$' + (v / 1_000_000_000).toFixed(2) + 'B';
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  return '$' + v.toLocaleString('en-US');
}

function TokenInput({
  slot,
  label,
  labelColor,
  onSearch,
  onSwap,
  showSwap,
}: {
  slot: TokenSlot;
  label: string;
  labelColor: string;
  onSearch: (q: string) => void;
  onSwap?: () => void;
  showSwap?: boolean;
}) {
  const [val, setVal] = useState('');

  const submit = () => {
    const t = val.trim();
    if (t) { onSearch(t); setVal(''); }
  };

  const md = slot.data?.market_data;
  const mc = md?.market_cap?.usd;
  const mcStr = mc ? formatMC(mc) : null;

  return (
    <div className="flex-1 relative">
      <p className="text-xs font-mono font-bold mb-2 tracking-widest" style={{ color: labelColor }}>
        {label}
      </p>
      <div
        className="rounded-xl border-2 p-3 min-h-[80px]"
        style={{
          backgroundColor: '#060d06',
          borderColor: slot.data ? `${labelColor}60` : '#1a2e1a',
          boxShadow: slot.data ? `0 0 16px ${labelColor}15` : 'none',
        }}
      >
        {slot.data ? (
          <div className="flex items-center gap-3">
            {slot.data.image?.small && (
              <img src={slot.data.image.small} alt={slot.data.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ border: `2px solid ${labelColor}50` }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold font-mono text-sm" style={{ color: '#e8f5e8' }}>{slot.data.name}</p>
              <p className="text-xs font-mono" style={{ color: labelColor }}>{slot.data.symbol?.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono" style={{ color: '#4a7a4a' }}>MC</p>
              <p className="text-sm font-bold font-mono" style={{ color: labelColor }}>{mcStr ?? 'N/D'}</p>
            </div>
            <button
              onClick={() => onSearch('')}
              className="text-xs font-mono ml-1 opacity-40 hover:opacity-80"
              style={{ color: '#ff4444' }}
              title="Limpar"
            >✕</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={val}
              onChange={e => setVal(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="TICKER..."
              className="flex-1 bg-transparent outline-none font-mono text-sm"
              style={{ color: '#39d353', caretColor: '#39d353' }}
              disabled={slot.loading}
            />
            <button
              onClick={submit}
              disabled={slot.loading || !val.trim()}
              className="px-3 py-1 rounded font-mono text-xs font-bold disabled:opacity-30"
              style={{ backgroundColor: `${labelColor}15`, color: labelColor, border: `1px solid ${labelColor}40` }}
            >
              {slot.loading ? '...' : '→'}
            </button>
          </div>
        )}
        {slot.error && (
          <p className="text-xs font-mono mt-1" style={{ color: '#ff4444' }}>⚠ {slot.error}</p>
        )}
      </div>

      {/* Swap button between slots */}
      {showSwap && onSwap && (
        <button
          onClick={onSwap}
          className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
          style={{
            backgroundColor: '#0d1a0d',
            border: '2px solid #39d35360',
            boxShadow: '0 0 12px rgba(57,211,83,0.2)',
            color: '#39d353',
            fontSize: '18px',
          }}
          title="Trocar tokens"
        >
          ⇄
        </button>
      )}
    </div>
  );
}

export default function MCSimulator() {
  const [tokenX, setTokenX] = useState<TokenSlot>(empty());
  const [tokenY, setTokenY] = useState<TokenSlot>(empty());
  const [mode, setMode] = useState<'current' | 'ath'>('current');

  const fetchToken = async (ticker: string, setSlot: React.Dispatch<React.SetStateAction<TokenSlot>>) => {
    if (!ticker) { setSlot(empty()); return; }
    setSlot(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await searchToken(ticker);
      setSlot({ data, loading: false, error: null, query: ticker });
    } catch {
      setSlot(s => ({ ...s, loading: false, error: 'Token não encontrado' }));
    }
  };

  const swap = () => {
    setTokenX(tokenY);
    setTokenY(tokenX);
  };

  // Compute simulation
  const x = tokenX.data;
  const y = tokenY.data;
  const md_x = x?.market_data;
  const md_y = y?.market_data;

  const currentPriceX = md_x?.current_price?.usd ?? 0;
  const circulatingX = md_x?.circulating_supply ?? 0;
  const mcX = md_x?.market_cap?.usd ?? 0;

  // Target MC: current or ATH of Y
  const mcYCurrent = md_y?.market_cap?.usd ?? 0;
  const athY = md_y?.ath?.usd ?? 0;
  const circulatingY = md_y?.circulating_supply ?? 1;
  const mcYAth = athY * circulatingY;
  const targetMC = mode === 'ath' ? mcYAth : mcYCurrent;

  // Projected price of X if it had target MC
  const projectedPrice = circulatingX > 0 ? targetMC / circulatingX : 0;
  const multiplier = currentPriceX > 0 ? projectedPrice / currentPriceX : 0;
  const pctChange = (multiplier - 1) * 100;
  const isGain = multiplier >= 1;

  const hasResult = x && y && projectedPrice > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-bold font-mono mb-2"
          style={{ color: '#39d353', textShadow: '0 0 20px rgba(57,211,83,0.4)', letterSpacing: '-1px' }}
        >
          🔮 MC_SIMULATOR_
        </h2>
        <p className="font-mono text-sm" style={{ color: '#4a7a4a' }}>
          {'>'} e se TOKEN_X tivesse o market cap de TOKEN_Y?
        </p>
      </div>

      {/* Token selectors */}
      <div className="flex items-center gap-12 mb-6">
        <TokenInput
          slot={tokenX}
          label="TOKEN X  [TARGET]"
          labelColor="#39d353"
          onSearch={q => fetchToken(q, setTokenX)}
          onSwap={swap}
          showSwap
        />
        <TokenInput
          slot={tokenY}
          label="TOKEN Y  [MC REFERENCE]"
          labelColor="#00e5ff"
          onSearch={q => fetchToken(q, setTokenY)}
        />
      </div>

      {/* Mode toggle */}
      {x && y && (
        <div className="flex justify-center mb-6">
          <div
            className="flex rounded-xl overflow-hidden border"
            style={{ borderColor: '#1a2e1a' }}
          >
            {(['current', 'ath'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-6 py-2 text-sm font-mono font-bold tracking-widest transition-all"
                style={{
                  backgroundColor: mode === m ? '#39d353' : '#060d06',
                  color: mode === m ? '#060d06' : '#4a7a4a',
                  boxShadow: mode === m ? '0 0 12px rgba(57,211,83,0.4)' : 'none',
                }}
              >
                {m === 'current' ? 'CURRENT' : 'ATH'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result card */}
      {hasResult ? (
        <div
          className="rounded-2xl border p-8 text-center relative overflow-hidden"
          style={{
            backgroundColor: '#060d06',
            borderColor: isGain ? '#39d35340' : '#ff6d0040',
            boxShadow: `0 0 40px ${isGain ? 'rgba(57,211,83,0.12)' : 'rgba(255,109,0,0.12)'}`,
          }}
        >
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(57,211,83,0.01) 3px, rgba(57,211,83,0.01) 6px)',
          }} />

          {/* Title */}
          <p className="text-lg font-mono mb-6 relative z-10">
            <strong style={{ color: '#39d353' }}>{x.symbol?.toUpperCase()}</strong>
            <span style={{ color: '#9ca3af' }}> price with MC of </span>
            <strong style={{ color: '#00e5ff' }}>{y.symbol?.toUpperCase()}</strong>
            {mode === 'ath' && (
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid #00e5ff40' }}
              >
                ATH
              </span>
            )}
          </p>

          {/* Big price */}
          <div className="relative z-10 mb-6">
            <p
              className="font-bold font-mono"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                color: '#ffffff',
                textShadow: `0 0 30px ${isGain ? 'rgba(57,211,83,0.4)' : 'rgba(255,109,0,0.4)'}`,
                letterSpacing: '-2px',
              }}
            >
              {formatPrice(projectedPrice)}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {[
              { label: 'Current Price', value: formatPrice(currentPriceX), color: '#9ca3af' },
              {
                label: 'Multiplier',
                value: multiplier.toFixed(2) + 'X',
                color: isGain ? '#39d353' : '#ff6d00',
              },
              {
                label: 'Price Increase',
                value: (isGain ? '+' : '') + pctChange.toFixed(2) + '%',
                color: isGain ? '#39d353' : '#ff6d00',
              },
              { label: 'Target Marketcap', value: formatMC(targetMC), color: '#9ca3af' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-lg font-bold font-mono" style={{ color }}>{value}</p>
                <p className="text-xs font-mono mt-1" style={{ color: '#374151' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Share button */}
          <button
            className="mt-8 w-full py-3 rounded-xl font-mono font-bold text-sm tracking-widest transition-all hover:opacity-90 relative z-10"
            style={{
              backgroundColor: '#39d353',
              color: '#060d06',
              boxShadow: '0 0 16px rgba(57,211,83,0.4)',
              letterSpacing: '3px',
            }}
            onClick={() => {
              const text = `🔮 Se ${x.name} (${x.symbol?.toUpperCase()}) tivesse o market cap ${mode === 'ath' ? 'ATH' : 'atual'} de ${y.name} (${y.symbol?.toUpperCase()}):\n💰 Preço: ${formatPrice(projectedPrice)}\n📈 ${multiplier.toFixed(2)}X (${pctChange.toFixed(1)}%)\n\nAnalise em tokenomicsradar.vercel.app`;
              navigator.clipboard.writeText(text).catch(() => {});
              alert('📋 Copiado para a área de transferência!');
            }}
          >
            ↗ SHARE
          </button>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: '#060d06', borderColor: '#1a2e1a' }}>
          <p className="text-4xl mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(57,211,83,0.4))' }}>🔮</p>
          <p className="font-mono text-sm" style={{ color: '#39d353' }}>&gt; aguardando tokens...</p>
          <p className="font-mono text-xs mt-2" style={{ color: '#2a4a2a' }}>busque Token X e Token Y para simular</p>
        </div>
      )}

      <p className="text-xs font-mono text-center mt-4" style={{ color: '#1a2e1a' }}>
        ⚠ simulação baseada em market cap · não considera inflação de supply · não é conselho financeiro
      </p>
    </div>
  );
}
