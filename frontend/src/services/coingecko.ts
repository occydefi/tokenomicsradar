import axios from 'axios';
import type { TokenData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache for coin list to avoid repeated fetches
let coinListCache: { id: string; symbol: string; name: string }[] | null = null;
let coinListFetchedAt: number | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getCoinIdByTicker(ticker: string): Promise<string | null> {
  const now = Date.now();

  // Use cache if fresh
  if (!coinListCache || !coinListFetchedAt || (now - coinListFetchedAt) > CACHE_TTL) {
    const response = await axios.get(`${BASE_URL}/coins/list`);
    coinListCache = response.data;
    coinListFetchedAt = now;
  }

  const upper = ticker.toUpperCase();
  
  // Priority mapping for ambiguous tickers
  const priorityMap: Record<string, string> = {
    // Top market cap
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'XRP': 'ripple',
    'USDC': 'usd-coin',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'TON': 'the-open-network',
    'TRX': 'tron',
    'HYPE': 'hyperliquid',
    'SHIB': 'shiba-inu',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'SUI': 'sui',
    'LINK': 'chainlink',
    'HBAR': 'hedera-hashgraph',
    'MATIC': 'matic-network',
    'POL': 'matic-network',
    'UNI': 'uniswap',
    'LTC': 'litecoin',
    'NEAR': 'near',
    'APT': 'aptos',
    'BCH': 'bitcoin-cash',
    'ICP': 'internet-computer',
    'DAI': 'dai',
    'ARB': 'arbitrum',
    'OP': 'optimism',
    'ETC': 'ethereum-classic',
    'MKR': 'maker',
    'ATOM': 'cosmos',
    'PEPE': 'pepe',
    'DOG': 'dog-go-to-the-moon-rune',
    'MEW': 'cat-in-a-dogs-world',
    'POPCAT': 'popcat',
    'BRETT': 'brett-2',
    'FIL': 'filecoin',
    'VET': 'vechain',
    'ALGO': 'algorand',
    'XLM': 'stellar',
    'BONK': 'bonk',
    'WIF': 'dogwifcoin',
    'INJ': 'injective-protocol',
    'SEI': 'sei-network',
    'AAVE': 'aave',
    'JUP': 'jupiter-exchange-solana',
    'RUNE': 'thorchain',
    'GRT': 'the-graph',
    'FTM': 'fantom',
    'S': 'fantom',
    'LDO': 'lido-dao',
    'IMX': 'immutable-x',
    'TIA': 'celestia',
    'STX': 'blockstack',
    'EGLD': 'elrond-erd-2',
    'FLOW': 'flow',
    'ZEC': 'zcash',
    'THETA': 'theta-token',
    'CRV': 'curve-dao-token',
    'PYTH': 'pyth-network',
    'DYDX': 'dydx',
    'XTZ': 'tezos',
    'SNX': 'havven',
    'COMP': 'compound-governance-token',
    'W': 'wormhole',
    'ZK': 'zksync',
    'STRK': 'starknet',
    'BLUR': 'blur',
    'ENS': 'ethereum-name-service',
    '1INCH': '1inch',
    'BAL': 'balancer',
    'YFI': 'yearn-finance',
    'SUSHI': 'sushi',
    'MANA': 'decentraland',
    'SAND': 'the-sandbox',
    'AXS': 'axie-infinity',
    'GALA': 'gala',
    'CHZ': 'chiliz',
    'GMX': 'gmx',
    'KAVA': 'kava',
    'ROSE': 'oasis-network',
    'ZIL': 'zilliqa',
    'IOTA': 'iota',
    'EOS': 'eos',
    'NEO': 'neo',
    'WAVES': 'waves',
    'DASH': 'dash',
    'DCR': 'decred',
    'QTUM': 'qtum',
    'ONT': 'ontology',
    'ICX': 'icon',
    // Other frequently searched
    'KAS': 'kaspa',
    'TAO': 'bittensor',
    'FET': 'fetch-ai',
    'RENDER': 'render-token',
    'JTO': 'jito-governance-token',
  };

  if (priorityMap[upper]) {
    return priorityMap[upper];
  }

  // Search by exact symbol match
  const matches = coinListCache!.filter(
    coin => coin.symbol.toUpperCase() === upper
  );

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0].id;

  // Multiple matches - prefer non-wrapped, non-bridged tokens
  const preferredMatch = matches.find(m => 
    !m.name.toLowerCase().includes('wrapped') &&
    !m.name.toLowerCase().includes('bridged') &&
    !m.name.toLowerCase().includes('staked') &&
    !m.id.includes('wrapped') &&
    !m.id.includes('bridged')
  );

  return preferredMatch ? preferredMatch.id : matches[0].id;
}

export async function getTokenData(coinId: string): Promise<TokenData> {
  const response = await axios.get(`${BASE_URL}/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: true,
      sparkline: false,
    },
  });
  return response.data;
}

export async function searchToken(query: string): Promise<TokenData> {
  // First try to get coin ID from ticker
  const coinId = await getCoinIdByTicker(query.trim());
  
  if (!coinId) {
    throw new Error(`Token "${query}" not found. Try the exact symbol (e.g. BTC, ETH, SOL).`);
  }

  return getTokenData(coinId);
}
