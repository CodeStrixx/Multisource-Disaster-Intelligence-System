import React from 'react';
import { Alert } from '../../types/disaster';
import { RiskBadge } from '../common/TrustBadges';
import { Bell, MapPin, ArrowRight, CheckCheck, Clock } from 'lucide-react';

interface AlertsScreenProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  onMarkAllAsRead: () => void;
  isDark?: boolean;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  onSelectAlert,
  onMarkAllAsRead,
  isDark = true,
}) => {
  const unreadCount = alerts.filter((a) => !a.read).length;
  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      {/* Tactical Header */}
      <div className={`${card} rounded-xl p-5 border flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase ${outline} mb-1`}>
            <Bell className="w-3.5 h-3.5 text-status-critical" /> // BROADCAST ALERTS &amp; EMERGENCY BULLETINS
          </div>
          <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>ACTIVE DISASTER ALERTS</h2>
          <p className={`text-[11px] font-mono ${muted} mt-0.5`}>Chronological feed of official weather warnings and safety evacuations.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-[10px] tracking-widest rounded-md shadow transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" /> MARK ALL READ ({unreadCount})
          </button>
        )}
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {alerts.map((alertItem) => (
          <div
            key={alertItem.id}
            onClick={() => onSelectAlert(alertItem)}
            className={`${card} rounded-xl p-4 border transition-all cursor-pointer space-y-3 relative overflow-hidden group hover:border-status-info/60 ${
              !alertItem.read ? 'border-l-4 border-l-status-critical' : 'opacity-80'
            }`}
          >
            {!alertItem.read && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-status-critical animate-pulse" />
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RiskBadge severity={alertItem.severity} size="compact" />
                <span className={`text-[11px] font-mono flex items-center gap-1 ${muted}`}>
                  <MapPin className="w-3 h-3 text-status-info" /> {alertItem.locationName.toUpperCase()}
                </span>
              </div>
              <span className={`text-[10px] font-mono flex items-center gap-1 ${outline}`}>
                <Clock className="w-3 h-3" /> {alertItem.createdAt.split('T')[1].slice(0, 5)} IST
              </span>
            </div>

            <div>
              <h3 className={`font-bold font-mono text-sm leading-snug ${text} group-hover:text-status-info transition-colors`}>
                {alertItem.title.toUpperCase()}
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 font-sans ${muted}`}>{alertItem.message}</p>
            </div>

            <div className={`p-2.5 rounded-md border flex items-center justify-between text-[11px] font-mono ${isDark ? 'bg-ops-high border-ops-divider' : 'bg-day-container border-day-divider'}`}>
              <span className={`truncate max-w-[80%] ${muted}`}>
                <strong className={text}>ACTION:</strong> {alertItem.recommendedAction}
              </span>
              <span className="text-status-info font-bold flex items-center gap-1 shrink-0 group-hover:translate-x-1 transition-transform">
                INSPECT <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className={`${card} rounded-xl p-8 border text-center space-y-2`}>
            <Bell className={`w-10 h-10 ${outline} mx-auto`} />
            <h4 className={`font-bold font-mono ${text}`}>// NO ACTIVE ALERTS</h4>
            <p className={`text-xs font-mono ${muted}`}>All clear. High-priority warnings will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};

