import React from 'react';
import { Home, Map, Bell, PlusCircle, LifeBuoy, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertCount: number;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertCount,
  onOpenMore
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-border shadow-lg px-2 py-1">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-brand-700 font-bold' : 'text-textMain-secondary hover:text-brand-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'map' ? 'text-brand-700 font-bold' : 'text-textMain-secondary hover:text-brand-900'
          }`}
        >
          <Map className="w-5 h-5 mb-0.5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'report' ? 'text-brand-700 font-bold' : 'text-textMain-secondary hover:text-brand-900'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5 text-brand-500" />
          <span>Report</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`relative flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'alerts' ? 'text-brand-700 font-bold' : 'text-textMain-secondary hover:text-brand-900'
          }`}
        >
          <Bell className="w-5 h-5 mb-0.5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-risk-critical text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadAlertCount}
            </span>
          )}
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'resources' ? 'text-brand-700 font-bold' : 'text-textMain-secondary hover:text-brand-900'
          }`}
        >
          <LifeBuoy className="w-5 h-5 mb-0.5" />
          <span>Help</span>
        </button>

        <button
          onClick={onOpenMore}
          className="flex flex-col items-center py-1.5 px-3 rounded-md text-xs font-medium text-textMain-secondary hover:text-brand-900 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
};
