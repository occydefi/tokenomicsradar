import type { AnalysisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Mini descrições em português por token
const PT_DESCRIPTIONS: Record<string, string> = {
  'bitcoin': 'A primeira criptomoeda do mundo, criada em 2009 por Satoshi Nakamoto. Funciona como dinheiro digital descentralizado e reserva de valor — nenhuma empresa ou governo controla. Supply fixo de 21 milhões de BTC, garantido por matemática.',
  'ethereum': 'Plataforma de contratos inteligentes que permite criar aplicações descentralizadas (dApps), DeFi e NFTs. O ETH é o "combustível" para executar operações na rede. Segunda maior cripto por market cap e base do ecossistema DeFi.',
  'solana': 'Blockchain de alta velocidade (65.000 TPS) com taxas muito baixas. Concorrente direta do Ethereum, popular para DeFi, NFTs e memecoins. SOL é usado para pagar taxas e fazer staking na rede.',
  'ripple': 'Protocolo de pagamentos internacionais focado em bancos e instituições financeiras. XRP é usado para transferências rápidas entre moedas. Controverso por seu alto grau de centralização — Ripple Labs controla a maioria do supply.',
  'cardano': 'Blockchain de contratos inteligentes desenvolvida com rigor acadêmico pela IOHK. ADA é usado para staking e governance. Prometeu muito, demorou anos para entregar smart contracts, e ainda tem DeFi limitado comparado aos concorrentes.',
  'binancecoin': 'Token nativo da Binance, maior exchange de criptomoedas do mundo. Usado para pagar taxas na Binance com desconto e na rede BNB Chain. Fortemente controlado pela Binance — não é um projeto descentralizado.',
  'avalanche-2': 'Plataforma de contratos inteligentes com arquitetura de 3 sub-redes (P-Chain, C-Chain, X-Chain). AVAX é usado para taxas, staking e criação de subnets customizadas. Concorre com Ethereum na criação de blockchains customizadas.',
  'polkadot': 'Protocolo de interoperabilidade que conecta múltiplas blockchains (parachains). DOT é usado para staking, governance e para reservar slots de parachain. Criado por Gavin Wood, co-fundador do Ethereum.',
  'tron': 'Blockchain focada em entretenimento e stablecoins. TRX é controlado majoritariamente por Justin Sun e a Tron Foundation. Processa grandes volumes de USDT, mas com sérias críticas de centralização.',
  'cosmos': 'Protocolo de interoperabilidade entre blockchains via IBC (Inter-Blockchain Communication). ATOM é usado para staking na Cosmos Hub — mas o problema é que as blockchains do ecossistema não precisam de ATOM para funcionar.',
  'litecoin': 'Um dos primeiros forks do Bitcoin, criado em 2011 por Charlie Lee. Funciona como "prata do Bitcoin" com blocos mais rápidos. Relevância caiu drasticamente com o crescimento do BTC e outras redes.',
  'chainlink': 'Rede de oráculos descentralizados que conecta contratos inteligentes a dados do mundo real (preços, clima, etc.). LINK é usado para pagar operadores de nós. Infraestrutura crítica usada por centenas de protocolos DeFi.',
  'uniswap': 'Maior exchange descentralizada (DEX) do mundo em volume. Permite trocar qualquer token ERC-20 sem intermediários via pools de liquidez. UNI é o token de governance do protocolo.',
  'aave': 'Protocolo de empréstimos descentralizados — você empresta ou toma emprestado cripto sem banco. AAVE é usado para governance e como colateral. Um dos projetos DeFi mais sólidos e auditados.',
  'maker': 'Protocolo que criou o DAI, a maior stablecoin descentralizada. MKR é usado para governance e é queimado quando o protocolo lucra. Um dos pilares mais antigos e robustos do DeFi.',
  'curve-dao-token': 'DEX especializada em stablecoins e ativos com paridade de preço (ETH/wstETH). CRV é o token de governance com sistema de lock (veCRV). Essencial na infraestrutura de liquidez do DeFi.',
  'the-graph': 'Protocolo de indexação de dados blockchain — funciona como o "Google da blockchain". GRT é usado para pagar indexadores e delegadores que organizam os dados para consultas eficientes.',
  'hyperliquid': 'L1 blockchain completo com consenso HyperBFT (0.2s de latência). HyperCore é a perp DEX nativa, HyperEVM roda smart contracts EVM. HYPE é o gas token do HyperEVM + fee burn + staking. Distribuição 76% comunidade via airdrop — zero VCs. ~$500M+ em revenue do protocolo.',
  'dogecoin': 'A primeira e maior memecoin. Criada em 2013 como piada, virou fenômeno cultural. Sem utilidade técnica real, sem cap de supply, sem desenvolvimento ativo. Seu valor é 100% especulativo e movido por comunidade e influenciadores.',
  'shiba-inu': 'Memecoin criada em 2020 como "assassino do Dogecoin". SHIB tem ecossistema próprio (ShibaSwap, Shibarium) mas ainda é essencialmente especulativo. Sem utilidade fundamental que justifique valorização estrutural.',
  'pepe': 'Memecoin baseada no meme do sapo Pepe. Sem utilidade, sem time identificado, sem desenvolvimento. Puro token especulativo e de comunidade.',
  'tether': 'A maior stablecoin do mundo (US$140B+). USDT é lastreado em dólares e equivalentes, emitido pela Tether Ltd. Amplamente usado em DeFi e exchanges, mas com histórico de opacidade nas reservas.',
  'usd-coin': 'Stablecoin emitida pela Circle (empresa americana regulada). USDC é considerada a stablecoin centralizada mais segura: reservas auditadas mensalmente, 100% em USD e Treasuries americanos.',
  'dai': 'Stablecoin descentralizada criada pelo MakerDAO. DAI é emitido via overcollateralização de cripto (ETH, wBTC). Não depende de nenhuma empresa — funciona por código. Principal stablecoin descentralizada do DeFi.',
  'arbitrum': 'Principal Layer 2 do Ethereum por TVL. Processa transações fora da mainnet e as consolida no Ethereum, reduzindo taxas drasticamente. ARB é o token de governance do protocolo.',
  'optimism': 'Layer 2 do Ethereum baseado em Optimistic Rollups. OP é o token de governance com modelo inovador de financiamento de bens públicos (Retroactive Public Goods Funding).',
  'the-open-network': 'Blockchain criada originalmente pelo Telegram, integrada nativamente ao app (900M+ usuários). TON tem crescimento real via pagamentos e mini-apps dentro do Telegram.',
  'injective-protocol': 'Blockchain DeFi otimizada para finanças descentralizadas — DEX de derivativos, spot, e produtos estruturados. INJ tem mecanismo de queima semanal via leilão de fees.',
  'starknet': 'Layer 2 do Ethereum usando provas ZK-STARK (tecnologia criptográfica avançada). STRK é o token de governance e para pagar taxas. Alta concentração em insiders é a principal crítica.',
};

// English descriptions
const EN_DESCRIPTIONS: Record<string, string> = {
  'bitcoin': 'The world\'s first cryptocurrency, created in 2009 by Satoshi Nakamoto. Functions as decentralized digital money and store of value — no company or government controls it. Fixed supply of 21 million BTC, guaranteed by mathematics.',
  'ethereum': 'Smart contract platform enabling decentralized applications (dApps), DeFi and NFTs. ETH is the "fuel" to execute operations on the network. Second largest crypto by market cap and the base of the DeFi ecosystem.',
  'solana': 'High-speed blockchain (65,000 TPS) with very low fees. Direct competitor to Ethereum, popular for DeFi, NFTs and memecoins. SOL is used to pay fees and stake on the network.',
  'ripple': 'International payments protocol focused on banks and financial institutions. XRP is used for fast cross-currency transfers. Controversial for its high degree of centralization — Ripple Labs controls the majority of supply.',
  'cardano': 'Smart contract blockchain developed with academic rigor by IOHK. ADA is used for staking and governance. Promised a lot, took years to deliver smart contracts, and still has limited DeFi compared to competitors.',
  'binancecoin': 'Native token of Binance, the world\'s largest crypto exchange. Used to pay fees on Binance at a discount and on the BNB Chain network. Heavily controlled by Binance — not a decentralized project.',
  'avalanche-2': 'Smart contract platform with 3-subnet architecture (P-Chain, C-Chain, X-Chain). AVAX is used for fees, staking and creating custom subnets. Competes with Ethereum for building customizable blockchains.',
  'polkadot': 'Interoperability protocol connecting multiple blockchains (parachains). DOT is used for staking, governance and reserving parachain slots. Created by Gavin Wood, Ethereum co-founder.',
  'tron': 'Blockchain focused on entertainment and stablecoins. TRX is mostly controlled by Justin Sun and the Tron Foundation. Processes large volumes of USDT, but with serious centralization criticism.',
  'cosmos': 'Blockchain interoperability protocol via IBC (Inter-Blockchain Communication). ATOM is used for staking on Cosmos Hub — but the problem is ecosystem blockchains don\'t need ATOM to operate.',
  'litecoin': 'One of the first Bitcoin forks, created in 2011 by Charlie Lee. Functions as "Bitcoin\'s silver" with faster blocks. Relevance dropped dramatically with BTC growth and other networks.',
  'chainlink': 'Decentralized oracle network connecting smart contracts to real-world data (prices, weather, etc.). LINK is used to pay node operators. Critical infrastructure used by hundreds of DeFi protocols.',
  'uniswap': 'World\'s largest decentralized exchange (DEX) by volume. Allows swapping any ERC-20 token without intermediaries via liquidity pools. UNI is the protocol\'s governance token.',
  'aave': 'Decentralized lending protocol — lend or borrow crypto without a bank. AAVE is used for governance and as collateral. One of the most solid and audited DeFi projects.',
  'maker': 'Protocol that created DAI, the largest decentralized stablecoin. MKR is used for governance and is burned when the protocol profits. One of DeFi\'s oldest and most robust pillars.',
  'curve-dao-token': 'DEX specialized in stablecoins and price-pegged assets (ETH/wstETH). CRV is the governance token with a lock system (veCRV). Essential infrastructure for DeFi liquidity.',
  'the-graph': 'Blockchain data indexing protocol — functions as the "Google of blockchain". GRT is used to pay indexers and delegators who organize data for efficient queries.',
  'hyperliquid': 'Complete L1 blockchain with HyperBFT consensus (0.2s latency). HyperCore is the native perp DEX, HyperEVM runs EVM smart contracts. HYPE is the HyperEVM gas token + fee burn + staking. 76% community distribution via airdrop — zero VCs. ~$500M+ in protocol revenue.',
  'dogecoin': 'The first and largest memecoin. Created in 2013 as a joke, became a cultural phenomenon. No real technical utility, no supply cap, no active development. Its value is 100% speculative, driven by community and influencers.',
  'shiba-inu': 'Memecoin created in 2020 as the "Dogecoin killer". SHIB has its own ecosystem (ShibaSwap, Shibarium) but remains essentially speculative. No fundamental utility to justify structural appreciation.',
  'pepe': 'Memecoin based on the Pepe the Frog meme. No utility, no identified team, no development. Pure speculative community token.',
  'tether': 'The world\'s largest stablecoin ($140B+). USDT is backed by dollars and equivalents, issued by Tether Ltd. Widely used in DeFi and exchanges, but with a history of reserve opacity.',
  'usd-coin': 'Stablecoin issued by Circle (regulated US company). USDC is considered the safest centralized stablecoin: monthly audited reserves, 100% in USD and US Treasuries.',
  'dai': 'Decentralized stablecoin created by MakerDAO. DAI is issued via crypto overcollateralization (ETH, wBTC). Does not depend on any company — operates by code. Primary decentralized DeFi stablecoin.',
  'arbitrum': 'Ethereum\'s primary Layer 2 by TVL. Processes transactions off mainnet and settles them on Ethereum, drastically reducing fees. ARB is the protocol\'s governance token.',
  'optimism': 'Ethereum Layer 2 based on Optimistic Rollups. OP is the governance token with an innovative public goods funding model (Retroactive Public Goods Funding).',
  'the-open-network': 'Blockchain originally created by Telegram, natively integrated into the app (900M+ users). TON has real growth via payments and mini-apps inside Telegram.',
  'injective-protocol': 'DeFi-optimized blockchain for decentralized finance — derivatives DEX, spot, and structured products. INJ has a weekly burn mechanism via fee auctions.',
  'starknet': 'Ethereum Layer 2 using ZK-STARK proofs (advanced cryptographic technology). STRK is the governance token and used to pay fees. High insider concentration is the main criticism.',
};

// PT auto-generated descriptions based on categories
function generateDescriptionPt(analysis: AnalysisResult): string {
  const { token, utilityData } = analysis;
  const cats = token.categories?.map(c => c.toLowerCase()) || [];
  const name = token.name;
  const sym = token.symbol?.toUpperCase();

  if (cats.some(c => c.includes('layer 2') || c.includes('scaling'))) {
    return `${name} (${sym}) é uma solução de Layer 2 para Ethereum — processa transações fora da rede principal para reduzir custos e aumentar velocidade, mantendo a segurança do Ethereum.`;
  }
  if (cats.some(c => c.includes('layer 1') || c.includes('smart contract platform'))) {
    return `${name} (${sym}) é uma blockchain de contratos inteligentes — plataforma para criar aplicações descentralizadas, DeFi e tokens. ${sym} é usado para pagar taxas e fazer staking na rede.`;
  }
  if (cats.some(c => c.includes('defi') || c.includes('decentralized finance'))) {
    return `${name} (${sym}) é um protocolo DeFi — finanças descentralizadas sem intermediários. ${utilityData.stakingAvailable ? `${sym} pode ser usado em staking` : `${sym} é o token de governance do protocolo`}.`;
  }
  if (cats.some(c => c.includes('dex') || c.includes('exchange'))) {
    return `${name} (${sym}) é o token de uma exchange descentralizada (DEX) — permite trocar criptomoedas sem custódia centralizada. ${sym} dá poder de voto na governance do protocolo.`;
  }
  if (cats.some(c => c.includes('oracle'))) {
    return `${name} (${sym}) é uma rede de oráculos — conecta contratos inteligentes a dados do mundo real como preços de ativos, clima e eventos. Infraestrutura crítica para o DeFi.`;
  }
  if (cats.some(c => c.includes('gaming') || c.includes('play-to-earn'))) {
    return `${name} (${sym}) é o token de um ecossistema de jogos blockchain (GameFi/play-to-earn). ${sym} é usado dentro dos jogos e para governance do ecossistema.`;
  }
  if (cats.some(c => c.includes('metaverse'))) {
    return `${name} (${sym}) é o token de um metaverso descentralizado — mundo virtual onde usuários podem comprar terrenos, criar experiências e interagir. ${sym} é a moeda nativa desse ambiente.`;
  }
  if (cats.some(c => c.includes('privacy'))) {
    return `${name} (${sym}) é uma criptomoeda focada em privacidade — transações são confidenciais por padrão, sem rastreamento público. Alternativa ao Bitcoin para quem prioriza anonimato.`;
  }
  if (cats.some(c => c.includes('stablecoin'))) {
    return `${name} (${sym}) é uma stablecoin — criptomoeda com valor fixo em dólar. Usada como meio de troca, colateral em DeFi e reserva de valor dentro do ecossistema cripto.`;
  }
  if (cats.some(c => c.includes('meme'))) {
    return `${name} (${sym}) é uma memecoin — token criado sem utilidade técnica real, movido por cultura de internet e especulação da comunidade. Alto risco, sem fundamentos econômicos sólidos.`;
  }

  return `${name} (${sym}) é uma criptomoeda com ${utilityData.stakingAvailable ? 'staking disponível' : 'foco em utilidade específica'}${utilityData.governancePower ? ' e poder de governance on-chain' : ''}.`;
}

// EN auto-generated descriptions based on categories
function generateDescriptionEn(analysis: AnalysisResult): string {
  const { token, utilityData } = analysis;
  const cats = token.categories?.map(c => c.toLowerCase()) || [];
  const name = token.name;
  const sym = token.symbol?.toUpperCase();

  if (cats.some(c => c.includes('layer 2') || c.includes('scaling'))) {
    return `${name} (${sym}) is an Ethereum Layer 2 solution — processes transactions off the main network to reduce costs and increase speed while maintaining Ethereum's security.`;
  }
  if (cats.some(c => c.includes('layer 1') || c.includes('smart contract platform'))) {
    return `${name} (${sym}) is a smart contract blockchain — a platform for building decentralized applications, DeFi and tokens. ${sym} is used to pay fees and stake on the network.`;
  }
  if (cats.some(c => c.includes('defi') || c.includes('decentralized finance'))) {
    return `${name} (${sym}) is a DeFi protocol — decentralized finance without intermediaries. ${utilityData.stakingAvailable ? `${sym} can be used for staking` : `${sym} is the protocol's governance token`}.`;
  }
  if (cats.some(c => c.includes('dex') || c.includes('exchange'))) {
    return `${name} (${sym}) is the token of a decentralized exchange (DEX) — allows swapping crypto without centralized custody. ${sym} gives voting power in protocol governance.`;
  }
  if (cats.some(c => c.includes('oracle'))) {
    return `${name} (${sym}) is an oracle network — connects smart contracts to real-world data like asset prices, weather and events. Critical infrastructure for DeFi.`;
  }
  if (cats.some(c => c.includes('gaming') || c.includes('play-to-earn'))) {
    return `${name} (${sym}) is the token of a blockchain gaming ecosystem (GameFi/play-to-earn). ${sym} is used within games and for ecosystem governance.`;
  }
  if (cats.some(c => c.includes('metaverse'))) {
    return `${name} (${sym}) is the token of a decentralized metaverse — a virtual world where users can buy land, create experiences and interact. ${sym} is the native currency of that environment.`;
  }
  if (cats.some(c => c.includes('privacy'))) {
    return `${name} (${sym}) is a privacy-focused cryptocurrency — transactions are confidential by default, with no public tracking. An alternative to Bitcoin for those who prioritize anonymity.`;
  }
  if (cats.some(c => c.includes('stablecoin'))) {
    return `${name} (${sym}) is a stablecoin — a cryptocurrency with a fixed dollar value. Used as a medium of exchange, DeFi collateral and store of value within the crypto ecosystem.`;
  }
  if (cats.some(c => c.includes('meme'))) {
    return `${name} (${sym}) is a memecoin — a token created without real technical utility, driven by internet culture and community speculation. High risk, no solid economic fundamentals.`;
  }

  return `${name} (${sym}) is a cryptocurrency with ${utilityData.stakingAvailable ? 'staking available' : 'a specific utility focus'}${utilityData.governancePower ? ' and on-chain governance power' : ''}.`;
}

interface Props {
  analysis: AnalysisResult;
}

export default function TokenAbout({ analysis }: Props) {
  const { t, lang } = useLanguage();

  const desc = lang === 'en'
    ? (EN_DESCRIPTIONS[analysis.token.id] ?? generateDescriptionEn(analysis))
    : (PT_DESCRIPTIONS[analysis.token.id] ?? generateDescriptionPt(analysis));

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: '#080d08',
        borderColor: '#1a2e1a',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: '#39d353', fontSize: '16px' }}>📖</span>
        <h3 className="text-sm font-bold font-mono tracking-wider" style={{ color: '#39d353' }}>
          {t.whatIs} {analysis.token.symbol?.toUpperCase()}?
        </h3>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
        {desc}
      </p>
    </div>
  );
}
