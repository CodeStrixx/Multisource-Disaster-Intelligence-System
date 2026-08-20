import React from 'react';
import { Shield, MapPin, AlertTriangle, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllowLocation: () => void;
  isDark?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onAllowLocation,
  isDark = true,
}) => {
  if (!isOpen) return null;

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`${card} rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border`}>
        
        {/* Header */}
        <div className={`p-5 flex items-center gap-3 border-b ${divider} ${isDark ? 'bg-ops-surface' : 'bg-day-container'}`}>
          <div className="w-10 h-10 rounded-lg bg-status-info/20 border border-status-info/40 flex items-center justify-center text-status-info shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className={`text-lg font-bold font-mono tracking-tight leading-none ${text}`}>
              DISASTER OPS-CENTER
            </h2>
            <p className={`text-[10px] font-mono tracking-wider mt-1 ${muted}`}>
              MULTI-SOURCE INTELLIGENCE &amp; RESPONSE // INDIA
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          <p className={`font-mono text-xs leading-relaxed ${text}`}>
            This ops-center platform correlates official government alerts, weather radar signals, and citizen observations to answer three critical operational questions:
          </p>

          <div className="space-y-2 font-mono">
            {[
              { num: '01', title: 'WHAT IS HAPPENING?', desc: 'Real-time location-aware GIS hazard mapping & rainfall telemetry.' },
              { num: '02', title: 'CAN I TRUST IT?', desc: 'Multi-source attribution, corroboration engine, and verification badges.' },
              { num: '03', title: 'WHAT SHOULD I DO?', desc: 'Clear risk classifications, safety protocols, and relief resource routing.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className={`p-3 ${cardLow} rounded-lg border flex items-start gap-2.5`}>
                <span className="text-status-info font-mono font-bold text-xs shrink-0">{num}</span>
                <div>
                  <strong className={`font-mono text-xs tracking-wider block ${text}`}>{title}</strong>
                  <p className={`text-[11px] font-sans mt-0.5 ${muted}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${isDark ? 'bg-status-warning-bg/20 border-status-warning/40 text-status-warning' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
            <div className="font-sans text-[11px]">
              <strong>Public Safety Notice:</strong> This system provides decision support. Official directives from NDMA, SDMA, and District Collectors take precedence.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`p-4 border-t ${divider} flex flex-col sm:flex-row gap-2 justify-end ${isDark ? 'bg-ops-surface' : 'bg-day-low'}`}>
          <button
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2 font-mono text-[11px] font-bold tracking-wider rounded-md border transition-colors ${
              isDark ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-ops-text' : 'bg-day-container border-day-divider text-day-muted hover:text-day-text'
            }`}
          >
            EXPLORE MANUALLY
          </button>

          <button
            onClick={() => {
              onAllowLocation();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-[11px] tracking-wider rounded-md shadow transition-all flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" /> ENABLE LOCATION <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
