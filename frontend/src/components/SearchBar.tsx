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
      <div
        className="flex items-center rounded-xl border p-2 gap-2 transition-all duration-200"
        style={{
          backgroundColor: '#0d1a0d',
          borderColor: focused ? '#39d353' : '#1a2e1a',
          boxShadow: focused
            ? '0 0 16px rgba(57, 211, 83, 0.25)'
            : '0 0 8px rgba(57, 211, 83, 0.05)',
        }}
      >
        <span className="text-xl px-2" style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(80deg)' }}>🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? "Pesquisar token... (BTC, ETH, SOL)"}
          className="flex-1 bg-transparent text-lg outline-none text-white"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: '#e2e8e2',
          }}
          disabled={loading}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="px-6 py-3 rounded-lg font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-mono"
          style={{
            background: loading
              ? '#1a2e1a'
              : 'linear-gradient(135deg, #39d353, #22a83a)',
            color: '#070d07',
            boxShadow: loading ? 'none' : '0 0 12px rgba(57, 211, 83, 0.4)',
          }}
        >
          {loading ? '...' : 'Analisar'}
        </button>
      </div>
    </div>
  );
}
