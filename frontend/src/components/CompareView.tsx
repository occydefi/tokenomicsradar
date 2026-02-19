import { useLanguage } from '../contexts/LanguageContext';
import type { AnalysisResult } from '../types';
import { formatNumber, getScoreColor } from '../utils/analyzer';
import { getRedFlags } from './RedFlagsSection';

interface Props {
  analysis1: AnalysisResult;
  analysis2: AnalysisResult;
}

interface MetricRow {
  label: string;
  icon: string;
  val1: number | null;
  val2: number | null;
  format: (v: number) => string;
  /** lower is better */
  lowerIsBetter?: boolean;
  /** exact match (no winner) */
  noWinner?: boolean;
  suffix?: string;
}

function Winner({ wins, color }: { wins: boolean; color: string }) {
  if (!wins) return null;
  return (
    <span
      className="ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      ✓
    </span>
  );
}

export default function CompareView({ analysis1, analysis2 }: Props) {
  const { t } = useLanguage();
  const t1 = analysis1.token;
  const t2 = analysis2.token;
  const md1 = t1.market_data;
  const md2 = t2.market_data;

  const mc1 = md1.market_cap?.usd ?? 0;
  const mc2 = md2.market_cap?.usd ?? 0;
  const fdv1 = md1.fully_diluted_valuation?.usd ?? 0;
  const fdv2 = md2.fully_diluted_valuation?.usd ?? 0;
  const fdvRatio1 = mc1 > 0 ? fdv1 / mc1 : 0;
  const fdvRatio2 = mc2 > 0 ? fdv2 / mc2 : 0;

  const flags1 = getRedFlags(analysis1).length;
  const flags2 = getRedFlags(analysis2).length;

  const metrics: MetricRow[] = [
    {
      label: t.compareMetricMC,
      icon: '💰',
      val1: mc1,
      val2: mc2,
      format: (v) => formatNumber(v),
    },
    {
      label: t.compareMetricFDV,
      icon: '📊',
      val1: fdv1,
      val2: fdv2,
      format: (v) => formatNumber(v),
    },
    {
      label: t.compareMetricFDVRatio,
      icon: '⚖️',
      val1: fdvRatio1,
      val2: fdvRatio2,
      format: (v) => v.toFixed(2) + 'x',
      lowerIsBetter: true,
    },
    {
      label: t.compareMetricCirc,
      icon: '🔄',
      val1: analysis1.supplyMetrics.circulatingPct,
      val2: analysis2.supplyMetrics.circulatingPct,
      format: (v) => v.toFixed(1) + '%',
    },
    {
      label: t.compareMetricTeam,
      icon: '👥',
      val1: analysis1.distribution.team,
      val2: analysis2.distribution.team,
      format: (v) => v.toFixed(0) + '%',
      lowerIsBetter: true,
    },
    {
      label: t.compareMetricInv,
      icon: '🏦',
      val1: analysis1.distribution.investors,
      val2: analysis2.distribution.investors,
      format: (v) => v.toFixed(0) + '%',
      lowerIsBetter: true,
    },
    {
      label: t.compareMetricComm,
      icon: '🌍',
      val1: analysis1.distribution.community,
      val2: analysis2.distribution.community,
      format: (v) => v.toFixed(0) + '%',
    },
    {
      label: t.compareMetricVesting,
      icon: '🔐',
      val1: analysis1.vestingYears,
      val2: analysis2.vestingYears,
      format: (v) => v === 0 ? 'Nenhum' : v + ' anos',
    },
    {
      label: t.compareMetricScore,
      icon: '🎯',
      val1: analysis1.scores.total,
      val2: analysis2.scores.total,
      format: (v) => v.toFixed(1) + '/10',
    },
    {
      label: t.compareMetricFlags,
      icon: '🚩',
      val1: flags1,
      val2: flags2,
      format: (v) => v === 0 ? 'Nenhuma' : v.toString(),
      lowerIsBetter: true,
    },
  ];

  const verdictColors: Record<string, string> = {
    'Excelente': '#22c55e',
    'Bom': '#69f0ae',
    'Regular': '#f59e0b',
    'Ruim': '#ff6d00',
    'Evitar': '#ef4444',
  };

  return (
    <div className="rounded-2xl border p-3 sm:p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
        {t.compareSectionTitle}
      </h3>

      {/* Token Headers */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div />
        {[analysis1, analysis2].map((a) => (
          <div key={a.token.id} className="text-center">
            {a.token.image?.large && (
              <img
                src={a.token.image.large}
                alt={a.token.name}
                className="w-12 h-12 rounded-full mx-auto mb-2"
                style={{ border: '2px solid #1e2a45' }}
              />
            )}
            <p className="font-bold text-white text-sm">{a.token.name}</p>
            <p className="text-xs font-mono" style={{ color: '#00e5ff' }}>
              {a.token.symbol?.toUpperCase()}
            </p>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1"
              style={{
                color: verdictColors[a.verdict],
                backgroundColor: `${verdictColors[a.verdict]}20`,
              }}
            >
              {a.verdict}
            </span>
          </div>
        ))}
      </div>

      {/* Metrics Table */}
      <div className="space-y-2">
        {metrics.map((row) => {
          const v1 = row.val1 ?? 0;
          const v2 = row.val2 ?? 0;
          const tie = v1 === v2;
          const win1 = !tie && (row.lowerIsBetter ? v1 < v2 : v1 > v2);
          const win2 = !tie && !win1;

          const GREEN = '#22c55e';
          const NEUTRAL = '#9ca3af';

          return (
            <div
              key={row.label}
              className="grid grid-cols-3 gap-1 sm:gap-4 items-center py-2 px-2 sm:px-3 rounded-lg"
              style={{ backgroundColor: 'rgba(30,42,69,0.4)' }}
            >
              {/* Label */}
              <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2" style={{ color: '#9ca3af' }}>
                <span className="hidden sm:inline">{row.icon}</span>
                <span>{row.label}</span>
              </div>

              {/* Token 1 value */}
              <div className="text-center">
                <span
                  className="text-sm font-bold"
                  style={{ color: win1 ? GREEN : NEUTRAL }}
                >
                  {row.val1 !== null ? row.format(row.val1) : 'N/D'}
                </span>
                <Winner wins={win1} color={GREEN} />
              </div>

              {/* Token 2 value */}
              <div className="text-center">
                <span
                  className="text-sm font-bold"
                  style={{ color: win2 ? GREEN : NEUTRAL }}
                >
                  {row.val2 !== null ? row.format(row.val2) : 'N/D'}
                </span>
                <Winner wins={win2} color={GREEN} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner Banner */}
      {(() => {
        const score1 = analysis1.scores.total;
        const score2 = analysis2.scores.total;
        if (score1 === score2) return null;
        const winner = score1 > score2 ? analysis1 : analysis2;
        const color = verdictColors[winner.verdict] ?? GREEN_COLOR;
        return (
          <div
            className="mt-6 p-4 rounded-xl text-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
          >
            <p className="text-sm font-bold" style={{ color }}>
              🏆 {winner.token.name} ({winner.token.symbol?.toUpperCase()}) {t.compareWinner}
            </p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
              Score: {winner.scores.total.toFixed(1)}/10 vs {(winner === analysis1 ? analysis2 : analysis1).scores.total.toFixed(1)}/10
            </p>
          </div>
        );
      })()}

      <p className="text-xs mt-4" style={{ color: '#374151' }}>
        {t.compareFooter}
      </p>

      {/* ── Market Cap Simulator ── */}
      {mc1 > 0 && mc2 > 0 && (
        <div
          className="mt-6 rounded-2xl border p-5 relative overflow-hidden"
          style={{
            backgroundColor: '#060d06',
            borderColor: '#39d35330',
            boxShadow: '0 0 20px rgba(57,211,83,0.06)',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t border-l rounded-tl-2xl" style={{ borderColor: '#39d353' }} />
          <div className="absolute top-0 right-0 w-5 h-5 border-t border-r rounded-tr-2xl" style={{ borderColor: '#39d353' }} />

          <div className="flex items-center gap-2 mb-4">
            <span style={{ filter: 'drop-shadow(0 0 6px #39d353)' }}>🔮</span>
            <h4 className="font-bold font-mono text-sm tracking-widest" style={{ color: '#39d353' }}>
              MARKET CAP SIMULATOR
            </h4>
            <span className="text-xs font-mono ml-auto" style={{ color: '#2a4a2a' }}>
              &gt; se... então...
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario A → market cap of B */}
            {(() => {
              const price1 = t1.market_data.current_price?.usd ?? 0;
              const targetPrice1 = price1 * (mc2 / mc1);
              const mult1 = mc2 / mc1;
              const isUp1 = mult1 >= 1;
              const color1 = isUp1 ? '#39d353' : '#ff6d00';
              return (
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(57,211,83,0.04)', border: '1px solid rgba(57,211,83,0.15)' }}
                >
                  <p className="text-xs font-mono mb-3" style={{ color: '#4a7a4a' }}>
                    se <strong style={{ color: '#e8f5e8' }}>{t1.symbol?.toUpperCase()}</strong> alcançar market cap de <strong style={{ color: '#e8f5e8' }}>{t2.symbol?.toUpperCase()}</strong>
                  </p>
                  <div className="flex items-end gap-3">
                    <div>
                      <p className="text-xs font-mono mb-0.5" style={{ color: '#4a7a4a' }}>preço seria</p>
                      <p className="text-2xl font-bold font-mono" style={{ color: color1 }}>
                        ${targetPrice1 < 0.001
                          ? targetPrice1.toExponential(2)
                          : targetPrice1 < 1
                          ? targetPrice1.toFixed(4)
                          : targetPrice1.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="mb-1">
                      <span
                        className="text-sm font-mono font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: `${color1}15`, color: color1, border: `1px solid ${color1}40` }}
                      >
                        {isUp1 ? '▲' : '▼'} {mult1.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-mono mt-2" style={{ color: '#2a4a2a' }}>
                    atual: ${price1 < 0.001 ? price1.toExponential(2) : price1.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    &nbsp;· mc atual: {formatNumber(mc1)}
                  </p>
                </div>
              );
            })()}

            {/* Scenario B → market cap of A */}
            {(() => {
              const price2 = t2.market_data.current_price?.usd ?? 0;
              const targetPrice2 = price2 * (mc1 / mc2);
              const mult2 = mc1 / mc2;
              const isUp2 = mult2 >= 1;
              const color2 = isUp2 ? '#39d353' : '#ff6d00';
              return (
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}
                >
                  <p className="text-xs font-mono mb-3" style={{ color: '#6a3a8a' }}>
                    se <strong style={{ color: '#e8f5e8' }}>{t2.symbol?.toUpperCase()}</strong> alcançar market cap de <strong style={{ color: '#e8f5e8' }}>{t1.symbol?.toUpperCase()}</strong>
                  </p>
                  <div className="flex items-end gap-3">
                    <div>
                      <p className="text-xs font-mono mb-0.5" style={{ color: '#6a3a8a' }}>preço seria</p>
                      <p className="text-2xl font-bold font-mono" style={{ color: color2 }}>
                        ${targetPrice2 < 0.001
                          ? targetPrice2.toExponential(2)
                          : targetPrice2 < 1
                          ? targetPrice2.toFixed(4)
                          : targetPrice2.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="mb-1">
                      <span
                        className="text-sm font-mono font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: `${color2}15`, color: color2, border: `1px solid ${color2}40` }}
                      >
                        {isUp2 ? '▲' : '▼'} {mult2.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-mono mt-2" style={{ color: '#2a4a2a' }}>
                    atual: ${price2 < 0.001 ? price2.toExponential(2) : price2.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    &nbsp;· mc atual: {formatNumber(mc2)}
                  </p>
                </div>
              );
            })()}
          </div>

          <p className="text-xs font-mono mt-3" style={{ color: '#1a2e1a' }}>
            ⚠ simulação baseada em market cap atual · não considera inflação de supply · não é conselho financeiro
          </p>
        </div>
      )}
    </div>
  );
}

const GREEN_COLOR = '#22c55e';
