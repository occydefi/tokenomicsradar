import type { AnalysisResult } from '../types';
import { formatTokenAmount } from '../utils/analyzer';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  analysis: AnalysisResult;
}

export default function VestingSection({ analysis }: Props) {
  const { t, lang } = useLanguage();
  const { vestingData, scores } = analysis;
  const { totalLocked, totalUnlocked, lockedPct, estimatedFullUnlock, note } = vestingData;
  const unlockedPct = 100 - lockedPct;

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">{t.vestingSectionTitle}</h3>
        <span
          className="text-sm font-bold font-mono px-3 py-1 rounded-full"
          style={{
            color: scores.vesting >= 7 ? '#00c853' : scores.vesting >= 5 ? '#ffd600' : '#ff3d3d',
            backgroundColor: scores.vesting >= 7 ? 'rgba(0,200,83,0.1)' : scores.vesting >= 5 ? 'rgba(255,214,0,0.1)' : 'rgba(255,61,61,0.1)',
          }}
        >
          {scores.vesting.toFixed(1)}/10
        </span>
      </div>

      {/* Vesting legend */}
      <p className="text-xs italic mb-5" style={{ color: '#4b5563' }}>
        {t.vestingDesc}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>{t.vestingUnlocked}</p>
          <p className="font-bold text-white font-mono text-sm">{formatTokenAmount(totalUnlocked)}</p>
          <p className="text-xs mt-1" style={{ color: '#00c853' }}>{unlockedPct.toFixed(1)}%</p>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-xs mb-1" style={{ color: '#6b7280' }}>{t.vestingLocked}</p>
          <p className="font-bold text-white font-mono text-sm">{formatTokenAmount(totalLocked)}</p>
          <p className="text-xs mt-1" style={{ color: '#ffd600' }}>{lockedPct.toFixed(1)}%</p>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
          <span>{t.vestingUnlockedLabel}</span>
          <span>{t.vestingLockedLabel}</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex" style={{ backgroundColor: '#1e2a45' }}>
          <div
            className="h-full rounded-l-full transition-all duration-1000"
            style={{ width: `${Math.max(unlockedPct, 2)}%`, backgroundColor: '#00c853' }}
          />
          <div
            className="h-full rounded-r-full transition-all duration-1000"
            style={{ width: `${Math.max(lockedPct, 2)}%`, backgroundColor: '#ffd600' }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span style={{ color: '#00c853' }}>{unlockedPct.toFixed(0)}% {t.vestingFree}</span>
          <span style={{ color: '#ffd600' }}>{lockedPct.toFixed(0)}% {t.vestingBlockedLabel}</span>
        </div>
      </div>

      {/* Unlock estimate */}
      {estimatedFullUnlock && (
        <div
          className="p-3 rounded-xl mb-4"
          style={{ backgroundColor: lockedPct > 0 ? 'rgba(255,214,0,0.08)' : 'rgba(0,200,83,0.08)' }}
        >
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            {lockedPct > 0 ? t.vestingEstimated : t.vestingStatus}
            <span className="font-bold text-white">{estimatedFullUnlock}</span>
          </p>
        </div>
      )}

      {/* Risk indicator */}
      {lockedPct > 40 && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(255, 61, 61, 0.08)', color: '#ff3d3d' }}
        >
          {t.vestingRiskHigh.replace('{{pct}}', lockedPct.toFixed(0))}
        </div>
      )}

      {lockedPct === 0 && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(0,200,83,0.08)', color: '#00c853' }}
        >
          {t.vestingFully}
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: '#1e2a45', color: '#4b5563' }}>
        📌 {note} • {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')}
      </div>
    </div>
  );
}
