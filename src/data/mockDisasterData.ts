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
  },
  {
    name: 'Puri / Bhubaneswar',
    district: 'Puri',
    state: 'Odisha',
    lat: 19.8135,
    lng: 85.8312,
  },
  {
    name: 'Joshimath',
    district: 'Chamoli',
    state: 'Uttarakhand',
    lat: 30.5574,
    lng: 79.5668,
  },
  {
    name: 'Kolkata / Sundarbans',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    name: 'Shimla / Mandi',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lng: 77.1734,
  },
  {
    name: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
  },
  {
    name: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    name: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    name: 'Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    name: 'Srinagar',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    lat: 34.0837,
    lng: 74.7973,
  },
  {
    name: 'Port Blair',
    district: 'South Andaman',
    state: 'Andaman & Nicobar',
    lat: 11.6234,
    lng: 92.7265,
  },
  {
    name: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
  }
];

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'src-1',
    name: 'India Meteorological Department (IMD)',
    type: 'official',
    reliabilityScore: 98,
    lastSync: '4 mins ago',
    status: 'active'
  },
  {
    id: 'src-2',
    name: 'Central Water Commission (CWC)',
    type: 'official',
    reliabilityScore: 96,
    lastSync: '8 mins ago',
    status: 'active'
  },
  {
    id: 'src-3',
    name: 'National / State Disaster Management Authority (NDMA/SDMA)',
    type: 'official',
    reliabilityScore: 99,
    lastSync: '2 mins ago',
    status: 'active'
  },
  {
    id: 'src-4',
    name: 'Indian National Centre for Ocean Info Services (INCOIS)',
    type: 'official',
    reliabilityScore: 97,
    lastSync: '6 mins ago',
    status: 'active'
  },
  {
    id: 'src-5',
    name: 'NRSC / ISRO Bhuvan Disaster Services',
    type: 'official',
    reliabilityScore: 98,
    lastSync: '12 mins ago',
    status: 'active'
  },
  {
    id: 'src-6',
    name: 'National Centre for Seismology (NCS)',
    type: 'official',
    reliabilityScore: 99,
    lastSync: '1 min ago',
    status: 'active'
  },
  {
    id: 'src-7',
    name: 'Geological Survey of India (GSI) Landslide Engine',
    type: 'official',
    reliabilityScore: 95,
    lastSync: '14 mins ago',
    status: 'active'
  },
  {
    id: 'src-8',
    name: 'Corroborated Citizen Sentinel Network',
    type: 'corroborated',
    reliabilityScore: 86,
    lastSync: '1 min ago',
    status: 'active'
  },
  {
    id: 'src-9',
    name: 'NDRF Base Command Operations Telemetry',
    type: 'official',
    reliabilityScore: 99,
    lastSync: '3 mins ago',
    status: 'active'
  },
  {
    id: 'src-10',
    name: 'Social Sentinel & CrisisNLP Feed',
    type: 'trusted',
    reliabilityScore: 80,
    lastSync: '5 mins ago',
    status: 'active'
  },
  {
    id: 'src-11',
    name: 'DD News & Prasar Bharati Regional Desks',
    type: 'regional_media',
    reliabilityScore: 92,
    lastSync: '3 mins ago',
    status: 'active',
    regionalLanguage: 'Multilingual Regional',
    bureauLocation: 'National & State Bureaus'
  },
  {
    id: 'src-12',
    name: 'Press Trust of India (PTI) & ANI Disaster Wire',
    type: 'news_wire',
    reliabilityScore: 94,
    lastSync: '2 mins ago',
    status: 'active',
    regionalLanguage: 'English / Hindi / Regional Wires',
    bureauLocation: 'National Bureau Network'
  },
  {
    id: 'src-13',
    name: 'Gujarat Regional Broadcast Bureau (ABP Asmita / Sandesh / Divya Bhaskar)',
    type: 'regional_media',
    reliabilityScore: 88,
    lastSync: '5 mins ago',
    status: 'active',
    regionalLanguage: 'Gujarati (ગુજરાતી)',
    bureauLocation: 'Ahmedabad & Surat Bureaus'
  },
  {
    id: 'src-14',
    name: 'Kerala Regional Broadcast Desk (Asianet News / Manorama News)',
    type: 'regional_media',
    reliabilityScore: 91,
    lastSync: '4 mins ago',
    status: 'active',
    regionalLanguage: 'Malayalam (മലയാളം)',
    bureauLocation: 'Kozhikode & Kalpetta Bureaus'
  },
  {
    id: 'src-15',
    name: 'Odisha Coastal News Desk (Sambad / Kalinga TV / OTV)',
    type: 'regional_media',
    reliabilityScore: 90,
    lastSync: '6 mins ago',
    status: 'active',
    regionalLanguage: 'Odia (ଓଡ଼ିଆ)',
    bureauLocation: 'Bhubaneswar & Puri Bureaus'
  },
  {
    id: 'src-16',
    name: 'Assam & Northeast News Bureau (Pratidin Time / News Live)',
    type: 'regional_media',
    reliabilityScore: 89,
    lastSync: '7 mins ago',
    status: 'active',
    regionalLanguage: 'Assamese (অসমীয়া)',
    bureauLocation: 'Guwahati & Dibrugarh Bureaus'
  },
  {
    id: 'src-17',
    name: 'Tamil Nadu Broadcast Bureau (Thanthi TV / Puthiya Thalaimurai / Sun News)',
    type: 'regional_media',
    reliabilityScore: 90,
    lastSync: '5 mins ago',
    status: 'active',
    regionalLanguage: 'Tamil (தமிழ்)',
    bureauLocation: 'Chennai & Madurai Bureaus'
  },
  {
    id: 'src-18',
    name: 'Maharashtra Regional Desk (ABP Majha / Zee 24 Taas / TV9 Marathi)',
    type: 'regional_media',
    reliabilityScore: 91,
    lastSync: '4 mins ago',
    status: 'active',
    regionalLanguage: 'Marathi (मराठी)',
    bureauLocation: 'Mumbai & Pune Bureaus'
  },
  {
    id: 'src-19',
    name: 'West Bengal News Desk (ABP Ananda / Zee 24 Ghanta / Ei Samay)',
    type: 'regional_media',
    reliabilityScore: 89,
    lastSync: '6 mins ago',
    status: 'active',
    regionalLanguage: 'Bengali (বাংলা)',
    bureauLocation: 'Kolkata & Siliguri Bureaus'
  },
  {
    id: 'src-20',
    name: 'Andhra Pradesh Broadcast Bureau (TV5 News / ETV Andhra / TV9 AP)',
    type: 'regional_media',
    reliabilityScore: 88,
    lastSync: '8 mins ago',
    status: 'active',
    regionalLanguage: 'Telugu (తెలుగు)',
    bureauLocation: 'Vijayawada & Visakhapatnam Bureaus'
  },
  {
    id: 'src-21',
    name: 'Telangana News Desk (V6 News / 10TV News / TV9 Telangana)',
    type: 'regional_media',
    reliabilityScore: 87,
    lastSync: '9 mins ago',
    status: 'active',
    regionalLanguage: 'Telugu (తెలుగు)',
    bureauLocation: 'Hyderabad & Warangal Bureaus'
  },
  {
    id: 'src-22',
    name: 'Karnataka Regional Bureau (TV9 Kannada / Public TV / Suvarna News)',
    type: 'regional_media',
    reliabilityScore: 88,
    lastSync: '6 mins ago',
    status: 'active',
    regionalLanguage: 'Kannada (ಕನ್ನಡ)',
    bureauLocation: 'Bengaluru & Mysuru Bureaus'
  },
  {
    id: 'src-23',
    name: 'Punjab & Haryana News Bureau (PTC News / News18 Punjab Haryana / Jagran TV)',
    type: 'regional_media',
    reliabilityScore: 86,
    lastSync: '10 mins ago',
    status: 'active',
    regionalLanguage: 'Punjabi (ਪੰਜਾਬੀ) / Hindi',
    bureauLocation: 'Chandigarh & Amritsar Bureaus'
  },
  {
    id: 'src-24',
    name: 'Rajasthan Broadcast Desk (ETV Rajasthan / First India News / Zee Rajasthan)',
    type: 'regional_media',
    reliabilityScore: 86,
    lastSync: '11 mins ago',
    status: 'active',
    regionalLanguage: 'Hindi / Rajasthani (राजस्थानी)',
    bureauLocation: 'Jaipur & Jodhpur Bureaus'
  },
  {
    id: 'src-25',
    name: 'Uttarakhand & Himachal Desk (News18 Uttarakhand / DD Shimla / Devbhoomi TV)',
    type: 'regional_media',
    reliabilityScore: 85,
    lastSync: '13 mins ago',
    status: 'active',
    regionalLanguage: 'Hindi / Pahadi',
    bureauLocation: 'Dehradun & Shimla Bureaus'
  },
  {
    id: 'src-26',
    name: 'Bihar & Jharkhand News Bureau (News18 Bihar Jharkhand / Sahara Samay Bihar / ETV Bihar)',
    type: 'regional_media',
    reliabilityScore: 85,
    lastSync: '9 mins ago',
    status: 'active',
    regionalLanguage: 'Hindi / Bhojpuri',
    bureauLocation: 'Patna & Ranchi Bureaus'
  },
  {
    id: 'src-27',
    name: 'Madhya Pradesh & Chhattisgarh Desk (News18 MP-CG / ETV MP / Sahara Samay MP)',
    type: 'regional_media',
    reliabilityScore: 86,
    lastSync: '8 mins ago',
    status: 'active',
    regionalLanguage: 'Hindi',
    bureauLocation: 'Bhopal & Raipur Bureaus'
  },
  {
    id: 'src-28',
    name: 'Manipur & Northeast Hill States Desk (IFP Imphal / E-Pao / ISTV News)',
    type: 'regional_media',
    reliabilityScore: 83,
    lastSync: '15 mins ago',
    status: 'active',
    regionalLanguage: 'Meitei / English',
    bureauLocation: 'Imphal & Aizawl Bureaus'
  },
  {
    id: 'src-29',
    name: 'Delhi NCR Disaster Desk (Aaj Tak / India TV / NDTV India)',
    type: 'news_wire',
    reliabilityScore: 92,
    lastSync: '3 mins ago',
    status: 'active',
    regionalLanguage: 'Hindi / English',
    bureauLocation: 'New Delhi National Desk'
  },
  {
    id: 'src-30',
    name: 'NDTV National Disaster Wire (English)',
    type: 'news_wire',
    reliabilityScore: 93,
    lastSync: '2 mins ago',
    status: 'active',
    regionalLanguage: 'English',
    bureauLocation: 'New Delhi & State Correspondents'
  }
];

