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
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isPos ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
      {isPos ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function MetricCard({ label, value, sub, change }: { label: string; value?: string; sub?: string; change?: number }) {
  if (!value) return null;
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-base font-bold text-white">{value}</span>
        {change !== undefined && <ChangeTag value={change} />}
      </div>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function OnChainMetrics({ ticker }: Props) {
  const [data, setData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setData(null);

    fetch(`/api/metrics?ticker=${encodeURIComponent(ticker)}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: MetricsData | null) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  const m = data?.metrics;
  const hasAnyData = m?.hasData;

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📊</span>
          <h3 className="text-lg font-bold text-white">Métricas On-Chain</h3>
        </div>
        <div className="flex items-center gap-3 text-gray-400 py-2">
          <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full" />
          <span className="text-sm">Buscando dados on-chain...</span>
        </div>
      </div>
    );
  }

  if (!hasAnyData) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-lg font-bold text-white">Métricas On-Chain</h3>
        <span className="text-xs text-gray-500 ml-auto">via DeFiLlama</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {m?.tvl && (
          <MetricCard
            label="TVL (Total Value Locked)"
            value={m.tvl}
            change={m.tvlChange7d}
            sub={m.tvlChange30d !== undefined ? `30d: ${m.tvlChange30d >= 0 ? '+' : ''}${m.tvlChange30d.toFixed(1)}%` : undefined}
          />
        )}
        {m?.fees24h && (
          <MetricCard
            label="Taxas (24h)"
            value={m.fees24h}
            sub={m.fees7d ? `7d: ${m.fees7d}` : undefined}
          />
        )}
        {m?.fees30d && (
          <MetricCard
            label="Taxas (30d)"
            value={m.fees30d}
          />
        )}
        {m?.revenue24h && (
          <MetricCard
            label="Receita do Protocolo (24h)"
            value={m.revenue24h}
            sub={m.revenue30d ? `30d: ${m.revenue30d}` : undefined}
          />
        )}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Dados de TVL, taxas e receita via DeFiLlama · Atualizado a cada 15 min
      </p>
    </div>
  );
}
