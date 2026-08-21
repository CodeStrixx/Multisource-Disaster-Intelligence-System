import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'gu'
  | 'ml'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'kn'
  | 'or'
  | 'pa'
  | 'as';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'National / Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', region: 'North / Central India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & Tripura' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam & Northeast' },
];

export type TranslationKey =
  | 'app_title'
  | 'app_subtitle'
  | 'decision_support'
  | 'live'
  | 'dark'
  | 'light'
  | 'dashboard'
  | 'gis_map'
  | 'resources'
  | 'report'
  | 'sources'
  | 'alerts'
  | 'settings'
  | 'search_sector'
  | 'active_hazards'
  | 'verified_reports'
  | 'relief_centers'
  | 'data_sources'
  | 'emergency_dispatch'
  | 'what_is_happening'
  | 'can_i_trust_it'
  | 'what_should_i_do'
  | 'switch_theme'
  | 'language_setting'
  | 'select_language'
  | 'preferences_saved'
  | 'save_preferences'
  | 'return_dashboard'
  | 'view_intel_dossier'
  | 'find_relief'
  | 'submit_field_report'
  | 'call'
  | 'directions'
  | 'details'
  | 'all_clear'
  | 'mark_all_read'
  | 'cancel'
  | 'submit'
  | 'monitored_sectors'
  | 'add_sector'
  | 'what_we_know'
  | 'contributing_factors'
  | 'recommended_actions'
  | 'regional_news_wire'
  | 'evidence_sources'
  | 'timeline'
  | 'critical_risk'
  | 'high_risk'
  | 'moderate_risk'
  | 'low_risk'
  | 'verified'
  | 'corroborated'
  | 'under_review'
  | 'unverified'
  | 'location_permission'
  | 'auto_location_detect'
  | 'auto_location_desc'
  | 'push_notifications'
  | 'critical_high_alerts'
  | 'moderate_alerts'
  | 'public_safety_notice'
  // Dashboard
  | 'active_hazards_label'
  | 'public_reports'
  | 'view_all'
  | 'inspect'
  | 'change_sector'
  | 'saved'
  | 'monitoring_sector'
  | 'no_active_hazards'
  | 'monitor_other_sectors'
  // Alerts
  | 'broadcast_alerts'
  | 'active_disaster_alerts'
  | 'alert_feed_desc'
  | 'mark_all_read_count'
  | 'no_active_alerts'
  | 'all_clear_full'
  | 'action'
  | 'inspect_alert'
  // Resources
  | 'relief_directory'
  | 'relief_near'
  | 'all_resources'
  | 'shelters'
  | 'hospitals'
  | 'relief_outposts'
  | 'police'
  | 'fire_rescue'
  | 'list_view'
  | 'map_view'
  | 'search_facility'
  | 'capacity'
  | 'available'
  | 'no_resources'
  | 'reset_filters'
  | 'intel_dossier'
  // Report
  | 'submit_citizen_report'
  | 'report_desc'
  | 'incident_type'
  | 'your_location'
  | 'your_name'
  | 'describe_incident'
  | 'attach_photo'
  | 'uploading'
  | 'photo_attached'
  | 'submit_report'
  | 'verification_notice'
  // Event Details
  | 'return_to_dashboard'
  | 'official_directives'
  | 'safety_protocols'
  | 'nearby_relief'
  | 'live_dispatch'
  | 'no_dispatches'
  | 'monitoring_feeds'
  | 'verification_weight'
  | 'corroboration_matrix'
  | 'click_markers'
  | 'ingested_sources';


