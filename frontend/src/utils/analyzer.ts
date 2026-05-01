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
export const DATA_LAST_UPDATED = '2026-05-01';

export const TOKEN_METADATA: Record<string, {
  team?: number;
  investors?: number;
  community?: number;
  treasury?: number;
  stakingAvailable?: boolean;
  governancePower?: boolean;
  feeBurning?: boolean;
  verifiedFeeBurn?: boolean;     // true when fee burn is massive and verified (ETH EIP-1559, BNB auto-burn, HYPE protocol burn)
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
  weakValueAccrual?: boolean;    // true when ecosystem grows but token doesn't capture value (e.g. ATOM — IBC doesn't require ATOM)
  hasVeTokenomics?: boolean;     // true when protocol uses ve-locking (veCRV, vePENDLE, etc.) — affects staking display
  dataQuality?: 'verified' | 'estimated'; // 'verified' = sourced + manually reviewed; omit = 'estimated'
  // Scoring V2 fields
  launchYear?: number;           // Year the network/token launched (for Lindy Effect scoring)
  innovationLevel?: 'pioneer' | 'major' | 'incremental' | 'clone'; // Innovation classification
}> = {
  // ── Layer 1 — Bitcoin & forks ────────────────────────────────────────────
  'bitcoin': { launchYear: 2009, innovationLevel: 'pioneer', team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, dataQuality: 'verified', note: 'Já deflacionário na prática: emissão pós-halving 2024 caiu para ~0.85% ao ano, e moedas perdidas (Satoshi + wallets inacessíveis) superam a emissão nova. Supply efetivo diminui. Cap fixo de 21M — caso único de escassez programada.', teamTransparency: 'anonymous', teamNote: 'Satoshi Nakamoto é anônimo. O protocolo é 100% open source e descentralizado — caso único no mercado.', sources: [{ label: 'Bitcoin Whitepaper', url: 'https://bitcoin.org/bitcoin.pdf' }, { label: 'bitcoin.org', url: 'https://bitcoin.org' }] },
  'litecoin': { launchYear: 2011, innovationLevel: 'clone', team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, weakValueAccrual: true, note: 'Fork do Bitcoin com cap de 84M. ⚠️ Charlie Lee (criador) vendeu TODOS os seus LTC no ATH de 2017 — sinal claro de falta de convicção. Sem DeFi, sem smart contracts, sem inovação desde o halving. Bitcoin dominou completamente a narrativa de reserva de valor. LTC sobrevive pela liquidez histórica, não por fundamentos.', teamTransparency: 'high', teamNote: 'Charlie Lee é público e identificado, mas vendeu todo seu LTC no pico de 2017. Atualmente tem papel consultivo limitado no projeto.' },
  'bitcoin-cash': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Bitcoin fork (2017). No pre-mine; miner-secured PoW chain.' },
  'ethereum-classic': { team: 0, investors: 5, community: 95, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, note: 'Original Ethereum chain (pre-DAO fork). PoW with fixed 210.7M cap.' },
  'zcash': { team: 6, investors: 0, community: 87, treasury: 7, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 20000000, note: 'Founders reward (20% of block rewards for 4 years ~5.8% of total). Privacy-focused PoW chain.' },
  'dash': { team: 0, investors: 0, community: 90, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 50000000, note: '10% of block rewards go to governance treasury (superblock). Masternodes provide governance & mixing.' },
  'decred': { team: 8, investors: 0, community: 84, treasury: 8, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 80000000, note: '8% of block rewards to treasury, 8% to original devs. Hybrid PoW/PoS governance.' },
  'dogecoin': { launchYear: 2013, innovationLevel: 'clone', team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — inflationary with ~5B DOGE minted annually forever. No hard cap.', teamTransparency: 'medium', teamNote: 'Projeto comunitário sem time central. Billy Markus e Jackson Palmer (co-criadores) são públicos mas não envolvidos ativamente.' },
  'dog-go-to-the-moon-rune': { launchYear: 2024, innovationLevel: 'incremental', team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — DOG•GO•TO•THE•MOON (Rune #3). Bitcoin Runes protocol lançado no halving 2024. Supply fixo de 100B. Distribuição 100% via airdrop/mint para a comunidade Bitcoin.', teamTransparency: 'anonymous', teamNote: 'Time anônimo. Runes é um protocolo descentralizado na rede Bitcoin — sem empresa ou fundação central.' },
  // ── Layer 1 — Smart contract platforms ───────────────────────────────────
  'ethereum': { launchYear: 2015, innovationLevel: 'pioneer', dataQuality: 'verified', team: 12, investors: 8, community: 55, treasury: 25, stakingAvailable: true, governancePower: false, feeBurning: true, verifiedFeeBurn: true, neededToUse: true, vestingYears: 0, treasuryUSD: 1500000000, note: 'EIP-1559 base fee burn. ~72M ETH pre-mine (ICO 2014). EF holds ~$1.5B treasury.', teamTransparency: 'high', teamNote: 'Vitalik Buterin é público e altamente visível. Ethereum Foundation tem equipe amplamente identificada e verificável.', sources: [{ label: 'Ethereum Docs', url: 'https://ethereum.org/en/developers/docs/' }, { label: 'EF Allocation Report', url: 'https://ethereum.foundation/report-2022.pdf' }] },
  'binancecoin': { launchYear: 2017, innovationLevel: 'incremental', dataQuality: 'verified', team: 40, investors: 10, community: 50, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, verifiedFeeBurn: true, neededToUse: true, vestingYears: 1, treasuryUSD: 0, centralizedControl: true, controlledPct: 40, note: 'Quarterly BNB Auto-Burn targets 100M total burned (half of 200M initial). Team held 40% initially. Binance/CZ controls majority of supply.', teamTransparency: 'high', teamNote: 'CZ (Changpeng Zhao) era extremamente público. Reputação comprometida após condenação criminal em 2023. Richard Teng assumiu como CEO.', sources: [{ label: 'BNB Whitepaper', url: 'https://www.binance.com/en/bnb' }, { label: 'BNB Auto-Burn', url: 'https://www.binance.com/en/blog/ecosystem/bnb-auto-burn-421499824684902657' }] },
  'solana': { launchYear: 2020, innovationLevel: 'major', dataQuality: 'verified', team: 13, investors: 37, community: 38, treasury: 12, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 800000000, note: 'High VC concentration (~37% to insiders). Solana Foundation holds 12%.', teamTransparency: 'high', teamNote: 'Anatoly Yakovenko (co-fundador) é público e ativo. Equipe da Solana Labs amplamente verificável no LinkedIn e GitHub.', sources: [{ label: 'Solana Tokenomics', url: 'https://solana.com/news/solana-token-distribution' }, { label: 'Solana Foundation', url: 'https://solana.org' }] },
  'cardano': { dataQuality: 'verified', team: 9, investors: 7, community: 64, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 1000000000, executionRisk: true, note: '~80% supply already circulating. On-chain treasury (20%) but Cardano Foundation retains significant influence. ⚠️ Execution gap: smart contracts (Plutus) launched 2021 but DeFi ecosystem still lags ETH/SOL significantly. Voltaire governance still maturing.', teamTransparency: 'high', teamNote: 'Charles Hoskinson é público e muito ativo. IOHK, Emurgo e Cardano Foundation têm equipes identificadas e histórico verificável.', sources: [{ label: 'Cardano Docs', url: 'https://docs.cardano.org/explore-cardano/monetary-policy/ada-distribution' }, { label: 'Cardano Foundation', url: 'https://cardanofoundation.org' }] },
  'midnight-3': { launchYear: 2025, innovationLevel: 'incremental', team: 25, investors: 25, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'NIGHT — privacy sidechain do Cardano. Lançamento mainnet dez/2025. ZK-SNARKs para transações privadas. Modelo híbrido: shielded (DUST) e unshielded (NIGHT) tokens. 10% genesis, 25% team/investors com 1-year cliff/4-year vesting, 40% community e developers. Sem inflação estrutural. Backed por Cardano treasury (~$400M+) e Charles Hoskinson. ⚠️ Muito recente: sem histórico de mercado em bear. Competição direta com Monero, Zcash. Dependente de adoção de privacy narrativa no Cardano.', teamTransparency: 'high', teamNote: 'Charles Hoskinson lidera. IOG (Input Output Global) desenvolve. Time com histórico sólido no Cardano mas projeto ainda muito novo.' },
  'avalanche-2': { launchYear: 2020, innovationLevel: 'incremental', team: 10, investors: 9, community: 50, treasury: 31, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 1200000000, centralizedControl: true, controlledPct: 41, note: 'Fixed 720M max supply. ⚠️ Ava Labs (a private company) controls 31% treasury — this is CENTRALIZATION disguised as "ecosystem fund". Combined Ava Labs control (team 10% + treasury 31%) = 41% under single entity. Comparable to VC-backed projects.', teamTransparency: 'high', teamNote: 'Emin Gün Sirer (professor Cornell) é público e verificável. Ava Labs tem equipe amplamente identificada e acadêmica.' },
  'tron': { team: 34, investors: 16, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, centralizedControl: true, controlledPct: 44, note: 'Justin Sun / Tron Foundation holds ~34% of supply. Treasury controlled by same entity. High insider concentration — effectively a single-entity controlled chain.', teamTransparency: 'high', teamNote: 'Justin Sun é extremamente público mas controverso. Múltiplos processos regulatórios e acusações de manipulação de mercado.' },
  'cosmos': { team: 10, investors: 5, community: 67, treasury: 18, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 500000000, weakValueAccrual: true, note: 'IBC protocol hub com problema crítico de captura de valor: as appchains do Cosmos NÃO precisam usar ATOM — o protocolo IBC é agnóstico ao token. ATOM 2.0 (proposta de reforma econômica) foi parcialmente rejeitado pela comunidade. Inflação histórica alta (até 20% a.a., reduzida via prop 848 mas sem mecanismo de burn). "Cosmos é um sucesso técnico, ATOM é um fracasso como ativo" — consenso crescente entre analistas.', teamTransparency: 'high', teamNote: 'Interchain Foundation tem equipe identificada. Jae Kwon (fundador original) saiu em 2020. Ethan Buchman lidera. Múltiplos times contribuindo (Informal Systems, Strangelove, etc.).' },
  'polkadot': { team: 30, investors: 10, community: 50, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 500000000, executionRisk: true, note: 'W3F/Parity hold ~30%. ⚠️ Execution gap crítico: sistema de parachain auction não gerou adoção esperada. Gavin Wood saiu da Parity Technologies em 2022. Alta inflação (~8-10%/ano via staking) dilui holders. Pivotando para "Agile Coretime" mas sem tração clara. Perdeu narrativa para Solana, L2s Ethereum e Cosmos.', teamTransparency: 'high', teamNote: 'Gavin Wood (co-fundador Ethereum) é público mas saiu da Parity em 2022. Web3 Foundation e Parity Technologies ainda têm equipes identificadas, mas liderança técnica principal se dispersou.' },
  'near': { team: 17, investors: 17, community: 40, treasury: 26, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000, centralizedControl: true, controlledPct: 43, note: 'NEAR Foundation holds 26% for ecosystem grants. 5% annual inflation. ⚠️ NEAR Foundation controls 43% of supply (team 17% + ecosystem treasury 26%) — foundation-controlled allocation despite DAO governance theater. Investors (17%) are separate entities.', teamTransparency: 'high', teamNote: 'Illia Polosukhin (ex-Google) e Alex Skidanov são públicos e verificáveis. NEAR Inc. tem equipe amplamente identificada.' },
  'aptos': { team: 19, investors: 16, community: 51, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 400000000, note: 'Ex-Meta Diem team. 10-year vesting for foundation/core. Monthly token unlocks ongoing.', teamTransparency: 'high', teamNote: 'Mo Shaikh e Avery Ching (ex-Meta Diem) são públicos. Equipe composta majoritariamente por ex-funcionários da Meta verificáveis no LinkedIn.' },
  'sui': { team: 20, investors: 14, community: 52, treasury: 14, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 600000000, note: 'Mysten Labs (ex-Meta) holds 20%. Large ongoing unlock schedule concerns investors.', teamTransparency: 'high', teamNote: 'Evan Cheng e equipe da Mysten Labs (ex-Meta) são públicos e verificáveis no LinkedIn e GitHub.' },
  'algorand': { team: 25, investors: 0, community: 45, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 5, treasuryUSD: 400000000, centralizedControl: true, controlledPct: 55, note: 'Algorand Inc + Foundation hold 55%. No VC round — equity funding separate from token. ~10B fixed max supply. ⚠️ Algorand Foundation/Inc controls 55% of supply (team 25% + treasury 30%) under single organizational umbrella — effective centralization despite no external VCs.' },
  'internet-computer': { team: 24, investors: 25, community: 49, treasury: 2, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 100000000, note: 'DFINITY controls 24%, early investors 25%. NNS governance controls protocol. Controversial initial distribution.' },
  'vechain': { team: 12, investors: 20, community: 23, treasury: 25, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, note: 'Dual-token: VET + VTHO (gas). VeChain Foundation controls 25%. Enterprise-focused supply chain.' },
  'elrond-erd-2': { team: 19, investors: 32, community: 34, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 4, treasuryUSD: 150000000, note: 'Now rebranded MultiversX (EGLD). High investor concentration (32%). 4-year vesting for insiders.' },
  'theta-token': { team: 30, investors: 10, community: 50, treasury: 10, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'Dual-token: THETA (governance/staking) + TFUEL (gas). Samsung, Google, Sony as validators.' },
  'eos': { team: 10, investors: 40, community: 45, treasury: 5, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, executionRisk: true, note: 'Block.one levantou $4B no maior ICO da história (2017-2018), foi multado pela SEC em $24M (2019) e depois ABANDONOU o projeto. EOS Network Foundation assumiu sem Block.one. CPU/NET/RAM resource model provou ser horrível na prática. DeFi ecosystem mínimo. "O maior ICO da história que resultou em nada" — consenso de analistas.', teamTransparency: 'high', teamNote: 'Brendan Blumer e Dan Larimer (Block.one) são públicos mas saíram. EOS Network Foundation (Yves La Rose) agora lidera sem os criadores originais.' },
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
  'hedera-hashgraph': { team: 9, investors: 5, community: 52, treasury: 34, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 4, treasuryUSD: 300000000, centralizedControl: true, controlledPct: 43, note: 'Hedera council (Google, IBM, etc.) governs. 50B HBAR max supply. Treasury held by Hedera Foundation. ⚠️ Hedera Council (permissioned corporate group) controls 43% of supply (team 9% + treasury 34%) — not a decentralized DAO. Council decides release schedule unilaterally.' },
  // ── Ripple ───────────────────────────────────────────────────────────────
  'ripple': { dataQuality: 'verified', team: 20, investors: 5, community: 40, treasury: 35, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 0, treasuryUSD: 0, controlledPct: 46, centralizedControl: true, note: 'Ripple Labs holds ~33.9B XRP in escrow (released 1B/month, ~70% re-locked). ⚠️ EFFECTIVE CONTROL: Ripple Labs controls ~46% of total supply (45% escrow + ~1% operational) as of Feb 2026 — near-majority control by single private entity. Fee burn is negligible. Not a decentralized asset.', teamTransparency: 'high', teamNote: 'Brad Garlinghouse (CEO) é público e verificável. Ripple Labs tem equipe amplamente identificada, apesar do processo SEC em andamento.', sources: [{ label: 'XRP Ledger Docs', url: 'https://xrpl.org/xrp-overview.html' }, { label: 'Ripple XRP Markets', url: 'https://ripple.com/xrp/' }, { label: 'BingX XRP Rich List', url: 'https://bingx.com/en/learn/article/top-xrp-holders-xrp-rich-list-who-owns-the-most-xrp' }] },
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
  'cat-in-a-dogs-world': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — MEW (cat in a dogs world). Solana cat meme. Fair launch, 100% community distribution. 88.9B fixed supply.', teamTransparency: 'anonymous', teamNote: 'Time anônimo. Memecoin comunitário sem fundadores identificados.' },
  'popcat': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — baseado no meme viral do gato Oatmeal (POPCAT). Solana. Fair launch, sem pre-mine. 979.8M fixed supply.', teamTransparency: 'anonymous', teamNote: 'Time anônimo. Projeto comunitário sem liderança identificável.' },
  'brett-2': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, note: 'Memecoin — Based Brett (Base chain). Personagem do Boy\'s Club (mesmo autor do Pepe). Fair launch na Base. 10B fixed supply.', teamTransparency: 'anonymous', teamNote: 'Time anônimo. Memecoin na Base chain sem fundadores públicos.' },
  'pudgy-penguins': { team: 17, investors: 10, community: 73, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 0, teamTransparency: 'high', note: 'PENGU — token oficial dos Pudgy Penguins (NFT brand). Lançado via airdrop para holders de NFTs e comunidades Solana/Ethereum. 88.88B supply. 17% para time/company com vesting, 10% para investors. Igloo Inc (Luca Netz) por trás do projeto. Expansão para Abstract chain (L2 Ethereum). Forte IP brand com licenciamento (Walmart, estúdios). Caso raro de marca NFT que transcendeu para mainstream.', teamNote: 'Luca Netz (CEO, Igloo Inc) é público. Equipe identificada e ativa. Empresa americana.' },
  'siren-2': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'anonymous', note: 'SIREN — memecoin na BNB Chain. Lançado via four.meme (plataforma de memecoins BNB). 1B supply. Sem alocação de time identificada.', teamNote: 'Time anônimo. Projeto comunitário na BNB Chain.' },
  // ── The Open Network ──────────────────────────────────────────────────────
  'the-open-network': { team: 0, investors: 5, community: 75, treasury: 20, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: true, vestingYears: 3, treasuryUSD: 500000000, note: 'TON — criado pelo Telegram (Pavel Durov), abandonado após pressão da SEC (2020), relançado pela comunidade. TON Foundation controla ~20% do supply para ecosystem grants. Crescimento real via integração com Telegram (900M+ usuários). Durov foi preso na França (2024), gerando risco regulatório. Adoção real é o maior diferencial, mas centralização via Telegram é preocupação estrutural.', teamTransparency: 'medium', teamNote: 'Pavel Durov (Telegram) é a influência dominante mas tecnicamente a TON Foundation é separada. Durov foi preso na França em agosto 2024, aumentando risco regulatório.' },
  // ── DeFi Layer ─────────────────────────────────────────────────────────────
  'uniswap': { team: 17, investors: 18, community: 43, treasury: 22, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 2000000000, note: 'DAO treasury $2B+. v3 protocol fee switch not enabled at launch. Largest DEX by volume.', teamTransparency: 'high', teamNote: 'Hayden Adams (fundador) é público e verificável. Uniswap Labs tem equipe amplamente identificada e histórico verificável no GitHub.' },
  'aave': { team: 13, investors: 7, community: 47, treasury: 23, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 400000000, note: 'Safety Module staking for protocol risk cover. Ecosystem Reserve funds grants.' },
  'chainlink': { team: 30, investors: 5, community: 35, treasury: 30, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 600000000, note: 'SmartCon Foundation controls 35% node operator reserves. Staking v0.2 live. Oracle leader.', teamTransparency: 'high', teamNote: 'Sergey Nazarov (co-fundador) é público e verificável. Chainlink Labs tem equipe amplamente identificada e histórico verificável.' },
  'maker': { team: 10, investors: 10, community: 50, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: true, verifiedFeeBurn: true, neededToUse: true, vestingYears: 0, treasuryUSD: 8000000000, note: 'DAI stablecoin issuer. MKR burns via stability fee revenue. Protocol surplus ~$8B+. ✅ Verified massive burn: when MakerDAO generates surplus revenue, MKR is bought back and burned on-chain — burns worth millions verified since inception.' },
  'curve-dao-token': { dataQuality: 'verified', team: 10, investors: 5, community: 62, treasury: 3, stakingAvailable: true, hasVeTokenomics: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 4, treasuryUSD: 100000000, note: 'veCRV locking (4 year max) for governance. bribe economy around gauge voting. DEX stablecoin specialist.', sources: [{ label: 'Curve Tokenomics', url: 'https://resources.curve.fi/crv-token/overview' }] },
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
  'wormhole': { team: 12, investors: 17, community: 47, treasury: 24, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 150000000, weakValueAccrual: true, note: 'W — Cross-chain messaging protocol. ~47% to community via airdrop and ecosystem grants. ⚠️ Weak value accrual: Wormhole bridge is widely used but W token is pure governance — protocol usage does NOT require holding W. Similar to ATOM/IBC problem — infrastructure succeeds, token holders don\'t capture value directly.' },
  'hyperliquid': { launchYear: 2024, innovationLevel: 'major', team: 24, investors: 0, community: 76, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, verifiedFeeBurn: true, neededToUse: true, vestingYears: 4, treasuryUSD: 200000000, note: 'HYPE — L1 blockchain completo. HyperBFT consensus (0.2s latência). HyperCore (perp DEX nativa) + HyperEVM (smart contracts EVM-compatible). HYPE = gas token HyperEVM + fee burn + staking. Maior airdrop sem VC da história (76% comunidade). Zero investidores externos. ~$500M+ revenue do protocolo.', teamTransparency: 'medium', teamNote: 'Jeff Yan (fundador) usa pseudônimo mas tem reputação forte. Time pseudônimo com histórico de execução técnica verificável pelo produto.' },
  'filecoin': { team: 15, investors: 10, community: 70, treasury: 5, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 6, treasuryUSD: 50000000, note: 'FIL — Required to pay for decentralized storage. 6-year vesting for team. Protocol Labs controls 15%.' },
  'blockstack': { team: 30, investors: 25, community: 45, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 50000000, note: 'STX — Stacks blockchain; BTC-anchored smart contracts. "Stacking" earns BTC rewards. High insider share.' },
  // ── Oracle / Infrastructure ───────────────────────────────────────────────
  'pyth-network': { team: 22, investors: 26, community: 52, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 50000000, note: 'PYTH — High-frequency oracle for DeFi. Publishers stake PYTH for data integrity. Solana-native, multi-chain.' },
  // ── Governance/DAO tokens ─────────────────────────────────────────────────
  'ethereum-name-service': { team: 19, investors: 0, community: 75, treasury: 6, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 500000000, note: 'ENS — 25% airdrop to .eth holders, 50% DAO treasury. No VC investors. ENS DAO controls protocol.' },
  // ── DeFi Yield / veTokenomics ─────────────────────────────────────────────
  'pendle': {
    team: 22, investors: 7, community: 54, treasury: 17,
    stakingAvailable: true, hasVeTokenomics: true, governancePower: true, feeBurning: false,
    neededToUse: false, vestingYears: 2, treasuryUSD: 60000000,
    dataQuality: 'verified',
    note: 'PENDLE — Protocolo de yield tokenization. Distribuição no TGE (jun/2021): Time/advisors 22%, Seed 7%, Ecosystem 54%, Liquidez 17%. veTokenomics robusto: lock PENDLE por até 2 anos → vePENDLE recebe 80% das fees de yield dos pools votados + 3% dos swaps. Receita real distribuída diretamente aos holders. Supply total: ~258M com emissões declinantes (curva similar à CRV). Maior protocolo de fixed-rate yield em DeFi com $5B+ TVL.',
    teamTransparency: 'high',
    teamNote: 'TN Lee (fundador) e time são públicos no Twitter/LinkedIn. Time com histórico sólido no DeFi. Desenvolvimento consistente desde 2021.',
    sources: [
      { label: 'Pendle Docs — Tokenomics', url: 'https://docs.pendle.finance/ProtocolMechanics/Tokenomics' },
      { label: 'Pendle Finance', url: 'https://www.pendle.finance' },
    ],
  },
  'ethena': {
    team: 30, investors: 25, community: 30, treasury: 15,
    stakingAvailable: true, governancePower: true, feeBurning: false,
    neededToUse: false, vestingYears: 4, treasuryUSD: 200000000,
    weakValueAccrual: true,
    note: 'ENA — Token de governança da Ethena. USDe é o stablecoin sintético lastreado em hedge delta-neutral (ETH staking yield + short perp funding). sUSDe gera yield REAL mas esse yield vai para holders de sUSDe, NÃO para holders de ENA. ENA tem governança mas captura de valor fraca. Alto insider: 55% (time 30% + investors 25% — a16z, Binance Labs, Dragonfly). Risco estrutural: funding rates negativos em bear market destroem o modelo de yield. ENA stake periódico (seasons) dá rewards mas não é compartilhamento permanente de revenue.',
    teamTransparency: 'high',
    teamNote: 'Guy Young (fundador) e equipe são públicos. Respaldados por a16z, Binance Labs, Dragonfly. Time com credenciais verificáveis no TradFi e DeFi.',
    sources: [
      { label: 'Ethena Docs — Tokenomics', url: 'https://docs.ethena.fi/token/ena-token' },
      { label: 'Ethena Labs', url: 'https://www.ethena.fi' },
    ],
  },
  // ── DeFi Derivatives ──────────────────────────────────────────────────────
  'blur': { team: 15, investors: 14, community: 60, treasury: 11, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 50000000, note: 'BLUR — NFT marketplace token. 60% community incentive airdrops. Trading rewards drove initial adoption.' },
  'jupiter-exchange-solana': { team: 50, investors: 10, community: 40, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 100000000, note: 'JUP — Solana DEX aggregator. 40% community (airdrop series). High team allocation (50%).' },
  // ── Gaming / Metaverse ────────────────────────────────────────────────────
  'decentraland': { team: 20, investors: 20, community: 40, treasury: 20, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 100000000, note: 'MANA — Virtual world governance. Decentraland Foundation controls treasury. Low active user base concern.' },
  'the-sandbox': { team: 12, investors: 26, community: 27, treasury: 29, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 150000000, note: 'SAND — Animoca Brands-backed metaverse. High VC allocation. SAND used for LAND purchases & staking.' },
  'axie-infinity': { team: 21, investors: 29, community: 40, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 3, treasuryUSD: 100000000, note: 'AXS — Axie Infinity governance/staking. Sky Mavis breach (Ronin bridge $625M hack 2022). Play-to-earn pioneer.' },
  'gala': { team: 50, investors: 0, community: 50, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 50000000, centralizedControl: true, controlledPct: 50, executionRisk: true, note: 'GALA — Gala Games token. 50% controlled by founder nodes. 🚨 Em 2023: Peter Murray (co-fundador) mintou 8.6B tokens não autorizados avaliados em ~$200M antes da Gala recuperar. Processo judicial entre co-fundadores. Inflação via node rewards é estruturalmente alta e sem controle claro. Gaming prometido não entregou ecossistema relevante.', teamTransparency: 'low', teamNote: 'Eric Schiermeyer e Peter Murray (co-fundadores) em processo judicial. Escândalo do mint não autorizado em 2023 destruiu credibilidade do time.' },
  // ── Sports/Fan tokens ─────────────────────────────────────────────────────
  'chiliz': { team: 20, investors: 20, community: 40, treasury: 20, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'CHZ — Sports fan engagement. Powers Socios.com fan tokens for football clubs (PSG, Barça, etc.).' },
  // ── EVM DeFi ecosystem ────────────────────────────────────────────────────
  'fantom': { team: 15, investors: 18, community: 55, treasury: 12, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 100000000, note: 'FTM — Rebranding to Sonic (S). High-performance PoS DAG chain. André Cronje DeFi ecosystem.' },

  // ── Privacy Coins ─────────────────────────────────────────────────────────
  'monero': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'anonymous', note: 'XMR — única privacy coin com privacidade obrigatória por padrão (RingCT + Stealth Addresses + Bulletproofs). Fair launch sem pré-mine nem ICO. Tail emission: 0.6 XMR/bloco para sempre após o cap de 18.4M, garantindo incentivo eterno a mineradores. PoW resistente a ASICs (RandomX). ⚠️ Regulatório: removido de Binance, Kraken UK, OKX por pressão regulatória. DEA e FBI com capacidade de rastreamento limitada. Projeto 100% descentralizado e comunitário — nenhuma fundação ou empresa central.', teamNote: 'Time completamente anônimo. Riccardo Spagni ("fluffypony") foi contribuidor público por anos mas se distanciou. Projeto governado por consenso de pesquisadores e desenvolvedores anônimos.' },

  // ── Exchange Tokens ───────────────────────────────────────────────────────
  'leo-token': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', note: 'LEO — token de utilidade da Bitfinex/iFinex. Lançado em 2019 para compensar perda de $850M congelados pela Crypto Capital. 100% do supply vendido no TGE (sem lock-up de time). 27% da receita líquida da Bitfinex usada para buyback+burn mensal. ⚠️ Bitfinex e Tether (mesma empresa iFinex) têm histórico controverso: acordo de $18.5M com NYAG, $41M com CFTC. Alta dependência do volume da Bitfinex.', teamNote: 'iFinex Inc (operadora da Bitfinex) controla o projeto. Jean-Louis van der Velde (CEO Tether) e Giancarlo Devasini são influências dominantes mas pouco públicos. Equipe majoritariamente anônima.' },
  'whitebit': { team: 25, investors: 15, community: 40, treasury: 20, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 50000000, teamTransparency: 'low', note: 'WBT — token nativo da exchange WhiteBIT (fundada 2018, Ucrânia). Desconto em taxas de trading, acesso a IEOs, staking com yield. Supply: 400M max, ~213M circulando. ⚠️ Exchange sem regulação nos EUA, auditoria de reservas limitada. Time majoritariamente anônimo. Crescimento via promoções agressivas.', teamNote: 'Equipe da WhiteBIT majoritariamente anônima. Sem fundadores públicos de destaque. Exchange ucraniana com foco no mercado europeu.' },
  'okb': { team: 30, investors: 0, community: 55, treasury: 15, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 100000000, teamTransparency: 'medium', centralizedControl: true, note: 'OKB — token da OKX (antiga OKEx). 300M supply total. Queima trimestral via 10% da receita da OKX. Desconto em taxas, acesso a launchpad, staking. ⚠️ Star Xu (fundador OKX) ficou incontactável por semanas em 2020 causando pânico no mercado. OKX saiu dos EUA em 2022. Concentração: OKX controla 30% do supply.', teamNote: 'Star Xu fundou a OKCoin/OKX em 2013. Episódio de desaparecimento de 2020 é ponto negativo. Empresa registrada em Seychelles.' },
  'bitget-token': { team: 20, investors: 0, community: 55, treasury: 25, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 2, treasuryUSD: 80000000, teamTransparency: 'medium', note: 'BGB — token nativo da Bitget, exchange especializada em copy trading. 2B total supply. Queima trimestral de 20% dos lucros. Desconto em taxas, acesso a launchpad. Gracy Chen (CEO) é pública e ativa. Crescimento forte em 2023-2024. ⚠️ Concentração insider: time controla 20%. Exchange opera fora dos EUA.', teamNote: 'Gracy Chen (CEO) é a face pública da Bitget, ativa no Twitter/X. Empresa registrada nas Seychelles. Time com background em TradFi e exchanges.' },
  'htx-dao': { team: 40, investors: 0, community: 60, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, controlledPct: 40, note: 'HTX — token da HTX (ex-Huobi Token, rebrand de 2023). Justin Sun assumiu controle da Huobi em 2022 e rebranded para HTX. ⚠️ Justin Sun (dono do TRON) agora controla HTX + TRX + USDD — concentração de poder extrema em único ator controverso. Sun enfrenta processo ativo da SEC (acusação de manipulação de mercado e fraude). Risco regulatório e de concentração MÁXIMO.', teamNote: 'Justin Sun é o controlador efetivo da HTX desde 2022. Nadia Alvarez como porta-voz pública. Fundadores originais da Huobi (Leon Li) saíram após a venda.' },
  'gatechain-token': { team: 30, investors: 0, community: 55, treasury: 15, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 1, treasuryUSD: 80000000, teamTransparency: 'medium', note: 'GT — token nativo da Gate.io (fundada 2013 por Lin Han). 300M supply total. Queima trimestral via receita. Desconto em taxas, VaultX staking, acesso a Gate Startup (launchpad). Gate.io é exchange de reputação sólida com 10+ anos de histórico. ⚠️ Concentração insider: 30% ao time. Opera fora dos EUA.', teamNote: 'Lin Han fundou a Gate.io em 2013. É relativamente público no setor. Exchange com sede nas Ilhas Cayman, servidores distribuídos globalmente.' },
  'kucoin-shares': { team: 15, investors: 0, community: 85, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', note: 'KCS — KuCoin Shares. 200M total supply (burn para 100M planejado). Revenue share REAL: 50% das taxas diárias distribuídas diariamente a holders (KuCoin Bonus). ⚠️ RISCO REGULATÓRIO CRÍTICO: em 2023 o DOJ americano indiciou KuCoin e seus fundadores por lavagem de dinheiro (+$1B). CEO Johnny Lyu enfrenta processo criminal. KuCoin pagou $297M de acordo em 2024 e saiu dos EUA. Alta incerteza operacional.', teamNote: 'Johnny Lyu (CEO) e Michael Gan (co-fundador) enfrentam processo criminal no DOJ americano. Exchange registrada em Seychelles, operou sem KYC por anos.' },
  'nexo': { team: 0, investors: 30, community: 70, treasury: 0, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'NEXO — token da plataforma de empréstimo CeFi Nexo. 1B supply fixo, 100% circulando desde o TGE. Holders recebem 30% dos lucros líquidos como dividendo diário + dividendos em espécie anuais. ⚠️ Regulatório: SEC abriu processo em 2023 (securities não registrados). Nexo encerrou operações nos EUA em Jan 2023 e pagou $45M de acordo. Modelo CeFi centralizado — risco similar ao Celsius/BlockFi. Antoni Trenchev (co-CEO) é público.', teamNote: 'Antoni Trenchev e Kosta Kantchev co-fundaram Nexo (2018). Ambos públicos. Empresa registrada nas Ilhas Cayman. Processo SEC encerrado com acordo.' },

  // ── AI / Compute Networks ─────────────────────────────────────────────────
  'bittensor': { team: 12, investors: 0, community: 73, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 100000000, teamTransparency: 'medium', note: 'TAO — rede descentralizada de inteligência artificial. Supply máximo: 21M (como Bitcoin). Mineradores são modelos de ML que competem em subnets especializadas, recompensados em TAO proporcional à qualidade. Subnets permitem ecossistemas especializados (texto, imagem, análise financeira). ⚠️ Alta especulação: valuação depende de AI descentralizada se tornar relevante vs BigTech. Jacob Steeves (co-fundador) saiu em 2024. Complexidade técnica extrema. Risco de rug em subnets individuais.', teamNote: 'Jacob Steeves e Ala Shaabana co-fundaram. Opentensor Foundation lidera. Steeves saiu em 2024. Time com background em ML/AI acadêmico.' },
  'render-token': { team: 15, investors: 10, community: 60, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 50000000, teamTransparency: 'high', note: 'RENDER — rede descentralizada de GPU para rendering 3D e AI. OTOY Inc (Jules Urbach) é a empresa por trás, com clientes reais em Hollywood (render para filmes e jogos). Migrou de Ethereum para Solana em 2023. Modelo real: criadores pagam RENDER por GPU, nodes recebem RENDER. ⚠️ Concorrência crescente: Akash, Io.net, Aethir.', teamNote: 'Jules Urbach (fundador OTOY e Render) é público e verificável. OTOY tem histórico de 15+ anos em rendering software para Hollywood.' },

  // ── New L1 / L2 (top-100 expansion) ──────────────────────────────────────
  'mantle': { team: 20, investors: 0, community: 40, treasury: 40, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 3000000000, teamTransparency: 'medium', note: 'MNT — token nativo da Mantle Network, L2 Ethereum modular sucessora da BitDAO. Treasury GIGANTE (~$3B em vários ativos cripto). Principal backer: Bybit (exchange top-5). MNT usado como gas na Mantle Network. ⚠️ Competição intensa com Arbitrum, Optimism, Base — Mantle ainda muito atrás em TVL. Influência centralizada do Bybit na governance.', teamNote: 'Mantle é projeto comunitário successor da BitDAO. Bybit (Ben Zhou, CEO) é principal patrocinador. Time de desenvolvimento público mas governance efetiva via Bybit/DAO.' },
  'polygon-ecosystem-token': { team: 19, investors: 5, community: 56, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 300000000, teamTransparency: 'high', note: 'POL — substituiu MATIC como token nativo do ecossistema Polygon em setembro 2023 (migração 1:1). Principal inovação: validadores podem validar múltiplas chains do AggLayer com o mesmo stake de POL (restaking multichain). EIP-1559 burn nas transações da Polygon PoS. AggLayer é aposta estratégica para unificar ZK scaling. ⚠️ Competição intensa com Arbitrum, Optimism, Base.', teamNote: 'Sandeep Nailwal e Jaynti Kanani co-fundaram Polygon. Equipe amplamente identificada. Polygon Labs é empresa americana com estrutura transparente.' },
  'flare-networks': { team: 20, investors: 5, community: 55, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 100000000, teamTransparency: 'medium', weakValueAccrual: true, note: 'FLR — L1 EVM-compatible focada em dados e interoperabilidade. FTSO (Flare Time Series Oracle) fornece preços descentralizados. State Connector conecta chains. ⚠️ Prometeu ser a chain de XRP, Algorand e DOGE mas adoção real foi modesta. FlareDrop distribuiu tokens gradualmente após airdrop de 2023. Captura de valor fraca: delegates para FTSO providers geram rewards modestos. Avaliação alta para adoção real baixa.', teamNote: 'Hugo Philion (CEO) e Sean Rowan co-fundaram. Time com background em academia e TradFi. Flare Networks Ltd registrada nas Ilhas Cayman.' },
  'kaspa': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'anonymous', note: 'KAS — implementação pioneira de blockDAG (GHOSTDAG/DAGKNIGHT) — o maior avanço técnico em PoW desde Bitcoin. Permite blocos paralelos sem sacrificar segurança, aumentando throughput e velocidade. Fair launch total: sem pré-mine, sem ICO, sem alocação de time. Emissão deflacionária com halvings cromáticos mensais. ⚠️ Smart contracts ainda em desenvolvimento (testnet). Projeto 100% comunitário.', teamNote: 'Time majoritariamente anônimo. Yonatan Sompolinsky (pesquisador acadêmico, criador do GHOSTDAG) é o conceitualizador identificável. Nenhuma fundação central ou empresa por trás.' },
  'crypto-com-chain': { team: 30, investors: 5, community: 45, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: true, vestingYears: 2, treasuryUSD: 200000000, teamTransparency: 'medium', centralizedControl: true, controlledPct: 50, note: 'CRO — token nativo da Crypto.com e da Cronos Chain (EVM L1 com Cosmos SDK). Queima trimestral. ⚠️ Crypto.com apostou pesado em marketing: Arena (ex-Staples Center, contrato de $700M), Super Bowl ads, Copa do Mundo. Revenue caiu no bear market de 2022 com demissões massivas. Kris Marszalek (CEO) público mas controverso. Concentração: Crypto.com controla grande reserva de CRO.', teamNote: 'Kris Marszalek (CEO) é público e ativo. Bobby Bao, Gary Or e Rafael Melo co-fundaram. Empresa registrada em Singapura. Acusações de reservas insuficientes em 2022.' },

  // ── RWA / DeFi Infrastructure ─────────────────────────────────────────────
  'ondo-finance': { team: 35, investors: 22, community: 28, treasury: 15, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 5, treasuryUSD: 100000000, teamTransparency: 'high', weakValueAccrual: true, note: 'ONDO — protocolo líder em tokenização de RWA (Real World Assets). Produtos: OUSG (T-bills tokenizados), USDY (yield USD). Fundadores ex-Goldman Sachs. Parceria com BlackRock (BUIDL). ⚠️ Token de governança com captura de valor fraca: protocolo gera receita real mas ONDO holders têm apenas governança, sem dividendos diretos. Alta concentração insider: 57% entre time e VCs. Acesso restrito a investidores qualificados nos EUA.', teamNote: 'Nathan Allman (CEO) e Pinku Surana (CTO) são ex-Goldman Sachs, públicos. Investidores: Pantera, Coinbase, Tiger Global, Founders Fund.' },
  'quant-network': { team: 26, investors: 10, community: 64, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 50000000, teamTransparency: 'high', note: 'QNT — supply ULTRA BAIXO: apenas 14.6M tokens (menor entre os top-100). Overledger é OS de interoperabilidade enterprise — conecta blockchains diferentes sem bridges tradicionais. Clientes: SIA, AIA Group. neededToUse: true (licenças gateway exigem QNT). ⚠️ Modelo B2B enterprise fechado, não DeFi-nativo. Dependência total da adoção corporativa do Overledger.', teamNote: 'Gilbert Verdian (CEO) é público com background verificável em cybersecurity governamental (UK, Austrália). Colin Paterson (CTO). Quant Network Ltd registrada no Reino Unido.' },
  'morpho': { team: 22, investors: 26, community: 52, treasury: 0, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 0, teamTransparency: 'high', weakValueAccrual: true, note: 'MORPHO — protocolo de lending peer-to-peer que otimiza taxas sobre Aave/Compound. Morpho Blue é protocolo standalone mais recente. ~$2B+ TVL. ⚠️ Token de governança puro sem revenue share direto para holders. Alta concentração VC: 48% entre time (22%) e VCs (26%). Apoiado por a16z e Coinbase Ventures.', teamNote: 'Paul Frambot (CEO) ex-Polytechnique, ativo no Twitter/X. Morpho Labs com equipe identificada no LinkedIn. Apoiado por a16z, Coinbase Ventures, Variant.' },

  // ── Identity / Social ─────────────────────────────────────────────────────
  'worldcoin-wld': { team: 25, investors: 17, community: 58, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 10, treasuryUSD: 0, teamTransparency: 'high', centralizedControl: true, controlledPct: 42, note: 'WLD — token de identidade biométrica e UBI. Sam Altman (CEO OpenAI) co-fundou. Escâner de íris (Orb) distribui tokens para humanos verificados (World ID). ⚠️ Privacidade: reguladores em Alemanha, França, Espanha, Kenya, Hong Kong e Brasil investigaram/suspenderam coleta de dados biométricos. Conflito de interesses: Sam Altman controla OpenAI E a Tools for Humanity que emite WLD. 83% do supply com insiders por 10 anos.', teamNote: 'Sam Altman (CEO OpenAI) é co-fundador. Alex Blania (CEO Tools for Humanity) é CEO operacional. Investidores: a16z, Khosla Ventures. Time com background em MIT e Stanford.' },
  'pi-network': { team: 20, investors: 0, community: 50, treasury: 30, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 0, teamTransparency: 'medium', centralizedControl: true, controlledPct: 50, executionRisk: true, note: 'PI — rede de mineração mobile em mainnet desde dez/2024. Fundada em 2019 por Nicolas Kokkalis e Chengdiao Fan (PhDs Stanford). ⚠️ ALTAMENTE CONTROVERSO: (1) Supply total opaco e potencialmente enorme (100B+ tokens, maioria não circulando), (2) Pi Core Team controla migração via whitelist obrigatória, (3) Ecossistema prometido com atraso significativo, (4) Volume suspeito no lançamento concentrado em exchanges asiáticas, (5) Sem DeFi real. Muitos analistas consideram projeto de coleta de dados mascarado de cripto.', teamNote: 'Nicolas Kokkalis (CTO/co-fundador) e Chengdiao Fan (CEO/co-fundador) são PhDs de Stanford, públicos. Pi Core Team (PCT) controla efetivamente todo o protocolo.' },

  // ── MakerDAO / Sky Ecosystem ──────────────────────────────────────────────
  'usds': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'USDS — stablecoin do protocolo Sky (rebrand do MakerDAO em 2024). Tecnicamente similar ao DAI com melhorias. SSR (Sky Savings Rate) oferece yield nativo. Upgrade voluntário: DAI → USDS. Colateral: ETH, wBTC e crescente RWA (T-bills via Ondo/Monetalis). Descentralizada por design mas com dependência crescente de RWA centralizados como colateral.', teamNote: 'Sky (ex-MakerDAO) tem governança on-chain. Rune Christensen (fundador) liderou o rebrand. Time identificável com histórico sólido de 7+ anos.' },
  'sky': { team: 10, investors: 10, community: 50, treasury: 30, stakingAvailable: true, governancePower: true, feeBurning: true, neededToUse: false, vestingYears: 0, treasuryUSD: 500000000, teamTransparency: 'high', note: 'SKY — token de governança do protocolo Sky (rebrand do MakerDAO em 2024). Substituiu MKR na proporção 1 MKR = 24,000 SKY. Ambos coexistem na transição. Queima de stability fees (mecanismo similar ao MKR). Protocolo com 7+ anos de histórico sólido, gera receita real. ⚠️ Comunidade dividida sobre o rebrand. Rune Christensen lidera a visão "Endgame".', teamNote: 'Rune Christensen (fundador) lidera. MakerDAO Foundation dissolvida em 2021 — protocolo 100% on-chain DAO. Time identificado mas sem empresa central.' },

  // ── Stablecoins (top-100 expansion) ──────────────────────────────────────
  'ethena-usde': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'USDe — dólar sintético da Ethena (não stablecoin clássica). Hedge delta-neutral: long ETH staking + short perp position. sUSDe gera yield via (1) ETH staking yield + (2) funding rates de perps (positivos em bull market). ⚠️ RISCO ESTRUTURAL: funding rates ficam negativos em bear market — colateral pode não cobrir o peg. Similar ao modelo que levou UST/Terra ao colapso (porém com hedge real). Cresceu para $6B+ sem passar por bear market severo ainda.', teamNote: 'Guy Young (fundador) e equipe são públicos. Apoiado por a16z, Binance Labs, Dragonfly. Time com background em TradFi e DeFi.' },
  'paypal-usd': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'PYUSD — stablecoin do PayPal, emitida pela Paxos (regulada pela NYDFS). 100% lastreada em USD/Treasuries. Attestações mensais. Integrada no app PayPal/Venmo (430M+ usuários). ⚠️ Adoção lenta apesar da distribuição: usuários do PayPal não são cripto-nativos. Centralizada: Paxos pode congelar/queimar tokens por compliance. Potencial de crescimento enorme se PayPal aprofundar integração cripto.', teamNote: 'PayPal (Nasdaq: PYPL) é emissor. Paxos Trust Company (regulada NYDFS) é o issuer técnico. Liderança totalmente pública.' },
  'gho': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'GHO — stablecoin nativa do protocolo Aave. Mintada por usuários depositando colateral (similar ao DAI no MakerDAO). Diferencial: holders de stkAAVE têm desconto nas taxas de GHO. Governado pelo Aave DAO. ⚠️ Crescimento lento — manter o peg foi desafio em períodos de pressão. Menor que DAI/USDS mas com potencial de crescimento via ecossistema Aave.', teamNote: 'Aave DAO controla o protocolo GHO. Stani Kulechov (fundador Aave) é público. GHO Stewards ajudam na gestão de parâmetros.' },
  'usdd': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, note: 'USDD — stablecoin algorítmica do Tron, criada por Justin Sun em 2022 (meses APÓS o colapso da UST/Terra). Lastreada por TRX + reservas mistas no TRON DAO Reserve. ⚠️ ALTO RISCO: (1) Inspirada explicitamente no modelo UST que colapsou, (2) Justin Sun controla efetivamente o TRON DAO Reserve, (3) Yield de 30%+ era insustentável (foi reduzido), (4) Depeg ocorreu em jun/2022 logo após lançamento, recuperou via intervenção manual. Dependência total de Justin Sun.', teamNote: 'Justin Sun controla o TRON DAO Reserve efetivamente. Alta centralização — contrário à proposta de stablecoin descentralizada.' },
  'true-usd': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', note: 'TUSD — stablecoin fiat-backed com attestações em tempo real via Chainlink PoR. ⚠️ Em 2023 a TrustToken (criadora original) vendeu os direitos do TUSD para entidade asiática não identificada. A Binance promoveu agressivamente o TUSD (zero-fee trading) gerando suspeitas de conflito de interesse. Desassociação da TrustToken gerou desconfiança. Menos transparente que USDC. Proprietário atual com identidade obscura.', teamNote: 'TrustToken vendeu os direitos do TUSD em 2023. Proprietário atual é entidade asiática não totalmente identificada publicamente. Alta falta de transparência.' },
  'usd1-wlfi': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, note: 'USD1 — stablecoin do World Liberty Financial (WLFI), projeto DeFi associado a Donald Trump e família. Lastreada 100% em T-bills/USD. Custódia: BitGo. ⚠️ CONFLITO DE INTERESSE POLÍTICO MÁXIMO: Trump é presidente dos EUA enquanto beneficia financeiramente de projeto cripto. Dependente da permanência do governo Trump. Justin Sun investiu $30M em WLFI. Risco político/regulatório extremo. Investigação do Congresso americano em andamento.', teamNote: 'Trump Organization, Eric Trump e Zach Witkoff associados ao projeto. Ação judicial e investigação sobre conflitos de interesse em andamento.' },

  // ── Trump Memecoin ────────────────────────────────────────────────────────
  'official-trump': { team: 80, investors: 0, community: 20, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 3, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, controlledPct: 80, note: 'TRUMP — memecoin presidencial lançado 2 dias antes da posse de Trump (17 jan 2025). 1B supply total; 80% controlado por entidades ligadas a Trump (CIC Digital LLC + Fight Fight Fight LLC) com vesting de 3 anos. ⚠️ RISCO MÁXIMO: (1) 80% nas mãos do time = dumping risk extremo quando vesting expirar, (2) Zero utilidade real, (3) Conflito de interesse político sem precedente — presidente dos EUA lançou ativo especulativo, (4) Pico de ~$75, hoje muito abaixo. Caso clássico de pump-and-dump institucionalizado.', teamNote: 'Entidades afiliadas a Donald Trump (CIC Digital LLC, Fight Fight Fight LLC) controlam 80% do supply. Time técnico anônimo.' },

  // ── Institutional / Permissioned ─────────────────────────────────────────
  'canton-network': { team: 0, investors: 0, community: 30, treasury: 70, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, controlledPct: 70, note: 'CC — blockchain permissionada para finanças institucionais. Participantes: Goldman Sachs, BNY Mellon, Deutsche Boerse, Cboe, Deloitte. Construída em Daml (linguagem de contratos financeiros da Digital Asset). ⚠️ Modelo permissionado: contrário à filosofia descentralizada do crypto. CC token no top-100 por market cap com volume diário MUITO baixo (liquidez questionável). Participação exige aprovação institucional. Valorização especulativa em relação à adoção real.', teamNote: 'Digital Asset (Yuval Rooz, CEO) é a empresa por trás. Participantes institucionais (Goldman, BNY Mellon) são consultivos, não operadores do token.' },

  // ── RWA / Tokenized Debt (new top-100 April 2026) ────────────────────────
  'figure-heloc': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', centralizedControl: true, controlledPct: 100, note: 'FIGR_HELOC — token de dívida institucional na Provenance Blockchain. Figure Connect e Figure Markets transformam como empréstimos (HELOCs) são originados, negociados e liquidados on-chain. Supply: ~16.3B tokens. ⚠️ Não é cripto tradicional: é ativo institucional tokenizado. Valor derivado de home equity loans reais dos EUA. Volume diário baixo (~$100M). Modelo permissionado — participação via Figure Markets.', teamNote: 'Figure Technologies (Mike Cagney, CEO) é a empresa por trás. Cagney é ex-CEO da SoFi. Empresa americana regulada.' },
  'hashnote-usyc': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'USYC — token de T-bills tokenizados da Hashnote. Yield direto de US Treasuries para investidores qualificados. Produto RWA institucional regulado. Não é cripto especulativo — é produto de investimento tokenizado.', teamNote: 'Hashnote é subsidiária da Cumberland/DRW. Equipe de TradFi institucional. SEC-registered.' },
  'blackrock-usd-institutional-digital-liquidity-fund': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'BUIDL — BlackRock USD Institutional Digital Liquidity Fund tokenizado via Securitize. 100% em T-bills e repos. Produto institucional — não é cripto especulativo. Primeiro fundo tokenizado da maior gestora do mundo ($10T+ AUM).', teamNote: 'BlackRock (Larry Fink, CEO) é a maior gestora de ativos do mundo. Securitize é o parceiro de tokenização. Máxima credibilidade institucional.' },
  'ondo-us-dollar-yield': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'USDY — yield-bearing stablecoin da Ondo Finance. Lastreada em T-bills tokenizados. Diferente do token ONDO (governança), USDY é produto de yield para holders. Disponível em Solana, Ethereum, Mantle.', teamNote: 'Ondo Finance (Nathan Allman, CEO). Ex-Goldman Sachs. Apoiado por Pantera, Coinbase Ventures.' },
  'ripple-usd': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'RLUSD — stablecoin emitida pela Ripple. 100% lastreada em USD deposits e T-bills. Attestações mensais. Aprovada pela NYDFS (New York Department of Financial Services). Compete com USDC e USDT no ecossistema XRP Ledger e Ethereum.', teamNote: 'Ripple Labs (Brad Garlinghouse, CEO) é o emissor. Empresa americana regulada. NYDFS-approved.' },
  'janus-henderson-anemoy-treasury-fund': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'JTRSY — fundo de T-bills tokenizado pela Janus Henderson via Anemoy/Centrifuge. Produto RWA institucional. Janus Henderson é gestora com $350B+ AUM.', teamNote: 'Janus Henderson Investors é gestora regulada nos EUA/UK. Anemoy é plataforma de tokenização via Centrifuge.' },
  'falcon-finance': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'USDF — stablecoin sintética da Falcon Finance. Modelo similar ao USDe da Ethena (delta-neutral hedge). Yield via staking + funding rates. ⚠️ Mesmo risco estrutural: funding rates negativos em bear market.', teamNote: 'Falcon Finance equipe com background em DeFi. Menos histórico que Ethena.' },
  'global-dollar': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'USDG — stablecoin global. Fiat-backed.', teamNote: 'Equipe com background em finanças.' },
  'bfusd': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'BFUSD — yield-bearing stablecoin da Binance. Reward de staking automatizado. Custódia centralizada pela Binance.', teamNote: 'Binance é a maior exchange do mundo. Richard Teng (CEO).' },
  'ousg': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'OUSG — Ondo Short-Term US Government Treasuries. Tokenização de T-bills para investidores qualificados. Produto RWA da Ondo Finance.', teamNote: 'Ondo Finance. Nathan Allman (CEO), ex-Goldman Sachs.' },
  'superstate-short-duration-us-government-securities-fund-ustb': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'USTB — Superstate Short Duration US Government Securities Fund tokenizado. SEC-registered fund. Robert Leshner (fundador Compound) é co-fundador da Superstate.', teamNote: 'Robert Leshner (ex-Compound) e equipe com background em DeFi + TradFi. SEC-registered.' },
  'usdtb': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'USDtb — stablecoin yield-bearing. Lastreada em T-bills tokenizados.', teamNote: 'Equipe com background em finanças institucionais.' },
  'eutbl': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'EUTBL — European Treasury Bills tokenizados. Produto RWA focado em dívida soberana europeia.', teamNote: 'Equipe institucional europeia.' },
  'ylds': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'YLDS — yield-bearing stablecoin. Produto RWA com rendimento de T-bills.', teamNote: 'Equipe institucional.' },
  'stable-2': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'STABLE — stablecoin. Fiat-backed.', teamNote: 'Equipe com background em finanças.' },
  'usual-usd': { team: 5, investors: 5, community: 90, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 2, treasuryUSD: 0, teamTransparency: 'high', note: 'USD0 — stablecoin da Usual Protocol. 100% lastreada em T-bills/RWA. Diferencial: token de governança USUAL tem 90% distribuído para a comunidade. USD0++ oferece yield via staking. Modelo inovador de redistribuição de valor.', teamNote: 'Equipe francesa. Pierre Person (co-fundador) é ex-político francês. Apoiado por IOSG, Morpho.' },
  'united-stables': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'medium', note: 'U — stablecoin algorítmica/sintética. 1:1 peg ao USD. Mecanismo de estabilização via arbitragem. MC acima de $1B. ⚠️ Modelo similar a stablecoins algorítmicas requer monitoramento do colateral.', teamNote: 'Equipe parcialmente identificada.' },

  // ── New top-100 tokens (April 2026) ──────────────────────────────────────
  'world-liberty-financial': { team: 75, investors: 0, community: 25, treasury: 0, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', centralizedControl: true, controlledPct: 75, note: 'WLFI — token de governança do World Liberty Financial, projeto DeFi associado a Donald Trump. ⚠️ CONFLITO DE INTERESSE POLÍTICO MÁXIMO. Trump é presidente dos EUA enquanto família lucra com tokens. WLFI não é tradável publicamente — comprado via private sale. Justin Sun investiu $30M. Alta concentração: ~75% com insiders. Investigação do Congresso americano em andamento.', teamNote: 'Trump Organization, Eric Trump, Zach Witkoff associados. Processo e investigação sobre conflitos de interesse.' },
  'memecore': { team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'anonymous', note: 'M — Memecore token. Memecoin. Fair launch, sem alocação de time. Supply fixo.', teamNote: 'Time anônimo. Projeto comunitário.' },
  'rain': { team: 15, investors: 20, community: 55, treasury: 10, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 3, treasuryUSD: 50000000, teamTransparency: 'medium', note: 'RAIN — token com foco em payments e DeFi. Crescimento rápido no market cap em 2026.', teamNote: 'Equipe parcialmente pública. Background em fintech.' },
  'blockchain-capital': { team: 0, investors: 100, community: 0, treasury: 0, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', centralizedControl: true, controlledPct: 100, note: 'BCAP — security token da Blockchain Capital (fundo de VC cripto). Não é token cripto tradicional — representa participação no fundo de venture capital. Supply: 10M tokens. Blockchain Capital investe em early-stage cripto desde 2013 (Coinbase, Kraken, Aave, etc). ⚠️ Não é tradável livremente: security token com restrições KYC/AML. Performance depende do portfólio de VC.', teamNote: 'Blockchain Capital (Bart Stephens, Brad Stephens, fundadores). Empresa americana registrada. SEC-registered security token.' },
  'tether-gold': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'low', note: 'XAUt — ouro tokenizado pela Tether. Cada token = 1 troy ounce de ouro físico custodiado em cofres na Suíça. ⚠️ Mesma empresa controversa do USDT (iFinex/Tether Ltd). Reservas de ouro sem auditorias independentes completas.', teamNote: 'Tether Ltd. (iFinex). Mesma empresa do USDT. Transparência limitada.' },
  'pax-gold': { team: 0, investors: 0, community: 0, treasury: 100, stakingAvailable: false, governancePower: false, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'high', note: 'PAXG — ouro tokenizado pela Paxos Trust Company. 1 token = 1 troy ounce de ouro físico custodiado em cofres Brink/LBMA em Londres. ✅ Regulada pela NYDFS. Attestações mensais. Melhor transparência que XAUt.', teamNote: 'Paxos Trust Company. Regulada NYDFS. Charles Cascarilla (CEO) é público e verificável.' },
  'aster-2': { team: 25, investors: 15, community: 40, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 100000000, teamTransparency: 'high', note: 'ASTER — rebrand de Astar Network. L1/L2 multi-chain japonesa (polkadot parachain + zkEVM). Sota Watanabe (fundador) é público. Foco no mercado japonês/asiático. Suporte da Sony, Toyota ventures.', teamNote: 'Sota Watanabe (CEO) é público e ativo. Equipe japonesa com suporte de corporações japonesas.' },
  'fetch-ai': { launchYear: 2019, innovationLevel: 'major', team: 20, investors: 15, community: 50, treasury: 15, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 200000000, teamTransparency: 'high', note: 'FET — Artificial Superintelligence Alliance (ASI). Merger de Fetch.ai + SingularityNET (AGIX) + Ocean Protocol (OCEAN) em jul/2024 → token unificado ASI/FET. Rede de agentes AI autônomos para automação e economia de dados. Humayun Sheikh (CEO Fetch.ai) lidera. ⚠️ O merge triplicou o supply. Execução real de AI descentralizada ainda em estágio inicial vs promessas.', teamNote: 'Humayun Sheikh (CEO Fetch.ai), Ben Goertzel (SingularityNET), Trent McConaghy (Ocean Protocol) — todos públicos e com background acadêmico/AI sólido.' },
  'layerzero': { launchYear: 2024, innovationLevel: 'major', team: 25, investors: 23, community: 38, treasury: 14, stakingAvailable: false, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 4, treasuryUSD: 200000000, weakValueAccrual: true, teamTransparency: 'high', note: 'ZRO — protocolo de mensageria cross-chain (omnichain). Infraestrutura usada por 80+ chains. Airdrop: 8.5% ao TGE, 15.3% futuras distribuições, 14.5% grants. ⚠️ Alta concentração insider: ~48% (team 25% + VCs 23%). Token de governança — protocolo NÃO requer ZRO para funcionar, captura de valor fraca similar ao W (Wormhole). Investidores: a16z, Sequoia, Samsung.', teamNote: 'Bryan Pellegrino (CEO) é público. LayerZero Labs equipe verificável. Investidores tier-1: a16z, Sequoia.' },
  'pancakeswap-token': { launchYear: 2020, innovationLevel: 'incremental', team: 0, investors: 0, community: 100, treasury: 0, stakingAvailable: true, governancePower: true, feeBurning: true, verifiedFeeBurn: true, neededToUse: false, vestingYears: 0, treasuryUSD: 0, teamTransparency: 'anonymous', note: 'CAKE — DEX líder na BNB Chain. Hard cap de 400M (reduzido de 450M em jan/2026). Tokenomics 3.0: meta de deflação de ~4%/ano com buy-back-and-burn de receita (trading fees 15-23%, perps 20%, lottery 20%). Burns verificados on-chain. Maior DEX multi-chain por volume fora do Ethereum.', teamNote: 'Time anônimo ("The Chefs"). Pseudônimos. Sem fundadores públicos conhecidos. Alto risco de anonimato para o tamanho do projeto.' },
  'just': { team: 30, investors: 0, community: 60, treasury: 10, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: false, vestingYears: 0, treasuryUSD: 50000000, centralizedControl: true, teamTransparency: 'low', note: 'JST — token de governança do JustLend e JustStable (stablecoin USDJ) no ecossistema TRON. ⚠️ Controlado por Justin Sun (mesmo dono do TRX e HTX). Alta centralização. JST tem utilidade no lending/staking TRON mas está inteiramente no ecossistema Justin Sun.', teamNote: 'Justin Sun é a influência dominante. Equipe JUST majoritariamente anônima sob umbrella TRON/BitTorrent.' },
  'beldex': { team: 10, investors: 5, community: 80, treasury: 5, stakingAvailable: true, governancePower: false, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 20000000, teamTransparency: 'low', note: 'BDX — privacy blockchain com PoS e masternodes. Suite de privacidade: BChat (mensageiro), BelNet (dVPN), Beldex Browser. RingCT e stealth addresses como Monero. Masternode staking com "Infinite Staking" (sem expiração). AI integrada via BeldexAI. ⚠️ Projeto menor com adoção limitada. Time majoritariamente anônimo. Competição direta com Monero e Zcash.', teamNote: 'Equipe majoritariamente anônima. Background indiano/asiático. Sem fundadores públicos de destaque.' },
  'xdce-crowd-sale': { team: 15, investors: 10, community: 55, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 0, treasuryUSD: 100000000, teamTransparency: 'high', note: 'XDC — XDC Network (ex-XinFin). L1 enterprise-focused para trade finance e RWA. EVM-compatible com consensus XDPoS. Parceria com TradeFinex, SBI (banco japonês). Foco em tokenização de faturas e supply chain finance. ⚠️ Adoção enterprise real mas limitada. Competição com Hedera, Canton, Ripple no segmento institucional.', teamNote: 'Ritesh Kakkad e Atul Khekade co-fundaram XinFin em 2017. Equipe pública com background em trade finance. Empresa registrada em Singapura.' },
  'hash-2': { team: 20, investors: 10, community: 50, treasury: 20, stakingAvailable: true, governancePower: true, feeBurning: false, neededToUse: true, vestingYears: 3, treasuryUSD: 50000000, teamTransparency: 'medium', note: 'HASH — Provenance Blockchain. Infraestrutura para RWA e finanças institucionais (Figure Technologies). Supply: 100B. Usado como gas e staking na Provenance. Cresceu com boom de RWA tokenizados (Figure HELOC, etc.).', teamNote: 'Figure Technologies (Mike Cagney, ex-SoFi CEO) é o principal builder. Equipe com background em fintech institucional.' },
};

