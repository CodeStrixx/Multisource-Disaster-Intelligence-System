import React from 'react';
import { DisasterEvent, IncidentReport, ReliefResource, LocationCoordinates } from '../../types/disaster';
import { REPORT_VERIFY_UPVOTES, WeatherSnapshot } from '../../services/api';
import { RiskBadge, VerificationBadge, FreshnessIndicator } from '../common/TrustBadges';
import { GISMap } from '../map/GISMap';
import {
  MapPin, Eye, AlertTriangle, RefreshCw, Layers, PlusCircle,
  Bookmark, Activity, ShieldAlert, Users, ChevronRight, Radio,
  Cloud, CloudRain, CloudLightning, CloudFog, CloudSun, Sun, Snowflake,
  Thermometer, Droplets, Wind, Satellite
} from 'lucide-react';

interface DashboardScreenProps {
  currentLocation: LocationCoordinates;
  events: DisasterEvent[];
  reports: IncidentReport[];
  resources: ReliefResource[];
  selectedEvent: DisasterEvent | null;
  onSelectEvent: (event: DisasterEvent) => void;
  onOpenSearch: () => void;
  onFindHelp: () => void;
  onReportIncident: () => void;
  onOpenSavedLocations: () => void;
  isDark?: boolean;
  isLoading?: boolean;
  isOffline?: boolean;
  weather?: WeatherSnapshot | null;
  onUpvoteReport?: (reportId: string) => void;
}

// Map a weather condition string to a themed icon
const getWeatherIcon = (condition: string | null | undefined) => {
  const c = (condition || '').toLowerCase();
  const cls = 'w-6 h-6 text-status-info';
  if (c.includes('thunder')) return <CloudLightning className="w-6 h-6 text-status-warning" />;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain className={cls} />;
  if (c.includes('snow')) return <Snowflake className={cls} />;
  if (c.includes('fog') || c.includes('mist') || c.includes('rime')) return <CloudFog className={cls} />;
  if (c.includes('clear') || c.includes('sun')) return <Sun className="w-6 h-6 text-status-warning" />;
  if (c.includes('overcast')) return <Cloud className={cls} />;
  return <CloudSun className={cls} />;
};

