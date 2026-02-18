import { useState } from 'react';
import SearchBar from './components/SearchBar';
import TokenHeader from './components/TokenHeader';
import SupplySection from './components/SupplySection';
import DistributionSection from './components/DistributionSection';
import VestingSection from './components/VestingSection';
import UtilitySection from './components/UtilitySection';
import TreasurySection from './components/TreasurySection';
import ProsConsSection from './components/ProsConsSection';
import ScoreSection from './components/ScoreSection';
import RedFlagsSection from './components/RedFlagsSection';
import LinksSection from './components/LinksSection';
import AIAnalysisSection from './components/AIAnalysisSection';
import CompareView from './components/CompareView';
import OccyWidget from './components/OccyWidget';
import type { AnalysisResult } from './types';
import { searchToken } from './services/coingecko';
import { analyzeToken } from './utils/analyzer';

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [analysis2, setAnalysis2] = useState<AnalysisResult | null>(null);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState<string | null>(null);

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    if (compareMode) setAnalysis2(null);

    try {
      const tokenData = await searchToken(ticker);
      const result = analyzeToken(tokenData);
      setAnalysis(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao buscar dados. Verifique o ticker e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch2 = async (ticker: string) => {
    setLoading2(true);
    setError2(null);
    setAnalysis2(null);

    try {
      const tokenData = await searchToken(ticker);
      const result = analyzeToken(tokenData);
      setAnalysis2(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError2(err.message);
      } else {
        setError2('Erro ao buscar dados. Verifique o ticker e tente novamente.');
      }
    } finally {
      setLoading2(false);
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(prev => !prev);
    setAnalysis2(null);
    setError2(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: '#1e2a45', backgroundColor: 'rgba(10,14,26,0.95)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📡</span>
            <div>
              <h1 className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #4f8eff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TokenomicsRadar
              </h1>
              <p className="text-xs" style={{ color: '#6b7280' }}>Análise Tokenômica Profunda</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Compare toggle */}
            <button
              onClick={toggleCompareMode}
              className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
              style={
                compareMode
                  ? { backgroundColor: '#4f8eff', color: '#fff' }
                  : { backgroundColor: 'rgba(79,142,255,0.12)', color: '#4f8eff', border: '1px solid #4f8eff40' }
              }
            >
              ⚖️ {compareMode ? 'Modo Comparação ON' : 'Comparar Tokens'}
            </button>
            <a
              href="https://github.com/occydefi/tokenomicsradar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: '#4f8eff' }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Search */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-3 text-white">
            {compareMode ? '⚖️ Comparar Tokens' : 'Análise Tokenômica Completa'}
          </h2>
          <p className="text-lg" style={{ color: '#9ca3af' }}>
            {compareMode
              ? 'Busque dois tokens para comparar lado a lado'
              : 'Digite o ticker de qualquer criptoativo e receba uma análise detalhada com score 0-10'}
          </p>
        </div>

        {/* Search area */}
        {compareMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token 1 */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#4f8eff' }}>Token A</p>
              <SearchBar onSearch={handleSearch} loading={loading} placeholder="Ex: BTC, ETH, SOL..." />
              {error && (
                <div className="mt-3 p-3 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(255,61,61,0.1)', borderColor: '#ff3d3d', color: '#ff3d3d' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
            {/* Token 2 */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#22c55e' }}>Token B</p>
              <SearchBar onSearch={handleSearch2} loading={loading2} placeholder="Ex: BTC, ETH, SOL..." />
              {error2 && (
                <div className="mt-3 p-3 rounded-xl border text-sm" style={{ backgroundColor: 'rgba(255,61,61,0.1)', borderColor: '#ff3d3d', color: '#ff3d3d' }}>
                  ⚠️ {error2}
                </div>
              )}
            </div>
          </div>
        ) : (
          <SearchBar onSearch={handleSearch} loading={loading} />
        )}

        {/* Error (single mode) */}
        {!compareMode && error && (
          <div className="mt-6 p-4 rounded-xl border text-center" style={{ backgroundColor: 'rgba(255,61,61,0.1)', borderColor: '#ff3d3d', color: '#ff3d3d' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading (single mode) */}
        {!compareMode && loading && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#4f8eff', borderTopColor: 'transparent' }}></div>
              <p style={{ color: '#9ca3af' }}>Buscando dados na blockchain... 🔍</p>
            </div>
          </div>
        )}

        {/* Compare Mode — both loading indicators */}
        {compareMode && (loading || loading2) && (
          <div className="mt-8 flex justify-center gap-8">
            {loading && (
              <div className="flex items-center gap-3" style={{ color: '#9ca3af' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#4f8eff', borderTopColor: 'transparent' }} />
                Buscando Token A...
              </div>
            )}
            {loading2 && (
              <div className="flex items-center gap-3" style={{ color: '#9ca3af' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }} />
                Buscando Token B...
              </div>
            )}
          </div>
        )}

        {/* Compare Mode Results */}
        {compareMode && analysis && analysis2 && !loading && !loading2 && (
          <div className="mt-10 fade-in space-y-6">
            <CompareView analysis1={analysis} analysis2={analysis2} />
          </div>
        )}

        {/* Compare Mode — individual token previews */}
        {compareMode && analysis && !analysis2 && !loading && !loading2 && (
          <div className="mt-8 fade-in">
            <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'rgba(79,142,255,0.05)', borderColor: '#4f8eff40' }}>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                ✅ <strong style={{ color: '#4f8eff' }}>{analysis.token.name}</strong> carregado. Agora busque o Token B para comparar.
              </p>
            </div>
          </div>
        )}

        {/* Single Mode Results */}
        {!compareMode && analysis && !loading && (
          <div className="mt-10 fade-in space-y-6">
            <TokenHeader analysis={analysis} />
            <LinksSection analysis={analysis} />
            <RedFlagsSection analysis={analysis} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SupplySection analysis={analysis} />
              <DistributionSection analysis={analysis} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VestingSection analysis={analysis} />
              <UtilitySection analysis={analysis} />
            </div>
            <TreasurySection analysis={analysis} />
            <ProsConsSection analysis={analysis} />
            <AIAnalysisSection analysis={analysis} />
            <ScoreSection analysis={analysis} />
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && !error && (
          <div className="mt-16 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg mb-2 text-white">Pronto para analisar</p>
            <p style={{ color: '#6b7280' }}>
              Exemplos: <button onClick={() => handleSearch('BTC')} className="hover:opacity-80 mx-1 underline" style={{ color: '#4f8eff' }}>BTC</button>
              <button onClick={() => handleSearch('ETH')} className="hover:opacity-80 mx-1 underline" style={{ color: '#4f8eff' }}>ETH</button>
              <button onClick={() => handleSearch('SOL')} className="hover:opacity-80 mx-1 underline" style={{ color: '#4f8eff' }}>SOL</button>
              <button onClick={() => handleSearch('AVAX')} className="hover:opacity-80 mx-1 underline" style={{ color: '#4f8eff' }}>AVAX</button>
              <button onClick={() => handleSearch('UNI')} className="hover:opacity-80 mx-1 underline" style={{ color: '#4f8eff' }}>UNI</button>
            </p>
          </div>
        )}
      </div>

      {/* Occy floating widget */}
      <OccyWidget />

      {/* Footer */}
      <footer className="border-t mt-20 py-8" style={{ borderColor: '#1e2a45' }}>
        <div className="max-w-6xl mx-auto px-4 text-center" style={{ color: '#6b7280' }}>
          <p className="text-sm">
            📡 TokenomicsRadar — Dados via <a href="https://coingecko.com" className="hover:opacity-80" style={{ color: '#4f8eff' }}>CoinGecko API</a> • Atualizado em tempo real
          </p>
          <p className="text-xs mt-2">
            Este conteúdo é apenas para fins educacionais e não constitui conselho financeiro.
          </p>
          {/* by Occy */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <img
              src="/occy-avatar.jpg"
              alt="Occy"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #4f8eff',
                objectFit: 'cover'
              }}
            />
            <div className="text-left">
              <p className="text-xs font-bold" style={{ color: '#c8d4f0' }}>^OcCy_</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>built by ~OCcY</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
