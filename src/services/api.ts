/**
 * Backend API client for the Multi-Source Disaster Intelligence System.
 *
 * Every call degrades gracefully: if the backend is unreachable (demo resilience,
 * PRD M8/EC8) the caller receives the built-in mock dataset instead so the
 * dashboard keeps working offline.
 */
import {
  Alert,
  DataSource,
  DisasterEvent,
  EmergencyContact,
  GovernmentScheme,
  IncidentReport,
  LocationCoordinates,
  RecommendationItem,
  ReliefResource,
} from '../types/disaster';
import {
  INITIAL_LOCATIONS,
  MOCK_ALERTS,
  MOCK_DATA_SOURCES,
  MOCK_DISASTER_EVENTS,
  MOCK_INCIDENT_REPORTS,
  MOCK_RECOMMENDATIONS,
  MOCK_RELIEF_RESOURCES,
} from '../data/mockDisasterData';

const API_BASE: string = import.meta.env.VITE_API_URL || '/api/v1';
const REQUEST_TIMEOUT_MS = 8000;

export interface WeatherSnapshot {
  location: string | null;
  temperature: number | null;
  rainfallMm1h: number | null;
  rainfallMm24h: number | null;
  windKmh: number | null;
  weatherCondition: string | null;
  warningLevel: 'none' | 'alert' | 'watch' | 'warning' | null;
  observedAt: string | null;
  isStale: boolean;
  provider: string | null;
}

export interface EarthquakeSnapshot {
  externalEventId: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depthKm: number | null;
  regionName: string;
  occurredAt: string;
  provider: string;
}

export interface DashboardBundle {
  events: DisasterEvent[];
  alerts: Alert[];
  resources: ReliefResource[];
  generatedAt?: string;
}

