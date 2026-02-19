import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

interface Metrics {
  tvl?: string;
  tvlChange7d?: number;
  tvlChange30d?: number;
  fees24h?: string;
  fees7d?: string;
  fees30d?: string;
  revenue24h?: string;
  revenue30d?: string;
  source: string;
  hasData: boolean;
}

interface MetricsData {
  ticker: string;
  metrics: Metrics;
}

interface Props {
  ticker: string;
}

function ChangeTag({ value }: { value?: number }) {
  if (value === undefined || value === null) return null;
  const isPos = value >= 0;
  return (
    <span
      className="text-xs font-mono px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: isPos ? 'rgba(57,211,83,0.12)' : 'rgba(255,68,68,0.12)',
        color: isPos ? '#39d353' : '#ff4444',
      }}
    >
      {isPos ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function MetricCard({ label, value, sub, change }: { label: string; value?: string; sub?: string; change?: number }) {
  if (!value) return null;
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: '#0d1a0d', border: '1px solid #1a3a1a' }}
    >
      <p className="text-xs font-mono mb-2" style={{ color: '#4a7a4a' }}>{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-bold font-mono" style={{ color: '#e8f5e8' }}>{value}</span>
        {change !== undefined && <ChangeTag value={change} />}
      </div>
      {sub && <p className="text-xs font-mono mt-1" style={{ color: '#2a4a2a' }}>{sub}</p>}
    </div>
  );
}

export default function OnChainMetrics({ ticker }: Props) {
  const { t } = useLanguage();
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setData(null);
    setFetchedAt(null);

    fetch(`/api/metrics?ticker=${encodeURIComponent(ticker)}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: MetricsData | null) => {
        setData(d);
        setFetchedAt(new Date());
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  const m = data?.metrics;
  const hasAnyData = m?.hasData;

  if (loading) {
    return (
      <div
        className="rounded-2xl p-5 border"
        style={{ backgroundColor: '#080d08', borderColor: '#1a3a1a' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span>📡</span>
          <h3 className="text-sm font-bold font-mono" style={{ color: '#39d353' }}>ON-CHAIN METRICS</h3>
        </div>
        <div className="flex items-center gap-3 py-2">
          <div className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" style={{ borderColor: '#39d353', borderTopColor: 'transparent' }} />
          <span className="text-sm font-mono" style={{ color: '#4a7a4a' }}>
            &gt; consultando DeFiLlama...
          </span>
        </div>
      </div>
    );
  }

  if (!hasAnyData) return null;

  const timeStr = fetchedAt
    ? fetchedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        backgroundColor: '#080d08',
        borderColor: '#1a3a1a',
        boxShadow: '0 0 16px rgba(57,211,83,0.05)',
      }}
    >
      {/* Header with LIVE badge */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span>📡</span>
        <h3 className="text-sm font-bold font-mono" style={{ color: '#39d353' }}>
          ON-CHAIN METRICS
        </h3>
        {/* LIVE badge */}
        <span
          className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded"
          style={{
            backgroundColor: 'rgba(57,211,83,0.1)',
            color: '#39d353',
            border: '1px solid rgba(57,211,83,0.3)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#39d353', boxShadow: '0 0 4px #39d353', animation: 'pulse 1.5s infinite' }}
          />
          AO VIVO
        </span>
        <span className="ml-auto text-xs font-mono" style={{ color: '#2a4a2a' }}>
          via DeFiLlama{timeStr ? ` · ${timeStr}` : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {m?.tvl && (
          <MetricCard
            label={t.onchainTVL}
            value={m.tvl}
            change={m.tvlChange7d}
            sub={m.tvlChange30d !== undefined ? `30d: ${m.tvlChange30d >= 0 ? '+' : ''}${m.tvlChange30d.toFixed(1)}%` : undefined}
          />
        )}
        {m?.fees24h && (
          <MetricCard
            label={t.onchainFees24h}
            value={m.fees24h}
            sub={m.fees7d ? `7d: ${m.fees7d}` : undefined}
          />
        )}
        {m?.fees30d && (
          <MetricCard
            label={t.onchainFees30d}
            value={m.fees30d}
          />
        )}
        {m?.revenue24h && (
          <MetricCard
            label={t.onchainRevenue24h}
            value={m.revenue24h}
            sub={m.revenue30d ? `30d: ${m.revenue30d}` : undefined}
          />
        )}
      </div>

      {/* Source transparency */}
      <div
        className="mt-4 pt-3 flex items-center justify-between flex-wrap gap-2"
        style={{ borderTop: '1px solid #0d1a0d' }}
      >
        <p className="text-xs font-mono" style={{ color: '#2a4a2a' }}>
          🔴 dados ao vivo · {t.onchainSource}
        </p>
        <p className="text-xs font-mono" style={{ color: '#1a2e1a' }}>
          cache 15 min · atualizado automaticamente
        </p>
      </div>
    </div>
  );
}
