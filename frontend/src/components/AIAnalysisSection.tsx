import { useMemo, useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { generateAnalysisText } from '../utils/textAnalysis';

interface Props {
  analysis: AnalysisResult;
}

export default function AIAnalysisSection({ analysis }: Props) {
  const text = useMemo(() => generateAnalysisText(analysis), [analysis]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    // Stop any ongoing speech when analysis changes
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [analysis]);

  const speak = (textToSpeak: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#0d1421', borderColor: '#4f8eff40' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style={{ backgroundColor: 'rgba(79,142,255,0.15)', border: '1px solid #4f8eff40' }}
        >
          🤖
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#4f8eff' }}>
            Análise Tokenômica — Gerada por IA
          </h3>
          <p className="text-xs" style={{ color: '#4b5563' }}>
            Síntese automática baseada nos dados analisados
          </p>
        </div>
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
          style={{ backgroundColor: 'rgba(79,142,255,0.1)', color: '#4f8eff', border: '1px solid #4f8eff30' }}
        >
          IA Local
        </span>
      </div>

      <div
        className="p-4 rounded-xl text-sm leading-relaxed"
        style={{
          backgroundColor: 'rgba(79,142,255,0.05)',
          color: '#d1d5db',
          borderLeft: '3px solid #4f8eff',
        }}
      >
        {text}
      </div>

      {/* Audio play button */}
      {supported && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={isPlaying ? stop : () => speak(text)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 14px',
              borderRadius: 8,
              border: `1px solid ${isPlaying ? '#ff6b6b60' : '#4f8eff60'}`,
              backgroundColor: isPlaying ? 'rgba(255,61,61,0.12)' : 'rgba(79,142,255,0.12)',
              color: isPlaying ? '#ff6b6b' : '#4f8eff',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            <img
              src="/occy-avatar.jpg"
              alt="Occy"
              style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <span>{isPlaying ? '🔊' : '🔈'}</span>
            <span>{isPlaying ? '⏹ Parar' : 'Ouvir análise'}</span>
          </button>
        </div>
      )}

      <p className="text-xs mt-3" style={{ color: '#374151' }}>
        ⚠️ Análise gerada automaticamente com base em dados públicos. Não constitui conselho financeiro. Faça sua própria pesquisa (DYOR).
      </p>
    </div>
  );
}
