import { useState } from 'react';

const INTRO_LINES = [
  { icon: '🚨', text: 'Antes de comprar qualquer altcoin — leia isso.' },
  { icon: '📊', text: 'A maioria das pessoas analisa gráfico. Poucos analisam tokenomics. É justamente aí que os projetos te passam pra trás.' },
  { icon: '⚠️', text: 'Equipe com 40% do supply sem lock? Dump garantido.' },
  { icon: '⚠️', text: 'VC com cliff de 1 ano? Espera a venda em massa.' },
  { icon: '⚠️', text: 'FDV 10x maior que o Market Cap? Você tá pagando o pico.' },
  { icon: '📡', text: 'O TokenomicsRadar analisa tudo isso em segundos:' },
  { icon: '📊', text: 'Distribuição real do supply' },
  { icon: '🚩', text: 'Red flags automáticos' },
  { icon: '⚖️', text: 'Comparação entre 2 tokens lado a lado' },
  { icon: '🔗', text: 'Links para TokenUnlocks, Messari e DeFiLlama' },
  { icon: '🤖', text: 'Análise em português gerada automaticamente' },
  { icon: '✅', text: 'Gratuito. Sem cadastro. Funciona no celular.' },
];

export default function OccyWidget() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
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

          {/* Intro content */}
          <div
            style={{
              backgroundColor: 'rgba(79,142,255,0.06)',
              borderRadius: 10,
              borderLeft: '3px solid #4f8eff',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            {INTRO_LINES.map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, flexShrink: 0, lineHeight: 1.5 }}>{line.icon}</span>
                <span style={{ fontSize: 12, lineHeight: 1.5, color: '#d1d5db' }}>{line.text}</span>
              </div>
            ))}
          </div>
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
