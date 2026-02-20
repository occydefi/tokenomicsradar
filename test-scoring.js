// Quick test script to check ETH vs AVAX scores

const metaETH = {
  team: 12, investors: 8, community: 55, treasury: 25,
  centralizedControl: false, // implícito
  verifiedFeeBurn: true,
};

const metaAVAX = {
  team: 10, investors: 9, community: 50, treasury: 31,
  centralizedControl: true,
  controlledPct: undefined, // BUG: deveria ser 41
};

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
  return distScore;
}

function calcSupplyScore(meta) {
  let score = 8; // baseline
  // controlledPct penalty
  if (meta.controlledPct && meta.controlledPct > 50) {
    score = Math.max(0, score - 5);
  } else if (meta.controlledPct && meta.controlledPct > 40) {
    score = Math.max(0, score - 3);
  } else if (meta.controlledPct && meta.controlledPct > 30) {
    score = Math.max(0, score - 1);
  }
  return score;
}

console.log("ETH Distribution Score:", calcDistScore(metaETH));
console.log("ETH Supply Score:", calcSupplyScore(metaETH));
console.log("\nAVAX Distribution Score:", calcDistScore(metaAVAX));
console.log("AVAX Supply Score (BUG):", calcSupplyScore(metaAVAX));

const metaAVAX_FIXED = {...metaAVAX, controlledPct: 41};
console.log("AVAX Supply Score (FIXED):", calcSupplyScore(metaAVAX_FIXED));
