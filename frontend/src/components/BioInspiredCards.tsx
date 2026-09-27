import React from 'react';
import { Wind, TreePine, Sun, Hexagon, ShieldAlert } from 'lucide-react';

export const BioInspiredCards: React.FC = () => {
  const cards = [
    {
      title: "Termite Mound Architecture",
      principle: "Passive Stack Ventilation & Thermal Mass Dampening",
      application: "Vertical central ventilation atrium and porous earth walls regulate indoor temperature without active AC.",
      benefit: "Reduces annual cooling energy load by 35–45% in hot composite climates.",
      icon: <Wind className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-50 border-amber-200"
    },
    {
      title: "Tree Canopy Shading",
      principle: "Multi-layered Intercepted Solar Radiation",
      application: "Tiered overhang louvers and staggered tree planting block high-angle summer sun while admitting winter light.",
      benefit: "Cuts perimeter glass peak solar heat gain Q_solar by up to 55%.",
      icon: <TreePine className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-200"
    },
    {
      title: "Leaf Phyllotaxy Optimization",
      principle: "Golden-Angle Non-Shading Solar Exposure",
      application: "Angles solar PV array and skylight apertures using natural 137.5° golden ratio layout to prevent self-shading.",
      benefit: "Increases rooftop solar yield E_solar by 12–18% per square meter.",
      icon: <Sun className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      title: "Honeycomb Cell Structure",
      principle: "Maximal Volume to Minimal Material Perimeter Ratio",
      application: "Hexagonal wall block void geometries and structural slab ribs reduce concrete volume without loss of strength.",
      benefit: "Reduces building embodied carbon footprint by 22% and structural weight by 30%.",
      icon: <Hexagon className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Bio-Shell Double Envelopes",
      principle: "Self-Supporting Curvilinear Thin Shells",
      application: "Aerodynamic vaulted roof forms shed wind pressure and create a buffer airspace for heat dissipation.",
      benefit: "Improves structural material efficiency while decreasing roof heat conduction Q_roof.",
      icon: <ShieldAlert className="w-6 h-6 text-teal-600" />,
      color: "bg-teal-50 border-teal-200"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-emerald-950">Bio-Inspired Architecture (Biomimicry)</h3>
          <p className="text-xs text-slate-500">Nature-tested principles applied to low-energy climate-adapted building design.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${item.color} shadow-2xs flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/60">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                  <span className="text-[11px] font-semibold text-slate-500">{item.principle}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                <strong className="text-slate-900 font-semibold">Application:</strong> {item.application}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900/10 text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
              <span>🌱 Sustainability Benefit:</span>
              <span className="text-slate-800 font-medium">{item.benefit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
