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
  isDark?: boolean;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alertItem,
  isOpen,
  onClose,
  onGoToEventDetails,
  onFindHelp,
  isDark = true,
}) => {
  if (!isOpen || !alertItem) return null;

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
        <div className={`p-4 flex items-center justify-between border-b ${divider} ${isDark ? 'bg-ops-surface' : 'bg-day-container'}`}>
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-status-critical" />
            <div>
              <span className={`text-[10px] uppercase font-mono font-bold ${outline}`}>// EMERGENCY BROADCAST (S12)</span>
              <h3 className={`font-mono font-bold text-base leading-tight ${text}`}>EXPANDED ALERT DOSSIER</h3>
            </div>
          </div>
          <button onClick={onClose} className={`p-1 rounded-md ${muted} hover:${text}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <RiskBadge severity={alertItem.severity} size="default" />
            <span className={`font-mono text-[10px] flex items-center gap-1 ${outline}`}>
              <Clock className="w-3.5 h-3.5" /> ISSUED {alertItem.createdAt.split('T')[1].slice(0, 5)} IST
            </span>
          </div>

          <div>
            <h2 className={`text-base font-mono font-bold leading-snug ${text}`}>{alertItem.title.toUpperCase()}</h2>
            <div className={`text-[11px] font-mono flex items-center gap-1 mt-1 ${muted}`}>
              <MapPin className="w-3.5 h-3.5 text-status-info" /> {alertItem.locationName.toUpperCase()}
            </div>
          </div>

          <div className={`${cardLow} p-3.5 rounded-lg border text-xs leading-relaxed font-sans ${muted}`}>
            {alertItem.message}
          </div>

          <div className="p-3 bg-status-critical-bg/20 border-l-4 border-l-status-critical rounded-r-lg space-y-1">
            <strong className="text-status-critical font-mono font-bold block text-xs">// RECOMMENDED ACTION:</strong>
            <p className={`text-xs font-sans leading-normal ${text}`}>{alertItem.recommendedAction}</p>
          </div>

          <div className={`text-[10px] font-mono ${outline} flex items-center justify-between border-t ${divider} pt-2`}>
            <span>ISSUING AUTHORITY: <strong className={text}>{alertItem.source}</strong></span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${divider} flex flex-col sm:flex-row gap-2 justify-end ${isDark ? 'bg-ops-surface' : 'bg-day-low'}`}>
          <button
            onClick={() => {
              onClose();
              onFindHelp();
            }}
            className={`w-full sm:w-auto px-4 py-2 font-mono font-bold text-xs tracking-wider rounded-md border transition-colors flex items-center justify-center gap-1.5 ${
              isDark ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-ops-text' : 'bg-day-container border-day-divider text-day-muted hover:text-day-text'
            }`}
          >
            <LifeBuoy className="w-4 h-4" /> FIND RELIEF
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToEventDetails(alertItem.eventId);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            FULL INCIDENT DOSSIER <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
