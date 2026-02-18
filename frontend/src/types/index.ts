export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    fully_diluted_valuation: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
  };
  categories: string[];
  description: { en: string };
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: { additions: number; deletions: number };
    commit_count_4_weeks: number;
  };
  community_data: {
    twitter_followers: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number | null;
    telegram_channel_user_count: number | null;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    repos_url: { github: string[] };
  };
}

export interface AnalysisResult {
  token: TokenData;
  scores: {
    supply: number;
    distribution: number;
    vesting: number;
    utility: number;
    treasury: number;
    total: number;
  };
  supplyMetrics: SupplyMetrics;
  distribution: DistributionData;
  vestingData: VestingData;
  vestingYears: number;
  utilityData: UtilityData;
  treasuryData: TreasuryData;
  teamTransparency?: 'high' | 'medium' | 'low' | 'anonymous';
  teamNote?: string;
  communityStrength?: 'strong' | 'medium' | 'weak';
  verdict: 'Excelente' | 'Bom' | 'Regular' | 'Ruim' | 'Evitar';
  conclusion: string;
  pros: string[];
  cons: string[];
  tokenomicsLastUpdated: string; // date of last manual review of tokenomics data
  fetchedAt: Date;
}

export interface SupplyMetrics {
  maxSupply: number | null;
  circulatingSupply: number;
  totalSupply: number | null;
  isFixed: boolean;
  circulatingPct: number;
  inflationRate: number;
  burnedTokens: number | null;
  burnedPct: number | null;
}

export interface DistributionData {
  team: number;
  investors: number;
  community: number;
  treasury: number;
  other: number;
  note: string;
}

export interface VestingData {
  totalLocked: number;
  totalUnlocked: number;
  lockedPct: number;
  nextUnlockDate: string | null;
  nextUnlockAmount: number | null;
  estimatedFullUnlock: string | null;
  note: string;
}

export interface UtilityData {
  neededToUse: boolean;
  stakingAvailable: boolean;
  governancePower: boolean;
  feeBurning: boolean;
  score: number;
}

export interface TreasuryData {
  estimatedSize: number | null;
  runwayMonths: number | null;
  note: string;
}
