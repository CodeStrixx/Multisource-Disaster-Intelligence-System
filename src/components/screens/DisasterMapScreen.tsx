import React from 'react';
import { DisasterEvent, IncidentReport, ReliefResource, LocationCoordinates } from '../../types/disaster';
import { GISMap } from '../map/GISMap';
import { ArrowLeft, Search, Layers, ShieldAlert, LifeBuoy } from 'lucide-react';

interface DisasterMapScreenProps {
  events: DisasterEvent[];
  reports: IncidentReport[];
  resources: ReliefResource[];
  currentLocation: LocationCoordinates;
  selectedEvent: DisasterEvent | null;
  onSelectEvent: (event: DisasterEvent) => void;
  onBackToDashboard: () => void;
  onOpenSearch: () => void;
}

export const DisasterMapScreen: React.FC<DisasterMapScreenProps> = ({
  events,
  reports,
  resources,
  currentLocation,
  selectedEvent,
  onSelectEvent,
  onBackToDashboard,
  onOpenSearch
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Top Floating Action Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
        <button
          onClick={onBackToDashboard}
          className="bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-lg shadow-md border border-surface-border text-brand-900 font-bold text-xs hover:bg-brand-50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard View
        </button>

        <button
          onClick={onOpenSearch}
          className="bg-brand-900 text-white px-3.5 py-2 rounded-lg shadow-md font-bold text-xs hover:bg-brand-700 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-4 h-4 text-brand-100" /> Search Region
        </button>
      </div>

      {/* Fullscreen Map Canvas */}
      <GISMap
        events={events}
        reports={reports}
        resources={resources}
        currentLocation={currentLocation}
        selectedEvent={selectedEvent}
        onSelectEvent={onSelectEvent}
        isFullScreen={true}
      />
    </div>
  );
};
