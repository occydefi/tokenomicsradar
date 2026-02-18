import { useState, useEffect } from 'react';

const INTRO_TEXT =
  'Olá! Sou o Occy, seu analista de tokenomics. Antes de investir em qualquer token, analise a distribuição do supply: quanto vai para o time, investidores e comunidade. Fique de olho nos red flags como supply concentrado, sem vesting ou FDV muito maior que o Market Cap. Use o TokenomicsRadar para comparar dois tokens lado a lado e tome decisões mais inteligentes!';

export default function OccyWidget() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(INTRO_TEXT);
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

  const handleClose = () => {
    stop();
    setOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}
    >
      {/* Expanded panel */}
      {open && (
        <div
          style={{
            width: 300,
            backgroundColor: '#1e2a45',
            border: '1px solid #2d3f6b',
            borderRadius: 16,
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'occySlideUp 0.2s ease-out',
          }}
        >
          {/* Panel header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img
              src="/occy-avatar.jpg"
              alt="Occy"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #4f8eff',
                boxShadow: '0 0 10px rgba(79,142,255,0.4)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#c8d4f0', fontSize: 15 }}>
                Occy 🧌
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Analista de Tokenomics</p>
            </div>
            <button
              onClick={handleClose}
              title="Fechar"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: 18,
                lineHeight: 1,
                padding: 4,
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.color = '#c8d4f0')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.color = '#6b7280')}
            >
              ×
            </button>
          </div>

          {/* Intro text */}
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: '#d1d5db',
              margin: '0 0 14px 0',
              padding: '10px 12px',
              backgroundColor: 'rgba(79,142,255,0.06)',
              borderRadius: 10,
              borderLeft: '3px solid #4f8eff',
            }}
          >
            {INTRO_TEXT}
          </p>

          {/* Audio button */}
          {supported && (
            <button
              onClick={isPlaying ? stop : speak}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: '1px solid #4f8eff60',
                backgroundColor: isPlaying ? 'rgba(255,61,61,0.15)' : 'rgba(79,142,255,0.15)',
                color: isPlaying ? '#ff6b6b' : '#4f8eff',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              <img
                src="/occy-avatar.jpg"
                alt=""
                style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
              />
              {isPlaying ? '⏹ Parar' : '▶ Ouvir'}
            </button>
          )}
        </div>
      )}

      {/* Floating avatar button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        title="Occy — Seu analista de tokenomics"
        style={{
          position: 'relative',
          width: 56,
          height: 56,
          borderRadius: '50%',
          padding: 0,
          border: '2px solid #4f8eff',
          cursor: 'pointer',
          background: 'none',
          boxShadow: '0 0 16px rgba(79,142,255,0.45)',
          animation: open ? 'none' : 'occyPulse 2.5s ease-in-out infinite',
        }}
      >
        <img
          src="/occy-avatar.jpg"
          alt="Occy"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* "?" badge */}
        {!open && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: '#4f8eff',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0a0e1a',
              lineHeight: 1,
            }}
          >
            ?
          </span>
        )}
      </button>

      {/* Keyframe styles injected via style tag */}
      <style>{`
        @keyframes occyPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(79,142,255,0.45); }
          50% { box-shadow: 0 0 28px rgba(79,142,255,0.75); }
        }
        @keyframes occySlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
