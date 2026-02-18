import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface Props {
  onSearch: (ticker: string) => void;
  loading: boolean;
  placeholder?: string;
}

export default function SearchBar({ onSearch, loading, placeholder }: Props) {
  const [value, setValue] = useState('');

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
        className="flex items-center rounded-2xl border p-2 gap-2 transition-all duration-200"
        style={{
          backgroundColor: '#111827',
          borderColor: '#1e2a45',
          boxShadow: '0 0 20px rgba(79, 142, 255, 0.1)',
        }}
      >
        <span className="text-2xl px-2">🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          placeholder={placeholder ?? "Digite o ticker do token (ex: BTC, SOL, ETH...)"}
          className="flex-1 bg-transparent text-lg outline-none placeholder-gray-600 text-white"
          style={{ fontFamily: "'Space Mono', monospace" }}
          disabled={loading}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !value.trim()}
          className="px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading
              ? '#1e2a45'
              : 'linear-gradient(135deg, #4f8eff, #00e5ff)',
            boxShadow: loading ? 'none' : '0 0 15px rgba(79, 142, 255, 0.4)',
          }}
        >
          {loading ? '...' : 'Analisar'}
        </button>
      </div>
    </div>
  );
}
