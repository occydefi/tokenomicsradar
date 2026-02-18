import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

interface ColorConfig {
  bg: string;
  text: string;
  border: string;
  glow: string;
}

function getScoreColors(score: number): ColorConfig {
  if (score >= 8)   return { bg: 'rgba(57, 211, 83, 0.06)',   text: '#39d353', border: 'rgba(57,211,83,0.4)',  glow: 'rgba(57,211,83,0.2)'  };
  if (score >= 5)   return { bg: 'rgba(245, 158, 11, 0.06)',  text: '#f59e0b', border: 'rgba(245,158,11,0.4)', glow: 'rgba(245,158,11,0.2)' };
  return               { bg: 'rgba(255, 68, 68, 0.06)',    text: '#ff4444', border: 'rgba(255,68,68,0.4)',  glow: 'rgba(255,68,68,0.2)'  };
}

export default function TLDRCard({ analysis }: Props) {
  const { scores, verdict, pros, cons } = analysis;
  const c = getScoreColors(scores.total);

  const topPros = pros.slice(0, 3);
  const topCons = cons.slice(0, 3);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: c.bg,
        borderColor: c.border,
        boxShadow: `0 0 20px ${c.glow}`,
      }}
    >
      {/* Header label */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-xs font-bold tracking-widest uppercase font-mono"
          style={{ color: c.text, textShadow: `0 0 8px ${c.glow}` }}
        >
          ⚡ TL;DR — Resumo Rápido
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score Circle + Badge */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 mb-2"
            style={{
              borderColor: c.text,
              boxShadow: `0 0 20px ${c.glow}, inset 0 0 15px rgba(57,211,83,0.04)`,
              backgroundColor: '#070d07',
            }}
          >
            <span
              className="text-2xl font-bold font-mono"
              style={{
                color: c.text,
                textShadow: `0 0 10px ${c.text}`,
              }}
            >
              {scores.total.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: '#4a7a4a' }}>/10</span>
          </div>
          <span
            className="text-sm font-bold px-4 py-1 rounded-full font-mono"
            style={{
              color: c.text,
              backgroundColor: `${c.text}15`,
              border: `1px solid ${c.text}50`,
              boxShadow: `0 0 8px ${c.glow}`,
            }}
          >
            {verdict}
          </span>
        </div>

        {/* Pros & Cons side by side */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Pros */}
          <div>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide font-mono"
              style={{ color: '#39d353', textShadow: '0 0 6px rgba(57,211,83,0.4)' }}
            >
              ✅ Pontos Positivos
            </p>
            <ul className="space-y-2">
              {topPros.length > 0 ? (
                topPros.map((pro, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#b8d4b8' }}>
                    <span style={{ color: '#39d353', flexShrink: 0, marginTop: 2 }}>＋</span>
                    <span>{pro}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#4a7a4a' }}>
                  Nenhum ponto positivo identificado
                </li>
              )}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide font-mono"
              style={{ color: '#ff4444', textShadow: '0 0 6px rgba(255,68,68,0.4)' }}
            >
              ⚠️ Pontos de Atenção
            </p>
            <ul className="space-y-2">
              {topCons.length > 0 ? (
                topCons.map((con, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#b8d4b8' }}>
                    <span style={{ color: '#ff4444', flexShrink: 0, marginTop: 2 }}>－</span>
                    <span>{con}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#4a7a4a' }}>
                  Nenhum ponto negativo identificado
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
