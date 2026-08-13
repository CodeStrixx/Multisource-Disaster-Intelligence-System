import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, Bell, Globe, Shield, Eye, Save } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [locationPermission, setLocationPermission] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [moderateAlerts, setModerateAlerts] = useState(true);
  const [language, setLanguage] = useState('English');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      <div className="bg-brand-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4 text-brand-100" /> Preferences & System Controls (S14)
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">System Settings</h2>
        <p className="text-xs text-brand-100/80 mt-0.5">Customize location permissions, alert thresholds, and language preferences.</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-surface-border shadow-sm space-y-6 text-sm text-textMain-primary">
        
        {/* Location & GPS Settings */}
        <div className="space-y-3 border-b pb-5">
          <h3 className="font-bold text-brand-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-700" /> Location & Geofencing
          </h3>
          <div className="flex items-center justify-between p-3 bg-surface-bg rounded-lg border">
            <div>
              <div className="font-semibold text-xs text-brand-900">Automatic Location Detection</div>
              <div className="text-[11px] text-textMain-secondary">Use browser GPS to detect local disaster risks automatically.</div>
            </div>
            <input
              type="checkbox"
              checked={locationPermission}
              onChange={(e) => setLocationPermission(e.target.checked)}
              className="w-4 h-4 text-brand-700 rounded focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Notifications & Alert Thresholds */}
        <div className="space-y-3 border-b pb-5">
          <h3 className="font-bold text-brand-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-700" /> Push Notifications & Thresholds
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 bg-surface-bg rounded-lg border cursor-pointer">
              <div>
                <div className="font-semibold text-xs text-brand-900">Critical & High Risk Broadcast Alerts</div>
                <div className="text-[11px] text-textMain-secondary">Immediate sound notifications for severe rainfall, floods, and landslides.</div>
              </div>
              <input
                type="checkbox"
                checked={highRiskAlerts}
                onChange={(e) => setHighRiskAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-700 rounded focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-bg rounded-lg border cursor-pointer">
              <div>
                <div className="font-semibold text-xs text-brand-900">Moderate Advisory Alerts</div>
                <div className="text-[11px] text-textMain-secondary">Receive daily weather summaries and high tide advisories.</div>
              </div>
              <input
                type="checkbox"
                checked={moderateAlerts}
                onChange={(e) => setModerateAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-700 rounded focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-3 border-b pb-5">
          <h3 className="font-bold text-brand-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-700" /> Language & Regional Localization
          </h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2.5 bg-surface-bg border border-surface-border rounded-md text-xs font-semibold text-brand-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="English">English (Default)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
              Preferences Saved Successfully!
            </span>
          ) : (
            <span className="text-xs text-textMain-muted">Changes take effect immediately.</span>
          )}

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
