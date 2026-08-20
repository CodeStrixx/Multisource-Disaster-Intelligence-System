import React from 'react';
import { Home, Map, Bell, PlusCircle, LifeBuoy, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertCount: number;
  onOpenMore: () => void;
  isDark: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertCount,
  onOpenMore,
  isDark,
}) => {
  const bar     = isDark ? 'bg-ops-surface border-ops-divider'    : 'bg-white border-day-divider';
  const active  = isDark ? 'text-status-info'                      : 'text-blue-600';
  const inactive= isDark ? 'text-ops-outline hover:text-ops-muted' : 'text-gray-400 hover:text-gray-600';

  const items = [
    { tab: 'dashboard', icon: <Home className="w-5 h-5" />,       label: 'HOME' },
    { tab: 'map',       icon: <Map className="w-5 h-5" />,        label: 'MAP' },
    { tab: 'report',    icon: <PlusCircle className="w-5 h-5" />, label: 'REPORT' },
    { tab: 'alerts',    icon: <Bell className="w-5 h-5" />,       label: 'ALERTS', badge: unreadAlertCount },
    { tab: 'resources', icon: <LifeBuoy className="w-5 h-5" />,   label: 'HELP' },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 ${bar} border-t shadow-ops`}>
      <div className="flex items-center justify-around">
        {items.map(({ tab, icon, label, badge }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex flex-col items-center py-1.5 px-2 text-[10px] font-mono font-semibold tracking-widest transition-colors ${
              activeTab === tab ? active : inactive
            }`}
          >
            {icon}
            {badge !== undefined && badge > 0 && (
              <span className="absolute top-0.5 right-1 w-3.5 h-3.5 bg-status-critical text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
            <span className="mt-0.5">{label}</span>
          </button>
        ))}

        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center py-1.5 px-2 text-[10px] font-mono font-semibold tracking-widest transition-colors ${inactive}`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="mt-0.5">MORE</span>
        </button>
      </div>
    </nav>
  );
};
