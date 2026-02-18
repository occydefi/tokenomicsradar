import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

interface RedFlag {
  id: string;
  message: string;
  severity: 'high' | 'medium';
}

export function getRedFlags(analysis: AnalysisResult): RedFlag[] {
  const flags: RedFlag[] = [];
  const { distribution, vestingYears, utilityData, supplyMetrics, token } = analysis;
  const md = token.market_data;
  const marketCap = md.market_cap?.usd;
  const fdv = md.fully_diluted_valuation?.usd;

  // 1. Team >= 40 AND vestingYears == 0
  if (distribution.team >= 40 && vestingYears === 0) {
    flags.push({
      id: 'team-no-lock',
      message: '⚠️ Equipe detém 40%+ sem lock declarado',
      severity: 'high',
    });
  }

  // 2. Investors >= 30
  if (distribution.investors >= 30) {
    flags.push({
      id: 'vc-concentration',
      message: '⚠️ Concentração VC muito alta (30%+)',
      severity: 'high',
    });
  }

  // 3. FDV > 10x marketCap
  if (fdv && marketCap && fdv > 10 * marketCap) {
    flags.push({
      id: 'fdv-ratio',
      message: '⚠️ FDV mais de 10x o Market Cap',
      severity: 'high',
    });
  }

  // 4. maxSupply == null AND feeBurning == false
  if (supplyMetrics.maxSupply === null && !utilityData.feeBurning) {
    flags.push({
      id: 'infinite-supply',
      message: '⚠️ Supply infinito sem mecanismo deflacionário',
      severity: 'medium',
    });
  }

  // 5. Community < 20
  if (distribution.community < 20) {
    flags.push({
      id: 'low-community',
      message: '⚠️ Menos de 20% do supply para comunidade',
      severity: 'medium',
    });
  }

  // 6. Utility score == 0 (all utility flags false)
  const utilityCount = [
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
    utilityData.neededToUse,
  ].filter(Boolean).length;

  if (utilityCount === 0) {
    flags.push({
      id: 'no-utility',
      message: '⚠️ Sem utilidade clara do token',
      severity: 'high',
    });
  }

  return flags;
}

export default function RedFlagsSection({ analysis }: Props) {
  const flags = getRedFlags(analysis);

  if (flags.length === 0) return null;

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#1a0a0a', borderColor: '#ef4444' }}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
        🚩 Red Flags Detectadas
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
        >
          {flags.length}
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {flags.map(flag => (
          <div
            key={flag.id}
            className="flex items-start gap-3 p-4 rounded-xl border"
            style={{
              backgroundColor: flag.severity === 'high'
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(245,158,11,0.10)',
              borderColor: flag.severity === 'high'
                ? 'rgba(239,68,68,0.4)'
                : 'rgba(245,158,11,0.4)',
            }}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">
              {flag.severity === 'high' ? '🔴' : '🟡'}
            </span>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: flag.severity === 'high' ? '#ef4444' : '#f59e0b' }}
              >
                {flag.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-4" style={{ color: '#6b7280' }}>
        🔴 Risco alto &nbsp;|&nbsp; 🟡 Risco médio &nbsp;|&nbsp; Análise baseada em dados públicos
      </p>
    </div>
  );
}
