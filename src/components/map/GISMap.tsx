import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DisasterEvent, IncidentReport, ReliefResource, LocationCoordinates } from '../../types/disaster';
import { RiskBadge, VerificationBadge } from '../common/TrustBadges';
import { Layers, CloudRain, Eye, Maximize2, Minimize2 } from 'lucide-react';

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
  isDark?: boolean;
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
  onToggleFullScreen,
  isDark = true,
}) => {
  const [showHazards, setShowHazards] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showAffectedZones, setShowAffectedZones] = useState(true);
  const [showRainfallLayer, setShowRainfallLayer] = useState(false);

  const centerPos: [number, number] = selectedEvent
    ? [selectedEvent.lat, selectedEvent.lng]
    : [currentLocation.lat, currentLocation.lng];
  const mapZoom = selectedEvent ? 11 : 9;

  const createMarkerIcon = (type: string, severity: string) => {
    let colorHex = '#D65A1F';
    if (severity === 'critical') colorHex = '#ef4444';
    if (severity === 'high')     colorHex = '#f97316';
    if (severity === 'moderate') colorHex = '#f59e0b';
    if (severity === 'low')      colorHex = '#22c55e';

    let iconSymbol = '⚠';
    if (type === 'flood' || type === 'heavy_rain') iconSymbol = '🌊';
    if (type === 'landslide')  iconSymbol = '⛰️';
    if (type === 'cyclone')    iconSymbol = '🌀';
    if (type === 'earthquake') iconSymbol = '⚡';
    if (type === 'heatwave')   iconSymbol = '☀️';

    const ringStyle = severity === 'critical'
      ? `box-shadow: 0 0 0 0 ${colorHex}66; animation: incidentPulse 1.8s ease infinite;`
      : `box-shadow: 0 4px 14px rgba(0,0,0,0.55);`;

    const html = `
      <div class="incident-pulse" style="
        position: relative;
        background-color: ${colorHex};
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        font-weight: bold;
        border: 2px solid rgba(255,255,255,0.6);
        ${ringStyle}
      ">
        ${iconSymbol}
      </div>
    `;

    return L.divIcon({ html, className: 'custom-disaster-marker', iconSize: [36, 36], iconAnchor: [18, 18] });
  };

  const createReportIcon = () => {
    const html = `
      <div style="
        background-color: #38bdf8;
        color: white;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        border: 2px solid rgba(255,255,255,0.6);
      ">📍</div>
    `;
    return L.divIcon({ html, className: 'custom-report-marker', iconSize: [26, 26], iconAnchor: [13, 13] });
  };

  const createResourceIcon = (resType: string) => {
    let iconChar = '🏥';
    if (resType === 'shelter')       iconChar = '⛺';
    if (resType === 'relief_centre') iconChar = '📦';
    if (resType === 'police')        iconChar = '👮';
    if (resType === 'fire_station')  iconChar = '🚒';

    const html = `
      <div style="
        background-color: #0284c7;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.45);
        border: 2px solid rgba(255,255,255,0.5);
      ">${iconChar}</div>
    `;
    return L.divIcon({ html, className: 'custom-resource-marker', iconSize: [30, 30], iconAnchor: [15, 15] });
  };

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttrib = isDark
    ? '&copy; <a href="https://carto.com/">CartoDB</a> | India Emergency Intel'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | India Emergency Intel';

  const panelStyle = isDark
    ? { background: 'rgba(4,14,31,0.95)', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px' }
    : { background: 'rgba(255,255,255,0.95)', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px' };

  const checkboxStyle = isDark ? { accentColor: '#38bdf8' } : { accentColor: '#2563eb' };

  const popupTitleColor = isDark ? '#f8fafc' : '#0f172a';
  const popupTextColor  = isDark ? '#cbd5e1' : '#334155';
  const popupMutedColor = isDark ? '#94a3b8' : '#64748b';
  const popupBorderColor= isDark ? '#334155' : '#cbd5e1';
  const popupBoxBg      = isDark ? '#1f2a3c' : '#e2e8f0';

  return (
    <div className={`relative w-full ${isFullScreen ? 'fixed inset-0 z-50 h-screen' : 'h-full rounded-xl overflow-hidden'}`}
      style={{ background: isDark ? '#081425' : '#e4ecf8' }}>

      {/* Layer Controls Panel */}
      <div className="absolute top-3 left-3 z-[1000] p-3 text-xs max-w-[210px] shadow-ops" style={panelStyle}>
        <div className="flex items-center gap-1.5 pb-2 mb-2 border-b font-mono font-bold text-[10px] tracking-widest"
          style={{ borderColor: popupBorderColor }}>
          <Layers className="w-3.5 h-3.5" style={{ color: '#38bdf8' }} /> LAYER CONTROLS
        </div>
        <div className="space-y-1.5 font-mono text-[10px]">
          {[
            { label: `HAZARDS (${events.length})`, val: showHazards, set: setShowHazards },
            { label: `REPORTS (${reports.length})`, val: showReports, set: setShowReports },
            { label: `RESOURCES (${resources.length})`, val: showResources, set: setShowResources },
            { label: 'AFFECTED ZONES', val: showAffectedZones, set: setShowAffectedZones },
          ].map(({ label, val, set }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer tracking-wider">
              <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} style={checkboxStyle} />
              <span>{label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer tracking-wider pt-1"
            style={{ borderTop: `1px solid ${popupBorderColor}`, marginTop: '4px' }}>
            <input type="checkbox" checked={showRainfallLayer} onChange={(e) => setShowRainfallLayer(e.target.checked)} style={checkboxStyle} />
            <span className="flex items-center gap-1" style={{ color: '#38bdf8' }}>
              <CloudRain style={{ width: 12, height: 12 }} /> IMD RAIN
            </span>
          </label>
        </div>
      </div>

      {/* Fullscreen Toggle */}
      {onToggleFullScreen && (
        <button
          onClick={onToggleFullScreen}
          className="absolute top-3 right-3 z-[1000] p-2 rounded-md transition-colors"
          style={{ ...panelStyle, cursor: 'pointer' }}
          title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen GIS Exploration'}
        >
          {isFullScreen ? <Minimize2 style={{ width: 16, height: 16 }} /> : <Maximize2 style={{ width: 16, height: 16 }} />}
        </button>
      )}

      {/* Leaflet Map */}
      <MapContainer center={centerPos} zoom={mapZoom} scrollWheelZoom className="w-full h-full">
        <MapRecenter center={centerPos} zoom={mapZoom} />

        <TileLayer attribution={tileAttrib} url={tileUrl} />

        {showRainfallLayer && (
          <TileLayer
            opacity={0.35}
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=93e986bd3469eead696e737c35293237"
          />
        )}

        {/* Current Location Marker */}
        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={L.divIcon({
            html: `<div style="background:#38bdf8;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(56,189,248,0.8);"></div>`,
            className: 'user-pos-marker',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })}
        >
          <Popup>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: popupTitleColor }}>
              <strong>// YOUR SECTOR</strong>
              <div style={{ color: popupTextColor, fontWeight: 600 }}>{currentLocation.name}, {currentLocation.state}</div>
              <div style={{ color: popupMutedColor, fontSize: '10px', marginTop: 2 }}>
                LAT {currentLocation.lat.toFixed(4)}°N · LNG {currentLocation.lng.toFixed(4)}°E
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Disaster Hazard Markers */}
        {showHazards && events.map((evt) => (
          <React.Fragment key={evt.id}>
            {showAffectedZones && (
              <Circle
                center={[evt.lat, evt.lng]}
                radius={evt.affectedRadiusKm * 1000}
                pathOptions={{
                  color: evt.severity === 'critical' ? '#ef4444' : evt.severity === 'high' ? '#f97316' : '#f59e0b',
                  fillColor: evt.severity === 'critical' ? '#ef4444' : evt.severity === 'high' ? '#f97316' : '#f59e0b',
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: '5, 5',
                }}
              />
            )}
            <Marker
              position={[evt.lat, evt.lng]}
              icon={createMarkerIcon(evt.type, evt.severity)}
              eventHandlers={{ click: () => onSelectEvent(evt) }}
            >
              <Popup maxWidth={280}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: popupTitleColor, background: isDark ? '#152031' : '#fff' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${popupBorderColor}` }}>
                    <RiskBadge severity={evt.severity} size="compact" />
                    <VerificationBadge status={evt.verificationStatus} />
                  </div>
                  <strong style={{ fontSize: 12, color: popupTitleColor }}>{evt.title}</strong>
                  <p style={{ color: popupTextColor, marginTop: 4, fontSize: 11, lineHeight: 1.5, fontFamily: 'Hanken Grotesk, sans-serif' }}>{evt.description}</p>
                  <div style={{ marginTop: 6, padding: '6px 8px', background: popupBoxBg, borderRadius: 4, fontSize: 10, color: popupTextColor }}>
                    <div>ZONE: <strong>{evt.locationName.toUpperCase()}</strong></div>
                    <div>RADIUS: <strong>{evt.affectedRadiusKm} KM</strong></div>
                    <div>CONFIDENCE: <strong>{evt.confidenceScore}%</strong></div>
                    {evt.rainfallMm && <div>RAINFALL: <strong>{evt.rainfallMm} mm/24h</strong></div>}
                  </div>
                  <button
                    onClick={() => onSelectEvent(evt)}
                    style={{
                      marginTop: 8, width: '100%', background: '#0284c7', color: '#fff',
                      border: 'none', padding: '7px 8px', borderRadius: 4, fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      letterSpacing: '0.08em',
                    }}
                  >
                    ▶ VIEW INTEL DOSSIER
                  </button>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {/* Public Report Markers */}
        {showReports && reports.map((rep) => (
          <Marker key={rep.id} position={[rep.lat, rep.lng]} icon={createReportIcon()}>
            <Popup maxWidth={240}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: popupTitleColor }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ color: popupTitleColor }}>{rep.userName.toUpperCase()}</strong>
                  <VerificationBadge status={rep.verificationStatus} />
                </div>
                <p style={{ color: popupTextColor, fontSize: 11, lineHeight: 1.5, fontFamily: 'Hanken Grotesk, sans-serif' }}>{rep.description}</p>
                <div style={{ color: popupMutedColor, fontSize: 10, marginTop: 4 }}>
                  📍 {rep.locationName.toUpperCase()} · 👍 {rep.upvotes} corroborated
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Relief Resources */}
        {showResources && resources.map((res) => (
          <Marker key={res.id} position={[res.lat, res.lng]} icon={createResourceIcon(res.type)}>
            <Popup maxWidth={250}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: popupTitleColor }}>
                <div style={{ fontSize: 9, letterSpacing: '0.1em', color: '#38bdf8', marginBottom: 2 }}>{res.type.replace('_', ' ').toUpperCase()}</div>
                <strong style={{ fontSize: 12, color: popupTitleColor }}>{res.name}</strong>
                {/* High contrast address */}
                <p style={{ color: popupTextColor, fontSize: 11, marginTop: 3, lineHeight: 1.4, fontFamily: 'Hanken Grotesk, sans-serif' }}>{res.address}</p>
                <div style={{ color: '#22c55e', fontWeight: 700, marginTop: 5, fontSize: 11 }}>📞 {res.phone}</div>
                {res.capacity && <div style={{ color: popupMutedColor, fontSize: 10, marginTop: 2 }}>CAPACITY: {res.capacity}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] p-2.5 text-[10px] font-mono shadow-ops" style={panelStyle}>
        <div className="font-bold tracking-widest mb-1.5 pb-1" style={{ borderBottom: `1px solid ${popupBorderColor}` }}>
          // RISK LEGEND
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {[
            { color: '#ef4444', label: 'CRITICAL' },
            { color: '#f97316', label: 'HIGH' },
            { color: '#f59e0b', label: 'MODERATE' },
            { color: '#22c55e', label: 'LOW' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
              <span style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
