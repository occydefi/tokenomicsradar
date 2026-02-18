import type { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  analysis: AnalysisResult;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (props: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DistributionSection({ analysis }: Props) {
  const { distribution, scores } = analysis;

  const chartData = [
    { name: 'Equipe/Fundadores', value: distribution.team, color: '#ff6b6b' },
    { name: 'VC/Investidores', value: distribution.investors, color: '#ffd600' },
    { name: 'Comunidade/Público', value: distribution.community, color: '#00c853' },
    { name: 'Tesouraria', value: distribution.treasury, color: '#4f8eff' },
    ...(distribution.other > 0 ? [{ name: 'Outros', value: distribution.other, color: '#00e5ff' }] : []),
  ].filter(d => d.value > 0);

  const ProgressRow = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span className="font-mono font-bold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
        <div className="h-2 rounded-full" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">🥧 Distribuição</h3>
        <span
          className="text-sm font-bold font-mono px-3 py-1 rounded-full"
          style={{
            color: scores.distribution >= 7 ? '#00c853' : scores.distribution >= 5 ? '#ffd600' : '#ff3d3d',
            backgroundColor: scores.distribution >= 7 ? 'rgba(0,200,83,0.1)' : scores.distribution >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(255,61,61,0.1)',
          }}
        >
          {scores.distribution.toFixed(1)}/10
        </span>
      </div>

      {/* Pie chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [String(value) !== undefined ? `${Number(value).toFixed(1)}%` : 'N/D', '']}
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1e2a45',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Progress bars */}
      <ProgressRow label="🔴 Equipe/Fundadores" value={distribution.team} color="#ff6b6b" />
      <ProgressRow label="🟡 VC/Investidores" value={distribution.investors} color="#ffd600" />
      <ProgressRow label="🟢 Comunidade/Público" value={distribution.community} color="#00c853" />
      <ProgressRow label="🔵 Tesouraria/Reserva" value={distribution.treasury} color="#4f8eff" />

      {/* Warning if team+VC > 40% */}
      {distribution.team + distribution.investors > 40 && (
        <div
          className="mt-3 p-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(255, 61, 61, 0.1)', color: '#ff3d3d' }}
        >
          ⚠️ Alta concentração: {(distribution.team + distribution.investors).toFixed(0)}% com equipe e investidores
        </div>
      )}

      {/* Source */}
      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: '#1e2a45', color: '#4b5563' }}>
        📌 {distribution.note} • {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}
