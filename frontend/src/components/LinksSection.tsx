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
  const { token, tokenomicsSources, tokenomicsLastUpdated } = analysis;
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

  const dataSources = [
    { label: 'Preço & Supply', source: 'CoinGecko', icon: '🦎', url: 'https://coingecko.com' },
    { label: 'Comunidade & Dev', source: 'CoinGecko API', icon: '🦎', url: 'https://coingecko.com' },
    { label: 'Notícias', source: 'Google News', icon: '📡', url: 'https://news.google.com' },
    { label: 'Distribuição & Vesting', source: 'Curadoria manual (whitepapers, docs oficiais)', icon: '📋', url: null },
    { label: 'Risco Regulatório', source: 'Curadoria manual (SEC, OFAC, DOJ)', icon: '🏛️', url: null },
  ];

  return (
    <div className="rounded-2xl border p-4 space-y-4" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      {/* External Links */}
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

      {/* Data Sources */}
      <div className="border-t pt-3" style={{ borderColor: '#1e2a45' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#4b5563' }}>📌 Fontes dos dados:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
          {dataSources.map(ds => (
            <div key={ds.label} className="flex items-start gap-2 text-xs" style={{ color: '#6b7280' }}>
              <span>{ds.icon}</span>
              <span>
                <span style={{ color: '#9ca3af' }}>{ds.label}:</span>{' '}
                {ds.url ? (
                  <a href={ds.url} target="_blank" rel="noopener noreferrer"
                    className="hover:underline" style={{ color: '#4f8eff' }}>
                    {ds.source}
                  </a>
                ) : (
                  <span>{ds.source}</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Token-specific sources */}
        {tokenomicsSources.length > 0 && (
          <div className="mt-2 pt-2 border-t" style={{ borderColor: '#1e2a45' }}>
            <p className="text-xs mb-1.5" style={{ color: '#4b5563' }}>
              📖 Fontes específicas — {token.name} <span style={{ color: '#374151' }}>(verificado em {tokenomicsLastUpdated})</span>:
            </p>
            <div className="flex flex-wrap gap-2">
              {tokenomicsSources.map(src => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'rgba(79,142,255,0.1)', color: '#4f8eff', border: '1px solid rgba(79,142,255,0.25)' }}
                >
                  {src.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Fallback when no specific sources */}
        {tokenomicsSources.length === 0 && (
          <div className="mt-1.5">
            <a
              href={`https://www.coingecko.com/en/coins/${coinGeckoId}#tokenomics`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: '#4f8eff' }}
            >
              📖 Ver tokenomics de {token.name} no CoinGecko ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
