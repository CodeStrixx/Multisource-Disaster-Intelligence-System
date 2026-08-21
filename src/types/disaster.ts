export type RiskSeverity = 'low' | 'moderate' | 'high' | 'critical';

export type DisasterType = 'flood' | 'heavy_rain' | 'cyclone' | 'landslide' | 'earthquake' | 'heatwave';

export type VerificationStatus = 'UNVERIFIED' | 'UNDER_REVIEW' | 'CORROBORATED' | 'VERIFIED' | 'REJECTED';

export type SourceType = 'official' | 'trusted' | 'corroborated' | 'public' | 'unverified' | 'regional_media' | 'news_wire';

export type ResourceType = 'shelter' | 'hospital' | 'relief_centre' | 'police' | 'fire_station';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  name: string;
  district: string;
  state: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: SourceType;
  reliabilityScore: number; // 0-100
  lastSync: string;
  status: 'active' | 'delayed' | 'stale';
  channelLogo?: string;
  regionalLanguage?: string;
  bureauLocation?: string;
}

export interface NewsDispatch {
  id: string;
  channelName: string;
  headline: string;
  summary: string;
  timestamp: string;
  language: string;
  correspondent: string;
  verificationWeight: number; // +% score contribution
  isLiveBroadcast?: boolean;
  videoClipUrl?: string;
}

export interface VerificationFactor {
  factor: string;
  score: number; // percentage impact
  status: 'confirmed' | 'pending' | 'inconsistent';
  description: string;
}

export interface DisasterEvent {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  severity: RiskSeverity;
  confidenceScore: number; // 0 - 100
  status: 'active' | 'monitoring' | 'resolved';
  lat: number;
  lng: number;
  locationName: string;
  district: string;
  state: string;
  affectedRadiusKm: number;
  startedAt: string;
  updatedAt: string;
  sources: DataSource[];
  newsDispatches?: NewsDispatch[];
  verificationStatus: VerificationStatus;
  verificationFactors: VerificationFactor[];
  whatWeKnow: string[];
  riskFactors: { factor: string; impact: string }[];
  officialWarnings: string[];
  systemRecommendations: string[];
  rainfallMm?: number;
  affectedPopulationEstimate?: number;
  trend?: 'worsening' | 'stable' | 'improving';
}

export interface IncidentReport {
  id: string;
  userId?: string;
  userName: string;
  eventId?: string;
  type: DisasterType;
  description: string;
  lat: number;
  lng: number;
  locationName: string;
  mediaUrl?: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  evidenceNotes?: string;
}

export interface Alert {
  id: string;
  eventId: string;
  severity: RiskSeverity;
  title: string;
  message: string;
  locationName: string;
  createdAt: string;
  read: boolean;
  type: DisasterType;
  recommendedAction: string;
  source: string;
}

export interface ReliefResource {
  id: string;
  name: string;
  type: ResourceType;
  lat: number;
  lng: number;
  address: string;
  district: string;
  state: string;
  phone: string;
  capacity?: string;
  status: 'open' | 'busy' | 'full' | 'closed';
  source: string;
  updatedAt: string;
  distanceKm?: number;
  availableBedsOrKits?: number;
}

export interface RecommendationItem {
  id: string;
  disasterType: DisasterType;
  severity: RiskSeverity;
  title: string;
  description: string;
  priority: 'urgent' | 'important' | 'advisory';
  sourceCategory: 'Official Guidance (NDMA/SDMA)' | 'System Recommendation';
  isOfficial: boolean;
}
