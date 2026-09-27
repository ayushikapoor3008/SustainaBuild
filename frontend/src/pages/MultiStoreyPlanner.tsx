import React, { useState } from 'react';
import {
  Building, Compass, Layers, ToggleLeft, ToggleRight, Droplets,
  Trees, ChevronLeft, ChevronRight, Info, Maximize2, ZapOff, Wind
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface PlannerState {
  plotWidth: number;
  plotDepth: number;
  buildingWidth: number;
  buildingDepth: number;
  numFloors: number;
  floorHeight: number;
  frontSetback: number;
  rearSetback: number;
  sideSetback: number;
  buildingType: string;
  parkingArea: number;
  greenArea: number;
  solarArea: number;
  orientationDeg: number;
  hasLift: boolean;
  hasStaircase: boolean;
  hasRainwaterTank: boolean;
  hasSTP: boolean;
}

// ── CAD Floor Plan SVG ───────────────────────────────────────────────────────
const CADFloorPlan: React.FC<{ plan: PlannerState; floor: number }> = ({ plan, floor }) => {
  const SVG_W = 520;
  const SVG_H = 420;
  const MARGIN = 40;
  const SCALE = Math.min((SVG_W - MARGIN * 2) / plan.plotWidth, (SVG_H - MARGIN * 2) / plan.plotDepth);

  const pw = plan.plotWidth * SCALE;
  const pd = plan.plotDepth * SCALE;
  const ox = (SVG_W - pw) / 2;
  const oy = (SVG_H - pd) / 2;

  const bw = plan.buildingWidth * SCALE;
  const bd = plan.buildingDepth * SCALE;
  const bx = ox + plan.sideSetback * SCALE;
  const by = oy + plan.frontSetback * SCALE;

  const parkingW = Math.min(plan.parkingArea * SCALE * 0.5, pw * 0.4);
  const parkingH = Math.min(plan.parkingArea * SCALE * 0.3, pd * 0.25);
  const greenW = Math.min(plan.greenArea * SCALE * 0.5, pw * 0.35);
  const greenH = Math.min(plan.greenArea * SCALE * 0.3, pd * 0.25);

  const isGround = floor === 0;
  const isRoof = floor === plan.numFloors;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto bg-stone-50 rounded-xl border border-stone-200 font-mono">
      {/* Grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`hg${i}`} x1={MARGIN / 2} y1={MARGIN / 2 + i * (SVG_H - MARGIN) / 7}
          x2={SVG_W - MARGIN / 2} y2={MARGIN / 2 + i * (SVG_H - MARGIN) / 7}
          stroke="#e8e8e0" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={`vg${i}`} x1={MARGIN / 2 + i * (SVG_W - MARGIN) / 9} y1={MARGIN / 2}
          x2={MARGIN / 2 + i * (SVG_W - MARGIN) / 9} y2={SVG_H - MARGIN / 2}
          stroke="#e8e8e0" strokeWidth="0.5" />
      ))}

      {/* Plot boundary */}
      <rect x={ox} y={oy} width={pw} height={pd} fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="6 3" />

      {/* Road */}
      <rect x={ox - 22} y={oy - 22} width={pw + 44} height={18} fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5" />
      <text x={ox + pw / 2} y={oy - 10} textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="bold">ROAD / STREET</text>

      {/* Setback zones */}
      <rect x={ox} y={oy} width={pw} height={plan.frontSetback * SCALE} fill="#fef9c3" opacity="0.6" />
      <rect x={ox} y={oy + pd - plan.rearSetback * SCALE} width={pw} height={plan.rearSetback * SCALE} fill="#fef9c3" opacity="0.6" />
      <rect x={ox} y={oy + plan.frontSetback * SCALE} width={plan.sideSetback * SCALE} height={pd - plan.frontSetback * SCALE - plan.rearSetback * SCALE} fill="#fef9c3" opacity="0.6" />
      <rect x={ox + pw - plan.sideSetback * SCALE} y={oy + plan.frontSetback * SCALE} width={plan.sideSetback * SCALE} height={pd - plan.frontSetback * SCALE - plan.rearSetback * SCALE} fill="#fef9c3" opacity="0.6" />

      {/* Green area (rear) */}
      {isGround && (
        <>
          <rect x={bx + bw + 4} y={by + bd / 2} width={greenW} height={greenH} fill="#bbf7d0" stroke="#34d399" strokeWidth="1" rx="4" />
          <text x={bx + bw + 4 + greenW / 2} y={by + bd / 2 + greenH / 2 + 3} textAnchor="middle" fontSize="7" fill="#059669" fontWeight="bold">GREEN</text>
          {/* Trees */}
          {[0.2, 0.5, 0.8].map((t, i) => (
            <g key={i} transform={`translate(${bx + bw + 4 + greenW * t}, ${by + bd / 2 - 8})`}>
              <circle r="7" fill="#4ade80" opacity="0.85" />
              <line x1="0" y1="7" x2="0" y2="12" stroke="#78350f" strokeWidth="1.5" />
            </g>
          ))}
        </>
      )}

      {/* Parking (front) */}
      {isGround && plan.parkingArea > 0 && (
        <>
          <rect x={ox + 4} y={oy + plan.frontSetback * SCALE + 4} width={parkingW} height={parkingH} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="2" />
          {Array.from({ length: Math.min(3, Math.floor(parkingW / 18)) }, (_, i) => (
            <line key={i} x1={ox + 4 + i * 18 + 18} y1={oy + plan.frontSetback * SCALE + 4}
              x2={ox + 4 + i * 18 + 18} y2={oy + plan.frontSetback * SCALE + 4 + parkingH}
              stroke="#94a3b8" strokeWidth="0.8" />
          ))}
          <text x={ox + 4 + parkingW / 2} y={oy + plan.frontSetback * SCALE + 4 + parkingH / 2 + 3} textAnchor="middle" fontSize="7" fill="#475569">PARKING</text>
        </>
      )}

      {/* Rainwater tank */}
      {isGround && plan.hasRainwaterTank && (
        <>
          <rect x={bx - 22} y={by + bd - 20} width={18} height={18} fill="#bae6fd" stroke="#38bdf8" strokeWidth="1" rx="2" />
          <text x={bx - 13} y={by + bd - 7} textAnchor="middle" fontSize="6" fill="#0369a1">RWH</text>
        </>
      )}
      {/* STP */}
      {isGround && plan.hasSTP && (
        <>
          <rect x={bx - 22} y={by + bd - 42} width={18} height={18} fill="#e9d5ff" stroke="#a855f7" strokeWidth="1" rx="2" />
          <text x={bx - 13} y={by + bd - 29} textAnchor="middle" fontSize="6" fill="#7c3aed">STP</text>
        </>
      )}

      {/* Building footprint */}
      <rect x={bx} y={by} width={bw} height={bd}
        fill={isRoof ? '#d1fae5' : '#dbeafe'}
        stroke={isRoof ? '#059669' : '#3b82f6'}
        strokeWidth="2.5" />

      {/* Floor interior */}
      {!isRoof && (
        <>
          {/* Staircase */}
          {plan.hasStaircase && (
            <rect x={bx + bw / 2 - 10} y={by + 5} width={20} height={20} fill="#fde68a" stroke="#d97706" strokeWidth="1" rx="2" />
          )}
          {/* Lift */}
          {plan.hasLift && (
            <rect x={bx + bw / 2 + 12} y={by + 5} width={16} height={20} fill="#c7d2fe" stroke="#6366f1" strokeWidth="1" rx="2" />
          )}
          {/* Rooms */}
          <line x1={bx + bw / 2} y1={by + 30} x2={bx + bw / 2} y2={by + bd} stroke="#93c5fd" strokeWidth="1" />
          <line x1={bx} y1={by + bd / 2} x2={bx + bw} y2={by + bd / 2} stroke="#93c5fd" strokeWidth="1" />
          <text x={bx + bw * 0.25} y={by + bd * 0.75 + 4} textAnchor="middle" fontSize="7" fill="#1e40af">Room {floor === 0 ? 'G' : floor}-A</text>
          <text x={bx + bw * 0.75} y={by + bd * 0.75 + 4} textAnchor="middle" fontSize="7" fill="#1e40af">Room {floor === 0 ? 'G' : floor}-B</text>
          <text x={bx + bw * 0.25} y={by + bd * 0.3 + 4} textAnchor="middle" fontSize="7" fill="#1e40af">{floor === 0 ? 'Hall/Kitchen' : 'Bedroom'}</text>
          <text x={bx + bw * 0.75} y={by + bd * 0.3 + 4} textAnchor="middle" fontSize="7" fill="#1e40af">{plan.hasStaircase ? 'Stair' : 'Room'}</text>
        </>
      )}
      {/* Roof: solar panels + green roof */}
      {isRoof && (
        <>
          {plan.solarArea > 0 && (
            <rect x={bx + 8} y={by + 8} width={Math.min(plan.solarArea * SCALE * 0.4, bw - 16)} height={Math.min(20, bd - 16)}
              fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
          )}
          <text x={bx + bw / 2} y={by + bd / 2 + 4} textAnchor="middle" fontSize="8" fill="#059669" fontWeight="bold">ROOF PLAN</text>
          <text x={bx + bw / 2} y={by + bd / 2 + 15} textAnchor="middle" fontSize="7" fill="#065f46">Solar + Green Roof Area</text>
        </>
      )}

      {/* Floor label */}
      <text x={bx + bw / 2} y={by - 6} textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="bold">
        {isRoof ? 'ROOF PLAN' : floor === 0 ? 'GROUND FLOOR' : `FLOOR ${floor}`}
      </text>

      {/* Dimension lines */}
      {/* Width */}
      <line x1={ox} y1={oy + pd + 14} x2={ox + pw} y2={oy + pd + 14} stroke="#6b7280" strokeWidth="1" markerEnd="url(#arrow)" />
      <text x={ox + pw / 2} y={oy + pd + 24} textAnchor="middle" fontSize="8" fill="#374151">{plan.plotWidth.toFixed(1)} m</text>
      {/* Depth */}
      <line x1={ox - 14} y1={oy} x2={ox - 14} y2={oy + pd} stroke="#6b7280" strokeWidth="1" />
      <text x={ox - 22} y={oy + pd / 2 + 3} textAnchor="middle" fontSize="8" fill="#374151" transform={`rotate(-90, ${ox - 22}, ${oy + pd / 2})`}>{plan.plotDepth.toFixed(1)} m</text>

      {/* North arrow */}
      <g transform={`translate(${SVG_W - 30}, 30)`}>
        <circle r="14" fill="white" stroke="#6b7280" strokeWidth="1" />
        <polygon points="0,-11 4,5 0,2 -4,5" fill="#1e293b" />
        <text x="0" y="18" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="bold">N</text>
      </g>

      {/* Legend */}
      <g transform={`translate(${ox + 4}, ${oy + pd + 32})`}>
        <rect width="10" height="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" rx="1" />
        <text x="13" y="7" fontSize="6" fill="#374151">Building</text>
        <rect x="60" width="10" height="8" fill="#bbf7d0" stroke="#34d399" strokeWidth="1" rx="1" />
        <text x="73" y="7" fontSize="6" fill="#374151">Green Area</text>
        <rect x="130" width="10" height="8" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" rx="1" />
        <text x="143" y="7" fontSize="6" fill="#374151">Setback</text>
        <rect x="188" width="10" height="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="1" />
        <text x="201" y="7" fontSize="6" fill="#374151">Parking</text>
      </g>

      {/* Conceptual label watermark */}
      <text x={SVG_W / 2} y={SVG_H - 5} textAnchor="middle" fontSize="7" fill="#9ca3af" fontStyle="italic">
        Conceptual / Preliminary Design — Not a Construction Drawing
      </text>
    </svg>
  );
};

