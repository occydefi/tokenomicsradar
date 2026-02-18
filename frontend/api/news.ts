import type { VercelRequest, VercelResponse } from '@vercel/node';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

// Map tickers to their full name for better search queries
const TOKEN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  BNB: 'BNB Binance',
  XRP: 'XRP Ripple',
  ADA: 'Cardano',
  DOGE: 'Dogecoin',
  AVAX: 'Avalanche',
  DOT: 'Polkadot',
  MATIC: 'Polygon MATIC',
  LINK: 'Chainlink',
  UNI: 'Uniswap',
  ATOM: 'Cosmos',
  LTC: 'Litecoin',
  BCH: 'Bitcoin Cash',
  NEAR: 'NEAR Protocol',
  APT: 'Aptos',
  ARB: 'Arbitrum',
  OP: 'Optimism',
  INJ: 'Injective',
  SUI: 'Sui Network',
  TIA: 'Celestia',
  SEI: 'Sei Network',
  PYTH: 'Pyth Network',
  JTO: 'Jito',
  WIF: 'Dogwifhat',
  BONK: 'Bonk Solana',
  PEPE: 'Pepe Coin',
  SHIB: 'Shiba Inu',
  TRX: 'Tron',
  TON: 'Toncoin',
  XLM: 'Stellar',
  ALGO: 'Algorand',
  VET: 'VeChain',
  FIL: 'Filecoin',
  AAVE: 'Aave DeFi',
  MKR: 'MakerDAO',
  SNX: 'Synthetix',
  CRV: 'Curve Finance',
  LDO: 'Lido Finance',
  RETH: 'Rocket Pool',
  GRT: 'The Graph',
  BAT: 'Basic Attention Token',
  ZEC: 'Zcash',
  XMR: 'Monero',
  ETC: 'Ethereum Classic',
};

// Specialized crypto news sources for Google News site filter
const CRYPTO_SITES = [
  'coindesk.com',
  'cointelegraph.com',
  'decrypt.co',
  'theblock.co',
  'bitcoinmagazine.com',
  'cryptoslate.com',
  'cryptonews.com',
  'u.today',
  'beincrypto.com',
  'ambcrypto.com',
].join(' OR site:');

// CoinDesk tag RSS for major tokens
const COINDESK_TAGS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'xrp',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  AVAX: 'avalanche',
  DOT: 'polkadot',
  LINK: 'chainlink',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
};

// Cointelegraph tag RSS for major tokens
const COINTELEGRAPH_TAGS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  XRP: 'xrp',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  AVAX: 'avalanche',
  DOT: 'polkadot',
  LINK: 'chainlink',
  LTC: 'litecoin',
};

function parseRSS(xml: string, defaultSource?: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                       item.match(/<title>(.*?)<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/) ||
                        item.match(/rl="([^"]+)"/);

    if (titleMatch && linkMatch) {
      const title = titleMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      items.push({
        title,
        link: linkMatch[1].trim(),
        pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
        source: sourceMatch ? sourceMatch[1].trim() : (defaultSource || 'Crypto News'),
      });
    }
  }

  return items;
}

async function fetchRSS(url: string, defaultSource?: string): Promise<NewsItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TokenomicsRadar/1.0; +https://tokenomicsradar.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return [];
    const xml = await response.text();
    return parseRSS(xml, defaultSource);
  } catch {
    clearTimeout(timer);
    return [];
  }
}

function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    // Deduplicate by normalizing title (lowercase, strip punctuation)
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ticker } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'ticker parameter required' });
  }

  const cleanTicker = ticker.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const tokenName = TOKEN_NAMES[cleanTicker];

  // Build search term: use full token name when available, otherwise ticker
  const searchTerm = tokenName || `${cleanTicker} cryptocurrency`;

  try {
    const promises: Promise<NewsItem[]>[] = [];

    // 1. CoinDesk tag RSS (for major tokens)
    if (COINDESK_TAGS[cleanTicker]) {
      const tag = COINDESK_TAGS[cleanTicker];
      promises.push(fetchRSS(`https://www.coindesk.com/tag/${tag}/feed/`, 'CoinDesk'));
    }

    // 2. Cointelegraph tag RSS (for major tokens)
    if (COINTELEGRAPH_TAGS[cleanTicker]) {
      const tag = COINTELEGRAPH_TAGS[cleanTicker];
      promises.push(fetchRSS(`https://cointelegraph.com/tags/${tag}/rss`, 'Cointelegraph'));
    }

    // 3. Google News filtered to specialized crypto sites only
    const googleQuery = encodeURIComponent(`"${searchTerm}" site:${CRYPTO_SITES}`);
    const googleUrl = `https://news.google.com/rss/search?q=${googleQuery}&hl=en-US&gl=US&ceid=US:en`;
    promises.push(fetchRSS(googleUrl));

    // 4. Fallback: broader Google News with crypto context (if ticker is generic)
    const fallbackQuery = encodeURIComponent(`${searchTerm} crypto OR blockchain OR defi`);
    const fallbackUrl = `https://news.google.com/rss/search?q=${fallbackQuery}&hl=en-US&gl=US&ceid=US:en`;
    promises.push(fetchRSS(fallbackUrl));

    const results = await Promise.allSettled(promises);
    const allNews: NewsItem[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    }

    // Deduplicate and sort by date (newest first), take top 10
    const unique = deduplicateNews(allNews);
    const sorted = unique.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return db - da;
    });
    const news = sorted.slice(0, 10);

    // Cache for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

    return res.status(200).json({
      ticker: cleanTicker,
      news,
      count: news.length,
      sources: ['CoinDesk', 'Cointelegraph', 'Decrypt', 'The Block', 'CryptoSlate'],
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch news', details: String(error) });
  }
}
