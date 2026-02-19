import type { AnalysisResult } from '../types';
import { getRedFlags } from '../components/RedFlagsSection';
import { REGULATORY_DATA } from './regulatoryData';

/**
 * Generates a natural-sounding 3-4 sentence analysis paragraph
 * using a sophisticated template system — no API calls needed.
 * Supports 'pt' (Portuguese) and 'en' (English).
 */
export function generateAnalysisText(analysis: AnalysisResult, lang: 'pt' | 'en' = 'pt'): string {
  if (lang === 'en') return generateAnalysisTextEn(analysis);
  return generateAnalysisTextPt(analysis);
}

// ─── Portuguese ──────────────────────────────────────────────────────────────

function generateAnalysisTextPt(analysis: AnalysisResult): string {
  const { token, scores, distribution, vestingYears, utilityData, supplyMetrics, verdict, teamTransparency, teamNote } = analysis;
  const name = token.name;
  const symbol = token.symbol?.toUpperCase() ?? '';
  const score = scores.total;
  const flags = getRedFlags(analysis);
  const flagCount = flags.length;
  const regulatoryEntry = REGULATORY_DATA[token.id] ?? null;

  // ── Sentence 1: Overview & Score ──────────────────────────────
  const overviewTemplates = [
    `${name} (${symbol}) apresenta fundamentos tokenômicos ${describeScorePt(score)}, com pontuação geral de ${score.toFixed(1)}/10 segundo nossa metodologia.`,
    `Após análise detalhada, ${name} obteve nota ${score.toFixed(1)}/10, refletindo uma estrutura tokenômica ${describeScorePt(score)}.`,
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

  // ── Sentence 4: Regulatory & Team ─────────────────────────────
  let s4 = '';
  if (regulatoryEntry && regulatoryEntry.severity === 'high') {
    s4 = `⚠️ ALERTA REGULATÓRIO: ${name} possui risco regulatório ALTO${regulatoryEntry.source ? ` (${regulatoryEntry.source})` : ''} — processo ou sanção que pode impactar significativamente o valor e a liquidez do token.`;
  } else if (regulatoryEntry && regulatoryEntry.severity === 'medium') {
    s4 = `Atenção ao risco regulatório de nível médio — ${name} está sob atenção de reguladores${regulatoryEntry.source ? ` (${regulatoryEntry.source})` : ''}, o que pode afetar a disponibilidade em exchanges.`;
  } else if (teamTransparency === 'anonymous') {
    s4 = `O time completamente anônimo representa um risco adicional significativo: sem identificação dos responsáveis, a accountability em caso de problemas é inexistente.`;
  } else if (teamTransparency === 'low') {
    s4 = `A baixa transparência da equipe aumenta o risco de governança — com responsáveis parcialmente anônimos, é difícil avaliar o comprometimento de longo prazo.`;
  } else if (teamTransparency === 'high' && score >= 7) {
    s4 = `A alta transparência da equipe${teamNote ? ` (${teamNote.split('.')[0]})` : ''} reforça a confiabilidade do projeto e reduz riscos de má gestão.`;
  } else if (flagCount === 0) {
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

// ─── English ─────────────────────────────────────────────────────────────────

function generateAnalysisTextEn(analysis: AnalysisResult): string {
  const { token, scores, distribution, vestingYears, utilityData, supplyMetrics, verdict, teamTransparency, teamNote } = analysis;
  const name = token.name;
  const symbol = token.symbol?.toUpperCase() ?? '';
  const score = scores.total;
  const flags = getRedFlags(analysis);
  const flagCount = flags.length;
  const regulatoryEntry = REGULATORY_DATA[token.id] ?? null;

  // Map PT verdict to EN for display
  const verdictEn: Record<string, string> = {
    'Excelente': 'Excellent',
    'Bom': 'Good',
    'Regular': 'Average',
    'Ruim': 'Poor',
    'Evitar': 'Avoid',
  };
  const verdictDisplay = verdictEn[verdict] ?? verdict;

  // ── Sentence 1: Overview & Score ──────────────────────────────
  const overviewTemplates = [
    `${name} (${symbol}) shows ${describeScoreEn(score)} tokenomics fundamentals, with an overall score of ${score.toFixed(1)}/10 according to our methodology.`,
    `After detailed analysis, ${name} received a score of ${score.toFixed(1)}/10, reflecting a ${describeScoreEn(score)} tokenomics structure.`,
    `Our analysis places ${name} with a score of ${score.toFixed(1)}/10 — rated "${verdictDisplay}" on the tokenomics spectrum.`,
  ];
  const s1 = pick(overviewTemplates, name);

  // ── Sentence 2: Distribution & Vesting ────────────────────────
  let s2 = '';
  const totalInsiders = distribution.team + distribution.investors;
  if (totalInsiders === 0) {
    s2 = `The distribution is exemplary, with 100% of supply allocated to the community via fair launch, eliminating insider concentration risks.`;
  } else if (totalInsiders < 20) {
    s2 = `The distribution is healthy, with only ${totalInsiders}% allocated to team and investors${vestingYears >= 3 ? ` and a ${vestingYears}-year vesting ensuring long-term commitment` : ''}.`;
  } else if (totalInsiders < 40) {
    s2 = `The distribution shows ${totalInsiders}% for team and investors${vestingYears > 0 ? `, with a ${vestingYears}-year${vestingYears > 1 ? '' : ''} vesting period to reduce early selling risk` : ', with no declared vesting, increasing selling pressure risk'}.`;
  } else {
    s2 = `The ${totalInsiders}% concentration with team and investors is concerning${vestingYears === 0 ? ' and the absence of declared vesting represents significant risk for holders' : `, although the ${vestingYears}-year vesting partially mitigates this risk`}.`;
  }

  // ── Sentence 3: Utility & Supply ──────────────────────────────
  const utilityCount = [
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
    utilityData.neededToUse,
  ].filter(Boolean).length;

  const utilityFeatures: string[] = [];
  if (utilityData.neededToUse) utilityFeatures.push('mandatory protocol usage');
  if (utilityData.stakingAvailable) utilityFeatures.push('staking');
  if (utilityData.governancePower) utilityFeatures.push('on-chain governance');
  if (utilityData.feeBurning) utilityFeatures.push('fee burning');

  let s3 = '';
  if (utilityCount === 0) {
    s3 = `In terms of utility, ${symbol} lacks clear use cases — no staking, governance, fee burning or protocol usage requirement — which undermines organic demand.`;
  } else if (utilityCount === 1) {
    s3 = `The token offers ${utilityFeatures[0]} as its main use case${supplyMetrics.isFixed ? ', and benefits from a fixed maximum supply as inflation protection' : ''}.`;
  } else if (utilityCount === 2) {
    s3 = `${symbol} has reasonable utility with ${utilityFeatures.slice(0, 2).join(' and ')}${supplyMetrics.isFixed ? ', plus a fixed maximum supply' : ''}.`;
  } else {
    s3 = `The token's utility is robust: ${utilityFeatures.join(', ')}${supplyMetrics.isFixed ? ' — and the fixed maximum supply adds scarcity to the model' : ''}.`;
  }

  // ── Sentence 4: Regulatory & Team ─────────────────────────────
  let s4 = '';
  if (regulatoryEntry && regulatoryEntry.severity === 'high') {
    s4 = `⚠️ REGULATORY ALERT: ${name} carries HIGH regulatory risk${regulatoryEntry.source ? ` (${regulatoryEntry.source})` : ''} — an active case or sanction that could significantly impact token value and liquidity.`;
  } else if (regulatoryEntry && regulatoryEntry.severity === 'medium') {
    s4 = `Watch for medium-level regulatory risk — ${name} is under regulatory scrutiny${regulatoryEntry.source ? ` (${regulatoryEntry.source})` : ''}, which may affect exchange availability.`;
  } else if (teamTransparency === 'anonymous') {
    s4 = `The fully anonymous team represents a significant additional risk: without identified leadership, there is no accountability if problems arise.`;
  } else if (teamTransparency === 'low') {
    s4 = `The team's low transparency increases governance risk — with partially anonymous leadership, long-term commitment is hard to assess.`;
  } else if (teamTransparency === 'high' && score >= 7) {
    s4 = `The team's high transparency${teamNote ? ` (${teamNote.split('.')[0]})` : ''} reinforces project credibility and reduces mismanagement risk.`;
  } else if (flagCount === 0) {
    if (score >= 7) {
      s4 = `No critical red flags were detected, making ${name} one of the most solid options in terms of tokenomics in the current market.`;
    } else {
      s4 = `While no critical red flags were found, investors should monitor the identified points of concern before making a decision.`;
    }
  } else if (flagCount === 1) {
    s4 = `Note: 1 red flag was identified (${flags[0].message.replace(/⚠️\s*/, '')}), which should be carefully evaluated before any investment decision.`;
  } else {
    s4 = `${flagCount} red flags were identified, including ${flags.slice(0, 2).map(f => f.message.replace(/⚠️\s*/, '')).join(' and ')}, recommending caution and thorough research (DYOR) before any position.`;
  }

  return [s1, s2, s3, s4].join(' ');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function describeScorePt(score: number): string {
  if (score >= 8.5) return 'excepcionais';
  if (score >= 7.5) return 'muito sólidos';
  if (score >= 6.5) return 'bons';
  if (score >= 5.5) return 'razoáveis';
  if (score >= 4.5) return 'medianos';
  if (score >= 3.5) return 'preocupantes';
  return 'críticos';
}

function describeScoreEn(score: number): string {
  if (score >= 8.5) return 'exceptional';
  if (score >= 7.5) return 'very solid';
  if (score >= 6.5) return 'good';
  if (score >= 5.5) return 'reasonable';
  if (score >= 4.5) return 'mediocre';
  if (score >= 3.5) return 'concerning';
  return 'critical';
}

/** Deterministic pick based on a seed string */
function pick<T>(arr: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  }
  return arr[hash % arr.length];
}