// ── 3D Massing View ──────────────────────────────────────────────────────────
const Massing3D: React.FC<{ plan: PlannerState }> = ({ plan }) => {
  const FLOOR_H = 28;
  const ISO_X = 0.866;
  const ISO_Y = 0.5;
  const W = plan.buildingWidth * 6;
  const D = plan.buildingDepth * 6;
  const SVG_W = 380;
  const SVG_H = 300;
  const BASE_X = SVG_W / 2 - (W * ISO_X - D * ISO_X) / 2;
  const BASE_Y = SVG_H - 60;

  const floorColors = ['#bfdbfe', '#a5f3fc', '#bbf7d0', '#fed7aa', '#e9d5ff'];

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto bg-gradient-to-b from-sky-50 to-stone-50 rounded-xl border border-stone-200">
      {/* Ground shadow */}
      <ellipse cx={BASE_X} cy={BASE_Y + 8} rx={W * ISO_X * 0.9} ry={12} fill="#00000010" />

      {/* Building floors */}
      {Array.from({ length: plan.numFloors }, (_, i) => {
        const fY = BASE_Y - i * FLOOR_H;
        const color = floorColors[i % floorColors.length];
        return (
          <g key={i}>
            {/* Front face */}
            <polygon
              points={`${BASE_X},${fY} ${BASE_X + W * ISO_X},${fY - W * ISO_Y} ${BASE_X + W * ISO_X},${fY - W * ISO_Y - FLOOR_H} ${BASE_X},${fY - FLOOR_H}`}
              fill={color} stroke="#94a3b8" strokeWidth="0.8"
            />
            {/* Side face */}
            <polygon
              points={`${BASE_X},${fY} ${BASE_X - D * ISO_X},${fY - D * ISO_Y} ${BASE_X - D * ISO_X},${fY - D * ISO_Y - FLOOR_H} ${BASE_X},${fY - FLOOR_H}`}
              fill={`${color}cc`} stroke="#94a3b8" strokeWidth="0.8"
            />
            {/* Windows */}
            {Array.from({ length: Math.min(3, Math.floor(W * ISO_X / 22)) }, (_, w) => (
              <rect key={w}
                x={BASE_X + W * ISO_X * 0.15 + w * 22} y={fY - FLOOR_H * 0.7}
                width={12} height={FLOOR_H * 0.4} fill="#bae6fd" stroke="#7dd3fc" strokeWidth="0.5" rx="1"
              />
            ))}
            {/* Floor label */}
            <text x={BASE_X + W * ISO_X * 0.5} y={fY - FLOOR_H / 2 + 3} fontSize="7" fill="#1e40af" textAnchor="middle" fontWeight="bold">
              F{i + 1}
            </text>
          </g>
        );
      })}

      {/* Roof */}
      {(() => {
        const roofY = BASE_Y - plan.numFloors * FLOOR_H;
        return (
          <>
            <polygon
              points={`${BASE_X},${roofY} ${BASE_X + W * ISO_X},${roofY - W * ISO_Y} ${BASE_X + W * ISO_X - D * ISO_X},${roofY - W * ISO_Y - D * ISO_Y} ${BASE_X - D * ISO_X},${roofY - D * ISO_Y}`}
              fill="#d1fae5" stroke="#059669" strokeWidth="1.5"
            />
            {/* Solar panels on roof */}
            {plan.solarArea > 0 && (
              <polygon
                points={`${BASE_X + 10},${roofY - 5} ${BASE_X + W * ISO_X * 0.6},${roofY - W * ISO_Y * 0.6 - 5} ${BASE_X + W * ISO_X * 0.6 - D * ISO_X * 0.3},${roofY - W * ISO_Y * 0.6 - D * ISO_Y * 0.3 - 5} ${BASE_X - D * ISO_X * 0.3 + 10},${roofY - D * ISO_Y * 0.3 - 5}`}
                fill="#fde68a" stroke="#d97706" strokeWidth="1.5" opacity="0.9"
              />
            )}
          </>
        );
      })()}

      {/* Ground */}
      <polygon
        points={`${BASE_X},${BASE_Y} ${BASE_X + W * ISO_X},${BASE_Y - W * ISO_Y} ${BASE_X + W * ISO_X - D * ISO_X},${BASE_Y - W * ISO_Y - D * ISO_Y} ${BASE_X - D * ISO_X},${BASE_Y - D * ISO_Y}`}
        fill="#f0fdf4" stroke="#6b7280" strokeWidth="1"
      />

      {/* Trees */}
      {[1, 2].map((t, i) => {
        const tx = BASE_X + W * ISO_X + i * 20;
        const ty = BASE_Y - W * ISO_Y - i * 10;
        return (
          <g key={t}>
            <line x1={tx} y1={ty} x2={tx} y2={ty - 30} stroke="#78350f" strokeWidth="2" />
            <circle cx={tx} cy={ty - 35} r="12" fill="#4ade80" opacity="0.85" />
          </g>
        );
      })}

      {/* Height label */}
      <line x1={BASE_X - D * ISO_X - 20} y1={BASE_Y - D * ISO_Y}
        x2={BASE_X - D * ISO_X - 20} y2={BASE_Y - D * ISO_Y - plan.numFloors * FLOOR_H}
        stroke="#6b7280" strokeWidth="1" strokeDasharray="3 2" />
      <text x={BASE_X - D * ISO_X - 30} y={BASE_Y - D * ISO_Y - plan.numFloors * FLOOR_H / 2}
        fontSize="8" fill="#374151" textAnchor="middle"
        transform={`rotate(-90, ${BASE_X - D * ISO_X - 30}, ${BASE_Y - D * ISO_Y - plan.numFloors * FLOOR_H / 2})`}>
        {(plan.numFloors * plan.floorHeight).toFixed(1)} m
      </text>

      <text x={SVG_W / 2} y={SVG_H - 5} textAnchor="middle" fontSize="7" fill="#9ca3af" fontStyle="italic">
        Conceptual 3D Massing — Not a Construction Drawing
      </text>
    </svg>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const MultiStoreyPlanner: React.FC = () => {
  const [plan, setPlan] = useState<PlannerState>({
    plotWidth: 20, plotDepth: 30, buildingWidth: 14, buildingDepth: 20,
    numFloors: 5, floorHeight: 3.0,
    frontSetback: 4, rearSetback: 3, sideSetback: 2,
    buildingType: 'Apartment',
    parkingArea: 60, greenArea: 80, solarArea: 45,
    orientationDeg: 0,
    hasLift: true, hasStaircase: true,
    hasRainwaterTank: true, hasSTP: false,
  });
  const [activeFloor, setActiveFloor] = useState(0);
  const [view, setView] = useState<'plan' | '3d'>('plan');

  const update = (key: keyof PlannerState, val: any) =>
    setPlan(p => ({ ...p, [key]: val }));

  const plotArea = plan.plotWidth * plan.plotDepth;
  const buildingFootprint = plan.buildingWidth * plan.buildingDepth;
  const totalBuiltUp = buildingFootprint * plan.numFloors;
  const far = plotArea > 0 ? +(totalBuiltUp / plotArea).toFixed(2) : 0;
  const groundCov = plotArea > 0 ? +((buildingFootprint / plotArea) * 100).toFixed(1) : 0;
  const totalHeight = +(plan.numFloors * plan.floorHeight).toFixed(1);

  const NumInput = ({ label, stateKey, min = 0, max = 999, step = 1, unit = '' }: { label: string; stateKey: keyof PlannerState; min?: number; max?: number; step?: number; unit?: string }) => (
    <div>
      <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">{label}{unit ? ` (${unit})` : ''}</label>
      <input type="number" value={plan[stateKey] as number} min={min} max={max} step={step}
        onChange={e => update(stateKey, parseFloat(e.target.value) || 0)}
        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-400 bg-white"
      />
    </div>
  );

  const Toggle = ({ label, stateKey, icon }: { label: string; stateKey: keyof PlannerState; icon: React.ReactNode }) => (
    <button onClick={() => update(stateKey, !plan[stateKey])}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${plan[stateKey] ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
      {plan[stateKey] ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {icon} {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center shadow-lg shrink-0">
          <Building className="w-6 h-6 text-blue-200" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">Multi-Storey Architectural Planner</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Conceptual CAD-style floor plan and 3D massing view.{' '}
            <span className="text-amber-700 font-semibold">Not a construction drawing.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Building Typology */}
          <div className="eco-card p-4 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Building Typology</label>
            <select
              value={plan.buildingType}
              onChange={(e) => update('buildingType', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-400 bg-white font-medium"
            >
              {[
                "Individual Residential", "Villa", "Apartment", "Multi-Storey Residential",
                "Group Housing", "Commercial", "Office", "Educational", "Institutional",
                "Mixed-use", "Public Building", "Sustainable Community"
              ].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Plot */}
          <div className="eco-card p-4 space-y-3">
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-emerald-500" /> Plot Dimensions</p>
            <div className="grid grid-cols-2 gap-2">
              <NumInput label="Width" stateKey="plotWidth" min={5} max={200} unit="m" />
              <NumInput label="Depth" stateKey="plotDepth" min={5} max={300} unit="m" />
            </div>
            <div className="text-xs bg-emerald-50 rounded-lg px-3 py-2 text-emerald-800">
              <span className="font-bold">Plot Area:</span> {plotArea.toFixed(0)} m²
            </div>
          </div>

          {/* Building */}
          <div className="eco-card p-4 space-y-3">
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-blue-500" /> Building Footprint</p>
            <div className="grid grid-cols-2 gap-2">
              <NumInput label="Width" stateKey="buildingWidth" min={3} max={100} unit="m" />
              <NumInput label="Depth" stateKey="buildingDepth" min={3} max={150} unit="m" />
            </div>
            <NumInput label="Number of Floors" stateKey="numFloors" min={1} max={50} />
            <NumInput label="Floor-to-Floor Height" stateKey="floorHeight" min={2.4} max={6} step={0.1} unit="m" />
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="bg-blue-50 rounded px-2 py-1.5"><span className="text-blue-600 font-bold">Total Height:</span> {totalHeight} m</div>
              <div className="bg-blue-50 rounded px-2 py-1.5"><span className="text-blue-600 font-bold">FAR:</span> {far}</div>
              <div className="bg-amber-50 rounded px-2 py-1.5"><span className="text-amber-600 font-bold">Ground Cov:</span> {groundCov}%</div>
              <div className="bg-emerald-50 rounded px-2 py-1.5"><span className="text-emerald-600 font-bold">Built-Up:</span> {totalBuiltUp.toFixed(0)} m²</div>
            </div>
          </div>

          {/* Setbacks */}
          <div className="eco-card p-4 space-y-3">
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-amber-500" /> Setbacks</p>
            <div className="grid grid-cols-3 gap-2">
              <NumInput label="Front" stateKey="frontSetback" min={0} step={0.5} unit="m" />
              <NumInput label="Rear" stateKey="rearSetback" min={0} step={0.5} unit="m" />
              <NumInput label="Side" stateKey="sideSetback" min={0} step={0.5} unit="m" />
            </div>
          </div>

          {/* Areas */}
          <div className="eco-card p-4 space-y-3">
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Trees className="w-3.5 h-3.5 text-emerald-500" /> Sustainable Areas</p>
            <NumInput label="Parking Area" stateKey="parkingArea" min={0} unit="m²" />
            <NumInput label="Green / Open Area" stateKey="greenArea" min={0} unit="m²" />
            <NumInput label="Solar Panel Area" stateKey="solarArea" min={0} unit="m²" />
          </div>

          {/* Features */}
          <div className="eco-card p-4 space-y-2">
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-500" /> Building Features</p>
            <div className="grid grid-cols-2 gap-2">
              <Toggle label="Lift" stateKey="hasLift" icon={<ZapOff className="w-3 h-3" />} />
              <Toggle label="Staircase" stateKey="hasStaircase" icon={<Layers className="w-3 h-3" />} />
              <Toggle label="RWH Tank" stateKey="hasRainwaterTank" icon={<Droplets className="w-3 h-3" />} />
              <Toggle label="STP Zone" stateKey="hasSTP" icon={<Wind className="w-3 h-3" />} />
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-3 space-y-4">
          {/* View toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button onClick={() => setView('plan')}
                className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${view === 'plan' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                2D Floor Plan
              </button>
              <button onClick={() => setView('3d')}
                className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${view === '3d' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                3D Massing View
              </button>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full font-bold">
              Conceptual Design Only
            </span>
          </div>

          {/* Floor switcher (2D only) */}
          {view === 'plan' && (
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setActiveFloor(Math.max(0, activeFloor - 1))} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: plan.numFloors + 1 }, (_, i) => (
                <button key={i} onClick={() => setActiveFloor(i)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${activeFloor === i ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                  {i === 0 ? 'G' : i === plan.numFloors ? 'Roof' : `F${i}`}
                </button>
              ))}
              <button onClick={() => setActiveFloor(Math.min(plan.numFloors, activeFloor + 1))} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main visualization */}
          {view === 'plan' ? (
            <CADFloorPlan plan={plan} floor={activeFloor} />
          ) : (
            <Massing3D plan={plan} />
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Plot Area', value: `${plotArea.toFixed(0)} m²`, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' },
              { label: 'Built-Up Area', value: `${totalBuiltUp.toFixed(0)} m²`, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
              { label: 'Total Height', value: `${totalHeight} m`, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
              { label: 'Green Area', value: `${plan.greenArea} m²`, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border rounded-xl p-3 text-center`}>
                <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 italic">
              <strong>Conceptual / Preliminary Design — Not a Construction Drawing.</strong>{' '}
              This floor plan and 3D view are simplified conceptual representations for planning purposes only.
              They do not constitute a structural, architectural, or statutory drawing and must not be used for construction or building permit applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
