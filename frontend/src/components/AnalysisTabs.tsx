import TLDRCard from './TLDRCard';
import TokenAbout from './TokenAbout';
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
  { id: 'overview',   label: 'OVERVIEW',    icon: '🧌', cmd: 'scan --full' },
  { id: 'tokenomics', label: 'TOKENOMICS',  icon: '⛓️', cmd: 'supply --deep' },
  { id: 'risk',       label: 'RISCO',       icon: '💀', cmd: 'threat --level=all' },
  { id: 'onchain',    label: 'ON-CHAIN',    icon: '🔮', cmd: 'chain --live' },
];

export default function AnalysisTabs({ analysis, activeTab, onTabChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Tab bar — cyberpunk terminal style */}
      <div
        className="rounded-xl border overflow-x-auto"
        style={{
          backgroundColor: '#060d06',
          borderColor: '#1a2e1a',
          boxShadow: 'inset 0 0 20px #00000060',
        }}
      >
        <div className="flex w-full sm:min-w-max">
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="group flex flex-col items-start px-3 sm:px-5 py-2 sm:py-3 transition-all whitespace-nowrap relative flex-1 sm:flex-none"
                style={{
                  backgroundColor: isActive ? 'rgba(57,211,83,0.06)' : 'transparent',
                  borderRight: i < 3 ? '1px solid #1a2e1a' : 'none',
                  borderBottom: isActive ? '2px solid #39d353' : '2px solid transparent',
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(57,211,83,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                {/* Command label — hidden on mobile */}
                <span
                  className="text-xs font-mono mb-1 hidden sm:block"
                  style={{ color: isActive ? '#39d35360' : '#1a2e1a', letterSpacing: '0.5px' }}
                >
                  &gt; {tab.cmd}
                </span>
                {/* Icon + label */}
                <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start w-full">
                  <span
                    className="text-base sm:text-lg"
                    style={{ filter: isActive ? 'drop-shadow(0 0 6px #39d353)' : 'none' }}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-bold font-mono tracking-wide sm:tracking-widest"
                    style={{
                      color: isActive ? '#39d353' : '#4a7a4a',
                      textShadow: isActive ? '0 0 8px rgba(57,211,83,0.6)' : 'none',
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
                {/* Active dot */}
                {isActive && (
                  <span
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: '#39d353', boxShadow: '0 0 4px #39d353' }}
                  />
                )}
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
            <TokenAbout analysis={analysis} />
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
