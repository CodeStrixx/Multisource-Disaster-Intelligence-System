import { DisasterEvent, IncidentReport, ReliefResource, Alert, LocationCoordinates, RecommendationItem, DataSource } from '../types/disaster';

export const INITIAL_LOCATIONS: LocationCoordinates[] = [
  {
    name: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
  },
  {
    name: 'Wayanad',
    district: 'Wayanad',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.1320,
  },
  {
    name: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    name: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    name: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    name: 'Guwahati',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    lat: 26.1445,
    lng: 91.7362,
  }
];

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'src-1',
    name: 'India Meteorological Department (IMD)',
    type: 'official',
    reliabilityScore: 98,
    lastSync: '10 mins ago',
    status: 'active'
  },
  {
    id: 'src-2',
    name: 'Central Water Commission (CWC)',
    type: 'official',
    reliabilityScore: 96,
    lastSync: '15 mins ago',
    status: 'active'
  },
  {
    id: 'src-3',
    name: 'State Disaster Management Authority (SDMA)',
    type: 'official',
    reliabilityScore: 99,
    lastSync: '5 mins ago',
    status: 'active'
  },
  {
    id: 'src-4',
    name: 'Corroborated Citizen Reports Network',
    type: 'corroborated',
    reliabilityScore: 84,
    lastSync: '2 mins ago',
    status: 'active'
  },
  {
    id: 'src-5',
    name: 'Local Emergency Feed & Media RSS',
    type: 'trusted',
    reliabilityScore: 78,
    lastSync: '18 mins ago',
    status: 'active'
  }
];

