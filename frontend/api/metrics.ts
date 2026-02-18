import type { VercelRequest, VercelResponse } from '@vercel/node';

// DeFiLlama protocol slug mapping
const DEFILLAMA_SLUGS: Record<string, string> = {
  // DeFi Protocols
  UNI: 'uniswap',
  AAVE: 'aave',
  MKR: 'makerdao',
  CRV: 'curve-dex',
  LDO: 'lido',
  SNX: 'synthetix',
  COMP: 'compound-finance',
  BAL: 'balancer',
  SUSHI: 'sushiswap',
  GRT: 'the-graph',
  BAT: 'brave-browser',
  // Chains (use chain TVL)
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  AVAX: 'avalanche',
  DOT: 'polkadot',
  MATIC: 'polygon',
  ATOM: 'cosmos',
  NEAR: 'near',
  APT: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
  TRX: 'tron',
  TON: 'ton',
  SUI: 'sui',
  INJ: 'injective',
  FIL: 'filecoin',
  ALGO: 'algorand',
};

// Chain slugs for DeFiLlama chain TVL endpoint
const CHAIN_SLUGS: Record<string, string> = {
  ETH: 'Ethereum',
  SOL: 'Solana',
  ADA: 'Cardano',
  AVAX: 'Avalanche',
  DOT: 'Polkadot',
  MATIC: 'Polygon',
  ATOM: 'Cosmos',
  NEAR: 'Near',
  APT: 'Aptos',
  ARB: 'Arbitrum',
  OP: 'Optimism',
  TRX: 'Tron',
  TON: 'TON',
  SUI: 'Sui',
  INJ: 'Injective',
  FIL: 'Filecoin',
  ALGO: 'Algorand',
  BNB: 'BSC',
  BTC: 'Bitcoin',
  LTC: 'Litecoin',
  XRP: 'Ripple',
};

function formatUSD(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatChange(current: number, previous: number): number | null {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

async function fetchJSON(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker } = req.query;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'ticker parameter required' });
  }

  const cleanTicker = ticker.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const metrics: {
    tvl?: string;
    tvlChange7d?: number;
    tvlChange30d?: number;
    fees24h?: string;
    fees7d?: string;
    fees30d?: string;
    revenue24h?: string;
    revenue30d?: string;
    activeUsers?: string;
    transactions24h?: string;
    source: string;
    hasData: boolean;
  } = { source: 'DeFiLlama', hasData: false };

  try {
    // Try protocol TVL first (for DeFi protocols)
    const protocolSlug = DEFILLAMA_SLUGS[cleanTicker];
    const chainSlug = CHAIN_SLUGS[cleanTicker];

    // 1. Fetch TVL
    if (chainSlug) {
      // Chain TVL
      const chainData = await fetchJSON(`https://api.llama.fi/v2/historicalChainTvl/${chainSlug}`) as { tvl: number; date: number }[] | null;
      if (chainData && Array.isArray(chainData) && chainData.length > 0) {
        const sorted = chainData.sort((a, b) => b.date - a.date);
        const current = sorted[0]?.tvl ?? 0;
        const week = sorted[7]?.tvl ?? 0;
        const month = sorted[30]?.tvl ?? 0;

        if (current > 0) {
          metrics.tvl = formatUSD(current);
          const change7d = formatChange(current, week);
          const change30d = formatChange(current, month);
          if (change7d !== null) metrics.tvlChange7d = change7d;
          if (change30d !== null) metrics.tvlChange30d = change30d;
          metrics.hasData = true;
        }
      }
    } else if (protocolSlug) {
      // Protocol TVL
      const protoData = await fetchJSON(`https://api.llama.fi/protocol/${protocolSlug}`) as { currentChainTvls?: Record<string, number>; tvl?: { totalLiquidityUSD: number; date: number }[] } | null;
      if (protoData && protoData.tvl && Array.isArray(protoData.tvl) && protoData.tvl.length > 0) {
        const sorted = protoData.tvl.sort((a, b) => b.date - a.date);
        const current = sorted[0]?.totalLiquidityUSD ?? 0;
        const week = sorted[7]?.totalLiquidityUSD ?? 0;
        const month = sorted[30]?.totalLiquidityUSD ?? 0;

        if (current > 0) {
          metrics.tvl = formatUSD(current);
          const change7d = formatChange(current, week);
          const change30d = formatChange(current, month);
          if (change7d !== null) metrics.tvlChange7d = change7d;
          if (change30d !== null) metrics.tvlChange30d = change30d;
          metrics.hasData = true;
        }
      }
    }

    // 2. Fetch Fees & Revenue (DeFi protocols)
    if (protocolSlug) {
      const feesData = await fetchJSON(
        `https://api.llama.fi/summary/fees/${protocolSlug}?dataType=dailyFees`
      ) as { total24h?: number; total7d?: number; total30d?: number } | null;

      if (feesData) {
        if (feesData.total24h) metrics.fees24h = formatUSD(feesData.total24h);
        if (feesData.total7d) metrics.fees7d = formatUSD(feesData.total7d);
        if (feesData.total30d) metrics.fees30d = formatUSD(feesData.total30d);
        if (feesData.total24h || feesData.total7d) metrics.hasData = true;
      }

      const revData = await fetchJSON(
        `https://api.llama.fi/summary/fees/${protocolSlug}?dataType=dailyRevenue`
      ) as { total24h?: number; total30d?: number } | null;

      if (revData) {
        if (revData.total24h) metrics.revenue24h = formatUSD(revData.total24h);
        if (revData.total30d) metrics.revenue30d = formatUSD(revData.total30d);
        if (revData.total24h) metrics.hasData = true;
      }
    }

    // 3. For chains: fetch fee data too
    if (chainSlug && !protocolSlug) {
      const chainFees = await fetchJSON(
        `https://api.llama.fi/summary/fees/${chainSlug.toLowerCase()}?dataType=dailyFees`
      ) as { total24h?: number; total7d?: number; total30d?: number } | null;

      if (chainFees) {
        if (chainFees.total24h) metrics.fees24h = formatUSD(chainFees.total24h);
        if (chainFees.total7d) metrics.fees7d = formatUSD(chainFees.total7d);
        if (chainFees.total30d) metrics.fees30d = formatUSD(chainFees.total30d);
        if (chainFees.total24h) metrics.hasData = true;
      }
    }

    // Cache 15 min
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json({ ticker: cleanTicker, metrics });

  } catch (error) {
    console.error('Metrics fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch metrics', details: String(error) });
  }
}
