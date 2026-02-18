import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

interface ExternalLink {
  label: string;
  url: string;
  icon: string;
  color: string;
}

export default function LinksSection({ analysis }: Props) {
  const { token } = analysis;
  const coinGeckoId = token.id;
  const symbol = token.symbol?.toLowerCase() ?? '';

  const links: ExternalLink[] = [
    {
      label: 'CoinGecko',
      url: `https://www.coingecko.com/en/coins/${coinGeckoId}`,
      icon: '🦎',
      color: '#8dc63f',
    },
    {
      label: 'TokenUnlocks',
      url: `https://token.unlocks.app/${symbol}`,
      icon: '🔓',
      color: '#4f8eff',
    },
    {
      label: 'Messari',
      url: `https://messari.io/asset/${coinGeckoId}`,
      icon: '📊',
      color: '#a855f7',
    },
    {
      label: 'DeFiLlama',
      url: `https://defillama.com/unlocks/${coinGeckoId}`,
      icon: '🦙',
      color: '#22c55e',
    },
  ];

  // Add official website if available
  const homepage = token.links?.homepage?.[0];
  if (homepage) {
    links.unshift({
      label: 'Site Oficial',
      url: homepage,
      icon: '🌐',
      color: '#9ca3af',
    });
  }

  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-sm font-semibold mr-2" style={{ color: '#6b7280' }}>
          🔗 Ver em:
        </span>
        {links.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 hover:scale-105"
            style={{
              backgroundColor: `${link.color}18`,
              color: link.color,
              border: `1px solid ${link.color}40`,
              textDecoration: 'none',
            }}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
            <span style={{ opacity: 0.6 }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
