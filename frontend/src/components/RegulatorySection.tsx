import { useLanguage } from '../contexts/LanguageContext';
import type { AnalysisResult } from '../types';
import { REGULATORY_DATA } from '../utils/regulatoryData';
import type { RegulatoryEntry } from '../utils/regulatoryData';

interface Props {
  analysis: AnalysisResult;
}

function getSeverityColors(severity: RegulatoryEntry['severity']) {
  if (severity === 'high') {
    return {
      bg: 'rgba(255,61,61,0.08)',
      border: '#ff3d3d40',
      badge: 'rgba(255,61,61,0.15)',
      text: '#ff3d3d',
      icon: '🔴',
    };
  }
  if (severity === 'medium') {
    return {
      bg: 'rgba(255,214,0,0.08)',
      border: '#ffd60040',
      badge: 'rgba(255,214,0,0.15)',
      text: '#ffd600',
      icon: '🟡',
    };
  }
  return {
    bg: 'rgba(79,142,255,0.08)',
    border: '#4f8eff40',
    badge: 'rgba(79,142,255,0.15)',
    text: '#4f8eff',
    icon: '🔵',
  };
}

function getStatusLabel(status: RegulatoryEntry['status']): { emoji: string; label: string } {
  switch (status) {
    case 'lawsuit':      return { emoji: '🔴', label: 'Processo Judicial' };
    case 'sanctioned':   return { emoji: '🔴', label: 'Sancionado' };
    case 'investigation':return { emoji: '🟡', label: 'Investigação' };
    case 'warning':      return { emoji: '🟡', label: 'Alerta Regulatório' };
    case 'settled':      return { emoji: '🟢', label: 'Acordo Firmado' };
    case 'clear':        return { emoji: '🟢', label: 'Sem Alertas' };
  }
}

export default function RegulatorySection({ analysis }: Props) {
  const { t } = useLanguage();
  const entry = REGULATORY_DATA[analysis.token.id] ?? null;

  if (!entry) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-white">{t.regSectionTitle}</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ backgroundColor: 'rgba(0,200,83,0.15)', color: '#00c853' }}
          >
            🟢 Sem Alertas
          </span>
        </div>
        <div
          className="p-4 rounded-xl border flex items-start gap-3"
          style={{ backgroundColor: 'rgba(0,200,83,0.06)', borderColor: 'rgba(0,200,83,0.2)' }}
        >
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold" style={{ color: '#00c853' }}>
              Sem alertas regulatórios conhecidos
            </p>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Não constam processos, sanções ou investigações regulatórias formais para este token em nossa base de dados.
            </p>
            <p className="text-xs mt-2 italic" style={{ color: '#4b5563' }}>
              ⚠️ Isso não significa ausência de risco regulatório. O ambiente regulatório cripto está em constante mudança.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const colors = getSeverityColors(entry.severity);
  const statusLabel = getStatusLabel(entry.status);

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{t.regSectionTitle}</h3>
        <span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{ backgroundColor: colors.badge, color: colors.text }}
        >
          {entry.severity === 'high' ? 'RISCO ALTO' : entry.severity === 'medium' ? 'RISCO MÉDIO' : 'RISCO BAIXO'}
        </span>
      </div>

      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        {/* Status badge row */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.badge, color: colors.text }}
          >
            {statusLabel.emoji} {statusLabel.label}
          </span>
          {entry.source && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#9ca3af' }}
            >
              📋 {entry.source}
            </span>
          )}
          {entry.year && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#9ca3af' }}
            >
              📅 {entry.year}
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
          {entry.summary}
        </p>
      </div>

      <p className="text-xs mt-3 italic" style={{ color: '#4b5563' }}>
        ⚠️ Informações baseadas em dados públicos disponíveis. Consulte fontes oficiais antes de qualquer decisão de investimento.
      </p>
    </div>
  );
}
