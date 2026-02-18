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

      <p className="text-xs mt-3" style={{ color: '#374151' }}>
        ⚠️ Análise gerada automaticamente com base em dados públicos. Não constitui conselho financeiro. Faça sua própria pesquisa (DYOR).
      </p>
    </div>
  );
}
