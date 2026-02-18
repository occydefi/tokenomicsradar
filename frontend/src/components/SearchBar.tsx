import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface Props {
  onSearch: (ticker: string) => void;
  loading: boolean;
  placeholder?: string;
}

export default function SearchBar({ onSearch, loading, placeholder }: Props) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    const trimmed = value.trim().toUpperCase();
    if (trimmed && !loading) {
      onSearch(trimmed);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Terminal prompt line */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="font-mono text-xs" style={{ color: '#2a4a2a' }}>root@tokenomicsradar:~#</span>
        <span className="font-mono text-xs" style={{ color: '#39d35360' }}>scan_token --ticker=</span>
      </div>

      <div
        className="flex items-center rounded-xl border-2 p-1.5 gap-2 transition-all duration-200 relative overflow-hidden"
        style={{
          backgroundColor: '#060d06',
          borderColor: focused ? '#39d353' : '#1a2e1a',
          boxShadow: focused
            ? '0 0 24px rgba(57,211,83,0.3), inset 0 0 12px rgba(0,0,0,0.5)'
            : '0 0 8px rgba(57,211,83,0.05)',
        }}
      >
        {/* Inner glow when focused */}
        {focused && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(57,211,83,0.04) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Cursor prompt */}
        <span
          className="font-mono text-lg px-2 flex-shrink-0"
          style={{ color: '#39d353', textShadow: '0 0 8px #39d353' }}
        >
          &gt;_
        </span>

        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? "TICKER... (BTC, ETH, SOL, HYPE)"}
          className="flex-1 bg-transparent text-lg outline-none font-mono relative z-10"
          style={{
            color: '#39d353',
            caretColor: '#39d353',
            fontFamily: "'Space Mono', monospace",
          } as React.CSSProperties}
          disabled={loading}
          autoFocus
        />

        {/* Analyze button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="px-6 py-3 rounded-lg font-bold text-sm tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed font-mono uppercase relative z-10 flex-shrink-0"
          style={{
            background: loading
              ? '#0d1a0d'
              : 'linear-gradient(135deg, #39d353 0%, #00c853 100%)',
            color: loading ? '#2a4a2a' : '#060d06',
            border: loading ? '1px solid #1a2e1a' : 'none',
            boxShadow: loading ? 'none' : '0 0 16px rgba(57,211,83,0.5)',
            letterSpacing: '2px',
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#39d353', borderTopColor: 'transparent' }} />
              scan...
            </span>
          ) : (
            <>🧌 SCAN</>
          )}
        </button>
      </div>
    </div>
  );
}
