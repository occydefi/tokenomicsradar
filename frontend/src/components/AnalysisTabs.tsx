import TLDRCard from './TLDRCard';
import ScoreSection from './ScoreSection';
import ProsConsSection from './ProsConsSection';
import AIAnalysisSection from './AIAnalysisSection';
import SupplySection from './SupplySection';
import DistributionSection from './DistributionSection';
import VestingSection from './VestingSection';
import UtilitySection from './UtilitySection';
import TreasurySection from './TreasurySection';
import RedFlagsSection from './RedFlagsSection';
import RegulatorySection from './RegulatorySection';
import TeamTransparencySection from './TeamTransparencySection';
import CommunitySection from './CommunitySection';
import OnChainMetrics from './OnChainMetrics';
import NewsSection from './NewsSection';
import LinksSection from './LinksSection';
import type { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'overview',   label: 'Visão Geral', icon: '📊' },
  { id: 'tokenomics', label: 'Tokenomics',  icon: '🔢' },
  { id: 'risk',       label: 'Risco',        icon: '⚠️' },
  { id: 'onchain',    label: 'On-Chain',     icon: '📡' },
];

export default function AnalysisTabs({ analysis, activeTab, onTabChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div
        className="rounded-xl border overflow-x-auto"
        style={{ backgroundColor: '#0d1a0d', borderColor: '#1a2e1a' }}
      >
        <div className="flex min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2"
                style={{
                  color: isActive ? '#39d353' : '#4a7a4a',
                  borderBottomColor: isActive ? '#39d353' : 'transparent',
                  backgroundColor: 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(57,211,83,0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#39d353';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = '#4a7a4a';
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-6">

        {/* Aba 1: Visão Geral */}
        {activeTab === 'overview' && (
          <>
            <TLDRCard analysis={analysis} />
            <ScoreSection analysis={analysis} />
            <ProsConsSection analysis={analysis} />
            <AIAnalysisSection analysis={analysis} />
          </>
        )}

        {/* Aba 2: Tokenomics */}
        {activeTab === 'tokenomics' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SupplySection analysis={analysis} />
              <DistributionSection analysis={analysis} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VestingSection analysis={analysis} />
              <UtilitySection analysis={analysis} />
            </div>
            <TreasurySection analysis={analysis} />
          </>
        )}

        {/* Aba 3: Risco */}
        {activeTab === 'risk' && (
          <>
            <RedFlagsSection analysis={analysis} />
            <RegulatorySection analysis={analysis} />
            <TeamTransparencySection analysis={analysis} />
            <CommunitySection analysis={analysis} />
          </>
        )}

        {/* Aba 4: On-Chain & Mais */}
        {activeTab === 'onchain' && (
          <>
            <OnChainMetrics ticker={analysis.token.symbol} />
            <NewsSection ticker={analysis.token.symbol} />
            <LinksSection analysis={analysis} />
          </>
        )}
      </div>
    </div>
  );
}
