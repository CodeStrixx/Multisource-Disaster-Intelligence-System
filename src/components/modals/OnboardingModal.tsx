import React from 'react';
import { Shield, MapPin, Eye, AlertTriangle, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllowLocation: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onAllowLocation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-surface-border">
        {/* Header */}
        <div className="bg-brand-900 text-white p-6 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-700 border border-brand-500/40 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-7 h-7 text-brand-100" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Disaster Intelligence System</h2>
              <p className="text-xs text-brand-100/90">Multi-Source Response Support System for India</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-sm text-textMain-primary">
          <p className="font-medium text-brand-900">
            Welcome. This platform aggregates official government alerts, weather radar signals, and verified public reports to answer three critical questions during emergencies:
          </p>

          <div className="space-y-2.5 bg-surface-bg p-3.5 rounded-lg border border-surface-border">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <div>
                <strong className="text-brand-900">What is happening?</strong>
                <p className="text-xs text-textMain-secondary">Real-time location-aware GIS hazard mapping & rainfall tracking.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <div>
                <strong className="text-brand-900">Can I trust it?</strong>
                <p className="text-xs text-textMain-secondary">Visible source attribution, corroboration matrix, and verification badges.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <div>
                <strong className="text-brand-900">What should I do?</strong>
                <p className="text-xs text-textMain-secondary">Clear risk classifications, emergency guidance, and nearby relief resources.</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Public Safety Notice:</strong> This system provides decision support. Official instructions from NDMA, SDMA, and local administration take precedence.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-surface-bg border-t border-surface-border flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-textMain-secondary hover:text-brand-900 transition-colors"
          >
            Explore Manually
          </button>

          <button
            onClick={() => {
              onAllowLocation();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-brand-700 hover:bg-brand-900 text-white font-semibold text-xs rounded-md shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <MapPin className="w-4 h-4" /> Enable Location Access <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