function getTokenMeta(id: string) {
  return TOKEN_METADATA[id] || null;
}

// ═══════════════════════════════════════════════════════════════
// SCORING V2: New Category Scoring Functions
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate Lindy Effect Score (Network Age / Resilience)
 * Tokens with longer track record have higher probability of future survival
 * @param launchYear - Year the network/token launched
 * @returns Score 0-10
 */
function calculateLindyScore(launchYear: number | undefined): number {
  if (!launchYear) return 0.5; // Unknown launch = assume very new
  
  const currentYear = 2026;
  const yearsLive = currentYear - launchYear;
  
  // Base formula: ~0.67 points per year, capped at 10
  let lindyScore = Math.min(10, yearsLive * 0.67);
  
  // Penalty for very young tokens (<2 years)
  if (yearsLive < 1) lindyScore = Math.min(lindyScore, 2.0);
  else if (yearsLive < 2) lindyScore = Math.min(lindyScore, 4.0);
  
  // Special adjustment: ETH and other dominant L1s get bonus
  // BTC (17y) → 10.0
  // ETH (11y) → 7.4 → adjusted to 9.0 (proven L1 dominance)
  // This adjustment happens in analyzeToken based on token.id
  
  return Math.round(lindyScore * 10) / 10;
}

/**
 * Calculate Network Effect / Adoption Score
 * Real adoption metrics vs promises
 * @param token - Token data from CoinGecko
 * @param meta - Token metadata
 * @returns Score 0-10
 */
