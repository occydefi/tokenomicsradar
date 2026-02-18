import { useMemo } from 'react';
import type { AnalysisResult } from '../types';
import { generateAnalysisText } from '../utils/textAnalysis';

interface Props {
  analysis: AnalysisResult;
}

export default function AIAnalysisSection({ analysis }: Props) {
  const text = useMemo(() => generateAnalysisText(analysis), [analysis]);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: '#0d1a0d', borderColor: 'rgba(57,211,83,0.25)' }}
    >
      {/* Header — Occy branding */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 font-bold"
          style={{
            background: 'linear-gradient(135deg, #39d353 0%, #a855f7 100%)',
            boxShadow: '0 0 10px rgba(57,211,83,0.3)',
            color: '#070d07',
          }}
        >
          👺
        </div>
        <div>
          <h3 className="text-sm font-bold font-mono" style={{ color: '#39d353' }}>
            Análise Occy
          </h3>
          <p className="text-xs" style={{ color: '#4a7a4a' }}>
            Síntese tokenômica — curadoria + dados on-chain
          </p>
        </div>
        <span
          className="ml-auto text-xs px-2 py-1 rounded font-mono font-semibold"
          style={{
            backgroundColor: 'rgba(57,211,83,0.1)',
            color: '#39d353',
            border: '1px solid rgba(57,211,83,0.25)',
          }}
        >
          v2.0
        </span>
      </div>

      {/* Analysis text — terminal style */}
      <div
        className="p-4 rounded-xl text-sm leading-relaxed font-mono"
        style={{
          backgroundColor: 'rgba(57,211,83,0.04)',
          color: '#c8e6c8',
          borderLeft: '3px solid #39d353',
        }}
      >
        <span style={{ color: '#39d353', opacity: 0.6 }}>{'> '}</span>
        {text}
      </div>

      <p className="text-xs mt-3" style={{ color: '#2a4a2a' }}>
        ⚠️ DYOR — não é conselho financeiro. Análise baseada em dados públicos curados pelo Occy.
      </p>
    </div>
  );
}
