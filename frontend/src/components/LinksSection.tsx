import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

export default function LinksSection({ analysis }: Props) {
  const { token, tokenomicsSources, tokenomicsLastUpdated } = analysis;
  const coinGeckoId = token.id;
  const symbol = token.symbol?.toLowerCase() ?? '';
  const homepage = token.links?.homepage?.[0];

  const links = [
    homepage ? { label: 'Site Oficial', url: homepage, icon: '🌐' } : null,
    { label: 'CoinGecko', url: `https://www.coingecko.com/en/coins/${coinGeckoId}`, icon: '🦎' },
    { label: 'TokenUnlocks', url: `https://token.unlocks.app/${symbol}`, icon: '🔓' },
    { label: 'Messari', url: `https://messari.io/asset/${coinGeckoId}`, icon: '📊' },
    { label: 'DeFiLlama', url: `https://defillama.com/unlocks/${coinGeckoId}`, icon: '🦙' },
  ].filter(Boolean) as { label: string; url: string; icon: string }[];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      {/* External Links — compact row */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-xs text-gray-600 mr-1">Ver em:</span>
        {links.map(link => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-750 hover:text-white hover:border-gray-600 transition-all"
          >
            {link.icon} {link.label} ↗
          </a>
        ))}
      </div>

      {/* Token-specific sources (only when curated) */}
      {tokenomicsSources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-600">📖 Fontes curadas:</span>
          {tokenomicsSources.map(src => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              {src.label} ↗
            </a>
          ))}
          <span className="text-xs text-gray-700 ml-auto">verificado em {tokenomicsLastUpdated}</span>
        </div>
      )}

      {/* Minimal data sources footnote */}
      <p className="mt-2 text-xs text-gray-700">
        Dados: CoinGecko · DeFiLlama · Curadoria manual
      </p>
    </div>
  );
}
