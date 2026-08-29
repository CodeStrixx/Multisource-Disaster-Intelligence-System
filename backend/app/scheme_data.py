"""Curated catalog of central government assistance schemes for disaster-struck populations.

Details summarized from official public sources for the SIH demo; users should
verify current norms on the official portals before relying on them.
"""
from __future__ import annotations

from typing import Any

ALL_TYPES = ["flood", "heavy_rain", "cyclone", "landslide", "earthquake", "heatwave"]
AGRI_TYPES = ["flood", "heavy_rain", "cyclone", "heatwave"]
HOUSE_TYPES = ["flood", "heavy_rain", "cyclone", "landslide", "earthquake"]

SEED_SCHEMES: list[dict[str, Any]] = [
    {
        "scheme_code": "SCH-SDRF",
        "name": "State Disaster Response Fund (SDRF) Ex-Gratia Relief",
        "administering_body": "MHA / NDMA Guidelines - State Governments & District Collectors",
        "applicable_disaster_types": ALL_TYPES,
        "summary": "Primary statutory compensation paid to disaster-affected families from the State Disaster Response Fund, per ex-gratia norms notified by the Ministry of Home Affairs.",
        "benefit_details": (
            "Ex-gratia of Rs. 4 lakh per deceased person (including those missing in the event); "
            "around Rs. 49,300 for grievous injury requiring hospitalisation; assistance for fully or "
            "severely damaged houses; cattle-loss and crop-loss assistance per notified norms. Exact "
            "amounts follow the latest MHA/NDMA SDRF itemised norms adopted by the state."
        ),
        "eligibility": "Families of deceased/missing persons, seriously injured persons, and owners of damaged houses, cattle or standing crops within a notified disaster area.",
        "documents_required": [
            "Aadhaar card & bank passbook (DBT-enabled account)",
            "Death certificate / hospital injury record / damage assessment report",
            "Revenue records (for house, crop or cattle loss)",
            "Application to District Collector / Tehsildar in prescribed form",
        ],
        "how_to_apply": [
            "Report the loss during the official damage-assessment survey (or within the state-notified window) via the village officer/Patwari or district control room.",
            "Obtain the prescribed application form from the Tehsildar / District Disaster Management office or the state e-district portal.",
            "Submit with documents to the District Collector; disbursement is via DBT after verification.",
        ],
        "official_portal": "https://ndma.gov.in",
        "helpline": "1077 (District Emergency Operations Centre)",
    },
    {
        "scheme_code": "SCH-NDRF",
        "name": "National Disaster Response Fund (NDRF) Assistance",
        "administering_body": "Ministry of Home Affairs - NDMA",
        "applicable_disaster_types": ALL_TYPES,
        "summary": "Additional central assistance released from the NDRF when a calamity is certified as 'severe' and exceeds the state's SDRF capacity.",
        "benefit_details": "Supplementary central funding over and above SDRF for relief and rehabilitation in severe calamities; disbursed through the same ex-gratia channels as SDRF once approved by the High-Level Committee.",
        "eligibility": "Residents of areas notified under a severe calamity declaration; accessed by the State Government rather than applied for individually.",
        "documents_required": ["Same assessment chain as SDRF - ensure your loss is recorded in the official damage survey"],
        "how_to_apply": [
            "No individual application - states request NDRF support after joint assessment teams verify losses.",
            "Affected citizens should ensure their losses are captured in the official damage survey (girdawari/panchanama).",
        ],
        "official_portal": "https://ndma.gov.in",
        "helpline": "1078 (NDMA Helpline)",
    },
    {
        "scheme_code": "SCH-PMFBY",
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "administering_body": "Ministry of Agriculture & Farmers Welfare",
        "applicable_disaster_types": AGRI_TYPES,
        "summary": "Flagship crop-insurance scheme protecting farmers against financial loss from natural calamities, pests and diseases across pre-sowing to post-harvest stages.",
        "benefit_details": (
            "Claims up to full sum insured for yield losses from flood, inundation, cyclone, hailstorm, drought, "
            "dry spells and temperature extremes; prevented-sowing/planted-failed claims up to 25% of sum insured; "
            "post-harvest coverage for up to 14 days. Low farmer premium: about 2% (Kharif) / 1.5% (Rabi)."
        ),
        "eligibility": "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas; enrolment before the seasonal cut-off date.",
        "documents_required": [
            "Aadhaar / ID proof and land record or tenancy agreement",
            "Bank account details (Aadhaar-seeded)",
            "Sowing certificate / crop-sown confirmation",
            "Intimation or photos of localised damage within 72 hours (for localised calamity claims)",
        ],
        "how_to_apply": [
            "Enrol online on the PMFBY portal or via Common Service Centres before the seasonal cut-off.",
            "Pay the farmer premium share; the balance is subsidised by the Centre and State.",
            "Report crop loss to the insurance company/CSC within 72 hours for localised claims; large-area yield claims settle via smart-card technology assessments.",
        ],
        "official_portal": "https://pmfby.gov.in",
        "helpline": "Kisan Call Centre: 1800-180-1551",
    },
    {
        "scheme_code": "SCH-PMKISAN",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "administering_body": "Ministry of Agriculture & Farmers Welfare",
        "applicable_disaster_types": AGRI_TYPES,
        "summary": "Direct income support of Rs. 6,000 per year (three DBT instalments) to landholding farmer families, providing liquidity when disasters disrupt farm income.",
        "benefit_details": "Rs. 2,000 credited directly to bank accounts every four months; payments continue unaffected by local calamities, giving affected households dependable cash flow during recovery.",
        "eligibility": "Landholding farmer families with cultivable land (certain exclusions apply, e.g., income-tax payers and institutional landholders).",
        "documents_required": ["Aadhaar", "Land ownership records", "Bank account linked to Aadhaar", "Mobile number"],
        "how_to_apply": [
            "Register at the PM-KISAN portal via a CSC or your district agriculture office.",
            "Self-register through the Farmers Corner using Aadhaar-based eKYC.",
        ],
        "official_portal": "https://pmkisan.gov.in",
        "helpline": "PM-KISAN: 155555 | Kisan Call Centre: 1800-180-1551",
    },
    {
        "scheme_code": "SCH-KCC-RMS",
        "name": "Kisan Credit Card - Calamity Relief (Interest Subvention & Loan Rescheduling)",
        "administering_body": "Department of Financial Services - RBI - NABARD",
        "applicable_disaster_types": AGRI_TYPES,
        "summary": "After notified natural calamities, banks reschedule KCC crop loans, convert short-term debt to term loans and extend fresh credit so affected farmers can re-sow.",
        "benefit_details": (
            "Moratorium/rescheduling of repayments for disaster-hit borrowers, conversion of short-term crop loans "
            "into medium-term loans, continuation of interest-subvention benefits, and priority fresh KCC lending "
            "per RBI's Master Directions on natural calamities."
        ),
        "eligibility": "Existing KCC holders and eligible farmers in areas officially notified as affected by the calamity.",
        "documents_required": ["KCC loan account details", "Aadhaar & PAN", "Calamity notification reference for your area"],
        "how_to_apply": [
            "Approach your lending branch with the loan account number and request restructuring under RBI natural-calamity provisions.",
            "Submit the disaster-loss declaration used for the official survey.",
        ],
        "official_portal": "https://www.myscheme.gov.in",
        "helpline": None,
    },
    {
        "scheme_code": "SCH-PMAYG",
        "name": "Pradhan Mantri Awas Yojana - Gramin (Rural Housing Reconstruction)",
        "administering_body": "Ministry of Rural Development",
        "applicable_disaster_types": HOUSE_TYPES,
        "summary": "Assistance for house construction/reconstruction for rural households that become homeless or live in dilapidated houses - widely used for rebuilding after floods, cyclones and earthquakes.",
        "benefit_details": (
            "Rs. 1.20 lakh in plain areas and Rs. 1.30 lakh in hilly/difficult areas (plus convergence benefits "
            "such as toilets under SBM-G, MGNREGA labour days and Ujjwala LPG connection); payments released "
            "directly to beneficiary accounts in stages."
        ),
        "eligibility": "Houseless households or households in kuccha/severely damaged houses, identified via the Awaas+ survey and SECC data in disaster-affected rural blocks.",
        "documents_required": ["Aadhaar & bank account (DBT)", "Job card (for MGNREGA convergence)", "Damage/destruction certificate where applicable"],
        "how_to_apply": [
            "Ensure the household is on the permanent waitlist via the Awaas+/Gram Panchayat survey after the disaster.",
            "Track sanction and instalments on the PMAY-G portal; grievances can also be filed there.",
        ],
        "official_portal": "https://pmayg.nic.in",
        "helpline": None,
    },
    {
        "scheme_code": "SCH-NSAP",
        "name": "National Social Assistance Programme (NSAP) - Pensions & Family Benefit",
        "administering_body": "Ministry of Rural Development",
        "applicable_disaster_types": ALL_TYPES,
        "summary": "Safety-net pensions for elderly, widowed and disabled persons below the poverty line, plus a lump-sum family benefit when the primary breadwinner dies - including disaster deaths.",
        "benefit_details": (
            "Indira Gandhi National Old Age / Widow / Disability pensions (central top-up of Rs. 200-500 per month, "
            "with states adding more); National Family Benefit Scheme: Rs. 20,000 lump sum to a BPL family on the "
            "death of the primary breadwinner."
        ),
        "eligibility": "BPL households: elderly 60+, widows, persons with disabilities; NFBS for BPL families that lose their primary breadwinner.",
        "documents_required": [
            "Aadhaar & BPL/SECC ration reference",
            "Age / widowhood / disability certificate as applicable",
            "Death certificate of breadwinner (for NFBS)",
            "Bank account details",
        ],
        "how_to_apply": [
            "Apply through the Gram Panchayat / block office or the state social welfare e-district portal.",
            "Central component tracking available on the NSAP portal (nsap.nic.in).",
        ],
        "official_portal": "https://nsap.nic.in",
        "helpline": None,
    },
    {
        "scheme_code": "SCH-NFSA-PMGKAY",
        "name": "NFSA Ration Entitlements / PMGKAY Free Foodgrain Support",
        "administering_body": "Department of Food & Public Distribution",
        "applicable_disaster_types": ALL_TYPES,
        "summary": "Legal right to subsidised foodgrains under the National Food Security Act, with additional free-grain allocations historically extended during disasters to displaced and affected families.",
        "benefit_details": (
            "5 kg per person per month free foodgrain (as extended under PMGKAY) or at NFSA subsidized rates "
            "(2 kg coarse grain / 3 kg pulses norms vary); priority household and Antyodaya categories get enhanced entitlements; portable across states via One Nation One Ration Card for displaced families."
        ),
        "eligibility": "Possession of a valid NFSA ration card (Priority Household or Antyodaya Anna Yojana).",
        "documents_required": ["Valid ration card", "Aadhaar (seeded with ration card)", "Address proof for portability"],
        "how_to_apply": [
            "New ration cards: apply via your state food & civil supplies department portal or seva kendras.",
            "Existing beneficiaries: collect grains at any fair-price shop using ONORC portability if displaced.",
            "Grievances: state PDS grievance helpline or the national food grievance number 1800-112-750.",
        ],
        "official_portal": "https://nfsa.gov.in",
        "helpline": "Food grievance: 1800-112-750 | Emergency: 112",
    },
    {
        "scheme_code": "SCH-PMNRF",
        "name": "Prime Minister's National Relief Fund (PMNRF)",
        "administering_body": "PMO - PMNRF Trust",
        "applicable_disaster_types": ALL_TYPES,
        "summary": "Discretionary fund providing immediate assistance to individuals for relief during natural calamities and for medical treatment of major diseases.",
        "benefit_details": "One-time grant disbursed through the district administration/deputy commissioner for calamity-affected persons (amount decided case-by-case); also supports immediate medical needs.",
        "eligibility": "Any citizen severely affected by a notified natural calamity or requiring major medical treatment, applied via the district administration.",
        "documents_required": ["Application addressed to the Deputy Commissioner", "Proof of calamity impact / medical documents", "Aadhaar & bank details"],
        "how_to_apply": [
            "Submit an assistance request through the Deputy Commissioner / District Collector's office.",
            "Recommendation is forwarded to the PMNRF secretariat for sanction.",
        ],
        "official_portal": "https://pmnrf.gov.in",
        "helpline": None,
    },
    {
        "scheme_code": "SCH-MGNREGA",
        "name": "MGNREGA - Post-Disaster Wage Employment & Recovery Works",
        "administering_body": "Ministry of Rural Development",
        "applicable_disaster_types": AGRI_TYPES + ["landslide"],
        "summary": "Guaranteed 100 days of wage employment per rural household per year; post-disaster it funds cash-for-work recovery such as desilting, embankment repair and water-conservation works.",
        "benefit_details": (
            "Unskilled wage payment directly to bank accounts; additional days permissible in drought/natural-disaster "
            "affected areas per government notifications; works prioritise restoration of damaged community assets."
        ),
        "eligibility": "Adult members of rural households holding a valid MGNREGA job card.",
        "documents_required": ["MGNREGA job card", "Aadhaar-seeded bank/post-office account", "Work application to Gram Panchayat"],
        "how_to_apply": [
            "Apply for work at the Gram Panchayat (written application keeps legal guarantee intact).",
            "Post-disaster works are added to the shelf of works by the Gram Panchayat/Gram Sabha.",
            "Track wages and muster rolls on the NREGA public portal or NMMS app.",
        ],
        "official_portal": "https://nrega.nic.in",
        "helpline": None,
    },
]

