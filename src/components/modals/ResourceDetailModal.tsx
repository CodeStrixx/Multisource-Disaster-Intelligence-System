import React from 'react';
import { ReliefResource } from '../../types/disaster';
import { X, Phone, MapPin, Navigation, ShieldCheck, Clock, Building } from 'lucide-react';

interface ResourceDetailModalProps {
  resource: ReliefResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  isOpen,
  onClose
}) => {
  if (!isOpen || !resource) return null;

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${resource.lat},${resource.lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-surface-border">
        {/* Header */}
        <div className="bg-brand-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-brand-100" />
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-100/90">{resource.type.replace('_', ' ')} (S10)</span>
              <h3 className="font-bold text-lg leading-tight">{resource.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-brand-100 hover:text-white p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs text-textMain-primary">
          <div className="bg-surface-bg p-3.5 rounded-lg border border-surface-border space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-900 text-sm">Full Address:</strong>
                <p className="text-textMain-secondary">{resource.address}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <span className="text-emerald-900 font-medium block text-[11px]">Operating Status</span>
              <span className="text-sm font-extrabold text-emerald-800 uppercase">{resource.status}</span>
            </div>

            {resource.capacity && (
              <div className="bg-brand-50 p-3 rounded-lg border border-brand-100">
                <span className="text-brand-900 font-medium block text-[11px]">Capacity / Stock</span>
                <span className="text-sm font-extrabold text-brand-700">{resource.capacity}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-surface-bg rounded-lg border border-surface-border space-y-1.5">
            <div className="flex items-center justify-between text-textMain-secondary">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-brand-700" /> Data Source:</span>
              <strong className="text-brand-900">{resource.source}</strong>
            </div>
            <div className="flex items-center justify-between text-textMain-secondary">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-700" /> Last Updated:</span>
              <strong className="text-brand-900">{resource.updatedAt}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-bg border-t border-surface-border flex flex-col sm:flex-row gap-2 justify-end">
          <a
            href={`tel:${resource.phone}`}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4" /> Call {resource.phone}
          </a>

          <button
            onClick={handleDirections}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-4 h-4" /> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};
