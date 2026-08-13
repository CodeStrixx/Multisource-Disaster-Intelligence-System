import React, { useState } from 'react';
import { ReliefResource, ResourceType, LocationCoordinates } from '../../types/disaster';
import { LifeBuoy, MapPin, Phone, Filter, Search, Map, List, Building, ShieldCheck, ExternalLink } from 'lucide-react';

interface NearbyResourcesScreenProps {
  resources: ReliefResource[];
  currentLocation: LocationCoordinates;
  onSelectResource: (resource: ReliefResource) => void;
  onSwitchToMap: () => void;
}

export const NearbyResourcesScreen: React.FC<NearbyResourcesScreenProps> = ({
  resources,
  currentLocation,
  onSelectResource,
  onSwitchToMap
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
    { id: 'all', label: 'All Resources', icon: '📍' },
    { id: 'shelter', label: 'Shelters', icon: '⛺' },
    { id: 'hospital', label: 'Hospitals & Medical', icon: '🏥' },
    { id: 'relief_centre', label: 'Relief Outposts', icon: '📦' },
    { id: 'police', label: 'Police Help', icon: '👮' },
    { id: 'fire_station', label: 'Fire & Rescue', icon: '🚒' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-brand-900 text-white rounded-xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4 text-brand-100" /> Emergency Services Directory (S09)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Relief & Assistance Near {currentLocation.name}</h2>
          <p className="text-xs text-brand-100/80 mt-0.5">Verified shelters, trauma centers, and disaster relief posts in {currentLocation.state}.</p>
        </div>

        <div className="flex items-center gap-2 bg-brand-700/80 p-1 rounded-lg border border-brand-500/40">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-100 hover:text-white'}`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
          <button
            onClick={onSwitchToMap}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${viewMode === 'map' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-100 hover:text-white'}`}
          >
            <Map className="w-3.5 h-3.5" /> Map View
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
              className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                  : 'bg-white text-textMain-primary border-surface-border hover:bg-brand-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-textMain-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by facility name, landmark, or street..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-border rounded-lg text-sm text-textMain-primary focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            onClick={() => onSelectResource(res)}
            className="bg-white rounded-xl p-5 border border-surface-border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  {res.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {res.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-base text-brand-900 group-hover:text-brand-700 transition-colors leading-snug">
                {res.name}
              </h3>

              <div className="flex items-start gap-1.5 text-xs text-textMain-secondary mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
                <span>{res.address}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border space-y-2">
              {res.capacity && (
                <div className="text-xs text-brand-900 font-medium bg-surface-bg p-2 rounded">
                  Capacity: <strong>{res.capacity}</strong>
                  {res.availableBedsOrKits && <span className="text-emerald-700 font-bold ml-2">({res.availableBedsOrKits} Available)</span>}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <a
                  href={`tel:${res.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-brand-700 hover:bg-brand-900 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {res.phone}
                </a>

                <span className="text-brand-700 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Details <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl p-8 border border-surface-border text-center space-y-3">
          <LifeBuoy className="w-12 h-12 text-textMain-muted mx-auto" />
          <h4 className="font-bold text-base text-brand-900">No resources found matching filter criteria</h4>
          <p className="text-xs text-textMain-secondary max-w-sm mx-auto">
            Try resetting search filters or expanding your search radius to adjacent districts.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-brand-100 text-brand-900 font-semibold text-xs rounded-md hover:bg-brand-500 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
