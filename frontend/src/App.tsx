import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import TokenHeader from './components/TokenHeader';
import CompareView from './components/CompareView';
import AnalysisTabs from './components/AnalysisTabs';
import OccyWidget from './components/OccyWidget';
import Background from './components/Background';
import MCSimulator from './components/MCSimulator';
import { useLanguage, LangToggle } from './contexts/LanguageContext';
import type { AnalysisResult } from './types';
import { searchToken } from './services/coingecko';
import { analyzeToken, DATA_LAST_UPDATED } from './utils/analyzer';

function App() {
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [mcSimMode, setMcSimMode] = useState(() => {
    // Auto-activate simulator if URL has ?sim= param
    const params = new URLSearchParams(window.location.search);
    return params.has('sim');
  });
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
    setMcSimMode(false);
    setAnalysis2(null);
    setError2(null);
  };

  const toggleMcSim = () => {
    setMcSimMode(prev => !prev);
    setCompareMode(false);
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#070d07' }}>
      <Background />
      {/* Content wrapper — above background */}
      <div className="relative" style={{ zIndex: 1 }}>

      {/* Header */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-sm"
        style={{ borderColor: '#1a2e1a', backgroundColor: 'rgba(7,13,7,0.97)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src="/logo-satellite.png" 
              alt="TokenomicsRadar"
              className="flex-shrink-0"
              style={{ 
                width: '40px', 
                height: '40px',
                filter: 'drop-shadow(0 0 8px rgba(57,211,83,0.6))' 
              }}
            />
            <div className="min-w-0">
              <h1
                className="text-base sm:text-xl font-bold font-mono tracking-tight truncate"
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
              <p className="text-xs font-mono hidden sm:block" style={{ color: '#4a7a4a' }}>
                <span style={{ color: '#39d353' }}>&gt;</span> {t.tagline.replace('> ', '')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* MC Sim toggle */}
            <button
              onClick={toggleMcSim}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all hover:opacity-90 font-mono"
              style={
                mcSimMode
                  ? { backgroundColor: '#00e5ff', color: '#060d06', boxShadow: '0 0 12px rgba(0,229,255,0.4)' }
                  : { backgroundColor: 'rgba(0,229,255,0.08)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.25)' }
              }
            >
              <span className="hidden sm:inline">{t.btnSimulator}</span>
              <img 
                src="/icon-simulator.png" 
                alt="Sim"
                className="sm:hidden"
                style={{ width: '28px', height: '28px' }}
              />
            </button>
            {/* Compare toggle */}
            <button
              onClick={toggleCompareMode}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold transition-all hover:opacity-90 font-mono"
              style={
                compareMode
                  ? { backgroundColor: '#39d353', color: '#070d07', boxShadow: '0 0 12px rgba(57,211,83,0.4)' }
                  : { backgroundColor: 'rgba(57,211,83,0.08)', color: '#39d353', border: '1px solid rgba(57,211,83,0.25)' }
              }
            >
              <span className="hidden sm:inline">{compareMode ? t.btnCompareOn : t.btnCompare}</span>
              <img 
                src="/icon-compare.png" 
                alt="Compare"
                className="sm:hidden"
                style={{ width: '28px', height: '28px' }}
              />
            </button>
            <LangToggle />
            <a
              href="https://github.com/occydefi/tokenomicsradar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:opacity-80 font-mono hidden md:block"
              style={{ color: '#a855f7' }}
            >
              {t.btnGithub}
            </a>
          </div>
        </div>
      </header>

      {/* MC Simulator mode */}
      {mcSimMode && <MCSimulator />}

      {/* Hero / Search */}
      {!mcSimMode && (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2
            className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 font-mono"
            style={{
              color: '#39d353',
              textShadow: '0 0 20px rgba(57,211,83,0.4)',
              letterSpacing: '-1px',
            }}
          >
            {compareMode ? t.heroTitleCompare : t.heroTitle}
          </h2>
          <p className="text-sm sm:text-lg font-mono" style={{ color: '#4a7a4a' }}>
            {compareMode
              ? t.heroSubtitleCompare
              : t.heroSubtitle}
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
              <p className="font-mono" style={{ color: '#4a7a4a' }}>{t.loadingText}</p>
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
            <img
              src="/logo-satellite.png"
              alt="TokenomicsRadar"
              className="mb-4"
              style={{ 
                width: '96px', 
                height: '96px',
                filter: 'drop-shadow(0 0 16px rgba(57,211,83,0.5))' 
              }}
            />
            <p
              className="text-lg mb-2 font-mono"
              style={{ color: '#39d353', textShadow: '0 0 10px rgba(57,211,83,0.4)' }}
            >
              {t.systemReady}
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
          <p className="text-sm flex items-center justify-center gap-2">
            <img src="/logo-satellite.png" alt="" style={{ width: '18px', height: '18px' }} />
            TokenomicsRadar —{' '}
            dados via{' '}
            <a href="https://coingecko.com" className="hover:opacity-80 transition-opacity" style={{ color: '#39d353' }}>
              CoinGecko API
            </a>{' '}
            • realtime
          </p>
          <p className="text-xs mt-2" style={{ color: '#39d353', opacity: 0.7 }}>
            🗓️ Dados de tokenomics revisados em <strong>{DATA_LAST_UPDATED}</strong> — atualização manual 1×/mês (top 100)
          </p>
          <p className="text-xs mt-1" style={{ color: '#2a4a2a' }}>
            // fins educacionais // não constitui conselho financeiro // DYOR
          </p>
          {/* by Occy */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <img
              src="/occy-male.jpg"
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
      </div>{/* /content wrapper */}
    </div>
  );
}

export default App;
