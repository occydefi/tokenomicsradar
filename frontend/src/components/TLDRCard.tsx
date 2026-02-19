import type { AnalysisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translateProsCons } from '../i18n/proscons.en';
import ScoreFeedback from './ScoreFeedback';
import { useTTS } from '../hooks/useTTS';

interface Props {
  analysis: AnalysisResult;
}

interface ColorConfig {
  bg: string;
  text: string;
  border: string;
  glow: string;
}

function getScoreColors(score: number): ColorConfig {
  if (score >= 8)   return { bg: 'rgba(57, 211, 83, 0.06)',   text: '#39d353', border: 'rgba(57,211,83,0.4)',  glow: 'rgba(57,211,83,0.2)'  };
  if (score >= 5)   return { bg: 'rgba(245, 158, 11, 0.06)',  text: '#f59e0b', border: 'rgba(245,158,11,0.4)', glow: 'rgba(245,158,11,0.2)' };
  return               { bg: 'rgba(255, 68, 68, 0.06)',    text: '#ff4444', border: 'rgba(255,68,68,0.4)',  glow: 'rgba(255,68,68,0.2)'  };
}

export default function TLDRCard({ analysis }: Props) {
  const { t, lang } = useLanguage();
  const { scores, verdict, pros: rawPros, cons: rawCons, conclusion } = analysis;
  const c = getScoreColors(scores.total);
  const { state: ttsState, speak } = useTTS();

  const symbol = analysis.token.symbol?.toUpperCase() ?? '';

  const buildSpeechText = () => {
    const localPros = translateProsCons(rawPros, lang).slice(0, 3);
    const localCons = translateProsCons(rawCons, lang).slice(0, 3);
    if (lang === 'en') {
      return `${symbol} tokenomics analysis. Score: ${scores.total.toFixed(1)} out of 10. Verdict: ${verdict}. ` +
        (localPros.length ? `Highlights: ${localPros.join('. ')}. ` : '') +
        (localCons.length ? `Risks: ${localCons.join('. ')}. ` : '') +
        (conclusion ? conclusion : '');
    }
    return `Análise de tokenomics de ${symbol}. Score: ${scores.total.toFixed(1)} de 10. Veredicto: ${verdict}. ` +
      (localPros.length ? `Destaques: ${localPros.join('. ')}. ` : '') +
      (localCons.length ? `Riscos: ${localCons.join('. ')}. ` : '') +
      (conclusion ? conclusion : '');
  };

  const verdictMap: Record<string, string> = {
    'Excelente': t.verdictExcelente,
    'Bom': t.verdictBom,
    'Regular': t.verdictRegular,
    'Ruim': t.verdictRuim,
    'Evitar': t.verdictEvitar,
  };

  const pros = translateProsCons(rawPros, lang).slice(0, 3);
  const cons = translateProsCons(rawCons, lang).slice(0, 3);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: c.bg,
        borderColor: c.border,
        boxShadow: `0 0 20px ${c.glow}`,
      }}
    >
      {/* Header label + TTS button */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className="text-xs font-bold tracking-widest uppercase font-mono"
          style={{ color: c.text, textShadow: `0 0 8px ${c.glow}` }}
        >
          {t.tldrTitle}
        </span>
        <button
          onClick={() => speak(buildSpeechText())}
          title={ttsState === 'playing' ? 'Parar' : lang === 'en' ? 'Listen to analysis' : 'Ouvir análise'}
          className="flex flex-col items-center justify-center px-4 py-2 rounded-xl font-mono font-bold transition-all hover:opacity-90"
          style={{
            backgroundColor: ttsState !== 'idle' ? `${c.text}20` : '#0f1a0f',
            color: ttsState === 'error' ? '#ff4444' : c.text,
            border: `1.5px solid ${ttsState !== 'idle' ? c.text : c.border}`,
            boxShadow: ttsState === 'loading' ? `0 0 20px ${c.glow}` : ttsState === 'playing' ? `0 0 14px ${c.glow}` : 'none',
            animation: ttsState !== 'idle' ? 'pulse 1s ease-in-out infinite' : 'none',
            minWidth: 56,
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>
            {ttsState === 'loading' ? '⏳' : ttsState === 'playing' ? '⏹' : ttsState === 'error' ? '⚠️' : '🧌'}
          </span>
          <span style={{ fontSize: 10, marginTop: 2, letterSpacing: 1 }}>
            {ttsState === 'loading' ? '...' : ttsState === 'playing' ? 'PARAR' : ttsState === 'error' ? 'ERRO' : lang === 'en' ? 'LISTEN' : 'OUVIR'}
          </span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Score Circle + Badge */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 mb-2"
            style={{
              borderColor: c.text,
              boxShadow: `0 0 20px ${c.glow}, inset 0 0 15px rgba(57,211,83,0.04)`,
              backgroundColor: '#070d07',
            }}
          >
            <span
              className="text-2xl font-bold font-mono"
              style={{
                color: c.text,
                textShadow: `0 0 10px ${c.text}`,
              }}
            >
              {scores.total.toFixed(1)}
            </span>
            <span className="text-xs" style={{ color: '#4a7a4a' }}>/10</span>
          </div>
          <span
            className="text-sm font-bold px-4 py-1 rounded-full font-mono"
            style={{
              color: c.text,
              backgroundColor: `${c.text}15`,
              border: `1px solid ${c.text}50`,
              boxShadow: `0 0 8px ${c.glow}`,
            }}
          >
            {verdictMap[verdict] ?? verdict}
          </span>
        </div>

        {/* Pros & Cons side by side */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Pros */}
          <div>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide font-mono"
              style={{ color: '#39d353', textShadow: '0 0 6px rgba(57,211,83,0.4)' }}
            >
              {t.tldrPros}
            </p>
            <ul className="space-y-2">
              {pros.length > 0 ? (
                pros.map((pro, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#b8d4b8' }}>
                    <span style={{ color: '#39d353', flexShrink: 0, marginTop: 2 }}>＋</span>
                    <span>{pro}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#4a7a4a' }}>
                  {t.tldrNonePos}
                </li>
              )}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <p
              className="text-xs font-bold mb-2 uppercase tracking-wide font-mono"
              style={{ color: '#ff4444', textShadow: '0 0 6px rgba(255,68,68,0.4)' }}
            >
              {t.tldrCons}
            </p>
            <ul className="space-y-2">
              {cons.length > 0 ? (
                cons.map((con, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#b8d4b8' }}>
                    <span style={{ color: '#ff4444', flexShrink: 0, marginTop: 2 }}>－</span>
                    <span>{con}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm" style={{ color: '#4a7a4a' }}>
                  {t.tldrNoneNeg}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* User challenge panel — prominent CTA */}
      <div
        className="mt-6 rounded-xl border p-4"
        style={{
          backgroundColor: 'rgba(255,109,0,0.04)',
          borderColor: 'rgba(255,109,0,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: '#ff6d00' }}>⚖️</span>
          <span className="text-xs font-bold font-mono" style={{ color: '#ff6d00', letterSpacing: '1px' }}>
            DISCORDA DESTA ANÁLISE?
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: '#4a7a4a' }}>
          Se você tem dados que contradizem esta avaliação, apresente seu argumento. A Occy reavalia com base em fatos — não aceita argumentos de preço ou sentimento.
        </p>
        <ScoreFeedback analysis={analysis} />
      </div>
    </div>
  );
}
