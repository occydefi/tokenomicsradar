import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

type Transparency = 'high' | 'medium' | 'low' | 'anonymous';

function getConfig(level: Transparency) {
  switch (level) {
    case 'high':
      return {
        label: 'Alta Transparência',
        description: 'Equipe pública, verificável',
        emoji: '🟢',
        color: '#00c853',
        bg: 'rgba(0,200,83,0.08)',
        border: 'rgba(0,200,83,0.2)',
        badge: 'rgba(0,200,83,0.15)',
        barWidth: '100%',
      };
    case 'medium':
      return {
        label: 'Média Transparência',
        description: 'Parcialmente pública',
        emoji: '🟡',
        color: '#ffd600',
        bg: 'rgba(255,214,0,0.08)',
        border: 'rgba(255,214,0,0.2)',
        badge: 'rgba(255,214,0,0.15)',
        barWidth: '66%',
      };
    case 'low':
      return {
        label: 'Baixa Transparência',
        description: 'Maioria anônima',
        emoji: '🟠',
        color: '#ff9800',
        bg: 'rgba(255,152,0,0.08)',
        border: 'rgba(255,152,0,0.2)',
        badge: 'rgba(255,152,0,0.15)',
        barWidth: '33%',
      };
    case 'anonymous':
      return {
        label: 'Anônima',
        description: 'Time não identificado',
        emoji: '🔴',
        color: '#ff3d3d',
        bg: 'rgba(255,61,61,0.08)',
        border: 'rgba(255,61,61,0.2)',
        badge: 'rgba(255,61,61,0.15)',
        barWidth: '8%',
      };
  }
}

export default function TeamTransparencySection({ analysis }: Props) {
  const { teamTransparency, teamNote, token } = analysis;

  if (!teamTransparency) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
      >
        <h3 className="text-lg font-bold text-white mb-4">👥 Transparência do Time</h3>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#0a0e1a' }}>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Dados de transparência da equipe não disponíveis para {token.name}. Pesquise os fundadores e equipe antes de investir.
          </p>
        </div>
      </div>
    );
  }

  const cfg = getConfig(teamTransparency);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">👥 Transparência do Time</h3>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: cfg.badge, color: cfg.color }}
        >
          {cfg.emoji} {cfg.label}
        </span>
      </div>

      {/* Main card */}
      <div
        className="p-4 rounded-xl border mb-4"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{cfg.emoji}</span>
          <div className="flex-1">
            <p className="font-semibold mb-1" style={{ color: cfg.color }}>
              {cfg.label}: {cfg.description}
            </p>
            {teamNote && (
              <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                {teamNote}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transparency bar */}
      <div>
        <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
          <span>Nível de Transparência</span>
          <span style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
        <div className="h-2 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: cfg.barWidth, backgroundColor: cfg.color }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}>
          <span>🔴 Anônima</span>
          <span>🟠 Baixa</span>
          <span>🟡 Média</span>
          <span>🟢 Alta</span>
        </div>
      </div>

      {/* Warning for anonymous/low */}
      {(teamTransparency === 'anonymous' || teamTransparency === 'low') && (
        <div
          className="mt-4 p-3 rounded-xl text-xs"
          style={{
            backgroundColor: teamTransparency === 'anonymous' ? 'rgba(255,61,61,0.08)' : 'rgba(255,152,0,0.08)',
            color: teamTransparency === 'anonymous' ? '#ff3d3d' : '#ff9800',
          }}
        >
          ⚠️ {teamTransparency === 'anonymous'
            ? 'Time anônimo representa risco significativo. Em caso de problemas, não há responsabilidade identificável.'
            : 'Transparência limitada aumenta o risco de accountability insuficiente em caso de problemas no projeto.'}
        </div>
      )}

      <p className="text-xs mt-3 italic" style={{ color: '#4b5563' }}>
        📌 Avaliação baseada em informações públicas disponíveis. Faça sua própria pesquisa (DYOR).
      </p>
    </div>
  );
}
