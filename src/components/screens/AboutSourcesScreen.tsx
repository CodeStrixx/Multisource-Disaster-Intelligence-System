import React from 'react';
import { MOCK_DATA_SOURCES } from '../../data/mockDisasterData';
import { SourceBadge } from '../common/TrustBadges';
import { Info, ShieldCheck, Database, Layers, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const AboutSourcesScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-brand-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4 text-brand-100" /> System Architecture & Data Provenance (S15)
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">About Data Sources & Verification Pipeline</h2>
        <p className="text-xs text-brand-100/80 mt-0.5">Transparent documentation on data ingest providers, update frequency, rule engine, and explicit limitations.</p>
      </div>

      {/* Mandatory Emergency Disclaimer Card */}
      <div className="p-5 bg-amber-50 rounded-xl border border-amber-300 space-y-2 text-amber-950 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>EXPLICIT SYSTEM LIMITATION & LEGAL DISCLAIMER</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-900 font-medium">
          “This system provides decision support and does not replace official emergency instructions. Official directives from the National Disaster Management Authority (NDMA), State Disaster Management Authorities (SDMA), India Meteorological Department (IMD), local police, and district collectors take absolute precedence during active hazards.”
        </p>
      </div>

      {/* Data Ingestion Providers Matrix */}
      <div className="bg-white rounded-xl p-6 border border-surface-border shadow-sm space-y-4">
        <h3 className="text-base font-bold text-brand-900 flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="w-5 h-5 text-brand-700" /> Ingested Data Providers & Update Frequencies
        </h3>

        <div className="space-y-3">
          {MOCK_DATA_SOURCES.map((src) => (
            <div key={src.id} className="p-4 bg-surface-bg rounded-lg border border-surface-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-sm text-brand-900">{src.name}</div>
                <SourceBadge type={src.type} />
              </div>

              <div className="flex items-center gap-4 text-textMain-secondary">
                <div>
                  <span className="block text-[10px] text-textMain-muted uppercase">Reliability Rating</span>
                  <strong className="text-brand-900 text-sm">{src.reliabilityScore}%</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-textMain-muted uppercase">Sync Cadence</span>
                  <strong className="text-brand-700">{src.lastSync}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Pipeline & Trust Architecture */}
      <div className="bg-white rounded-xl p-6 border border-surface-border shadow-sm space-y-4 text-xs text-textMain-primary">
        <h3 className="text-base font-bold text-brand-900 flex items-center gap-2 border-b pb-2">
          <Layers className="w-5 h-5 text-brand-700" /> Three-Tier Verification Engine
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 space-y-2">
            <span className="font-bold text-brand-900 text-sm block">1. Signal Ingestion</span>
            <p className="text-textMain-secondary leading-relaxed">
              External meteorological APIs (IMD radar, CWC water level gauges) are ingested and normalized into standard geospatial schemas every 5-15 minutes.
            </p>
          </div>

          <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 space-y-2">
            <span className="font-bold text-brand-900 text-sm block">2. Corroboration Engine</span>
            <p className="text-textMain-secondary leading-relaxed">
              Public citizen reports are matched geographically within a 2km radius. Multi-report clustering elevates status from UNVERIFIED to CORROBORATED.
            </p>
          </div>

          <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 space-y-2">
            <span className="font-bold text-brand-900 text-sm block">3. Risk Classification</span>
            <p className="text-textMain-secondary leading-relaxed">
              Severity levels (Low, Moderate, High, Critical) are computed based on rainfall intensity, population exposure, and official alert status.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
