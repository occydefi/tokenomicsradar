import { useState } from 'react';
import SearchBar from './components/SearchBar';
import TokenHeader from './components/TokenHeader';
import CompareView from './components/CompareView';
import AnalysisTabs from './components/AnalysisTabs';
import OccyWidget from './components/OccyWidget';
import type { AnalysisResult } from './types';
import { searchToken } from './services/coingecko';
import { analyzeToken } from './utils/analyzer';

function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [analysis2, setAnalysis2] = useState<AnalysisResult | null>(null);
  const [loading2, setLoading2] = useState(false);
  const [error2, setError2] = useState<string | null>(null);

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setActiveTab('overview');
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
    <div className="min-h-screen" style={{ backgroundColor: '#070d07' }}>
      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ borderColor: '#1a2e1a', backgroundColor: 'rgba(7,13,7,0.97)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 8px rgba(57,211,83,0.6))' }}>📡</span>
            <div>
              <h1
                className="text-xl font-bold font-mono tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #39d353, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  letterSpacing: '-0.5px',
                }}
              >
                TokenomicsRadar
              </h1>
              <p className="text-xs font-mono" style={{ color: '#4a7a4a' }}>
                <span style={{ color: '#39d353' }}>&gt;</span> análise_tokenômica --deep
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Compare toggle */}
            <button
              onClick={toggleCompareMode}
              className="text-sm px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 font-mono"
              style={
                compareMode
                  ? { backgroundColor: '#39d353', color: '#070d07', boxShadow: '0 0 12px rgba(57,211,83,0.4)' }
                  : { backgroundColor: 'rgba(57,211,83,0.08)', color: '#39d353', border: '1px solid rgba(57,211,83,0.25)' }
              }
            >
              ⚖️ {compareMode ? 'Comparação ON' : 'Comparar'}
            </button>
            <a
              href="https://github.com/occydefi/tokenomicsradar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:opacity-80 font-mono"
              style={{ color: '#a855f7' }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Search */}
      {(
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2
            className="text-4xl font-bold mb-3 font-mono"
            style={{
              color: '#39d353',
              textShadow: '0 0 20px rgba(57,211,83,0.4)',
              letterSpacing: '-1px',
            }}
          >
            {compareMode ? '⚖️ Comparar Tokens' : '> Análise Tokenômica_'}
          </h2>
          <p className="text-lg font-mono" style={{ color: '#4a7a4a' }}>
            {compareMode
              ? 'busque dois tokens para comparar lado a lado'
              : 'insira o ticker de qualquer criptoativo // score 0-10 // DYOR'}
          </p>
        </div>

        {/* Search area */}
        {compareMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Token 1 */}
            <div>
              <p className="text-sm font-semibold mb-2 font-mono" style={{ color: '#39d353' }}>&gt; Token_A</p>
              <SearchBar onSearch={handleSearch} loading={loading} placeholder="Token A... (BTC, ETH, SOL)" />
              {error && (
                <div className="mt-3 p-3 rounded-xl border text-sm font-mono" style={{ backgroundColor: 'rgba(255,68,68,0.08)', borderColor: 'rgba(255,68,68,0.4)', color: '#ff4444' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
            {/* Token 2 */}
            <div>
              <p className="text-sm font-semibold mb-2 font-mono" style={{ color: '#a855f7' }}>&gt; Token_B</p>
              <SearchBar onSearch={handleSearch2} loading={loading2} placeholder="Token B... (BTC, ETH, SOL)" />
              {error2 && (
                <div className="mt-3 p-3 rounded-xl border text-sm font-mono" style={{ backgroundColor: 'rgba(255,68,68,0.08)', borderColor: 'rgba(255,68,68,0.4)', color: '#ff4444' }}>
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
          <div className="mt-6 p-4 rounded-xl border text-center font-mono" style={{ backgroundColor: 'rgba(255,68,68,0.08)', borderColor: 'rgba(255,68,68,0.4)', color: '#ff4444' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading (single mode) */}
        {!compareMode && loading && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#39d353', borderTopColor: 'transparent', boxShadow: '0 0 16px rgba(57,211,83,0.3)' }}></div>
              <p className="font-mono" style={{ color: '#4a7a4a' }}>&gt; buscando dados na blockchain... 🔍</p>
            </div>
          </div>
        )}

        {/* Compare Mode — both loading indicators */}
        {compareMode && (loading || loading2) && (
          <div className="mt-8 flex justify-center gap-8">
            {loading && (
              <div className="flex items-center gap-3 font-mono" style={{ color: '#39d353' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#39d353', borderTopColor: 'transparent' }} />
                &gt; Token_A...
              </div>
            )}
            {loading2 && (
              <div className="flex items-center gap-3 font-mono" style={{ color: '#a855f7' }}>
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#a855f7', borderTopColor: 'transparent' }} />
                &gt; Token_B...
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
            <div className="p-4 rounded-xl border text-center font-mono" style={{ backgroundColor: 'rgba(57,211,83,0.04)', borderColor: 'rgba(57,211,83,0.2)' }}>
              <p className="text-sm" style={{ color: '#4a7a4a' }}>
                ✅ <strong style={{ color: '#39d353' }}>{analysis.token.name}</strong> carregado. Agora busque o Token_B para comparar.
              </p>
            </div>
          </div>
        )}

        {/* Single Mode Results */}
        {!compareMode && analysis && !loading && (
          <div className="mt-10 fade-in space-y-6">
            <TokenHeader analysis={analysis} />
            <AnalysisTabs analysis={analysis} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && !error && (
          <div className="mt-16 text-center">
            <div
              className="text-6xl mb-4"
              style={{ filter: 'drop-shadow(0 0 16px rgba(57,211,83,0.5))' }}
            >
              📡
            </div>
            <p
              className="text-lg mb-2 font-mono"
              style={{ color: '#39d353', textShadow: '0 0 10px rgba(57,211,83,0.4)' }}
            >
              &gt; sistema_pronto_
            </p>
            <p className="font-mono text-sm" style={{ color: '#4a7a4a' }}>
              ex:{' '}
              {['BTC', 'ETH', 'SOL', 'AVAX', 'UNI'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSearch(t)}
                  className="mx-1 transition-opacity hover:opacity-100"
                  style={{ color: '#39d353', opacity: 0.7, textDecoration: 'none' }}
                >
                  [{t}]
                </button>
              ))}
            </p>
          </div>
        )}
      </div>
      )}

      {/* Occy floating widget */}
      <OccyWidget />

      {/* Footer */}
      <footer className="border-t mt-20 py-8" style={{ borderColor: '#1a2e1a' }}>
        <div className="max-w-6xl mx-auto px-4 text-center font-mono" style={{ color: '#4a7a4a' }}>
          <p className="text-sm">
            📡 TokenomicsRadar —{' '}
            dados via{' '}
            <a href="https://coingecko.com" className="hover:opacity-80 transition-opacity" style={{ color: '#39d353' }}>
              CoinGecko API
            </a>{' '}
            • realtime
          </p>
          <p className="text-xs mt-2" style={{ color: '#2a4a2a' }}>
            // fins educacionais // não constitui conselho financeiro // DYOR
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
                border: '2px solid #39d353',
                objectFit: 'cover',
                boxShadow: '0 0 10px rgba(57,211,83,0.3)',
              }}
            />
            <div className="text-left">
              <p className="text-xs font-bold" style={{ color: '#39d353', textShadow: '0 0 6px rgba(57,211,83,0.4)' }}>^OcCy_</p>
              <p className="text-xs" style={{ color: '#4a7a4a' }}>built by ~OCcY // underground crypto tools</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