function calculateNetworkEffectScore(token: TokenData, meta: any): number {
  // Metrics weighted average approach:
  // - Active addresses (30%)
  // - Transaction count (25%)
  // - Developer activity (20%)
  // - Exchange listings (10%)
  // - Institutional adoption (15%)
  
  let score = 0;
  
  // Developer activity (20% weight) — available from CoinGecko
  const commits = token.developer_data?.commit_count_4_weeks ?? 0;
  let devScore = 0;
  if (commits > 500) devScore = 10;
  else if (commits > 100) devScore = 8;
  else if (commits > 20) devScore = 5;
  else if (commits === 0) devScore = 0;
  else devScore = 3;
  score += devScore * 0.20;
  
  // Active addresses / Transaction count — hardcoded for known tokens
  // BTC: ~1M+ daily addresses, ~300K+ daily tx
  // ETH: ~400K+ daily addresses, ~1.2M+ daily tx
  // SOL: ~5M+ daily addresses, ~30M+ daily tx
  // HYPE: Growing but much lower (~50K addresses)
  const id = token.id;
  let networkScore = 3; // default for unknown tokens
  
  if (id === 'bitcoin') networkScore = 10; // BTC: king of adoption
  else if (id === 'ethereum') networkScore = 9.5;
  else if (id === 'solana') networkScore = 7.5;
  else if (id === 'binancecoin') networkScore = 8;
  else if (id === 'ripple') networkScore = 6;
  else if (id === 'cardano') networkScore = 5;
  else if (id === 'avalanche-2') networkScore = 5;
  else if (id === 'polkadot') networkScore = 4;
  else if (id === 'near') networkScore = 4;
  else if (id === 'hyperliquid') networkScore = 3; // New but growing fast
  else if (token.market_data?.market_cap?.usd && token.market_data.market_cap.usd > 10e9) {
    networkScore = 6; // Top-20 tokens likely have decent adoption
  } else if (token.market_data?.market_cap?.usd && token.market_data.market_cap.usd > 1e9) {
    networkScore = 4;
  }
  
  score += networkScore * 0.55; // Combined weight for addresses (30%) + tx (25%)
  
  // Exchange listings (10%) — inferred from market cap as proxy
  // High market cap tokens are typically listed on all major exchanges
  let exchangeScore = 5; // default
  if (token.market_data?.market_cap?.usd && token.market_data.market_cap.usd > 10e9) {
    exchangeScore = 10; // Top 20 = all major exchanges
  } else if (token.market_data?.market_cap?.usd && token.market_data.market_cap.usd > 1e9) {
    exchangeScore = 7; // Top 100 = most major exchanges
  } else if (token.market_data?.market_cap?.usd && token.market_data.market_cap.usd > 100e6) {
    exchangeScore = 5; // Mid-tier exchanges
  } else {
    exchangeScore = 3; // Small exchanges
  }
  score += exchangeScore * 0.10;
  
  // Institutional adoption (15%) — hardcoded for known cases
  let institutionalScore = 3; // default
  if (id === 'bitcoin') institutionalScore = 10; // ETFs, MicroStrategy, nation-states
  else if (id === 'ethereum') institutionalScore = 9; // ETFs, major institutions
  else if (id === 'solana') institutionalScore = 7; // Major VC backing, growing institutional
  else if (id === 'ripple') institutionalScore = 7; // Banking partnerships (but controversial)
  else if (['binancecoin', 'cardano', 'avalanche-2', 'polkadot'].includes(id)) institutionalScore = 5;
  else if (meta?.investors && meta.investors > 15) institutionalScore = 4; // VC-backed
  score += institutionalScore * 0.15;
  
  return Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
}

