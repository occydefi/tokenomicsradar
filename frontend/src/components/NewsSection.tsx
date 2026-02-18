import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

interface NewsSectionProps {
  ticker: string;
}

// Keywords that make a news item relevant for tokenomics analysis
const HIGHLIGHT_KEYWORDS = [
  'sec', 'cftc', 'cvm', 'regulation', 'regulatory', 'ban', 'banned', 'lawsuit',
  'settlement', 'fine', 'penalty', 'probe', 'investigation', 'approve', 'approval',
  'etf', 'hack', 'exploit', 'vulnerability', 'breach', 'stolen',
  'burn', 'burning', 'halving', 'fork', 'upgrade', 'mainnet',
  'partnership', 'integration', 'adoption', 'treasury', 'staking',
  'governance', 'vote', 'proposal', 'supply', 'tokenomics',
  'airdrop', 'listing', 'delisted', 'delist',
];

function isHighlighted(title: string): boolean {
  const lower = title.toLowerCase();
  return HIGHLIGHT_KEYWORDS.some(kw => lower.includes(kw));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffH < 1) return 'há menos de 1h';
    if (diffH < 24) return `há ${diffH}h`;
    if (diffD === 1) return 'ontem';
    if (diffD < 7) return `há ${diffD} dias`;
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

function getSentimentIcon(title: string): { icon: string; color: string } {
  const lower = title.toLowerCase();
  const bullish = ['surge', 'soar', 'rally', 'bull', 'gains', 'rises', 'jumps', 'high', 'record', 'adoption', 'bullish', 'growth', 'partnership', 'launch', 'approved', 'listed'];
  const bearish = ['crash', 'plunge', 'fall', 'drop', 'bear', 'dump', 'low', 'hack', 'scam', 'fraud', 'ban', 'lawsuit', 'fine', 'bearish', 'warning', 'risk', 'exploit', 'breach', 'delist'];

  const bullScore = bullish.filter(w => lower.includes(w)).length;
  const bearScore = bearish.filter(w => lower.includes(w)).length;

  if (bullScore > bearScore) return { icon: '📈', color: 'text-green-400' };
  if (bearScore > bullScore) return { icon: '📉', color: 'text-red-400' };
  return { icon: '📰', color: 'text-gray-400' };
}

export default function NewsSection({ ticker }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fetched, setFetched] = useState(false);

  const highlightedNews = news.filter(n => isHighlighted(n.title));

  const fetchNews = () => {
    if (fetched || loading) return;
    setLoading(true);
    setError(null);

    fetch(`/api/news?ticker=${encodeURIComponent(ticker)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.news && Array.isArray(data.news)) {
          setNews(data.news);
          setFetched(true);
        } else {
          setError('Nenhuma notícia encontrada');
        }
      })
      .catch(err => {
        console.error('NewsSection error:', err);
        setError('Falha ao buscar notícias.');
      })
      .finally(() => setLoading(false));
  };

  // Reset when ticker changes
  useEffect(() => {
    setNews([]);
    setFetched(false);
    setExpanded(false);
    setError(null);
  }, [ticker]);

  const handleToggle = () => {
    if (!expanded && !fetched) fetchNews();
    setExpanded(prev => !prev);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-2 p-5 hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="text-xl">📡</span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">Notícias Relevantes</h3>
          {!expanded && highlightedNews.length === 0 && !fetched && (
            <p className="text-xs text-gray-500 mt-0.5">Clique para ver notícias de regulação, upgrades e eventos importantes</p>
          )}
          {!expanded && highlightedNews.length > 0 && (
            <p className="text-xs text-orange-400 mt-0.5">⚠️ {highlightedNews.length} notícia{highlightedNews.length > 1 ? 's' : ''} relevante{highlightedNews.length > 1 ? 's' : ''} para tokenomics</p>
          )}
        </div>
        <span className="text-gray-500 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-800">
          {loading && (
            <div className="flex items-center gap-3 text-gray-400 py-4">
              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full" />
              <span className="text-sm">Buscando notícias sobre {ticker}...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-sm text-red-400 bg-red-900/20 rounded-lg p-3 border border-red-800 mt-3">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && news.length === 0 && fetched && (
            <p className="text-sm text-gray-500 mt-3">Nenhuma notícia encontrada para {ticker}.</p>
          )}

          {!loading && news.length > 0 && (
            <div className="space-y-2 mt-3">
              {news.map((item, i) => {
                const sentiment = getSentimentIcon(item.title);
                const highlighted = isHighlighted(item.title);
                return (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex gap-3 p-3 rounded-lg border transition-all group ${
                      highlighted
                        ? 'bg-orange-900/10 border-orange-800/40 hover:border-orange-600'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{sentiment.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <p className="text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug flex-1">
                          {item.title}
                        </p>
                        {highlighted && (
                          <span className="text-xs bg-orange-900/60 text-orange-300 px-1.5 py-0.5 rounded flex-shrink-0">destaque</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {item.source && (
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">{item.source}</span>
                        )}
                        {item.pubDate && (
                          <span className="text-xs text-gray-600">· {formatDate(item.pubDate)}</span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-600 mt-4 text-center">
            Fontes: CoinDesk · Cointelegraph · Decrypt · Apenas informativo · Não é conselho financeiro
          </p>
        </div>
      )}
    </div>
  );
}