const TRANSLATIONS: Record<'en', Record<TranslationKey, string>> & Record<Exclude<LanguageCode, 'en'>, Partial<Record<TranslationKey, string>>> = {
  en: {
    app_title: 'DISASTER OPS-CENTER',
    app_subtitle: 'INDIA // MULTI-SOURCE INTELLIGENCE',
    decision_support: 'DECISION SUPPORT SYSTEM — Does not replace official instructions from NDMA / SDMA.',
    live: 'LIVE',
    dark: 'DARK',
    light: 'LIGHT',
    dashboard: 'DASHBOARD',
    gis_map: 'GIS MAP',
    resources: 'RESOURCES',
    report: 'REPORT',
    sources: 'DATA SOURCES',
    alerts: 'ALERTS',
    settings: 'SETTINGS',
    search_sector: 'Search Sector / Location',
    active_hazards: 'ACTIVE HAZARDS',
    verified_reports: 'VERIFIED REPORTS',
    relief_centers: 'RELIEF CENTERS',
    data_sources: 'DATA SOURCES',
    emergency_dispatch: 'EMERGENCY DISPATCH',
    what_is_happening: 'WHAT IS HAPPENING?',
    can_i_trust_it: 'CAN I TRUST IT?',
    what_should_i_do: 'WHAT SHOULD I DO?',
    switch_theme: 'INTERFACE THEME',
    language_setting: 'LANGUAGE & REGIONAL LOCALIZATION',
    select_language: 'Select Interface Language',
    preferences_saved: 'PREFERENCES SAVED',
    save_preferences: 'SAVE PREFERENCES',
    return_dashboard: 'RETURN TO DASHBOARD',
    view_intel_dossier: 'VIEW INTEL DOSSIER',
    find_relief: 'FIND RELIEF RESOURCES',
    submit_field_report: 'SUBMIT FIELD REPORT',
    call: 'CALL',
    directions: 'DIRECTIONS',
    details: 'DETAILS',
    all_clear: 'Normal conditions. All clear signal from sensors.',
    mark_all_read: 'MARK ALL READ',
    cancel: 'CANCEL',
    submit: 'SUBMIT',
    monitored_sectors: 'MONITORED SECTORS',
    add_sector: 'ADD SECTOR',
    what_we_know: 'WHAT WE KNOW (VERIFIED FACTS)',
    contributing_factors: 'CONTRIBUTING RISK FACTORS',
    recommended_actions: 'RECOMMENDED ACTIONS & SAFETY PROTOCOLS',
    regional_news_wire: 'REGIONAL NEWS WIRE',
    evidence_sources: 'EVIDENCE & DATA SOURCES',
    timeline: 'TIMELINE',
    critical_risk: 'CRITICAL RISK',
    high_risk: 'HIGH RISK',
    moderate_risk: 'MODERATE RISK',
    low_risk: 'LOW RISK',
    verified: 'VERIFIED',
    corroborated: 'CORROBORATED',
    under_review: 'UNDER REVIEW',
    unverified: 'UNVERIFIED',
    location_permission: 'Location & Geofencing',
    auto_location_detect: 'AUTOMATIC LOCATION DETECTION',
    auto_location_desc: 'Use browser GPS to detect local disaster risks automatically.',
    push_notifications: 'Broadcast Alert Thresholds',
    critical_high_alerts: 'CRITICAL & HIGH RISK ALERTS',
    moderate_alerts: 'MODERATE ADVISORY ALERTS',
    public_safety_notice: 'This system provides decision support. Official directives take absolute precedence.',
    // Dashboard
    active_hazards_label: 'ACTIVE HAZARDS',
    public_reports: 'PUBLIC REPORTS',
    view_all: 'VIEW ALL',
    inspect: 'INSPECT',
    change_sector: 'CHANGE SECTOR',
    saved: 'SAVED',
    monitoring_sector: 'MONITORING SECTOR',
    no_active_hazards: 'NO ACTIVE HAZARDS DETECTED',
    monitor_other_sectors: 'MONITOR OTHER SECTORS',
    // Alerts
    broadcast_alerts: 'BROADCAST ALERTS & EMERGENCY BULLETINS',
    active_disaster_alerts: 'ACTIVE DISASTER ALERTS',
    alert_feed_desc: 'Chronological feed of official weather warnings and safety evacuations.',
    mark_all_read_count: 'MARK ALL READ',
    no_active_alerts: 'NO ACTIVE ALERTS',
    all_clear_full: 'All clear. High-priority warnings will appear here automatically.',
    action: 'ACTION',
    inspect_alert: 'INSPECT',
    // Resources
    relief_directory: 'EMERGENCY LOGISTICS & RELIEF DIRECTORY',
    relief_near: 'RELIEF & ASSISTANCE NEAR',
    all_resources: 'ALL RESOURCES',
    shelters: 'SHELTERS',
    hospitals: 'HOSPITALS & MEDICAL',
    relief_outposts: 'RELIEF OUTPOSTS',
    police: 'POLICE',
    fire_rescue: 'FIRE & RESCUE',
    list_view: 'LIST VIEW',
    map_view: 'GIS MAP VIEW',
    search_facility: 'Search facility name, address, landmark...',
    capacity: 'CAPACITY',
    available: 'AVAIL',
    no_resources: 'NO MATCHING RELIEF RESOURCES FOUND',
    reset_filters: 'RESET FILTERS',
    intel_dossier: 'INTEL DOSSIER',
    // Report
    submit_citizen_report: 'SUBMIT CITIZEN FIELD REPORT',
    report_desc: 'Report observed incidents to help verify disaster intelligence. All submissions are geotagged and reviewed.',
    incident_type: 'INCIDENT TYPE',
    your_location: 'YOUR LOCATION',
    your_name: 'YOUR NAME (OPTIONAL)',
    describe_incident: 'DESCRIBE WHAT YOU SAW (minimum 20 characters)',
    attach_photo: 'ATTACH PHOTO / VIDEO',
    uploading: 'Uploading...',
    photo_attached: 'Photo attached',
    submit_report: 'SUBMIT FIELD REPORT',
    verification_notice: 'Your report will be cross-referenced with satellite and sensor data before publication.',
    // Event Details
    return_to_dashboard: 'RETURN TO DASHBOARD',
    official_directives: 'OFFICIAL GOVERNMENT DIRECTIVES',
    safety_protocols: 'CONTEXTUAL SAFETY PROTOCOLS',
    nearby_relief: 'NEARBY RELIEF CENTERS',
    live_dispatch: 'LIVE DISPATCH',
    no_dispatches: 'No breaking news dispatches recorded for this event yet. Monitoring regional bureau RSS feeds...',
    monitoring_feeds: 'Monitoring feeds...',
    verification_weight: 'VERIFICATION WEIGHT',
    corroboration_matrix: 'VERIFICATION FACTORS MATRIX',
    click_markers: 'CLICK MARKERS FOR INTEL',
    ingested_sources: 'INGESTED DATA SOURCES & REGIONAL BUREAUS',
  },

  hi: {
    app_title: 'आपदा नियंत्रण केंद्र',
    app_subtitle: 'भारत // बहु-स्रोत आपदा सूचना प्रणाली',
    decision_support: 'निर्णय समर्थन प्रणाली — यह NDMA / SDMA के आधिकारिक निर्देशों का स्थान नहीं लेती।',
    live: 'लाइव',
    dark: 'डार्क',
    light: 'लाइट',
    dashboard: 'डैशबोर्ड',
    gis_map: 'जीआईएस मानचित्र',
    resources: 'राहत संसाधन',
    report: 'रिपोर्ट करें',
    sources: 'डेटा स्रोत',
    alerts: 'चेतावनी',
    settings: 'सेटिंग्स',
    search_sector: 'क्षेत्र या स्थान खोजें',
    active_hazards: 'सक्रिय आपदाएं',
    verified_reports: 'सत्यापित रिपोर्ट',
    relief_centers: 'राहत केंद्र',
    data_sources: 'डेटा स्रोत',
    emergency_dispatch: 'आपातकालीन सहायता',
    what_is_happening: 'क्या हो रहा है?',
    can_i_trust_it: 'क्या यह विश्वसनीय है?',
    what_should_i_do: 'मुझे क्या करना चाहिए?',
    switch_theme: 'इंटरफ़ेस थीम',
    language_setting: 'भाषा एवं क्षेत्रीय स्थानीयकरण',
    select_language: 'भाषा चुनें',
    preferences_saved: 'प्राथमिकताएं सहेजी गईं',
    save_preferences: 'प्राथमिकताएं सहेजें',
    return_dashboard: 'डैशबोर्ड पर वापस जाएं',
    view_intel_dossier: 'विस्तृत रिपोर्ट देखें',
    find_relief: 'निकटतम राहत संसाधन खोजें',
    submit_field_report: 'घटना रिपोर्ट दर्ज करें',
    call: 'कॉल करें',
    directions: 'मार्ग देखें',
    details: 'विवरण',
    all_clear: 'सामान्य स्थिति। मौसम सेंसर से सब ठीक का संकेत।',
    mark_all_read: 'सभी पढ़ा हुआ चिह्नित करें',
    cancel: 'रद्द करें',
    submit: 'जमा करें',
    monitored_sectors: 'निगरानी क्षेत्र',
    add_sector: 'क्षेत्र जोड़ें',
    what_we_know: 'सत्यापित तथ्य एवं स्थिति',
    contributing_factors: 'जोखिम कारक',
    recommended_actions: 'अनुशंसित सुरक्षा कदम एवं निर्देश',
    regional_news_wire: 'क्षेत्रीय समाचार सेवा',
    evidence_sources: 'प्रमाण एवं डेटा स्रोत',
    timeline: 'घटनाक्रम समयरेखा',
    critical_risk: 'अति गंभीर जोखिम',
    high_risk: 'उच्च जोखिम',
    moderate_risk: 'मध्यम जोखिम',
    low_risk: 'कम जोखिम',
    verified: 'सत्यापित',
    corroborated: 'पुष्टीकृत',
    under_review: 'समीक्षाधीन',
    unverified: 'असत्यापित',
    location_permission: 'स्थान एवं जियोफेंसिंग',
    auto_location_detect: 'स्वचालित स्थान पहचान',
    auto_location_desc: 'स्थानीय आपदा जोखिमों का स्वतः पता लगाने के लिए जीपीएस का उपयोग करें।',
    push_notifications: 'प्रसारण चेतावनी सीमाएं',
    critical_high_alerts: 'गंभीर एवं उच्च जोखिम चेतावनी',
    moderate_alerts: 'मध्यम सलाह चेतावनी',
    public_safety_notice: 'यह प्रणाली निर्णय समर्थन प्रदान करती है। आधिकारिक सरकारी निर्देश सर्वोपरि हैं।',
  },

  gu: {
    app_title: 'આપત્તિ નિયંત્રણ કેન્દ્ર',
    app_subtitle: 'ભારત // મલ્ટી-સોર્સ આપત્તિ ગુપ્તચર સિસ્ટમ',
    decision_support: 'નિર્ણય સહાયક પ્રણાલી — તે NDMA / SDMA ના સત્તાવાર નિર્દેશોનું સ્થાન લેતી નથી.',
    live: 'લાઈવ',
    dark: 'ડાર્ક',
    light: 'લાઈટ',
    dashboard: 'ડેશબોર્ડ',
    gis_map: 'GIS નકશો',
    resources: 'રાહત સંસાધનો',
    report: 'અહેવાલ આપો',
    sources: 'ડેટા સ્ત્રોત',
    alerts: 'ચેતવણીઓ',
    settings: 'સેટિંગ્સ',
    search_sector: 'વિસ્તાર અથવા શહેર શોધો',
    active_hazards: 'સક્રિય જોખમો',
    verified_reports: 'ચકાસાયેલ અહેવાલો',
    relief_centers: 'રાહત કેન્દ્રો',
    data_sources: 'ડેટા સ્ત્રોતો',
    emergency_dispatch: 'કટોકટી સેવાઓ',
    what_is_happening: 'શું થઈ રહ્યું છે?',
    can_i_trust_it: 'શું હું આના પર વિશ્વાસ કરી શકું?',
    what_should_i_do: 'મારે શું કરવું જોઈએ?',
    switch_theme: 'ઇન્ટરફેસ થીમ',
    language_setting: 'ભાષા અને પ્રાદેશિક સ્થાનિકીકરણ',
    select_language: 'ભાષા પસંદ કરો',
    preferences_saved: 'પસંદગીઓ સાચવવામાં આવી',
    save_preferences: 'પસંદગીઓ સાચવો',
    return_dashboard: 'ડેશબોર્ડ પર પાછા ફરો',
    view_intel_dossier: 'વિગતવાર અહેવાલ જુઓ',
    find_relief: 'નજીકના રાહત સંસાધનો શોધો',
    submit_field_report: 'ઘટનાની જાણ કરો',
    call: 'કૉલ કરો',
    directions: 'દિશાઓ મેળવો',
    details: 'વિગતો',
    all_clear: 'સામાન્ય સ્થિતિ. સેન્સર્સ તરફથી બધું બરાબર છે.',
    mark_all_read: 'બધા વાંચેલા તરીકે ચિહ્નિત કરો',
    cancel: 'રદ કરો',
    submit: 'સબમિટ કરો',
    monitored_sectors: 'મોનિટર કરેલા વિસ્તારો',
    add_sector: 'વિસ્તાર ઉમેરો',
    what_we_know: 'ચકાસાયેલ તથ્યો અને વિગતો',
    contributing_factors: 'જોખમી પરિબળો',
    recommended_actions: 'સલામતી પગલાં અને નિર્દેશો',
    regional_news_wire: 'પ્રાદેશિક સમાચાર વાયર',
    evidence_sources: 'પુરાવા અને સ્ત્રોતો',
    timeline: 'સમયરેખા',
    critical_risk: 'અતિ ગંભીર જોખમ',
    high_risk: 'ઉચ્ચ જોખમ',
    moderate_risk: 'મધ્યમ જોખમ',
    low_risk: 'ઓછું જોખમ',
    verified: 'ચકાસાયેલ',
    corroborated: 'સમર્થિત',
    under_review: 'સમીક્ષા હેઠળ',
    unverified: 'અચકાસાયેલ',
    location_permission: 'સ્થાન અને જીઓફેન્સિંગ',
    auto_location_detect: 'સ્વચાલિત સ્થાન શોધ',
    auto_location_desc: 'સ્થાનિક જોખમો શોધવા માટે GPS નો ઉપયોગ કરો.',
    push_notifications: 'ચેતવણી થ્રેશોલ્ડ',
    critical_high_alerts: 'ગંભીર અને ઉચ્ચ જોખમ ચેતવણીઓ',
    moderate_alerts: 'મધ્યમ સલાહ ચેતવણીઓ',
    public_safety_notice: 'આ સિસ્ટમ નિર્ણય સપોર્ટ પૂરો પાડે છે. સત્તાવાર સૂચનાઓ સર્વોપરી છે.',
  },

  ml: {
    app_title: 'ദുരന്ത നിയന്ത്രണ കേന്ദ്രം',
    app_subtitle: 'ഇന്ത്യ // മൾട്ടി-സോഴ്സ് ഇന്റലിജൻസ് സിസ്റ്റം',
    decision_support: 'തീരുമാന പിന്തുണ സംവിധാനം — NDMA / SDMA യുടെ ഔദ്യോഗിക നിർദ്ദേശങ്ങൾക്ക് പകരമാവില്ല.',
    live: 'ലൈവ്',
    dark: 'ഡാർക്ക്',
    light: 'ലൈറ്റ്',
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    gis_map: 'ജിഐഎസ് മാപ്പ്',
    resources: 'ദുരിതാശ്വാസ കേന്ദ്രങ്ങൾ',
    report: 'വിവരം അറിയിക്കുക',
    sources: 'വിവര സ്രോതസ്സുകൾ',
    alerts: 'മുന്നറിയിപ്പുകൾ',
    settings: 'ക്രമീകരണങ്ങൾ',
    search_sector: 'പ്രദേശം തിരയുക',
    active_hazards: 'സജീവ അപകടങ്ങൾ',
    verified_reports: 'സ്ഥിരീകരിച്ച വിവരങ്ങൾ',
    relief_centers: 'ദുരിതാശ്വാസ കേന്ദ്രങ്ങൾ',
    data_sources: 'ഡാറ്റാ സ്രോതസ്സുകൾ',
    emergency_dispatch: 'അടിയന്തര സഹായം',
    what_is_happening: 'എന്താണ് സംഭവിക്കുന്നത്?',
    can_i_trust_it: 'ഇത് വിശ്വസിക്കാമോ?',
    what_should_i_do: 'ഞാൻ എന്ത് ചെയ്യണം?',
    switch_theme: 'ഇന്റർഫേസ് തീം',
    language_setting: 'ഭാഷയും പ്രാദേശിക ക്രമീകരണങ്ങളും',
    select_language: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    preferences_saved: 'വിവരങ്ങൾ സേവ് ചെയ്തു',
    save_preferences: 'സേവ് ചെയ്യുക',
    return_dashboard: 'ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക',
    view_intel_dossier: 'വിശദ വിവരങ്ങൾ കാണുക',
    find_relief: 'ദുരിതാശ്വാസ കേന്ദ്രങ്ങൾ കണ്ടെത്തുക',
    submit_field_report: 'വിവരം റിപ്പോർട്ട് ചെയ്യുക',
    call: 'വിളിക്കുക',
    directions: 'റൂട്ട് കാണുക',
    details: 'വിശദാംശങ്ങൾ',
    all_clear: 'സാധാരണ നില. അപകട സൂചനകളില്ല.',
    mark_all_read: 'എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക',
    cancel: 'റദ്ദാക്കുക',
    submit: 'സമർപ്പിക്കുക',
    monitored_sectors: 'നിരീക്ഷണത്തിലുള്ള പ്രദേശങ്ങൾ',
    add_sector: 'പ്രദേശം ചേർക്കുക',
    what_we_know: 'സ്ഥിരീകരിച്ച വസ്തുതകൾ',
    contributing_factors: 'അപകട സാധ്യത ഘടകങ്ങൾ',
    recommended_actions: 'സുരക്ഷാ നിർദ്ദേശങ്ങൾ',
    regional_news_wire: 'പ്രാദേശിക വാർത്തകൾ',
    evidence_sources: 'തെളിവുകളും സ്രോതസ്സുകളും',
    timeline: 'സമയരേഖ',
    critical_risk: 'ഗുരുതരമായ അപകടം',
    high_risk: 'ഉയർന്ന അപകടം',
    moderate_risk: 'ഇടത്തരം അപകടം',
    low_risk: 'കുറഞ്ഞ അപകടം',
    verified: 'സ്ഥിരീകരിച്ചു',
    corroborated: 'സാക്ഷ്യപ്പെടുത്തി',
    under_review: 'പരിശോധനയിൽ',
    unverified: 'സ്ഥിരീകരിക്കാത്തത്',
    location_permission: 'ലൊക്കേഷൻ അനുമതി',
    auto_location_detect: 'ഓട്ടോമാറ്റിക് ലൊക്കേഷൻ കണ്ടെത്തൽ',
    auto_location_desc: 'അപകട സാധ്യതകൾ അറിയാൻ ജിപിഎസ് ഉപയോഗിക്കുക.',
    push_notifications: 'മുന്നറിയിപ്പ് അറിയിപ്പുകൾ',
    critical_high_alerts: 'അതിതീവ്ര അപകട മുന്നറിയിപ്പുകൾ',
    moderate_alerts: 'സാധാരണ മുന്നറിയിപ്പുകൾ',
    public_safety_notice: 'ഈ സംവിധാനം തീരുമാന പിന്തുണ നൽകുന്നു. ഔദ്യോഗിക നിർദ്ദേശങ്ങൾ പാലിക്കുക.',
  },

  ta: {
    app_title: 'பேரிடர் கட்டுப்பாட்டு மையம்',
    app_subtitle: 'இந்தியா // பல மூல பேரிடர் தகவல் அமைப்பு',
    decision_support: 'முடிவு ஆதரவு அமைப்பு — NDMA / SDMA அதிகாரப்பூர்வ உத்தரவுகளுக்கு மாற்றாகாது.',
    live: 'நேரலை',
    dark: 'டார்க்',
    light: 'லைட்',
    dashboard: 'முகப்பு',
    gis_map: 'வரைபடம்',
    resources: 'நிவாரண உதவிகள்',
    report: 'தகவல் தெரிவிக்க',
    sources: 'தரவு ஆதாரங்கள்',
    alerts: 'எச்சரிக்கைகள்',
    settings: 'அமைப்புகள்',
    search_sector: 'பகுதியைத் தேடுங்கள்',
    active_hazards: 'செயலில் உள்ள ஆபத்துகள்',
    verified_reports: 'சரிபார்க்கப்பட்ட தகவல்கள்',
    relief_centers: 'நிவாரண முகாம்கள்',
    data_sources: 'தரவு ஆதாரங்கள்',
    emergency_dispatch: 'அவசர உதவி',
    what_is_happening: 'என்ன நடக்கிறது?',
    can_i_trust_it: 'இதை நம்பலாமா?',
    what_should_i_do: 'நான் என்ன செய்ய வேண்டும்?',
    switch_theme: 'தோற்ற அமைப்பு',
    language_setting: 'மொழி மற்றும் பிராந்திய அமைப்புகள்',
    select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    preferences_saved: 'அமைப்புகள் சேமிக்கப்பட்டன',
    save_preferences: 'அமைப்புகளைச் சேமி',
    return_dashboard: 'முகப்பிற்குத் திரும்பு',
    view_intel_dossier: 'முழு விவரங்களைக் காண்க',
    find_relief: 'அருகிலுள்ள நிவாரண முகாம்கள்',
    submit_field_report: 'தகவல் பதிவு செய்க',
    call: 'அழைக்கவும்',
    directions: 'வழித்தடம்',
    details: 'விவரங்கள்',
    all_clear: 'இயல்பு நிலை. ஆபத்து எச்சரிக்கைகள் இல்லை.',
    mark_all_read: 'அனைத்தையும் படித்ததாகக் குறிக்கவும்',
    cancel: 'ரத்து செய்',
    submit: 'சமர்ப்பிக்கவும்',
    monitored_sectors: 'கண்காணிக்கப்படும் பகுதிகள்',
    add_sector: 'பகுதியைச் சேர்க்கவும்',
    what_we_know: 'உறுதிப்படுத்தப்பட்ட தகவல்கள்',
    contributing_factors: 'ஆபத்து காரணிகள்',
    recommended_actions: 'பரிந்துரைக்கப்பட்ட பாதுகாப்பு நடவடிக்கைகள்',
    regional_news_wire: 'பிராந்திய செய்தி சேவை',
    evidence_sources: 'ஆதாரங்கள் மற்றும் சான்றுகள்',
    timeline: 'நிகழ்வு காலவரிசை',
    critical_risk: 'மிகத் தீவிர ஆபத்து',
    high_risk: 'அதிக ஆபத்து',
    moderate_risk: 'மிதமான ஆபத்து',
    low_risk: 'குறைந்த ஆபத்து',
    verified: 'சரிபார்க்கப்பட்டது',
    corroborated: 'உறுதிப்படுத்தப்பட்டது',
    under_review: 'ஆய்வில் உள்ளது',
    unverified: 'சரிபார்க்கப்படாதது',
    location_permission: 'இருப்பிட அனுமதி',
    auto_location_detect: 'தானியங்கி இருப்பிடக் கண்டறிதல்',
    auto_location_desc: 'உள்ளூர் ஆபத்துகளை அறிய GPS ஐப் பயன்படுத்தவும்.',
    push_notifications: 'எச்சரிக்கை அறிவிப்புகள்',
    critical_high_alerts: 'தீவிர எச்சரிக்கை அறிவிப்புகள்',
    moderate_alerts: 'மிதமான எச்சரிக்கை அறிவிப்புகள்',
    public_safety_notice: 'இந்த அமைப்பு முடிவெடுக்க உதவுகிறது. அதிகாரப்பூர்வ உத்தரவுகளே முதன்மையானவை.',
  },

  te: {
    app_title: 'విపత్తు నియంత్రణ కేంద్రం',
    app_subtitle: 'భారతదేశం // బహుళ-మూలాల విపత్తు సమాచార వ్యవస్థ',
    decision_support: 'నిర్ణయ మద్దతు వ్యవస్థ — ఇది NDMA / SDMA అధికారిక ఆదేశాలకు ప్రత్యామ్నాయం కాదు.',
    live: 'లైవ్',
    dark: 'డార్క్',
    light: 'లైట్',
    dashboard: 'డాష్‌బోర్డ్',
    gis_map: 'జీఐఎస్ మ్యాప్',
    resources: 'సహాయక వనరులు',
    report: 'రిపోర్ట్ చేయండి',
    sources: 'డేటా వనరులు',
    alerts: 'హెచ్చరికలు',
    settings: 'సెట్టింగ్‌లు',
    search_sector: 'ప్రాంతాన్ని శోధించండి',
    active_hazards: 'ప్రస్తుత ప్రమాదాలు',
    verified_reports: 'ధృవీకరించబడిన నివేదికలు',
    relief_centers: 'పునరావాస కేంద్రాలు',
    data_sources: 'డేటా మూలాలు',
    emergency_dispatch: 'అత్యవసర సహాయం',
    what_is_happening: 'ఏం జరుగుతోంది?',
    can_i_trust_it: 'నేను దీన్ని నమ్మవచ్చా?',
    what_should_i_do: 'నేను ఏమి చేయాలి?',
    switch_theme: 'థీమ్ ఎంపిక',
    language_setting: 'భాష మరియు ప్రాంతీయ సెట్టింగ్‌లు',
    select_language: 'భాషను ఎంచుకోండి',
    preferences_saved: 'ప్రాధాన్యతలు భద్రపరచబడ్డాయి',
    save_preferences: 'సేవ్ చేయండి',
    return_dashboard: 'డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
    view_intel_dossier: 'పూర్తి వివరాలు చూడండి',
    find_relief: 'సమీప సహాయ కేంద్రాలను కనుగొనండి',
    submit_field_report: 'సమాచారాన్ని నమోదు చేయండి',
    call: 'కాల్ చేయండి',
    directions: 'దారి చూపించు',
    details: 'వివరాలు',
    all_clear: 'సాధారణ పరిస్థితి. ప్రమాద హెచ్చరికలు లేవు.',
    mark_all_read: 'అన్నీ చదివినట్లు గుర్తించండి',
    cancel: 'రద్దు చేయండి',
    submit: 'సమర్పించండి',
    monitored_sectors: 'పర్యవేక్షించబడుతున్న ప్రాంతాలు',
    add_sector: 'ప్రాంతాన్ని జోడించండి',
    what_we_know: 'ధృవీకరించబడిన వాస్తవాలు',
    contributing_factors: 'ప్రమాద కారకాలు',
    recommended_actions: 'సూచించిన భద్రతా చర్యలు',
    regional_news_wire: 'ప్రాంతీయ వార్తలు',
    evidence_sources: 'ఆధారాలు మరియు మూలాలు',
    timeline: 'కాలక్రమం',
    critical_risk: 'తీవ్ర ప్రమాదం',
    high_risk: 'అధిక ప్రమాదం',
    moderate_risk: 'మధ్యస్థ ప్రమాదం',
    low_risk: 'తక్కువ ప్రమాదం',
    verified: 'ధృవీకరించబడింది',
    corroborated: 'నిర్ధారించబడింది',
    under_review: 'సమీక్షలో ఉంది',
    unverified: 'ధృవీకరించబడలేదు',
    location_permission: 'లొకేషన్ అనుమతి',
    auto_location_detect: 'ఆటోమేటిక్ లొకేషన్ గుర్తింపు',
    auto_location_desc: 'స్థానిక ప్రమాదాలను గుర్తించడానికి GPS ఉపయోగించండి.',
    push_notifications: 'హెచ్చరికల నోటిఫికేషన్లు',
    critical_high_alerts: 'తీవ్ర హెచ్చరికలు',
    moderate_alerts: 'సాధారణ హెచ్చరికలు',
    public_safety_notice: 'ఈ వ్యవస్థ నిర్ణయ మద్దతు అందిస్తుంది. అధికారిక ఆదేశాలు పాటించండి.',
  },

  bn: {
    app_title: 'দুর্যোগ নিয়ন্ত্রণ কেন্দ্র',
    app_subtitle: 'ভারত // বহু-উৎস দুর্যোগ গোয়েন্দা তথ্য ব্যবস্থা',
    decision_support: 'সিদ্ধান্ত সহায়তা ব্যবস্থা — এটি NDMA / SDMA এর অফিসিয়াল নির্দেশের বিকল্প নয়।',
    live: 'লাইভ',
    dark: 'ডার্ক',
    light: 'লাইট',
    dashboard: 'ড্যাশবোর্ড',
    gis_map: 'জিআইএস মানচিত্র',
    resources: 'ত্রাণ সম্পদ',
    report: 'রিপোর্ট করুন',
    sources: 'উৎসসমূহ',
    alerts: 'সতর্কবার্তা',
    settings: 'সেটিংস',
    search_sector: 'অঞ্চল বা শহর খুঁজুন',
    active_hazards: 'সক্রিয় দুর্যোগ',
    verified_reports: 'যাচাইকৃত রিপোর্ট',
    relief_centers: 'ত্রাণ কেন্দ্র',
    data_sources: 'তথ্য উৎসসমূহ',
    emergency_dispatch: 'জরুরি সহায়তা',
    what_is_happening: 'কী ঘটছে?',
    can_i_trust_it: 'আমি কি এটি বিশ্বাস করতে পারি?',
    what_should_i_do: 'আমার কী করা উচিত?',
    switch_theme: 'থিম পরিবর্তন',
    language_setting: 'ভাষা ও আঞ্চলিক সেটিংস',
    select_language: 'ভাষা নির্বাচন করুন',
    preferences_saved: 'পছন্দসমূহ সংরক্ষিত হয়েছে',
    save_preferences: 'সংরক্ষণ করুন',
    return_dashboard: 'ড্যাশবোর্ডে ফিরুন',
    view_intel_dossier: 'বিস্তারিত প্রতিবেদন দেখুন',
    find_relief: 'নিকটবর্তী ত্রাণ কেন্দ্র খুঁজুন',
    submit_field_report: 'তথ্য রিপোর্ট জমা দিন',
    call: 'কল করুন',
    directions: 'দিকনির্দেশ',
    details: 'বিবরণ',
    all_clear: 'স্বাভাবিক পরিস্থিতি। কোনো বিপদ সংকেত নেই।',
    mark_all_read: 'সব পঠিত হিসেবে চিহ্নিত করুন',
    cancel: 'বাতিল',
    submit: 'জমা দিন',
    monitored_sectors: 'নজরদারিকৃত অঞ্চল',
    add_sector: 'অঞ্চল যোগ করুন',
    what_we_know: 'যাচাইকৃত তথ্য ও পরিস্থিতি',
    contributing_factors: 'ঝুঁকির কারণসমূহ',
    recommended_actions: 'প্রস্তাবিত নিরাপত্তা পদক্ষেপ',
    regional_news_wire: 'আঞ্চলিক সংবাদ সেবা',
    evidence_sources: 'প্রমাণ ও তথ্য উৎস',
    timeline: 'সময়রেখা',
    critical_risk: 'চরম ঝুঁকি',
    high_risk: 'উচ্চ ঝুঁকি',
    moderate_risk: 'মাঝারি ঝুঁকি',
    low_risk: 'কম ঝুঁকি',
    verified: 'যাচাইকৃত',
    corroborated: 'সমর্থিত',
    under_review: 'পর্যালোচনাধীন',
    unverified: 'অযাচাইকৃত',
    location_permission: 'অবস্থান অনুমতি',
    auto_location_detect: 'স্বয়ংক্রিয় অবস্থান সনাক্তকরণ',
    auto_location_desc: 'স্থানীয় ঝুঁকি জানার জন্য GPS ব্যবহার করুন।',
    push_notifications: 'সতর্কবার্তা বিজ্ঞপ্তি',
    critical_high_alerts: 'চরম ও উচ্চ ঝুঁকি সতর্কতা',
    moderate_alerts: 'সাধারণ সতর্কতা',
    public_safety_notice: 'এই ব্যবস্থা সিদ্ধান্ত সহায়তা প্রদান করে। সরকারি নির্দেশনাই চূড়ান্ত।',
  },

  mr: {
    app_title: 'आपत्ती नियंत्रण केंद्र',
    app_subtitle: 'भारत // बहु-स्रोत आपत्ती गुप्तवार्ता प्रणाली',
    decision_support: 'निर्णय समर्थन प्रणाली — हे NDMA / SDMA च्या अधिकृत निर्देशांची जागा घेत नाही.',
    live: 'थेट (लाइव्ह)',
    dark: 'डार्क',
    light: 'लाइट',
    dashboard: 'डॅशबोर्ड',
    gis_map: 'GIS नकाशा',
    resources: 'मदत व संसाधने',
    report: 'नोंदवा',
    sources: 'माहिती स्रोत',
    alerts: 'इशारे',
    settings: 'सेटिंग्ज',
    search_sector: 'परिसर किंवा शहर शोधा',
    active_hazards: 'सक्रिय धोके',
    verified_reports: 'पडताळलेले अहवाल',
    relief_centers: 'मदत केंद्रे',
    data_sources: 'डेटा स्रोत',
    emergency_dispatch: 'आपत्कालीन मदत',
    what_is_happening: 'काय घडत आहे?',
    can_i_trust_it: 'यावर विश्वास ठेवू शकतो का?',
    what_should_i_do: 'मी काय करावे?',
    switch_theme: 'थीम निवडा',
    language_setting: 'भाषा व प्रादेशिक सेटिंग्ज',
    select_language: 'भाषा निवडा',
    preferences_saved: 'प्राधान्ये जतन केली',
    save_preferences: 'जतन करा',
    return_dashboard: 'डॅशबोर्डवर परत जा',
    view_intel_dossier: 'सविस्तर अहवाल पहा',
    find_relief: 'जवळची मदत केंद्रे शोधा',
    submit_field_report: 'घटना नोंदवा',
    call: 'कॉल करा',
    directions: 'मार्ग पहा',
    details: 'तपशील',
    all_clear: 'सामान्य परिस्थिती. कोणताही धोका नाही.',
    mark_all_read: 'सर्व वाचलेले चिन्हांकित करा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    monitored_sectors: 'निरीक्षणाखालील भाग',
    add_sector: 'भाग जोडा',
    what_we_know: 'पडताळलेली वस्तुस्थिती',
    contributing_factors: 'धोका निर्माण करणारे घटक',
    recommended_actions: 'सुरक्षा मार्गदर्शक तत्त्वे',
    regional_news_wire: 'प्रादेशिक वृत्त सेवा',
    evidence_sources: 'पुरावे आणि स्रोत',
    timeline: 'घटनाक्रम',
    critical_risk: 'अति गंभीर धोका',
    high_risk: 'उच्च धोका',
    moderate_risk: 'मध्यम धोका',
    low_risk: 'कमी धोका',
    verified: 'पडताळलेले',
    corroborated: 'पुष्टी झालेले',
    under_review: 'तपासणी सुरू',
    unverified: 'अपडताळलेले',
    location_permission: 'स्थान परवानगी',
    auto_location_detect: 'स्वयंचलित स्थान शोध',
    auto_location_desc: 'स्थानिक धोके ओळखण्यासाठी GPS वापरा.',
    push_notifications: 'सूचना व इशारे',
    critical_high_alerts: 'गंभीर व उच्च धोक्याचे इशारे',
    moderate_alerts: 'मध्यम इशारे',
    public_safety_notice: 'ही प्रणाली निर्णय समर्थनासाठी आहे. अधिकृत सरकारी आदेश अंतिम आहेत.',
  },

  kn: {
    app_title: 'ವಿಪತ್ತು ನಿಯಂತ್ರಣ ಕೇಂದ್ರ',
    app_subtitle: 'ಭಾರತ // ಬಹು-ಮೂಲ ವಿಪತ್ತು ಗುಪ್ತಚರ ವ್ಯವಸ್ಥೆ',
    decision_support: 'ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ — ಇದು NDMA / SDMA ಅಧಿಕೃತ ಸೂಚನೆಗಳಿಗೆ ಪರ್ಯಾಯವಲ್ಲ.',
    live: 'ಲೈವ್',
    dark: 'ಡಾರ್ಕ್',
    light: 'ಲೈಟ್',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    gis_map: 'ಜಿಐಎಸ್ ನಕ್ಷೆ',
    resources: 'ಪರಿಹಾರ ಸಂಪನ್ಮೂಲಗಳು',
    report: 'ವರದಿ ಮಾಡಿ',
    sources: 'ಮಾಹಿತಿ ಮೂಲಗಳು',
    alerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    search_sector: 'ಪ್ರದೇಶವನ್ನು ಹುಡುಕಿ',
    active_hazards: 'ಸಕ್ರಿಯ ಅಪಾಯಗಳು',
    verified_reports: 'ದೃಢೀಕರಿಸಿದ ವರದಿಗಳು',
    relief_centers: 'ಪರಿಹಾರ ಕೇಂದ್ರಗಳು',
    data_sources: 'ಡೇಟಾ ಮೂಲಗಳು',
    emergency_dispatch: 'ತುರ್ತು ನೆರವು',
    what_is_happening: 'ಏನು ನಡೆಯುತ್ತಿದೆ?',
    can_i_trust_it: 'ನಾನು ಇದನ್ನು ನಂಬಬಹುದೇ?',
    what_should_i_do: 'ನಾನು ಏನು ಮಾಡಬೇಕು?',
    switch_theme: 'ಥೀಮ್ ಆಯ್ಕೆ',
    language_setting: 'ಭಾಷೆ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    select_language: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    preferences_saved: 'ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ',
    save_preferences: 'ಉಳಿಸಿ',
    return_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    view_intel_dossier: 'ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    find_relief: 'ಸಮೀಪದ ಪರಿಹಾರ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ',
    submit_field_report: 'ವರದಿಯನ್ನು ಸಲ್ಲಿಸಿ',
    call: 'ಕರೆ ಮಾಡಿ',
    directions: 'ಮಾರ್ಗ ನೋಡಿ',
    details: 'ವಿವರಗಳು',
    all_clear: 'ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ. ಯಾವುದೇ ಅಪಾಯದ ಸೂಚನೆಗಳಿಲ್ಲ.',
    mark_all_read: 'ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    submit: 'ಸಲ್ಲಿಸಿ',
    monitored_sectors: 'ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಪ್ರದೇಶಗಳು',
    add_sector: 'ಪ್ರದೇಶ ಸೇರಿಸಿ',
    what_we_know: 'ದೃಢೀಕರಿಸಿದ ಸತ್ಯಗಳು',
    contributing_factors: 'ಅಪಾಯದ ಅಂಶಗಳು',
    recommended_actions: 'ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು',
    regional_news_wire: 'ಪ್ರಾದೇಶಿಕ ಸುದ್ದಿ ವಾಹಿನಿ',
    evidence_sources: 'ಪುರಾವೆಗಳು ಮತ್ತು ಮೂಲಗಳು',
    timeline: 'ಸಮಯಾವಳಿ',
    critical_risk: 'ತೀವ್ರ ಅಪಾಯ',
    high_risk: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    moderate_risk: 'ಮಧ್ಯಮ ಅಪಾಯ',
    low_risk: 'ಕಡಿಮೆ ಅಪಾಯ',
    verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    corroborated: 'ಖಚಿತಪಡಿಸಲಾಗಿದೆ',
    under_review: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    unverified: 'ದೃಢೀಕರಿಸಿಲ್ಲ',
    location_permission: 'ಸ್ಥಳ ಅನುಮತಿ',
    auto_location_detect: 'ಸ್ವಯಂಚಾಲಿತ ಸ್ಥಳ ಪತ್ತೆ',
    auto_location_desc: 'ಸ್ಥಳೀಯ ಅಪಾಯಗಳನ್ನು ತಿಳಿಯಲು GPS ಬಳಸಿ.',
    push_notifications: 'ಎಚ್ಚರಿಕೆ ಅಧಿಸೂಚನೆಗಳು',
    critical_high_alerts: 'ತೀವ್ರ ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳು',
    moderate_alerts: 'ಸಾಮಾನ್ಯ ಎಚ್ಚರಿಕೆಗಳು',
    public_safety_notice: 'ಈ ವ್ಯವಸ್ಥೆಯು ನಿರ್ಧಾರಕ್ಕೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ. ಅಧಿಕೃತ ಆದೇಶಗಳು ಅಂತಿಮ.',
  },

  or: {
    app_title: 'ବିପର୍ଯ୍ୟୟ ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର',
    app_subtitle: 'ଭାରତ // ବହୁ-ଉତ୍ସ ବିପର୍ଯ୍ୟୟ ସୂଚନା ବ୍ୟବସ୍ଥା',
    decision_support: 'ନିଷ୍ପତ୍ତି ସହାୟତା ବ୍ୟବସ୍ଥା — ଏହା NDMA / SDMA ର ସରକାରୀ ନିର୍ଦ୍ଦେଶର ବିକଳ୍ପ ନୁହେଁ।',
    live: 'ଲାଇଭ୍',
    dark: 'ଡାର୍କ',
    light: 'ଲାଇଟ୍',
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    gis_map: 'GIS ମାନଚିତ୍ର',
    resources: 'ରିଲିଫ୍ ସମ୍ବଳ',
    report: 'ରିପୋର୍ଟ କରନ୍ତୁ',
    sources: 'ଉତ୍ସଗୁଡ଼ିକ',
    alerts: 'ଚେତାବନୀ',
    settings: 'ସେଟିଙ୍ଗ୍ସ',
    search_sector: 'ଅଞ୍ଚଳ କିମ୍ବା ସହର ଖୋଜନ୍ତୁ',
    active_hazards: 'ସକ୍ରିୟ ବିପଦ',
    verified_reports: 'ଯାଞ୍ଚ ହୋଇଥିବା ରିପୋର୍ଟ',
    relief_centers: 'ରିଲିଫ୍ କେନ୍ଦ୍ର',
    data_sources: 'ଡାଟା ଉତ୍ସ',
    emergency_dispatch: 'ଜରୁରୀକାଳୀନ ସହାୟତା',
    what_is_happening: 'କ’ଣ ଘଟୁଛି?',
    can_i_trust_it: 'ମୁଁ ଏହା ଉପରେ ବିଶ୍ୱାସ କରିପାରିବି କି?',
    what_should_i_do: 'ମୁଁ କ’ଣ କରିବା ଉଚିତ୍?',
    switch_theme: 'ଇଣ୍ଟରଫେସ୍ ଥିମ୍',
    language_setting: 'ଭାଷା ଏବଂ ଆଞ୍ଚଳିକ ସେଟିଙ୍ଗ୍ସ',
    select_language: 'ଭାଷା ଚୟନ କରନ୍ତୁ',
    preferences_saved: 'ପସନ୍ଦ ସଂରକ୍ଷିତ ହେଲା',
    save_preferences: 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
    return_dashboard: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ',
    view_intel_dossier: 'ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଦେଖନ୍ତୁ',
    find_relief: 'ନିକଟସ୍ଥ ରିଲିଫ୍ କେନ୍ଦ୍ର ଖୋଜନ୍ତୁ',
    submit_field_report: 'ଘଟଣା ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ',
    call: 'କଲ୍ କରନ୍ତୁ',
    directions: 'ରାସ୍ତା ଦେଖନ୍ତୁ',
    details: 'ବିବରଣୀ',
    all_clear: 'ସ୍ୱାଭାବିକ ପରିସ୍ଥିତି। କୌଣସି ବିପଦ ସଙ୍କେତ ନାହିଁ।',
    mark_all_read: 'ସବୁ ପଢ଼ାଯାଇଛି ବୋଲି ଚିହ୍ନିତ କରନ୍ତୁ',
    cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    submit: 'ଦାଖଲ କରନ୍ତୁ',
    monitored_sectors: 'ନିରୀକ୍ଷଣ ଅଞ୍ଚଳ',
    add_sector: 'ଅଞ୍ଚଳ ଯୋଡନ୍ତୁ',
    what_we_know: 'ଯାଞ୍ଚ ହୋଇଥିବା ତଥ୍ୟ',
    contributing_factors: 'ବିପଦର କାରଣ',
    recommended_actions: 'ସୁରକ୍ଷା ପରାମର୍ଶ ଏବଂ ପଦକ୍ଷେପ',
    regional_news_wire: 'ଆଞ୍ଚଳିକ ଖବର ସେବା',
    evidence_sources: 'ପ୍ରମାଣ ଏବଂ ଡାଟା ଉତ୍ସ',
    timeline: 'ସମୟସୂଚୀ',
    critical_risk: 'ଅତି ଗୁରୁତର ବିପଦ',
    high_risk: 'ଉଚ୍ଚ ବିପଦ',
    moderate_risk: 'ମଧ୍ୟମ ବିପଦ',
    low_risk: 'କମ୍ ବିପଦ',
    verified: 'ଯାଞ୍ଚ ହୋଇଛି',
    corroborated: 'ପ୍ରମାଣିତ',
    under_review: 'ସମୀକ୍ଷାଧୀନ',
    unverified: 'ଅପ୍ରମାଣିତ',
    location_permission: 'ସ୍ଥାନ ଅନୁମତି',
    auto_location_detect: 'ସ୍ୱୟଂଚାଳିତ ସ୍ଥାନ ଚିହ୍ନଟ',
    auto_location_desc: 'ସ୍ଥାନୀୟ ବିପଦ ଜାଣିବା ପାଇଁ GPS ବ୍ୟବହାର କରନ୍ତୁ।',
    push_notifications: 'ଚେତାବନୀ ବିଜ୍ଞପ୍ତି',
    critical_high_alerts: 'ଗୁରୁତର ଏବଂ ଉଚ୍ଚ ବିପଦ ସତର୍କତା',
    moderate_alerts: 'ସାଧାରଣ ସତର୍କତା',
    public_safety_notice: 'ଏହି ବ୍ୟବସ୍ଥା ନିଷ୍ପତ୍ତି ସହାୟତା ପ୍ରଦାନ କରେ। ସରକାରୀ ନିର୍ଦ୍ଦେଶ ସର୍ବୋପରି।',
  },

  pa: {
    app_title: 'ਆਫ਼ਤ ਕੰਟਰੋਲ ਕੇਂਦਰ',
    app_subtitle: 'ਭਾਰਤ // ਬਹੁ-ਸਰੋਤ ਆਫ਼ਤ ਖ਼ੁਫ਼ੀਆ ਪ੍ਰਣਾਲੀ',
    decision_support: 'ਫੈਸਲਾ ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀ — ਇਹ NDMA / SDMA ਦੇ ਸਰਕਾਰੀ ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਥਾਂ ਨਹੀਂ ਲੈਂਦੀ।',
    live: 'ਲਾਈਵ',
    dark: 'ਡਾਰਕ',
    light: 'ਲਾਈਟ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    gis_map: 'GIS ਨਕਸ਼ਾ',
    resources: 'ਰਾਹਤ ਸਰੋਤ',
    report: 'ਰਿਪੋਰਟ ਕਰੋ',
    sources: 'ਡਾਟਾ ਸਰੋਤ',
    alerts: 'ਚੇਤਾਵਨੀਆਂ',
    settings: 'ਸੈਟਿੰਗਾਂ',
    search_sector: 'ਖੇਤਰ ਜਾਂ ਸ਼ਹਿਰ ਲੱਭੋ',
    active_hazards: 'ਸਰਗਰਮ ਖ਼ਤਰੇ',
    verified_reports: 'ਤਸਦੀਕਸ਼ੁਦਾ ਰਿਪੋਰਟਾਂ',
    relief_centers: 'ਰਾਹਤ ਕੇਂਦਰ',
    data_sources: 'ਡਾਟਾ ਸਰੋਤ',
    emergency_dispatch: 'ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ',
    what_is_happening: 'ਕੀ ਹੋ ਰਿਹਾ ਹੈ?',
    can_i_trust_it: 'ਕੀ ਮੈਂ ਇਸ ਤੇ ਭਰੋਸਾ ਕਰ ਸਕਦਾ ਹਾਂ?',
    what_should_i_do: 'ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
    switch_theme: 'ਇੰਟਰਫੇਸ ਥੀਮ',
    language_setting: 'ਭਾਸ਼ਾ ਅਤੇ ਖੇਤਰੀ ਸੈਟਿੰਗਾਂ',
    select_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    preferences_saved: 'ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ ਕੀਤੀਆਂ ਗਈਆਂ',
    save_preferences: 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
    return_dashboard: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ',
    view_intel_dossier: 'ਪੂਰਾ ਵੇਰਵਾ ਵੇਖੋ',
    find_relief: 'ਨੇੜਲੇ ਰਾਹਤ ਕੇਂਦਰ ਲੱਭੋ',
    submit_field_report: 'ਘਟਨਾ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    call: 'ਕਾਲ ਕਰੋ',
    directions: 'ਰਸਤਾ ਵੇਖੋ',
    details: 'ਵੇਰਵੇ',
    all_clear: 'ਆਮ ਸਥਿਤੀ। ਕੋਈ ਖ਼ਤਰਾ ਨਹੀਂ।',
    mark_all_read: 'ਸਭ ਪੜ੍ਹਿਆ ਵਜੋਂ ਚਿੰਨ੍ਹਿਤ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    monitored_sectors: 'ਨਿਗਰਾਨੀ ਅਧੀਨ ਖੇਤਰ',
    add_sector: 'ਖੇਤਰ ਸ਼ਾਮਲ ਕਰੋ',
    what_we_know: 'ਤਸਦੀਕਸ਼ੁਦਾ ਤੱਥ',
    contributing_factors: 'ਖ਼ਤਰੇ ਦੇ ਕਾਰਕ',
    recommended_actions: 'ਸੁਰੱਖਿਆ ਉਪਾਅ ਅਤੇ ਨਿਰਦੇਸ਼',
    regional_news_wire: 'ਖੇਤਰੀ ਖ਼ਬਰਾਂ',
    evidence_sources: 'ਸਬੂਤ ਅਤੇ ਸਰੋਤ',
    timeline: 'ਸਮਾਂ-ਰੇਖਾ',
    critical_risk: 'ਅਤਿ ਗੰਭੀਰ ਖ਼ਤਰਾ',
    high_risk: 'ਉੱਚ ਖ਼ਤਰਾ',
    moderate_risk: 'ਦਰਮਿਆਨਾ ਖ਼ਤਰਾ',
    low_risk: 'ਘੱਟ ਖ਼ਤਰਾ',
    verified: 'ਤਸਦੀਕਸ਼ੁਦਾ',
    corroborated: 'ਪੁਸ਼ਟੀ ਕੀਤੀ',
    under_review: 'ਜਾਂਚ ਅਧੀਨ',
    unverified: 'ਗ਼ੈਰ-ਤਸਦੀਕਸ਼ੁਦਾ',
    location_permission: 'ਸਥਾਨ ਇਜਾਜ਼ਤ',
    auto_location_detect: 'ਆਟੋਮੈਟਿਕ ਸਥਾਨ ਖੋਜ',
    auto_location_desc: 'ਸਥਾਨਕ ਖ਼ਤਰਿਆਂ ਦਾ ਪਤਾ ਲਗਾਉਣ ਲਈ GPS ਵਰਤੋ।',
    push_notifications: 'ਚੇਤਾਵਨੀ ਸੂਚਨਾਵਾਂ',
    critical_high_alerts: 'ਗੰਭੀਰ ਅਤੇ ਉੱਚ ਖ਼ਤਰੇ ਦੀਆਂ ਚੇਤਾਵਨੀਆਂ',
    moderate_alerts: 'ਆਮ ਚੇਤਾਵਨੀਆਂ',
    public_safety_notice: 'ਇਹ ਪ੍ਰਣਾਲੀ ਫੈਸਲੇ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ। ਸਰਕਾਰੀ ਨਿਰਦੇਸ਼ ਸਰਵਉੱਚ ਹਨ।',
  },

  as: {
    app_title: 'দুর্যোগ নিয়ন্ত্ৰণ কেন্দ্ৰ',
    app_subtitle: 'ভাৰত // বহু-উৎসীয় দুর্যোগ তথ্য ব্যৱস্থা',
    decision_support: 'সিদ্ধান্ত সমৰ্থন ব্যৱস্থা — ই NDMA / SDMA ৰ চৰকাৰী নিৰ্দেশৰ বিকল্প নহয়।',
    live: 'লাইভ',
    dark: 'ডাৰ্ক',
    light: 'লাইট',
    dashboard: 'ডেশ্ববৰ্ড',
    gis_map: 'GIS মানচিত্ৰ',
    resources: 'সাহায্য সম্পদ',
    report: 'তথ্য জনাওক',
    sources: 'তথ্য উৎস',
    alerts: 'সতৰ্কবাৰ্তা',
    settings: 'ছেটিংছ',
    search_sector: 'অঞ্চল বা চহৰ সন্ধান কৰক',
    active_hazards: 'সক্ৰিয় দুৰ্যোগ',
    verified_reports: 'পৰীক্ষিত প্ৰতিবেদন',
    relief_centers: 'সাহায্য শিবিৰ',
    data_sources: 'তথ্যৰ উৎসসমূহ',
    emergency_dispatch: 'জৰুৰীকালীন সাহায্য',
    what_is_happening: 'কি ঘটিছে?',
    can_i_trust_it: 'মই ইয়াক বিশ্বাস কৰিব পাৰোনে?',
    what_should_i_do: 'মই কি কৰা উচিত?',
    switch_theme: 'থীম পৰিৱৰ্তন',
    language_setting: 'ভাষা আৰু আঞ্চলিক ছেটিংছ',
    select_language: 'ভাষা বাছনি কৰক',
    preferences_saved: 'পছন্দসমূহ সংৰক্ষণ কৰা হ’ল',
    save_preferences: 'সংৰক্ষণ কৰক',
    return_dashboard: 'ডেশ্ববৰ্ডলৈ উভতি যাওক',
    view_intel_dossier: 'সম্পূৰ্ণ বিৱৰণ চাওক',
    find_relief: 'ওচৰৰ সাহায্য শিবিৰ সন্ধান কৰক',
    submit_field_report: 'তথ্য দাখিল কৰক',
    call: 'কল কৰক',
    directions: 'পথ নিৰ্দেশনা',
    details: 'বিৱৰণ',
    all_clear: 'স্বাভাৱিক অৱস্থা। কোনো বিপদৰ সংকেত নাই।',
    mark_all_read: 'সকলো পঢ়া বুলি চিহ্নিত কৰক',
    cancel: 'বাতিল কৰক',
    submit: 'দাখিল কৰক',
    monitored_sectors: 'নিৰীক্ষণ কৰা অঞ্চলসমূহ',
    add_sector: 'অঞ্চল যোগ কৰক',
    what_we_know: 'পৰীক্ষিত তথ্য আৰু স্থিতি',
    contributing_factors: 'বিপদৰ কাৰকসমূহ',
    recommended_actions: 'পৰামৰ্শিত নিৰাপত্তা পদক্ষেপ',
    regional_news_wire: 'আঞ্চলিক বাতৰি সেৱা',
    evidence_sources: 'প্ৰমাণ আৰু তথ্য উৎস',
    timeline: 'সময়ৰেখা',
    critical_risk: 'চৰম বিপদ',
    high_risk: 'উচ্চ বিপদ',
    moderate_risk: 'মধ্যম বিপদ',
    low_risk: 'কম বিপদ',
    verified: 'পৰীক্ষিত',
    corroborated: 'সমৰ্থিত',
    under_review: 'পৰ্যালোচনা চলি আছে',
    unverified: 'অপৰীক্ষিত',
    location_permission: 'স্থান অনুমতি',
    auto_location_detect: 'স্বয়ংক্ৰিয় স্থান চিনাক্তকৰণ',
    auto_location_desc: 'স্থানীয় বিপদ জানিবলৈ GPS ব্যৱহাৰ কৰক।',
    push_notifications: 'সতৰ্কবাৰ্তা অধিসূচনা',
    critical_high_alerts: 'চৰম আৰু উচ্চ বিপদৰ সতৰ্কবাৰ্তা',
    moderate_alerts: 'সাধাৰণ সতৰ্কবাৰ্তা',
    public_safety_notice: 'এই ব্যৱস্থাই সিদ্ধান্ত সমৰ্থন আগবঢ়ায়। চৰকাৰী নিৰ্দেশনাই সৰ্বোচ্চ।',
  },
};

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  tText: (text: string) => string;
  currentLangOption: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  tText: (text) => text,
  currentLangOption: SUPPORTED_LANGUAGES[0],
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const stored = localStorage.getItem('disaster-intel-lang');
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('disaster-intel-lang', lang);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] as Partial<Record<TranslationKey, string>>;
    if (langDict && langDict[key]) {
      return langDict[key]!;
    }
    const defaultDict = TRANSLATIONS['en'];
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  const DYNAMIC_MAP: Record<string, Record<LanguageCode, string>> = {
    // Cities / Places
    'ahmedabad': { en: 'Ahmedabad', hi: 'अहमदाबाद', gu: 'અમદાવાદ', ml: 'അഹമ്മദാബാദ്', ta: 'அகமதாபாத்', te: 'అహ్మదాబాద్', bn: 'আহমেদাবাদ', mr: 'अहमदाबाद', kn: 'ಅಹಮದಾಬಾದ್', or: 'ଅହମଦାବାଦ', pa: 'ਅਹਿਮਦਾਬਾਦ', as: 'আহমেদাবাদ' },
    'wayanad': { en: 'Wayanad', hi: 'वायनाड', gu: 'વાયનાડ', ml: 'വയനാട്', ta: 'வயநாடு', te: 'వయనాడ్', bn: 'ওয়ায়ানাদ', mr: 'वायनाड', kn: 'ವಯನಾಡ್', or: 'ୱାୟନାଡ୍', pa: 'ਵਾਇਨਾਡ', as: 'ৱায়ানাড' },
    'mumbai': { en: 'Mumbai', hi: 'मुंबई', gu: 'મુંબઈ', ml: 'മുംബൈ', ta: 'மும்பை', te: 'ముంబై', bn: 'মুম্বই', mr: 'मुंबई', kn: 'ಮುಂಬೈ', or: 'ਮੁੰਬਈ', pa: 'ਮੁੰਬਈ', as: 'মুম্বাই' },
    'chennai': { en: 'Chennai', hi: 'चेन्नई', gu: 'ચેન્નઈ', ml: 'ചെന്നൈ', ta: 'சென்னை', te: 'చెన్నై', bn: 'চেন্নাই', mr: 'चेन्नई', kn: 'ಚೆನ್ನೈ', or: 'ଚେନ୍ନାଇ', pa: 'ਚੇਨਈ', as: 'চেন্নাই' },
    'new delhi': { en: 'New Delhi', hi: 'नई दिल्ली', gu: 'નવી દિલ્હી', ml: 'ന്യൂഡൽഹി', ta: 'புது தில்லி', te: 'న్యూఢిల్లీ', bn: 'নয়া দিল্লি', mr: 'नवी दिल्ली', kn: 'ನವದೆಹಲಿ', or: 'ନୂଆଦିଲ୍ଲୀ', pa: 'ਨਵੀਂ ਦਿੱਲੀ', as: 'নতুন দিল্লী' },
    'delhi': { en: 'Delhi', hi: 'दिल्ली', gu: 'દિલ્હી', ml: 'ഡൽഹി', ta: 'டெல்லி', te: 'ఢిల్లీ', bn: 'দিল্লি', mr: 'दिल्ली', kn: 'ದೆಹಲಿ', or: 'ଦିଲ୍ଲୀ', pa: 'ਦਿੱਲੀ', as: 'দিল্লী' },
    'guwahati': { en: 'Guwahati', hi: 'गुवाहाटी', gu: 'ગુવાહાટી', ml: 'ഗുവാഹത്തി', ta: 'கௌகாத்தி', te: 'గౌహతి', bn: 'গুয়াহাটি', mr: 'गुवाहाटी', kn: 'ಗುವಾಹಟಿ', or: 'ଗୁଆହାଟୀ', pa: 'ਗੁਹਾਟੀ', as: 'গুৱাহাটী' },
    'puri': { en: 'Puri', hi: 'पुरी', gu: 'પુરી', ml: 'പൂരി', ta: 'பூரி', te: 'పూరి', bn: 'পুরী', mr: 'पुरी', kn: 'ಪುರಿ', or: 'ପୁରୀ', pa: 'ਪੁਰੀ', as: 'পুৰী' },
    'bhubaneswar': { en: 'Bhubaneswar', hi: 'भुवनेश्वर', gu: 'ભુવનેશ્વર', ml: 'ഭുവനേശ്വർ', ta: 'புவனேஸ்வர்', te: 'భువనేశ్వర్', bn: 'ভুবনেশ্বর', mr: 'भुवनेश्वर', kn: 'ಭುವನೇಶ್ವರ', or: 'ଭୁବନେଶ୍ୱର', pa: 'ਭੁਵਨੇਸ਼ਵਰ', as: 'ভুৱনেশ্বৰ' },
    'joshimath': { en: 'Joshimath', hi: 'जोशीमठ', gu: 'જોશીમઠ', ml: 'ജോഷിമഠ്', ta: 'ஜோஷிமத்', te: 'జోషిమఠ్', bn: 'জোশীমঠ', mr: 'जोशीमठ', kn: 'ಜೋಷಿಮಠ್', or: 'ଜୋଶୀମଠ', pa: 'ਜੋਸ਼ੀਮਠ', as: 'যোশীমঠ' },
    'kolkata': { en: 'Kolkata', hi: 'कोलकाता', gu: 'કોલકાતા', ml: 'കൊൽക്കത്ത', ta: 'கொல்கத்தா', te: 'కోల్‌కతా', bn: 'কলকাতা', mr: 'कोलकाता', kn: 'ಕೋಲ್ಕತ್ತಾ', or: 'କୋଲକାତା', pa: 'ਕੋਲਕਾਤਾ', as: 'কলকাতা' },
    'sundarbans': { en: 'Sundarbans', hi: 'सुंदरवन', gu: 'સુંદરવન', ml: 'സുന്ദർബൻസ്', ta: 'சுந்தரவனம்', te: 'సుందరబన్స్', bn: 'সুন্দরবন', mr: 'सुंदरबन', kn: 'ಸುಂದರಬನ್ಸ್', or: 'ସୁନ୍ଦରବନ', pa: 'ਸੁੰਦਰਬਨ', as: 'সুন্দৰবন' },
    'shimla': { en: 'Shimla', hi: 'शिमला', gu: 'શિમલા', ml: 'ഷിംല', ta: 'சிம்லா', te: 'శిమ్లా', bn: 'শিমলা', mr: 'शिमला', kn: 'ಶಿಮ್ಲಾ', or: 'ଶିମଲା', pa: 'ਸ਼ਿਮਲਾ', as: 'শ্বিমলা' },
    'mandi': { en: 'Mandi', hi: 'मंडी', gu: 'મંડી', ml: 'മാണ്ഡി', ta: 'மண்டி', te: 'మండి', bn: 'মাণ্ডি', mr: 'मंडी', kn: 'ಮಂಡಿ', or: 'ମଣ୍ଡି', pa: 'ਮੰਡੀ', as: 'মণ্ডী' },
    'patna': { en: 'Patna', hi: 'पटना', gu: 'પટના', ml: 'പട്ന', ta: 'பாட்னா', te: 'పాట్నా', bn: 'পাটনা', mr: 'पटणा', kn: 'ಪಾಟ್ನಾ', or: 'ପାଟନା', pa: 'ਪਟਨਾ', as: 'পাটনা' },
    'hyderabad': { en: 'Hyderabad', hi: 'हैदराबाद', gu: 'હૈદરાબાદ', ml: 'ഹൈദരാബാദ്', ta: 'ஹைதராபாத்', te: 'హైదరాబాద్', bn: 'হায়দ্রাবাদ', mr: 'हैदराबाद', kn: 'ഹൈദരാബാദ്', or: 'ହାଇଦ୍ରାବାଦ', pa: 'ਹੈਦਰਾਬਾਦ', as: 'হায়দৰাবাদ' },
    'bengaluru': { en: 'Bengaluru', hi: 'बेंगलुरु', gu: 'બેંગલુરુ', ml: 'ബെംഗളൂരു', ta: 'பெங்களூரு', te: 'బెంగళూరు', bn: 'বেঙ্গালুরু', mr: 'बेंगळुरू', kn: 'ಬೆಂಗಳೂರು', or: 'ବେଙ୍ଗାଲୁରୁ', pa: 'ਬੈਂਗਲੁਰੂ', as: 'বেংগালুৰু' },
    'jaipur': { en: 'Jaipur', hi: 'जयपुर', gu: 'જયપુર', ml: 'ജയ്പൂർ', ta: 'ஜெய்ப்பூர்', te: 'జైపూర్', bn: 'জয়পুর', mr: 'जयपूर', kn: 'ಜೈಪುರ', or: 'ଜୟପୁର', pa: 'ਜੈਪੁਰ', as: 'জয়পুৰ' },
    
    // States
    'gujarat': { en: 'Gujarat', hi: 'गुजरात', gu: 'ગુજરાત', ml: 'ഗുജറാത്ത്', ta: 'குஜராத்', te: 'గుజరాత్', bn: 'গুজরাট', mr: 'गुजरात', kn: 'ಗುಜರಾತ್', or: 'ଗୁଜରାଟ', pa: 'ਗੁਜਰਾਤ', as: 'গুজৰাট' },
    'kerala': { en: 'Kerala', hi: 'केरल', gu: 'કેરળ', ml: 'കേരളം', ta: 'கேரளா', te: 'కేరళ', bn: 'কেরল', mr: 'केरल', kn: 'ಕೇರಳ', or: 'କେରଳ', pa: 'ਕੇਰਲ', as: 'কেৰালা' },
    'maharashtra': { en: 'Maharashtra', hi: 'महाराष्ट्र', gu: 'મહારાષ્ટ્ર', ml: 'മഹാരാഷ്ട്ര', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', bn: 'মহারাষ্ট্র', mr: 'महाराष्ट्र', kn: 'ಮಹಾರಾಷ್ಟ್ರ', or: 'ମହାରାଷ୍ଟ୍ର', pa: 'ਮਹਾਰਾਸ਼ਟਰ', as: 'মহাৰাষ্ট্ৰ' },
    'tamil nadu': { en: 'Tamil Nadu', hi: 'तमिलनाडु', gu: 'તમિલનાડુ', ml: 'തമിഴ്‌നാട്', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', bn: 'তামিলনাড়ু', mr: 'तमिळनाडू', kn: 'ತಮಿಳುನಾಡು', or: 'ତାମିଲନାଡୁ', pa: 'ਤਮਿਲਨਾਡੂ', as: 'তামিলনাডু' },
    'assam': { en: 'Assam', hi: 'असम', gu: 'અસમ', ml: 'അസം', ta: 'அசாம்', te: 'అస్సాం', bn: 'অসম', mr: 'आसाम', kn: 'ಅಸ್ಸಾಂ', or: 'ଆସାମ', pa: 'ਅਸਾਮ', as: 'অসম' },
    'odisha': { en: 'Odisha', hi: 'ओडिशा', gu: 'ઓડિશા', ml: 'ഒഡീഷ', ta: 'ஒடிசா', te: 'ఒడిశా', bn: 'ওড়িশা', mr: 'ओडिशा', kn: 'ଓଡ଼ିଶା', or: 'ଓଡ଼ିଶା', pa: 'ਓਡੀਸ਼ਾ', as: 'উৰিষ্যা' },
    'uttarakhand': { en: 'Uttarakhand', hi: 'उत्तराखंड', gu: 'ઉત્તરાખંડ', ml: 'ഉത്തരാഖണ്ഡ്', ta: 'உத்தரகண்ட்', te: 'ఉత్తరాఖండ్', bn: 'উত্তরাখণ্ড', mr: 'उत्तराखंड', kn: 'ಉತ್ತರಾಖಂಡ', or: 'ଉତ୍ତରାଖଣ୍ଡ', pa: 'ਉੱਤਰਾਖੰਡ', as: 'উত্তৰাখণ্ড' },
    'west bengal': { en: 'West Bengal', hi: 'पश्चिम बंगाल', gu: 'પશ્ચિમ બંગાળ', ml: 'പശ്ചിമ ബംഗാൾ', ta: 'மேற்கு வங்கம்', te: 'పశ్చిమ బెంగాల్', bn: 'পশ্চিমবঙ্গ', mr: 'पश्चिम बंगाल', kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', or: 'ପଶ୍ଚିମବଙ୍ଗ', pa: 'ਪੱਛਮੀ ਬੰਗਾਲ', as: 'পশ্চিমবংগ' },
    'himachal pradesh': { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश', gu: 'હિમાચલ પ્રદેશ', ml: 'ഹിമാചൽ പ്രദേശ്', ta: 'இமாச்சல பிரதேசம்', te: 'హిమాచల్ ప్రదేశ్', bn: 'হিমাচল প্রদেশ', mr: 'हिमाचल प्रदेश', kn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ', or: 'ହିମାଚଳ ପ୍ରଦେଶ', pa: 'ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼', as: 'হিমাচল প্রদেশ' },
    'bihar': { en: 'Bihar', hi: 'बिहार', gu: 'બિહાર', ml: 'ബീഹാർ', ta: 'பீகார்', te: 'బీహార్', bn: 'বিহার', mr: 'बिहार', kn: 'ಬಿಹಾರ', or: 'ବିହାର', pa: 'ਬਿਹਾਰ', as: 'বিহাৰ' },
    'telangana': { en: 'Telangana', hi: 'तेलंगाना', gu: 'તેલંગાણા', ml: 'തെലങ്കാന', ta: 'தெலுங்கானா', te: 'తెలంగాణ', bn: 'তেলেঙ্গানা', mr: 'तेलंगणा', kn: 'ತೆಲಂಗಾಣ', or: 'ତେଲେଙ୍ଗାନା', pa: 'ਤੇਲੰਗਾਨਾ', as: 'তেলেংগানা' },
    'karnataka': { en: 'Karnataka', hi: 'कर्नाटक', gu: 'કર્ણાટક', ml: 'കർണാടക', ta: 'கர்நாடகா', te: 'కర్ణాటక', bn: 'কর্ণাটক', mr: 'कर्नाटक', kn: 'ಕರ್ನಾಟಕ', or: 'କର୍ଣ୍ଣାଟକ', pa: 'ਕਰਨਾਟਕ', as: 'কৰ্ণাটক' },
    'rajasthan': { en: 'Rajasthan', hi: 'राजस्थान', gu: 'રાજસ્થાન', ml: 'രാജസ്ഥാൻ', ta: 'ராஜஸ்தான்', te: 'రాజస్థాన్', bn: 'রাজস্থান', mr: 'राजस्थान', kn: 'ರಾಜಸ್ಥಾನ', or: 'ରାଜସ୍ଥାନ', pa: 'ਰਾਜਸਥਾਨ', as: 'ৰাজস্থান' },
    
    // Hazards & common descriptions
    'flood': { en: 'Flood', hi: 'बाढ़', gu: 'પૂર', ml: 'വെള്ളപ്പൊക്കം', ta: 'வெள்ளம்', te: 'వరద', bn: 'বন্যা', mr: 'पूर', kn: 'ಪ್ರವಾಹ', or: 'ବନ୍ୟା', pa: 'ਹੜ੍ਹ', as: 'বানপানী' },
    'flooding': { en: 'Flooding', hi: 'जलजमाव / बाढ़', gu: 'પૂર સ્થિતિ', ml: 'വെള്ളപ്പൊക്കം', ta: 'வெள்ளப்பெருக்கு', te: 'వరదలు', bn: 'বন্যা পরিস্থিতি', mr: 'पूर', kn: 'ಪ್ರವಾಹ', or: 'ବନ୍ୟା', pa: 'ਹੜ੍ਹ', as: 'বানপানী' },
    'heavy rain': { en: 'Heavy Rain', hi: 'भारी बारिश', gu: 'ભારે વરસાદ', ml: 'ശക്തമായ മഴ', ta: 'கனமழை', te: 'భారీ వర్షం', bn: 'ভারী বৃষ্টি', mr: 'मुसळधार पाऊस', kn: 'ಭಾರೀ ಮಳೆ', or: 'ପ୍ରବଳ ବର୍ଷା', pa: 'ਭਾਰੀ ਮੀਂਹ', as: 'ধাৰাসাৰ বৰষুণ' },
    'landslide': { en: 'Landslide', hi: 'भूस्खलन', gu: 'ભૂસ્ખલન', ml: 'മണ്ണിടിച്ചിൽ', ta: 'நிலச்சரிவு', te: 'కొండచరియలు విరిగిపడటం', bn: 'ধস', mr: 'भूस्खलन', kn: 'ಭೂಕುಸಿತ', or: 'ଭୂସ୍ଖଳନ', pa: 'ਜ਼ਮੀਨ ਖਿਸਕਣਾ', as: 'ভূমিস্খলন' },
    'cyclone': { en: 'Cyclone', hi: 'चक्रवात', gu: 'વાવાઝોડું', ml: 'ചുഴലിക്കാറ്റ്', ta: 'புயல்', te: 'తుఫాను', bn: 'ঘূর্ণিঝড়', mr: 'चक्रीवादळ', kn: 'ಚಂಡಮಾರುತ', or: 'ବାତ୍ୟା', pa: 'ਚੱਕਰਵਾਤ', as: 'ঘূৰ্ণীবতাহ' },
    'earthquake': { en: 'Earthquake', hi: 'भूकंप', gu: 'ભૂકંપ', ml: 'ഭൂകമ്പം', ta: 'நிலநடுக்கம்', te: 'భూకంపం', bn: 'ভূমিকম্প', mr: 'भूकंप', kn: 'ಭೂಕಂಪ', or: 'ଭୂକମ୍ପ', pa: 'ਭੂਚਾਲ', as: 'ভূমিকম্প' },
    'heatwave': { en: 'Heatwave', hi: 'लू / भीषण गर्मी', gu: 'હીટવેવ', ml: 'ഉഷ്ണതരംഗം', ta: 'வெப்ப அலை', te: 'వడగాల్పులు', bn: 'দাহদাহ', mr: 'उष्णतेची लाट', kn: 'ಬಿಸಿಗಾಳಿ', or: 'ଗ୍ରୀଷ୍ମ ପ୍ରବାହ', pa: 'ਲੂ', as: 'গ্ৰীষ্ম প্ৰবাহ' },
    'severe': { en: 'Severe', hi: 'भीषण / गंभीर', gu: 'ગંભીર', ml: 'ഗുരുതരമായ', ta: 'கடுமையான', te: 'తీవ్రమైన', bn: 'ভয়াবহ', mr: 'तीव्र', kn: 'ತೀವ್ರ', or: 'ଭୟାବହ', pa: 'ਗੰਭੀਰ', as: 'ভীষণ' },
    'evacuation': { en: 'Evacuation', hi: 'निकासी', gu: 'સ્થળાંતર', ml: 'ഒഴിപ്പിക്കൽ', ta: 'வெளியேற்றம்', te: 'తరలింపు', bn: 'উদ্ধার ও স্থানান্তর', mr: 'स्थलांतर', kn: 'ಸ್ಥಳಾಂತರ', or: 'ସ୍ଥାନାନ୍ତରଣ', pa: 'ਨਿਕਾਸੀ', as: 'স্থানান্তৰকৰণ' },
    'waterlogging': { en: 'Waterlogging', hi: 'जलभराव', gu: 'પાણી ભરાવું', ml: 'വെള്ളക്കെട്ട്', ta: 'நீர் தேங்குதல்', te: 'నీరు నిలవడం', bn: 'জলমগ্নতা', mr: 'पाणी साचणे', kn: 'ನೀರು ನಿಲ್ಲುವುದು', or: 'ଜଳବନ୍ଦୀ', pa: 'ਜਲ-ਥਲ', as: 'কৃত্রিম বানপানী' },
  };

  const tText = (text: string): string => {
    if (!text) return text;
    if (language === 'en') return text;
    
    let translated = text;
    // Iterate over dict keys sorted by length (descending) to avoid partial matches first
    const keys = Object.keys(DYNAMIC_MAP).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      const target = DYNAMIC_MAP[key][language];
      if (target) {
        // Safe case-insensitive replace of whole word/subsegment
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translated = translated.replace(regex, target);
      }
    }
    return translated;
  };

  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tText,
        currentLangOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
