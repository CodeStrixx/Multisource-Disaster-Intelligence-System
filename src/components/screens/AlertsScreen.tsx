import React from 'react';
import { Alert } from '../../types/disaster';
import { RiskBadge } from '../common/TrustBadges';
import { Bell, MapPin, ArrowRight, ShieldAlert, CheckCheck, Clock } from 'lucide-react';

interface AlertsScreenProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onMarkAllAsRead: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onSelectAlert,
  onMarkAllAsRead
}) => {
  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-brand-900 text-white rounded-xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-brand-100" /> Broadcast Alerts & Emergency Bulletins (S11)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">Active Disaster Alerts</h2>
          <p className="text-xs text-brand-100/80 mt-0.5">Chronological feed of official weather warnings and safety evacuations.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-500 text-white font-semibold text-xs rounded-md shadow transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {alerts.map((alertItem) => (
          <div
            key={alertItem.id}
            onClick={() => onSelectAlert(alertItem)}
            className={`bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 relative overflow-hidden group ${
              !alertItem.read ? 'border-l-4 border-l-risk-critical border-surface-border' : 'border-surface-border opacity-90'
            }`}
          >
            {!alertItem.read && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-risk-critical animate-pulse"></span>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RiskBadge severity={alertItem.severity} size="compact" />
                <span className="text-xs text-textMain-secondary flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-700" /> {alertItem.locationName}
                </span>
              </div>
              <span className="text-[11px] text-textMain-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {alertItem.createdAt.split('T')[1].slice(0, 5)} IST
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-brand-900 group-hover:text-brand-700 transition-colors">
                {alertItem.title}
              </h3>
              <p className="text-xs text-textMain-primary mt-1 line-clamp-2">{alertItem.message}</p>
            </div>

            <div className="bg-brand-50 p-2.5 rounded-md border border-brand-100 flex items-center justify-between text-xs">
              <span className="text-brand-900 font-medium truncate max-w-[80%]">
                <strong>Recommended Action:</strong> {alertItem.recommendedAction}
              </span>
              <span className="text-brand-700 font-bold flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
                Inspect <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-surface-border text-center space-y-2">
            <Bell className="w-10 h-10 text-textMain-muted mx-auto" />
            <h4 className="font-bold text-brand-900">No active alerts for this region</h4>
            <p className="text-xs text-textMain-secondary">You are all caught up. New high-priority warnings will trigger notifications automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
