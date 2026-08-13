import React from 'react';
import { Alert } from '../../types/disaster';
import { RiskBadge } from '../common/TrustBadges';
import { X, ShieldAlert, MapPin, LifeBuoy, ArrowRight, Clock } from 'lucide-react';

interface AlertDetailModalProps {
  alertItem: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToEventDetails: (eventId: string) => void;
  onFindHelp: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alertItem,
  isOpen,
  onClose,
  onGoToEventDetails,
  onFindHelp
}) => {
  if (!isOpen || !alertItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-surface-border">
        {/* Header */}
        <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-100" />
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-100/90">Emergency Broadcast (S12)</span>
              <h3 className="font-bold text-base leading-tight">Expanded Alert Intelligence</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-100 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs text-textMain-primary">
          <div className="flex items-center justify-between">
            <RiskBadge severity={alertItem.severity} size="default" />
            <span className="text-textMain-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Issued at {alertItem.createdAt.split('T')[1].slice(0, 5)} IST
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-brand-900 leading-snug">{alertItem.title}</h2>
            <div className="text-xs text-textMain-secondary flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-700" /> {alertItem.locationName}
            </div>
          </div>

          <div className="bg-surface-bg p-4 rounded-lg border border-surface-border text-sm leading-relaxed">
            {alertItem.message}
          </div>

          <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded-r-lg space-y-1">
            <strong className="text-red-950 font-bold block">Recommended Citizen Action:</strong>
            <p className="text-red-900 leading-normal">{alertItem.recommendedAction}</p>
          </div>

          <div className="text-[11px] text-textMain-muted flex items-center justify-between border-t pt-2">
            <span>Issuing Authority: <strong>{alertItem.source}</strong></span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-bg border-t border-surface-border flex flex-col sm:flex-row gap-2 justify-end">
          <button
            onClick={() => {
              onClose();
              onFindHelp();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-brand-500 hover:bg-brand-700 text-white font-semibold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <LifeBuoy className="w-4 h-4" /> Find Nearby Relief
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToEventDetails(alertItem.eventId);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            Full Incident Details <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
