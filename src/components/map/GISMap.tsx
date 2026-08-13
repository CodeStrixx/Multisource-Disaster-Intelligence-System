import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DisasterEvent, IncidentReport, ReliefResource, LocationCoordinates } from '../../types/disaster';
import { RiskBadge, VerificationBadge } from '../common/TrustBadges';
import { Layers, ShieldAlert, LifeBuoy, MapPin, Eye, Maximize2, Minimize2, CloudRain, AlertTriangle } from 'lucide-react';

// Custom Map Auto-center controller
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface GISMapProps {
  events: DisasterEvent[];
  reports: IncidentReport[];
  resources: ReliefResource[];
  currentLocation: LocationCoordinates;
  selectedEvent: DisasterEvent | null;
  onSelectEvent: (event: DisasterEvent) => void;
  onSelectReport?: (report: IncidentReport) => void;
  onSelectResource?: (resource: ReliefResource) => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  events,
  reports,
  resources,
  currentLocation,
  selectedEvent,
  onSelectEvent,
  onSelectReport,
  onSelectResource,
  isFullScreen = false,
  onToggleFullScreen
}) => {
  // Layer visibility state
  const [showHazards, setShowHazards] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showAffectedZones, setShowAffectedZones] = useState(true);
  const [showRainfallLayer, setShowRainfallLayer] = useState(false);

  // Map center logic
  const centerPos: [number, number] = selectedEvent
    ? [selectedEvent.lat, selectedEvent.lng]
    : [currentLocation.lat, currentLocation.lng];

  const mapZoom = selectedEvent ? 11 : 9;

  // Custom marker helper
  const createMarkerIcon = (type: string, severity: string, count?: number) => {
    let colorHex = '#D65A1F';
    if (severity === 'critical') colorHex = '#C62828';
    if (severity === 'high') colorHex = '#D65A1F';
    if (severity === 'moderate') colorHex = '#C88719';
    if (severity === 'low') colorHex = '#18864B';

    let iconSymbol = '⚠';
    if (type === 'flood' || type === 'heavy_rain') iconSymbol = '🌊';
    if (type === 'landslide') iconSymbol = '⛰️';
    if (type === 'cyclone') iconSymbol = '🌀';
    if (type === 'earthquake') iconSymbol = '⚡';
    if (type === 'heatwave') iconSymbol = '☀️';

    const html = `
      <div style="
        background-color: ${colorHex};
        color: white;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(15,23,42,0.35);
        border: 3px solid white;
      ">
        ${iconSymbol}
      </div>
    `;

    return L.divIcon({ html, className: 'custom-disaster-marker', iconSize: [38, 38], iconAnchor: [19, 19] });
  };

  // Custom icon for citizen public report
  const createReportIcon = () => {
    const html = `
      <div style="
        background-color: #1976A8;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        📍
      </div>
    `;
    return L.divIcon({ html, className: 'custom-report-marker', iconSize: [28, 28], iconAnchor: [14, 14] });
  };

  // Custom icon for relief resource
  const createResourceIcon = (resType: string) => {
    let iconChar = '🏥';
    if (resType === 'shelter') iconChar = '⛺';
    if (resType === 'relief_centre') iconChar = '📦';
    if (resType === 'police') iconChar = '👮';
    if (resType === 'fire_station') iconChar = '🚒';

    const html = `
      <div style="
        background-color: #155A85;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        border: 2px solid white;
      ">
        ${iconChar}
      </div>
    `;
    return L.divIcon({ html, className: 'custom-resource-marker', iconSize: [32, 32], iconAnchor: [16, 16] });
  };

  return (
    <div className={`relative w-full ${isFullScreen ? 'fixed inset-0 z-50 bg-white h-screen' : 'h-[460px] lg:h-[580px] rounded-xl overflow-hidden border border-surface-border shadow-md'}`}>
      
      {/* Map Layer Controls Panel Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-surface-border text-xs max-w-[220px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-border font-bold text-brand-900">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-700" /> Layer Controls
          </span>
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-textMain-primary hover:text-brand-900">
            <input
              type="checkbox"
              checked={showHazards}
              onChange={(e) => setShowHazards(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-500"
            />
            <span>Active Hazards ({events.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-textMain-primary hover:text-brand-900">
            <input
              type="checkbox"
              checked={showReports}
              onChange={(e) => setShowReports(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-500"
            />
            <span>Public Reports ({reports.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-textMain-primary hover:text-brand-900">
            <input
              type="checkbox"
              checked={showResources}
              onChange={(e) => setShowResources(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-500"
            />
            <span>Relief Resources ({resources.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-textMain-primary hover:text-brand-900">
            <input
              type="checkbox"
              checked={showAffectedZones}
              onChange={(e) => setShowAffectedZones(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-500"
            />
            <span>Affected Radius Zones</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-textMain-primary hover:text-brand-900 pt-1 border-t border-surface-border/60">
            <input
              type="checkbox"
              checked={showRainfallLayer}
              onChange={(e) => setShowRainfallLayer(e.target.checked)}
              className="rounded text-brand-700 focus:ring-brand-500"
            />
            <span className="flex items-center gap-1 text-brand-700">
              <CloudRain className="w-3.5 h-3.5" /> IMD Rain Intensity
            </span>
          </label>
        </div>
      </div>

      {/* FullScreen Toggle Button */}
      {onToggleFullScreen && (
        <button
          onClick={onToggleFullScreen}
          className="absolute top-3 right-3 z-[1000] bg-white p-2 rounded-lg shadow-md border border-surface-border text-brand-900 hover:bg-brand-50 transition-colors"
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen GIS Exploration"}
        >
          {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      )}

      {/* Leaflet Map Renderer */}
      <MapContainer
        center={centerPos}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={centerPos} zoom={mapZoom} />

        {/* Standard OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | India Emergency Intelligence'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Optional Rainfall Intensity Tile Overlay simulation */}
        {showRainfallLayer && (
          <TileLayer
            opacity={0.35}
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=93e986bd3469eead696e737c35293237"
          />
        )}

        {/* Current Location User Marker */}
        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={L.divIcon({
            html: `<div style="background:#155A85;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.5);" className="animate-ping"></div>`,
            className: 'user-pos-marker',
            iconSize: [16, 16]
          })}
        >
          <Popup>
            <div className="text-xs">
              <strong>Your Selected Location:</strong>
              <div>{currentLocation.name}, {currentLocation.state}</div>
            </div>
          </Popup>
        </Marker>

        {/* Active Disaster Hazard Markers & Circles */}
        {showHazards && events.map((evt) => (
          <React.Fragment key={evt.id}>
            {/* Affected Zone Circle */}
            {showAffectedZones && (
              <Circle
                center={[evt.lat, evt.lng]}
                radius={evt.affectedRadiusKm * 1000}
                pathOptions={{
                  color: evt.severity === 'critical' ? '#C62828' : evt.severity === 'high' ? '#D65A1F' : '#C88719',
                  fillColor: evt.severity === 'critical' ? '#C62828' : evt.severity === 'high' ? '#D65A1F' : '#C88719',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '4, 4'
                }}
              />
            )}

            {/* Event Marker */}
            <Marker
              position={[evt.lat, evt.lng]}
              icon={createMarkerIcon(evt.type, evt.severity)}
              eventHandlers={{
                click: () => onSelectEvent(evt)
              }}
            >
              <Popup maxWidth={300}>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                    <RiskBadge severity={evt.severity} size="compact" />
                    <VerificationBadge status={evt.verificationStatus} />
                  </div>
                  
                  <h4 className="font-bold text-sm text-brand-900 leading-snug">{evt.title}</h4>
                  <p className="text-textMain-secondary line-clamp-2">{evt.description}</p>
                  
                  <div className="bg-brand-50 p-2 rounded text-[11px] space-y-1">
                    <div><strong>Location:</strong> {evt.locationName}</div>
                    {evt.rainfallMm && <div><strong>Rainfall:</strong> {evt.rainfallMm} mm (24h)</div>}
                    <div><strong>Confidence:</strong> {evt.confidenceScore}% (Multi-source)</div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => onSelectEvent(evt)}
                      className="flex-1 bg-brand-700 text-white font-semibold py-1.5 px-2 rounded text-xs hover:bg-brand-900 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Public Citizen Reports Markers */}
        {showReports && reports.map((rep) => (
          <Marker
            key={rep.id}
            position={[rep.lat, rep.lng]}
            icon={createReportIcon()}
          >
            <Popup maxWidth={260}>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-900">{rep.userName}</span>
                  <VerificationBadge status={rep.verificationStatus} />
                </div>
                <p className="text-textMain-primary font-medium">{rep.description}</p>
                <div className="text-[11px] text-textMain-muted">📍 {rep.locationName}</div>
                <div className="text-[10px] text-textMain-secondary">👍 {rep.upvotes} citizens corroborated</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Relief Resources & Emergency Services */}
        {showResources && resources.map((res) => (
          <Marker
            key={res.id}
            position={[res.lat, res.lng]}
            icon={createResourceIcon(res.type)}
          >
            <Popup maxWidth={260}>
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">{res.type.replace('_', ' ')}</span>
                <h4 className="font-bold text-brand-900">{res.name}</h4>
                <p className="text-textMain-secondary">{res.address}</p>
                <div className="text-brand-700 font-semibold pt-1">📞 Call: {res.phone}</div>
                {res.capacity && <div className="text-[11px] text-emerald-700 font-medium">Capacity: {res.capacity}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Map Legend Overlay at Bottom Right */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-lg border border-surface-border text-[11px]">
        <div className="font-bold text-brand-900 mb-1.5 border-b pb-1">Risk Severity Legend</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]"></span>
            <span className="font-semibold text-red-700">Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D65A1F]"></span>
            <span className="font-semibold text-orange-700">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C88719]"></span>
            <span className="font-semibold text-amber-700">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#18864B]"></span>
            <span className="font-semibold text-emerald-700">Low</span>
          </div>
        </div>
      </div>

    </div>
  );
};
