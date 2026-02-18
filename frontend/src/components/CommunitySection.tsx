import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
}

function formatCount(n: number | null | undefined): string {
  if (n === null || n === undefined || n === 0) return 'N/D';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatPct(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'N/D';
  return `${n.toFixed(1)}%`;
}

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}) {
  const isND = value === 'N/D';
  return (
    <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#0a0e1a' }}>
      <p className="text-xs mb-1" style={{ color: '#6b7280' }}>
        {icon} {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: isND ? '#4b5563' : '#e5e7eb' }}
      >
        {value}
      </p>
      {sub && <p className="text-xs mt-1" style={{ color: '#4b5563' }}>{sub}</p>}
    </div>
  );
}

export default function CommunitySection({ analysis }: Props) {
  const { token, communityStrength } = analysis;
  const cd = token.community_data;
  const dd = token.developer_data;
  const sentimentUp = token.sentiment_votes_up_percentage;

  const twitterFollowers = cd?.twitter_followers ?? null;
  const redditSubscribers = cd?.reddit_subscribers ?? null;
  const redditActive = cd?.reddit_accounts_active_48h ?? null;
  const ghStars = dd?.stars ?? null;
  const ghForks = dd?.forks ?? null;
  const commits4w = dd?.commit_count_4_weeks ?? null;

  const strengthConfig = {
    strong: { label: 'Comunidade Forte', color: '#00c853', bg: 'rgba(0,200,83,0.1)', emoji: '🔥', width: '100%' },
    medium: { label: 'Comunidade Média', color: '#ffd600', bg: 'rgba(255,214,0,0.1)', emoji: '📊', width: '55%' },
    weak:   { label: 'Comunidade Fraca', color: '#ff3d3d', bg: 'rgba(255,61,61,0.1)', emoji: '📉', width: '15%' },
  };

  const cfg = communityStrength ? strengthConfig[communityStrength] : strengthConfig.medium;

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ backgroundColor: '#111827', borderColor: '#1e2a45' }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">🌐 Reputação & Comunidade</h3>
        {communityStrength && (
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {cfg.emoji} {cfg.label}
          </span>
        )}
      </div>

      {/* Social metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        <MetricCard
          icon="🐦"
          label="Twitter"
          value={formatCount(twitterFollowers)}
          sub="seguidores"
        />
        <MetricCard
          icon="📰"
          label="Reddit"
          value={formatCount(redditSubscribers)}
          sub="inscritos"
        />
        <MetricCard
          icon="👥"
          label="Reddit Ativos"
          value={formatCount(redditActive)}
          sub="últimas 48h"
        />
        <MetricCard
          icon="⭐"
          label="GitHub Stars"
          value={formatCount(ghStars)}
          sub="estrelas"
        />
        <MetricCard
          icon="🍴"
          label="GitHub Forks"
          value={formatCount(ghForks)}
          sub="forks"
        />
        <MetricCard
          icon="💻"
          label="Commits"
          value={formatCount(commits4w)}
          sub="últimas 4 semanas"
        />
      </div>

      {/* Sentiment bar */}
      {sentimentUp !== null && sentimentUp !== undefined && (
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
            <span>😊 Sentimento Positivo</span>
            <span style={{ color: sentimentUp >= 60 ? '#00c853' : sentimentUp >= 40 ? '#ffd600' : '#ff3d3d' }}>
              {formatPct(sentimentUp)}
            </span>
          </div>
          <div className="h-3 rounded-full relative" style={{ backgroundColor: '#1e2a45' }}>
            <div
              className="h-3 rounded-full"
              style={{
                width: `${Math.min(sentimentUp, 100)}%`,
                backgroundColor: sentimentUp >= 60 ? '#00c853' : sentimentUp >= 40 ? '#ffd600' : '#ff3d3d',
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}>
            <span>😡 0%</span>
            <span>Neutro 50%</span>
            <span>😊 100%</span>
          </div>
        </div>
      )}

      {/* Community strength meter */}
      {communityStrength && (
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
            <span>Força da Comunidade</span>
            <span style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: '#1e2a45' }}>
            <div
              className="h-2 rounded-full"
              style={{ width: cfg.width, backgroundColor: cfg.color }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}>
            <span>Fraca</span>
            <span>Média</span>
            <span>Forte</span>
          </div>
        </div>
      )}

      {/* Dev activity note */}
      {commits4w !== null && commits4w === 0 && (
        <div
          className="mt-4 p-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(255,61,61,0.08)', color: '#ff3d3d' }}
        >
          ⚠️ Nenhum commit no GitHub nas últimas 4 semanas — possível estagnação do desenvolvimento.
        </div>
      )}
      {commits4w !== null && commits4w > 200 && (
        <div
          className="mt-4 p-3 rounded-xl text-xs"
          style={{ backgroundColor: 'rgba(0,200,83,0.08)', color: '#00c853' }}
        >
          ✅ Alta atividade de desenvolvimento ({commits4w} commits em 4 semanas) — projeto ativamente mantido.
        </div>
      )}

      <p className="text-xs mt-3 italic" style={{ color: '#4b5563' }}>
        📌 Dados via CoinGecko API • Atualizado em tempo real
      </p>
    </div>
  );
}
