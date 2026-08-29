import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  INITIAL_LOCATIONS,
  MOCK_ALERTS,
  MOCK_DISASTER_EVENTS,
  MOCK_INCIDENT_REPORTS,
  MOCK_RELIEF_RESOURCES,
} from './data/mockDisasterData';
import {
  checkHealth,
  fetchDashboardLive,
  fetchEmergencyContacts,
  fetchReportsLive,
  fetchSchemes,
  fetchSourcesLive,
  fetchWeather,
  submitReport,
  upvoteReport,
  WeatherSnapshot,
} from './services/api';

import { DisasterEvent, EmergencyContact, GovernmentScheme, IncidentReport, ReliefResource, Alert, LocationCoordinates, DataSource } from './types/disaster';

import { ThemeProvider, useTheme } from './context/ThemeContext';

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
import { SchemesScreen } from './components/screens/SchemesScreen';

import { OnboardingModal } from './components/modals/OnboardingModal';
import { LocationSearchModal } from './components/modals/LocationSearchModal';
import { ReportSubmittedModal } from './components/modals/ReportSubmittedModal';
import { ResourceDetailModal } from './components/modals/ResourceDetailModal';
import { AlertDetailModal } from './components/modals/AlertDetailModal';

// Inner app uses the theme context
function AppInner() {
  const { isDark, toggleTheme } = useTheme();

  // Navigation & Screen View State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Location State
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates>(INITIAL_LOCATIONS[0]);
  const [savedLocations, setSavedLocations] = useState<LocationCoordinates[]>(INITIAL_LOCATIONS);

  // Core Data State (backend-backed; mocks fill ONLY when the backend is unreachable)
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [resources, setResources] = useState<ReliefResource[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Backend connectivity state
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const pollTimerRef = useRef<number | null>(null);

  // ---- Backend sync: initial load + 45s polling cycle (PRD G3 / M1) ----
  // LIVE MODE (backend healthy): serve ONLY backend data — real empty lists stay
  // empty instead of being masked by mock content.
  // OFFLINE MODE (backend unreachable): fall back to the bundled mock dataset
  // so the demo keeps working (PRD M8).
  const refreshFromBackend = useCallback(async (lat?: number, lng?: number): Promise<boolean> => {
    const health = await checkHealth();
    setIsBackendLive(health !== null);

    if (health === null) {
      // Offline resilience: only fill gaps, never clobber locally-created data
      setEvents((prev) => (prev.length > 0 ? prev : MOCK_DISASTER_EVENTS));
      setResources((prev) => (prev.length > 0 ? prev : MOCK_RELIEF_RESOURCES));
      setAlerts((prev) => (prev.length > 0 ? prev : MOCK_ALERTS));
      setReports((prev) => (prev.length > 0 ? prev : MOCK_INCIDENT_REPORTS));
      setWeather(null);
      return false;
    }

    const [bundle, reportList, sourceList, wx] = await Promise.all([
      fetchDashboardLive(lat ?? undefined, lng ?? undefined),
      fetchReportsLive(),
      fetchSourcesLive(),
      lat != null && lng != null
        ? fetchWeather(lat, lng)
        : Promise.resolve(null as WeatherSnapshot | null),
    ]);

    if (bundle) {
      setEvents(bundle.events);
      setResources(bundle.resources);
      // Preserve client-side "read" flags across polls
      setAlerts((prev) => {
        const readIds = new Set(prev.filter((a) => a.read).map((a) => a.id));
        return bundle.alerts.map((a) => ({ ...a, read: readIds.has(a.id) }));
      });
    }
    if (reportList) setReports(reportList);
    if (sourceList) setDataSources(sourceList);
    setWeather(wx && wx.observedAt ? wx : null);
    return true;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const live = await refreshFromBackend(currentLocation.lat, currentLocation.lng);
      if (cancelled) return;
      // Scheme catalog is static-ish: fetch once, not on every poll.
      // Live mode uses strict fetching so mock schemes never mask the backend's.
      const schemeData = await fetchSchemes(undefined, live);
      if (!cancelled && schemeData) setSchemes(schemeData);
      const contacts = await fetchEmergencyContacts(live);
      if (!cancelled && contacts) setEmergencyContacts(contacts);
    })();
    pollTimerRef.current = window.setInterval(() => {
      refreshFromBackend(currentLocation.lat, currentLocation.lng);
    }, 45000); // PRD: 30-60s polling cycle
    return () => {
      cancelled = true;
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setAlerts((prev) => prev.map((a) => (a.id === alertItem.id ? { ...a, read: true } : a)));
    setSelectedAlert(alertItem);
  };

  const handleSubmitNewReport = async (newReportData: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>) => {
    // Try the backend first (F12 citizen reports); fall back to local-only creation.
    const created = await submitReport(newReportData);

    if (created) {
      setReports((prev) => [created, ...prev]);
      setSubmittedReport(created);
    } else {
      const localReport: IncidentReport = {
        ...newReportData,
        id: `REP-LOCAL-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvotes: 1
      };
      setReports((prev) => [localReport, ...prev]);
      setSubmittedReport(localReport);
    }
    setShowReportSubmitted(true);
    setActiveTab('dashboard');
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // Community verification: upvote a report; backend promotes it to VERIFIED at the threshold
  const handleUpvoteReport = async (reportId: string) => {
    const updated = await upvoteReport(reportId);
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        if (updated) return { ...r, ...updated };
        // offline fallback: optimistic local increment
        return { ...r, upvotes: (r.upvotes || 0) + 1 };
      })
    );
    if (!isBackendLive) {
      const local = reports.find((r) => r.id === reportId);
      if (local && (local.upvotes || 0) + 1 >= 10 && local.verificationStatus !== 'VERIFIED') {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, verificationStatus: 'VERIFIED' as const } : r))
        );
      }
    }
  };

  const rootBg = isDark ? 'bg-ops-bg tech-grid' : 'bg-day-bg tech-grid';
  const textColor = isDark ? 'text-ops-text' : 'text-day-text';

  return (
    <div className={`min-h-screen ${rootBg} ${textColor} flex flex-col font-sans pb-16 lg:pb-0 relative`}>
      
      {/* Global Header Bar */}
      <Header
        currentLocation={currentLocation}
        onOpenSearch={() => setShowLocationSearch(true)}
        onOpenAlerts={() => setActiveTab('alerts')}
        onOpenSettings={() => setActiveTab('settings')}
        unreadAlertCount={unreadAlertCount}
        activeTab={activeTab}
        isDark={isDark}
        onToggleTheme={toggleTheme}
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
            isDark={isDark}
            isOffline={!isBackendLive}
            weather={weather}
            onUpvoteReport={handleUpvoteReport}
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
            schemes={schemes.filter(
              (s) => s.applicableDisasterTypes.includes(selectedEvent.type)
            )}
            onViewAllSchemes={() => setActiveTab('schemes')}
            emergencyContacts={emergencyContacts}
            isDark={isDark}
          />
        )}

        {/* S07 REPORT INCIDENT FORM */}
        {activeTab === 'report' && (
          <ReportIncidentScreen
            currentLocation={currentLocation}
            onSubmitReport={handleSubmitNewReport}
            onCancel={() => setActiveTab('dashboard')}
            isDark={isDark}
          />
        )}

        {/* S09 NEARBY RESOURCES DIRECTORY */}
        {activeTab === 'resources' && (
          <NearbyResourcesScreen
            resources={resources}
            currentLocation={currentLocation}
            emergencyContacts={emergencyContacts}
            onSelectResource={(res) => setSelectedResource(res)}
            onSwitchToMap={() => setActiveTab('map')}
            isDark={isDark}
          />
        )}

        {/* S11 ALERTS FEED */}
        {activeTab === 'alerts' && (
          <AlertsScreen
            alerts={alerts}
            events={events}
            onSelectAlert={handleSelectAlert}
            onMarkAllAsRead={handleMarkAllAlertsRead}
            isDark={isDark}
          />
        )}

        {/* S13 SAVED LOCATIONS */}
        {activeTab === 'saved_locations' && (
          <SavedLocationsScreen
            locations={savedLocations}
            events={events}
            onSelectLocation={handleSelectLocation}
            onOpenSearch={() => setShowLocationSearch(true)}
            isDark={isDark}
          />
        )}

        {/* S14 SETTINGS */}
        {activeTab === 'settings' && <SettingsScreen isDark={isDark} onToggleTheme={toggleTheme} />}

        {/* S15 ABOUT / DATA SOURCES */}
        {activeTab === 'about' && (
          <AboutSourcesScreen
            isDark={isDark}
            sources={dataSources.length > 0 ? dataSources : undefined}
            onViewSchemes={() => setActiveTab('schemes')}
          />
        )}

        {/* S16 GOVERNMENT ASSISTANCE SCHEMES */}
        {activeTab === 'schemes' && <SchemesScreen schemes={schemes} isDark={isDark} />}

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
        isDark={isDark}
      />

      {/* S01 ONBOARDING MODAL */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onAllowLocation={() => {
          handleSelectLocation(INITIAL_LOCATIONS[0]);
          setShowOnboarding(false);
        }}
        isDark={isDark}
      />

      {/* S03 LOCATION SEARCH MODAL */}
      <LocationSearchModal
        isOpen={showLocationSearch}
        onClose={() => setShowLocationSearch(false)}
        onSelectLocation={(loc) => {
          handleSelectLocation(loc);
          refreshFromBackend(loc.lat, loc.lng);
        }}
        currentLocation={currentLocation}
        locations={savedLocations}
        isDark={isDark}
      />

      {/* S08 REPORT SUBMITTED MODAL */}
      <ReportSubmittedModal
        report={submittedReport}
        isOpen={showReportSubmitted}
        onClose={() => setShowReportSubmitted(false)}
        isDark={isDark}
      />

      {/* S10 RESOURCE DETAIL MODAL */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        isDark={isDark}
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
        isDark={isDark}
      />

    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;
