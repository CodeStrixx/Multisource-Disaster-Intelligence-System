"""Seed curated datasets so the demo works even before first live ingestion.

Mirrors the frontend's saved locations, source registry, relief resources and
recommendation library (single source of truth for the SIH demo).
"""
from __future__ import annotations

import json
from datetime import timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import (
    Alert,
    DataSource,
    GovernmentScheme,
    Incident,
    IncidentEvidence,
    IncidentStatusHistory,
    Recommendation,
    Resource,
    RiskAssessment,
    utcnow,
)
from .models import (
    Alert,
    DataSource,
    EmergencyContact,
    GovernmentScheme,
    Incident,
    IncidentEvidence,
    IncidentStatusHistory,
    Recommendation,
    Resource,
    RiskAssessment,
    utcnow,
)
from .scheme_data import SEED_SCHEMES

# ---------------------------------------------------------------------------
# National emergency helplines (official India numbers; tap-to-call on frontend)
# ---------------------------------------------------------------------------
SEED_EMERGENCY_CONTACTS: list[dict[str, Any]] = [
    {"name": "National Emergency Helpline (Police / Fire / Medical)", "category": "EMERGENCY",
     "phone_number": "112", "sort_order": 1,
     "description": "Single all-in-one emergency number across India — connects to police, fire and ambulance."},
    {"name": "Police Control Room", "category": "POLICE",
     "phone_number": "100", "sort_order": 2,
     "description": "Immediate police assistance, law-and-order emergencies."},
    {"name": "Fire & Rescue Services", "category": "FIRE",
     "phone_number": "101", "sort_order": 3,
     "description": "Fire outbreaks, building collapse and rescue operations."},
    {"name": "Ambulance (Emergency Response Service)", "category": "MEDICAL",
     "phone_number": "108", "sort_order": 4,
     "description": "Free emergency ambulance and pre-hospital care."},
    {"name": "Medical / Patient Transport Helpline", "category": "MEDICAL",
     "phone_number": "102", "sort_order": 5,
     "description": "Patient transport and maternal health transport support."},
    {"name": "NDMA / NDRF Disaster Management Helpline", "category": "DISASTER",
     "phone_number": "1078", "sort_order": 6,
     "description": "Central disaster management control room for cyclone, flood, earthquake coordination."},
    {"name": "State Emergency Operations Centre", "category": "DISASTER",
     "phone_number": "1070", "sort_order": 7,
     "description": "State-level disaster warning, evacuation and relief coordination."},
    {"name": "District Disaster Management Control Room", "category": "DISASTER",
     "phone_number": "1077", "sort_order": 8,
     "description": "District collector's disaster cell — local evacuation and shelter information."},
    {"name": "Women Helpline (Emergency)", "category": "HELPLINE",
     "phone_number": "1091", "sort_order": 9,
     "description": "Distress alerts and police-assisted response for women."},
    {"name": "CHILDLINE (Child Welfare)", "category": "HELPLINE",
     "phone_number": "1098", "sort_order": 10,
     "description": "Emergency outreach for children in distress, including disaster-separated children."},
]

