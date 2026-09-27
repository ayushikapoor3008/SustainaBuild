import React, { useEffect, useRef } from 'react';
import { Compass, Sun, Wind, MapPin } from 'lucide-react';
import type { ProjectInfo } from '../types/ecobuild';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SiteMapProps {
  project: ProjectInfo;
  climateZone?: string;
  windSpeed?: number;
  windDir?: string;
}

const customIcon = L.divIcon({
  className: 'custom-leaflet-pin',
  html: `<div style="background-color: #1b3b2b; color: white; padding: 6px; border-radius: 50%; border: 3px solid #22c55e; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export const SiteMap: React.FC<SiteMapProps> = ({
  project,
  climateZone = "Composite / Semi-Arid",
  windSpeed = 3.2,
  windDir = "NW"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [project.latitude, project.longitude],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const marker = L.marker([project.latitude, project.longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${project.project_name}</b><br/>${project.location} (${project.latitude.toFixed(4)}°, ${project.longitude.toFixed(4)}°)`)
      .openPopup();

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // mount only

  // Move marker & pan map whenever location changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const latLng: L.LatLngExpression = [project.latitude, project.longitude];
    marker.setLatLng(latLng);
    marker.setPopupContent(
      `<b>${project.project_name}</b><br/>${project.location} (${project.latitude.toFixed(4)}°, ${project.longitude.toFixed(4)}°)`
    );
    marker.openPopup();
    map.flyTo(latLng, 13, { duration: 1.2 });
  }, [project.latitude, project.longitude, project.location, project.project_name]);

  return (
    <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs font-semibold text-emerald-950">
          <Compass className="w-4 h-4 text-emerald-700 animate-spin" style={{ animationDuration: '20s' }} />
          <span>North Orientation: 0° (True North)</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Sun className="w-4 h-4 text-amber-600" />
          <span>Zone: {climateZone}</span>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Wind className="w-4 h-4 text-blue-600" />
          <span>Prevailing Wind: {windDir} @ {windSpeed} m/s</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-10 bg-emerald-950/90 text-emerald-100 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span>{project.location} ({project.latitude.toFixed(4)}° N, {project.longitude.toFixed(4)}° E)</span>
      </div>
    </div>
  );
};
