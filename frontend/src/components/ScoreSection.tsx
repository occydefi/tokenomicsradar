import type { AnalysisResult } from '../types';
import { getScoreColor } from '../utils/analyzer';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface Props {
  analysis: AnalysisResult;
}

export default function ScoreSection({ analysis }: Props) {
  const { scores, verdict, conclusion, token } = analysis;
  const totalColor = getScoreColor(scores.total);

  // Goblin-themed verdict colors
  const verdictConfig: Record<string, { color: string; glow: string }> = {
    'Excelente': { color: '#39d353', glow: 'rgba(57,211,83,0.4)' },
    'Bom':       { color: '#39d353', glow: 'rgba(57,211,83,0.3)' },
    'Regular':   { color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    'Ruim':      { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
    'Evitar':    { color: '#ff4444', glow: 'rgba(255,68,68,0.4)' },
  };
  const vc = verdictConfig[verdict] ?? { color: '#39d353', glow: 'rgba(57,211,83,0.3)' };

  const radarData = [
    { subject: 'Oferta', score: scores.supply, fullMark: 10 },
    { subject: 'Distribuição', score: scores.distribution, fullMark: 10 },
    { subject: 'Vesting', score: scores.vesting, fullMark: 10 },
    { subject: 'Utilidade', score: scores.utility, fullMark: 10 },
    { subject: 'Tesouraria', score: scores.treasury, fullMark: 10 },
  ];

  const scoreItems = [
    { label: 'Oferta & Inflação', score: scores.supply, weight: '25%', icon: '📦' },
    { label: 'Distribuição', score: scores.distribution, weight: '25%', icon: '🥧' },
    { label: 'Vesting', score: scores.vesting, weight: '20%', icon: '🔐' },
    { label: 'Utilidade', score: scores.utility, weight: '20%', icon: '⚡' },
    { label: 'Tesouraria', score: scores.treasury, weight: '10%', icon: '🏦' },
  ];

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#0d1a0d', borderColor: '#1a2e1a' }}
    >
      <h3 className="text-lg font-bold mb-6" style={{ color: '#39d353', textShadow: '0 0 10px rgba(57,211,83,0.4)' }}>
        🎯 Score Final & Conclusão
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Score breakdown */}
        <div>
          {/* Big score — terminal display style */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-28 h-28 rounded-lg flex flex-col items-center justify-center border-2 flex-shrink-0"
              style={{
                borderColor: totalColor,
                boxShadow: `0 0 20px ${totalColor}50, inset 0 0 20px rgba(57,211,83,0.05)`,
                backgroundColor: '#070d07',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              <span
                className="text-4xl font-bold"
                style={{
                  color: totalColor,
                  textShadow: `0 0 12px ${totalColor}`,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {scores.total.toFixed(1)}
              </span>
              <span className="text-xs" style={{ color: '#4a7a4a' }}>/ 10</span>
            </div>
            <div>
              <p className="text-xs mb-1 font-mono" style={{ color: '#4a7a4a' }}>&gt; veredicto_</p>
              <span
                className="text-xl font-bold px-4 py-2 rounded-lg inline-block font-mono"
                style={{
                  color: vc.color,
                  backgroundColor: `${vc.color}15`,
                  border: `1px solid ${vc.color}40`,
                  boxShadow: `0 0 10px ${vc.glow}`,
                }}
              >
                {verdict}
              </span>
              <p className="text-xs mt-2 font-mono" style={{ color: '#4a7a4a' }}>
                {token.name} • {token.symbol?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Score bars */}
          <div className="space-y-3">
            {scoreItems.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#6a9a6a' }}>
                    {item.icon} {item.label}{' '}
                    <span style={{ color: '#2a4a2a' }}>({item.weight})</span>
                  </span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: getScoreColor(item.score) }}
                  >
                    {item.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: '#1a2e1a' }}>
                  <div
                    className="h-1.5 rounded-full progress-bar"
                    style={{
                      width: `${(item.score / 10) * 100}%`,
                      backgroundColor: getScoreColor(item.score),
                      boxShadow: `0 0 4px ${getScoreColor(item.score)}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1a2e1a" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#4a7a4a', fontSize: 11 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#39d353"
                fill="#39d353"
                fillOpacity={0.15}
                dot={{ fill: '#39d353', r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conclusion */}
      <div
        className="mt-6 p-4 rounded-xl border-l-4"
        style={{ backgroundColor: '#070d07', borderLeftColor: totalColor }}
      >
        <p
          className="text-xs mb-2 font-bold font-mono tracking-widest"
          style={{ color: totalColor }}
        >
          &gt; CONCLUSÃO_
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#b8d4b8' }}>{conclusion}</p>
      </div>

      {/* Score methodology note */}
      <div
        className="mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
        style={{ backgroundColor: 'rgba(57,211,83,0.05)', color: '#4a7a4a' }}
      >
        <span>📐</span>
        <span>Score baseado puramente em tokenomics. Risco regulatório, transparência do time e comunidade aparecem como contexto nas seções acima, mas não afetam a pontuação.</span>
      </div>

      {/* Disclaimer */}
      <div
        className="mt-3 p-3 rounded-xl text-xs"
        style={{ backgroundColor: 'rgba(57,211,83,0.03)', color: '#2a4a2a' }}
      >
        ⚠️ Esta análise é gerada automaticamente com base em dados públicos e algoritmos de pontuação.
        Não constitui conselho financeiro. Faça sua própria pesquisa (DYOR) antes de investir.
      </div>
    </div>
  );
}
