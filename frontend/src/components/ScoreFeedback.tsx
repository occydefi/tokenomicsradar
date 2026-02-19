/**
 * ScoreFeedback.tsx
 * "Discordo desta nota" — user challenge panel.
 * User writes their argument → AI (Claude) reconsiders the score.
 */

import { useState } from 'react';
import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

type FeedbackState = 'idle' | 'open' | 'loading' | 'done' | 'error';

interface ReconsiderationResult {
  verdict: 'confirmed' | 'adjusted' | 'partially';
  newScore?: number;
  reasoning: string;
  validPoints: string[];
  counterPoints: string[];
}

export default function ScoreFeedback({ analysis }: Props) {
  const [state, setState] = useState<FeedbackState>('idle');
  const [argument, setArgument] = useState('');
  const [result, setResult] = useState<ReconsiderationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { token, scores, verdict } = analysis;

  const handleSubmit = async () => {
    if (!argument.trim() || argument.length < 20) return;

    setState('loading');
    setError(null);

    try {
      const response = await fetch('/api/reconsider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenName: token.name,
          tokenSymbol: token.symbol?.toUpperCase(),
          currentScore: scores.total,
          currentVerdict: verdict,
          scores: {
            supply: scores.supply,
            distribution: scores.distribution,
            vesting: scores.vesting,
            utility: scores.utility,
            treasury: scores.treasury,
          },
          userArgument: argument,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setResult(data);
      setState('done');
    } catch (err) {
      setError('Erro ao processar reconsideração. Tente novamente.');
      setState('error');
    }
  };

  const verdictColor = (v: string) => {
    if (v === 'confirmed') return '#ff6d00';
    if (v === 'adjusted') return '#00ff41';
    return '#ffd600';
  };

  const verdictLabel = (v: string) => {
    if (v === 'confirmed') return '⚖️ NOTA MANTIDA';
    if (v === 'adjusted') return '✅ NOTA AJUSTADA';
    return '🤔 PARCIALMENTE VÁLIDO';
  };

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all hover:opacity-80"
        style={{
          backgroundColor: 'rgba(255,109,0,0.08)',
          border: '1px solid rgba(255,109,0,0.3)',
          color: '#ff6d00',
        }}
        title="Discorda da nota? Apresente seu argumento e a plataforma reavalia."
      >
        <span>⚖️</span>
        <span>Discordo desta nota</span>
      </button>
    );
  }

  return (
    <div
      className="rounded-xl border p-5 mt-4 font-mono"
      style={{
        backgroundColor: '#060c06',
        borderColor: 'rgba(255,109,0,0.3)',
        boxShadow: '0 0 20px rgba(255,109,0,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: '#ff6d00', fontSize: '14px' }}>⚖️</span>
          <span className="text-sm font-bold" style={{ color: '#ff6d00', letterSpacing: '1px' }}>
            CONTESTAR NOTA — {token.symbol?.toUpperCase()} {scores.total.toFixed(1)}/10
          </span>
        </div>
        {state !== 'loading' && (
          <button
            onClick={() => { setState('idle'); setArgument(''); setResult(null); }}
            className="text-xs opacity-50 hover:opacity-100"
            style={{ color: '#e8f5e8' }}
          >
            ✕ fechar
          </button>
        )}
      </div>

      {/* Input state */}
      {(state === 'open' || state === 'error') && (
        <>
          <p className="text-xs mb-3" style={{ color: '#4a7a4a' }}>
            &gt; Apresente seu argumento. A plataforma irá reavaliar a nota com base nos pontos levantados.
          </p>
          <textarea
            value={argument}
            onChange={e => setArgument(e.target.value)}
            placeholder="Ex: O staking do PENDLE distribui 80% das fees para vePENDLE holders — isso é captura de valor real que a nota não reflete adequadamente..."
            rows={4}
            className="w-full rounded-lg p-3 text-sm resize-none focus:outline-none"
            style={{
              backgroundColor: '#0d1a0d',
              border: '1px solid rgba(57,211,83,0.2)',
              color: '#c8e6c9',
              fontFamily: 'inherit',
            }}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: argument.length < 20 ? '#4a4a4a' : '#4a7a4a' }}>
              {argument.length} chars {argument.length < 20 ? `(mín. 20)` : '✓'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={argument.length < 20}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: argument.length >= 20 ? 'rgba(57,211,83,0.15)' : 'rgba(57,211,83,0.04)',
                border: `1px solid ${argument.length >= 20 ? 'rgba(57,211,83,0.5)' : 'rgba(57,211,83,0.15)'}`,
                color: argument.length >= 20 ? '#39d353' : '#2a4a2a',
                cursor: argument.length < 20 ? 'not-allowed' : 'pointer',
              }}
            >
              🧌 REAVALIAR
            </button>
          </div>
          {state === 'error' && (
            <p className="text-xs mt-2" style={{ color: '#ff6d00' }}>{error}</p>
          )}
        </>
      )}

      {/* Loading state */}
      {state === 'loading' && (
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="text-2xl animate-spin">⚙️</div>
          <p className="text-sm" style={{ color: '#39d353' }}>
            &gt; Occy está reavaliando os fundamentos...
          </p>
          <p className="text-xs" style={{ color: '#2a4a2a' }}>
            cross-referencing argument against tokenomics data...
          </p>
        </div>
      )}

      {/* Result state */}
      {state === 'done' && result && (
        <div>
          {/* Verdict banner */}
          <div
            className="rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
            style={{
              backgroundColor: `${verdictColor(result.verdict)}10`,
              border: `1px solid ${verdictColor(result.verdict)}40`,
            }}
          >
            <span className="font-bold text-sm" style={{ color: verdictColor(result.verdict), letterSpacing: '1px' }}>
              {verdictLabel(result.verdict)}
            </span>
            {result.newScore !== undefined && result.verdict === 'adjusted' && (
              <span className="text-sm font-bold" style={{ color: '#00ff41' }}>
                {scores.total.toFixed(1)} → <span style={{ fontSize: '18px' }}>{result.newScore.toFixed(1)}</span>/10
              </span>
            )}
          </div>

          {/* Reasoning */}
          <div className="mb-4">
            <p className="text-xs mb-2" style={{ color: '#4a7a4a' }}>&gt; raciocínio_occy:</p>
            <p className="text-sm leading-relaxed" style={{ color: '#c8e6c9' }}>
              {result.reasoning}
            </p>
          </div>

          {/* Points grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.validPoints.length > 0 && (
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: 'rgba(57,211,83,0.05)', border: '1px solid rgba(57,211,83,0.15)' }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: '#39d353' }}>✓ Pontos válidos</p>
                {result.validPoints.map((pt, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#a8d5a8' }}>◆ {pt}</p>
                ))}
              </div>
            )}
            {result.counterPoints.length > 0 && (
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: 'rgba(255,109,0,0.05)', border: '1px solid rgba(255,109,0,0.15)' }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: '#ff6d00' }}>✗ Contra-argumentos</p>
                {result.counterPoints.map((pt, i) => (
                  <p key={i} className="text-xs mb-1" style={{ color: '#d4a870' }}>◆ {pt}</p>
                ))}
              </div>
            )}
          </div>

          <p className="text-xs mt-3 text-center" style={{ color: '#2a4a2a' }}>
            ⚠ reconsideração baseada no argumento apresentado · não constitui conselho financeiro
          </p>

          <button
            onClick={() => { setState('open'); setResult(null); }}
            className="mt-3 text-xs underline opacity-50 hover:opacity-100 w-full text-center"
            style={{ color: '#e8f5e8' }}
          >
            contestar novamente
          </button>
        </div>
      )}
    </div>
  );
}
