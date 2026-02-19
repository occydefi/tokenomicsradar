import type { AnalysisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  analysis: AnalysisResult;
}

interface BoolItemProps {
  label: string;
  value: boolean;
  icon: string;
  trueLabel: string;
  falseLabel: string;
  legend?: string;
}

function BoolItem({ label, value, icon, trueLabel, falseLabel, legend }: BoolItemProps) {
  return (
    <div
      className="p-3 rounded-xl"
      style={{ backgroundColor: '#0a0e1a' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm" style={{ color: '#d1d5db' }}>{label}</span>
        </div>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{
            color: value ? '#00c853' : '#ff3d3d',
            backgroundColor: value ? 'rgba(0,200,83,0.1)' : 'rgba(255,61,61,0.1)',
          }}
        >
          {value ? `✓ ${trueLabel}` : `✗ ${falseLabel}`}
        </span>
      </div>
      {legend && (
        <p className="text-xs italic mt-2" style={{ color: '#4b5563' }}>{legend}</p>
      )}
    </div>
  );
}

export default function UtilitySection({ analysis }: Props) {
  const { t, lang } = useLanguage();
  const { utilityData, scores } = analysis;
  const trueCount = [
    utilityData.neededToUse,
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">{t.utilitySectionTitle}</h3>
        <span
          className="text-sm font-bold font-mono px-3 py-1 rounded-full"
          style={{
            color: scores.utility >= 7 ? '#00c853' : scores.utility >= 5 ? '#ffd600' : '#ff3d3d',
            backgroundColor: scores.utility >= 7 ? 'rgba(0,200,83,0.1)' : scores.utility >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(255,61,61,0.1)',
          }}
        >
          {scores.utility.toFixed(1)}/10
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <BoolItem
          label={t.utilityNeeded}
          value={utilityData.neededToUse}
          icon="🔧"
          trueLabel={t.utilitySim}
          falseLabel={t.utilityNao}
          legend={t.utilityNeededLegend}
        />
        <BoolItem
          label={t.utilityStaking}
          value={utilityData.stakingAvailable}
          icon="💎"
          trueLabel={t.utilitySim}
          falseLabel={t.utilityNao}
          legend={t.utilityStakingLegend}
        />
        <BoolItem
          label={t.utilityGovernance}
          value={utilityData.governancePower}
          icon="🗳️"
          trueLabel={t.utilitySim}
          falseLabel={t.utilityNao}
          legend={t.utilityGovernanceLegend}
        />
        <BoolItem
          label={t.utilityFeeburn}
          value={utilityData.feeBurning}
          icon="🔥"
          trueLabel={t.utilityDeflacionario}
          falseLabel={t.utilitySemQueima}
          legend={t.utilityFeeburnLegend}
        />
      </div>

      {/* Score bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-2" style={{ color: '#6b7280' }}>
          <span>{t.utilityReal}</span>
          <span>{t.utilityCriteria.replace('{{n}}', trueCount.toString())}</span>
        </div>
        <div className="h-3 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
          <div
            className="h-3 rounded-full"
            style={{
              width: `${(trueCount / 4) * 100}%`,
              background: 'linear-gradient(90deg, #4f8eff, #00e5ff)',
            }}
          />
        </div>
      </div>

      {/* Insight */}
      {trueCount === 4 && (
        <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(0,200,83,0.08)', color: '#00c853' }}>
          {t.utilityFull}
        </div>
      )}
      {trueCount === 0 && (
        <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: 'rgba(255,61,61,0.08)', color: '#ff3d3d' }}>
          {t.utilityNone}
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: '#1e2a45', color: '#4b5563' }}>
        {t.utilitySource} • {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')}
      </div>
    </div>
  );
}
