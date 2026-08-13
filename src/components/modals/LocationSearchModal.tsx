import React, { useState } from 'react';
import { LocationCoordinates } from '../../types/disaster';
import { Search, MapPin, X, Bookmark, Check } from 'lucide-react';
import { INITIAL_LOCATIONS } from '../../data/mockDisasterData';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationCoordinates) => void;
  currentLocation: LocationCoordinates;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLocations = INITIAL_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-surface-border">
        {/* Modal Header */}
        <div className="bg-brand-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-100" />
            <h3 className="font-bold text-base">Select or Search Location</h3>
          </div>
          <button onClick={onClose} className="text-brand-100 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-surface-border bg-surface-bg">
          <div className="relative">
            <Search className="w-4 h-4 text-textMain-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, district, state (e.g., Ahmedabad, Wayanad, Mumbai)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-surface-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-textMain-primary placeholder:text-textMain-muted"
              autoFocus
            />
          </div>
        </div>

        {/* Location List */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          <div className="text-xs font-bold text-textMain-muted uppercase tracking-wider mb-2">
            Disaster Monitoring Regions
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
                    ? 'bg-brand-50 border-brand-500 text-brand-900 font-semibold'
                    : 'bg-white border-surface-border hover:bg-brand-50/50 text-textMain-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-brand-700 text-white' : 'bg-brand-100 text-brand-900'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{loc.name}</div>
                    <div className="text-xs text-textMain-secondary">{loc.district}, {loc.state}</div>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-100 px-2 py-1 rounded-pill">
                    <Check className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <Bookmark className="w-4 h-4 text-textMain-muted hover:text-brand-500" />
                )}
              </button>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="text-center py-6 text-textMain-muted text-sm">
              No matching locations found for "{searchQuery}". Try searching major Indian district hubs.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-bg border-t border-surface-border text-center text-xs text-textMain-secondary">
          Selecting a location updates risk scores, active hazards, and nearby emergency contacts instantly.
        </div>
      </div>
    </div>
  );
};
