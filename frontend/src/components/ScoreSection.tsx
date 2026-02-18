import type { AnalysisResult } from '../types';
import { getScoreColor } from '../utils/analyzer';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface Props {
  analysis: AnalysisResult;
}

export default function ScoreSection({ analysis }: Props) {
  const { scores, verdict, conclusion, token } = analysis;
  const totalColor = getScoreColor(scores.total);

  const verdictColors: Record<string, string> = {
    'Excelente': '#00c853',
    'Bom': '#69f0ae',
    'Regular': '#ffd600',
    'Ruim': '#ff6d00',
    'Evitar': '#ff3d3d',
  };
  const verdictColor = verdictColors[verdict];

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
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <h3 className="text-lg font-bold text-white mb-6">🎯 Score Final & Conclusão</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Score breakdown */}
        <div>
          {/* Big score */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 flex-shrink-0"
              style={{
                borderColor: totalColor,
                boxShadow: `0 0 30px ${totalColor}40`,
                backgroundColor: '#0a0e1a',
              }}
            >
              <span className="text-4xl font-bold text-white font-mono">{scores.total.toFixed(1)}</span>
              <span className="text-xs" style={{ color: '#6b7280' }}>/ 10</span>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#9ca3af' }}>Veredicto</p>
              <span
                className="text-2xl font-bold px-4 py-2 rounded-xl inline-block"
                style={{ color: verdictColor, backgroundColor: `${verdictColor}20` }}
              >
                {verdict}
              </span>
              <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
                {token.name} • {token.symbol?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Score bars */}
          <div className="space-y-3">
            {scoreItems.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#9ca3af' }}>{item.icon} {item.label} <span style={{ color: '#4b5563' }}>({item.weight})</span></span>
                  <span className="font-mono font-bold" style={{ color: getScoreColor(item.score) }}>
                    {item.score.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(item.score / 10) * 100}%`,
                      backgroundColor: getScoreColor(item.score),
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
              <PolarGrid stroke="#1e2a45" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#4f8eff"
                fill="#4f8eff"
                fillOpacity={0.2}
                dot={{ fill: '#4f8eff', r: 3 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conclusion */}
      <div
        className="mt-6 p-4 rounded-xl border-l-4"
        style={{ backgroundColor: '#0a0e1a', borderLeftColor: totalColor }}
      >
        <p className="text-xs mb-2 font-bold" style={{ color: totalColor }}>CONCLUSÃO</p>
        <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{conclusion}</p>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(79,142,255,0.05)', color: '#4b5563' }}>
        ⚠️ Esta análise é gerada automaticamente com base em dados públicos e algoritmos de pontuação. 
        Não constitui conselho financeiro. Faça sua própria pesquisa (DYOR) antes de investir.
      </div>
    </div>
  );
}
