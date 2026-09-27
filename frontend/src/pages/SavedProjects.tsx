import React, { useState, useEffect } from 'react';
import { FolderOpen, Trash2, Columns } from 'lucide-react';
import type { SavedProjectRecord } from '../types/ecobuild';
import { fetchSavedProjects, deleteProject } from '../services/api';

interface SavedProjectsProps {
  onLoadProject: (proj: SavedProjectRecord) => void;
}

export const SavedProjects: React.FC<SavedProjectsProps> = ({ onLoadProject }) => {
  const [projects, setProjects] = useState<SavedProjectRecord[]>([]);
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSavedProjects().then(setProjects);
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const projA = projects.find(p => p.id === compareA);
  const projB = projects.find(p => p.id === compareB);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Saved Projects & Building Comparison</h2>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
              SQLite Database Storage
            </span>
          </div>
          <p className="text-xs text-slate-500">Manage saved building analyses and perform side-by-side Building A vs Building B comparison.</p>
        </div>

        <button
          onClick={() => {
            if (projects.length >= 2) {
              setCompareA(projects[0].id);
              setCompareB(projects[1].id);
              setIsCompareModalOpen(true);
            } else {
              alert("You need at least 2 saved projects to compare!");
            }
          }}
          className="eco-btn-secondary text-xs px-4 py-2 flex items-center gap-2"
        >
          <Columns className="w-4 h-4 text-emerald-700" />
          <span>Side-by-Side Project Comparison</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="eco-card p-12 text-center text-slate-500 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Saved Projects Found</h3>
          <p className="text-xs">Create a new building analysis to save and compare design options.</p>
        </div>
      ) : (
        <div className="eco-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Typology</th>
                <th className="p-4">Eco Score</th>
                <th className="p-4">EUI (kWh/m²/yr)</th>
                <th className="p-4">Annual CO₂</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-emerald-950">{p.project_name}</td>
                  <td className="p-4 font-medium text-slate-700">{p.city}</td>
                  <td className="p-4 font-medium text-slate-700">{p.building_type}</td>
                  <td className="p-4">
                    <span className="eco-pill bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                      {p.overall_eco_score} / 100
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">{p.eui_kwh_m2_yr}</td>
                  <td className="p-4 font-mono font-bold text-slate-800">{p.annual_co2_tons} Tons</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => onLoadProject(p)}
                      className="eco-btn-primary text-[11px] px-3 py-1.5"
                    >
                      Open Project
                    </button>
                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                <Columns className="w-5 h-5 text-emerald-700" />
                Side-by-Side Building Comparison
              </h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Building A</label>
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="w-full p-2 rounded-xl border text-xs font-semibold"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.project_name} ({p.city})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Building B</label>
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="w-full p-2 rounded-xl border text-xs font-semibold"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.project_name} ({p.city})</option>)}
                </select>
              </div>
            </div>

            {projA && projB && (
              <div className="eco-card p-4 space-y-3 text-xs">
                <div className="grid grid-cols-3 font-bold border-b pb-2 text-slate-800">
                  <span>Metric</span>
                  <span>Building A ({projA.project_name})</span>
                  <span>Building B ({projB.project_name})</span>
                </div>
                <div className="grid grid-cols-3 font-mono py-1">
                  <span>Overall Eco Score:</span>
                  <span className="font-bold text-emerald-900">{projA.overall_eco_score}</span>
                  <span className="font-bold text-emerald-900">{projB.overall_eco_score}</span>
                </div>
                <div className="grid grid-cols-3 font-mono py-1">
                  <span>EUI (kWh/m²/yr):</span>
                  <span>{projA.eui_kwh_m2_yr}</span>
                  <span>{projB.eui_kwh_m2_yr}</span>
                </div>
                <div className="grid grid-cols-3 font-mono py-1">
                  <span>Annual Electricity:</span>
                  <span>{projA.analysis_result.energy.total_annual_kwh.toLocaleString()} kWh</span>
                  <span>{projB.analysis_result.energy.total_annual_kwh.toLocaleString()} kWh</span>
                </div>
                <div className="grid grid-cols-3 font-mono py-1">
                  <span>Solar Generation:</span>
                  <span>{projA.analysis_result.solar.annual_generation_kwh.toLocaleString()} kWh</span>
                  <span>{projB.analysis_result.solar.annual_generation_kwh.toLocaleString()} kWh</span>
                </div>
                <div className="grid grid-cols-3 font-mono py-1">
                  <span>Annual CO₂:</span>
                  <span>{projA.annual_co2_tons} Tons</span>
                  <span>{projB.annual_co2_tons} Tons</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
