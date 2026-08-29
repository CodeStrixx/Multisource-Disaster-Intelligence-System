import React from 'react';
import { LocationCoordinates } from '../../types/disaster';
import { MapPin, Search, Bell, Shield, Info, SlidersHorizontal, Sun, Moon, Radio } from 'lucide-react';

interface HeaderProps {
  currentLocation: LocationCoordinates;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenSettings: () => void;
  unreadAlertCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onOpenSearch,
  onOpenAlerts,
  onOpenSettings,
  unreadAlertCount,
  activeTab,
  setActiveTab,
  isDark,
  onToggleTheme,
}) => {
  const bg        = isDark ? 'bg-ops-surface border-ops-divider' : 'bg-white border-day-divider';
  const text      = isDark ? 'text-ops-text'    : 'text-day-text';
  const muted     = isDark ? 'text-ops-muted'   : 'text-day-muted';
  const outline   = isDark ? 'border-ops-divider': 'border-day-divider';
  const tickerBg  = isDark ? 'bg-ops-bg border-ops-divider text-ops-muted' : 'bg-day-low border-day-divider text-day-muted';
  const btnHover  = isDark ? 'hover:bg-ops-high' : 'hover:bg-day-container';
  const pillBg    = isDark ? 'bg-ops-container border-ops-divider hover:bg-ops-high' : 'bg-day-low border-day-divider hover:bg-day-container';
  const navActive = isDark ? 'bg-ops-high text-ops-text font-semibold border border-ops-divider' : 'bg-day-container text-day-text font-semibold border border-day-divider';
  const navInactive= isDark ? `${muted} ${btnHover}` : `text-day-muted hover:bg-day-low`;

  const navItems = [
    { tab: 'dashboard', label: 'DASHBOARD' },
    { tab: 'map',       label: 'GIS MAP' },
    { tab: 'resources', label: 'RESOURCES' },
    { tab: 'schemes',   label: 'SCHEMES' },
    { tab: 'report',    label: 'REPORT' },
    { tab: 'about',     label: 'DATA SOURCES' },
  ];

  return (
    <header className={`sticky top-0 z-40 ${bg} border-b shadow-ops`}>
      
      {/* System Status Ticker Banner */}
      <div className={`${tickerBg} border-b text-[11px] py-1 px-4 flex items-center justify-between gap-3 font-mono`}>
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3 h-3 shrink-0 text-status-info" />
          <span className="truncate">
            <strong className="text-status-info">DECISION SUPPORT SYSTEM</strong>
            {' '}— Does not replace official instructions from NDMA / SDMA / District Collectors.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Radio className="w-3 h-3 text-status-success animate-pulse" />
          <span className="text-status-success font-semibold">LIVE</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo & Product Identity */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${isDark ? 'bg-ops-container border-ops-divider' : 'bg-day-container border-day-divider'} group-hover:border-status-info transition-colors`}>
              <Shield className={`w-5 h-5 ${isDark ? 'text-status-info' : 'text-blue-600'}`} />
            </div>
            <div className="hidden sm:block">
              <div className={`text-sm font-bold font-mono tracking-widest leading-none ${isDark ? 'text-ops-text' : 'text-day-text'}`}>
                DISASTER OPS-CENTER
              </div>
              <div className={`text-[10px] font-mono tracking-wider mt-0.5 ${isDark ? 'text-ops-muted' : 'text-day-muted'}`}>
                INDIA // MULTI-SOURCE INTELLIGENCE
              </div>
            </div>
          </button>

          {/* Center: Location Pill */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 ${pillBg} border rounded-pill px-3 py-1.5 text-xs transition-all shadow-sm max-w-[200px] sm:max-w-xs truncate group`}
            title="Click to search or change location"
          >
            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-status-info' : 'text-blue-600'}`} />
            <span className={`font-mono font-semibold truncate ${text}`}>
              {currentLocation.name}, {currentLocation.state}
            </span>
            <Search className={`w-3 h-3 ml-auto shrink-0 ${muted}`} />
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-0.5 text-[11px] font-mono">
            {navItems.map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1.5 rounded-md tracking-wider transition-all ${
                  activeTab === tab ? navActive : navInactive
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-all ${
                isDark
                  ? 'bg-ops-container border-ops-divider text-ops-muted hover:text-ops-text hover:bg-ops-high'
                  : 'bg-day-low border-day-divider text-day-muted hover:text-day-text hover:bg-day-container'
              }`}
            >
              {isDark
                ? <><Moon className="w-3.5 h-3.5" /><span className="hidden sm:inline">DARK</span></>
                : <><Sun className="w-3.5 h-3.5 text-amber-500" /><span className="hidden sm:inline">LIGHT</span></>
              }
            </button>

            {/* Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className={`relative p-2 rounded-md ${btnHover} ${muted} hover:${text} transition-colors`}
              title="Alerts & Broadcasts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-status-critical text-white text-[9px] font-bold font-mono rounded-full flex items-center justify-center ring-2 ring-ops-surface">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className={`p-2 rounded-md ${btnHover} ${muted} transition-colors`}
              title="System Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
