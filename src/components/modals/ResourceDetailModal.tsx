import React from 'react';
import { ReliefResource } from '../../types/disaster';
import { X, Phone, MapPin, Navigation, ShieldCheck, Clock, Building } from 'lucide-react';

interface ResourceDetailModalProps {
  resource: ReliefResource | null;
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose,
  isDark = true,
}) => {
  if (!isOpen || !resource) return null;

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${resource.lat},${resource.lng}`, '_blank');
  };

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
            <Building className="w-5 h-5 text-status-info" />
            <div>
              <span className={`text-[10px] uppercase font-mono font-bold ${outline}`}>
                // {resource.type.replace('_', ' ')} (S10)
              </span>
              <h3 className={`font-mono font-bold text-base leading-tight ${text}`}>{resource.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className={`p-1 rounded-md ${muted} hover:${text}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs font-mono">
          <div className={`${cardLow} p-3.5 rounded-lg border space-y-1.5`}>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-status-info shrink-0 mt-0.5" />
              <div>
                <strong className={`block text-xs ${text}`}>ADDRESS:</strong>
                <p className={`font-sans text-[11px] mt-0.5 ${muted}`}>{resource.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border ${isDark ? 'bg-status-success-bg/20 border-status-success/40' : 'bg-emerald-50 border-emerald-200'}`}>
              <span className={`font-mono block text-[10px] ${outline}`}>STATUS</span>
              <span className="text-sm font-mono font-bold text-status-success uppercase">{resource.status}</span>
            </div>

            {resource.capacity && (
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-status-info-bg/20 border-status-info/40' : 'bg-blue-50 border-blue-200'}`}>
                <span className={`font-mono block text-[10px] ${outline}`}>CAPACITY / STOCK</span>
                <span className="text-sm font-mono font-bold text-status-info">{resource.capacity}</span>
              </div>
            )}
          </div>

          <div className={`p-3 ${cardLow} rounded-lg border space-y-1 text-[11px]`}>
            <div className={`flex items-center justify-between ${muted}`}>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-status-info" /> SOURCE:</span>
              <strong className={text}>{resource.source}</strong>
            </div>
            <div className={`flex items-center justify-between ${muted}`}>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-status-info" /> LAST SYNC:</span>
              <strong className={text}>{resource.updatedAt}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${divider} flex flex-col sm:flex-row gap-2 justify-end ${isDark ? 'bg-ops-surface' : 'bg-day-low'}`}>
          <a
            href={`tel:${resource.phone}`}
            className="w-full sm:w-auto px-4 py-2 bg-status-success hover:bg-emerald-600 text-white font-mono font-bold text-xs tracking-wider rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" /> CALL {resource.phone}
          </a>

          <button
            onClick={handleDirections}
            className="w-full sm:w-auto px-4 py-2 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" /> DIRECTIONS
          </button>
        </div>

      </div>
    </div>
  );
};
