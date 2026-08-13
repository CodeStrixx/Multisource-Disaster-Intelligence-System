import React, { useState } from 'react';
import { DisasterEvent, ReliefResource } from '../../types/disaster';
import { RiskBadge, SourceBadge, VerificationBadge, FreshnessIndicator, SeverityIndicator } from '../common/TrustBadges';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, LifeBuoy, FileText, Share2, MapPin, Phone, HelpCircle, Layers, Activity } from 'lucide-react';

interface EventDetailsScreenProps {
  event: DisasterEvent;
  onBack: () => void;
  onFindHelp: () => void;
  onReportRelated: () => void;
  nearbyResources: ReliefResource[];
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  event,
  onBack,
  onFindHelp,
  onReportRelated,
  nearbyResources
}) => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'timeline' | 'sources'>('intelligence');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
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
            className="p-2 border border-surface-border rounded-md bg-white hover:bg-brand-50 text-brand-900 text-xs font-semibold flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Header Information Card */}
      <div className="bg-white rounded-xl p-6 border border-surface-border shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RiskBadge severity={event.severity} size="large" />
            <VerificationBadge status={event.verificationStatus} />
          </div>
          <SeverityIndicator severity={event.severity} disasterType={event.type} />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-textMain-secondary mt-1">
            <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
            <span className="font-semibold text-textMain-primary">{event.locationName}</span> ({event.district}, {event.state})
          </div>
        </div>

        <p className="text-sm text-textMain-primary leading-relaxed bg-surface-bg p-4 rounded-lg border border-surface-border">
          {event.description}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-brand-50 p-3 rounded-lg border border-brand-100 text-center">
            <div className="text-xs text-brand-900 font-medium">Confidence Score</div>
            <div className="text-lg font-bold text-brand-700">{event.confidenceScore}%</div>
            <div className="text-[10px] text-brand-900/70">Multi-source Engine</div>
          </div>

          <div className="bg-brand-50 p-3 rounded-lg border border-brand-100 text-center">
            <div className="text-xs text-brand-900 font-medium">Affected Radius</div>
            <div className="text-lg font-bold text-brand-700">{event.affectedRadiusKm} km</div>
            <div className="text-[10px] text-brand-900/70">GIS Boundary</div>
          </div>

          {event.rainfallMm && (
            <div className="bg-brand-50 p-3 rounded-lg border border-brand-100 text-center">
              <div className="text-xs text-brand-900 font-medium">24h Rainfall</div>
              <div className="text-lg font-bold text-brand-700">{event.rainfallMm} mm</div>
              <div className="text-[10px] text-brand-900/70">IMD Gauge Record</div>
            </div>
          )}

          <div className="bg-brand-50 p-3 rounded-lg border border-brand-100 text-center">
            <div className="text-xs text-brand-900 font-medium">Current Trend</div>
            <div className="text-lg font-bold capitalize text-brand-700">{event.trend || 'Stable'}</div>
            <div className="text-[10px] text-brand-900/70">Real-time Vector</div>
          </div>
        </div>
      </div>

      {/* Tabs for Intelligence vs Timeline vs Sources */}
      <div className="flex border-b border-surface-border font-semibold text-sm">
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'intelligence' ? 'border-brand-700 text-brand-900' : 'border-transparent text-textMain-secondary hover:text-brand-900'}`}
        >
          Incident Intelligence & Guidance
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'timeline' ? 'border-brand-700 text-brand-900' : 'border-transparent text-textMain-secondary hover:text-brand-900'}`}
        >
          Incident Timeline (S06)
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 px-4 transition-colors border-b-2 ${activeTab === 'sources' ? 'border-brand-700 text-brand-900' : 'border-transparent text-textMain-secondary hover:text-brand-900'}`}
        >
          Verification & Data Sources
        </button>
      </div>

      {/* TAB 1: INTELLIGENCE & GUIDANCE */}
      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2-column info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* What We Know */}
            <div className="bg-white rounded-xl p-5 border border-surface-border shadow-sm space-y-3">
              <h3 className="text-base font-bold text-brand-900 flex items-center gap-2 border-b pb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What We Know
              </h3>
              <ul className="space-y-2 text-sm text-textMain-primary">
                {event.whatWeKnow.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-surface-bg p-3 rounded-md border border-surface-border">
                    <span className="w-2 h-2 rounded-full bg-brand-700 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className="bg-white rounded-xl p-5 border border-surface-border shadow-sm space-y-3">
              <h3 className="text-base font-bold text-brand-900 flex items-center gap-2 border-b pb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Contributing Risk Factors
              </h3>
              <div className="space-y-2.5">
                {event.riskFactors.map((rf, idx) => (
                  <div key={idx} className="bg-amber-50/50 p-3 rounded-lg border border-amber-200 text-xs">
                    <strong className="text-amber-900 text-sm block mb-0.5">{rf.factor}</strong>
                    <p className="text-textMain-secondary">{rf.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What You Should Do (Recommended Actions) */}
            <div className="bg-white rounded-xl p-5 border border-surface-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brand-700" /> What You Should Do (Recommended Actions)
                </h3>
              </div>

              {/* Official Warnings */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span> Official Government Directives
                </div>
                {event.officialWarnings.map((warn, idx) => (
                  <div key={idx} className="p-3 bg-red-50 border-l-4 border-red-600 text-red-950 text-xs font-medium rounded-r-md">
                    {warn}
                  </div>
                ))}
              </div>

              {/* System Recommendations */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-textMain-secondary">
                  Contextual Safety Steps
                </div>
                {event.systemRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-brand-50 border border-brand-100 text-brand-900 text-xs rounded-md flex items-start gap-2">
                    <span className="font-bold text-brand-700">{idx + 1}.</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column: Nearby Help & Quick Report */}
          <div className="space-y-6">
            
            {/* Quick Action Box */}
            <div className="bg-brand-900 text-white rounded-xl p-5 shadow-lg space-y-4">
              <h4 className="font-bold text-base flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-brand-100" /> Need Assistance?
              </h4>
              <p className="text-xs text-brand-100/90">
                Locate open shelters, emergency hospitals, and relief outposts near {event.locationName}.
              </p>
              <button
                onClick={onFindHelp}
                className="w-full bg-brand-500 hover:bg-brand-700 text-white font-bold py-2.5 px-4 rounded-md text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <LifeBuoy className="w-4 h-4" /> Find Nearby Relief Resources
              </button>
              <button
                onClick={onReportRelated}
                className="w-full bg-brand-700/60 hover:bg-brand-700 border border-brand-500/40 text-brand-100 font-semibold py-2 px-4 rounded-md text-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Report New Eyewitness Info
              </button>
            </div>

            {/* Nearby Emergency Resources List */}
            <div className="bg-white rounded-xl p-5 border border-surface-border shadow-sm space-y-3">
              <h4 className="font-bold text-sm text-brand-900 border-b pb-2">
                Nearby Relief Centers ({nearbyResources.length})
              </h4>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {nearbyResources.map((res) => (
                  <div key={res.id} className="p-3 bg-surface-bg rounded-lg border border-surface-border space-y-1 text-xs">
                    <div className="font-bold text-brand-900">{res.name}</div>
                    <div className="text-textMain-secondary">{res.address}</div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-emerald-700 font-semibold">{res.status.toUpperCase()}</span>
                      <a href={`tel:${res.phone}`} className="text-brand-700 font-bold flex items-center gap-1">
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

      {/* TAB 2: INCIDENT TIMELINE (S06) */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl p-6 border border-surface-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2 border-b pb-3">
            <Activity className="w-5 h-5 text-brand-700" /> Chronological Event Progression
          </h3>

          <div className="relative border-l-2 border-brand-500/30 ml-4 pl-6 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-700 ring-4 ring-white"></div>
              <div className="text-xs font-bold text-brand-700">21:20 IST (Latest Signal)</div>
              <div className="text-sm font-semibold text-brand-900 mt-0.5">Corroboration Matrix Verified</div>
              <p className="text-xs text-textMain-primary mt-1 bg-surface-bg p-3 rounded border">
                18 independent public reports matched with IMD radar signal. Risk score raised to {event.severity.toUpperCase()}.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white"></div>
              <div className="text-xs font-bold text-brand-700">19:45 IST</div>
              <div className="text-sm font-semibold text-brand-900 mt-0.5">First Citizen Field Reports Arrive</div>
              <p className="text-xs text-textMain-secondary mt-1 bg-surface-bg p-3 rounded border">
                Reports of waterlogging submitted via citizen mobile web interface. Verification state: UNDER REVIEW.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-textMain-muted ring-4 ring-white"></div>
              <div className="text-xs font-bold text-textMain-muted">14:30 IST (Detection)</div>
              <div className="text-sm font-semibold text-brand-900 mt-0.5">Initial Weather Bulletin & Threshold Trigger</div>
              <p className="text-xs text-textMain-secondary mt-1 bg-surface-bg p-3 rounded border">
                IMD rainfall gauge crossed 100mm/h rate. Event detection rule engine initiated EVENT ID {event.id}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOURCES & VERIFICATION */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-xl p-6 border border-surface-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-brand-900 flex items-center gap-2 border-b pb-3">
            <Layers className="w-5 h-5 text-brand-700" /> Evidence & Source Attribution
          </h3>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-brand-900">Verification Factors Matrix</h4>
            <div className="space-y-3">
              {event.verificationFactors.map((vf, idx) => (
                <div key={idx} className="p-4 bg-surface-bg rounded-lg border border-surface-border flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-brand-900">{vf.factor}</div>
                    <p className="text-xs text-textMain-secondary mt-0.5">{vf.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 uppercase">
                      {vf.status} (+{vf.score}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-surface-border">
            <h4 className="font-semibold text-sm text-brand-900">Ingested Data Sources</h4>
            <div className="space-y-2">
              {event.sources.map((src) => (
                <div key={src.id} className="p-3 border rounded-md flex items-center justify-between text-xs">
                  <SourceBadge type={src.type} name={src.name} />
                  <div className="text-textMain-secondary">Reliability: <strong>{src.reliabilityScore}%</strong> | Sync: {src.lastSync}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
