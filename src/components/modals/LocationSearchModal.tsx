import React, { useState } from 'react';
import { LocationCoordinates } from '../../types/disaster';
import { Search, MapPin, X, Bookmark, Check } from 'lucide-react';
import { INITIAL_LOCATIONS } from '../../data/mockDisasterData';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationCoordinates) => void;
  currentLocation: LocationCoordinates;
  locations?: LocationCoordinates[];
  isDark?: boolean;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation,
  locations,
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const sourceLocations = locations && locations.length > 0 ? locations : INITIAL_LOCATIONS;
  const filteredLocations = sourceLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`${card} rounded-xl shadow-2xl max-w-md w-full overflow-hidden border`}>
        
        {/* Modal Header */}
        <div className={`p-4 flex items-center justify-between border-b ${divider} ${isDark ? 'bg-ops-surface' : 'bg-day-container'}`}>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-status-info" />
            <h3 className={`font-mono font-bold text-sm tracking-wider ${text}`}>// SELECT MONITORING SECTOR</h3>
          </div>
          <button onClick={onClose} className={`p-1 rounded-md ${muted} hover:${text}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <div className={`p-3 border-b ${divider} ${cardLow}`}>
          <div className="relative">
            <Search className={`w-3.5 h-3.5 ${outline} absolute left-3 top-3`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sector, district, state..."
              className={`w-full pl-9 pr-4 py-2 border rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-status-info ${
                isDark ? 'bg-ops-container border-ops-divider text-ops-text placeholder:text-ops-outline' : 'bg-white border-day-divider text-day-text placeholder:text-day-outline'
              }`}
              autoFocus
            />
          </div>
        </div>

        {/* Location List */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1.5">
          <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${outline} mb-2 px-1`}>
            // AVAILABLE MONITORING SECTORS
          </div>

          {filteredLocations.map((loc) => {
            const isSelected = loc.name === currentLocation.name;

            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  isSelected
                    ? isDark ? 'bg-ops-high border-status-info text-status-info font-semibold ring-1 ring-status-info/40' : 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                    : `${cardLow} hover:border-status-info/40 ${text}`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs ${
                    isSelected ? 'bg-status-info text-white' : isDark ? 'bg-ops-high text-ops-muted' : 'bg-day-container text-day-muted'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold">{loc.name.toUpperCase()}</div>
                    <div className={`text-[10px] font-mono ${muted}`}>{loc.district.toUpperCase()}, {loc.state.toUpperCase()}</div>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-status-success bg-status-success-bg/20 px-2 py-0.5 rounded border border-status-success/30">
                    <Check className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <Bookmark className={`w-3.5 h-3.5 ${outline}`} />
                )}
              </button>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className={`text-center py-6 text-xs font-mono ${muted}`}>
              No sectors matching "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-2.5 border-t ${divider} text-center text-[10px] font-mono ${outline} ${isDark ? 'bg-ops-surface' : 'bg-day-low'}`}>
          Selecting a sector updates risk scores, telemetry feeds, and emergency contacts.
        </div>
      </div>
    </div>
  );
};
