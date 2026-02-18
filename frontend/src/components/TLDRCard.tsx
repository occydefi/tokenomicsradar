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
  if (score >= 8)   return { bg: 'rgba(0, 200, 83, 0.08)',   text: '#00c853', border: '#00c85330', glow: '#00c85325' };
  if (score >= 6.5) return { bg: 'rgba(105, 240, 174, 0.08)', text: '#69f0ae', border: '#69f0ae30', glow: '#69f0ae25' };
  if (score >= 5)   return { bg: 'rgba(255, 214, 0, 0.08)',   text: '#ffd600', border: '#ffd60030', glow: '#ffd60025' };
  if (score >= 3.5) return { bg: 'rgba(255, 109, 0, 0.08)',   text: '#ff6d00', border: '#ff6d0030', glow: '#ff6d0025' };
  return               { bg: 'rgba(255, 61, 61, 0.08)',    text: '#ff3d3d', border: '#ff3d3d30', glow: '#ff3d3d25' };
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
        boxShadow: `0 0 32px ${c.glow}`,
      }}
    >
      {/* Header label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: c.text }}>
          ⚡ TL;DR — Resumo Rápido
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score Circle + Badge */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 mb-2"
            style={{
              borderColor: c.text,
              boxShadow: `0 0 24px ${c.text}40`,
              backgroundColor: '#0a0e1a',
            }}
          >
            <span className="text-2xl font-bold font-mono" style={{ color: c.text }}>
              {scores.total.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: '#6b7280' }}>/10</span>
          </div>
          <span
            className="text-sm font-bold px-4 py-1 rounded-full"
            style={{
              color: c.text,
              backgroundColor: `${c.text}20`,
              border: `1px solid ${c.text}40`,
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
              className="text-xs font-bold mb-2 uppercase tracking-wide"
              style={{ color: '#00c853' }}
            >
              ✅ Pontos Positivos
            </p>
            <ul className="space-y-2">
              {topPros.length > 0 ? (
                topPros.map((pro, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#d1d5db' }}>
                    <span style={{ color: '#00c853', flexShrink: 0, marginTop: 2 }}>＋</span>
                    <span>{pro}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#6b7280' }}>
                  Nenhum ponto positivo identificado
                </li>
              )}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide"
              style={{ color: '#ff3d3d' }}
            >
              ⚠️ Pontos de Atenção
            </p>
            <ul className="space-y-2">
              {topCons.length > 0 ? (
                topCons.map((con, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#d1d5db' }}>
                    <span style={{ color: '#ff3d3d', flexShrink: 0, marginTop: 2 }}>－</span>
                    <span>{con}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#6b7280' }}>
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