const WARNING_META: Record<string, { label: string; cls: string }> = {
  none:    { label: 'NO ADVISORY',       cls: 'text-status-success bg-status-success-bg/20 border-status-success/40' },
  alert:   { label: 'ADVISORY ACTIVE',   cls: 'text-status-warning bg-status-warning-bg/20 border-status-warning/40' },
  watch:   { label: 'OFFICIAL WATCH',    cls: 'text-status-warning bg-status-warning-bg/30 border-status-warning/60' },
  warning: { label: 'OFFICIAL WARNING',  cls: 'text-status-critical bg-status-critical-bg/20 border-status-critical/50' },
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentLocation,
  events,
  reports,
  resources,
  selectedEvent,
  onSelectEvent,
  onOpenSearch,
  onFindHelp,
  onReportIncident,
  onOpenSavedLocations,
  isDark = true,
  isLoading = false,
  isOffline = false,
  weather,
  onUpvoteReport,
}) => {
  const locationEvents = events.filter(
    (e) =>
      e.district.toLowerCase() === currentLocation.district.toLowerCase() ||
      e.state.toLowerCase() === currentLocation.state.toLowerCase()
  );
  const activeHazard = selectedEvent || (locationEvents.length > 0 ? locationEvents[0] : events[0]);

  // Theme classes
  const card     = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow  = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text     = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted    = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline  = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider  = isDark ? 'border-ops-divider' : 'border-day-divider';
  const btnPrimary = 'bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-md transition-all flex items-center gap-2';
  const btnSecondary = isDark
    ? 'bg-ops-high hover:bg-ops-highest border border-ops-divider text-ops-muted hover:text-ops-text font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-md transition-all flex items-center gap-2'
    : 'bg-day-container hover:bg-day-high border border-day-divider text-day-muted hover:text-day-text font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-md transition-all flex items-center gap-2';

  const getSeverityAccent = (sev: string) => {
    switch (sev) {
      case 'critical': return isDark ? 'border-l-4 border-l-status-critical bg-status-critical-bg/10' : 'border-l-4 border-l-red-500 bg-red-50';
      case 'high':     return isDark ? 'border-l-4 border-l-orange-500 bg-orange-900/10'              : 'border-l-4 border-l-orange-400 bg-orange-50';
      case 'moderate': return isDark ? 'border-l-4 border-l-status-warning bg-status-warning-bg/10'   : 'border-l-4 border-l-amber-500 bg-amber-50';
      default:         return isDark ? 'border-l-4 border-l-status-success bg-status-success-bg/10'   : 'border-l-4 border-l-green-500 bg-green-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 animate-fadeIn">

      {/* ── Offline Banner ── */}
      {isOffline && (
        <div className="bg-status-warning-bg/80 text-status-warning px-4 py-2 rounded-md text-xs font-mono font-semibold flex items-center justify-between border border-status-warning/40">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            CACHE MODE — Last sync 15 min ago. Live data unavailable.
          </span>
          <button onClick={() => window.location.reload()} className="flex items-center gap-1 underline hover:no-underline">
            <RefreshCw className="w-3 h-3" /> RETRY
          </button>
        </div>
      )}

      {/* ── Location / Sector Header ── */}
      <div className={`${card} rounded-xl p-4 border flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? 'bg-ops-high border-ops-divider' : 'bg-day-container border-day-divider'}`}>
            <MapPin className="w-5 h-5 text-status-info" />
          </div>
          <div>
            <div className={`text-[10px] font-mono tracking-widest uppercase ${outline}`}>// MONITORING SECTOR</div>
            <h2 className={`text-lg font-bold font-mono tracking-tight leading-tight ${text}`}>
              {currentLocation.name.toUpperCase()}, {currentLocation.state.toUpperCase()}
            </h2>
            <div className={`text-[10px] font-mono ${outline} mt-0.5`}>
              LAT {currentLocation.lat.toFixed(4)}°N · LNG {currentLocation.lng.toFixed(4)}°E · {currentLocation.district.toUpperCase()} DISTRICT
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onOpenSearch} className={btnSecondary}>
            <MapPin className="w-3.5 h-3.5" /> CHANGE SECTOR
          </button>
          <button onClick={onOpenSavedLocations} className={btnSecondary}>
            <Bookmark className="w-3.5 h-3.5" /> SAVED
          </button>
        </div>
      </div>

      {/* ── Live Weather Telemetry ── */}
      {weather && weather.observedAt ? (
        <div className={`${card} rounded-xl p-4 border space-y-3`}>
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b ${divider} pb-2`}>
            <div className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 ${outline}`}>
              <Satellite className="w-3.5 h-3.5 text-status-info" /> // LIVE WEATHER FEED — {currentLocation.name.toUpperCase()}
            </div>
            <div className="flex items-center gap-2">
              {weather.isStale && (
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${isDark ? 'bg-status-warning-bg/20 border-status-warning/40 text-status-warning' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
                  ⚠ STALE DATA
                </span>
              )}
              <span className={`text-[10px] font-mono ${outline}`}>
                OBS {weather.observedAt.slice(11, 16)} UTC · VIA {(weather.provider || 'BACKEND').replace('_', '-').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Condition tile */}
            <div className={`${cardLow} rounded-lg p-3 border flex items-center gap-3`}>
              {getWeatherIcon(weather.weatherCondition)}
              <div className="min-w-0">
                <div className={`text-[9px] font-mono tracking-widest uppercase ${outline}`}>CONDITION</div>
                <div className={`font-mono font-bold text-xs truncate ${text}`} title={weather.weatherCondition || undefined}>
                  {(weather.weatherCondition || 'UNKNOWN').toUpperCase()}
                </div>
              </div>
            </div>

            {/* Temperature tile */}
            <div className={`${cardLow} rounded-lg p-3 border flex items-center gap-3`}>
              <Thermometer className="w-6 h-6 text-status-critical" />
              <div>
                <div className={`text-[9px] font-mono tracking-widest uppercase ${outline}`}>TEMPERATURE</div>
                <div className={`font-mono font-bold text-xs ${text}`}>
                  {weather.temperature != null ? `${weather.temperature.toFixed(1)}°C` : '—'}
                </div>
              </div>
            </div>

            {/* Rainfall tile */}
            <div className={`${cardLow} rounded-lg p-3 border flex items-center gap-3`}>
              <Droplets className="w-6 h-6 text-status-info" />
              <div>
                <div className={`text-[9px] font-mono tracking-widest uppercase ${outline}`}>RAINFALL 24H</div>
                <div className={`font-mono font-bold text-xs ${(weather.rainfallMm24h || 0) >= 64.5 ? 'text-status-warning' : text}`}>
                  {weather.rainfallMm24h != null ? `${weather.rainfallMm24h.toFixed(1)} MM` : '—'}
                </div>
              </div>
            </div>

            {/* Wind + advisory tile */}
            <div className={`${cardLow} rounded-lg p-3 border flex items-center gap-3`}>
              <Wind className="w-6 h-6 text-status-success" />
              <div className="min-w-0">
                <div className={`text-[9px] font-mono tracking-widest uppercase ${outline}`}>WIND</div>
                <div className={`font-mono font-bold text-xs ${text}`}>
                  {weather.windKmh != null ? `${weather.windKmh.toFixed(0)} KM/H` : '—'}
                </div>
              </div>
              {(() => {
                const meta = WARNING_META[weather.warningLevel || 'none'] || WARNING_META.none;
                return (
                  <span className={`ml-auto shrink-0 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border leading-tight text-center ${meta.cls}`}>
                    {meta.label}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${cardLow} rounded-xl p-3 border flex items-center justify-between`}>
          <span className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 ${outline}`}>
            <Satellite className="w-3.5 h-3.5" /> // LIVE WEATHER FEED
          </span>
          <span className={`text-[10px] font-mono ${muted}`}>
            {isOffline ? 'UNAVAILABLE — BACKEND OFFLINE' : 'AWAITING TELEMETRY…'}
          </span>
        </div>
      )}

      {/* ── Telemetry KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'ACTIVE HAZARDS', value: events.length, color: 'text-status-critical', icon: <ShieldAlert className="w-4 h-4" /> },
          { label: 'VERIFIED REPORTS', value: reports.filter(r => r.verificationStatus === 'VERIFIED').length, color: 'text-status-success', icon: <Activity className="w-4 h-4" /> },
          { label: 'RELIEF RESOURCES', value: resources.length, color: 'text-status-info', icon: <Users className="w-4 h-4" /> },
          { label: 'DATA SOURCES', value: 6, color: 'text-status-warning', icon: <Radio className="w-4 h-4" /> },
        ].map((kpi) => (
          <div key={kpi.label} className={`${cardLow} rounded-xl p-4 border`}>
            <div className={`flex items-center gap-1.5 text-[10px] font-mono tracking-widest ${outline} mb-2`}>
              {kpi.icon}{kpi.label}
            </div>
            <div className={`text-3xl font-mono font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ── Active Hazard Hero Card ── */}
      {activeHazard ? (
        <div className={`${card} rounded-xl border overflow-hidden ${getSeverityAccent(activeHazard.severity)}`}>
          {/* Header bar */}
          <div className={`px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b ${divider} ${isDark ? 'bg-ops-high' : 'bg-day-container'}`}>
            <div className="flex items-center gap-3">
              <RiskBadge severity={activeHazard.severity} size="default" />
              <span className={`font-mono text-[10px] tracking-widest ${outline}`}>ID: {activeHazard.id}</span>
            </div>
            <FreshnessIndicator timestamp={activeHazard.updatedAt.split('T')[1].slice(0, 5) + ' IST'} />
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className={`text-xl font-bold font-mono tracking-tight leading-tight ${text}`}>
                  {activeHazard.title.toUpperCase()}
                </h2>
                <div className={`text-[11px] font-mono ${muted} flex items-center gap-3`}>
                  <span>ZONE: <strong className={text}>{activeHazard.locationName.toUpperCase()}</strong></span>
                  <span>·</span>
                  <span>RADIUS: <strong className={text}>{activeHazard.affectedRadiusKm} KM</strong></span>
                </div>
              </div>
              <VerificationBadge status={activeHazard.verificationStatus} />
            </div>

            <p className={`text-sm leading-relaxed p-3.5 rounded-lg border ${isDark ? 'bg-ops-low border-ops-divider text-ops-muted' : 'bg-day-low border-day-divider text-day-muted'}`}>
              {activeHazard.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button onClick={() => onSelectEvent(activeHazard)} className={btnPrimary}>
                <Eye className="w-4 h-4" /> VIEW INTEL DOSSIER
              </button>
              <button onClick={onFindHelp} className={btnSecondary}>
                <Users className="w-4 h-4" /> FIND RELIEF RESOURCES
              </button>
              <button onClick={onReportIncident} className={btnSecondary}>
                <PlusCircle className="w-4 h-4" /> REPORT INCIDENT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${card} rounded-xl p-8 border text-center space-y-4`}>
          <div className="w-12 h-12 rounded-full bg-status-success-bg/20 border border-status-success/40 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-status-success" />
          </div>
          <div>
            <h3 className={`text-base font-bold font-mono tracking-wider ${text}`}>
              // NO ACTIVE HAZARDS DETECTED
            </h3>
            <p className={`text-xs font-mono ${muted} max-w-sm mx-auto mt-1`}>
              Meteorological sensors and verified sources indicate nominal conditions in {currentLocation.name.toUpperCase()}.
            </p>
          </div>
          <button onClick={onOpenSearch} className={`inline-flex ${btnPrimary}`}>
            <MapPin className="w-4 h-4" /> MONITOR OTHER SECTORS
          </button>
        </div>
      )}

      {/* ── GIS Map + Hazards List ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* GIS Map (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`text-[11px] font-mono font-bold tracking-widest uppercase flex items-center gap-2 ${outline}`}>
              <Layers className="w-4 h-4 text-status-info" /> // GIS TACTICAL SURFACE
            </h3>
            <span className={`text-[10px] font-mono ${outline}`}>CLICK MARKERS FOR INTEL</span>
          </div>
          <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-ops-divider' : 'border-day-divider'}`} style={{ height: '420px' }}>
            <GISMap
              events={events}
              reports={reports}
              resources={resources}
              currentLocation={currentLocation}
              selectedEvent={selectedEvent}
              onSelectEvent={onSelectEvent}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Hazards Sidebar */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between border-b ${divider} pb-2`}>
            <h3 className={`text-[11px] font-mono font-bold tracking-widest ${outline}`}>
              // ACTIVE HAZARDS ({events.length})
            </h3>
            <button onClick={onOpenSearch} className={`text-[10px] font-mono text-status-info hover:underline`}>VIEW ALL</button>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`${card} rounded-lg p-3 border transition-all cursor-pointer space-y-2 hover:border-status-info/60 ${
                  activeHazard?.id === evt.id ? 'border-status-info/80 ring-1 ring-status-info/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <RiskBadge severity={evt.severity} size="compact" />
                    <VerificationBadge status={evt.verificationStatus} />
                    {evt.signalKind === 'FORECAST_RISK' && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-warning-bg/30 border border-status-warning/50 text-status-warning">
                        PREDICTED
                      </span>
                    )}
                  </div>
                </div>
                <h4 className={`font-mono font-bold text-xs leading-snug ${text}`}>{evt.title.toUpperCase()}</h4>
                <p className={`text-[11px] font-sans line-clamp-2 ${muted}`}>{evt.description}</p>
                <div className={`flex items-center justify-between text-[10px] font-mono ${outline} pt-1`}>
                  <span>📍 {evt.locationName.toUpperCase()}</span>
                  <span className="flex items-center gap-1 text-status-info">INSPECT <ChevronRight className="w-3 h-3" /></span>
                </div>
              </div>
            ))}
          </div>

          {/* Public Reports Snippet */}
          <div className={`pt-3 border-t ${divider} space-y-2`}>
            <div className="flex items-center justify-between">
              <h4 className={`text-[11px] font-mono font-bold tracking-widest ${outline}`}>
                // PUBLIC REPORTS ({reports.length})
              </h4>
              <button onClick={onReportIncident} className="text-[10px] font-mono text-status-info hover:underline">+ ADD</button>
            </div>
            <div className="space-y-2">
              {reports.slice(0, 3).map((rep) => {
                const verified = rep.verificationStatus === 'VERIFIED';
                const remaining = Math.max(0, REPORT_VERIFY_UPVOTES - (rep.upvotes || 0));
                return (
                  <div key={rep.id} className={`p-2.5 ${cardLow} rounded-md border text-[11px] space-y-1.5`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-mono font-bold ${text}`}>{rep.userName.toUpperCase()}</span>
                      <VerificationBadge status={rep.verificationStatus} />
                    </div>
                    <p className={`font-sans leading-snug ${muted}`}>{rep.description}</p>
                    <div className={`flex items-center justify-between border-t pt-1.5 ${divider}`}>
                      {onUpvoteReport ? (
                        <button
                          onClick={() => onUpvoteReport(rep.id)}
                          disabled={verified}
                          className={`flex items-center gap-1 font-mono font-bold transition-colors ${
                            verified
                              ? 'text-status-success cursor-default'
                              : 'text-status-info hover:underline cursor-pointer'
                          }`}
                          title={verified ? 'Community verified' : `${remaining} more upvote${remaining === 1 ? '' : 's'} needed to verify`}
                        >
                          👍 {rep.upvotes || 0}
                        </button>
                      ) : (
                        <span className={`font-mono ${muted}`}>👍 {rep.upvotes || 0}</span>
                      )}
                      <span className={`text-[9px] font-mono ${verified ? 'text-status-success' : outline}`}>
                        {verified
                          ? 'COMMUNITY VERIFIED'
                          : `${remaining} MORE TO VERIFY`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
