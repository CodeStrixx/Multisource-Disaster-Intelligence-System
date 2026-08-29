import React from 'react';
import { MOCK_DATA_SOURCES } from '../../data/mockDisasterData';
import { DataSource } from '../../types/disaster';
import { SourceBadge } from '../common/TrustBadges';
import { Database, ShieldCheck, Layers, AlertTriangle, Tv, Radio, Landmark } from 'lucide-react';

interface AboutSourcesScreenProps {
  isDark?: boolean;
  sources?: DataSource[];
  onViewSchemes?: () => void;
}

export const AboutSourcesScreen: React.FC<AboutSourcesScreenProps> = ({ isDark = true, sources, onViewSchemes }) => {
  const displaySources = sources && sources.length > 0 ? sources : MOCK_DATA_SOURCES;
  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      
      {/* Tactical Header */}
      <div className={`${card} rounded-xl p-5 border`}>
        <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase ${outline} mb-1`}>
          <Database className="w-3.5 h-3.5 text-status-info" /> // DATA PROVENANCE &amp; ARCHITECTURE (S15)
        </div>
        <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>ABOUT DATA SOURCES &amp; VERIFICATION PIPELINE</h2>
        <p className={`text-[11px] font-mono ${muted} mt-0.5`}>
          Transparent documentation on official government sensors, regional news bureaus, crowdsourced field reports, and anti-misinformation rules.
        </p>
        {onViewSchemes && (
          <button
            onClick={onViewSchemes}
            className="mt-3 inline-flex items-center gap-1.5 bg-status-success hover:bg-emerald-500 text-white font-mono font-bold text-[10px] tracking-wider px-3 py-2 rounded-md transition-colors"
          >
            <Landmark className="w-3.5 h-3.5" /> BROWSE GOVERNMENT ASSISTANCE SCHEMES
          </button>
        )}
      </div>

      {/* Mandatory Emergency Disclaimer Card */}
      <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-status-warning-bg/20 border-status-warning/40 text-status-warning' : 'bg-amber-50 border-amber-300 text-amber-950'} shadow-sm`}>
        <div className="flex items-center gap-2 font-mono font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span>// EXPLICIT SYSTEM LIMITATION &amp; LEGAL DISCLAIMER</span>
        </div>
        <p className="text-xs leading-relaxed font-sans opacity-90">
          “This system provides decision support and does not replace official emergency instructions. Official directives from the National Disaster Management Authority (NDMA), State Disaster Management Authorities (SDMA), India Meteorological Department (IMD), local police, and district collectors take absolute precedence during active hazards.”
        </p>
      </div>

      {/* Ingested Data Providers Matrix */}
      <div className={`${card} rounded-xl p-5 border space-y-4`}>
        <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-2 ${text}`}>
          <ShieldCheck className="w-4 h-4 text-status-success" /> // INGESTED DATA PROVIDERS &amp; REGIONAL BUREAUS
        </h3>

        <div className="space-y-2.5">
          {displaySources.map((src) => (
            <div key={src.id} className={`p-3.5 ${cardLow} rounded-lg border flex flex-wrap items-center justify-between gap-3 text-xs`}>
              <div className="space-y-1">
                <div className={`font-mono font-bold text-sm ${text}`}>{src.name}</div>
                <div className="flex items-center gap-2">
                  <SourceBadge type={src.type} />
                  {src.regionalLanguage && (
                    <span className={`text-[10px] font-mono ${outline}`}>[{src.regionalLanguage}]</span>
                  )}
                </div>
              </div>

              <div className={`flex items-center gap-4 ${muted}`}>
                <div>
                  <span className={`block text-[9px] font-mono uppercase ${outline}`}>Reliability Score</span>
                  <strong className={`font-mono text-sm text-status-success`}>{src.reliabilityScore}%</strong>
                </div>
                <div>
                  <span className={`block text-[9px] font-mono uppercase ${outline}`}>Sync Cadence</span>
                  <strong className="font-mono text-xs text-status-info">{src.lastSync}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Pipeline & Trust Architecture */}
      <div className={`${card} rounded-xl p-5 border space-y-4 text-xs`}>
        <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 border-b ${divider} pb-2 ${text}`}>
          <Layers className="w-4 h-4 text-status-info" /> // FOUR-TIER VERIFICATION &amp; MEDIA CORROBORATION ENGINE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`p-4 ${cardLow} rounded-lg border space-y-1.5`}>
            <span className={`font-mono font-bold text-xs tracking-wider block ${text}`}>1. OFFICIAL SENSORS &amp; RADAR</span>
            <p className={`text-[11px] leading-relaxed font-sans ${muted}`}>
              IMD Doppler Weather Radar, CWC hydrological river gauges, INCOIS coastal ocean buoys, and ISRO Bhuvan satellite masks provide the baseline physical ground truth.
            </p>
          </div>

          <div className={`p-4 ${cardLow} rounded-lg border space-y-1.5`}>
            <span className={`font-mono font-bold text-xs tracking-wider block ${text}`}>2. REGIONAL NEWS MEDIA INGESTION</span>
            <p className={`text-[11px] leading-relaxed font-sans ${muted}`}>
              Accredited vernacular broadcast TV channels, PTI/ANI disaster news wires, and local bureaus provide early flash signals for micro-incidents at the Taluk and Ward level.
            </p>
          </div>

          <div className={`p-4 ${cardLow} rounded-lg border space-y-1.5`}>
            <span className={`font-mono font-bold text-xs tracking-wider block ${text}`}>3. CROWDSOURCED CORROBORATION</span>
            <p className={`text-[11px] leading-relaxed font-sans ${muted}`}>
              Citizen field submissions within a 2km radius are clustered and matched against satellite/radar vectors. Submissions with photo geotags elevate trust scores automatically.
            </p>
          </div>

          <div className={`p-4 ${cardLow} rounded-lg border space-y-1.5`}>
            <span className={`font-mono font-bold text-xs tracking-wider block ${text}`}>4. RISK CLASSIFICATION &amp; PROTOCOLS</span>
            <p className={`text-[11px] leading-relaxed font-sans ${muted}`}>
              Automated scoring weights combine sensor readings, news dispatches, and public reports to assign risk levels (Low, Moderate, High, Critical) and deliver immediate safety actions.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
