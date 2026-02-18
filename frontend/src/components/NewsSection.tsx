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

// Keywords that make news relevant to tokenomics evaluation
const HIGHLIGHT_KEYWORDS = [
  'sec', 'lawsuit', 'regulation', 'regulatory', 'ban', 'illegal',
  'hack', 'exploit', 'vulnerability', 'stolen', 'breach',
  'halving', 'burn', 'supply', 'tokenomics', 'fork', 'upgrade',
  'partnership', 'integration', 'adoption', 'institutional',
  'etf', 'approval', 'listing', 'delisting',
  'fine', 'penalty', 'settlement', 'fraud', 'scam',
  'protocol', 'upgrade', 'v2', 'v3', 'mainnet',
  'treasury', 'foundation', 'grant',
];

function isHighlight(title: string): boolean {
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

function getSentimentIcon(title: string): string {
  const lower = title.toLowerCase();
  const bullish = ['surge', 'soar', 'rally', 'gains', 'rises', 'jumps', 'record', 'adoption', 'bullish', 'growth', 'partnership', 'approved', 'listed', 'etf'];
  const bearish = ['crash', 'plunge', 'fall', 'drop', 'dump', 'hack', 'scam', 'fraud', 'ban', 'sec', 'lawsuit', 'fine', 'bearish', 'warning', 'stolen', 'exploit', 'delisting'];
  const bullScore = bullish.filter(w => lower.includes(w)).length;
  const bearScore = bearish.filter(w => lower.includes(w)).length;
  if (bullScore > bearScore) return '📈';
  if (bearScore > bullScore) return '📉';
  return '📰';
}

export default function NewsSection({ ticker }: NewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Separate highlights (always visible when expanded) from general news
  const highlights = news.filter(n => isHighlight(n.title));
  const allNews = news;

  function handleToggle() {
    setExpanded(prev => !prev);
    if (!fetched) {
      setFetched(true);
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
          } else {
            setError('Nenhuma notícia encontrada');
          }
        })
        .catch(err => {
          console.error('NewsSection error:', err);
          setError('Falha ao buscar notícias.');
        })
        .finally(() => setLoading(false));
    }
  }

  // Reset when ticker changes
  useEffect(() => {
    setNews([]);
    setExpanded(false);
    setFetched(false);
    setError(null);
  }, [ticker]);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header — always visible, acts as toggle */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-2 p-5 hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="text-xl">📡</span>
        <h3 className="text-lg font-bold text-white flex-1">Notícias Relevantes</h3>
        {highlights.length > 0 && (
          <span className="text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full px-2 py-0.5">
            {highlights.length} em destaque
          </span>
        )}
        <span className="text-gray-500 text-sm ml-1">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div className="px-5 pb-5">
          {loading && (
            <div className="flex items-center gap-3 text-gray-400 py-4">
              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full" />
              <span className="text-sm">Buscando notícias sobre {ticker}...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-sm text-red-400 bg-red-900/20 rounded-lg p-3 border border-red-800">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && allNews.length === 0 && fetched && (
            <p className="text-sm text-gray-500 py-2">Nenhuma notícia encontrada para {ticker}.</p>
          )}

          {!loading && allNews.length > 0 && (
            <div className="space-y-2">
              {/* Highlights first */}
              {highlights.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-2">
                    ⚡ Em destaque (relevante para avaliação)
                  </p>
                  {highlights.map((item, i) => (
                    <NewsItem key={`h-${i}`} item={item} highlight />
                  ))}
                </div>
              )}

              {/* Rest of the news */}
              {allNews.filter(n => !isHighlight(n.title)).length > 0 && (
                <>
                  {highlights.length > 0 && (
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Outras notícias</p>
                  )}
                  {allNews.filter(n => !isHighlight(n.title)).map((item, i) => (
                    <NewsItem key={`n-${i}`} item={item} />
                  ))}
                </>
              )}
            </div>
          )}

          <p className="text-xs text-gray-600 mt-4">
            CoinDesk · Cointelegraph · Decrypt · Apenas informativo · Não é conselho financeiro
          </p>
        </div>
      )}
    </div>
  );
}

function NewsItem({ item, highlight }: { item: NewsItem; highlight?: boolean }) {
  const icon = getSentimentIcon(item.title);
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex gap-3 p-3 rounded-lg border transition-all group mb-2 ${
        highlight
          ? 'bg-orange-950/30 border-orange-800/40 hover:border-orange-600/60'
          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
      }`}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
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
}