/**
 * Calculate Innovation Score
 * Technical differentiation and proven adoption of innovation
 * @param token - Token data
 * @param meta - Token metadata
 * @returns Score 0-10
 */
function calculateInnovationScore(token: TokenData, meta: any): number {
  const innovationLevel = meta?.innovationLevel;
  
  let baseScore = 5; // default for unknown
  
  if (innovationLevel === 'pioneer') baseScore = 10; // BTC, ETH
  else if (innovationLevel === 'major') baseScore = 8; // SOL, HYPE, major tech innovation
  else if (innovationLevel === 'incremental') baseScore = 5; // Improvements on existing tech
  else if (innovationLevel === 'clone') baseScore = 2; // Fork/clone with minimal changes
  
  // Penalty for innovation without adoption (execution risk)
  if (meta?.executionRisk) {
    baseScore = Math.max(0, baseScore - 3);
  }
  
  return Math.round(Math.max(0, Math.min(10, baseScore)) * 10) / 10;
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
  // Only BTC and XMR qualify as genuine store-of-value assets with proven adoption
  // LTC, BCH lost to BTC; ZCash has minimal adoption
  const storeOfValueTokens = ['bitcoin', 'monero'];
  const isStoreOfValue = storeOfValueTokens.includes(token.id);
  // isStablecoin early check (before cgCats is declared) — uses id list only
  const isStablecoinEarly = ['tether', 'usd-coin', 'dai', 'true-usd', 'frax', 'usdd', 'first-digital-usd'].includes(token.id);

  let utilityScore = [
    utilityData.neededToUse,
    utilityData.stakingAvailable,
    utilityData.governancePower,
    utilityData.feeBurning,
  ].filter(Boolean).length / 4 * 10;
  
  // Fee burn verificado: queima real e massiva (não teórica)
  // ETH queima milhões/mês via EIP-1559, HYPE queima fees do protocolo, BNB queima trimestral
  if (meta?.verifiedFeeBurn) {
    utilityScore = Math.min(10, utilityScore + 1.0); // Bonus adicional para burn real
  }

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
    ['dogecoin', 'shiba-inu', 'pepe', 'dog-go-to-the-moon-rune', 'dogwifcoin', 'bonk', 'floki',
     'baby-doge-coin', 'samoyedcoin', 'myro', 'popcat', 'mog-coin',
     'book-of-meme', 'cat-in-a-dogs-world', 'just-a-coke',
     'pump-fun', 'brett-2'].includes(token.id)
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
  
  // Community bonus escalado: distribuição real para a comunidade
  if (distribution.community >= 70) distScore += 2; // Bitcoin, HYPE, ETH level
  else if (distribution.community >= 50) distScore += 1;
  else if (distribution.community < 40) distScore -= 1; // Heavy VC/insider concentration
  
  if (distribution.investors === 0 && !isMemeToken) distScore += 1; // No VC = genuine bonus for real projects
  if (distribution.team === 0 && distribution.investors === 0 && !isMemeToken) {
    distScore = 10; // Bitcoin-like fair launch for real projects
  }
  // ─── Centralization Penalty ───────────────────────────────────
  // Same entity controls team + treasury (e.g. Ripple, Justin Sun, Binance, Ava Labs)
  if (meta?.centralizedControl) distScore = Math.max(0, distScore - 2.5);
  
  // Treasury centralizado em empresa privada (não DAO on-chain)
  if (meta?.centralizedControl && distribution.treasury > 25) {
    distScore = Math.max(0, distScore - 1.5); // Penalty adicional: "ecosystem fund" controlado privadamente
  }
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
  // Weak value accrual: ecosystem grows but token doesn't capture value (e.g. ATOM — IBC is token-agnostic)
  if (meta?.weakValueAccrual) utilScore = Math.max(0, utilScore - 2.5);

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

  // ─── SCORING V2: New Categories ──────────────────────────────
  // Calculate Lindy Effect score (Network Age)
  const lindyScore = calculateLindyScore(meta?.launchYear);
  // Special adjustment for ETH: 11 years → 9.0 (proven dominant L1)
  const adjustedLindyScore = token.id === 'ethereum' ? 9.0 : lindyScore;
  
  // Calculate Network Effect / Adoption score
  const networkEffectScore = calculateNetworkEffectScore(token, meta);
  
  // Calculate Innovation score
  const innovationScore = calculateInnovationScore(token, meta);

  // ─── Regulatory / Team / Community are informational ONLY ────
  // They appear as visual sections but do NOT affect the tokenomics score.
  // The platform focus is pure tokenomics quality, not external risk factors.

  // ─── SCORING V2: Updated Weights ─────────────────────────────
  // Old weights: Supply 25%, Distribution 25%, Vesting 20%, Utility 20%, Treasury 10%
  // New weights: Supply 15%, Distribution 25%, Utility 15%, Sustainability 15%,
  //              Innovation 10%, Lindy 10%, Network Effect 10%
  // (Vesting removed as separate category — integrated into Distribution)
  let totalScore = Math.max(0, Math.min(10,
    supplyScore * 0.15 +          // Supply Dynamics (reduced from 25% to 15%)
    distScore * 0.25 +             // Distribution (maintained at 25%)
    utilScore * 0.15 +             // Utility (reduced from 20% to 15%)
    treasScore * 0.15 +            // Sustainability (increased from 10% to 15%)
    innovationScore * 0.10 +       // Innovation (NEW - 10%)
    adjustedLindyScore * 0.10 +    // Network Age / Lindy (NEW - 10%)
    networkEffectScore * 0.10      // Network Effect / Adoption (NEW - 10%)
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
    vesting: Math.round(vestingScore * 10) / 10, // Kept for legacy UI compatibility
    utility: Math.round(utilScore * 10) / 10,
    treasury: Math.round(treasScore * 10) / 10, // Renamed to "Sustainability" in display
    innovation: Math.round(innovationScore * 10) / 10, // NEW
    lindy: adjustedLindyScore, // NEW (already rounded)
    networkEffect: networkEffectScore, // NEW (already rounded)
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

  if (meta?.weakValueAccrual) {
    cons.push('Problema de captura de valor: o ecossistema cresce mas o token não acumula esse valor estruturalmente');
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
  // dataQuality: 'verified' only if manually reviewed with sources; everything else is 'estimated'
  const dataQuality: 'verified' | 'estimated' =
    (meta?.dataQuality === 'verified' && tokenomicsSources.length > 0) ? 'verified' : 'estimated';

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
    dataQuality,
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