export const MOCK_DISASTER_EVENTS: DisasterEvent[] = [
  {
    id: 'EVT-GUJ-2026-01',
    type: 'flood',
    title: 'Severe Urban Inundation & Submerged Underpasses',
    description: 'Heavy continuous downpour in West and Central Ahmedabad causing waterlogging up to 3.5 ft in low-lying underpasses and residential zones near Sabarmati.',
    severity: 'high',
    confidenceScore: 92,
    status: 'active',
    lat: 23.0225,
    lng: 72.5714,
    locationName: 'Ahmedabad Central & West',
    district: 'Ahmedabad',
    state: 'Gujarat',
    affectedRadiusKm: 14,
    startedAt: '2026-08-12T14:30:00Z',
    updatedAt: '2026-08-12T21:15:00Z',
    rainfallMm: 185,
    affectedPopulationEstimate: 145000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[3]],
    verificationFactors: [
      { factor: 'Official IMD Heavy Rainfall Warning', score: 35, status: 'confirmed', description: 'IMD Red Alert issued for Ahmedabad & Anand districts.' },
      { factor: 'CWC Hydrological Gauge Peak', score: 30, status: 'confirmed', description: 'Sabarmati river gauge reading 1.8m above normal level.' },
      { factor: 'Multi-point Citizen Field Reports', score: 27, status: 'confirmed', description: '18 independent geotagged reports corroborated with video evidence.' }
    ],
    whatWeKnow: [
      'Akhbarnagar and Mithakhali underpasses are fully closed to vehicular traffic due to 4 ft water accumulation.',
      'AMC emergency response teams have deployed 14 high-capacity dewatering pumps.',
      'No loss of life reported; power sub-stations isolated in Usmanpura as a precautionary measure.'
    ],
    riskFactors: [
      { factor: 'Continuous Heavy Precipitation', impact: 'Runoff volume exceeds storm drainage capacity by 220%' },
      { factor: 'Low-Lying Topography', impact: 'High risk of basement flooding in CG Road and Ashram Road areas' },
      { factor: 'Peak Commute Traffic', impact: 'Severe congestion and stranded vehicles along S.G. Highway' }
    ],
    officialWarnings: [
      'AMC Notice: Citizens are advised to avoid unnecessary travel and stay clear of inundated underpasses.',
      'SDMA Alert: Keep emergency contact numbers saved and move electrical appliances above ground level.'
    ],
    systemRecommendations: [
      'If driving, turn back immediately if water depth exceeds wheel height.',
      'Seek shelter in elevated multi-story structures if ground floor is inundated.',
      'Disconnect main power circuit if water approaches electrical outlets.'
    ]
  },
  {
    id: 'EVT-KER-2026-02',
    type: 'landslide',
    title: 'Flash Landslide & Debris Flow Warning',
    description: 'Catastrophic slope instability following 240mm extreme rainfall in hilly terrains of Chooralmala and Meppadi.',
    severity: 'critical',
    confidenceScore: 96,
    status: 'active',
    lat: 11.6854,
    lng: 76.1320,
    locationName: 'Meppadi / Chooralmala Hill Belt',
    district: 'Wayanad',
    state: 'Kerala',
    affectedRadiusKm: 8,
    startedAt: '2026-08-12T02:00:00Z',
    updatedAt: '2026-08-12T21:20:00Z',
    rainfallMm: 240,
    affectedPopulationEstimate: 12000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[1], MOCK_DATA_SOURCES[2]],
    verificationFactors: [
      { factor: 'Geological Survey Slope Instability Alert', score: 40, status: 'confirmed', description: 'Soil saturation index exceeded threshold by 310%.' },
      { factor: 'NDRF Base Command Dispatch', score: 35, status: 'confirmed', description: '3 NDRF battalions deployed for search and rescue operations.' },
      { factor: 'Verified Rescue Calls', score: 21, status: 'confirmed', description: 'Direct helpline logs from emergency services.' }
    ],
    whatWeKnow: [
      'Chooralmala bridge compromised; temporary Bailey bridge construction initiated by Indian Army.',
      'Relief camps established in 4 higher-altitude higher secondary schools.',
      'Helicopter airlifts standby at Sulthan Bathery air strip pending weather window.'
    ],
    riskFactors: [
      { factor: 'Saturated Soil & Unstable Slopes', impact: 'High risk of secondary slope failures along Meppadi road' },
      { factor: 'Disrupted Road Network', impact: 'Primary access roads blocked by boulders and fallen trees' }
    ],
    officialWarnings: [
      'Kerala SDMA: Extreme Danger Zone. Evacuate all riverside and hill-slope dwellings in Vythiri & Meppadi Panchayat.'
    ],
    systemRecommendations: [
      'Evacuate immediately along marked uphill safe routes to designated relief shelters.',
      'Listen for sudden rumbling noises or cracking trees which signal imminent earth movement.'
    ]
  },
  {
    id: 'EVT-MAH-2026-03',
    type: 'heavy_rain',
    title: 'Extreme Rainfall & High Tide Warning',
    description: 'Widespread torrential rainfall coupled with a 4.5-meter high tide leading to storm-water logging across Dadar, Hindmata, and Kurla.',
    severity: 'moderate',
    confidenceScore: 88,
    status: 'active',
    lat: 19.0760,
    lng: 72.8777,
    locationName: 'South & Central Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    affectedRadiusKm: 22,
    startedAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-12T20:50:00Z',
    rainfallMm: 110,
    affectedPopulationEstimate: 350000,
    trend: 'stable',
    verificationStatus: 'CORROBORATED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[3]],
    verificationFactors: [
      { factor: 'IMD Mumbai Radar Observation', score: 50, status: 'confirmed', description: 'Dopplar weather radar shows dense rain bands moving inland.' },
      { factor: 'BMC Disaster Management Control Room', score: 38, status: 'confirmed', description: 'Automatic rain gauges recording 45mm/hr rate.' }
    ],
    whatWeKnow: [
      'Local train services running with 15-minute delays on Central Line.',
      'High tide peak at 14:15 IST has receded, allowing sluice gates to drain stormwater into the Arabian Sea.'
    ],
    riskFactors: [
      { factor: 'High Tide Barrier', impact: 'Coastal drainage sluice gates closed during high tide peak' }
    ],
    officialWarnings: [
      'BMC Public Advisory: Exercise caution on promenade walkways and stay clear of sea face during high tide hours.'
    ],
    systemRecommendations: [
      'Check local train operational updates before commuting.',
      'Keep mobile devices charged and carry rain protection.'
    ]
  },
  {
    id: 'EVT-TN-2026-04',
    type: 'cyclone',
    title: 'Deep Depression Approaching North Coastal Tamil Nadu',
    description: 'System intensifying into Cyclonic Storm with sustained surface winds of 65-75 km/h gusting to 85 km/h.',
    severity: 'high',
    confidenceScore: 94,
    status: 'active',
    lat: 13.0827,
    lng: 80.2707,
    locationName: 'Coastal Chennai & Ennore Port',
    district: 'Chennai',
    state: 'Tamil Nadu',
    affectedRadiusKm: 45,
    startedAt: '2026-08-11T18:00:00Z',
    updatedAt: '2026-08-12T21:00:00Z',
    rainfallMm: 130,
    affectedPopulationEstimate: 500000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2]],
    verificationFactors: [
      { factor: 'IMD Cyclone Warning Bulletin #12', score: 60, status: 'confirmed', description: 'Track projection confirms landfall between Puducherry and Nellore.' },
      { factor: 'Coastal Guard Sea State Sensors', score: 34, status: 'confirmed', description: 'Rough to very rough sea conditions observed.' }
    ],
    whatWeKnow: [
      'Fishermen warning strictly issued; all ocean vessels anchored.',
      'Schools and colleges closed across Chennai, Thiruvallur and Chengalpattu.'
    ],
    riskFactors: [
      { factor: 'Gale Wind Forces', impact: 'Potential damage to loose structures, hoardings and thatched roofs' }
    ],
    officialWarnings: [
      'TN SDMA Warning: Stay indoors during wind surges. Keep emergency food and clean drinking water stocked for 48 hours.'
    ],
    systemRecommendations: [
      'Secure loose roof sheets, outdoor furniture and window shutters.',
      'Store adequate drinking water and non-perishable food supplies.'
    ]
  },
  {
    id: 'EVT-DEL-2026-05',
    type: 'heatwave',
    title: 'Severe Heatwave Advisory',
    description: 'Maximum temperatures reaching 44.5°C across Delhi NCR with dry hot westerly winds.',
    severity: 'moderate',
    confidenceScore: 90,
    status: 'active',
    lat: 28.6139,
    lng: 77.2090,
    locationName: 'New Delhi & NCR',
    district: 'New Delhi',
    state: 'Delhi',
    affectedRadiusKm: 50,
    startedAt: '2026-08-10T00:00:00Z',
    updatedAt: '2026-08-12T18:00:00Z',
    trend: 'improving',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0]],
    verificationFactors: [
      { factor: 'IMD Safdarjung Observatory Signal', score: 90, status: 'confirmed', description: 'Temperature +5.2°C above seasonal normal for 3 consecutive days.' }
    ],
    whatWeKnow: [
      'Cooling shelters established at major bus terminals and railway stations.',
      'Peak power load hit record high of 7,800 MW.'
    ],
    riskFactors: [
      { factor: 'Extreme Thermal Stress', impact: 'High risk of heat exhaustion and sunstroke during 12:00 - 16:00 peak hours' }
    ],
    officialWarnings: [
      'Health Ministry Advisory: Avoid direct sunlight between 12 PM and 4 PM. Drink ORS or lemon water frequently.'
    ],
    systemRecommendations: [
      'Stay hydrated with water, buttermilk or electrolyte solutions.',
      'Wear lightweight, light-colored cotton clothing.'
    ]
  }
];

