export type Lang = 'pt' | 'en';

export const translations = {
  pt: {
    // Header
    tagline: '> análise_tokenômica --deep',
    btnSimulator: '🔮 Simulador de Market Cap',
    btnCompare: '⚖️ Comparação de Tokens',
    btnCompareOn: '⚖️ Comparação ON',
    btnGithub: 'GitHub →',

    // Hero
    heroTitle: '> Análise Tokenômica_',
    heroTitleCompare: '⚖️ Comparar Tokens',
    heroSubtitle: 'insira o ticker de qualquer criptoativo // score 0-10 // DYOR',
    heroSubtitleCompare: 'busque dois tokens para comparar lado a lado',
    searchPlaceholder: 'TICKER... (BTC, ETH, SOL, HYPE)',
    searchPlaceholderA: 'Token A... (BTC, ETH, SOL)',
    searchPlaceholderB: 'Token B... (BTC, ETH, SOL)',
    btnScan: '🧌 SCAN',
    scanning: 'scan...',
    tokenALabel: '> Token_A',
    tokenBLabel: '> Token_B',

    // Empty state
    systemReady: '> sistema_pronto_',
    systemReadyEx: 'ex:',

    // Loading
    loadingText: '> buscando dados na blockchain... 🔍',
    loadingTokenA: '> Token_A...',
    loadingTokenB: '> Token_B...',

    // Errors
    errorGeneric: 'Erro ao buscar dados. Verifique o ticker e tente novamente.',
    tokenALoaded: 'carregado. Agora busque o Token_B para comparar.',

    // Tabs
    tabOverview: 'OVERVIEW',
    tabOverviewCmd: 'scan --full',
    tabTokenomics: 'TOKENOMICS',
    tabTokenomicsCmd: 'supply --deep',
    tabRisk: 'RISCO',
    tabRiskCmd: 'threat --level=all',
    tabOnchain: 'ON-CHAIN',
    tabOnchainCmd: 'chain --live',

    // TokenAbout
    whatIs: 'O QUE É',

    // TokenHeader
    price: '💲 PREÇO',
    marketCap: '🌐 MKT CAP',
    fdv: '🔮 FDV',
    circulationNow: 'circulação atual',
    highDilution: '⚠ diluição alta',
    dataTokenomics: '> data_tokenomics:',

    // Verdict labels
    verdictExcelente: 'EXCELENTE',
    verdictBom: 'BOM',
    verdictRegular: 'REGULAR',
    verdictRuim: 'RUIM',
    verdictEvitar: 'EVITAR',

    // MC Simulator
    simTitle: '🔮 Simulador de Market Cap',
    simSubtitle: 'E se o Token X tivesse o market cap do Token Y? Quanto valeria?',
    simTokenX: 'TOKEN X  [ALVO]',
    simTokenY: 'TOKEN Y  [REFERÊNCIA DE MC]',
    simCurrent: 'ATUAL',
    simAth: 'ATH (Máxima)',
    simPriceWith: 'Preço de',
    simPriceWithMC: 'com o Market Cap de',
    simAtMax: 'na Máxima Histórica',
    simCurrentPrice: 'Preço Atual',
    simMultiplier: 'Multiplicador',
    simPriceIncrease: 'Variação de Preço',
    simTargetMC: 'Market Cap Alvo',
    simShare: '↗ COMPARTILHAR',
    simWaiting: '> aguardando tokens...',
    simWaitingHint: 'busque o Token X e o Token Y para simular',
    simDisclaimer: '⚠ simulação educacional · não considera emissão futura de tokens · não é conselho financeiro',

    // Footer
    footerData: 'dados via',
    footerRealtime: '• realtime',
    footerDisclaimer: '// fins educacionais // não constitui conselho financeiro // DYOR',
    footerBuilt: 'built by ~OCcY // underground crypto tools',
  },

  en: {
    // Header
    tagline: '> tokenomics_analysis --deep',
    btnSimulator: '🔮 Market Cap Simulator',
    btnCompare: '⚖️ Compare Tokens',
    btnCompareOn: '⚖️ Compare ON',
    btnGithub: 'GitHub →',

    // Hero
    heroTitle: '> Tokenomics Analysis_',
    heroTitleCompare: '⚖️ Compare Tokens',
    heroSubtitle: 'enter any crypto ticker // score 0-10 // DYOR',
    heroSubtitleCompare: 'search two tokens to compare side by side',
    searchPlaceholder: 'TICKER... (BTC, ETH, SOL, HYPE)',
    searchPlaceholderA: 'Token A... (BTC, ETH, SOL)',
    searchPlaceholderB: 'Token B... (BTC, ETH, SOL)',
    btnScan: '🧌 SCAN',
    scanning: 'scan...',
    tokenALabel: '> Token_A',
    tokenBLabel: '> Token_B',

    // Empty state
    systemReady: '> system_ready_',
    systemReadyEx: 'e.g.:',

    // Loading
    loadingText: '> fetching blockchain data... 🔍',
    loadingTokenA: '> Token_A...',
    loadingTokenB: '> Token_B...',

    // Errors
    errorGeneric: 'Error fetching data. Check the ticker and try again.',
    tokenALoaded: 'loaded. Now search Token_B to compare.',

    // Tabs
    tabOverview: 'OVERVIEW',
    tabOverviewCmd: 'scan --full',
    tabTokenomics: 'TOKENOMICS',
    tabTokenomicsCmd: 'supply --deep',
    tabRisk: 'RISK',
    tabRiskCmd: 'threat --level=all',
    tabOnchain: 'ON-CHAIN',
    tabOnchainCmd: 'chain --live',

    // TokenAbout
    whatIs: 'WHAT IS',

    // TokenHeader
    price: '💲 PRICE',
    marketCap: '🌐 MKT CAP',
    fdv: '🔮 FDV',
    circulationNow: 'current circulation',
    highDilution: '⚠ high dilution',
    dataTokenomics: '> tokenomics_date:',

    // Verdict labels
    verdictExcelente: 'EXCELLENT',
    verdictBom: 'GOOD',
    verdictRegular: 'AVERAGE',
    verdictRuim: 'POOR',
    verdictEvitar: 'AVOID',

    // MC Simulator
    simTitle: '🔮 Market Cap Simulator',
    simSubtitle: 'What if Token X had the market cap of Token Y? What would it be worth?',
    simTokenX: 'TOKEN X  [TARGET]',
    simTokenY: 'TOKEN Y  [MC REFERENCE]',
    simCurrent: 'CURRENT',
    simAth: 'ATH (All-Time High)',
    simPriceWith: 'Price of',
    simPriceWithMC: 'with MC of',
    simAtMax: 'at All-Time High',
    simCurrentPrice: 'Current Price',
    simMultiplier: 'Multiplier',
    simPriceIncrease: 'Price Change',
    simTargetMC: 'Target Market Cap',
    simShare: '↗ SHARE',
    simWaiting: '> waiting for tokens...',
    simWaitingHint: 'search Token X and Token Y to simulate',
    simDisclaimer: '⚠ educational simulation · does not consider future token emissions · not financial advice',

    // Footer
    footerData: 'data via',
    footerRealtime: '• realtime',
    footerDisclaimer: '// educational purposes // not financial advice // DYOR',
    footerBuilt: 'built by ~OCcY // underground crypto tools',
  },
} as const;

export type TranslationKeys = keyof typeof translations.pt;
