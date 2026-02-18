import type { AnalysisResult } from '../types';
import { formatNumber } from '../utils/analyzer';

interface Props {
  analysis: AnalysisResult;
}

export default function TreasurySection({ analysis }: Props) {
  const { treasuryData, scores, distribution } = analysis;
  const { estimatedSize, runwayMonths, note } = treasuryData;

  const runwayColor = runwayMonths 
    ? runwayMonths > 36 ? '#00c853' 
    : runwayMonths > 24 ? '#69f0ae'
    : runwayMonths > 12 ? '#ffd600' 
    : '#ff3d3d'
    : '#9ca3af';

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">🏦 Tesouraria do Protocolo</h3>
        <span
          className="text-sm font-bold font-mono px-3 py-1 rounded-full"
          style={{
            color: scores.treasury >= 7 ? '#00c853' : scores.treasury >= 5 ? '#ffd600' : '#ff3d3d',
            backgroundColor: scores.treasury >= 7 ? 'rgba(0,200,83,0.1)' : scores.treasury >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(255,61,61,0.1)',
          }}
        >
          {scores.treasury.toFixed(1)}/10
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Treasury Size */}
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Tamanho da Tesouraria</p>
          <p className="text-2xl font-bold text-white">
            {estimatedSize ? formatNumber(estimatedSize) : 'N/D'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#4b5563' }}>Estimativa USD</p>
          <p className="text-xs italic mt-2" style={{ color: '#4b5563' }}>Reserva do projeto em dólares.</p>
        </div>

        {/* Treasury % */}
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-2" style={{ color: '#6b7280' }}>% da Tesouraria</p>
          <p className="text-2xl font-bold" style={{ color: '#4f8eff' }}>
            {distribution.treasury.toFixed(1)}%
          </p>
          <p className="text-xs mt-1" style={{ color: '#4b5563' }}>da oferta total</p>
          <p className="text-xs italic mt-2" style={{ color: '#4b5563' }}>Reserva do projeto para desenvolvimento e operações.</p>
        </div>

        {/* Runway */}
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-2" style={{ color: '#6b7280' }}>Runway Estimado</p>
          <p className="text-2xl font-bold" style={{ color: runwayColor }}>
            {runwayMonths ? `${runwayMonths}m` : 'N/D'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#4b5563' }}>meses de operação</p>
          <p className="text-xs italic mt-2" style={{ color: '#4b5563' }}>Quantos meses o projeto sobrevive. Ideal: 24+ meses.</p>
        </div>
      </div>

      {/* Runway bar */}
      {runwayMonths && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
            <span>Saúde da Tesouraria</span>
            <span>{runwayMonths > 36 ? 'Excelente' : runwayMonths > 24 ? 'Boa' : runwayMonths > 12 ? 'Regular' : 'Preocupante'}</span>
          </div>
          <div className="h-3 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
            <div
              className="h-3 rounded-full"
              style={{
                width: `${Math.min((runwayMonths / 60) * 100, 100)}%`,
                backgroundColor: runwayColor,
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}>
            <span>0m</span>
            <span>12m</span>
            <span>24m</span>
            <span>36m</span>
            <span>60m+</span>
          </div>
        </div>
      )}

      {runwayMonths && runwayMonths < 12 && (
        <div className="mt-3 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(255,61,61,0.08)', color: '#ff3d3d' }}>
          ⚠️ Runway abaixo de 12 meses — risco de necessidade de nova captação ou cortes
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: '#1e2a45', color: '#4b5563' }}>
        📌 {note} • {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
}
