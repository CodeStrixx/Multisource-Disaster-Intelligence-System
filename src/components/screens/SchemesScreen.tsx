import React, { useMemo, useState } from 'react';
import { DisasterType, GovernmentScheme } from '../../types/disaster';
import { extractPortalUrl } from '../../services/api';
import {
  Landmark, Search, ChevronDown, ExternalLink, Phone, FileCheck,
  ClipboardList, BadgeCheck, IndianRupee, AlertTriangle,
} from 'lucide-react';

interface SchemesScreenProps {
  schemes: GovernmentScheme[];
  onSelectEvent?: (eventId: string) => void;
  isDark?: boolean;
}

const TYPE_FILTERS: { type: DisasterType | 'all'; label: string }[] = [
  { type: 'all', label: 'ALL' },
  { type: 'flood', label: 'FLOOD' },
  { type: 'heavy_rain', label: 'HEAVY RAIN' },
  { type: 'cyclone', label: 'CYCLONE' },
  { type: 'landslide', label: 'LANDSLIDE' },
  { type: 'earthquake', label: 'EARTHQUAKE' },
  { type: 'heatwave', label: 'HEATWAVE' },
];

export const SchemesScreen: React.FC<SchemesScreenProps> = ({ schemes, isDark = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DisasterType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return schemes.filter((s) => {
      if (typeFilter !== 'all' && !s.applicableDisasterTypes.includes(typeFilter)) return false;
      if (needle && !`${s.name} ${s.administeringBody} ${s.summary}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [schemes, searchQuery, typeFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">

      {/* Header */}
      <div className={`${card} rounded-xl p-5 border space-y-1`}>
        <div className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 ${outline}`}>
          <Landmark className="w-3.5 h-3.5 text-status-info" /> // GOVERNMENT ASSISTANCE PROGRAMMES
        </div>
        <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>RELIEF &amp; WELFARE SCHEMES FOR DISASTER-AFFECTED CITIZENS</h2>
        <p className={`text-[11px] font-mono ${muted}`}>
          Curated central government schemes for compensation, insurance, food security, housing and livelihood recovery.
          Verify current norms on the official portal before applying.
        </p>
        <div className={`flex items-start gap-2 p-3 mt-2 rounded-lg border text-[10px] font-sans leading-relaxed ${
          isDark ? 'bg-status-warning-bg/20 border-status-warning/40 text-status-warning' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Scheme details are indicative summaries for awareness only. Official directives from the administering
            ministry/state government take precedence.
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className={`${card} rounded-xl p-3 border space-y-3`}>
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${outline}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheme, ministry, purpose..."
            className={`w-full pl-9 pr-4 py-2 border rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-status-info ${
              isDark ? 'bg-ops-container border-ops-divider text-ops-text placeholder:text-ops-outline' : 'bg-white border-day-divider text-day-text placeholder:text-day-outline'
            }`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {TYPE_FILTERS.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider border transition-all ${
                typeFilter === type
                  ? 'bg-status-info/20 border-status-info/60 text-status-info'
                  : `${cardLow} ${muted} hover:border-status-info/40`
              }`}
            >
              {label}
            </button>
          ))}
          <span className={`ml-auto text-[10px] font-mono ${outline}`}>{filtered.length} OF {schemes.length}</span>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3">
        {filtered.map((scheme) => {
          const expanded = expandedId === scheme.id;
          return (
            <div key={scheme.id} className={`${card} rounded-xl border overflow-hidden transition-all ${expanded ? 'ring-1 ring-status-info/40' : ''}`}>
              {/* Collapsed header row */}
              <button
                onClick={() => setExpandedId(expanded ? null : scheme.id)}
                className={`w-full text-left p-4 flex items-start justify-between gap-3`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-status-info/15 text-status-info border border-status-info/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                      {scheme.level}
                    </span>
                    <h3 className={`font-mono font-bold text-sm leading-snug ${text}`}>{scheme.name}</h3>
                  </div>
                  <div className={`text-[10px] font-mono ${outline}`}>{scheme.administeringBody.toUpperCase()}</div>
                  <p className={`text-xs font-sans leading-relaxed ${muted} line-clamp-2`}>{scheme.summary}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {scheme.applicableDisasterTypes.map((t) => (
                      <span key={t} className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${cardLow} ${outline}`}>
                        {t.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180 text-status-info' : outline}`} />
              </button>

              {/* Expanded detail */}
              {expanded && (
                <div className={`px-4 pb-4 space-y-4 border-t ${divider} pt-4`}>

                  {/* Benefits */}
                  <div className="space-y-1.5">
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-status-success`}>
                      <IndianRupee className="w-3 h-3" /> KEY BENEFITS
                    </div>
                    <p className={`text-xs font-sans leading-relaxed p-3 rounded-lg border ${cardLow} ${muted}`}>{scheme.benefitDetails}</p>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-status-info">
                      <BadgeCheck className="w-3 h-3" /> ELIGIBILITY
                    </div>
                    <p className={`text-xs font-sans leading-relaxed p-3 rounded-lg border ${cardLow} ${muted}`}>{scheme.eligibility}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Documents */}
                    <div className="space-y-1.5">
                      <div className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${outline}`}>
                        <FileCheck className="w-3 h-3" /> DOCUMENTS REQUIRED
                      </div>
                      <ul className="space-y-1">
                        {scheme.documentsRequired.map((doc, i) => (
                          <li key={i} className={`text-[11px] font-sans leading-snug flex items-start gap-1.5 ${muted}`}>
                            <span className="text-status-info font-mono">▸</span> {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How to apply */}
                    <div className="space-y-1.5">
                      <div className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${outline}`}>
                        <ClipboardList className="w-3 h-3" /> HOW TO APPLY
                      </div>
                      <ol className="space-y-1">
                        {scheme.howToApply.map((step, i) => (
                          <li key={i} className={`text-[11px] font-sans leading-snug flex items-start gap-1.5 ${muted}`}>
                            <span className="font-mono font-bold text-status-info shrink-0">{i + 1}.</span> {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Contact strip */}
                  <div className={`flex flex-wrap items-center gap-3 pt-1 border-t ${divider}`}>
                    {(() => {
                      const portalHref = extractPortalUrl(scheme.portalUrl);
                      return portalHref ? (
                        <a
                          href={portalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-[10px] tracking-wider px-3 py-1.5 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> OFFICIAL PORTAL
                        </a>
                      ) : null;
                    })()}
                    {scheme.helpline && (
                      <span className={`inline-flex items-center gap-1.5 mt-2 text-[10px] font-mono font-bold text-status-success`}>
                        <Phone className="w-3 h-3" /> {scheme.helpline}
                      </span>
                    )}
                    <span className={`ml-auto mt-2 text-[9px] font-mono ${outline}`}>ID: {scheme.id}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={`${card} rounded-xl p-8 border text-center`}>
            <Landmark className={`w-6 h-6 mx-auto mb-2 ${outline}`} />
            <p className={`text-xs font-mono ${muted}`}>No schemes match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
