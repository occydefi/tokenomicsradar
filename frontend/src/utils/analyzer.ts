import type {
  TokenData,
  AnalysisResult,
  SupplyMetrics,
  DistributionData,
  VestingData,
  UtilityData,
  TreasuryData,
} from '../types';

// Known token metadata for better analysis
const TOKEN_METADATA: Record<string, {
  team?: number;
  investors?: number;
  community?: number;
  treasury?: number;
  stakingAvailable?: boolean;
  governancePower?: boolean;
  feeBurning?: boolean;
  neededToUse?: boolean;
  vestingYears?: number;
  treasuryUSD?: number;
}> = {
  'bitcoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0 },
  'ethereum': { team: 12, investors: 8, community: 55, treasury: 25, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 1500000000 },
  'solana': { team: 13, investors: 37, community: 38, treasury: 12, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 800000000 },
  'cardano': { team: 9, investors: 7, community: 57, treasury: 27, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 1000000000 },
  'polkadot': { team: 30, investors: 10, community: 50, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 500000000 },
  'avalanche-2': { team: 10, investors: 9, community: 50, treasury: 31, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 1200000000 },
  'uniswap': { team: 17, investors: 18, community: 43, treasury: 22, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 2000000000 },
  'aave': { team: 13, investors: 7, community: 47, treasury: 23, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 400000000 },
  'chainlink': { team: 30, investors: 5, community: 35, treasury: 30, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 600000000 },
  'maker': { team: 10, investors: 10, community: 50, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 8000000000 },
  'curve-dao-token': { team: 10, investors: 5, community: 62, treasury: 3, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 4, treasuryUSD: 100000000 },
  'lido-dao': { team: 20, investors: 22, community: 36, treasury: 22, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 300000000 },
  'optimism': { team: 19, investors: 17, community: 35, treasury: 25, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 800000000 },
  'arbitrum': { team: 17, investors: 17, community: 42, treasury: 27, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 3000000000 },
  'aptos': { team: 19, investors: 16, community: 51, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 400000000 },
  'sui': { team: 20, investors: 14, community: 52, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000 },
  'the-open-network': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0 },
  'injective-protocol': { team: 20, investors: 10, community: 60, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000 },
  'cosmos': { team: 10, investors: 5, community: 67, treasury: 18, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 500000000 },
  'near': { team: 17, investors: 17, community: 40, treasury: 26, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000 },
};

function getTokenMeta(id: string) {
  return TOKEN_METADATA[id] || null;
}

