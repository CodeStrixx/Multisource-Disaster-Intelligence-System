import React from 'react';
import { LocationCoordinates, DisasterEvent } from '../../types/disaster';
import { RiskBadge } from '../common/TrustBadges';
import { Bookmark, MapPin, Plus, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface SavedLocationsScreenProps {
  locations: LocationCoordinates[];
  events: DisasterEvent[];
  onSelectLocation: (loc: LocationCoordinates) => void;
  onOpenSearch: () => void;
}

export const SavedLocationsScreen: React.FC<SavedLocationsScreenProps> = ({
  locations,
  events,
  onSelectLocation,
  onOpenSearch
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-brand-900 text-white rounded-xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 text-brand-100" /> Remote & Family Location Monitor (S13)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Monitored Locations</h2>
          <p className="text-xs text-brand-100/80 mt-0.5">Stay informed about active disaster risks in locations where your family, relatives, or friends reside.</p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-700 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Location to Monitor
        </button>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => {
          // Find matching event for location if any
          const matchingEvent = events.find((e) => e.district.toLowerCase() === loc.district.toLowerCase() || e.state.toLowerCase() === loc.state.toLowerCase());

          return (
            <div
              key={loc.name}
              onClick={() => onSelectLocation(loc)}
              className="bg-white rounded-xl p-5 border border-surface-border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-900 group-hover:text-brand-700 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-textMain-secondary">{loc.district}, {loc.state}</p>
                  </div>
                </div>

                {matchingEvent ? (
                  <RiskBadge severity={matchingEvent.severity} size="compact" />
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    NO HAZARD
                  </span>
                )}
              </div>

              {matchingEvent ? (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> {matchingEvent.title}
                  </div>
                  <p className="text-textMain-secondary line-clamp-2">{matchingEvent.description}</p>
                </div>
              ) : (
                <div className="bg-surface-bg p-3 rounded-lg border border-surface-border text-xs text-textMain-secondary">
                  Normal meteorological conditions. All clear signal from IMD/SDMA monitors.
                </div>
              )}

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-brand-700 font-semibold">
                <span>Switch to Location Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
