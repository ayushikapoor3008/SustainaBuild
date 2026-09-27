import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

import type { FullProjectInput, AnalysisResult, SavedProjectRecord } from './types/ecobuild';
import { DEMO_PROJECT_INPUT } from './mockData/demoProject';
import { analyzeBuilding, saveProject } from './services/api';

import { Dashboard } from './pages/Dashboard';
import { NewAnalysis } from './pages/NewAnalysis';
import { SiteClimate } from './pages/SiteClimate';
import { EnergyAnalysis } from './pages/EnergyAnalysis';
import { WaterAnalysis } from './pages/WaterAnalysis';
import { SolarAnalysis } from './pages/SolarAnalysis';
import { GreenAnalysis } from './pages/GreenAnalysis';
import { CarbonAnalysis } from './pages/CarbonAnalysis';
import { PassiveDesign } from './pages/PassiveDesign';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Recommendations } from './pages/Recommendations';
import { ReportView } from './pages/ReportView';
import { SavedProjects } from './pages/SavedProjects';
import { Methodology } from './pages/Methodology';
import { LegalCompliance } from './pages/LegalCompliance';
import { MultiStoreyPlanner } from './pages/MultiStoreyPlanner';
import { ResourceIndependence } from './pages/ResourceIndependence';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentInput, setCurrentInput] = useState<FullProjectInput>(DEMO_PROJECT_INPUT);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProfessionalMode, setIsProfessionalMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    analyzeBuilding(currentInput).then((res) => {
      if (isMounted) {
        setAnalysisResult(res);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleAnalyze = async (newInput: FullProjectInput) => {
    setIsLoading(true);
    setCurrentInput(newInput);
    const res = await analyzeBuilding(newInput);
    setAnalysisResult(res);
    await saveProject(newInput, res);
    setIsLoading(false);
    setCurrentTab('dashboard');
  };

  const handleLoadSavedProject = (saved: SavedProjectRecord) => {
    setCurrentInput(saved.input_data);
    setAnalysisResult(saved.analysis_result);
    setCurrentTab('dashboard');
  };

  const handleRunDemoMode = async () => {
    setIsLoading(true);
    const demoInput = DEMO_PROJECT_INPUT;
    setCurrentInput(demoInput);
    const res = await analyzeBuilding(demoInput);
    setAnalysisResult(res);
    setIsLoading(false);
    setCurrentTab('dashboard');

    setTimeout(() => {
      setCurrentTab('simulator');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-emerald-200">
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isProfessionalMode={isProfessionalMode}
        onToggleProfessionalMode={() => setIsProfessionalMode(!isProfessionalMode)}
        onRunDemoMode={handleRunDemoMode}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {isLoading || !analysisResult ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin"></div>
              <p className="text-xs font-mono font-medium text-slate-600">Loading SustainaBuild AI Calculation Engine...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <Dashboard
                  analysis={analysisResult}
                  input={currentInput}
                  onNavigate={setCurrentTab}
                  onRunDemoMode={handleRunDemoMode}
                />
              )}

              {currentTab === 'new-analysis' && (
                <NewAnalysis
                  initialInput={currentInput}
                  onAnalyze={handleAnalyze}
                  isProfessionalMode={isProfessionalMode}
                />
              )}

              {currentTab === 'site-climate' && (
                <SiteClimate analysis={analysisResult} input={currentInput} />
              )}

              {currentTab === 'energy-analysis' && (
                <EnergyAnalysis analysis={analysisResult} />
              )}

              {currentTab === 'water-analysis' && (
                <WaterAnalysis analysis={analysisResult} />
              )}

              {currentTab === 'solar-analysis' && (
                <SolarAnalysis analysis={analysisResult} />
              )}

              {currentTab === 'green-analysis' && (
                <GreenAnalysis analysis={analysisResult} />
              )}

              {currentTab === 'carbon-analysis' && (
                <CarbonAnalysis analysis={analysisResult} />
              )}

              {currentTab === 'passive-design' && (
                <PassiveDesign analysis={analysisResult} />
              )}

              {currentTab === 'compliance' && (
                <LegalCompliance />
              )}

              {currentTab === 'multistorey' && (
                <MultiStoreyPlanner />
              )}

              {currentTab === 'resource-independence' && (
                <ResourceIndependence analysis={analysisResult} input={currentInput} />
              )}

              {currentTab === 'simulator' && (
                <WhatIfSimulator input={currentInput} baselineAnalysis={analysisResult} />
              )}

              {currentTab === 'recommendations' && (
                <Recommendations analysis={analysisResult} onNavigate={setCurrentTab} />
              )}

              {currentTab === 'report' && (
                <ReportView analysis={analysisResult} input={currentInput} />
              )}

              {currentTab === 'saved-projects' && (
                <SavedProjects onLoadProject={handleLoadSavedProject} />
              )}

              {currentTab === 'methodology' && (
                <Methodology />
              )}
            </>
          )}
        </main>
      </div>

      <MobileNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
