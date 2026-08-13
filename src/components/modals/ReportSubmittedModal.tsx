import React from 'react';
import { IncidentReport } from '../../types/disaster';
import { VerificationBadge } from '../common/TrustBadges';
import { CheckCircle2, Shield, ArrowRight, Copy, Share2 } from 'lucide-react';

interface ReportSubmittedModalProps {
  report: IncidentReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportSubmittedModal: React.FC<ReportSubmittedModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-surface-border text-center">
        
        {/* Banner Header */}
        <div className="bg-emerald-700 text-white p-6 space-y-2">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto text-white shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h3 className="text-xl font-extrabold">Report Submitted Successfully</h3>
          <p className="text-xs text-emerald-100">Thank you for contributing to public safety intelligence.</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-textMain-primary">
          <div className="bg-surface-bg p-3.5 rounded-lg border border-surface-border space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-textMain-muted">Report Reference ID:</span>
              <span className="font-mono font-bold text-brand-900 bg-brand-100 px-2 py-0.5 rounded">{report.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-textMain-muted">Verification Status:</span>
              <VerificationBadge status={report.verificationStatus} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-textMain-muted">Location:</span>
              <span className="font-semibold text-brand-900 truncate max-w-[200px]">{report.locationName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-textMain-muted">Disaster Hazard:</span>
              <span className="font-semibold capitalize text-brand-700">{report.type}</span>
            </div>
          </div>

          <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 text-left space-y-1 text-brand-900">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-brand-700" /> What Happens Next?
            </div>
            <p className="text-[11px] text-brand-900/80 leading-relaxed">
              Your report has been queued in the automated verification pipeline. If other citizens or official sensors corroborate this signal within 2 km, the risk badge will elevate automatically.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-bg border-t border-surface-border flex gap-2 justify-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            Return to Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
