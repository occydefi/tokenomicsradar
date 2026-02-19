import type { AnalysisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { translateProsCons } from '../i18n/proscons.en';

interface Props {
  analysis: AnalysisResult;
}

export default function ProsConsSection({ analysis }: Props) {
  const { t, lang } = useLanguage();
  const { pros: rawPros, cons: rawCons, token } = analysis;
  const pros = translateProsCons(rawPros, lang);
  const cons = translateProsCons(rawCons, lang);

  return (
    <div className="rounded-2xl border p-6" style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}>
      <h3 className="text-lg font-bold text-white mb-5">
        {t.prosConsSectionTitle} — {token.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pros */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'rgba(0, 200, 83, 0.05)', border: '1px solid rgba(0, 200, 83, 0.2)' }}
        >
          <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#00c853' }}>
            <span>✅</span> {t.prosTitle}
          </h4>
          {pros.length > 0 ? (
            <ul className="space-y-2">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#00c853', flexShrink: 0 }}>◆</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: '#6b7280' }}>{t.prosEmpty}</p>
          )}
        </div>

        {/* Cons */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'rgba(255, 61, 61, 0.05)', border: '1px solid rgba(255, 61, 61, 0.2)' }}
        >
          <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#ff3d3d' }}>
            <span>⚠️</span> {t.consTitle}
          </h4>
          {cons.length > 0 ? (
            <ul className="space-y-2">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#ff3d3d', flexShrink: 0 }}>◆</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: '#6b7280' }}>{t.consEmpty}</p>
          )}
        </div>
      </div>

      <p className="text-xs mt-4" style={{ color: '#4b5563' }}>
        {t.prosConsNote} • {new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR')}
      </p>
    </div>
  );
}
