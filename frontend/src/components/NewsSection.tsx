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
  const bullish = ['surge', 'soar', 'rally', 'bull', 'gains', 'rises', 'jumps', 'high', 'record', 'pump', 'moon', 'up ', 'adoption', 'bullish', 'growth', 'partnership', 'launch', 'approved', 'listed'];
  const bearish = ['crash', 'plunge', 'fall', 'drop', 'bear', 'sell', 'dump', 'down', 'low', 'hack', 'scam', 'fraud', 'ban', 'sec', 'lawsuit', 'fine', 'bearish', 'warning', 'risk', 'concern'];

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

  useEffect(() => {
    if (!ticker) return;

    setLoading(true);
    setError(null);
    setNews([]);

    // In dev, call the local Vercel dev server; in prod, call /api/news
    const apiUrl = `/api/news?ticker=${encodeURIComponent(ticker)}`;

    fetch(apiUrl)
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
        setError('Falha ao buscar notícias. Tente novamente.');
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📡</span>
        <h3 className="text-lg font-bold text-white">Notícias Recentes</h3>
        <span className="text-xs text-gray-500 ml-auto">CoinDesk · CoinTelegraph · Decrypt</span>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 py-4">
          <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" />
          <span className="text-sm">Buscando notícias sobre {ticker}...</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-red-400 bg-red-900/20 rounded-lg p-3 border border-red-800">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <p className="text-sm text-gray-500">Nenhuma notícia encontrada para {ticker}.</p>
      )}

      {!loading && news.length > 0 && (
        <div className="space-y-3">
          {news.map((item, i) => {
            const sentiment = getSentimentIcon(item.title);
            return (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 transition-all group"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{sentiment.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </p>
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
        Fontes especializadas em crypto · Apenas informativo · Não é conselho financeiro
      </p>
    </div>
  );
}
