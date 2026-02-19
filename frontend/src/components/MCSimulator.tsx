import { useState, useEffect } from 'react';
import React from 'react';
import { searchToken } from '../services/coingecko';
import type { TokenData } from '../types';
import ShareCard from './ShareCard';
import { useTTS } from '../hooks/useTTS';

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
              placeholder="TICKER... (BTC, ETH, SOL)"
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
  const [shareModal, setShareModal] = useState(false);
  const { state: ttsState, speak } = useTTS();

  // Auto-load from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get('sim');
    const ref = params.get('ref');
    const m = params.get('mode');
    if (m === 'ath') setMode('ath');
    if (sim) fetchToken(sim, setTokenX);
    if (ref) fetchToken(ref, setTokenY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <p className="text-xs font-mono mb-1 tracking-widest" style={{ color: '#2a4a2a' }}>
          &gt; simulador_de_market_cap.sh
        </p>
        <h2
          className="text-xl sm:text-3xl font-bold font-mono mb-2"
          style={{ color: '#39d353', textShadow: '0 0 20px rgba(57,211,83,0.4)', letterSpacing: '-1px' }}
        >
          🔮 Simulador de Market Cap
        </h2>
        <p className="font-mono text-xs sm:text-sm" style={{ color: '#4a7a4a' }}>
          E se o Token X tivesse o market cap do Token Y? Quanto valeria?
        </p>
      </div>

      {/* Token selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-12 mb-6">
        <TokenInput
          slot={tokenX}
          label="TOKEN X  [ALVO]"
          labelColor="#39d353"
          onSearch={q => fetchToken(q, setTokenX)}
          onSwap={swap}
          showSwap
        />
        <TokenInput
          slot={tokenY}
          label="TOKEN Y  [REFERÊNCIA DE MC]"
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
                {m === 'current' ? 'ATUAL' : 'ATH (Máxima)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result card */}
      {hasResult ? (
        <div
          className="rounded-2xl border p-4 sm:p-8 text-center relative overflow-hidden"
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
            <span style={{ color: '#9ca3af' }}>Preço de </span>
            <strong style={{ color: '#39d353' }}>{x.symbol?.toUpperCase()}</strong>
            <span style={{ color: '#9ca3af' }}> com o Market Cap de </span>
            <strong style={{ color: '#00e5ff' }}>{y.symbol?.toUpperCase()}</strong>
            {mode === 'ath' && (
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: 'rgba(0,229,255,0.1)', color: '#00e5ff', border: '1px solid #00e5ff40' }}
              >
                na Máxima Histórica
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
            {[
              { label: 'Preço Atual', value: formatPrice(currentPriceX), color: '#9ca3af' },
              {
                label: 'Multiplicador',
                value: multiplier.toFixed(2) + 'X',
                color: isGain ? '#39d353' : '#ff6d00',
              },
              {
                label: 'Variação de Preço',
                value: (isGain ? '+' : '') + pctChange.toFixed(2) + '%',
                color: isGain ? '#39d353' : '#ff6d00',
              },
              { label: 'Market Cap Alvo', value: formatMC(targetMC), color: '#9ca3af' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-lg font-bold font-mono" style={{ color }}>{value}</p>
                <p className="text-xs font-mono mt-1" style={{ color: '#374151' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex gap-3 relative z-10">
            <button
              className="flex-1 py-3 rounded-xl font-mono font-bold text-sm tracking-widest transition-all hover:opacity-90"
              style={{ backgroundColor: '#39d353', color: '#060d06', boxShadow: '0 0 16px rgba(57,211,83,0.4)', letterSpacing: '3px' }}
              onClick={() => setShareModal(true)}
            >
              ↗ COMPARTILHAR
            </button>
            <button
              onClick={() => {
                const sign = pctChange >= 0 ? '+' : '';
                const symX = x!.symbol?.toUpperCase();
                const symY = y!.symbol?.toUpperCase();
                speak(`Se ${symX} tivesse o Market Cap ${mode === 'ath' ? 'na máxima histórica ' : ''}de ${symY}, o preço seria ${formatPrice(projectedPrice)}, uma variação de ${sign}${pctChange.toFixed(1)} porcento, multiplicador de ${multiplier.toFixed(2)} vezes.`);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: ttsState === 'playing' ? 'rgba(57,211,83,0.15)' : '#0f1a0f',
                color: '#39d353',
                border: `1.5px solid ${ttsState === 'playing' ? '#39d353' : '#39d35340'}`,
                boxShadow: ttsState === 'playing' ? '0 0 14px rgba(57,211,83,0.3)' : 'none',
                animation: ttsState === 'playing' ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>{ttsState === 'loading' ? '⏳' : ttsState === 'playing' ? '⏹' : '🔊'}</span>
              <span style={{ fontSize: 12 }}>{ttsState === 'playing' ? 'Parar' : ttsState === 'loading' ? '...' : 'Ouvir'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border p-8 sm:p-12 text-center" style={{ backgroundColor: '#060d06', borderColor: '#1a2e1a' }}>
          <p className="text-4xl mb-4" style={{ filter: 'drop-shadow(0 0 10px rgba(57,211,83,0.4))' }}>🔮</p>
          <p className="font-mono text-sm" style={{ color: '#39d353' }}>&gt; aguardando tokens...</p>
          <p className="font-mono text-xs mt-2" style={{ color: '#2a4a2a' }}>busque o Token X e o Token Y para simular</p>
        </div>
      )}

      <p className="text-xs font-mono text-center mt-4" style={{ color: '#1a2e1a' }}>
        ⚠ simulação educacional · não considera emissão futura de tokens · não é conselho financeiro
      </p>

      {shareModal && hasResult && (
        <ShareCard
          tokenX={{ name: x!.name, symbol: x!.symbol?.toUpperCase() ?? '', price: currentPriceX }}
          tokenY={{ name: y!.name, symbol: y!.symbol?.toUpperCase() ?? '' }}
          projectedPrice={projectedPrice}
          multiplier={multiplier}
          pctChange={pctChange}
          targetMC={targetMC}
          mode={mode}
          onClose={() => setShareModal(false)}
        />
      )}
    </div>
  );
}