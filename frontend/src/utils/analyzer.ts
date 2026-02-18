import type {
  TokenData,
  AnalysisResult,
  SupplyMetrics,
  DistributionData,
  VestingData,
  UtilityData,
  TreasuryData,
} from '../types';
import { REGULATORY_DATA } from './regulatoryData';

// Known token metadata for better analysis
export const TOKEN_METADATA: Record<string, {
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
  note?: string;
  teamTransparency?: 'high' | 'medium' | 'low' | 'anonymous';
  teamNote?: string;
}> = {
  // ── Layer 1 — Bitcoin & forks ────────────────────────────────────────────
  'bitcoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Fair launch — no pre-mine. Fixed 21M supply with halving every ~4 years.', teamTransparency: 'anonymous', teamNote: 'Satoshi Nakamoto é anônimo. O protocolo é 100% open source e descentralizado — caso único no mercado.' },
  'litecoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Fair launch Bitcoin fork. Fixed 84M supply with halving cycle.' },
  'bitcoin-cash': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Bitcoin fork (2017). No pre-mine; miner-secured PoW chain.' },
  'ethereum-classic': { team: 0, investors: 5, community: 95, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Original Ethereum chain (pre-DAO fork). PoW with fixed 210.7M cap.' },
  'zcash': { team: 6, investors: 0, community: 87, treasury: 7, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 20000000, note: 'Founders reward (20% of block rewards for 4 years ~5.8% of total). Privacy-focused PoW chain.' },
  'dash': { team: 0, investors: 0, community: 90, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 50000000, note: '10% of block rewards go to governance treasury (superblock). Masternodes provide governance & mixing.' },
  'decred': { team: 8, investors: 0, community: 84, treasury: 8, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 80000000, note: '8% of block rewards to treasury, 8% to original devs. Hybrid PoW/PoS governance.' },
  'dogecoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — inflationary with ~5B DOGE minted annually forever. No hard cap.', teamTransparency: 'medium', teamNote: 'Projeto comunitário sem time central. Billy Markus e Jackson Palmer (co-criadores) são públicos mas não envolvidos ativamente.' },
  // ── Layer 1 — Smart contract platforms ───────────────────────────────────
  'ethereum': { team: 12, investors: 8, community: 55, treasury: 25, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 1500000000, note: 'EIP-1559 base fee burn. ~72M ETH pre-mine (ICO 2014). EF holds ~$1.5B treasury.', teamTransparency: 'high', teamNote: 'Vitalik Buterin é público e altamente visível. Ethereum Foundation tem equipe amplamente identificada e verificável.' },
  'binancecoin': { team: 40, investors: 10, community: 50, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 1, treasuryUSD: 0, note: 'Quarterly BNB Auto-Burn targets 100M total burned (half of 200M initial). Team held 40% initially.', teamTransparency: 'high', teamNote: 'CZ (Changpeng Zhao) era extremamente público. Reputação comprometida após condenação criminal em 2023. Richard Teng assumiu como CEO.' },
  'solana': { team: 13, investors: 37, community: 38, treasury: 12, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 800000000, note: 'High VC concentration (~37% to insiders). Solana Foundation holds 12%.', teamTransparency: 'high', teamNote: 'Anatoly Yakovenko (co-fundador) é público e ativo. Equipe da Solana Labs amplamente verificável no LinkedIn e GitHub.' },
  'cardano': { team: 9, investors: 7, community: 57, treasury: 27, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 1000000000, note: '~77% supply already circulating. On-chain treasury for ecosystem funding.', teamTransparency: 'high', teamNote: 'Charles Hoskinson é público e muito ativo. IOHK, Emurgo e Cardano Foundation têm equipes identificadas e histórico verificável.' },
  'avalanche-2': { team: 10, investors: 9, community: 50, treasury: 31, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 1200000000, note: 'Avalanche Foundation controls 31% staking incentives. Fixed 720M max supply.', teamTransparency: 'high', teamNote: 'Emin Gün Sirer (professor Cornell) é público e verificável. Ava Labs tem equipe amplamente identificada e acadêmica.' },
  'tron': { team: 34, investors: 16, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, note: 'Justin Sun / Tron Foundation holds ~34% of supply. High insider concentration.', teamTransparency: 'high', teamNote: 'Justin Sun é extremamente público mas controverso. Múltiplos processos regulatórios e acusações de manipulação de mercado.' },
  'cosmos': { team: 10, investors: 5, community: 67, treasury: 18, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 500000000, note: 'IBC protocol hub. Interchain Foundation treasury funds ecosystem development.' },
  'polkadot': { team: 30, investors: 10, community: 50, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 500000000, note: 'W3F/Parity hold ~30%. Parachain auction system recycles locked DOT.', teamTransparency: 'high', teamNote: 'Gavin Wood (co-fundador Ethereum) é público e verificável. Web3 Foundation e Parity Technologies têm equipes amplamente identificadas.' },
  'near': { team: 17, investors: 17, community: 40, treasury: 26, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000, note: 'NEAR Foundation holds 26% for ecosystem grants. 5% annual inflation.', teamTransparency: 'high', teamNote: 'Illia Polosukhin (ex-Google) e Alex Skidanov são públicos e verificáveis. NEAR Inc. tem equipe amplamente identificada.' },
  'aptos': { team: 19, investors: 16, community: 51, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 400000000, note: 'Ex-Meta Diem team. 10-year vesting for foundation/core. Monthly token unlocks ongoing.', teamTransparency: 'high', teamNote: 'Mo Shaikh e Avery Ching (ex-Meta Diem) são públicos. Equipe composta majoritariamente por ex-funcionários da Meta verificáveis no LinkedIn.' },
  'sui': { team: 20, investors: 14, community: 52, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000, note: 'Mysten Labs (ex-Meta) holds 20%. Large ongoing unlock schedule concerns investors.', teamTransparency: 'high', teamNote: 'Evan Cheng e equipe da Mysten Labs (ex-Meta) são públicos e verificáveis no LinkedIn e GitHub.' },
  'algorand': { team: 25, investors: 0, community: 45, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 5, treasuryUSD: 400000000, note: 'Algorand Inc + Foundation hold 55%. No VC round — equity funding separate from token. ~10B fixed max supply.' },
  'internet-computer': { team: 24, investors: 25, community: 49, treasury: 2, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'DFINITY controls 24%, early investors 25%. NNS governance controls protocol. Controversial initial distribution.' },
  'vechain': { team: 12, investors: 20, community: 23, treasury: 25, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, note: 'Dual-token: VET + VTHO (gas). VeChain Foundation controls 25%. Enterprise-focused supply chain.' },
  'elrond-erd-2': { team: 19, investors: 32, community: 34, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 150000000, note: 'Now rebranded MultiversX (EGLD). High investor concentration (32%). 4-year vesting for insiders.' },
  'theta-token': { team: 30, investors: 10, community: 50, treasury: 10, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'Dual-token: THETA (governance/staking) + TFUEL (gas). Samsung, Google, Sony as validators.' },
  'eos': { team: 10, investors: 5, community: 85, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Block.one raised $4B in year-long ICO. CPU/NET/RAM resource model. EOS Network Foundation now governs.' },
  'tezos': { team: 0, investors: 0, community: 80, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 500000000, note: 'Tezos Foundation holds ~$500M in XTZ. On-chain self-amending governance. Liquid Proof-of-Stake.' },
  'neo': { team: 50, investors: 0, community: 50, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 100000000, note: 'Neo Foundation holds 50M NEO (50% of 100M fixed). Dual token: NEO (governance) + GAS (fees).' },
  'waves': { team: 20, investors: 5, community: 75, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Waves ICO raised 30K BTC in 2016. 100M token cap. Team holds ~20%.' },
  'qtum': { team: 20, investors: 10, community: 70, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'UTXO + EVM hybrid chain. Qtum Foundation controls distribution. ~107M max supply.' },
  'icon': { team: 20, investors: 15, community: 50, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'South Korean blockchain platform. ICX used for staking and governance in ICON Network.' },
  'ontology': { team: 28, investors: 0, community: 55, treasury: 17, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'ONT council allocated 28% to core team. Dual token: ONT + ONG (gas). Neo ecosystem offspring.' },
  'iota': { team: 5, investors: 0, community: 90, treasury: 5, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 20000000, note: 'IOTA Foundation holds ~5% for development. Tangle DAG architecture. IoT-focused with no transaction fees.' },
  'zilliqa': { team: 21, investors: 30, community: 30, treasury: 19, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'First sharding blockchain. Zilliqa team 21%, SAFT investors 30%. EVM-compatible L1.' },
  'kava': { team: 30, investors: 20, community: 30, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 100000000, note: 'DeFi-focused L1 with Cosmos SDK + EVM co-chain. KAVA used for staking, governance, and collateral.' },
  'flow': { team: 18, investors: 32, community: 32, treasury: 18, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 150000000, note: 'Built by Dapper Labs (NBA Top Shot). High investor concentration (a16z, Union Square). NFT-optimized chain.' },
  'oasis-network': { team: 23, investors: 10, community: 40, treasury: 27, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 100000000, note: 'Privacy-focused L1. Oasis Foundation holds 27% for ecosystem. Paratime-based architecture.' },
  'stellar': { team: 0, investors: 0, community: 95, treasury: 5, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'SDF distributed 95% of XLM to public. No mining — federated Byzantine agreement consensus.' },
  'hedera-hashgraph': { team: 9, investors: 5, community: 52, treasury: 34, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 300000000, note: 'Hedera council (Google, IBM, etc.) governs. 50B HBAR max supply. Treasury held by Hedera Foundation.' },
  // ── Ripple ───────────────────────────────────────────────────────────────
  'ripple': { team: 20, investors: 5, community: 40, treasury: 35, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Ripple Labs holds ~40B XRP in escrow (released 1B/month). Centralized supply control. Fee burn is tiny.', teamTransparency: 'high', teamNote: 'Brad Garlinghouse (CEO) é público e verificável. Ripple Labs tem equipe amplamente identificada, apesar do processo SEC em andamento.' },
  // ── Stablecoins ──────────────────────────────────────────────────────────
  'tether': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin — collateral-backed 1:1 by USD reserves. Issued/redeemed on demand. No fixed max supply.' },
  'usd-coin': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin — Circle/Coinbase regulated USD-backed. Monthly reserve attestations. No fixed max supply.' },
  'dai': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin — crypto-overcollateralized by MakerDAO. DSR (DAI Savings Rate) earns yield.' },
  // ── Memecoins ─────────────────────────────────────────────────────────────
  'shiba-inu': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — Vitalik burned 41% of SHIB supply in 2021. Ongoing burn via ShibaSwap. 999.9T max supply.', teamTransparency: 'low', teamNote: 'Equipe parcialmente anônima ("Ryoshi" criador desconhecido). Shytoshi Kusama lidera mas usa pseudônimo. Alto risco de anonimato.' },
  'pepe': { team: 0, investors: 0, community: 93, treasury: 7, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — 93.1% burned/LP, 6.9% reserved for CEX listings/bridges. 420.69T fixed supply.', teamTransparency: 'anonymous', teamNote: 'Time completamente anônimo. Sem identidades públicas conhecidas. Risco máximo de anonimato para investidores.' },
  'dogwifcoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — Solana dog-hat meme. Fair launch with no team/VC allocation. 998.9M fixed supply.' },
  'bonk': { team: 5, investors: 0, community: 95, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — community airdrop to Solana ecosystem participants. ~5% to team/contributors. BonkBurn mechanism.' },
  // ── The Open Network ──────────────────────────────────────────────────────
  'the-open-network': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Originally created by Telegram team, then abandoned and relaunched by open community. Fair distribution.' },
  // ── DeFi Layer ─────────────────────────────────────────────────────────────
  'uniswap': { team: 17, investors: 18, community: 43, treasury: 22, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 2000000000, note: 'DAO treasury $2B+. v3 protocol fee switch not enabled at launch. Largest DEX by volume.', teamTransparency: 'high', teamNote: 'Hayden Adams (fundador) é público e verificável. Uniswap Labs tem equipe amplamente identificada e histórico verificável no GitHub.' },
  'aave': { team: 13, investors: 7, community: 47, treasury: 23, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 400000000, note: 'Safety Module staking for protocol risk cover. Ecosystem Reserve funds grants.' },
  'chainlink': { team: 30, investors: 5, community: 35, treasury: 30, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 600000000, note: 'SmartCon Foundation controls 35% node operator reserves. Staking v0.2 live. Oracle leader.', teamTransparency: 'high', teamNote: 'Sergey Nazarov (co-fundador) é público e verificável. Chainlink Labs tem equipe amplamente identificada e histórico verificável.' },
  'maker': { team: 10, investors: 10, community: 50, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 8000000000, note: 'DAI stablecoin issuer. MKR burns via stability fee revenue. Protocol surplus ~$8B+.' },
  'curve-dao-token': { team: 10, investors: 5, community: 62, treasury: 3, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 4, treasuryUSD: 100000000, note: 'veCRV locking (4 year max) for governance. bribe economy around gauge voting. DEX stablecoin specialist.' },
  'lido-dao': { team: 20, investors: 22, community: 36, treasury: 22, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 300000000, note: 'LDO controls stETH protocol. High insider concentration concerns. Largest liquid staking protocol.' },
  'havven': { team: 25, investors: 0, community: 60, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 100000000, note: 'SNX — Synthetix staking mints sUSD synthetic assets. Debt pooling mechanism. sDAO controls treasury.' },
  'compound-governance-token': { team: 26, investors: 25, community: 42, treasury: 7, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 100000000, note: 'COMP — Compound Finance governance. High insider allocation (51%). Compound protocol lending.' },
  'yearn-finance': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 50000000, note: 'YFI — Legendary fair launch (no pre-mine, no VC). Andre Cronje distributed 100% to liquidity providers.' },
  'sushi': { team: 10, investors: 0, community: 90, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 2, treasuryUSD: 50000000, note: 'SUSHI — Forked from Uniswap. Dev fund 10% of emissions. xSUSHI staking captures protocol fees.' },
  'balancer': { team: 25, investors: 10, community: 65, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 3, treasuryUSD: 50000000, note: 'BAL — Liquidity mining program. veBAL for governance. 100M fixed supply.' },
  '1inch': { team: 22, investors: 38, community: 30, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 100000000, note: '1INCH — High backer concentration. Paraswap-competitor DEX aggregator. 1.5B fixed supply.' },
  'gmx': { team: 20, investors: 0, community: 45, treasury: 35, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, note: 'GMX — No VC investors. Real yield: 30% of fees to GMX stakers. Protocol-owned GLP liquidity.' },
  'dydx': { team: 23, investors: 28, community: 41, treasury: 8, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 150000000, note: 'dYdX — High insider concentration (51%). Migrated from StarkEx to own Cosmos chain (v4). Perp DEX.' },
  'the-graph': { team: 17, investors: 23, community: 51, treasury: 9, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 150000000, note: 'GRT — Indexing protocol. Delegators stake GRT to indexers for query fee rewards. Edge & Node built.' },
  'thorchain': { team: 10, investors: 16, community: 44, treasury: 30, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 100000000, note: 'RUNE — Required 2:1 to pool assets. Native cross-chain DEX with no wrapped tokens.' },
  // ── Layer 2 / Scaling ─────────────────────────────────────────────────────
  'optimism': { team: 19, investors: 17, community: 35, treasury: 25, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 800000000, note: 'Retroactive Public Goods Funding (RPGF) model. Bicameral governance (Token House + Citizens House).' },
  'arbitrum': { team: 17, investors: 17, community: 42, treasury: 27, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 3000000000, note: 'ARB DAO treasury largest in DeFi (~$3B+). Largest Ethereum L2 by TVL.' },
  'matic-network': { team: 19, investors: 5, community: 55, treasury: 21, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 3, treasuryUSD: 300000000, note: 'POL (formerly MATIC). Transitioning to AggLayer multi-chain validator. EIP-1559 fee burn on Polygon PoS.' },
  'immutable-x': { team: 25, investors: 15, community: 51, treasury: 9, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'IMX — Required for NFT trading fees on Immutable X ZK-rollup. Gaming-focused L2.' },
  'starknet': { team: 25, investors: 18, community: 30, treasury: 27, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000, note: 'STRK — StarkWare holds 32.9%, investors 18.2%. STARK proof-based ZK-rollup on Ethereum.' },
  'zksync': { team: 16, investors: 17, community: 67, treasury: 0, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'ZK — 67% community (17.5% airdrop + 49.1% ecosystem). Matter Labs holds 16.1%. ZK proof scaling.' },
  // ── New/emerging L1/L2 ────────────────────────────────────────────────────
  'injective-protocol': { team: 20, investors: 10, community: 60, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000, note: 'INJ — Weekly token burn auction. Cosmos SDK DeFi chain with EVM support. Growing DeFi hub.' },
  'sei-network': { team: 20, investors: 20, community: 40, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 100000000, note: 'SEI — Exchange-optimized L1 with parallelized EVM. Fast finality for trading use cases.' },
  'celestia': { team: 26, investors: 27, community: 47, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'TIA — Modular blockchain for data availability. High insider allocation (53%). Pioneered data availability sampling.' },
  'wormhole': { team: 12, investors: 17, community: 47, treasury: 24, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 150000000, note: 'W — Cross-chain messaging protocol. ~47% to community via airdrop and ecosystem grants.' },
  'hyperliquid': { team: 24, investors: 0, community: 76, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000, note: 'HYPE — Notable: no VC funding. 76% to community (airdrop + ecosystem). Perp DEX L1 with native staking.', teamTransparency: 'medium', teamNote: 'Jeff Yan (fundador) usa pseudônimo mas tem reputação forte. Time pseudônimo com histórico de execução técnica verificável pelo produto.' },
  'filecoin': { team: 15, investors: 10, community: 70, treasury: 5, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 6, treasuryUSD: 50000000, note: 'FIL — Required to pay for decentralized storage. 6-year vesting for team. Protocol Labs controls 15%.' },
  'blockstack': { team: 30, investors: 25, community: 45, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'STX — Stacks blockchain; BTC-anchored smart contracts. "Stacking" earns BTC rewards. High insider share.' },
  // ── Oracle / Infrastructure ───────────────────────────────────────────────
  'pyth-network': { team: 22, investors: 26, community: 52, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 50000000, note: 'PYTH — High-frequency oracle for DeFi. Publishers stake PYTH for data integrity. Solana-native, multi-chain.' },
  // ── Governance/DAO tokens ─────────────────────────────────────────────────
  'ethereum-name-service': { team: 19, investors: 0, community: 75, treasury: 6, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 500000000, note: 'ENS — 25% airdrop to .eth holders, 50% DAO treasury. No VC investors. ENS DAO controls protocol.' },
  // ── DeFi Derivatives ──────────────────────────────────────────────────────
  'blur': { team: 15, investors: 14, community: 60, treasury: 11, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 50000000, note: 'BLUR — NFT marketplace token. 60% community incentive airdrops. Trading rewards drove initial adoption.' },
  'jupiter-exchange-solana': { team: 50, investors: 10, community: 40, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 100000000, note: 'JUP — Solana DEX aggregator. 40% community (airdrop series). High team allocation (50%).' },
  // ── Gaming / Metaverse ────────────────────────────────────────────────────
  'decentraland': { team: 20, investors: 20, community: 40, treasury: 20, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 100000000, note: 'MANA — Virtual world governance. Decentraland Foundation controls treasury. Low active user base concern.' },
  'the-sandbox': { team: 12, investors: 26, community: 27, treasury: 29, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 150000000, note: 'SAND — Animoca Brands-backed metaverse. High VC allocation. SAND used for LAND purchases & staking.' },
  'axie-infinity': { team: 21, investors: 29, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 3, treasuryUSD: 100000000, note: 'AXS — Axie Infinity governance/staking. Sky Mavis breach (Ronin bridge $625M hack 2022). Play-to-earn pioneer.' },
  'gala': { team: 50, investors: 0, community: 50, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 50000000, note: 'GALA — Gala Games token. 50% founder nodes, 50% player rewards. Ongoing token emissions are high.' },
  // ── Sports/Fan tokens ─────────────────────────────────────────────────────
  'chiliz': { team: 20, investors: 20, community: 40, treasury: 20, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'CHZ — Sports fan engagement. Powers Socios.com fan tokens for football clubs (PSG, Barça, etc.).' },
  // ── EVM DeFi ecosystem ────────────────────────────────────────────────────
  'fantom': { team: 15, investors: 18, community: 55, treasury: 12, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'FTM — Rebranding to Sonic (S). High-performance PoS DAG chain. André Cronje DeFi ecosystem.' },
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
      note: meta.note ?? 'Dados verificados (tokenomics publicados)',
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

  // ─── Team Transparency ────────────────────────────────────────
  const teamTransparency = meta?.teamTransparency;
  const teamNote = meta?.teamNote;

  // ─── Community Strength ───────────────────────────────────────
  const twitterFollowers = token.community_data?.twitter_followers ?? 0;
  const redditSubscribers = token.community_data?.reddit_subscribers ?? 0;
  const commitCount = token.developer_data?.commit_count_4_weeks ?? 0;
  const sentimentUp = token.sentiment_votes_up_percentage ?? 0;

  let communityPoints = 0;
  if (twitterFollowers > 500000) communityPoints += 2;
  else if (twitterFollowers > 100000) communityPoints += 1;
  if (redditSubscribers > 100000) communityPoints += 2;
  else if (redditSubscribers > 20000) communityPoints += 1;
  if (commitCount > 100) communityPoints += 2;
  else if (commitCount > 20) communityPoints += 1;
  if (sentimentUp > 70) communityPoints += 1;

  const communityStrength: 'strong' | 'medium' | 'weak' =
    communityPoints >= 5 ? 'strong' : communityPoints >= 2 ? 'medium' : 'weak';

  // ─── Regulatory Entry ─────────────────────────────────────────
  const regulatoryEntry = REGULATORY_DATA[token.id] ?? null;

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

  // ─── Regulatory / Team / Community are informational ONLY ────
  // They appear as visual sections but do NOT affect the tokenomics score.
  // The platform focus is pure tokenomics quality, not external risk factors.

  const totalScore = Math.max(0, Math.min(10,
    supplyScore * 0.25 +
    distScore * 0.25 +
    vestingScore * 0.20 +
    utilScore * 0.20 +
    treasScore * 0.10
  ));

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
    vestingYears,
    utilityData,
    treasuryData,
    teamTransparency,
    teamNote,
    communityStrength,
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

export function getQuickScore(coinGeckoId: string): number | null {
  const meta = TOKEN_METADATA[coinGeckoId];
  if (!meta) return null;
  let score = 5;
  if ((meta.community ?? 0) >= 60) score += 1;
  if ((meta.investors ?? 0) <= 10) score += 1;
  if ((meta.team ?? 0) <= 15) score += 1;
  if ((meta.vestingYears ?? 0) >= 2) score += 0.5;
  if (meta.feeBurning) score += 0.5;
  if ((meta.team ?? 0) >= 40) score -= 2;
  if ((meta.investors ?? 0) >= 30) score -= 1.5;
  return Math.min(10, Math.max(0, Math.round(score * 10) / 10));
}
