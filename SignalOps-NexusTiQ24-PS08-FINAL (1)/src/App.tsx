import React, { useState, useEffect } from 'react';
import { AnalysisResult, DecisionHorizon } from './types';
import { PRESET_DISRUPTIONS, buildFallbackAnalysis } from './data/mockSupplyChain';
import { BrandSplash } from './components/BrandSplash';
import { Sidebar, NavTab } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { NewInvestigationPage } from './components/NewInvestigationPage';
import { InvestigationResultPage } from './components/InvestigationResultPage';
import { CasesPage } from './components/CasesPage';
import { SupplyNetworkPage } from './components/SupplyNetworkPage';
import { EvidencePage } from './components/EvidencePage';
import { SettingsPage } from './components/SettingsPage';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('HOME');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [noticeText, setNoticeText] = useState<string>(PRESET_DISRUPTIONS[0].noticeText);
  const [decisionHorizon, setDecisionHorizon] = useState<DecisionHorizon>('14D');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const executeAnalysis = async (textToAnalyze?: string, horizonOverride?: DecisionHorizon) => {
    const text = (textToAnalyze ?? noticeText).trim();
    const horizon = horizonOverride ?? decisionHorizon;
    if (!text) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-disruption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noticeText: text,
          decisionHorizon: horizon,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setCurrentTab('INVESTIGATION_RESULT');
    } catch (err) {
      console.warn('Backend fallback to deterministic calculation engine:', err);
      const fallbackData = buildFallbackAnalysis(text, horizon);
      setAnalysisResult(fallbackData);
      setCurrentTab('INVESTIGATION_RESULT');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectCase = (presetId: string) => {
    const preset = PRESET_DISRUPTIONS.find((p) => p.id === presetId);
    if (preset) {
      setNoticeText(preset.noticeText);
      executeAnalysis(preset.noticeText);
    }
  };

  const handleApproveAction = async (actionId: string, operatorName: string, notes: string) => {
    try {
      const response = await fetch('/api/approve-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, operatorName, notes }),
      });

      const data = await response.json();
      if (analysisResult) {
        setAnalysisResult({
          ...analysisResult,
          approvalState: {
            approved: true,
            approvedBy: data.authorizedBy || operatorName,
            approvedAt: data.authorizedAt || new Date().toISOString(),
            authorizedActionId: actionId,
          },
        });
      }
    } catch (err) {
      console.warn('Approval local state fallback:', err);
      if (analysisResult) {
        setAnalysisResult({
          ...analysisResult,
          approvalState: {
            approved: true,
            approvedBy: operatorName,
            approvedAt: new Date().toISOString(),
            authorizedActionId: actionId,
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#18181b] flex flex-col font-sans selection:bg-[#f97316]/20">
      {/* 1. App Opening Experience: Short Brand Splash */}
      {showSplash && <BrandSplash onComplete={() => setShowSplash(false)} />}

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
            }}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            caseCount={4}
          />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 bg-[#fbfbfa] h-full shadow-2xl">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setCurrentTab(tab);
                  setMobileMenuOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setMobileMenuOpen(false)}
                caseCount={4}
              />
            </div>
          </div>
        )}

        {/* 3. Main Workspace Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Mobile Top Bar */}
          <div className="md:hidden sticky top-0 z-20 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e7e5e4] px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-[#e4e4e7] bg-white text-[#18181b]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#18181b]">SignalOps</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#18181b] text-white font-mono">
                PS08
              </span>
            </div>
            <button
              onClick={() => setCurrentTab('NEW_INVESTIGATION')}
              className="px-2.5 py-1 text-xs font-semibold bg-[#18181b] text-white rounded-lg"
            >
              + New
            </button>
          </div>

          {/* Active Screen View */}
          <main className="flex-1">
            {currentTab === 'HOME' && (
              <HomePage
                noticeText={noticeText}
                onNoticeChange={setNoticeText}
                decisionHorizon={decisionHorizon}
                onHorizonChange={setDecisionHorizon}
                onAnalyze={() => executeAnalysis()}
                isAnalyzing={isAnalyzing}
                onSelectCase={handleSelectCase}
              />
            )}

            {currentTab === 'NEW_INVESTIGATION' && (
              <NewInvestigationPage
                noticeText={noticeText}
                onNoticeChange={setNoticeText}
                decisionHorizon={decisionHorizon}
                onHorizonChange={setDecisionHorizon}
                onAnalyze={() => executeAnalysis()}
                isAnalyzing={isAnalyzing}
              />
            )}

            {currentTab === 'INVESTIGATION_RESULT' && (
              analysisResult ? (
                <InvestigationResultPage
                  analysis={analysisResult}
                  onNewInvestigation={() => setCurrentTab('NEW_INVESTIGATION')}
                  onHorizonChange={(h) => {
                    setDecisionHorizon(h);
                    executeAnalysis(undefined, h);
                  }}
                  onApproveAction={handleApproveAction}
                />
              ) : (
                <div className="text-center py-20">
                  <p className="text-sm text-[#71717a]">
                    No active investigation. Start a new investigation or select a case.
                  </p>
                  <button
                    onClick={() => setCurrentTab('NEW_INVESTIGATION')}
                    className="mt-4 px-4 py-2 text-xs font-semibold bg-[#18181b] text-white rounded-xl"
                  >
                    Start New Investigation
                  </button>
                </div>
              )
            )}

            {currentTab === 'CASES' && (
              <CasesPage
                onSelectCase={handleSelectCase}
                onNewInvestigation={() => setCurrentTab('NEW_INVESTIGATION')}
              />
            )}

            {currentTab === 'SUPPLY_NETWORK' && <SupplyNetworkPage />}

            {currentTab === 'EVIDENCE' && <EvidencePage />}

            {currentTab === 'SETTINGS' && (
              <SettingsPage
                defaultHorizon={decisionHorizon}
                onHorizonChange={setDecisionHorizon}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
