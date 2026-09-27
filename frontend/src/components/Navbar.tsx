import React from 'react';
import { Leaf, PlusCircle, SlidersHorizontal, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isProfessionalMode: boolean;
  onToggleProfessionalMode: () => void;
  onRunDemoMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  isProfessionalMode,
  onToggleProfessionalMode,
  onRunDemoMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-300 flex items-center justify-center shadow-md">
          <Leaf className="w-5 h-5 text-emerald-300" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-extrabold text-emerald-950 tracking-tight font-['Outfit',sans-serif]">
              SustainaBuild <span className="text-emerald-700">AI</span>
            </h1>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-semibold">
              Powered by EcoBuild Intelligence
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 hidden sm:block leading-tight">
            Intelligent Sustainable Architecture &amp; Renewable Resource Management
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-medium">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'dashboard' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('new-analysis')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'new-analysis' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          New Analysis
        </button>
        <button
          onClick={() => onTabChange('multistorey')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'multistorey' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Multi-Storey
        </button>
        <button
          onClick={() => onTabChange('compliance')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'compliance' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Compliance
        </button>
        <button
          onClick={() => onTabChange('resource-independence')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'resource-independence' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Resources
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'simulator' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Simulator
        </button>
        <button
          onClick={() => onTabChange('report')}
          className={`px-2.5 py-1.5 rounded-lg transition-colors ${currentTab === 'report' ? 'bg-white text-emerald-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Report
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunDemoMode}
          className="eco-btn-secondary text-xs px-3 py-1.5 text-amber-900 border-amber-300 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 font-bold shadow-sm"
          title="1-Click Live Hackathon Presentation Walkthrough"
        >
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Demo Mode</span>
        </button>

        <button
          onClick={onToggleProfessionalMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
            isProfessionalMode
              ? 'bg-emerald-950 text-emerald-100 border-emerald-900'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
          title="Toggle Technical Architect Mode (shows U-values, SHGC, ACH, COP, LPD, emission factors)"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pro Mode:</span>
          <span className={isProfessionalMode ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
            {isProfessionalMode ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={() => onTabChange('new-analysis')}
          className="eco-btn-primary text-xs px-3.5 py-1.5 hidden sm:flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ New Analysis</span>
        </button>
      </div>
    </header>
  );
};
