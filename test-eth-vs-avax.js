// Simular scores de ETH vs AVAX após correção

const metaETH = {
  team: 12, investors: 8, community: 55, treasury: 25,
  centralizedControl: false,
  controlledPct: undefined,
  verifiedFeeBurn: true,
};

const metaAVAX = {
  team: 10, investors: 9, community: 50, treasury: 31,
  centralizedControl: true,
  controlledPct: 41, // CORRIGIDO
};

function calcSupplyScore(meta, isFixed = true, circulatingPct = 85, inflationRate = 1) {
  let score = 5;
  if (isFixed) score += 3;
  if (circulatingPct > 80) score += 1.5;
  if (inflationRate < 2) score += 1.5;
  
  // controlledPct penalty
  if (meta.controlledPct && meta.controlledPct > 50) {
    score = Math.max(0, score - 5);
  } else if (meta.controlledPct && meta.controlledPct > 40) {
    score = Math.max(0, score - 3);
  } else if (meta.controlledPct && meta.controlledPct > 30) {
    score = Math.max(0, score - 1);
  }
  return Math.max(0, Math.min(10, score));
}

function calcDistScore(meta) {
  let distScore = 10;
  distScore -= Math.max(0, (meta.team - 10) * 0.3);
  distScore -= Math.max(0, (meta.investors - 15) * 0.3);
  
  if (meta.community >= 70) distScore += 2;
  else if (meta.community >= 50) distScore += 1;
  else if (meta.community < 40) distScore -= 1;
  
  if (meta.centralizedControl) distScore = Math.max(0, distScore - 2.5);
  if (meta.centralizedControl && meta.treasury > 25) {
    distScore = Math.max(0, distScore - 1.5);
  }
  return Math.max(0, Math.min(10, distScore));
}

function calcUtilScore(meta) {
  let score = 8; // baseline neededToUse + staking + governance
  if (meta.verifiedFeeBurn) score = Math.min(10, score + 1.0);
  return score;
}

const ethSupply = calcSupplyScore(metaETH, false, 85, 0.5);
const ethDist = calcDistScore(metaETH);
const ethUtil = calcUtilScore(metaETH);
const ethVesting = 7; // vesting score baseline
const ethTreasury = 9; // strong treasury

const ethTotal = (ethSupply * 0.25 + ethDist * 0.25 + ethVesting * 0.20 + ethUtil * 0.20 + ethTreasury * 0.10);

const avaxSupply = calcSupplyScore(metaAVAX, true, 80, 1.5);
const avaxDist = calcDistScore(metaAVAX);
const avaxUtil = 7; // neededToUse + staking + governance, no burn
const avaxVesting = 6;
const avaxTreasury = 9;

const avaxTotal = (avaxSupply * 0.25 + avaxDist * 0.25 + avaxVesting * 0.20 + avaxUtil * 0.20 + avaxTreasury * 0.10);

console.log("═══════════════════════════════════════════");
console.log("ETH (após correção):");
console.log("  Supply Score:", ethSupply.toFixed(1));
console.log("  Distribution Score:", ethDist.toFixed(1));
console.log("  Utility Score:", ethUtil.toFixed(1));
console.log("  Vesting Score:", ethVesting.toFixed(1));
console.log("  Treasury Score:", ethTreasury.toFixed(1));
console.log("  ═════════════════════════");
console.log("  TOTAL:", ethTotal.toFixed(2));
console.log("");
console.log("AVAX (após correção):");
console.log("  Supply Score:", avaxSupply.toFixed(1), "(com penalty controlledPct: 41)");
console.log("  Distribution Score:", avaxDist.toFixed(1));
console.log("  Utility Score:", avaxUtil.toFixed(1));
console.log("  Vesting Score:", avaxVesting.toFixed(1));
console.log("  Treasury Score:", avaxTreasury.toFixed(1));
console.log("  ═════════════════════════");
console.log("  TOTAL:", avaxTotal.toFixed(2));
console.log("");
console.log("═══════════════════════════════════════════");
if (ethTotal > avaxTotal) {
  console.log("✅ ETH > AVAX:", (ethTotal - avaxTotal).toFixed(2), "pontos de diferença");
} else {
  console.log("❌ AVAX > ETH:", (avaxTotal - ethTotal).toFixed(2), "pontos de diferença");
}
console.log("═══════════════════════════════════════════");