export const MOCK_DISASTER_EVENTS: DisasterEvent[] = [
  // 1. Ahmedabad (Gujarat)
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
    startedAt: '2026-08-14T14:30:00Z',
    updatedAt: '2026-08-15T12:15:00Z',
    rainfallMm: 185,
    affectedPopulationEstimate: 145000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[7], MOCK_DATA_SOURCES[11], MOCK_DATA_SOURCES[12]],
    newsDispatches: [
      {
        id: 'NW-GUJ-01',
        channelName: 'ABP Asmita Gujarat',
        headline: 'Akhbarnagar Underpass Flooded 4ft Deep; 2 Stranded Vehicles Rescued by AMC',
        summary: 'Correspondent Nirav Dave reporting live from Akhbarnagar. Municipal pumps deployed; traffic diverted via 132ft Ring Road.',
        timestamp: '15 mins ago',
        language: 'Gujarati (ગુજરાતી)',
        correspondent: 'Nirav Dave (Field Correspondent)',
        verificationWeight: 22,
        isLiveBroadcast: true
      },
      {
        id: 'NW-GUJ-02',
        channelName: 'PTI Disaster Wire',
        headline: 'Sabarmati Riverfront Walkways Inundated as Vasna Barrage Opens 8 Gates',
        summary: 'Vasna Barrage administration confirms discharge of 35,000 cusecs water into downstream Sabarmati following catchment rains.',
        timestamp: '25 mins ago',
        language: 'English',
        correspondent: 'PTI State Bureau',
        verificationWeight: 25,
        isLiveBroadcast: false
      }
    ],
    verificationFactors: [
      { factor: 'Official IMD Heavy Rainfall Warning', score: 35, status: 'confirmed', description: 'IMD Red Alert issued for Ahmedabad & Anand districts.' },
      { factor: 'CWC Hydrological Gauge Peak', score: 30, status: 'confirmed', description: 'Sabarmati river gauge reading 1.8m above normal level.' },
      { factor: 'Regional News Broadcast Confirmation', score: 22, status: 'confirmed', description: 'Live video dispatch from ABP Asmita / Sandesh News confirms underpass closure.' },
      { factor: 'Multi-point Citizen Field Reports', score: 27, status: 'confirmed', description: '18 independent geotagged reports corroborated with video evidence.' }
    ],
    whatWeKnow: [
      'Akhbarnagar and Mithakhali underpasses are fully closed to vehicular traffic due to 4 ft water accumulation.',
      'AMC emergency response teams have deployed 14 high-capacity dewatering pumps.',
      'Power sub-stations isolated in Usmanpura as a precautionary measure.'
    ],
    riskFactors: [
      { factor: 'Continuous Heavy Precipitation', impact: 'Runoff volume exceeds storm drainage capacity by 220%' },
      { factor: 'Low-Lying Topography', impact: 'High risk of basement flooding in CG Road and Ashram Road areas' }
    ],
    officialWarnings: [
      'AMC Notice: Citizens are advised to avoid unnecessary travel and stay clear of inundated underpasses.',
      'Gujarat SDMA: Keep emergency contact numbers saved and move electrical appliances above ground level.'
    ],
    systemRecommendations: [
      'If driving, turn back immediately if water depth exceeds wheel height.',
      'Seek shelter in elevated multi-story structures if ground floor is inundated.',
      'Disconnect main power circuit if water approaches electrical outlets.'
    ]
  },

  // 2. Wayanad (Kerala)
  {
    id: 'EVT-KER-2026-02',
    type: 'landslide',
    title: 'Catastrophic Slope Failure & Debris Flow Emergency',
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
    startedAt: '2026-08-14T02:00:00Z',
    updatedAt: '2026-08-15T12:20:00Z',
    rainfallMm: 240,
    affectedPopulationEstimate: 12000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[6], MOCK_DATA_SOURCES[8], MOCK_DATA_SOURCES[13]],
    newsDispatches: [
      {
        id: 'NW-KER-01',
        channelName: 'Asianet News Kerala',
        headline: 'Chooralmala Bridge Collapsed; Indian Army Rushes Bailey Bridge Units to Meppadi',
        summary: 'Special Correspondent Rahul Nair reporting live from Meppadi. Army Madras Regiment and NDRF establishing zip-line rescue transits across the swollen river.',
        timestamp: '18 mins ago',
        language: 'Malayalam (മലയാളം)',
        correspondent: 'Rahul Nair (Special Correspondent)',
        verificationWeight: 28,
        isLiveBroadcast: true
      },
      {
        id: 'NW-KER-02',
        channelName: 'Manorama News Ground Bureau',
        headline: '4 Higher Altitude Schools Converted to Medical Triage Outposts in Kalpetta',
        summary: 'District administration has accommodated over 1,200 evacuated plantation workers in relief camps.',
        timestamp: '35 mins ago',
        language: 'Malayalam (മലയാളം)',
        correspondent: 'Anjali Menon (Wayanad Bureau)',
        verificationWeight: 22,
        isLiveBroadcast: false
      }
    ],
    verificationFactors: [
      { factor: 'GSI Slope Instability Engine', score: 40, status: 'confirmed', description: 'Soil saturation index exceeded threshold by 310%.' },
      { factor: 'NDRF Base Command Dispatch', score: 35, status: 'confirmed', description: '3 NDRF battalions deployed for search and rescue operations.' },
      { factor: 'Regional Broadcast Field Corroboration', score: 28, status: 'confirmed', description: 'Live video dispatch from Asianet News & Manorama News confirms bridge washout.' },
      { factor: 'Verified Rescue Calls', score: 21, status: 'confirmed', description: 'Direct helpline logs from emergency services.' }
    ],
    whatWeKnow: [
      'Chooralmala bridge compromised; temporary Bailey bridge construction initiated by Indian Army.',
      'Relief camps established in 4 higher-altitude higher secondary schools.',
      'Helicopter airlifts standby at Sulthan Bathery air strip.'
    ],
    riskFactors: [
      { factor: 'Saturated Soil & Unstable Slopes', impact: 'High risk of secondary slope failures along Meppadi road' }
    ],
    officialWarnings: [
      'Kerala SDMA: Extreme Danger Zone. Evacuate all riverside and hill-slope dwellings in Vythiri & Meppadi Panchayat.'
    ],
    systemRecommendations: [
      'Evacuate immediately along marked uphill safe routes to designated relief shelters.',
      'Listen for sudden rumbling noises or cracking trees which signal imminent earth movement.'
    ]
  },

  // 3. Mumbai (Maharashtra)
  {
    id: 'EVT-MAH-2026-03',
    type: 'heavy_rain',
    title: 'High Tide & Extreme Monsoon Rain Inundation',
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
    startedAt: '2026-08-15T06:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    rainfallMm: 110,
    affectedPopulationEstimate: 350000,
    trend: 'stable',
    verificationStatus: 'CORROBORATED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[3], MOCK_DATA_SOURCES[7]],
    verificationFactors: [
      { factor: 'IMD Mumbai Radar Observation', score: 50, status: 'confirmed', description: 'Doppler weather radar shows dense rain bands moving inland.' },
      { factor: 'INCOIS High Wave & Tide Warning', score: 38, status: 'confirmed', description: 'Astronomical high tide peaking at 4.52m.' }
    ],
    whatWeKnow: [
      'Local train services running with 15-minute delays on Central Line.',
      'High tide peak at 14:15 IST has receded, allowing sluice gates to drain stormwater.'
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

  // 4. Chennai (Tamil Nadu)
  {
    id: 'EVT-TN-2026-04',
    type: 'cyclone',
    title: 'Severe Cyclonic Storm Alert (Bay of Bengal)',
    description: 'Deep cyclonic system intensifying with sustained surface winds of 85-95 km/h gusting to 105 km/h approaching North Tamil Nadu coast.',
    severity: 'high',
    confidenceScore: 94,
    status: 'active',
    lat: 13.0827,
    lng: 80.2707,
    locationName: 'Coastal Chennai & Ennore Port',
    district: 'Chennai',
    state: 'Tamil Nadu',
    affectedRadiusKm: 45,
    startedAt: '2026-08-14T18:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    rainfallMm: 130,
    affectedPopulationEstimate: 500000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[3]],
    verificationFactors: [
      { factor: 'IMD Cyclone Warning Bulletin', score: 60, status: 'confirmed', description: 'Track projection confirms landfall between Puducherry and Nellore.' },
      { factor: 'INCOIS Coastal Wave Sensors', score: 34, status: 'confirmed', description: 'Rough to very rough sea conditions (4.2m swell waves).' }
    ],
    whatWeKnow: [
      'Fishermen warning strictly enforced; all ocean vessels anchored.',
      '120 cyclone relief shelters activated with standby food and medical reserves.'
    ],
    riskFactors: [
      { factor: 'Storm Surge & High Gale Winds', impact: 'Risk of structural damage to temporary roofs and coastal flooding.' }
    ],
    officialWarnings: [
      'Tamil Nadu SDMA: Red Alert. Residents within 2km of coastline advised to relocate to Cyclone Relief Centres.'
    ],
    systemRecommendations: [
      'Board up glass windows and secure loose outdoor objects.',
      'Stock emergency drinking water, dry rations, and battery flashlights.'
    ]
  },

  // 5. New Delhi (Delhi)
  {
    id: 'EVT-DEL-2026-05',
    type: 'flood',
    title: 'Yamuna River Surging Past Warning Mark',
    description: 'Upstream water release from Hathnikund Barrage causing Yamuna water levels to cross danger mark of 205.33 meters.',
    severity: 'moderate',
    confidenceScore: 89,
    status: 'active',
    lat: 28.6139,
    lng: 77.2090,
    locationName: 'Yamuna Floodplains & Ring Road',
    district: 'New Delhi',
    state: 'Delhi',
    affectedRadiusKm: 18,
    startedAt: '2026-08-14T12:00:00Z',
    updatedAt: '2026-08-15T11:45:00Z',
    affectedPopulationEstimate: 45000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[1], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[4]],
    verificationFactors: [
      { factor: 'CWC Delhi Flood Forecast Station', score: 55, status: 'confirmed', description: 'Old Railway Bridge gauge measuring 205.85m (0.52m above danger level).' },
      { factor: 'ISRO Bhuvan Satellite Inundation Mask', score: 34, status: 'confirmed', description: 'Monitored inundation in floodplain farmland zones.' }
    ],
    whatWeKnow: [
      'Precautionary evacuation of 12,000 residents living in low-lying huts in Yamuna Khadar initiated.',
      'DND Flyway and Ring Road vehicular flow maintained with traffic police monitors.'
    ],
    riskFactors: [
      { factor: 'Continued Upstream Discharge', impact: 'Additional water flow expected over the next 18 hours.' }
    ],
    officialWarnings: [
      'Delhi SDMA: Citizens instructed not to visit Yamuna Ghats or venture into riverbanks.'
    ],
    systemRecommendations: [
      'Follow police diversion routes if traveling along the Ring Road corridor.'
    ]
  },

  // 6. Guwahati (Assam)
  {
    id: 'EVT-ASM-2026-06',
    type: 'flood',
    title: 'Brahmaputra River Inundation Wave',
    description: 'Catastrophic riverine flooding across Brahmaputra valley following continuous upper-catchment monsoon rains.',
    severity: 'critical',
    confidenceScore: 97,
    status: 'active',
    lat: 26.1445,
    lng: 91.7362,
    locationName: 'Guwahati Urban & Kamrup Lowlands',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    affectedRadiusKm: 35,
    startedAt: '2026-08-13T06:00:00Z',
    updatedAt: '2026-08-15T12:10:00Z',
    rainfallMm: 210,
    affectedPopulationEstimate: 280000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[1], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[4], MOCK_DATA_SOURCES[8]],
    verificationFactors: [
      { factor: 'CWC Gauge Station (Dhubri & Guwahati)', score: 45, status: 'confirmed', description: 'River flowing 1.25m above highest flood level in vulnerable embankments.' },
      { factor: 'ISRO Bhuvan Satellite Flood Extent Map', score: 35, status: 'confirmed', description: 'Wide-area inundation detected across 6 districts.' },
      { factor: 'NDRF Rapid Response Deployment', score: 17, status: 'confirmed', description: '12 inflatable boat units operating in rescue mode.' }
    ],
    whatWeKnow: [
      'Over 40 villages in lower Kamrup submerged under 4-6 ft water.',
      'Ferry services on the Brahmaputra completely suspended.',
      'Kaziranga wildlife migration corridors activated across NH-715.'
    ],
    riskFactors: [
      { factor: 'River Embankment Erosion', impact: 'High risk of levee breach in western Kamrup district.' }
    ],
    officialWarnings: [
      'ASDMA Warning: Red Alert for 14 districts. Move livestock and families to high-ground relief camps.'
    ],
    systemRecommendations: [
      'Do not attempt to wade or drive through flowing floodwaters.',
      'Purify drinking water using halogen tablets provided at relief outposts.'
    ]
  },

  // 7. Puri / Bhubaneswar (Odisha)
  {
    id: 'EVT-ODI-2026-07',
    type: 'cyclone',
    title: 'Very Severe Cyclonic Storm Landfall Watch',
    description: 'Powerful cyclonic vortex moving northwestward over West-Central Bay of Bengal with storm gusts up to 130 km/h and 3m storm surge.',
    severity: 'critical',
    confidenceScore: 98,
    status: 'active',
    lat: 19.8135,
    lng: 85.8312,
    locationName: 'Puri Coastal Sector & Grand Road',
    district: 'Puri',
    state: 'Odisha',
    affectedRadiusKm: 50,
    startedAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-15T12:05:00Z',
    rainfallMm: 195,
    affectedPopulationEstimate: 420000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[3], MOCK_DATA_SOURCES[8]],
    verificationFactors: [
      { factor: 'IMD Doppler Radar Paradip & Gopalpur', score: 50, status: 'confirmed', description: 'Eye of cyclonic system tracked 180 km south-southeast of Puri.' },
      { factor: 'INCOIS Storm Surge & Wave Model', score: 30, status: 'confirmed', description: 'Peak 3.2m sea surge projected during high tide landfall.' },
      { factor: 'ODRAF & NDRF Pre-positioning', score: 18, status: 'confirmed', description: '18 specialized ODRAF disaster units deployed in Puri & Ganjam.' }
    ],
    whatWeKnow: [
      'Over 250,000 citizens evacuated from within 5km coastal belt to Multi-Purpose Cyclone Shelters (MCS).',
      'Puri sea beach barricaded and access prohibited.'
    ],
    riskFactors: [
      { factor: 'Extreme Gale Wind & Surge Inundation', impact: 'Uprooting of telecom towers and tree obstructions.' }
    ],
    officialWarnings: [
      'OSDMA Directives: Cyclone Alert Stage-3 (Orange). Stay indoors in reinforced concrete buildings.'
    ],
    systemRecommendations: [
      'Disconnect power inverters before storm peak to avoid surges.',
      'Keep battery-operated emergency radios tuned to All India Radio 102.8 MHz.'
    ]
  },

  // 8. Joshimath / Chamoli (Uttarakhand)
  {
    id: 'EVT-UK-2026-08',
    type: 'landslide',
    title: 'Himalayan Glacial Stream Spate & Slope Subsidence',
    description: 'High-altitude cloudburst and rapid glacial moraine drainage causing flash surge in Dhauliganga river and active rockfall along NH-7.',
    severity: 'critical',
    confidenceScore: 95,
    status: 'active',
    lat: 30.5574,
    lng: 79.5668,
    locationName: 'Joshimath / Helang Valley',
    district: 'Chamoli',
    state: 'Uttarakhand',
    affectedRadiusKm: 12,
    startedAt: '2026-08-15T04:00:00Z',
    updatedAt: '2026-08-15T12:12:00Z',
    rainfallMm: 160,
    affectedPopulationEstimate: 18000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[4], MOCK_DATA_SOURCES[6], MOCK_DATA_SOURCES[8]],
    verificationFactors: [
      { factor: 'ISRO Bhuvan Himalayan Glacial Radar', score: 45, status: 'confirmed', description: 'Sudden moraine dam drainage identified in upper Nanda Devi catchment.' },
      { factor: 'GSI Geotechnical Sensors', score: 35, status: 'confirmed', description: 'Crustal displacement rate exceeding 15mm/hr on active scarp slopes.' },
      { factor: 'SDRF Emergency Unit Logs', score: 15, status: 'confirmed', description: 'Search and rescue teams mobilized along Alaknanda bank.' }
    ],
    whatWeKnow: [
      'Badrinath National Highway (NH-7) blocked at Helang and Gulabkoti due to heavy boulder debris.',
      'SDRF has relocated 350 residents from Sunil and Manohar Bagh wards.'
    ],
    riskFactors: [
      { factor: 'Secondary Damming by Landslide Debris', impact: 'Risk of sudden outburst surge downstream toward Pipalkoti.' }
    ],
    officialWarnings: [
      'Uttarakhand SDMA: Red Alert for Chamoli & Rudraprayag. All pilgrimage movement paused until road clearance.'
    ],
    systemRecommendations: [
      'Do not linger near vertical cliffs or steep gorge roads.',
      'Report any newly appearing cracks in ground or residential masonry immediately.'
    ]
  },

  // 9. Kolkata / Sundarbans (West Bengal)
  {
    id: 'EVT-WB-2026-09',
    type: 'flood',
    title: 'Estuarine Tidal Surge & River Embankment Breaches',
    description: 'Full moon spring tide combined with monsoon low pressure causing Matla and Hooghly rivers to overtop coastal mud embankments.',
    severity: 'high',
    confidenceScore: 91,
    status: 'active',
    lat: 22.5726,
    lng: 88.3639,
    locationName: 'Sundarbans Delta & South Kolkata',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    affectedRadiusKm: 30,
    startedAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-15T11:50:00Z',
    rainfallMm: 125,
    affectedPopulationEstimate: 320000,
    trend: 'stable',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[1], MOCK_DATA_SOURCES[3], MOCK_DATA_SOURCES[4]],
    verificationFactors: [
      { factor: 'CWC & Irrigation Dept River Level Alerts', score: 50, status: 'confirmed', description: 'Matla river overtopped 3 embankments in Gosaba block.' },
      { factor: 'INCOIS Estuarine Tide Alert', score: 41, status: 'confirmed', description: 'Tidal level reached 5.8m in Hooghly estuary.' }
    ],
    whatWeKnow: [
      'Paddy fields and freshwater ponds in 12 delta villages flooded with saline water.',
      'Civil defense personnel carrying out emergency sandbagging at Kultali and Hingalganj.'
    ],
    riskFactors: [
      { factor: 'Saline Water Infiltration', impact: 'Destruction of local drinking water wells.' }
    ],
    officialWarnings: [
      'West Bengal Disaster Management: Keep livestock in elevated flood shelters. Drink boiled or bottled water only.'
    ],
    systemRecommendations: [
      'Store clean drinking water before saline inundation affects tap connections.'
    ]
  },

  // 10. Shimla / Mandi (Himachal Pradesh)
  {
    id: 'EVT-HP-2026-10',
    type: 'heavy_rain',
    title: 'Cloudburst & Flash Flood in Beas / Sutlej Catchment',
    description: 'Localized intense cloudburst depositing 95mm rain in 60 minutes causing torrential mudflows and road washouts in Mandi and Shimla districts.',
    severity: 'critical',
    confidenceScore: 94,
    status: 'active',
    lat: 31.1048,
    lng: 77.1734,
    locationName: 'Shimla Ridge & Beas River Basin',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    affectedRadiusKm: 18,
    startedAt: '2026-08-15T05:30:00Z',
    updatedAt: '2026-08-15T12:08:00Z',
    rainfallMm: 175,
    affectedPopulationEstimate: 65000,
    trend: 'worsening',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[6], MOCK_DATA_SOURCES[7]],
    verificationFactors: [
      { factor: 'IMD Kufri Radar Cloudburst Echo', score: 50, status: 'confirmed', description: 'Intense localized reflectivity exceeding 55 dBZ detected.' },
      { factor: 'HP State Emergency Operations Center', score: 44, status: 'confirmed', description: 'Flash flood alert triggered across 4 mountain valleys.' }
    ],
    whatWeKnow: [
      'Chandigarh-Manali Highway (NH-21) closed at Pandoh due to surging river waters.',
      'SDRF and local volunteers have safely rescued 140 tourists from campsite areas.'
    ],
    riskFactors: [
      { factor: 'Narrow Mountain Gorges', impact: 'Flash floods rise exponentially within minutes without warning.' }
    ],
    officialWarnings: [
      'HP SDMA: Absolute travel advisory. Avoid camping near riverbanks or taking night journeys in hills.'
    ],
    systemRecommendations: [
      'Move uphill away from riverbeds immediately upon hearing rushing water.'
    ]
  },

  // 11. Patna (Bihar)
  {
    id: 'EVT-BIH-2026-11',
    type: 'flood',
    title: 'Ganga & Kosi River Inundation Wave',
    description: 'Ganga river flowing 85cm above danger mark at Digha Ghat and Gandhi Ghat following high volume releases from Nepal catchments.',
    severity: 'high',
    confidenceScore: 93,
    status: 'active',
    lat: 25.5941,
    lng: 85.1376,
    locationName: 'Patna Ghats & Raghopur Diara',
    district: 'Patna',
    state: 'Bihar',
    affectedRadiusKm: 25,
    startedAt: '2026-08-13T14:00:00Z',
    updatedAt: '2026-08-15T11:40:00Z',
    affectedPopulationEstimate: 210000,
    trend: 'stable',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[1], MOCK_DATA_SOURCES[2], MOCK_DATA_SOURCES[4]],
    verificationFactors: [
      { factor: 'CWC Middle Ganga Forecast Division', score: 55, status: 'confirmed', description: 'Water level measured at 50.37m at Gandhi Ghat (Danger Level 49.60m).' },
      { factor: 'SDRF Patrol Telemetry', score: 38, status: 'confirmed', description: '15 motorboats active in Diara island evacuation.' }
    ],
    whatWeKnow: [
      'Diara island settlements surrounded by water; emergency food packets dropped via SDRF boats.',
      'Patna city drainage pumps operating at full capacity to prevent backflow from Ganga drains.'
    ],
    riskFactors: [
      { factor: 'Prolonged High River Stage', impact: 'Weakening of rural earthen ring bunds.' }
    ],
    officialWarnings: [
      'Bihar SDMA: Do not attempt to cross flooded causeways or take small non-motorized boats in strong river currents.'
    ],
    systemRecommendations: [
      'Keep valuable documents and dry rations in waterproof bags.'
    ]
  },

  // 12. Jaipur (Rajasthan)
  {
    id: 'EVT-RAJ-2026-12',
    type: 'heatwave',
    title: 'Severe Heatwave Alert (47.2°C Recorded)',
    description: 'Blistering summer heatwave with daytime dry winds (Loo) exceeding 45°C for the 4th consecutive day across North-West India.',
    severity: 'high',
    confidenceScore: 96,
    status: 'active',
    lat: 26.9124,
    lng: 75.7873,
    locationName: 'Jaipur Urban & Sanganer',
    district: 'Jaipur',
    state: 'Rajasthan',
    affectedRadiusKm: 30,
    startedAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    affectedPopulationEstimate: 600000,
    trend: 'stable',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[0], MOCK_DATA_SOURCES[2]],
    verificationFactors: [
      { factor: 'IMD Automatic Weather Station (Jaipur Airport)', score: 60, status: 'confirmed', description: 'Maximum temperature recorded 47.2°C (5.4°C above seasonal normal).' },
      { factor: 'Department of Health & Family Welfare', score: 36, status: 'confirmed', description: 'Heat stroke emergency wards activated across all district hospitals.' }
    ],
    whatWeKnow: [
      'Afternoon outdoor labor suspended between 12:00 PM and 4:00 PM under state labor advisory.',
      'Public water distribution kiosks (Piyau) established at 85 busy intersections.'
    ],
    riskFactors: [
      { factor: 'Extreme Dehydration & Sunstroke', impact: 'Vulnerable demographics (elderly, children, outdoor workers) at severe risk.' }
    ],
    officialWarnings: [
      'Rajasthan SDMA: Red Heat Warning. Avoid direct sun exposure between 11:30 AM and 4:30 PM. Drink ORS/water regularly.'
    ],
    systemRecommendations: [
      'Wear light-colored loose cotton clothing and cover head when outdoors.',
      'Never leave children or pets inside parked vehicles even for a few minutes.'
    ]
  },

  // 13. Port Blair (Andaman & Nicobar)
  {
    id: 'EVT-AND-2026-13',
    type: 'earthquake',
    title: 'Undersea Magnitude 6.4 Seismic Shock & Tsunami Watch',
    description: 'Subduction zone earthquake of Magnitude 6.4 recorded at depth of 15 km in Andaman Sea. INCOIS Tsunami Early Warning system activated.',
    severity: 'critical',
    confidenceScore: 99,
    status: 'active',
    lat: 11.6234,
    lng: 92.7265,
    locationName: 'Port Blair & South Andaman Coast',
    district: 'South Andaman',
    state: 'Andaman & Nicobar',
    affectedRadiusKm: 60,
    startedAt: '2026-08-15T09:15:00Z',
    updatedAt: '2026-08-15T12:18:00Z',
    affectedPopulationEstimate: 110000,
    trend: 'stable',
    verificationStatus: 'VERIFIED',
    sources: [MOCK_DATA_SOURCES[3], MOCK_DATA_SOURCES[5], MOCK_DATA_SOURCES[8]],
    verificationFactors: [
      { factor: 'NCS Real-time Seismic Array', score: 50, status: 'confirmed', description: 'M6.4 earthquake epicenter located 85 km East-Northeast of Port Blair.' },
      { factor: 'INCOIS National Tsunami Early Warning Centre', score: 49, status: 'confirmed', description: 'Tsunami Threat Status: WATCH. Wave height projections < 0.8m.' }
    ],
    whatWeKnow: [
      'Strong tremors felt across Port Blair, Havelock, and Neil islands; no structural collapse reported.',
      'Coastal siren systems sounded as precautionary notification.'
    ],
    riskFactors: [
      { factor: 'Seismic Aftershocks', impact: 'Moderate aftershocks (M4.5-5.2) expected in the next 24 hours.' }
    ],
    officialWarnings: [
      'Andaman & Nicobar Disaster Management: Tsunami Watch in effect. Stay away from coastal beaches and low-lying harbor quays.'
    ],
    systemRecommendations: [
      'If you feel strong ground shaking along the coast, move immediately inland to higher ground without waiting for official siren.'
    ]
  }
];

