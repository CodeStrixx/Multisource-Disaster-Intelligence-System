import React, { useState } from 'react';
import { EmergencyContact, ReliefResource, ResourceType, LocationCoordinates } from '../../types/disaster';
import { EmergencyContactsCard } from '../common/EmergencyContactsCard';
import { LifeBuoy, MapPin, Phone, Search, Map, List, ExternalLink, ShieldCheck } from 'lucide-react';

interface NearbyResourcesScreenProps {
  resources: ReliefResource[];
  currentLocation: LocationCoordinates;
  emergencyContacts?: EmergencyContact[];
  onSelectResource: (resource: ReliefResource) => void;
  onSwitchToMap: () => void;
  isDark?: boolean;
}

export const NearbyResourcesScreen: React.FC<NearbyResourcesScreenProps> = ({
  resources,
  currentLocation,
  emergencyContacts,
  onSelectResource,
  onSwitchToMap,
  isDark = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'all' || res.type === selectedCategory;
    const matchesQuery =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories: { id: ResourceType | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'ALL RESOURCES', icon: '📍' },
    { id: 'shelter', label: 'SHELTERS', icon: '⛺' },
    { id: 'hospital', label: 'HOSPITALS & MEDICAL', icon: '🏥' },
    { id: 'relief_centre', label: 'RELIEF OUTPOSTS', icon: '📦' },
    { id: 'police', label: 'POLICE', icon: '👮' },
    { id: 'fire_station', label: 'FIRE & RESCUE', icon: '🚒' }
  ];

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">

      {/* Emergency Contacts */}
      {emergencyContacts && emergencyContacts.length > 0 && (
        <EmergencyContactsCard contacts={emergencyContacts} isDark={isDark} />
      )}

      {/* Header Banner */}
      <div className={`${card} rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase ${outline} mb-1`}>
            <LifeBuoy className="w-3.5 h-3.5 text-status-info" /> // EMERGENCY LOGISTICS &amp; RELIEF DIRECTORY (S09)
          </div>
          <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>
            RELIEF &amp; ASSISTANCE NEAR {currentLocation.name.toUpperCase()}
          </h2>
          <p className={`text-[11px] font-mono ${muted} mt-0.5`}>
            Verified emergency shelters, trauma centers, and supply depots in {currentLocation.state.toUpperCase()}.
          </p>
        </div>

        <div className={`flex items-center gap-1.5 p-1 rounded-lg border ${divider} ${isDark ? 'bg-ops-high' : 'bg-day-low'}`}>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider transition-colors flex items-center gap-1.5 ${
              viewMode === 'list'
                ? isDark ? 'bg-ops-container text-ops-text border border-ops-divider shadow-sm' : 'bg-white text-day-text border border-day-divider shadow-sm'
                : `${muted} hover:${text}`
            }`}
          >
            <List className="w-3 h-3" /> LIST VIEW
          </button>
          <button
            onClick={onSwitchToMap}
            className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider transition-colors flex items-center gap-1.5 ${
              viewMode === 'map'
                ? isDark ? 'bg-ops-container text-ops-text border border-ops-divider shadow-sm' : 'bg-white text-day-text border border-day-divider shadow-sm'
                : `${muted} hover:${text}`
            }`}
          >
            <Map className="w-3 h-3" /> GIS MAP VIEW
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="space-y-3">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-status-info text-white border-status-info shadow-sm'
                  : `${cardLow} ${muted} hover:${text} hover:border-status-info/40`
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className={`w-3.5 h-3.5 ${outline} absolute left-3.5 top-3`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facility name, address, landmark..."
            className={`w-full pl-9 pr-4 py-2 rounded-lg font-mono text-xs border focus:outline-none focus:ring-1 focus:ring-status-info shadow-sm ${
              isDark ? 'bg-ops-container border-ops-divider text-ops-text placeholder:text-ops-outline' : 'bg-white border-day-divider text-day-text placeholder:text-day-outline'
            }`}
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            onClick={() => onSelectResource(res)}
            className={`${card} rounded-xl p-4 border shadow-sm hover:border-status-info/60 transition-all cursor-pointer flex flex-col justify-between space-y-3 group`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                  isDark ? 'bg-ops-high text-status-info border-status-info/30' : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {res.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono font-bold text-status-success bg-status-success-bg/20 px-2 py-0.5 rounded border border-status-success/30">
                  {res.status.toUpperCase()}
                </span>
              </div>

              <h3 className={`font-mono font-bold text-sm group-hover:text-status-info transition-colors leading-snug ${text}`}>
                {res.name.toUpperCase()}
              </h3>

              {/* Address with high contrast */}
              <div className={`flex items-start gap-1.5 text-xs font-sans mt-2 ${muted}`}>
                <MapPin className="w-3.5 h-3.5 text-status-info shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{res.address}</span>
              </div>
            </div>

            <div className={`pt-3 border-t ${divider} space-y-2.5`}>
              {res.capacity && (
                <div className={`text-xs font-mono p-2 rounded border ${cardLow}`}>
                  <span className={muted}>CAPACITY: </span>
                  <strong className={text}>{res.capacity}</strong>
                  {res.availableBedsOrKits && (
                    <span className="text-status-success font-bold ml-2 font-mono">({res.availableBedsOrKits} AVAIL)</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href={`tel:${res.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-status-success hover:bg-emerald-600 text-white font-mono font-bold px-3 py-1.5 rounded text-[11px] tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Phone className="w-3 h-3" /> CALL {res.phone}
                </a>

                <span className="text-status-info font-mono font-bold text-[10px] tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  INTEL DOSSIER <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className={`${card} rounded-xl p-8 border text-center space-y-3`}>
          <LifeBuoy className={`w-10 h-10 ${outline} mx-auto`} />
          <h4 className={`font-mono font-bold text-sm ${text}`}>// NO MATCHING RELIEF RESOURCES FOUND</h4>
          <p className={`text-xs font-mono ${muted} max-w-sm mx-auto`}>
            Try clearing filters or expanding search terms to adjacent district hubs.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-status-info text-white font-mono font-bold text-xs tracking-wider rounded-md hover:bg-blue-500 transition-colors"
          >
            RESET FILTERS
          </button>
        </div>
      )}

    </div>
  );
};
