import type { AnalysisResult } from '../types';
import { getRedFlags } from '../components/RedFlagsSection';

/**
 * Generates a natural-sounding 3-4 sentence analysis paragraph in Portuguese
 * using a sophisticated template system — no API calls needed.
 */
export function generateAnalysisText(analysis: AnalysisResult): string {
  const { token, scores, distribution, vestingYears, utilityData, supplyMetrics, verdict } = analysis;
  const name = token.name;
  const symbol = token.symbol?.toUpperCase() ?? '';
  const score = scores.total;
  const flags = getRedFlags(analysis);
  const flagCount = flags.length;

  // ── Sentence 1: Overview & Score ──────────────────────────────
  const overviewTemplates = [
    `${name} (${symbol}) apresenta fundamentos tokenômicos ${describeScore(score)}, com pontuação geral de ${score.toFixed(1)}/10 segundo nossa metodologia.`,
    `Após análise detalhada, ${name} obteve nota ${score.toFixed(1)}/10, refletindo uma estrutura tokenômica ${describeScore(score)}.`,
    `Nossa análise posiciona ${name} com um score de ${score.toFixed(1)}/10 — classificado como "${verdict}" no espectro tokenômico.`,
  ];
  const s1 = pick(overviewTemplates, name);

  // ── Sentence 2: Distribution & Vesting ────────────────────────
  let s2 = '';
  const totalInsiders = distribution.team + distribution.investors;
  if (totalInsiders === 0) {
    s2 = `A distribuição é exemplar, com 100% da oferta destinada à comunidade em formato de lançamento justo (fair launch), eliminando riscos de concentração por insiders.`;
  } else if (totalInsiders < 20) {
    s2 = `A distribuição é saudável, com apenas ${totalInsiders}% alocados a equipe e investidores${vestingYears >= 3 ? ` e vesting de ${vestingYears} anos garantindo comprometimento de longo prazo` : ''}.`;
  } else if (totalInsiders < 40) {
    s2 = `A distribuição apresenta ${totalInsiders}% para equipe e investidores${vestingYears > 0 ? `, com período de vesting de ${vestingYears} ano${vestingYears > 1 ? 's' : ''} para reduzir riscos de venda antecipada` : ', sem vesting declarado, o que aumenta o risco de pressão vendedora'}.`;
  } else {
    s2 = `A concentração de ${totalInsiders}% com equipe e investidores é preocupante${vestingYears === 0 ? ' e o ausência de vesting declarado representa risco significativo para holders' : `, embora o vesting de ${vestingYears} ano${vestingYears > 1 ? 's' : ''} mitigue parcialmente este risco`}.`;
  }

  // ── Sentence 3: Utility & Supply ──────────────────────────────
  const utilityCount = [
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
    utilityData.neededToUse,
  ].filter(Boolean).length;

  const utilityFeatures: string[] = [];
  if (utilityData.neededToUse) utilityFeatures.push('uso obrigatório no protocolo');
  if (utilityData.stakingAvailable) utilityFeatures.push('staking');
  if (utilityData.governancePower) utilityFeatures.push('governança on-chain');
  if (utilityData.feeBurning) utilityFeatures.push('queima de fees');

  let s3 = '';
  if (utilityCount === 0) {
    s3 = `Em termos de utilidade, ${symbol} carece de casos de uso claros, sem staking, governança, queima de fees ou necessidade de uso no protocolo — o que compromete a demanda orgânica.`;
  } else if (utilityCount === 1) {
    s3 = `O token oferece ${utilityFeatures[0]} como principal caso de uso${supplyMetrics.isFixed ? ', e conta com oferta máxima fixa como proteção contra inflação' : ''}.`;
  } else if (utilityCount === 2) {
    s3 = `${symbol} tem utilidade razoável com ${utilityFeatures.slice(0, 2).join(' e ')}${supplyMetrics.isFixed ? ', além de oferta máxima fixada' : ''}.`;
  } else {
    s3 = `A utilidade do token é robusta: ${utilityFeatures.join(', ')}${supplyMetrics.isFixed ? ' — e a oferta máxima fixada adiciona escassez ao modelo' : ''}.`;
  }

  // ── Sentence 4: Red Flags / Conclusion ────────────────────────
  let s4 = '';
  if (flagCount === 0) {
    if (score >= 7) {
      s4 = `Não foram detectadas red flags críticas, tornando ${name} uma das opções mais sólidas em termos de tokenomics no mercado atual.`;
    } else {
      s4 = `Embora não haja red flags críticas, investidores devem monitorar os pontos de atenção identificados antes de tomar decisão.`;
    }
  } else if (flagCount === 1) {
    s4 = `Atenção: foi identificada ${flagCount} red flag (${flags[0].message.replace(/⚠️\s*/, '')}), que deve ser avaliada cuidadosamente antes de qualquer decisão de investimento.`;
  } else {
    s4 = `Foram identificadas ${flagCount} red flags, incluindo ${flags.slice(0, 2).map(f => f.message.replace(/⚠️\s*/, '')).join(' e ')}, recomendando cautela e pesquisa aprofundada (DYOR) antes de qualquer posicionamento.`;
  }

  return [s1, s2, s3, s4].join(' ');
}

function describeScore(score: number): string {
  if (score >= 8.5) return 'excepcionais';
  if (score >= 7.5) return 'muito sólidos';
  if (score >= 6.5) return 'bons';
  if (score >= 5.5) return 'razoáveis';
  if (score >= 4.5) return 'medianos';
  if (score >= 3.5) return 'preocupantes';
  return 'críticos';
}

/** Deterministic pick based on a seed string */
function pick<T>(arr: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  }
  return arr[hash % arr.length];
}