export const MOCK_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'REP-2026-101',
    userName: 'Vikram Mehta (Field Citizen)',
    type: 'flood',
    description: 'Akhbarnagar underpass completely submerged. Two cars stranded in 3.5 ft water. Traffic police on scene rerouting vehicles.',
    lat: 23.0512,
    lng: 72.5621,
    locationName: 'Akhbarnagar Underpass, Ahmedabad',
    verificationStatus: 'VERIFIED',
    confidenceScore: 95,
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-15T11:00:00Z',
    upvotes: 24,
    evidenceNotes: 'Geotagged image confirms water depth reaching car headlights.'
  },
  {
    id: 'REP-2026-102',
    userName: 'Pooja Shah (Citizen)',
    type: 'flood',
    description: 'Severe waterlogging near Mithakhali six roads. Basement parking of commercial complexes flooded.',
    lat: 23.0298,
    lng: 72.5580,
    locationName: 'Mithakhali, Ahmedabad',
    verificationStatus: 'CORROBORATED',
    confidenceScore: 82,
    createdAt: '2026-08-15T09:45:00Z',
    updatedAt: '2026-08-15T10:15:00Z',
    upvotes: 16
  },
  {
    id: 'REP-2026-103',
    userName: 'Shaji Mathew (Panchayat Volunteer)',
    type: 'landslide',
    description: 'Massive landslide blocking Meppadi-Chooralmala road near school junction. Mudflow 5 ft deep.',
    lat: 11.5540,
    lng: 76.1280,
    locationName: 'Chooralmala Junction, Wayanad',
    verificationStatus: 'VERIFIED',
    confidenceScore: 98,
    createdAt: '2026-08-15T03:15:00Z',
    updatedAt: '2026-08-15T04:00:00Z',
    upvotes: 38,
    evidenceNotes: 'Corroborated by Kerala Police control room and SDRF unit.'
  },
  {
    id: 'REP-2026-104',
    userName: 'Debojit Sarma (Local Scout)',
    type: 'flood',
    description: 'Brahmaputra water entered residential lanes in Bharalumukh. Water level rising fast.',
    lat: 26.1730,
    lng: 91.7310,
    locationName: 'Bharalumukh, Guwahati',
    verificationStatus: 'CORROBORATED',
    confidenceScore: 85,
    createdAt: '2026-08-15T08:20:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
    upvotes: 19
  },
  {
    id: 'REP-2026-105',
    userName: 'Subhashish Rout (Civil Defense)',
    type: 'cyclone',
    description: 'Gale winds uprooted 4 massive banyan trees near Sea Beach Road. Power lines snapped.',
    lat: 19.8020,
    lng: 85.8240,
    locationName: 'Sea Beach Road, Puri',
    verificationStatus: 'VERIFIED',
    confidenceScore: 96,
    createdAt: '2026-08-15T11:10:00Z',
    updatedAt: '2026-08-15T11:45:00Z',
    upvotes: 29
  },
  {
    id: 'REP-2026-106',
    userName: 'Rameshwar Rawat (Mountain Guide)',
    type: 'landslide',
    description: 'Continuous rockfall on NH-7 near Helang. Large boulders blocking both lanes.',
    lat: 30.5420,
    lng: 79.5480,
    locationName: 'Helang Bend, Chamoli',
    verificationStatus: 'VERIFIED',
    confidenceScore: 94,
    createdAt: '2026-08-15T06:30:00Z',
    updatedAt: '2026-08-15T07:15:00Z',
    upvotes: 21
  }
];