export const MOCK_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'REP-2026-101',
    userName: 'Karan Patel (Citizen)',
    eventId: 'EVT-GUJ-2026-01',
    type: 'flood',
    description: 'Mithakhali underpass completely filled with water. 2 cars stranded. AMC police blocking traffic entry.',
    lat: 23.0300,
    lng: 72.5650,
    locationName: 'Mithakhali Underpass, Ahmedabad',
    verificationStatus: 'VERIFIED',
    confidenceScore: 95,
    createdAt: '2026-08-12T19:45:00Z',
    updatedAt: '2026-08-12T20:10:00Z',
    upvotes: 42,
    evidenceNotes: 'Photographic evidence verified against AMC traffic camera feed #14.'
  },
  {
    id: 'REP-2026-102',
    userName: 'Ananya Roy (Resident)',
    eventId: 'EVT-GUJ-2026-01',
    type: 'flood',
    description: 'Ground floor apartment complex near Prahladnagar garden has 1.5 ft water level. Transformer sparking nearby.',
    lat: 23.0150,
    lng: 72.5100,
    locationName: 'Prahladnagar, Ahmedabad',
    verificationStatus: 'CORROBORATED',
    confidenceScore: 86,
    createdAt: '2026-08-12T20:15:00Z',
    updatedAt: '2026-08-12T20:40:00Z',
    upvotes: 28,
    evidenceNotes: 'Corroborated by 3 neighboring resident submissions.'
  },
  {
    id: 'REP-2026-103',
    userName: 'Suresh Kumar (Volunteer)',
    eventId: 'EVT-KER-2026-02',
    type: 'landslide',
    description: 'Mudslide blocking primary bypass road to Meppadi hospital. Ambulance access restricted.',
    lat: 11.6780,
    lng: 76.1280,
    locationName: 'Meppadi Bypass Road, Wayanad',
    verificationStatus: 'VERIFIED',
    confidenceScore: 98,
    createdAt: '2026-08-12T18:20:00Z',
    updatedAt: '2026-08-12T19:00:00Z',
    upvotes: 64,
    evidenceNotes: 'Confirmed by Kerala Fire Force Control Room.'
  },
  {
    id: 'REP-2026-104',
    userName: 'Rohan Mehta (Commuter)',
    eventId: 'EVT-GUJ-2026-01',
    type: 'flood',
    description: 'Tree fallen over electric line on C.G. Road near Stadium Cross Roads.',
    lat: 23.0380,
    lng: 72.5620,
    locationName: 'C.G. Road, Ahmedabad',
    verificationStatus: 'UNDER_REVIEW',
    confidenceScore: 62,
    createdAt: '2026-08-12T21:05:00Z',
    updatedAt: '2026-08-12T21:05:00Z',
    upvotes: 9,
    evidenceNotes: 'Submitted via citizen app, awaiting verification dispatch.'
  },
  {
    id: 'REP-2026-105',
    userName: 'Rajesh V. (Citizen)',
    eventId: 'EVT-MAH-2026-03',
    type: 'heavy_rain',
    description: 'Hindmata junction waist-deep water. Best buses diverted via Dadar TT flyover.',
    lat: 19.0120,
    lng: 72.8430,
    locationName: 'Hindmata, Dadar, Mumbai',
    verificationStatus: 'VERIFIED',
    confidenceScore: 92,
    createdAt: '2026-08-12T19:30:00Z',
    updatedAt: '2026-08-12T20:00:00Z',
    upvotes: 51
  }
];

