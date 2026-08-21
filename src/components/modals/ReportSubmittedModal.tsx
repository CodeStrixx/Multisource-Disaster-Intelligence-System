import React from 'react';
import { IncidentReport } from '../../types/disaster';
import { VerificationBadge } from '../common/TrustBadges';
import { CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface ReportSubmittedModalProps {
  report: IncidentReport | null;
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const ReportSubmittedModal: React.FC<ReportSubmittedModalProps> = ({
  report,
  isOpen,
  onClose,
  isDark = true,
}) => {
  if (!isOpen || !report) return null;

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`${card} rounded-xl shadow-2xl max-w-md w-full overflow-hidden border text-center`}>
        
        {/* Banner Header */}
        <div className="bg-status-success-bg/30 border-b border-status-success/40 p-5 space-y-1.5">
          <div className="w-12 h-12 rounded-full bg-status-success-bg/40 border border-status-success/50 flex items-center justify-center mx-auto text-status-success shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className={`text-base font-mono font-bold tracking-tight text-status-success`}>
            // REPORT QUEUED IN OPS PIPELINE
          </h3>
          <p className={`text-[11px] font-mono ${muted}`}>Intelligence signal submitted successfully.</p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5 text-xs text-left font-mono">
          <div className={`${cardLow} p-3.5 rounded-lg border space-y-2`}>
            <div className="flex items-center justify-between">
              <span className={outline}>REPORT ID:</span>
              <span className="font-bold text-status-info bg-status-info-bg/30 px-2 py-0.5 rounded border border-status-info/40">{report.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={outline}>STATUS:</span>
              <VerificationBadge status={report.verificationStatus} />
            </div>

            <div className="flex items-center justify-between">
              <span className={outline}>LOCATION:</span>
              <span className={`font-semibold truncate max-w-[180px] ${text}`}>{report.locationName.toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={outline}>HAZARD TYPE:</span>
              <span className="font-semibold uppercase text-status-warning">{report.type}</span>
            </div>
          </div>

          <div className={`p-3 rounded-lg border space-y-1 ${isDark ? 'bg-ops-high border-ops-divider text-ops-muted' : 'bg-day-container border-day-divider text-day-muted'}`}>
            <div className={`font-bold flex items-center gap-1.5 text-xs ${text}`}>
              <Shield className="w-3.5 h-3.5 text-status-info" /> // NEXT ACTIONS
            </div>
            <p className="text-[11px] font-sans leading-relaxed">
              Your signal is now undergoing automated spatial corroboration. If other field reports or sensors verify within 2km, the threat status will elevate across the ops-center.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${divider} flex justify-center ${isDark ? 'bg-ops-surface' : 'bg-day-low'}`}>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            RETURN TO OPS-CENTER <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