export const MOCK_RELIEF_RESOURCES: ReliefResource[] = [
  // Ahmedabad Resources
  {
    id: 'RES-GUJ-01',
    name: 'SVP Emergency Trauma & Disaster Hospital',
    type: 'hospital',
    lat: 23.0180,
    lng: 72.5780,
    address: 'Ellis Bridge, Riverfront West, Ahmedabad, Gujarat 380006',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '079-26577621',
    capacity: '250 Emergency Beds, 14 Ventilators',
    status: 'open',
    source: 'Department of Health, Gujarat',
    updatedAt: '15 mins ago',
    distanceKm: 2.1,
    availableBedsOrKits: 48
  },
  {
    id: 'RES-GUJ-02',
    name: 'Gujarat College Multi-Purpose Relief Shelter',
    type: 'shelter',
    lat: 23.0230,
    lng: 72.5690,
    address: 'Ellisbridge Road, Ahmedabad, Gujarat 380006',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '1077 (District Toll-free)',
    capacity: 'Capacity for 800 Persons',
    status: 'open',
    source: 'Ahmedabad Municipal Corporation (AMC)',
    updatedAt: '25 mins ago',
    distanceKm: 1.4,
    availableBedsOrKits: 320
  },
  {
    id: 'RES-GUJ-03',
    name: 'AMC Disaster Management Central Outpost',
    type: 'relief_centre',
    lat: 23.0300,
    lng: 72.5800,
    address: 'Usmanpura Municipal Office, Ashram Road, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '079-27551581',
    capacity: 'Drinking Water Kiosks, 2000 Food Packets Ready',
    status: 'open',
    source: 'AMC Relief Wing',
    updatedAt: '10 mins ago',
    distanceKm: 3.0,
    availableBedsOrKits: 1450
  },
  {
    id: 'RES-GUJ-04',
    name: 'Navrangpura Emergency Police Assistance Post',
    type: 'police',
    lat: 23.0360,
    lng: 72.5600,
    address: 'Near Swastik Cross Roads, Navrangpura, Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    phone: '112 / 079-26402422',
    status: 'open',
    source: 'Ahmedabad City Police',
    updatedAt: '5 mins ago',
    distanceKm: 1.8
  },

  // Wayanad Resources
  {
    id: 'RES-KER-01',
    name: 'NDRF 4th Battalion Base Camp Wayanad',
    type: 'relief_centre',
    lat: 11.6890,
    lng: 76.1380,
    address: 'St. Joseph Higher Secondary School Grounds, Meppadi, Wayanad',
    district: 'Wayanad',
    state: 'Kerala',
    phone: '1078 / 04936-204151',
    capacity: '120 NDRF Specialists, 8 Hydraulic Cutters',
    status: 'open',
    source: 'NDRF HQ',
    updatedAt: '5 mins ago',
    distanceKm: 1.2
  },
  {
    id: 'RES-KER-02',
    name: 'Wayanad District General Hospital',
    type: 'hospital',
    lat: 11.6110,
    lng: 76.0820,
    address: 'Kainatty, Kalpetta, Wayanad, Kerala 673122',
    district: 'Wayanad',
    state: 'Kerala',
    phone: '04936-202245',
    capacity: '300 Beds, Emergency Blood Bank Active',
    status: 'busy',
    source: 'Kerala Health Services',
    updatedAt: '10 mins ago',
    distanceKm: 8.5,
    availableBedsOrKits: 22
  },

  // Mumbai Resources
  {
    id: 'RES-MAH-01',
    name: 'KEM Hospital & Disaster Triage Center',
    type: 'hospital',
    lat: 19.0020,
    lng: 72.8420,
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    district: 'Mumbai City',
    state: 'Maharashtra',
    phone: '022-24107000 / 108',
    capacity: '400 Emergency Beds',
    status: 'open',
    source: 'BMC Public Health Dept',
    updatedAt: '12 mins ago',
    distanceKm: 3.5,
    availableBedsOrKits: 65
  },

  // Puri / Odisha Resources
  {
    id: 'RES-ODI-01',
    name: 'Multi-Purpose Cyclone Shelter #12 (MCS)',
    type: 'shelter',
    lat: 19.8100,
    lng: 85.8200,
    address: 'Near Balagandi Chhak, Grand Road, Puri, Odisha',
    district: 'Puri',
    state: 'Odisha',
    phone: '1070 (State Control Room) / 06752-223230',
    capacity: 'Capacity 1200 Persons, Solar Inverters Active',
    status: 'open',
    source: 'Odisha State Disaster Management Authority (OSDMA)',
    updatedAt: '8 mins ago',
    distanceKm: 1.1,
    availableBedsOrKits: 450
  },
  {
    id: 'RES-ODI-02',
    name: 'Puri District Headquarter Hospital (DHH)',
    type: 'hospital',
    lat: 19.8180,
    lng: 85.8340,
    address: 'Hospital Square, Puri, Odisha 752001',
    district: 'Puri',
    state: 'Odisha',
    phone: '06752-222046',
    capacity: '180 Beds with Backup Generators',
    status: 'open',
    source: 'Odisha Health Dept',
    updatedAt: '15 mins ago',
    distanceKm: 1.8,
    availableBedsOrKits: 38
  },

  // Chamoli / Uttarakhand Resources
  {
    id: 'RES-UK-01',
    name: 'SDRF High-Altitude Search & Rescue Post',
    type: 'fire_station',
    lat: 30.5520,
    lng: 79.5620,
    address: 'Helang Base, Joshimath, Chamoli, Uttarakhand',
    district: 'Chamoli',
    state: 'Uttarakhand',
    phone: '1070 / 01372-251437',
    capacity: '40 Mountain Rescue Personnel, 4 Sniffer Dogs',
    status: 'open',
    source: 'Uttarakhand SDRF',
    updatedAt: '5 mins ago',
    distanceKm: 2.0
  },

  // Guwahati / Assam Resources
  {
    id: 'RES-ASM-01',
    name: 'Gauhati Medical College & Hospital (GMCH)',
    type: 'hospital',
    lat: 26.1550,
    lng: 91.7700,
    address: 'Narakasur Hilltop, Bhangagarh, Guwahati, Assam 781032',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    phone: '0361-2130230 / 108',
    capacity: '500 Flood Emergency Ward Beds',
    status: 'open',
    source: 'Assam Health Services',
    updatedAt: '10 mins ago',
    distanceKm: 4.2,
    availableBedsOrKits: 90
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-2026-01',
    eventId: 'EVT-GUJ-2026-01',
    severity: 'high',
    title: 'RED ALERT: Severe Waterlogging in Ahmedabad West & Central',
    message: 'Continuous torrential rains causing severe waterlogging. Akhbarnagar and Mithakhali underpasses are fully submerged and closed.',
    locationName: 'Ahmedabad, Gujarat',
    createdAt: '2026-08-15T11:30:00Z',
    read: false,
    type: 'flood',
    recommendedAction: 'Avoid low-lying underpasses and stay indoors. Move vehicles to higher elevation grounds.',
    source: 'Ahmedabad Municipal Corporation / IMD'
  },
  {
    id: 'ALT-2026-02',
    eventId: 'EVT-KER-2026-02',
    severity: 'critical',
    title: 'EVACUATION NOTICE: Catastrophic Landslide Risk in Chooralmala',
    message: 'Soil saturation levels critical. Immediate evacuation order issued for residents in Meppadi, Chooralmala, and Vythiri hill slopes.',
    locationName: 'Wayanad, Kerala',
    createdAt: '2026-08-15T10:15:00Z',
    read: false,
    type: 'landslide',
    recommendedAction: 'Evacuate immediately to St. Joseph School relief camp or higher-altitude shelters.',
    source: 'Kerala SDMA & District Collector'
  },
  {
    id: 'ALT-2026-03',
    eventId: 'EVT-ODI-2026-07',
    severity: 'critical',
    title: 'CYCLONE STAGE-3 WARNING: Landfall Imminent along Odisha Coast',
    message: 'Severe Cyclonic Storm approaching Puri with gusts up to 130 km/h and 3.2m tidal surge. Complete movement ban along sea beaches.',
    locationName: 'Puri & Bhubaneswar, Odisha',
    createdAt: '2026-08-15T11:45:00Z',
    read: false,
    type: 'cyclone',
    recommendedAction: 'Stay inside reinforced Multi-Purpose Cyclone Shelters (MCS). Disconnect outdoor power connections.',
    source: 'IMD & OSDMA'
  },
  {
    id: 'ALT-2026-04',
    eventId: 'EVT-UK-2026-08',
    severity: 'critical',
    title: 'FLASH FLOOD & ROCKFALL: Badrinath NH-7 Blocked near Helang',
    message: 'Intense cloudburst causing rapid surge in Dhauliganga river and active rockfall on mountain roads. Highway closed.',
    locationName: 'Joshimath, Uttarakhand',
    createdAt: '2026-08-15T09:00:00Z',
    read: true,
    type: 'landslide',
    recommendedAction: 'Do not travel on mountain routes. Stay at authorized SDRF transit shelters.',
    source: 'Uttarakhand SDMA & District Administration'
  },
  {
    id: 'ALT-2026-05',
    eventId: 'EVT-RAJ-2026-12',
    severity: 'high',
    title: 'RED HEATWAVE WARNING: Temperature Crosses 47°C in Jaipur',
    message: 'Severe dry heatwave conditions prevailing with intense Loo winds. Extreme risk of heat stroke during afternoon peak hours.',
    locationName: 'Jaipur, Rajasthan',
    createdAt: '2026-08-15T08:30:00Z',
    read: true,
    type: 'heatwave',
    recommendedAction: 'Stay indoors between 11:30 AM and 4:30 PM. Drink plenty of water and ORS electrolytes.',
    source: 'IMD Jaipur & Department of Health'
  },
  {
    id: 'ALT-2026-06',
    eventId: 'EVT-AND-2026-13',
    severity: 'critical',
    title: 'TSUNAMI WATCH: Magnitude 6.4 Earthquake in Andaman Sea',
    message: 'Undersea earthquake of M6.4 recorded 85 km East of Port Blair. Tsunami Watch issued for Andaman coastal line.',
    locationName: 'Port Blair, Andaman & Nicobar',
    createdAt: '2026-08-15T09:20:00Z',
    read: true,
    type: 'earthquake',
    recommendedAction: 'Stay away from beaches and coastal ports. Keep emergency radios active.',
    source: 'INCOIS National Tsunami Early Warning Centre'
  }
];

