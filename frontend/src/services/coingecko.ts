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
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'XRP': 'ripple',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'MATIC': 'matic-network',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'LTC': 'litecoin',
    'DOGE': 'dogecoin',
    'SHIB': 'shiba-inu',
    'TRX': 'tron',
    'NEAR': 'near',
    'APT': 'aptos',
    'ARB': 'arbitrum',
    'OP': 'optimism',
    'SUI': 'sui',
    'INJ': 'injective-protocol',
    'SEI': 'sei-network',
    'WIF': 'dogwifcoin',
    'PEPE': 'pepe',
    'TON': 'the-open-network',
    'JUP': 'jupiter-exchange-solana',
    'FTM': 'fantom',
    'FIL': 'filecoin',
    'ALGO': 'algorand',
    'ICP': 'internet-computer',
    'GRT': 'the-graph',
    'SAND': 'the-sandbox',
    'MANA': 'decentraland',
    'CRV': 'curve-dao-token',
    'AAVE': 'aave',
    'MKR': 'maker',
    'SNX': 'havven',
    'COMP': 'compound-governance-token',
    'LDO': 'lido-dao',
    'RUNE': 'thorchain',
    'KAS': 'kaspa',
    'BONK': 'bonk',
    'TAO': 'bittensor',
    'FET': 'fetch-ai',
    'RENDER': 'render-token',
    'TIA': 'celestia',
    'PYTH': 'pyth-network',
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
    throw new Error(`Token "${query}" não encontrado. Tente o símbolo exato (ex: BTC, ETH, SOL).`);
  }

  return getTokenData(coinId);
}
