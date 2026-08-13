import React from 'react';
import { LocationCoordinates } from '../../types/disaster';
import { MapPin, Search, Bell, Shield, Info, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  currentLocation: LocationCoordinates;
  onOpenSearch: () => void;
  onOpenAlerts: () => void;
  onOpenSettings: () => void;
  unreadAlertCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onOpenSearch,
  onOpenAlerts,
  onOpenSettings,
  unreadAlertCount,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
      {/* Explicit System Disclaimer Banner */}
      <div className="bg-brand-700/80 text-brand-100 text-xs py-1 px-4 text-center flex items-center justify-center gap-1.5 border-b border-brand-500/20">
        <Info className="w-3.5 h-3.5 text-brand-100 shrink-0" />
        <span className="truncate">
          <strong>Decision Support System:</strong> Does not replace official emergency instructions from NDMA/SDMA.
        </span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-brand-500/20 border border-brand-100/30 flex items-center justify-center text-brand-100 shadow-inner">
              <Shield className="w-6 h-6 text-brand-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
                DISASTER INTEL
                <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-mono font-semibold">INDIA MVP</span>
              </h1>
              <p className="text-xs text-brand-100/80 hidden sm:block">Multi-Source Response Support System</p>
            </div>
          </div>

          {/* Center: Location Pill & Search Quick Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-brand-700/60 hover:bg-brand-700 border border-brand-500/40 rounded-pill px-3.5 py-1.5 text-sm transition-all shadow-sm max-w-[240px] sm:max-w-xs truncate group"
            title="Click to search location"
          >
            <MapPin className="w-4 h-4 text-brand-100 group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left truncate">
              <span className="font-semibold text-white block text-xs sm:text-sm truncate">
                {currentLocation.name}, {currentLocation.state}
              </span>
            </div>
            <Search className="w-3.5 h-3.5 text-brand-100/70 ml-auto shrink-0" />
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-brand-500 text-white font-semibold' : 'text-brand-100 hover:bg-brand-700/50'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'map' ? 'bg-brand-500 text-white font-semibold' : 'text-brand-100 hover:bg-brand-700/50'}`}
            >
              GIS Map
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'resources' ? 'bg-brand-500 text-white font-semibold' : 'text-brand-100 hover:bg-brand-700/50'}`}
            >
              Help & Resources
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'report' ? 'bg-brand-500 text-white font-semibold' : 'text-brand-100 hover:bg-brand-700/50'}`}
            >
              Report Incident
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'about' ? 'bg-brand-500 text-white font-semibold' : 'text-brand-100 hover:bg-brand-700/50'}`}
            >
              About / Data Sources
            </button>
          </nav>

          {/* Right Action Icons: Alerts & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-md hover:bg-brand-700/60 text-brand-100 transition-colors"
              title="Alerts & Broadcasts"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-risk-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-brand-900">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-md hover:bg-brand-700/60 text-brand-100 transition-colors"
              title="System Settings"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
