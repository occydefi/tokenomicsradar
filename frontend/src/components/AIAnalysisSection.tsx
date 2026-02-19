import { useLanguage } from '../contexts/LanguageContext';
import { useMemo } from 'react';
import type { AnalysisResult } from '../types';
import { generateAnalysisText } from '../utils/textAnalysis';

interface Props {
  analysis: AnalysisResult;
}

export default function AIAnalysisSection({ analysis }: Props) {
  const { t } = useLanguage();
  const text = useMemo(() => generateAnalysisText(analysis), [analysis]);

  return (
    <div
      className="rounded-2xl border p-6 relative overflow-hidden"
      style={{
        backgroundColor: '#080d0a',
        borderColor: '#00ff4140',
        boxShadow: '0 0 24px #00ff4115, inset 0 0 40px #00000060',
      }}
    >
      {/* scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
          zIndex: 0,
        }}
      />

      {/* corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: '#00ff41' }} />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: '#00ff41' }} />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: '#00ff41' }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: '#00ff41' }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              backgroundColor: 'rgba(0,255,65,0.08)',
              border: '1px solid #00ff4150',
              boxShadow: '0 0 12px #00ff4120',
            }}
          >
            🧌
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: '#00ff41', fontFamily: 'monospace' }}>
              {t.aiSectionLabel}
            </h3>
            <p className="text-xs font-mono" style={{ color: '#00ff4160' }}>
              {t.aiSectionCmd}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#00ff41', boxShadow: '0 0 6px #00ff41' }}
            />
            <span
              className="text-xs px-2 py-1 rounded font-mono font-bold tracking-wider"
              style={{
                backgroundColor: 'rgba(0,255,65,0.08)',
                color: '#00ff41',
                border: '1px solid #00ff4130',
              }}
            >
              {t.aiSectionBadge}
            </span>
          </div>
        </div>

        {/* Analysis text */}
        <div
          className="p-4 rounded-xl text-sm leading-relaxed font-mono"
          style={{
            backgroundColor: 'rgba(0,255,65,0.04)',
            color: '#a3c9a8',
            borderLeft: '3px solid #00ff41',
          }}
        >
          <span style={{ color: '#00ff4180' }}>{'// '}</span>
          {text}
        </div>

        {/* Footer */}
        <p className="text-xs mt-3 font-mono" style={{ color: '#374151' }}>
          {t.aiSectionFooter}
        </p>
      </div>
    </div>
  );
}
