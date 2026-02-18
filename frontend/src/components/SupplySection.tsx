import type { AnalysisResult } from '../types';
import { formatTokenAmount } from '../utils/analyzer';

interface Props {
  analysis: AnalysisResult;
}

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
}

function ProgressBar({ label, value, max = 100, color = '#4f8eff', suffix = '%' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span className="font-mono font-bold text-white">
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
        <div
          className="h-2 rounded-full progress-bar transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function SupplySection({ analysis }: Props) {
  const { supplyMetrics, scores } = analysis;
  const {
    maxSupply,
    circulatingSupply,
    totalSupply,
    isFixed,
    circulatingPct,
    inflationRate,
  } = supplyMetrics;

  const inflationColor = inflationRate < 5 ? '#00c853' : inflationRate < 15 ? '#ffd600' : '#ff3d3d';

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">📦 Métricas de Oferta</h3>
        <div
          className="text-sm font-bold px-3 py-1 rounded-full font-mono"
          style={{
            backgroundColor: isFixed ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 61, 61, 0.1)',
            color: isFixed ? '#00c853' : '#ff3d3d',
          }}
        >
          {isFixed ? '🔒 Oferta Fixa' : '♾️ Sem Limite'}
        </div>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Oferta Circulante</p>
          <p className="font-bold text-white font-mono text-sm">{formatTokenAmount(circulatingSupply)}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Oferta Máxima</p>
          <p className="font-bold text-white font-mono text-sm">{formatTokenAmount(maxSupply) || '∞'}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Oferta Total</p>
          <p className="font-bold text-white font-mono text-sm">{formatTokenAmount(totalSupply)}</p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Score Oferta</p>
          <p className="font-bold font-mono" style={{ color: scores.supply >= 7 ? '#00c853' : scores.supply >= 5 ? '#ffd600' : '#ff3d3d' }}>
            {scores.supply.toFixed(1)}/10
          </p>
        </div>
      </div>

      {/* Progress bars */}
      <ProgressBar
        label="% da Oferta em Circulação"
        value={circulatingPct}
        color={circulatingPct > 70 ? '#00c853' : circulatingPct > 40 ? '#ffd600' : '#ff3d3d'}
      />
      <ProgressBar
        label="Taxa de Inflação Anual Estimada"
        value={Math.min(inflationRate, 100)}
        color={inflationColor}
        suffix="%"
      />

      {supplyMetrics.burnedPct !== null && supplyMetrics.burnedPct > 0 && (
        <ProgressBar
          label="Tokens Queimados"
          value={supplyMetrics.burnedPct}
          color="#00e5ff"
        />
      )}

      {/* Source */}
      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: '#1e2a45', color: '#4b5563' }}>
        📌 Fonte: CoinGecko API • Atualizado: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