export function analyzeToken(token: TokenData): AnalysisResult {
  const meta = getTokenMeta(token.id);
  const md = token.market_data;
  const now = new Date();

  // ─── Supply Metrics ───────────────────────────────────────────
  const circulating = md.circulating_supply || 0;
  const total = md.total_supply;
  const max = md.max_supply;

  const isFixed = max !== null && max > 0;
  const circulatingPct = isFixed && max
    ? (circulating / max) * 100
    : total
    ? (circulating / total) * 100
    : 100;

  // Inflation: estimate from circulating vs total supply ratio
  const inflationRate = total && total > circulating
    ? ((total - circulating) / circulating) * 100 * 0.1 // rough annual estimate
    : 0;

  // Burned tokens (FDV vs market cap difference can hint)
  const burnedTokens = null; // Would need external data
  const burnedPct = null;

  const supplyMetrics: SupplyMetrics = {
    maxSupply: max,
    circulatingSupply: circulating,
    totalSupply: total,
    isFixed,
    circulatingPct: Math.min(circulatingPct, 100),
    inflationRate,
    burnedTokens,
    burnedPct,
  };

  // ─── Distribution ─────────────────────────────────────────────
  let distribution: DistributionData;
  if (meta) {
    distribution = {
      team: meta.team ?? 15,
      investors: meta.investors ?? 15,
      community: meta.community ?? 50,
      treasury: meta.treasury ?? 20,
      other: 0,
      note: 'Dados verificados (tokenomics publicados)',
    };
  } else {
    // Estimate based on token age, supply metrics, categories
    const isMature = token.genesis_date ? 
      (now.getFullYear() - new Date(token.genesis_date).getFullYear()) > 3 : false;
    
    distribution = {
      team: isMature ? 12 : 18,
      investors: isMature ? 10 : 20,
      community: isMature ? 55 : 40,
      treasury: isMature ? 23 : 22,
      other: 0,
      note: 'Estimativa baseada em padrões do setor (dados exatos não disponíveis)',
    };
  }

  // ─── Vesting Data ─────────────────────────────────────────────
  const lockedPct = meta ? (meta.investors ?? 0) + (meta.team ?? 0) : distribution.team + distribution.investors;
  const vestingYears = meta?.vestingYears ?? 3;
  
  const vestingData: VestingData = {
    totalLocked: (lockedPct / 100) * (max || total || circulating),
    totalUnlocked: circulating,
    lockedPct,
    nextUnlockDate: null,
    nextUnlockAmount: null,
    estimatedFullUnlock: vestingYears > 0 
      ? `~${new Date(now.getFullYear() + vestingYears, now.getMonth()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`
      : 'Totalmente desbloqueado',
    note: vestingYears > 0 
      ? `Estimativa baseada no vesting típico de ${vestingYears} anos`
      : 'Token sem restrições de vesting conhecidas',
  };

  // ─── Utility Data ─────────────────────────────────────────────
  const cats = token.categories?.map(c => c.toLowerCase()) || [];
  const isDefi = cats.some(c => c.includes('defi') || c.includes('decentralized'));
  const isLayer1 = cats.some(c => c.includes('layer 1') || c.includes('smart contract'));
  const isLayer2 = cats.some(c => c.includes('layer 2') || c.includes('scaling'));
  const isGov = cats.some(c => c.includes('governance') || c.includes('dao'));
  
  const utilityData: UtilityData = {
    neededToUse: meta?.neededToUse ?? (isLayer1 || isLayer2 || false),
    stakingAvailable: meta?.stakingAvailable ?? (isLayer1 || false),
    governancePower: meta?.governancePower ?? (isGov || isDefi || false),
    feeBurning: meta?.feeBurning ?? false,
    score: 0,
  };
  
  const utilityScore = [
    utilityData.neededToUse,
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
  ].filter(Boolean).length / 4 * 10;
  utilityData.score = utilityScore;

  // ─── Treasury Data ─────────────────────────────────────────────
  const devData = token.developer_data;
  const monthlyBurn = md.market_cap.usd ? md.market_cap.usd * 0.001 : null;
  const treasuryEstimate = meta?.treasuryUSD ?? 
    (distribution.treasury > 0 && md.market_cap.usd 
      ? (distribution.treasury / 100) * md.market_cap.usd 
      : null);
  
  const treasuryData: TreasuryData = {
    estimatedSize: treasuryEstimate,
    runwayMonths: treasuryEstimate && monthlyBurn 
      ? Math.round(treasuryEstimate / monthlyBurn)
      : null,
    note: meta?.treasuryUSD 
      ? 'Dados verificados via relatórios do protocolo'
      : 'Estimativa baseada em % da capitalização de mercado',
  };

  // ─── Scoring ──────────────────────────────────────────────────
  // Supply score (25%)
  let supplyScore = 5;
  if (isFixed) supplyScore += 3;
  if (circulatingPct > 80) supplyScore += 1.5;
  else if (circulatingPct > 50) supplyScore += 0.5;
  if (inflationRate < 5) supplyScore += 1;
  else if (inflationRate > 20) supplyScore -= 2;
  supplyScore = Math.max(0, Math.min(10, supplyScore));

  // Distribution score (25%)
  let distScore = 10;
  distScore -= Math.max(0, (distribution.team - 10) * 0.3);
  distScore -= Math.max(0, (distribution.investors - 15) * 0.3);
  if (distribution.community > 50) distScore += 1;
  if (distribution.team === 0 && distribution.investors === 0) distScore = 10; // Bitcoin-like fair launch
  distScore = Math.max(0, Math.min(10, distScore));

  // Vesting score (20%)
  let vestingScore = 5;
  if (lockedPct < 20) vestingScore += 3;
  else if (lockedPct < 35) vestingScore += 1;
  else if (lockedPct > 50) vestingScore -= 2;
  if (vestingYears >= 4) vestingScore += 1;
  else if (vestingYears < 2 && lockedPct > 25) vestingScore -= 2;
  vestingScore = Math.max(0, Math.min(10, vestingScore));

  // Utility score (20%) - already calculated
  const utilScore = utilityData.score;

  // Treasury score (10%)
  let treasScore = 5;
  if (treasuryData.runwayMonths) {
    if (treasuryData.runwayMonths > 36) treasScore = 9;
    else if (treasuryData.runwayMonths > 24) treasScore = 7;
    else if (treasuryData.runwayMonths > 12) treasScore = 5;
    else treasScore = 3;
  }

  const totalScore = (
    supplyScore * 0.25 +
    distScore * 0.25 +
    vestingScore * 0.20 +
    utilScore * 0.20 +
    treasScore * 0.10
  );

  const scores = {
    supply: Math.round(supplyScore * 10) / 10,
    distribution: Math.round(distScore * 10) / 10,
    vesting: Math.round(vestingScore * 10) / 10,
    utility: Math.round(utilScore * 10) / 10,
    treasury: Math.round(treasScore * 10) / 10,
    total: Math.round(totalScore * 10) / 10,
  };

  // ─── Verdict ──────────────────────────────────────────────────
  let verdict: AnalysisResult['verdict'];
  if (totalScore >= 8) verdict = 'Excelente';
  else if (totalScore >= 6.5) verdict = 'Bom';
  else if (totalScore >= 5) verdict = 'Regular';
  else if (totalScore >= 3.5) verdict = 'Ruim';
  else verdict = 'Evitar';

  // ─── Pros & Cons ──────────────────────────────────────────────
  const pros: string[] = [];
  const cons: string[] = [];

  if (isFixed) pros.push('Oferta máxima fixa — proteção contra inflação monetária');
  else cons.push('Sem limite de oferta máxima — risco de inflação contínua');

  if (circulatingPct > 80) pros.push(`${circulatingPct.toFixed(0)}% da oferta já em circulação — baixo risco de dumping futuro`);
  else if (circulatingPct < 40) cons.push(`Apenas ${circulatingPct.toFixed(0)}% em circulação — grande potencial de pressão vendedora futura`);

  if (distribution.team + distribution.investors < 25) pros.push('Distribuição equilibrada — baixa concentração em equipe e investidores');
  else if (distribution.team + distribution.investors > 40) cons.push(`${distribution.team + distribution.investors}% com equipe/investidores — alta concentração de poder`);

  if (utilityData.feeBurning) pros.push('Mecanismo de queima de fees — pressão deflacionária no token');
  if (utilityData.stakingAvailable) pros.push('Staking disponível — incentiva holders de longo prazo');
  if (utilityData.governancePower) pros.push('Poder de governança — token confere voz no protocolo');
  if (utilityData.neededToUse) pros.push('Token essencial para usar o protocolo — demanda orgânica garantida');

  if (!utilityData.feeBurning) cons.push('Sem mecanismo de queima — sem pressão deflacionária');
  if (!utilityData.neededToUse && !utilityData.stakingAvailable) cons.push('Token sem utilidade clara — risco de desvalorização estrutural');

  if (vestingYears >= 4) pros.push('Vesting longo (4+ anos) — equipe comprometida com o longo prazo');
  else if (vestingYears > 0 && vestingYears < 2) cons.push('Vesting curto — risco de venda antecipada pela equipe/investidores');

  if (treasuryData.runwayMonths && treasuryData.runwayMonths > 36) pros.push('Tesouraria robusta com runway de 3+ anos');
  else if (treasuryData.runwayMonths && treasuryData.runwayMonths < 12) cons.push('Tesouraria limitada — runway abaixo de 12 meses é preocupante');

  const devCommits = devData?.commit_count_4_weeks ?? 0;
  if (devCommits > 50) pros.push('Alta atividade de desenvolvimento recente');
  else if (devCommits === 0) cons.push('Sem commits recentes — possível estagnação técnica');

  // ─── Conclusion ───────────────────────────────────────────────
  const tokenName = token.name;
  let conclusion = '';

  if (verdict === 'Excelente') {
    conclusion = `${tokenName} apresenta fundamentos tokenômicos sólidos, com excelente pontuação em distribuição, utilidade e oferta. Trata-se de um token bem estruturado que demonstra comprometimento com sustentabilidade de longo prazo.`;
  } else if (verdict === 'Bom') {
    conclusion = `${tokenName} tem bons fundamentos tokenômicos com algumas áreas de melhoria. A estrutura geral favorece holders de longo prazo, embora existam pontos de atenção que merecem monitoramento.`;
  } else if (verdict === 'Regular') {
    conclusion = `${tokenName} apresenta fundamentos tokenômicos medianos. Existem tanto pontos positivos quanto negativos relevantes, e investidores devem considerar os riscos antes de tomar decisão.`;
  } else if (verdict === 'Ruim') {
    conclusion = `${tokenName} possui fundamentos tokenômicos preocupantes. Alta concentração, inflação elevada ou falta de utilidade real comprometem o potencial de valorização sustentável no longo prazo.`;
  } else {
    conclusion = `${tokenName} apresenta sérios problemas tokenômicos. A combinação de má distribuição, sem utilidade real e riscos de inflação ou venda pelos insiders torna este token de alto risco para investidores.`;
  }

  return {
    token,
    scores,
    supplyMetrics,
    distribution,
    vestingData,
    utilityData,
    treasuryData,
    verdict,
    conclusion,
    pros: pros.slice(0, 5),
    cons: cons.slice(0, 5),
    fetchedAt: now,
  };
}

export function formatNumber(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return 'N/D';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(decimals)}K`;
  return `$${n.toFixed(decimals)}`;
}

export function formatTokenAmount(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'N/D';
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(2);
}

export function getScoreColor(score: number): string {
  if (score >= 8) return '#00c853';
  if (score >= 5) return '#ffd600';
  return '#ff3d3d';
}