export const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'REC-01',
    disasterType: 'flood',
    severity: 'critical',
    title: 'Seek Immediate Elevated Ground Shelter',
    description: 'If water levels rise above ankle height inside residential quarters, move to the top floor or designated reinforced multi-story shelters.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-02',
    disasterType: 'flood',
    severity: 'high',
    title: 'Electrical De-energization Protocol',
    description: 'Turn off the main electrical circuit breaker immediately if floodwaters approach electrical wall plugs or appliances.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-03',
    disasterType: 'landslide',
    severity: 'critical',
    title: 'Immediate Uphill Evacuation',
    description: 'Leave hillside structures immediately when warning sirens sound. Do not stop to retrieve heavy baggage.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-04',
    disasterType: 'cyclone',
    severity: 'critical',
    title: 'Window Shuttering & Concrete Bunker Shelter',
    description: 'Remain inside reinforced concrete structures. Stay away from glass windows and tin roofs.',
    priority: 'urgent',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  },
  {
    id: 'REC-05',
    disasterType: 'heatwave',
    severity: 'high',
    title: 'ORS Rehydration & Sun Avoidance',
    description: 'Drink water with oral rehydration salts (ORS) frequently. Never leave children or vulnerable individuals inside parked cars.',
    priority: 'important',
    sourceCategory: 'Official Guidance (NDMA/SDMA)',
    isOfficial: true
  }
];