export const MOCK_RELIEF_RESOURCES: ReliefResource[] = [
  {
    id: 'RES-01',
    name: 'AMC Civil Emergency Hospital & Trauma Centre',
    type: 'hospital',
    lat: 23.0520,
    lng: 72.5930,
    address: 'Asarwa, Ahmedabad, Gujarat 380016',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '+91 79 2268 3721',
    capacity: '250 Emergency Beds',
    availableBedsOrKits: 42,
    status: 'open',
    source: 'Health Department Gujarat',
    updatedAt: '15 mins ago',
    distanceKm: 4.2
  },
  {
    id: 'RES-02',
    name: 'Community Relief Shelter (Navrangpura School #4)',
    type: 'shelter',
    lat: 23.0360,
    lng: 72.5600,
    address: 'Near Commerce Six Roads, Navrangpura, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '+91 79 2640 1122',
    capacity: '500 Persons',
    availableBedsOrKits: 180,
    status: 'open',
    source: 'AMC Municipal Corporation',
    updatedAt: '10 mins ago',
    distanceKm: 1.8
  },
  {
    id: 'RES-03',
    name: 'NDRF 6th Battalion Rapid Relief Outpost',
    type: 'relief_centre',
    lat: 23.0180,
    lng: 72.5800,
    address: 'Paldi Command Station, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '1077 (Disaster Toll-Free)',
    capacity: 'Food Packets & Water Distribution',
    availableBedsOrKits: 1200,
    status: 'open',
    source: 'NDRF Command',
    updatedAt: '5 mins ago',
    distanceKm: 2.5
  },
  {
    id: 'RES-04',
    name: 'Wayanad District Collectorate Emergency Control Room',
    type: 'relief_centre',
    lat: 11.6080,
    lng: 76.0830,
    address: 'Civil Station, Kalpetta, Wayanad, Kerala 673121',
    district: 'Wayanad',
    state: 'Kerala',
    phone: '+91 4936 204151',
    capacity: '24x7 Helpline & Search Command',
    status: 'open',
    source: 'Kerala SDMA',
    updatedAt: '2 mins ago',
    distanceKm: 0.5
  },
  {
    id: 'RES-05',
    name: 'Meppadi High School Relief Shelter',
    type: 'shelter',
    lat: 11.5510,
    lng: 76.1220,
    address: 'Meppadi Town, Wayanad, Kerala',
    district: 'Wayanad',
    state: 'Kerala',
    phone: '+91 4936 282200',
    capacity: '350 Evacuees',
    availableBedsOrKits: 65,
    status: 'open',
    source: 'District Administration Wayanad',
    updatedAt: '8 mins ago',
    distanceKm: 3.1
  },
  {
    id: 'RES-06',
    name: 'Navrangpura Police Headquarters',
    type: 'police',
    lat: 23.0340,
    lng: 72.5580,
    address: 'University Road, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '100 / +91 79 2630 0055',
    status: 'open',
    source: 'Gujarat Police Portal',
    updatedAt: '1 hour ago',
    distanceKm: 1.4
  },
  {
    id: 'RES-07',
    name: 'Central Fire Brigade Station',
    type: 'fire_station',
    lat: 23.0260,
    lng: 72.5850,
    address: 'Danamapith, Jamalpur, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '101 / +91 79 2535 3282',
    status: 'open',
    source: 'AMC Fire Services',
    updatedAt: '25 mins ago',
    distanceKm: 2.1
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-101',
    eventId: 'EVT-GUJ-2026-01',
    severity: 'high',
    title: 'RED ALERT: Heavy Rainfall & Underpass Closure',
    message: 'Continuous heavy rainfall in Ahmedabad. Mithakhali and Akhbarnagar underpasses closed. Avoid low-lying areas in West Zone.',
    locationName: 'Ahmedabad, Gujarat',
    createdAt: '2026-08-12T20:30:00Z',
    read: false,
    type: 'flood',
    recommendedAction: 'Do not attempt to drive through inundated roads or underpasses.',
    source: 'IMD & AMC Emergency Cell'
  },
  {
    id: 'ALT-102',
    eventId: 'EVT-KER-2026-02',
    severity: 'critical',
    title: 'CRITICAL EMERGENCY: Evacuation Order for Meppadi Belt',
    message: 'High risk of landslide in hill slopes near Meppadi and Chooralmala. Move immediately to high ground relief shelters.',
    locationName: 'Wayanad, Kerala',
    createdAt: '2026-08-12T19:00:00Z',
    read: true,
    type: 'landslide',
    recommendedAction: 'Evacuate along marked safety corridors to school shelters.',
    source: 'Kerala SDMA Control Room'
  },
  {
    id: 'ALT-103',
    eventId: 'EVT-TN-2026-04',
    severity: 'high',
    title: 'CYCLONE WARNING: Deep Depression Approaching Coast',
    message: 'Gale wind speeds 65-75 km/h expected along Chennai coastal belt. Stay indoors and secure loose property.',
    locationName: 'Chennai, Tamil Nadu',
    createdAt: '2026-08-12T17:45:00Z',
    read: true,
    type: 'cyclone',
    recommendedAction: 'Charge communication devices and store clean drinking water.',
    source: 'IMD Regional Meteorological Centre'
  }
];

export const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'REC-01',
    disasterType: 'flood',
    severity: 'high',
    title: 'Vehicle & Submerged Road Safety',
    description: 'Never drive into water covering the road. 15 cm of moving water can knock you off your feet, and 30 cm will float most cars.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-02',
    disasterType: 'flood',
    severity: 'high',
    title: 'Electrical Hazard Precaution',
    description: 'Disconnect the main electrical supply switch if floodwaters begin entering your home or ground-level premises.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-03',
    disasterType: 'flood',
    severity: 'moderate',
    title: 'Drinking Water Purification',
    description: 'Boil drinking water for at least 3 minutes or use halogen tablets to prevent waterborne illnesses during flood events.',
    priority: 'important',
    sourceCategory: 'System Recommendation',
    isOfficial: false
  },
  {
    id: 'REC-04',
    disasterType: 'landslide',
    severity: 'critical',
    title: 'Hill Slope Evacuation Protocol',
    description: 'Move quickly away from the landslide path or debris stream. Stay alert for sounds of cracking trees or rolling boulders.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  }
];