# ---------------------------------------------------------------------------
# Curated monitoring points (same as frontend saved locations)
# ---------------------------------------------------------------------------
MONITOR_LOCATIONS: list[dict[str, Any]] = [
    {"name": "Ahmedabad", "district": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    {"name": "Wayanad", "district": "Wayanad", "state": "Kerala", "lat": 11.6854, "lng": 76.1320},
    {"name": "Mumbai", "district": "Mumbai City", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777},
    {"name": "Chennai", "district": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    {"name": "New Delhi", "district": "New Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090},
    {"name": "Guwahati", "district": "Kamrup Metropolitan", "state": "Assam", "lat": 26.1445, "lng": 91.7362},
    {"name": "Puri / Bhubaneswar", "district": "Puri", "state": "Odisha", "lat": 19.8135, "lng": 85.8312},
    {"name": "Joshimath", "district": "Chamoli", "state": "Uttarakhand", "lat": 30.5574, "lng": 79.5668},
    {"name": "Kolkata / Sundarbans", "district": "South 24 Parganas", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    {"name": "Shimla / Mandi", "district": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lng": 77.1734},
    {"name": "Patna", "district": "Patna", "state": "Bihar", "lat": 25.5941, "lng": 85.1376},
    {"name": "Hyderabad", "district": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    {"name": "Bengaluru", "district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    {"name": "Jaipur", "district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    {"name": "Srinagar", "district": "Srinagar", "state": "Jammu & Kashmir", "lat": 34.0837, "lng": 74.7973},
    {"name": "Port Blair", "district": "South Andaman", "state": "Andaman & Nicobar", "lat": 11.6234, "lng": 92.7265},
    {"name": "Visakhapatnam", "district": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lng": 83.2185},
]

# ---------------------------------------------------------------------------
# Source registry (official agencies + live free providers used by adapters)
# ---------------------------------------------------------------------------
SEED_SOURCES: list[dict[str, Any]] = [
    {"provider_id": "imd", "name": "India Meteorological Department (IMD)", "type": "official", "reliability_score": 98},
    {"provider_id": "cwc", "name": "Central Water Commission (CWC)", "type": "official", "reliability_score": 96},
    {"provider_id": "ndma", "name": "National / State Disaster Management Authority (NDMA/SDMA)", "type": "official", "reliability_score": 99},
    {"provider_id": "incois", "name": "Indian National Centre for Ocean Info Services (INCOIS)", "type": "official", "reliability_score": 97},
    {"provider_id": "nrsc_bhuvan", "name": "NRSC / ISRO Bhuvan Disaster Services", "type": "official", "reliability_score": 98},
    {"provider_id": "ncs_seismo", "name": "National Centre for Seismology (NCS)", "type": "official", "reliability_score": 99},
    {"provider_id": "gsi_landslide", "name": "Geological Survey of India (GSI) Landslide Engine", "type": "official", "reliability_score": 95},
    {"provider_id": "citizen_sentinel", "name": "Corroborated Citizen Sentinel Network", "type": "corroborated", "reliability_score": 86},
    {"provider_id": "ndrf_ops", "name": "NDRF Base Command Operations Telemetry", "type": "official", "reliability_score": 99},
    # live provider adapters
    {"provider_id": "open_meteo", "name": "Open-Meteo Weather & Rainfall Feed", "type": "trusted", "reliability_score": 90},
    {"provider_id": "usgs_earthquake", "name": "USGS Earthquake Hazards Program", "type": "official", "reliability_score": 97},
]

# ---------------------------------------------------------------------------
# Relief resources (curated dataset per PRD Q2)
# ---------------------------------------------------------------------------
SEED_RESOURCES: list[dict[str, Any]] = [
    {"public_id": "RES-GUJ-01", "name": "SVP Emergency Trauma & Disaster Hospital", "type": "hospital",
     "latitude": 23.0180, "longitude": 72.5780, "address": "Ellis Bridge, Riverfront West, Ahmedabad, Gujarat 380006",
     "district": "Ahmedabad", "state": "Gujarat", "contact_number": "079-26577621",
     "capacity": "250 Emergency Beds, 14 Ventilators", "availability_status": "OPEN", "available_beds_or_kits": 48,
     "source_name": "Department of Health, Gujarat"},
    {"public_id": "RES-GUJ-02", "name": "Gujarat College Multi-Purpose Relief Shelter", "type": "shelter",
     "latitude": 23.0230, "longitude": 72.5690, "address": "Ellisbridge Road, Ahmedabad, Gujarat 380006",
     "district": "Ahmedabad", "state": "Gujarat", "contact_number": "1077 (District Toll-free)",
     "capacity": "Capacity for 800 Persons", "availability_status": "OPEN", "available_beds_or_kits": 320,
     "source_name": "Ahmedabad Municipal Corporation (AMC)"},
    {"public_id": "RES-GUJ-03", "name": "AMC Disaster Management Central Outpost", "type": "relief_centre",
     "latitude": 23.0300, "longitude": 72.5800, "address": "Usmanpura Municipal Office, Ashram Road, Ahmedabad",
     "district": "Ahmedabad", "state": "Gujarat", "contact_number": "079-27551581",
     "capacity": "Drinking Water Kiosks, 2000 Food Packets Ready", "availability_status": "OPEN",
     "available_beds_or_kits": 1450, "source_name": "AMC Relief Wing"},
    {"public_id": "RES-GUJ-04", "name": "Navrangpura Emergency Police Assistance Post", "type": "police",
     "latitude": 23.0360, "longitude": 72.5600, "address": "Near Swastik Cross Roads, Navrangpura, Ahmedabad",
     "district": "Ahmedabad", "state": "Gujarat", "contact_number": "112 / 079-26402422",
     "capacity": None, "availability_status": "OPEN", "available_beds_or_kits": None,
     "source_name": "Ahmedabad City Police"},
    {"public_id": "RES-KER-01", "name": "NDRF 4th Battalion Base Camp Wayanad", "type": "relief_centre",
     "latitude": 11.6890, "longitude": 76.1380, "address": "St. Joseph Higher Secondary School Grounds, Meppadi, Wayanad",
     "district": "Wayanad", "state": "Kerala", "contact_number": "1078 / 04936-204151",
     "capacity": "120 NDRF Specialists, 8 Hydraulic Cutters", "availability_status": "OPEN",
     "available_beds_or_kits": None, "source_name": "NDRF HQ"},
    {"public_id": "RES-KER-02", "name": "Wayanad District General Hospital", "type": "hospital",
     "latitude": 11.6110, "longitude": 76.0820, "address": "Kainatty, Kalpetta, Wayanad, Kerala 673122",
     "district": "Wayanad", "state": "Kerala", "contact_number": "04936-202245",
     "capacity": "300 Beds, Emergency Blood Bank Active", "availability_status": "LIMITED",
     "available_beds_or_kits": 22, "source_name": "Kerala Health Services"},
    {"public_id": "RES-MAH-01", "name": "KEM Hospital & Disaster Triage Center", "type": "hospital",
     "latitude": 19.0020, "longitude": 72.8420, "address": "Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012",
     "district": "Mumbai City", "state": "Maharashtra", "contact_number": "022-24107000 / 108",
     "capacity": "400 Emergency Beds", "availability_status": "OPEN", "available_beds_or_kits": 65,
     "source_name": "BMC Public Health Dept"},
    {"public_id": "RES-ODI-01", "name": "Multi-Purpose Cyclone Shelter #12 (MCS)", "type": "shelter",
     "latitude": 19.8100, "longitude": 85.8200, "address": "Near Balagandi Chhak, Grand Road, Puri, Odisha",
     "district": "Puri", "state": "Odisha", "contact_number": "1070 / 06752-223230",
     "capacity": "Capacity 1200 Persons, Solar Inverters Active", "availability_status": "OPEN",
     "available_beds_or_kits": 450, "source_name": "Odisha State Disaster Management Authority (OSDMA)"},
    {"public_id": "RES-ODI-02", "name": "Puri District Headquarter Hospital (DHH)", "type": "hospital",
     "latitude": 19.8180, "longitude": 85.8340, "address": "Hospital Square, Puri, Odisha 752001",
     "district": "Puri", "state": "Odisha", "contact_number": "06752-222046",
     "capacity": "180 Beds with Backup Generators", "availability_status": "OPEN", "available_beds_or_kits": 38,
     "source_name": "Odisha Health Dept"},
    {"public_id": "RES-UK-01", "name": "SDRF High-Altitude Search & Rescue Post", "type": "fire_station",
     "latitude": 30.5520, "longitude": 79.5620, "address": "Helang Base, Joshimath, Chamoli, Uttarakhand",
     "district": "Chamoli", "state": "Uttarakhand", "contact_number": "1070 / 01372-251437",
     "capacity": "40 Mountain Rescue Personnel, 4 Sniffer Dogs", "availability_status": "OPEN",
     "available_beds_or_kits": None, "source_name": "Uttarakhand SDRF"},
    {"public_id": "RES-ASM-01", "name": "Gauhati Medical College & Hospital (GMCH)", "type": "hospital",
     "latitude": 26.1550, "longitude": 91.7700, "address": "Narakasur Hilltop, Bhangagarh, Guwahati, Assam 781032",
     "district": "Kamrup Metropolitan", "state": "Assam", "contact_number": "0361-2130230 / 108",
     "capacity": "500 Flood Emergency Ward Beds", "availability_status": "OPEN", "available_beds_or_kits": 90,
     "source_name": "Assam Health Services"},
]

# ---------------------------------------------------------------------------
# Recommendation library keyed by disaster type (F9; official NDMA guidance first)
# ---------------------------------------------------------------------------
SEED_RECOMMENDATIONS: list[dict[str, Any]] = [
    {"disaster_type": "flood", "min_risk_level": "MODERATE", "priority": "important", "title": "Monitor Water Levels Near You",
     "instruction": "Keep track of local water levels and avoid basements or ground floors during peak rainfall.", "is_official": False},
    {"disaster_type": "flood", "min_risk_level": "HIGH", "priority": "urgent", "title": "Seek Immediate Elevated Ground Shelter",
     "instruction": "If water levels rise above ankle height inside residential quarters, move to the top floor or designated reinforced multi-story shelters.", "is_official": True},
    {"disaster_type": "flood", "min_risk_level": "HIGH", "priority": "urgent", "title": "Electrical De-energization Protocol",
     "instruction": "Turn off the main electrical circuit breaker immediately if floodwaters approach electrical wall plugs or appliances.", "is_official": True},
    {"disaster_type": "flood", "min_risk_level": "MODERATE", "priority": "advisory", "title": "Never Wade Through Flowing Water",
     "instruction": "Do not attempt to wade or drive through flowing floodwaters — 15 cm of moving water can knock down an adult.", "is_official": True},
    {"disaster_type": "heavy_rain", "min_risk_level": "MODERATE", "priority": "important", "title": "Avoid Waterlogged Underpasses",
     "instruction": "If driving, turn back immediately if water depth exceeds wheel height; avoid underpasses during intense showers.", "is_official": False},
    {"disaster_type": "heavy_rain", "min_risk_level": "HIGH", "priority": "urgent", "title": "Indoor Safety During Intense Rain",
     "instruction": "Stay indoors away from glass windows, unplug sensitive electronics, and keep emergency lighting ready.", "is_official": True},
    {"disaster_type": "landslide", "min_risk_level": "HIGH", "priority": "urgent", "title": "Immediate Uphill Evacuation",
     "instruction": "Leave hillside structures immediately when warning sirens sound. Do not stop to retrieve heavy baggage.", "is_official": True},
    {"disaster_type": "landslide", "min_risk_level": "MODERATE", "priority": "important", "title": "Watch For Slope Warning Signs",
     "instruction": "Listen for sudden rumbling noises or cracking trees which signal imminent earth movement; report new ground cracks.", "is_official": False},
    {"disaster_type": "cyclone", "min_risk_level": "HIGH", "priority": "urgent", "title": "Window Shuttering & Concrete Bunker Shelter",
     "instruction": "Remain inside reinforced concrete structures. Stay away from glass windows and tin roofs.", "is_official": True},
    {"disaster_type": "cyclone", "min_risk_level": "MODERATE", "priority": "important", "title": "Emergency Kit For Cyclone Season",
     "instruction": "Stock emergency drinking water, dry rations, and battery flashlights; secure loose outdoor objects before landfall.", "is_official": False},
    {"disaster_type": "earthquake", "min_risk_level": "MODERATE", "priority": "important", "title": "Drop, Cover, Hold On",
     "instruction": "If you feel shaking: DROP to the ground, take COVER under sturdy furniture, HOLD ON until shaking stops.", "is_official": True},
    {"disaster_type": "earthquake", "min_risk_level": "CRITICAL", "priority": "urgent", "title": "Coastal Tsunami Self-Evacuation",
     "instruction": "If you feel strong ground shaking along the coast, move immediately inland to higher ground without waiting for official siren.", "is_official": True},
    {"disaster_type": "earthquake", "min_risk_level": "LOW", "priority": "advisory", "title": "Expect Aftershocks",
     "instruction": "Expect aftershocks after the main shock; inspect your home for cracks and gas leaks before re-entering.", "is_official": True},
    {"disaster_type": "heatwave", "min_risk_level": "HIGH", "priority": "urgent", "title": "ORS Rehydration & Sun Avoidance",
     "instruction": "Drink water with oral rehydration salts (ORS) frequently. Never leave children or vulnerable individuals inside parked cars.", "is_official": True},
    {"disaster_type": "heatwave", "min_risk_level": "MODERATE", "priority": "important", "title": "Peak-Hour Heat Discipline",
     "instruction": "Avoid direct sun exposure between 11:30 AM and 4:30 PM; wear light-colored loose cotton clothing and cover your head outdoors.", "is_official": False},
]

# ---------------------------------------------------------------------------
# Demo incidents (seeded once so the dashboard has content pre-ingestion;
# they are real DB rows with full evidence/audit trails).
# ---------------------------------------------------------------------------
DEMO_INCIDENTS: list[dict[str, Any]] = [
    {
        "public_id": "EVT-GUJ-2026-01", "type": "flood",
        "title": "Severe Urban Inundation & Submerged Underpasses",
        "summary": "Heavy continuous downpour in West and Central Ahmedabad causing waterlogging up to 3.5 ft in low-lying underpasses and residential zones near Sabarmati.",
        "latitude": 23.0225, "longitude": 72.5714, "location_name": "Ahmedabad Central & West",
        "district": "Ahmedabad", "state": "Gujarat", "affected_radius_km": 14,
        "risk_level": "HIGH", "risk_score": 82, "confidence_score": 92,
        "status": "ACTIVE", "verification_status": "VERIFIED", "trend": "worsening",
        "rainfall_mm": 185, "signal_kind": "OBSERVED_EVENT",
        "factors": ["Extremely heavy rainfall in 24h (185 mm ≥ 205 mm threshold band)", "Official warning active"],
        "what_we_know": [
            "Akhbarnagar and Mithakhali underpasses are fully closed to vehicular traffic due to 4 ft water accumulation.",
            "AMC emergency response teams have deployed 14 high-capacity dewatering pumps.",
            "Power sub-stations isolated in Usmanpura as a precautionary measure.",
        ],
        "official_warnings": [
            "AMC Notice: Citizens are advised to avoid unnecessary travel and stay clear of inundated underpasses.",
            "Gujarat SDMA: Keep emergency contact numbers saved and move electrical appliances above ground level.",
        ],
        "evidence": [
            {"source_provider_id": "imd", "evidence_type": "provider_observation", "reference_id": "IMD-RWR-AHM", "detail": "IMD Red Alert issued for Ahmedabad & Anand districts.", "confidence_weight": 35},
            {"source_provider_id": "cwc", "evidence_type": "provider_observation", "reference_id": "CWC-SABARMATI", "detail": "Sabarmati river gauge reading 1.8m above normal level.", "confidence_weight": 30},
            {"source_provider_id": "open_meteo", "evidence_type": "provider_observation", "reference_id": "wx-ahm-demo", "detail": "Open-Meteo 24h rainfall ~185 mm around Ahmedabad.", "confidence_weight": 25},
        ],
    },
    {
        "public_id": "EVT-KER-2026-02", "type": "landslide",
        "title": "Catastrophic Slope Failure & Debris Flow Emergency",
        "summary": "Catastrophic slope instability following 240mm extreme rainfall in hilly terrains of Chooralmala and Meppadi.",
        "latitude": 11.6854, "longitude": 76.1320, "location_name": "Meppadi / Chooralmala Hill Belt",
        "district": "Wayanad", "state": "Kerala", "affected_radius_km": 8,
        "risk_level": "CRITICAL", "risk_score": 93, "confidence_score": 96,
        "status": "ACTIVE", "verification_status": "VERIFIED", "trend": "worsening",
        "rainfall_mm": 240, "signal_kind": "OBSERVED_EVENT",
        "factors": ["Soil saturation index exceeded threshold by 310%", "Extreme rainfall trigger (240 mm/24h)", "Official evacuation warning active"],
        "what_we_know": [
            "Chooralmala bridge compromised; temporary Bailey bridge construction initiated by Indian Army.",
            "Relief camps established in 4 higher-altitude higher secondary schools.",
            "Helicopter airlifts standby at Sulthan Bathery air strip.",
        ],
        "official_warnings": [
            "Kerala SDMA: Extreme Danger Zone. Evacuate all riverside and hill-slope dwellings in Vythiri & Meppadi Panchayat.",
        ],
        "evidence": [
            {"source_provider_id": "gsi_landslide", "evidence_type": "provider_observation", "reference_id": "GSI-SLOPE-WAY", "detail": "Soil saturation index exceeded threshold by 310%.", "confidence_weight": 40},
            {"source_provider_id": "ndrf_ops", "evidence_type": "moderator_review", "reference_id": "NDRF-WAYANAD-DEPLOY", "detail": "3 NDRF battalions deployed for search and rescue operations.", "confidence_weight": 35},
            {"source_provider_id": "open_meteo", "evidence_type": "provider_observation", "reference_id": "wx-way-demo", "detail": "Open-Meteo 24h rainfall ~240 mm over Meppadi belt.", "confidence_weight": 25},
        ],
    },
    {
        "public_id": "EVT-MAH-2026-03", "type": "heavy_rain",
        "title": "High Tide & Extreme Monsoon Rain Inundation",
        "summary": "Widespread torrential rainfall coupled with a 4.5-meter high tide leading to storm-water logging across Dadar, Hindmata, and Kurla.",
        "latitude": 19.0760, "longitude": 72.8777, "location_name": "South & Central Mumbai",
        "district": "Mumbai City", "state": "Maharashtra", "affected_radius_km": 22,
        "risk_level": "MODERATE", "risk_score": 54, "confidence_score": 88,
        "status": "ACTIVE", "verification_status": "CORROBORATED", "trend": "stable",
        "rainfall_mm": 110, "signal_kind": "OBSERVED_EVENT",
        "factors": ["Very heavy rainfall in 24h (110 mm)", "High tide drainage barrier effect"],
        "what_we_know": [
            "Local train services running with 15-minute delays on Central Line.",
            "High tide peak at 14:15 IST has receded, allowing sluice gates to drain stormwater.",
        ],
        "official_warnings": [
            "BMC Public Advisory: Exercise caution on promenade walkways and stay clear of sea face during high tide hours.",
        ],
        "evidence": [
            {"source_provider_id": "imd", "evidence_type": "provider_observation", "reference_id": "IMD-BOM-RADAR", "detail": "Doppler weather radar shows dense rain bands moving inland.", "confidence_weight": 50},
            {"source_provider_id": "incois", "evidence_type": "provider_observation", "reference_id": "INCOIS-TIDE-MUM", "detail": "Astronomical high tide peaking at 4.52m.", "confidence_weight": 38},
        ],
    },
    {
        "public_id": "EVT-ASM-2026-06", "type": "flood",
        "title": "Brahmaputra River Inundation Wave",
        "summary": "Catastrophic riverine flooding across Brahmaputra valley following continuous upper-catchment monsoon rains.",
        "latitude": 26.1445, "longitude": 91.7362, "location_name": "Guwahati Urban & Kamrup Lowlands",
        "district": "Kamrup Metropolitan", "state": "Assam", "affected_radius_km": 35,
        "risk_level": "CRITICAL", "risk_score": 96, "confidence_score": 97,
        "status": "ACTIVE", "verification_status": "VERIFIED", "trend": "worsening",
        "rainfall_mm": 210, "signal_kind": "OBSERVED_EVENT",
        "factors": ["River flowing 1.25m above highest flood level", "Wide-area inundation detected across 6 districts", "Official red alert active"],
        "what_we_know": [
            "Over 40 villages in lower Kamrup submerged under 4-6 ft water.",
            "Ferry services on the Brahmaputra completely suspended.",
            "Kaziranga wildlife migration corridors activated across NH-715.",
        ],
        "official_warnings": [
            "ASDMA Warning: Red Alert for 14 districts. Move livestock and families to high-ground relief camps.",
        ],
        "evidence": [
            {"source_provider_id": "cwc", "evidence_type": "provider_observation", "reference_id": "CWC-DHUBRI", "detail": "River flowing 1.25m above highest flood level in vulnerable embankments.", "confidence_weight": 45},
            {"source_provider_id": "nrsc_bhuvan", "evidence_type": "provider_event", "reference_id": "BHUVAN-FLOOD-EXTENT-ASM", "detail": "Wide-area inundation detected across 6 districts.", "confidence_weight": 35},
            {"source_provider_id": "ndrf_ops", "evidence_type": "provider_event", "reference_id": "NDRF-ASM-BOATS", "detail": "12 inflatable boat units operating in rescue mode.", "confidence_weight": 17},
        ],
    },
    {
        "public_id": "EVT-RAJ-2026-12", "type": "heatwave",
        "title": "Severe Heatwave Alert (47.2°C Recorded)",
        "summary": "Blistering summer heatwave with daytime dry winds (Loo) exceeding 45°C across North-West India.",
        "latitude": 26.9124, "longitude": 75.7873, "location_name": "Jaipur Urban & Sanganer",
        "district": "Jaipur", "state": "Rajasthan", "affected_radius_km": 30,
        "risk_level": "HIGH", "risk_score": 68, "confidence_score": 96,
        "status": "ACTIVE", "verification_status": "VERIFIED", "trend": "stable",
        "temperature_c": 47.2, "signal_kind": "OBSERVED_EVENT",
        "factors": ["Severe heatwave temperature recorded (47.2°C)", "Heat stroke emergency wards activated"],
        "what_we_know": [
            "Afternoon outdoor labor suspended between 12:00 PM and 4:00 PM under state labor advisory.",
            "Public water distribution kiosks (Piyau) established at 85 busy intersections.",
        ],
        "official_warnings": [
            "Rajasthan SDMA: Red Heat Warning. Avoid direct sun exposure between 11:30 AM and 4:30 PM. Drink ORS/water regularly.",
        ],
        "evidence": [
            {"source_provider_id": "imd", "evidence_type": "provider_observation", "reference_id": "IMD-JAI-AWS", "detail": "Maximum temperature recorded 47.2°C (5.4°C above seasonal normal).", "confidence_weight": 60},
            {"source_provider_id": "ndma", "evidence_type": "provider_observation", "reference_id": "MOHFW-HEAT-JAI", "detail": "Heat stroke emergency wards activated across all district hospitals.", "confidence_weight": 36},
        ],
    },
]


def seed_if_empty(db: Session) -> dict[str, int]:
    counts = {"sources": 0, "resources": 0, "recommendations": 0, "demo_incidents": 0, "schemes": 0, "emergency_contacts": 0}
    now = utcnow()

    if db.scalar(select(func.count(DataSource.id))) == 0:
        for s in SEED_SOURCES:
            db.add(DataSource(provider_id=s["provider_id"], name=s["name"], type=s["type"],
                              reliability_score=s["reliability_score"], status="active"))
        counts["sources"] = len(SEED_SOURCES)

    if db.scalar(select(func.count(Resource.id))) == 0:
        for r in SEED_RESOURCES:
            db.add(Resource(**r, last_verified_at=now))
        counts["resources"] = len(SEED_RESOURCES)

    if db.scalar(select(func.count(Recommendation.id))) == 0:
        for rec in SEED_RECOMMENDATIONS:
            db.add(Recommendation(**rec))
        counts["recommendations"] = len(SEED_RECOMMENDATIONS)

    if db.scalar(select(func.count(GovernmentScheme.id))) == 0:
        for sch in SEED_SCHEMES:
            data = dict(sch)  # copy so the module-level catalog is never mutated
            docs = data.pop("documents_required")
            steps = data.pop("how_to_apply")
            types = data.pop("applicable_disaster_types")
            db.add(GovernmentScheme(
                level="CENTRAL",
                documents_required_json=json.dumps(docs),
                how_to_apply_json=json.dumps(steps),
                applicable_disaster_types_json=json.dumps(types),
                **data,
            ))
        counts["schemes"] = len(SEED_SCHEMES)

    if db.scalar(select(func.count(EmergencyContact.id))) == 0:
        for ec in SEED_EMERGENCY_CONTACTS:
            db.add(EmergencyContact(**ec))
        counts["emergency_contacts"] = len(SEED_EMERGENCY_CONTACTS)

    if db.scalar(select(func.count(Incident.id))) == 0:
        for d in DEMO_INCIDENTS:
            inc = Incident(
                public_id=d["public_id"], type=d["type"], title=d["title"], summary=d["summary"],
                signal_kind=d.get("signal_kind", "OBSERVED_EVENT"),
                latitude=d["latitude"], longitude=d["longitude"], location_name=d["location_name"],
                district=d.get("district", ""), state=d.get("state", ""),
                affected_radius_km=d.get("affected_radius_km", 25),
                risk_level=d["risk_level"], risk_score=d["risk_score"],
                confidence_score=d["confidence_score"],
                status=d["status"], verification_status=d["verification_status"], trend=d.get("trend", "stable"),
                rainfall_mm=d.get("rainfall_mm"), temperature_c=d.get("temperature_c"),
                what_we_known_json=json.dumps(d.get("what_we_know", [])),
                official_warnings_json=json.dumps(d.get("official_warnings", [])),
                detected_at=now - timedelta(hours=20), updated_at=now - timedelta(minutes=35),
                expires_at=now + timedelta(hours=36),
            )
            db.add(inc)
            db.flush()
            for ev in d.get("evidence", []):
                db.add(IncidentEvidence(incident_id=inc.id, **ev))
            db.add(RiskAssessment(
                incident_id=inc.id, risk_level=d["risk_level"], risk_score=d["risk_score"],
                factors_json=json.dumps(d.get("factors", [])), rule_version="seed-v1",
            ))
            db.add(IncidentStatusHistory(
                incident_id=inc.id, previous_status="DETECTED", new_status="UNDER_REVIEW",
                reason="Seed scenario loaded", actor_type="system",
            ))
            db.add(IncidentStatusHistory(
                incident_id=inc.id, previous_status="UNDER_REVIEW", new_status="VERIFIED",
                reason="Corroborated by multiple official sources", actor_type="system",
            ))
            db.add(IncidentStatusHistory(
                incident_id=inc.id, previous_status="VERIFIED", new_status="ACTIVE",
                reason=f"Auto-activated on {d['risk_level']} risk detection", actor_type="system",
            ))
            counts["demo_incidents"] += 1

    # Keep curated scheme fields authoritative on existing databases too
    # (e.g., cleaned portal URLs from a catalog revision) — only writes when changed.
    for sch in SEED_SCHEMES:
        row = db.scalar(select(GovernmentScheme).where(GovernmentScheme.scheme_code == sch["scheme_code"]))
        if row and row.official_portal != sch["official_portal"]:
            row.official_portal = sch["official_portal"]
            db.add(row)

    db.commit()
    return counts


__all__ = [
    "MONITOR_LOCATIONS",
    "SEED_RESOURCES",
    "SEED_SCHEMES",
    "seed_if_empty",
]
