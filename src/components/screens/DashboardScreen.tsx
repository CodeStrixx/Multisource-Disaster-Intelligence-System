import React, { useState } from 'react';
import { DisasterEvent, IncidentReport, ReliefResource, LocationCoordinates } from '../../types/disaster';
import { RiskBadge, SourceBadge, VerificationBadge, FreshnessIndicator, SeverityIndicator } from '../common/TrustBadges';
import { GISMap } from '../map/GISMap';
import { MapPin, ShieldAlert, LifeBuoy, Eye, AlertTriangle, CloudRain, CheckCircle2, ArrowRight, RefreshCw, Layers, PlusCircle, Bookmark } from 'lucide-react';

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
  isLoading?: boolean;
  isOffline?: boolean;
}

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
  isLoading = false,
  isOffline = false
}) => {
  // Find highest severity hazard matching active location
  const locationEvents = events.filter(
    (e) => e.district.toLowerCase() === currentLocation.district.toLowerCase() || e.state.toLowerCase() === currentLocation.state.toLowerCase()
  );

  const activeHazard = selectedEvent || (locationEvents.length > 0 ? locationEvents[0] : events[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      
      {/* Offline / Cached Warning Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> System operating in Offline Cache Mode. Displaying last-known update from 15 mins ago.
          </span>
          <button onClick={() => window.location.reload()} className="underline hover:text-amber-100 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* 1. LOCATION HEADER & SEARCH QUICK BAR */}
      <div className="bg-white rounded-xl p-5 border border-surface-border shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-100 border border-brand-500/20 flex items-center justify-center text-brand-700 shadow-inner">
            <MapPin className="w-6 h-6 text-brand-700" />
          </div>
          <div>
            <div className="text-xs text-textMain-secondary font-medium">Currently Monitoring Region</div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900 leading-tight">
              {currentLocation.name}, {currentLocation.state}
            </h2>
            <div className="text-xs text-textMain-muted">{currentLocation.district} District • Coordinates: {currentLocation.lat.toFixed(3)}°N, {currentLocation.lng.toFixed(3)}°E</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-900 font-semibold text-xs rounded-md border border-brand-500/30 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-700" /> Change Location
          </button>
          <button
            onClick={onOpenSavedLocations}
            className="px-3.5 py-2 bg-white hover:bg-surface-bg text-textMain-secondary font-semibold text-xs rounded-md border border-surface-border transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-brand-700" /> Saved Locations
          </button>
        </div>
      </div>

      {/* 2. CURRENT RISK & IMMEDIATE ACTION HERO CARD */}
      {activeHazard ? (
        <div className="bg-white rounded-xl border border-surface-border shadow-md overflow-hidden">
          {/* Severity Accent Header */}
          <div className={`p-4 text-white flex flex-wrap items-center justify-between gap-3 ${
            activeHazard.severity === 'critical' ? 'bg-[#C62828]' : activeHazard.severity === 'high' ? 'bg-[#D65A1F]' : activeHazard.severity === 'moderate' ? 'bg-[#C88719]' : 'bg-[#18864B]'
          }`}>
            <div className="flex items-center gap-2">
              <RiskBadge severity={activeHazard.severity} size="default" />
              <span className="font-mono text-xs opacity-90">| ID: {activeHazard.id}</span>
            </div>
            <FreshnessIndicator timestamp={activeHazard.updatedAt.split('T')[1].slice(0, 5) + ' IST'} />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900 leading-tight">
                  {activeHazard.title}
                </h2>
                <div className="text-xs text-textMain-secondary flex items-center gap-2">
                  <span>Affected Zone: <strong>{activeHazard.locationName}</strong></span>
                  <span>•</span>
                  <span>Affected Radius: <strong>{activeHazard.affectedRadiusKm} km</strong></span>
                </div>
              </div>

              <VerificationBadge status={activeHazard.verificationStatus} />
            </div>

            <p className="text-sm text-textMain-primary leading-relaxed bg-surface-bg p-3.5 rounded-lg border border-surface-border">
              {activeHazard.description}
            </p>

            {/* Core Action CTAs: View Risk Details (Primary) & Find Help (Secondary) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onSelectEvent(activeHazard)}
                className="flex-1 px-6 py-3 bg-brand-700 hover:bg-brand-900 text-white font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> View Risk Details & Evidence
              </button>

              <button
                onClick={onFindHelp}
                className="flex-1 px-6 py-3 bg-white hover:bg-brand-50 text-brand-900 border border-brand-500/40 font-bold text-sm rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <LifeBuoy className="w-4 h-4 text-brand-700" /> Find Help & Nearby Relief
              </button>

              <button
                onClick={onReportIncident}
                className="px-4 py-3 bg-surface-bg hover:bg-surface-border text-textMain-primary font-semibold text-xs rounded-md border border-surface-border transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-brand-500" /> Report Incident
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: No Active Hazards near location */
        <div className="bg-white rounded-xl p-8 border border-surface-border text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-brand-900">No active hazards detected near this location</h3>
            <p className="text-xs text-textMain-secondary max-w-md mx-auto mt-1">
              Meteorological sensors and verified reports indicate normal conditions in {currentLocation.name}.
            </p>
          </div>
          <button
            onClick={onOpenSearch}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow transition-colors inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" /> Monitor Wider Area / Other Cities
          </button>
        </div>
      )}

      {/* 3. GIS MAP & INCIDENTS SIDEBAR (Desktop 2-column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GIS Interactive Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-700" /> Interactive Disaster GIS Surface (S04)
            </h3>
            <span className="text-xs text-textMain-muted">Click markers for details</span>
          </div>

          <GISMap
            events={events}
            reports={reports}
            resources={resources}
            currentLocation={currentLocation}
            selectedEvent={selectedEvent}
            onSelectEvent={onSelectEvent}
          />
        </div>

        {/* Active Hazards & Public Reports List Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <h3 className="text-base font-bold text-brand-900">Active Hazards ({events.length})</h3>
            <span className="text-xs text-brand-700 font-semibold cursor-pointer hover:underline" onClick={onOpenSearch}>
              View All
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`bg-white rounded-xl p-4 border transition-all cursor-pointer space-y-2 hover:shadow-md ${
                  activeHazard?.id === evt.id ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/30' : 'border-surface-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <RiskBadge severity={evt.severity} size="compact" />
                  <VerificationBadge status={evt.verificationStatus} />
                </div>

                <h4 className="font-bold text-sm text-brand-900 leading-snug">{evt.title}</h4>
                <p className="text-xs text-textMain-secondary line-clamp-2">{evt.description}</p>

                <div className="flex items-center justify-between text-[11px] text-brand-700 font-semibold pt-1">
                  <span>📍 {evt.locationName}</span>
                  <span className="flex items-center gap-1 text-brand-900">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Citizen Public Reports Snippet */}
          <div className="pt-4 border-t border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-brand-900">Recent Public Reports ({reports.length})</h4>
              <button onClick={onReportIncident} className="text-xs text-brand-700 font-bold hover:underline">
                + Add Report
              </button>
            </div>

            <div className="space-y-2">
              {reports.slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-3 bg-white rounded-lg border border-surface-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-900">{rep.userName}</span>
                    <VerificationBadge status={rep.verificationStatus} />
                  </div>
                  <p className="text-textMain-primary">{rep.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
