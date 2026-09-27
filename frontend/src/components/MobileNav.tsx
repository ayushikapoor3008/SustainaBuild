import React from 'react';
import { LayoutDashboard, PlusCircle, Sliders, FolderOpen, BookOpen } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onTabChange }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'new-analysis', label: 'Analyze', icon: <PlusCircle className="w-5 h-5" /> },
    { id: 'simulator', label: 'Simulator', icon: <Sliders className="w-5 h-5" /> },
    { id: 'saved-projects', label: 'Projects', icon: <FolderOpen className="w-5 h-5" /> },
    { id: 'methodology', label: 'Methodology', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around text-slate-400">
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all text-[11px] font-medium ${
              isActive ? 'text-emerald-400 font-bold bg-slate-800' : 'hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
