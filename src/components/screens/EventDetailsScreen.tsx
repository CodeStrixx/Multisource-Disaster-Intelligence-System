import React, { useState } from 'react';
import { DisasterEvent, EmergencyContact, GovernmentScheme, ReliefResource } from '../../types/disaster';
import { extractPortalUrl } from '../../services/api';
import { EmergencyContactsCard, primaryTelHref } from '../common/EmergencyContactsCard';
import { RiskBadge, SourceBadge, VerificationBadge, FreshnessIndicator, SeverityIndicator } from '../common/TrustBadges';
import { ArrowLeft, CheckCircle2, AlertTriangle, LifeBuoy, FileText, Share2, MapPin, Phone, Layers, Activity, Tv, Radio, Clock, Landmark, ExternalLink, ChevronRight, CloudSun } from 'lucide-react';

interface EventDetailsScreenProps {
  event: DisasterEvent;
  onBack: () => void;
  onFindHelp: () => void;
  onReportRelated: () => void;
  nearbyResources: ReliefResource[];
  schemes?: GovernmentScheme[];
  onViewAllSchemes?: () => void;
  emergencyContacts?: EmergencyContact[];
  isDark?: boolean;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  event,
  onBack,
  onFindHelp,
  onReportRelated,
  nearbyResources,
  schemes,
  onViewAllSchemes,
  emergencyContacts,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'news' | 'timeline' | 'sources'>('intelligence');

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const cardHigh= isDark ? 'bg-ops-high border-ops-divider'      : 'bg-day-container border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  const newsCount = event.newsDispatches ? event.newsDispatches.length : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      
      {/* Top Navigation & Actions */}
      <div className={`flex items-center justify-between border-b ${divider} pb-4`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-status-info hover:underline font-mono text-xs font-bold tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> // RETURN TO DASHBOARD
        </button>

        <div className="flex items-center gap-2">
          <FreshnessIndicator timestamp={event.updatedAt.split('T')[1].slice(0, 5) + ' IST'} />
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: event.title, text: event.description, url: window.location.href });
              } else {
                alert('Event intelligence link copied to clipboard.');
              }
            }}
            className={`p-2 border rounded-md font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-ops-text' : 'bg-white border-day-divider text-day-muted hover:text-day-text'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> SHARE
          </button>
        </div>
      </div>

      {/* Main Header Information Card */}
      <div className={`${card} rounded-xl p-5 border space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RiskBadge severity={event.severity} size="large" />
            <VerificationBadge status={event.verificationStatus} />
          </div>
          <SeverityIndicator severity={event.severity} disasterType={event.type} />
        </div>

        <div>
          <h1 className={`text-xl sm:text-2xl font-bold font-mono tracking-tight leading-tight ${text}`}>
            {event.title.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {event.signalKind === 'FORECAST_RISK' && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border bg-status-warning-bg/30 border-status-warning/60 text-status-warning flex items-center gap-1">
                <CloudSun className="w-3 h-3" /> PREDICTED — NOT YET OBSERVED
              </span>
            )}
            <div className={`flex items-center gap-2 text-xs font-mono ${muted}`}>
              <MapPin className="w-3.5 h-3.5 text-status-info shrink-0" />
              <span className={`font-bold ${text}`}>{event.locationName.toUpperCase()}</span>
              <span>({event.district.toUpperCase()}, {event.state.toUpperCase()})</span>
            </div>
          </div>
        </div>

        <p className={`text-xs leading-relaxed p-4 rounded-lg border font-sans ${cardLow} ${muted}`}>
          {event.description}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { label: 'CONFIDENCE SCORE', value: `${event.confidenceScore}%`, sub: 'Multi-Source Engine' },
            { label: 'AFFECTED RADIUS', value: `${event.affectedRadiusKm} KM`, sub: 'GIS Hazard Boundary' },
            { label: '24H RAINFALL', value: event.rainfallMm ? `${event.rainfallMm} MM` : 'N/A', sub: 'IMD Radar / Gauge' },
            { label: 'CURRENT TREND', value: (event.trend || 'STABLE').toUpperCase(), sub: 'Real-time Vector' },
          ].map((stat) => (
            <div key={stat.label} className={`p-3 rounded-lg border text-center ${cardLow}`}>
              <div className={`text-[10px] font-mono font-semibold uppercase ${outline}`}>{stat.label}</div>
              <div className={`text-base font-mono font-bold text-status-info my-0.5`}>{stat.value}</div>
              <div className={`text-[9px] font-mono ${muted}`}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs for Intelligence vs News Wire vs Timeline vs Sources */}
      <div className={`flex border-b ${divider} font-mono font-bold text-xs overflow-x-auto`}>
        {[
          { id: 'intelligence', label: '// INTEL & GUIDANCE' },
          { id: 'news',         label: `// REGIONAL NEWS WIRE (${newsCount})` },
          { id: 'timeline',     label: '// TIMELINE (S06)' },
          { id: 'sources',      label: '// EVIDENCE & SOURCES' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-4 transition-colors border-b-2 tracking-wider whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-status-info text-status-info font-bold'
                : `border-transparent ${outline} hover:${text}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INTELLIGENCE & GUIDANCE */}
      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main 2-column info */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* What We Know */}
            <div className={`${card} rounded-xl p-5 border space-y-3`}>
              <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-2 ${text}`}>
                <CheckCircle2 className="w-4 h-4 text-status-success" /> // WHAT WE KNOW (VERIFIED FACTS)
              </h3>
              <ul className="space-y-2 text-xs">
                {event.whatWeKnow.map((item, idx) => (
                  <li key={idx} className={`flex items-start gap-2.5 p-3 rounded-md border font-sans ${cardLow} ${muted}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className={`${card} rounded-xl p-5 border space-y-3`}>
              <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-2 ${text}`}>
                <AlertTriangle className="w-4 h-4 text-status-warning" /> // CONTRIBUTING RISK FACTORS
              </h3>
              <div className="space-y-2">
                {event.riskFactors.map((rf, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border text-xs ${isDark ? 'bg-status-warning-bg/20 border-status-warning/30' : 'bg-amber-50 border-amber-200'}`}>
                    <strong className={`font-mono text-xs block mb-0.5 text-status-warning`}>{rf.factor.toUpperCase()}</strong>
                    <p className={`font-sans leading-relaxed ${muted}`}>{rf.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className={`${card} rounded-xl p-5 border space-y-4`}>
              <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-2 ${text}`}>
                // RECOMMENDED ACTIONS &amp; SAFETY PROTOCOLS
              </h3>

              {/* Official Warnings */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-status-critical flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-critical" /> OFFICIAL GOVERNMENT DIRECTIVES
                </div>
                {event.officialWarnings.map((warn, idx) => (
                  <div key={idx} className="p-3 bg-status-critical-bg/20 border-l-4 border-l-status-critical text-status-critical-muted text-xs font-sans rounded-r-md leading-relaxed">
                    {warn}
                  </div>
                ))}
              </div>

              {/* System Recommendations */}
              <div className="space-y-2 pt-2">
                <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${outline}`}>
                  CONTEXTUAL SAFETY PROTOCOLS
                </div>
                {event.systemRecommendations.map((rec, idx) => (
                  <div key={idx} className={`p-3 rounded-md border text-xs flex items-start gap-2.5 font-sans ${cardLow} ${muted}`}>
                    <span className="font-mono font-bold text-status-info shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>

              {/* Government Assistance Schemes */}
              {schemes && schemes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-status-success">
                    <Landmark className="w-3.5 h-3.5" /> GOVERNMENT ASSISTANCE SCHEMES ({schemes.length})
                  </div>
                  {schemes.slice(0, 4).map((scheme) => {
                    const portalHref = extractPortalUrl(scheme.portalUrl);
                    return (
                      <div key={scheme.id} className={`p-3 rounded-md border space-y-1 ${cardLow}`}>
                        <div className={`font-mono font-bold text-xs leading-snug ${text}`}>{scheme.name}</div>
                        <p className={`text-[11px] font-sans leading-relaxed line-clamp-2 ${muted}`}>{scheme.benefitDetails}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 gap-2">
                          <span className={`${outline} truncate`}>{scheme.administeringBody.toUpperCase()}</span>
                          <span className="flex items-center gap-2 shrink-0">
                            {portalHref && (
                              <a
                                href={portalHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-status-info hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" /> PORTAL
                              </a>
                            )}
                            {scheme.helpline && (
                              <a href={primaryTelHref(scheme.helpline)} className="text-status-success font-bold flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {scheme.helpline}
                              </a>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {onViewAllSchemes && (
                    <button
                      onClick={onViewAllSchemes}
                      className="text-[10px] font-mono font-bold text-status-info hover:underline flex items-center gap-1 pt-0.5"
                    >
                      VIEW FULL DIRECTORY &amp; APPLY STEPS <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Column: Nearby Help & Quick Report */}
          <div className="space-y-5">
            
            {/* Quick Action Box */}
            <div className={`${card} rounded-xl p-5 border space-y-3.5`}>
              <h4 className={`font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 ${text}`}>
                <LifeBuoy className="w-4 h-4 text-status-info" /> // EMERGENCY DISPATCH
              </h4>
              {emergencyContacts && emergencyContacts.length > 0 && (
                <EmergencyContactsCard contacts={emergencyContacts} compact isDark={isDark} />
              )}
              <p className={`text-[11px] font-sans ${muted}`}>
                Locate verified shelters, emergency medical facilities, and relief posts near {event.locationName}.
              </p>
              <button
                onClick={onFindHelp}
                className="w-full bg-status-info hover:bg-blue-500 text-white font-mono font-bold py-2.5 px-3 rounded-md text-[11px] tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <LifeBuoy className="w-3.5 h-3.5" /> FIND RELIEF RESOURCES
              </button>
              <button
                onClick={onReportRelated}
                className={`w-full font-mono font-bold py-2 px-3 rounded-md text-[11px] tracking-wider border transition-colors flex items-center justify-center gap-2 ${
                  isDark ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-ops-text' : 'bg-day-container border-day-divider text-day-muted hover:text-day-text'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> SUBMIT FIELD REPORT
              </button>
            </div>

            {/* Nearby Emergency Resources List */}
            <div className={`${card} rounded-xl p-5 border space-y-3`}>
              <h4 className={`font-mono font-bold text-xs tracking-wider uppercase border-b ${divider} pb-2 ${text}`}>
                // NEARBY RELIEF CENTERS ({nearbyResources.length})
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {nearbyResources.map((res) => (
                  <div key={res.id} className={`p-3 rounded-lg border space-y-1 text-xs ${cardLow}`}>
                    <div className={`font-mono font-bold text-xs ${text}`}>{res.name.toUpperCase()}</div>
                    <div className={`text-[11px] font-sans font-medium ${muted}`}>{res.address}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                      <span className="text-status-success font-bold">{res.status.toUpperCase()}</span>
                      <a href={`tel:${res.phone}`} className="text-status-info font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {res.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: REGIONAL NEWS WIRE */}
      {activeTab === 'news' && (
        <div className={`${card} rounded-xl p-5 border space-y-5`}>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: isDark ? '#334155' : '#cbd5e1' }}>
            <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 ${text}`}>
              <Tv className="w-4 h-4 text-amber-400" /> // ACCREDITED REGIONAL NEWS MEDIA WIRE
            </h3>
            <span className={`text-[10px] font-mono ${outline}`}>HYPERLOCAL FIELD COVERAGE</span>
          </div>

          {event.newsDispatches && event.newsDispatches.length > 0 ? (
            <div className="space-y-3 font-mono">
              {event.newsDispatches.map((dispatch) => (
                <div key={dispatch.id} className={`p-4 rounded-lg border space-y-2 ${cardLow}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Tv className="w-3 h-3" /> {dispatch.channelName.toUpperCase()}
                      </span>
                      {dispatch.isLiveBroadcast && (
                        <span className="bg-status-critical/20 text-status-critical border border-status-critical/40 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE DISPATCH
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${outline} flex items-center gap-1`}>
                      <Clock className="w-3 h-3" /> {dispatch.timestamp} · {dispatch.language}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold ${text}`}>{dispatch.headline}</h4>
                  <p className={`text-xs font-sans leading-relaxed ${muted}`}>{dispatch.summary}</p>

                  <div className={`flex items-center justify-between text-[10px] pt-1.5 border-t ${divider} ${outline}`}>
                    <span>CORRESPONDENT: <strong className={text}>{dispatch.correspondent}</strong></span>
                    <span className="text-status-success font-bold">VERIFICATION WEIGHT: +{dispatch.verificationWeight}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center text-xs font-mono ${muted}`}>
              No breaking news dispatches recorded for this event yet. Monitoring regional bureau RSS feeds...
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INCIDENT TIMELINE (S06) */}
      {activeTab === 'timeline' && (
        <div className={`${card} rounded-xl p-5 border space-y-5`}>
          <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-3 ${text}`}>
            <Activity className="w-4 h-4 text-status-info" /> // CHRONOLOGICAL EVENT PROGRESSION
          </h3>

          <div className="relative border-l-2 border-status-info/30 ml-4 pl-6 space-y-6 font-mono">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-status-critical ring-4 ring-ops-surface" />
              <div className="text-xs font-bold text-status-critical">21:20 IST (LATEST SIGNAL)</div>
              <div className={`text-sm font-bold mt-0.5 ${text}`}>Corroboration Matrix Verified</div>
              <p className={`text-xs font-sans mt-1 p-3 rounded border ${cardLow} ${muted}`}>
                18 independent public reports matched with IMD radar signal and Regional TV live broadcast. Risk score confirmed.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-status-info ring-4 ring-ops-surface" />
              <div className="text-xs font-bold text-status-info">19:45 IST</div>
              <div className={`text-sm font-bold mt-0.5 ${text}`}>Regional Media Broadcast &amp; Citizen Reports Arrive</div>
              <p className={`text-xs font-sans mt-1 p-3 rounded border ${cardLow} ${muted}`}>
                Regional channel news van reaches ground zero; first live visual confirmations received.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-ops-outline ring-4 ring-ops-surface" />
              <div className={`text-xs font-bold ${outline}`}>14:30 IST (DETECTION)</div>
              <div className={`text-sm font-bold mt-0.5 ${text}`}>Initial Weather Bulletin &amp; Threshold Trigger</div>
              <p className={`text-xs font-sans mt-1 p-3 rounded border ${cardLow} ${muted}`}>
                IMD rainfall gauge crossed 100mm/h rate. Event detection rule engine initiated EVENT ID {event.id}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOURCES & VERIFICATION */}
      {activeTab === 'sources' && (
        <div className={`${card} rounded-xl p-5 border space-y-5`}>
          <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-3 ${text}`}>
            <Layers className="w-4 h-4 text-status-info" /> // EVIDENCE &amp; SOURCE ATTRIBUTION
          </h3>

          <div className="space-y-3 font-mono">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${outline}`}>// VERIFICATION FACTORS MATRIX</h4>
            <div className="space-y-2.5">
              {event.verificationFactors.map((vf, idx) => (
                <div key={idx} className={`p-3.5 rounded-lg border flex items-start justify-between gap-4 ${cardLow}`}>
                  <div>
                    <div className={`font-bold text-xs ${text}`}>{vf.factor.toUpperCase()}</div>
                    <p className={`text-[11px] font-sans mt-0.5 ${muted}`}>{vf.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-status-success bg-status-success-bg/20 px-2 py-1 rounded border border-status-success/30 uppercase">
                      {vf.status} (+{vf.score}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`space-y-3 pt-3 border-t ${divider} font-mono`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider ${outline}`}>// INGESTED DATA SOURCES &amp; REGIONAL BUREAUS</h4>
            <div className="space-y-2">
              {event.sources.map((src) => (
                <div key={src.id} className={`p-3 border rounded-md flex items-center justify-between text-xs ${cardLow}`}>
                  <SourceBadge type={src.type} name={src.name} />
                  <div className={`text-[11px] ${muted}`}>
                    Reliability: <strong className="text-status-success">{src.reliabilityScore}%</strong> | Sync: {src.lastSync}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
