import React, { useState } from 'react';
import {
  INITIAL_LOCATIONS,
  MOCK_DISASTER_EVENTS,
  MOCK_INCIDENT_REPORTS,
  MOCK_RELIEF_RESOURCES,
  MOCK_ALERTS
} from './data/mockDisasterData';

import { DisasterEvent, IncidentReport, ReliefResource, Alert, LocationCoordinates } from './types/disaster';

import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

import { DashboardScreen } from './components/screens/DashboardScreen';
import { DisasterMapScreen } from './components/screens/DisasterMapScreen';
import { EventDetailsScreen } from './components/screens/EventDetailsScreen';
import { ReportIncidentScreen } from './components/screens/ReportIncidentScreen';
import { NearbyResourcesScreen } from './components/screens/NearbyResourcesScreen';
import { AlertsScreen } from './components/screens/AlertsScreen';
import { SavedLocationsScreen } from './components/screens/SavedLocationsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AboutSourcesScreen } from './components/screens/AboutSourcesScreen';

import { OnboardingModal } from './components/modals/OnboardingModal';
import { LocationSearchModal } from './components/modals/LocationSearchModal';
import { ReportSubmittedModal } from './components/modals/ReportSubmittedModal';
import { ResourceDetailModal } from './components/modals/ResourceDetailModal';
import { AlertDetailModal } from './components/modals/AlertDetailModal';

export function App() {
  // Navigation & Screen View State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Location State
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates>(INITIAL_LOCATIONS[0]); // Ahmedabad default
  const [savedLocations, setSavedLocations] = useState<LocationCoordinates[]>(INITIAL_LOCATIONS);

  // Core Data State
  const [events, setEvents] = useState<DisasterEvent[]>(MOCK_DISASTER_EVENTS);
  const [reports, setReports] = useState<IncidentReport[]>(MOCK_INCIDENT_REPORTS);
  const [resources] = useState<ReliefResource[]>(MOCK_RELIEF_RESOURCES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  // Selected Item Overlays & Drawers
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [selectedResource, setSelectedResource] = useState<ReliefResource | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  // Modal Open Visibility Controls
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [showLocationSearch, setShowLocationSearch] = useState<boolean>(false);
  const [showReportSubmitted, setShowReportSubmitted] = useState<boolean>(false);

  // Unread Alert Count
  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  // Handlers for User Flow A - F
  const handleSelectLocation = (loc: LocationCoordinates) => {
    setCurrentLocation(loc);
    setSelectedEvent(null);
    setActiveTab('dashboard');
  };

  const handleSelectEvent = (evt: DisasterEvent) => {
    setSelectedEvent(evt);
    setActiveTab('event_details');
  };

  const handleSelectAlert = (alertItem: Alert) => {
    // Mark as read
    setAlerts((prev) => prev.map((a) => (a.id === alertItem.id ? { ...a, read: true } : a)));
    setSelectedAlert(alertItem);
  };

  const handleSubmitNewReport = (newReportData: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>) => {
    const createdReport: IncidentReport = {
      ...newReportData,
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1
    };

    setReports((prev) => [createdReport, ...prev]);
    setSubmittedReport(createdReport);
    setShowReportSubmitted(true);
    setActiveTab('dashboard');
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans pb-16 lg:pb-0">
      
      {/* Global Header Bar */}
      <Header
        currentLocation={currentLocation}
        onOpenSearch={() => setShowLocationSearch(true)}
        onOpenAlerts={() => setActiveTab('alerts')}
        onOpenSettings={() => setActiveTab('settings')}
        unreadAlertCount={unreadAlertCount}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'event_details') setSelectedEvent(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        
        {/* S02 MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardScreen
            currentLocation={currentLocation}
            events={events}
            reports={reports}
            resources={resources}
            selectedEvent={selectedEvent}
            onSelectEvent={handleSelectEvent}
            onOpenSearch={() => setShowLocationSearch(true)}
            onFindHelp={() => setActiveTab('resources')}
            onReportIncident={() => setActiveTab('report')}
            onOpenSavedLocations={() => setActiveTab('saved_locations')}
          />
        )}

        {/* S04 DISASTER GIS MAP */}
        {activeTab === 'map' && (
          <DisasterMapScreen
            events={events}
            reports={reports}
            resources={resources}
            currentLocation={currentLocation}
            selectedEvent={selectedEvent}
            onSelectEvent={handleSelectEvent}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenSearch={() => setShowLocationSearch(true)}
          />
        )}

        {/* S05 EVENT DETAILS & S06 TIMELINE */}
        {activeTab === 'event_details' && selectedEvent && (
          <EventDetailsScreen
            event={selectedEvent}
            onBack={() => setActiveTab('dashboard')}
            onFindHelp={() => setActiveTab('resources')}
            onReportRelated={() => setActiveTab('report')}
            nearbyResources={resources.filter(
              (r) => r.district.toLowerCase() === selectedEvent.district.toLowerCase() || r.state.toLowerCase() === selectedEvent.state.toLowerCase()
            )}
          />
        )}

        {/* S07 REPORT INCIDENT FORM */}
        {activeTab === 'report' && (
          <ReportIncidentScreen
            currentLocation={currentLocation}
            onSubmitReport={handleSubmitNewReport}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}

        {/* S09 NEARBY RESOURCES DIRECTORY */}
        {activeTab === 'resources' && (
          <NearbyResourcesScreen
            resources={resources}
            currentLocation={currentLocation}
            onSelectResource={(res) => setSelectedResource(res)}
            onSwitchToMap={() => setActiveTab('map')}
          />
        )}

        {/* S11 ALERTS FEED */}
        {activeTab === 'alerts' && (
          <AlertsScreen
            alerts={alerts}
            onSelectAlert={handleSelectAlert}
            onMarkAllAsRead={handleMarkAllAlertsRead}
          />
        )}

        {/* S13 SAVED LOCATIONS */}
        {activeTab === 'saved_locations' && (
          <SavedLocationsScreen
            locations={savedLocations}
            events={events}
            onSelectLocation={handleSelectLocation}
            onOpenSearch={() => setShowLocationSearch(true)}
          />
        )}

        {/* S14 SETTINGS */}
        {activeTab === 'settings' && <SettingsScreen />}

        {/* S15 ABOUT / DATA SOURCES */}
        {activeTab === 'about' && <AboutSourcesScreen />}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'event_details') setSelectedEvent(null);
          setActiveTab(tab);
        }}
        unreadAlertCount={unreadAlertCount}
        onOpenMore={() => setActiveTab('about')}
      />

      {/* S01 ONBOARDING MODAL */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onAllowLocation={() => {
          handleSelectLocation(INITIAL_LOCATIONS[0]);
          setShowOnboarding(false);
        }}
      />

      {/* S03 LOCATION SEARCH MODAL */}
      <LocationSearchModal
        isOpen={showLocationSearch}
        onClose={() => setShowLocationSearch(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={currentLocation}
      />

      {/* S08 REPORT SUBMITTED MODAL */}
      <ReportSubmittedModal
        report={submittedReport}
        isOpen={showReportSubmitted}
        onClose={() => setShowReportSubmitted(false)}
      />

      {/* S10 RESOURCE DETAIL MODAL */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />

      {/* S12 ALERT DETAIL MODAL */}
      <AlertDetailModal
        alertItem={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onGoToEventDetails={(evtId) => {
          const evt = events.find((e) => e.id === evtId);
          if (evt) handleSelectEvent(evt);
        }}
        onFindHelp={() => setActiveTab('resources')}
      />

    </div>
  );
}

export default App;