async function request<T>(path: string, options: RequestInit = {}, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** Strict variant: returns null when the backend cannot be reached or errors.
 *  Used whenever the caller knows the backend is live so mock fallbacks never
 *  mask real (possibly empty) server state. */
async function requestOrNull<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Read endpoints (each falls back to the bundled mock data)
// ---------------------------------------------------------------------------

export async function fetchDashboard(lat?: number, lng?: number): Promise<DashboardBundle> {
  const fallback: DashboardBundle = {
    events: MOCK_DISASTER_EVENTS,
    alerts: MOCK_ALERTS,
    resources: MOCK_RELIEF_RESOURCES,
  };
  const qs = lat != null && lng != null ? `?lat=${lat}&lng=${lng}` : '';
  return request<DashboardBundle>(`/dashboard${qs}`, {}, fallback);
}

/** Live-only dashboard fetch: null when the backend fails (never mock-substituted). */
export async function fetchDashboardLive(lat?: number, lng?: number): Promise<DashboardBundle | null> {
  const qs = lat != null && lng != null ? `?lat=${lat}&lng=${lng}` : '';
  return requestOrNull<DashboardBundle>(`/dashboard${qs}`);
}

export async function fetchReportsLive(): Promise<IncidentReport[] | null> {
  return requestOrNull<IncidentReport[]>('/reports');
}

export async function fetchSourcesLive(): Promise<DataSource[] | null> {
  return requestOrNull<DataSource[]>('/sources');
}

export async function fetchEvents(): Promise<DisasterEvent[]> {
  return request<DisasterEvent[]>('/incidents', {}, MOCK_DISASTER_EVENTS);
}

export async function fetchNearbyEvents(lat: number, lng: number, radiusKm = 150): Promise<DisasterEvent[]> {
  return request<DisasterEvent[]>(
    `/incidents/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`,
    {},
    [],
  );
}

export async function fetchResources(lat?: number, lng?: number): Promise<ReliefResource[]> {
  const qs = lat != null && lng != null ? `?lat=${lat}&lng=${lng}` : '';
  return request<ReliefResource[]>(`/resources${qs}`, {}, MOCK_RELIEF_RESOURCES);
}

export async function fetchNearbyResources(lat: number, lng: number, radiusKm = 50): Promise<ReliefResource[]> {
  return request<ReliefResource[]>(
    `/resources/nearby?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`,
    {},
    [],
  );
}

export async function fetchAlerts(): Promise<Alert[]> {
  return request<Alert[]>('/alerts', {}, MOCK_ALERTS);
}

export async function fetchReports(): Promise<IncidentReport[]> {
  return request<IncidentReport[]>('/reports', {}, MOCK_INCIDENT_REPORTS);
}

export async function fetchRecommendations(type?: string): Promise<RecommendationItem[]> {
  const qs = type ? `?type=${type}` : '';
  return request<RecommendationItem[]>(`/recommendations${qs}`, {}, MOCK_RECOMMENDATIONS);
}

export async function fetchLocations(): Promise<LocationCoordinates[]> {
  return request<LocationCoordinates[]>('/locations', {}, INITIAL_LOCATIONS);
}

export async function fetchSources(): Promise<DataSource[]> {
  return request<DataSource[]>('/sources', {}, MOCK_DATA_SOURCES);
}

export async function fetchSchemes(type?: string, strict = false): Promise<GovernmentScheme[] | null> {
  const qs = type ? `?type=${type}` : '';
  return strict
    ? requestOrNull<GovernmentScheme[]>(`/schemes${qs}`)
    : request<GovernmentScheme[]>(`/schemes${qs}`, {}, MOCK_GOV_SCHEMES);
}

export async function fetchEmergencyContacts(strict = false): Promise<EmergencyContact[] | null> {
  return strict
    ? requestOrNull<EmergencyContact[]>('/emergency-contacts')
    : request<EmergencyContact[]>('/emergency-contacts', {}, MOCK_EMERGENCY_CONTACTS);
}

export interface RelevantScheme extends GovernmentScheme {
  matchedHazards: { id: string; type: string; title: string; severity: string }[];
}

export async function fetchRelevantSchemes(lat: number, lng: number, radiusKm = 300): Promise<RelevantScheme[]> {
  return request<RelevantScheme[]>(
    `/schemes/relevant?lat=${lat}&lng=${lng}&radius_km=${radiusKm}`,
    {},
    [],
  );
}

export async function fetchWeather(lat: number, lng: number, refresh = false): Promise<WeatherSnapshot> {
  return request<WeatherSnapshot>(`/weather?lat=${lat}&lng=${lng}${refresh ? '&refresh=true' : ''}`, {}, {
    location: null,
    temperature: null,
    rainfallMm1h: null,
    rainfallMm24h: null,
    windKmh: null,
    weatherCondition: null,
    warningLevel: null,
    observedAt: null,
    isStale: true,
    provider: null,
  });
}

export async function fetchEarthquakes(hours = 48): Promise<EarthquakeSnapshot[]> {
  return request<EarthquakeSnapshot[]>(`/earthquakes?hours=${hours}`, {}, []);
}

// ---------------------------------------------------------------------------
// Write endpoints (return null when backend unavailable so callers can fall back)
// ---------------------------------------------------------------------------

export type NewReportPayload = Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>;

export async function submitReport(payload: NewReportPayload): Promise<IncidentReport | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: payload.userName,
        type: payload.type,
        description: payload.description,
        lat: payload.lat,
        lng: payload.lng,
        locationName: payload.locationName,
        eventId: payload.eventId || undefined,
        mediaUrl: payload.mediaUrl || undefined,
        evidenceNotes: payload.evidenceNotes || undefined,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`report POST -> ${res.status}`);
    return (await res.json()) as IncidentReport;
  } catch {
    return null;
  }
}

export async function upvoteReport(reportId: string): Promise<IncidentReport | null> {
  try {
    const res = await fetch(`${API_BASE}/reports/${reportId}/upvote`, { method: 'POST' });
    if (!res.ok) return null;
    return (await res.json()) as IncidentReport;
  } catch {
    return null;
  }
}

// Must match REPORT_VERIFY_UPVOTES in backend/app/config.py
export const REPORT_VERIFY_UPVOTES = 10;

/** Extract the first clean http(s) URL from a portal string that may carry
 *  trailing descriptive text (e.g. "https://x.gov.in — see state portals"). */
export function extractPortalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const match = raw.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : null;
}

// ---------------------------------------------------------------------------
// Offline fallback catalog (subset of the seeded backend data)
// ---------------------------------------------------------------------------

