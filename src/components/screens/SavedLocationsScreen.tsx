import React from 'react';
import { LocationCoordinates, DisasterEvent } from '../../types/disaster';
import { RiskBadge } from '../common/TrustBadges';
import { Bookmark, MapPin, Plus, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SavedLocationsScreenProps {
  locations: LocationCoordinates[];
  events: DisasterEvent[];
  onSelectLocation: (loc: LocationCoordinates) => void;
  onOpenSearch: () => void;
  isDark?: boolean;
}

export const SavedLocationsScreen: React.FC<SavedLocationsScreenProps> = ({
  locations,
  events,
  onSelectLocation,
  onOpenSearch,
  isDark = true,
}) => {
  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      
      {/* Tactical Header */}
      <div className={`${card} rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase ${outline} mb-1`}>
            <Bookmark className="w-3.5 h-3.5 text-status-info" /> // REMOTE &amp; FAMILY LOCATION MONITOR (S13)
          </div>
          <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>MONITORED SECTORS</h2>
          <p className={`text-[11px] font-mono ${muted} mt-0.5`}>
            Stay informed about active hazard telemetry where your family, relatives, or facilities are located.
          </p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-4 py-2 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-[10px] tracking-widest rounded-md shadow transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> ADD SECTOR
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => {
          const matchingEvent = events.find(
            (e) =>
              e.district.toLowerCase() === loc.district.toLowerCase() ||
              e.state.toLowerCase() === loc.state.toLowerCase()
          );

          return (
            <div
              key={loc.name}
              onClick={() => onSelectLocation(loc)}
              className={`${card} rounded-xl p-5 border shadow-sm hover:border-status-info/60 transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold border ${isDark ? 'bg-ops-high border-ops-divider text-status-info' : 'bg-day-container border-day-divider text-blue-700'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`font-mono font-bold text-sm group-hover:text-status-info transition-colors ${text}`}>
                      {loc.name.toUpperCase()}
                    </h3>
                    <p className={`text-[11px] font-mono ${muted}`}>{loc.district.toUpperCase()}, {loc.state.toUpperCase()}</p>
                  </div>
                </div>

                {matchingEvent ? (
                  <RiskBadge severity={matchingEvent.severity} size="compact" />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-status-success bg-status-success-bg/20 px-2 py-0.5 rounded border border-status-success/30">
                    NO HAZARD
                  </span>
                )}
              </div>

              {matchingEvent ? (
                <div className={`p-3 rounded-lg border text-xs space-y-1 ${isDark ? 'bg-status-warning-bg/20 border-status-warning/30' : 'bg-amber-50 border-amber-200'}`}>
                  <div className={`font-mono font-bold text-xs flex items-center gap-1.5 text-status-warning`}>
                    <AlertCircle className="w-3.5 h-3.5" /> {matchingEvent.title.toUpperCase()}
                  </div>
                  <p className={`font-sans text-[11px] line-clamp-2 leading-relaxed ${muted}`}>{matchingEvent.description}</p>
                </div>
              ) : (
                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 font-sans ${cardLow} ${muted}`}>
                  <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                  <span>Normal conditions. All clear telemetry from IMD &amp; SDMA sensors.</span>
                </div>
              )}

              <div className={`pt-2 border-t ${divider} flex items-center justify-between text-[11px] font-mono font-bold text-status-info`}>
                <span>SWITCH TO SECTOR</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
