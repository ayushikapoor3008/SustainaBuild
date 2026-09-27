import React from 'react';
import {
  LayoutDashboard, PlusCircle, Compass, Zap, Droplets, Sun, Trees,
  Boxes, Wind, Sliders, Lightbulb, FileCheck, FolderOpen, BookOpen,
  Scale, Building, BarChart3, Leaf
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const menuSections = [
    {
      section: 'Core',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'new-analysis', label: '2. New Building Analysis', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'site-climate', label: '3. Site & Climate', icon: <Compass className="w-4 h-4" /> },
      ]
    },
    {
      section: 'Analysis Engines',
      items: [
        { id: 'energy-analysis', label: '4. Energy Analysis', icon: <Zap className="w-4 h-4" /> },
        { id: 'water-analysis', label: '5. Water & Circularity', icon: <Droplets className="w-4 h-4" /> },
        { id: 'solar-analysis', label: '6. Solar & Renewables', icon: <Sun className="w-4 h-4" /> },
        { id: 'green-analysis', label: '7. Green & Nature', icon: <Trees className="w-4 h-4" /> },
        { id: 'carbon-analysis', label: '8. Materials & Carbon', icon: <Boxes className="w-4 h-4" /> },
        { id: 'passive-design', label: '9. Passive & Bio-Inspired', icon: <Wind className="w-4 h-4" /> },
      ]
    },
    {
      section: 'SustainaBuild Modules',
      items: [
        { id: 'compliance', label: '10. Legal & Compliance', icon: <Scale className="w-4 h-4" /> },
        { id: 'multistorey', label: '11. Multi-Storey Planner', icon: <Building className="w-4 h-4" /> },
        { id: 'resource-independence', label: '12. Resource Independence', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      section: 'Intelligence & Reports',
      items: [
        { id: 'simulator', label: '13. What-If Simulator', icon: <Sliders className="w-4 h-4" /> },
        { id: 'recommendations', label: '14. AI Recommendations', icon: <Lightbulb className="w-4 h-4" /> },
        { id: 'report', label: '15. Sustainability Report', icon: <FileCheck className="w-4 h-4" /> },
        { id: 'saved-projects', label: '16. Saved Projects', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'methodology', label: '17. Methodology & Formulas', icon: <BookOpen className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-61px)] border-r border-slate-800">
      <div className="p-4 border-b border-slate-800/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
          Navigation Modules
        </span>
        <p className="text-xs text-slate-400">Calculation-Driven Architecture Decision Support</p>
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.section}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-300' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Leaf className="w-3 h-3 text-emerald-400" />
          <span className="font-bold text-slate-200">SustainaBuild AI</span>
        </div>
        <span className="text-slate-400 font-medium">Powered by EcoBuild Intelligence</span>
        <span className="text-[10px] text-emerald-400 font-mono mt-1">"Design better. Build greener. Manage resources smarter."</span>
      </div>
    </aside>
  );
};