const MOCK_GOV_SCHEMES: GovernmentScheme[] = [
  {
    id: 'SCH-SDRF',
    name: 'State Disaster Response Fund (SDRF) Ex-Gratia Relief',
    level: 'CENTRAL',
    administeringBody: 'MHA / NDMA Guidelines - State Governments & District Collectors',
    applicableDisasterTypes: ['flood', 'heavy_rain', 'cyclone', 'landslide', 'earthquake', 'heatwave'],
    summary: 'Primary statutory compensation for disaster-affected families per MHA ex-gratia norms.',
    benefitDetails: 'Ex-gratia of Rs. 4 lakh per deceased person; grievous injury assistance; house/cattle/crop loss aid per notified norms.',
    eligibility: 'Families of deceased/missing, seriously injured, and owners of damaged houses, cattle or crops in notified disaster areas.',
    documentsRequired: ['Aadhaar & bank passbook', 'Death/injury/damage certificate', 'Revenue records'],
    howToApply: ['Report loss during the official damage survey', 'Apply via Tehsildar / District Disaster Management office', 'Disbursement via DBT after verification'],
    portalUrl: 'https://ndma.gov.in',
    helpline: '1077 (District Emergency Operations Centre)',
  },
  {
    id: 'SCH-PMFBY',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    level: 'CENTRAL',
    administeringBody: 'Ministry of Agriculture & Farmers Welfare',
    applicableDisasterTypes: ['flood', 'heavy_rain', 'cyclone', 'heatwave'],
    summary: 'Crop insurance against natural calamities from sowing to post-harvest.',
    benefitDetails: 'Claims up to full sum insured; ~2% Kharif / ~1.5% Rabi farmer premium.',
    eligibility: 'All farmers including sharecroppers/tenants growing notified crops in notified areas.',
    documentsRequired: ['Aadhaar / ID proof', 'Land record or tenancy agreement', 'Bank account details'],
    howToApply: ['Enrol on PMFBY portal or CSC before seasonal cut-off', 'Report localised damage within 72 hours'],
    portalUrl: 'https://pmfby.gov.in',
    helpline: 'Kisan Call Centre: 1800-180-1551',
  },
  {
    id: 'SCH-NFSA-PMGKAY',
    name: 'NFSA Ration Entitlements / PMGKAY Free Foodgrain Support',
    level: 'CENTRAL',
    administeringBody: 'Department of Food & Public Distribution',
    applicableDisasterTypes: ['flood', 'heavy_rain', 'cyclone', 'landslide', 'earthquake', 'heatwave'],
    summary: 'Legal foodgrain entitlements with extra free allocations during disasters; portable nationwide.',
    benefitDetails: '5 kg free foodgrain per person/month; portable across states via One Nation One Ration Card.',
    eligibility: 'Valid NFSA ration card holders (Priority Household or Antyodaya).',
    documentsRequired: ['Valid ration card', 'Aadhaar seeded with ration card'],
    howToApply: ['Collect at any fair-price shop using ONORC if displaced', 'New cards via state food department portal'],
    portalUrl: 'https://nfsa.gov.in',
    helpline: 'Food grievance: 1800-112-750 | Emergency: 112',
  },
];

// Offline fallback: official national emergency numbers (static constants)
const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'National Emergency Helpline (Police / Fire / Medical)', category: 'EMERGENCY', phoneNumber: '112', description: 'Single all-in-one emergency number across India.' },
  { id: '2', name: 'Police Control Room', category: 'POLICE', phoneNumber: '100', description: 'Immediate police assistance.' },
  { id: '3', name: 'Fire & Rescue Services', category: 'FIRE', phoneNumber: '101', description: 'Fire outbreaks and rescue operations.' },
  { id: '4', name: 'Ambulance (Emergency Response Service)', category: 'MEDICAL', phoneNumber: '108', description: 'Free emergency ambulance and pre-hospital care.' },
  { id: '5', name: 'NDMA / NDRF Disaster Management Helpline', category: 'DISASTER', phoneNumber: '1078', description: 'Central disaster coordination control room.' },
  { id: '6', name: 'State Emergency Operations Centre', category: 'DISASTER', phoneNumber: '1070', description: 'State-level disaster warning and evacuation.' },
];

// ---------------------------------------------------------------------------
// Health probe (used to toggle the offline banner)
// ---------------------------------------------------------------------------

export interface BackendHealth {
  status: string;
  database: string;
  providers: Record<string, string>;
}

export async function checkHealth(): Promise<BackendHealth | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as BackendHealth;
  } catch {
    return null;
  }
}
