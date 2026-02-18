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
// Date of the last manual review of the entire token database
export const DATA_LAST_UPDATED = '2026-02-18';

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
  lastUpdated?: string; // override per-token when individually updated
  sources?: { label: string; url: string }[]; // specific sources for tokenomics data
  // Centralization fields
  controlledPct?: number;        // % effectively controlled by one entity (team + treasury if same entity)
  centralizedControl?: boolean;  // true when team+treasury >40% AND same entity controls both
  executionRisk?: boolean;       // true when project has significant execution gap (promised >> delivered)
}> = {
  // ── Layer 1 — Bitcoin & forks ────────────────────────────────────────────
  'bitcoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Já deflacionário na prática: emissão pós-halving 2024 caiu para ~0.85% ao ano, e moedas perdidas (Satoshi + wallets inacessíveis) superam a emissão nova. Supply efetivo diminui. Cap fixo de 21M — caso único de escassez programada.', teamTransparency: 'anonymous', teamNote: 'Satoshi Nakamoto é anônimo. O protocolo é 100% open source e descentralizado — caso único no mercado.', sources: [{ label: 'Bitcoin Whitepaper', url: 'https://bitcoin.org/bitcoin.pdf' }, { label: 'bitcoin.org', url: 'https://bitcoin.org' }] },
  'litecoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Fair launch Bitcoin fork. Fixed 84M supply with halving cycle.' },
  'bitcoin-cash': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Bitcoin fork (2017). No pre-mine; miner-secured PoW chain.' },
  'ethereum-classic': { team: 0, investors: 5, community: 95, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Original Ethereum chain (pre-DAO fork). PoW with fixed 210.7M cap.' },
  'zcash': { team: 6, investors: 0, community: 87, treasury: 7, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 20000000, note: 'Founders reward (20% of block rewards for 4 years ~5.8% of total). Privacy-focused PoW chain.' },
  'dash': { team: 0, investors: 0, community: 90, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 50000000, note: '10% of block rewards go to governance treasury (superblock). Masternodes provide governance & mixing.' },
  'decred': { team: 8, investors: 0, community: 84, treasury: 8, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 80000000, note: '8% of block rewards to treasury, 8% to original devs. Hybrid PoW/PoS governance.' },
  'dogecoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — inflationary with ~5B DOGE minted annually forever. No hard cap.', teamTransparency: 'medium', teamNote: 'Projeto comunitário sem time central. Billy Markus e Jackson Palmer (co-criadores) são públicos mas não envolvidos ativamente.' },
  // ── Layer 1 — Smart contract platforms ───────────────────────────────────
  'ethereum': { team: 12, investors: 8, community: 55, treasury: 25, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 1500000000, note: 'EIP-1559 base fee burn. ~72M ETH pre-mine (ICO 2014). EF holds ~$1.5B treasury.', teamTransparency: 'high', teamNote: 'Vitalik Buterin é público e altamente visível. Ethereum Foundation tem equipe amplamente identificada e verificável.', sources: [{ label: 'Ethereum Docs', url: 'https://ethereum.org/en/developers/docs/' }, { label: 'EF Allocation Report', url: 'https://ethereum.foundation/report-2022.pdf' }] },
  'binancecoin': { team: 40, investors: 10, community: 50, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 1, treasuryUSD: 0, centralizedControl: true, note: 'Quarterly BNB Auto-Burn targets 100M total burned (half of 200M initial). Team held 40% initially. Binance/CZ controls majority of supply.', teamTransparency: 'high', teamNote: 'CZ (Changpeng Zhao) era extremamente público. Reputação comprometida após condenação criminal em 2023. Richard Teng assumiu como CEO.', sources: [{ label: 'BNB Whitepaper', url: 'https://www.binance.com/en/bnb' }, { label: 'BNB Auto-Burn', url: 'https://www.binance.com/en/blog/ecosystem/bnb-auto-burn-421499824684902657' }] },
  'solana': { team: 13, investors: 37, community: 38, treasury: 12, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 800000000, note: 'High VC concentration (~37% to insiders). Solana Foundation holds 12%.', teamTransparency: 'high', teamNote: 'Anatoly Yakovenko (co-fundador) é público e ativo. Equipe da Solana Labs amplamente verificável no LinkedIn e GitHub.', sources: [{ label: 'Solana Tokenomics', url: 'https://solana.com/news/solana-token-distribution' }, { label: 'Solana Foundation', url: 'https://solana.org' }] },
  'cardano': { team: 9, investors: 7, community: 64, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 1000000000, executionRisk: true, note: '~80% supply already circulating. On-chain treasury (20%) but Cardano Foundation retains significant influence. ⚠️ Execution gap: smart contracts (Plutus) launched 2021 but DeFi ecosystem still lags ETH/SOL significantly. Voltaire governance still maturing.', teamTransparency: 'high', teamNote: 'Charles Hoskinson é público e muito ativo. IOHK, Emurgo e Cardano Foundation têm equipes identificadas e histórico verificável.', sources: [{ label: 'Cardano Docs', url: 'https://docs.cardano.org/explore-cardano/monetary-policy/ada-distribution' }, { label: 'Cardano Foundation', url: 'https://cardanofoundation.org' }] },
  'avalanche-2': { team: 10, investors: 9, community: 50, treasury: 31, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 1200000000, note: 'Fixed 720M max supply. ⚠️ Ava Labs (a private company) controls 31% treasury — this is CENTRALIZATION disguised as "ecosystem fund". Combined Ava Labs control (team 10% + treasury 31%) = 41% under single entity. Comparable to VC-backed projects.', teamTransparency: 'high', teamNote: 'Emin Gün Sirer (professor Cornell) é público e verificável. Ava Labs tem equipe amplamente identificada e acadêmica.' },
  'tron': { team: 34, investors: 16, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, centralizedControl: true, note: 'Justin Sun / Tron Foundation holds ~34% of supply. Treasury controlled by same entity. High insider concentration — effectively a single-entity controlled chain.', teamTransparency: 'high', teamNote: 'Justin Sun é extremamente público mas controverso. Múltiplos processos regulatórios e acusações de manipulação de mercado.' },
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
  'ripple': { team: 20, investors: 5, community: 40, treasury: 35, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, controlledPct: 55, centralizedControl: true, note: 'Ripple Labs holds ~40B XRP in escrow (released 1B/month). ⚠️ EFFECTIVE CONTROL: team 20% + treasury 35% = 55% controlled by Ripple Labs — majority of total supply under one entity. Fee burn is negligible. Not a decentralized asset.', teamTransparency: 'high', teamNote: 'Brad Garlinghouse (CEO) é público e verificável. Ripple Labs tem equipe amplamente identificada, apesar do processo SEC em andamento.', sources: [{ label: 'XRP Ledger Docs', url: 'https://xrpl.org/xrp-overview.html' }, { label: 'Ripple XRP Markets', url: 'https://ripple.com/xrp/' }] },
  // ── Stablecoins ──────────────────────────────────────────────────────────
  'tether': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin centralizada — Tether Ltd. (BVI/Hong Kong). Maior stablecoin por volume, mas histórico controverso: opacidade nas reservas, multa de $41M pelo CFTC (2021), sem auditorias independentes completas. Reservas incluem instrumentos comerciais além de dólares puros. Risco regulatório e de contraparte mais alto do segmento.', teamTransparency: 'low', teamNote: 'Tether Ltd. opera fora de jurisdições com forte regulação financeira. Jean-Louis van der Velde (CEO) tem perfil público limitado. Histórico de falta de transparência é preocupante para um emissor de $140B+.' },
  'usd-coin': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin centralizada — Circle (empresa americana regulada). ✅ Melhor da categoria centralizada: reservas auditadas mensalmente por Grant Thornton, parceria com BlackRock, registrada como MSB nos EUA. 100% USD + Treasuries — sem papéis comerciais. Momentâneo depeg em março/2023 (crise SVB) mas recuperou rapidamente, demonstrando robustez. Referência de compliance no setor.', teamTransparency: 'high', teamNote: 'Jeremy Allaire (CEO Circle) é público e bem reputado. Circle é empresa americana com SEC/CFTC oversight, IPO pendente. Maior transparência do segmento de stablecoins centralizadas.' },
  'dai': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Stablecoin descentralizada — emitida pelo protocolo MakerDAO via overcollateralização cripto (ETH, wBTC, RWA). DSR (DAI Savings Rate) oferece yield nativo. Sem empresa controladora — resistente a censura. Risco: smart contract + colateral cripto pode depreciar (liquidações em cascata). Migração parcial para USDC como colateral gera debate sobre descentralização real.', teamTransparency: 'high', teamNote: 'MakerDAO tem governança on-chain via MKR token. Equipe identificável mas protocolo opera de forma descentralizada com múltiplos guardiões independentes.' },
  // ── Memecoins ─────────────────────────────────────────────────────────────
  'shiba-inu': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — Vitalik burned 41% of SHIB supply in 2021. Ongoing burn via ShibaSwap. 999.9T max supply.', teamTransparency: 'low', teamNote: 'Equipe parcialmente anônima ("Ryoshi" criador desconhecido). Shytoshi Kusama lidera mas usa pseudônimo. Alto risco de anonimato.' },
  'pepe': { team: 0, investors: 0, community: 93, treasury: 7, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — 93.1% burned/LP, 6.9% reserved for CEX listings/bridges. 420.69T fixed supply.', teamTransparency: 'anonymous', teamNote: 'Time completamente anônimo. Sem identidades públicas conhecidas. Risco máximo de anonimato para investidores.' },
  'dogwifcoin': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — Solana dog-hat meme. Fair launch with no team/VC allocation. 998.9M fixed supply.' },
  'bonk': { team: 5, investors: 0, community: 95, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — community airdrop to Solana ecosystem participants. ~5% to team/contributors. BonkBurn mechanism.' },
  'pump-fun': { team: 20, investors: 10, community: 70, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 1, treasuryUSD: 0, note: 'Memecoin — token da plataforma pump.fun (Solana). Token de especulação sem utilidade no protocolo. A pump.fun em si gera receita enorme (~$500M+) mas o token PUMP não captura essa receita diretamente.', teamTransparency: 'anonymous', teamNote: 'Time anonimo. A pump.fun é operada por equipe sem identidades públicas confirmadas.' },
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
  'hyperliquid': { team: 24, investors: 0, community: 76, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000, note: 'HYPE — Maior airdrop sem VC da história cripto (76% comunidade). Zero investidores externos. Fee burn real com receita de protocolo massiva (~$500M+ em revenue). Perp DEX L1 com staking nativo. Modelo de fee burn direto ao token holders.', teamTransparency: 'medium', teamNote: 'Jeff Yan (fundador) usa pseudônimo mas tem reputação forte. Time pseudônimo com histórico de execução técnica verificável pelo produto.' },
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
  
  // Utility scoring: 4 standard dimensions + store-of-value bonus for monetary assets
  // Standard DeFi framework doesn't capture BTC/LTC-style monetary utility
  const storeOfValueTokens = ['bitcoin', 'litecoin', 'bitcoin-cash', 'monero', 'zcash'];
  const isStoreOfValue = storeOfValueTokens.includes(token.id);
  // isStablecoin early check (before cgCats is declared) — uses id list only
  const isStablecoinEarly = ['tether', 'usd-coin', 'dai', 'true-usd', 'frax', 'usdd', 'first-digital-usd'].includes(token.id);

  let utilityScore = [
    utilityData.neededToUse,
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
  ].filter(Boolean).length / 4 * 10;

  // Store-of-value bonus: monetary network utility doesn't require staking/governance
  // BTC: largest, most secure, most decentralized monetary network = high utility
  if (isStoreOfValue) {
    utilityScore = Math.min(10, utilityScore + 3.0);
  }

  // Stablecoin medium-of-exchange bonus: USDT/USDC are the backbone of DeFi
  // High utility as collateral, trading pairs, and settlement layer — just not investment-grade
  if (isStablecoinEarly) {
    utilityScore = Math.min(8.0, utilityScore + 4.0); // boost utility but score still capped at 6.0 total
  }

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

  // ─── Token Category Detection ────────────────────────────────
  // Determines scoring weights and caps based on token type
  const tokenNote = (meta?.note ?? '').toLowerCase();
  const cgCats = token.categories?.map(c => c.toLowerCase()) || [];

  const isMemeToken = (
    tokenNote.includes('memecoin') ||
    cgCats.some(c => c.includes('meme')) ||
    ['dogecoin', 'shiba-inu', 'pepe', 'dogwifcoin', 'bonk', 'floki',
     'baby-doge-coin', 'samoyedcoin', 'myro', 'popcat', 'mog-coin',
     'book-of-meme', 'cat-in-a-dogs-world', 'just-a-coke',
     'pump-fun', 'based-brett'].includes(token.id)
  );

  const isStablecoin = cgCats.some(c => c.includes('stablecoin')) ||
    ['tether', 'usd-coin', 'dai', 'true-usd', 'frax', 'usdd', 'first-digital-usd'].includes(token.id);

  // ─── Scoring ──────────────────────────────────────────────────

  // Supply score (25%)
  let supplyScore = 5;
  if (isFixed) supplyScore += 3;
  else if (isMemeToken) supplyScore -= 1; // No hard cap memecoin is worse than no-cap utility token
  if (circulatingPct > 80) supplyScore += 1.5;
  else if (circulatingPct > 50) supplyScore += 0.5;
  if (inflationRate < 2) supplyScore += 1.5;
  else if (inflationRate < 5) supplyScore += 1;
  else if (inflationRate > 20) supplyScore -= 2;
  else if (inflationRate > 10) supplyScore -= 1;
  supplyScore = Math.max(0, Math.min(10, supplyScore));

  // ─── FDV Pressure Penalty ─────────────────────────────────────
  // If FDV >> MarketCap, large unlocks ahead = future selling pressure
  const fdvValue = md.fully_diluted_valuation?.usd;
  const marketCapValue = md.market_cap?.usd;
  const fdvRatio = fdvValue && marketCapValue && marketCapValue > 0
    ? fdvValue / marketCapValue
    : 1;
  let fdvPenalty = 0;
  if (fdvRatio > 10) fdvPenalty = 1.5;
  else if (fdvRatio > 5) fdvPenalty = 1.0;
  else if (fdvRatio > 3) fdvPenalty = 0.5;
  supplyScore = Math.max(0, supplyScore - fdvPenalty);

  // ─── Controlled Supply Penalty ────────────────────────────────
  // If a single entity effectively controls a large % of total supply,
  // the "fixed supply" narrative is misleading — penalize supply quality.
  if (meta?.controlledPct && meta.controlledPct > 50) {
    supplyScore = Math.max(0, supplyScore - 5); // Majority single-entity control: severe
  } else if (meta?.controlledPct && meta.controlledPct > 40) {
    supplyScore = Math.max(0, supplyScore - 3); // Significant control: moderate penalty
  } else if (meta?.controlledPct && meta.controlledPct > 30) {
    supplyScore = Math.max(0, supplyScore - 1); // Notable control: mild penalty
  }

  // Distribution score (25%)
  // Fair launch bonus only applies to real utility/infra tokens — not memecoins
  // (a memecoin "fair launch" means zero effort, not a feature)
  let distScore = 10;
  distScore -= Math.max(0, (distribution.team - 10) * 0.3);
  distScore -= Math.max(0, (distribution.investors - 15) * 0.3);
  if (distribution.community > 50) distScore += 1;
  if (distribution.investors === 0 && !isMemeToken) distScore += 1; // No VC = genuine bonus for real projects
  if (distribution.team === 0 && distribution.investors === 0 && !isMemeToken) {
    distScore = 10; // Bitcoin-like fair launch for real projects
  }
  // ─── Centralization Penalty ───────────────────────────────────
  // Same entity controls team + treasury (e.g. Ripple, Justin Sun, Binance)
  if (meta?.centralizedControl) distScore = Math.max(0, distScore - 2);
  distScore = Math.max(0, Math.min(10, distScore));

  // Vesting score (20%)
  // For memecoins: no vesting is expected (no team/VC), so it's neutral — not a bonus
  let vestingScore = 5;
  if (!isMemeToken) {
    if (lockedPct < 20) vestingScore += 3;
    else if (lockedPct < 35) vestingScore += 1;
    else if (lockedPct > 50) vestingScore -= 2;
    if (vestingYears >= 4) vestingScore += 1;
    else if (vestingYears < 2 && lockedPct > 25) vestingScore -= 2;
  }
  vestingScore = Math.max(0, Math.min(10, vestingScore));

  // Utility score (20%)
  let utilScore = utilityData.score;
  // Execution risk: token/project promised features not delivered → utility is overestimated
  if (meta?.executionRisk) utilScore = Math.max(0, utilScore - 2);

  // Treasury score (10%)
  let treasScore = 5;
  if (treasuryData.runwayMonths) {
    if (treasuryData.runwayMonths > 36) treasScore = 9;
    else if (treasuryData.runwayMonths > 24) treasScore = 7;
    else if (treasuryData.runwayMonths > 12) treasScore = 5;
    else treasScore = 3;
  }
  if (isMemeToken) treasScore = Math.min(treasScore, 3); // No meaningful treasury = penalized
  // Centralized treasury = not really an ecosystem asset, cap its contribution
  if (meta?.centralizedControl && distribution.treasury > 20) {
    treasScore = Math.min(treasScore, 3);
  }

  // ─── Regulatory / Team / Community are informational ONLY ────
  // They appear as visual sections but do NOT affect the tokenomics score.
  // The platform focus is pure tokenomics quality, not external risk factors.

  let totalScore = Math.max(0, Math.min(10,
    supplyScore * 0.25 +
    distScore * 0.25 +
    vestingScore * 0.20 +
    utilScore * 0.20 +
    treasScore * 0.10
  ));

  // ─── Category Score Cap ───────────────────────────────────────
  // Memecoins: hard cap at 4.5 regardless of tokenomics structure.
  // A "fair launch + fixed supply" memecoin cannot score the same as a real protocol.
  // Utility = 0 is the defining characteristic — it's not an investment-grade asset.
  if (isMemeToken) totalScore = Math.min(totalScore, 4.5);

  // Stablecoins: cap at 6.0 — by design pegged to fiat, not investment-grade
  if (isStablecoin) totalScore = Math.min(totalScore, 6.0);

  // Execution risk cap: despite good tokenomics structure, the project underdelivers
  // Cap at 5.5 ("Regular") — structure is fine but execution gap is disqualifying for Bom+
  if (meta?.executionRisk) totalScore = Math.min(totalScore, 5.5);

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

  if (meta?.centralizedControl) {
    cons.push(`⚠️ Controle centralizado: equipe + tesouraria sob a mesma entidade — risco real de decisões unilaterais`);
  } else if (distribution.team + distribution.investors < 25) {
    pros.push('Distribuição equilibrada — baixa concentração em equipe e investidores');
  } else if (distribution.team + distribution.investors > 40) {
    cons.push(`${distribution.team + distribution.investors}% com equipe/investidores — alta concentração de poder`);
  }

  if (meta?.controlledPct && meta.controlledPct > 50) {
    cons.push(`${meta.controlledPct}% da oferta sob controle efetivo de uma única entidade — descentralização é um mito`);
  }

  if (meta?.executionRisk) {
    cons.push('Gap de execução: o projeto prometeu muito mais do que entregou até agora');
  }

  if (fdvPenalty > 0) {
    cons.push(`FDV ${fdvRatio.toFixed(1)}x maior que Market Cap — grandes desbloqueios futuros = pressão vendedora estrutural`);
  }

  if (distribution.investors === 0 && !isMemeToken) pros.push('Zero alocação para VCs — sem pressão vendedora de investidores institucionais');
  if (utilityData.feeBurning) pros.push('Mecanismo de queima de fees — pressão deflacionária no token');
  if (utilityData.stakingAvailable) pros.push('Staking disponível — incentiva holders de longo prazo');
  if (utilityData.governancePower) pros.push('Poder de governança — token confere voz no protocolo');
  if (isStoreOfValue) pros.push('Reserva de valor digital — utilidade monetária comprovada como ativo de escassez programada');
  if (isStablecoin) pros.push('Meio de troca e colateral DeFi — espinha dorsal da liquidez em cripto');
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

  // Base conclusion — category-aware
  if (isMemeToken) {
    conclusion = `${tokenName} é um memecoin — ativo puramente especulativo sem utilidade real no protocolo. Memecoins podem apresentar distribuição "justa" e oferta fixa, mas carecem dos fundamentos que sustentam valorização de longo prazo: utilidade, governança, receita de protocolo e roadmap técnico. O score reflete essa realidade: pode ser um trade, não é um investimento fundamentalista.`;
  } else if (isStablecoin) {
    const isCentralizedStable = ['tether', 'usd-coin', 'true-usd', 'first-digital-usd'].includes(token.id);
    const isDecentralizedStable = ['dai', 'frax', 'usdd'].includes(token.id);
    const isUSDC = token.id === 'usd-coin';
    const isUSDT = token.id === 'tether';
    if (isUSDC) {
      conclusion = `USDC é a stablecoin centralizada de maior qualidade: empresa americana regulada (Circle), reservas 100% em USD + Treasuries com auditoria mensal, parceria com BlackRock. Melhor opção no segmento centralizado para quem prioriza segurança e compliance. Não é investimento — é a infraestrutura mais confiável de liquidez no mercado cripto.`;
    } else if (isUSDT) {
      conclusion = `USDT é a stablecoin de maior volume ($140B+), mas carrega riscos reais: histórico de opacidade nas reservas, sede em jurisdição de baixa regulação, multa pelo CFTC. Amplamente usado pela liquidez, não pela segurança. Para exposição a stablecoin com menor risco de contraparte, USDC é preferível. USDT continua relevante pela liquidez, mas não pela qualidade tokenômica.`;
    } else if (isDecentralizedStable) {
      conclusion = `${tokenName} é uma stablecoin descentralizada — emitida via overcollateralização cripto e smart contracts, sem empresa controladora. Resistente a censura e intervenção regulatória. Risco: smart contract e liquidações em cascata em eventos de mercado extremo. Melhor opção para quem prioriza descentralização real. Não é investimento — é infraestrutura DeFi nativa.`;
    } else if (isCentralizedStable) {
      conclusion = `${tokenName} é uma stablecoin centralizada — ferramenta de liquidez essencial mas com dependência direta da empresa emissora. Score reflete sua utilidade como meio de troca, não potencial de valorização.`;
    } else {
      conclusion = `${tokenName} é uma stablecoin — projetada para manter paridade com o dólar, não para apreciação de valor. Alta utilidade como meio de troca e colateral, com score limitado por design.`;
    }
  } else if (verdict === 'Excelente') {
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

  // Append relevant context: regulatory, team transparency, community
  const contextParts: string[] = [];

  if (regulatoryEntry) {
    if (regulatoryEntry.severity === 'high') {
      contextParts.push(`⚠️ Risco regulatório ALTO: ${regulatoryEntry.summary} — isso representa uma ameaça real ao projeto e deve ser considerado antes de qualquer investimento.`);
    } else if (regulatoryEntry.severity === 'medium') {
      contextParts.push(`⚠️ Risco regulatório moderado: ${regulatoryEntry.summary}.`);
    } else if (regulatoryEntry.severity === 'low') {
      contextParts.push(`ℹ️ Risco regulatório baixo: ${regulatoryEntry.summary}.`);
    }
  }

  if (teamTransparency === 'anonymous') {
    // Special case: Bitcoin — anonymous creator is a FEATURE (no one controls it)
    if (token.id === 'bitcoin') {
      contextParts.push(`🔓 Criador anônimo (Satoshi) é uma característica de descentralização — sem fundador para pressionar ou controlar o protocolo. Caso único no mercado.`);
    } else {
      contextParts.push(`🕵️ Time completamente anônimo — ausência de accountability pública aumenta o risco de saída do projeto.`);
    }
  } else if (teamTransparency === 'low') {
    contextParts.push(`👤 Transparência do time limitada — poucas informações públicas sobre os desenvolvedores.`);
  } else if (teamTransparency === 'high' && (verdict === 'Excelente' || verdict === 'Bom')) {
    contextParts.push(`✅ Time público e verificável, o que aumenta a credibilidade e accountability do projeto.`);
  }

  if (communityStrength === 'strong' && (verdict === 'Excelente' || verdict === 'Bom')) {
    contextParts.push(`🌐 Comunidade forte e ativa reforça o potencial de adoção.`);
  } else if (communityStrength === 'weak' && (verdict === 'Regular' || verdict === 'Ruim' || verdict === 'Evitar')) {
    contextParts.push(`📉 Comunidade fraca pode dificultar a adoção e valorização orgânica.`);
  }

  if (contextParts.length > 0) {
    conclusion += ' ' + contextParts.join(' ');
  }

  const tokenomicsLastUpdated = meta?.lastUpdated ?? DATA_LAST_UPDATED;
  const tokenomicsSources = meta?.sources ?? [];

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
    tokenomicsLastUpdated,
    tokenomicsSources,
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
