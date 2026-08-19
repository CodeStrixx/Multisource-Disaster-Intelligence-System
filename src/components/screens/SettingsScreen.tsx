import React, { useState } from 'react';
import { SlidersHorizontal, MapPin, Bell, Globe, Sun, Moon, Save, CheckCircle2 } from 'lucide-react';

interface SettingsScreenProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isDark = true, onToggleTheme }) => {
  const [locationPermission, setLocationPermission] = useState(true);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);
  const [moderateAlerts, setModerateAlerts] = useState(true);
  const [language, setLanguage] = useState('English');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const card     = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow  = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text     = isDark ? 'text-ops-text'    : 'text-day-text';
  const muted    = isDark ? 'text-ops-muted'   : 'text-day-muted';
  const outline  = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider  = isDark ? 'border-ops-divider' : 'border-day-divider';
  const inputCls = isDark
    ? 'w-full p-2.5 bg-ops-low border border-ops-divider rounded-md text-xs font-mono text-ops-text focus:ring-1 focus:ring-status-info focus:outline-none'
    : 'w-full p-2.5 bg-day-low border border-day-divider rounded-md text-xs font-mono text-day-text focus:ring-1 focus:ring-blue-500 focus:outline-none';

  const SettingRow = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className={`flex items-center justify-between p-3 ${cardLow} rounded-lg border cursor-pointer`}>
      <div>
        <div className={`font-mono font-bold text-xs tracking-wider ${text}`}>{label}</div>
        <div className={`text-[11px] font-sans mt-0.5 ${muted}`}>{desc}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded"
        style={{ accentColor: isDark ? '#3b82f6' : '#2563eb' }}
      />
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      
      {/* Page Header */}
      <div className={`${card} rounded-xl p-5 border`}>
        <div className={`flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase ${outline} mb-1`}>
          <SlidersHorizontal className="w-3.5 h-3.5 text-status-info" /> // PREFERENCES &amp; SYSTEM CONTROLS
        </div>
        <h2 className={`text-xl font-bold font-mono tracking-tight ${text}`}>SYSTEM SETTINGS</h2>
        <p className={`text-[11px] font-mono ${muted} mt-0.5`}>Customize location permissions, alert thresholds, and interface preferences.</p>
      </div>

      {/* Settings Panels */}
      <div className={`${card} rounded-xl p-5 border space-y-6`}>

        {/* ── Theme Toggle ── */}
        <div className={`space-y-3 pb-5 border-b ${divider}`}>
          <h3 className={`font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 ${text}`}>
            {isDark ? <Moon className="w-4 h-4 text-status-info" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Interface Theme
          </h3>
          <div className={`flex items-center justify-between p-3 ${cardLow} rounded-lg border`}>
            <div>
              <div className={`font-mono font-bold text-xs tracking-wider ${text}`}>
                {isDark ? 'DARK MODE — Tactical Ops-Center' : 'LIGHT MODE — Clean Professional'}
              </div>
              <div className={`text-[11px] font-sans mt-0.5 ${muted}`}>
                {isDark ? 'Deep navy background with monospaced tactical design.' : 'Light blue-tinted clean interface for daytime use.'}
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md font-mono font-bold text-[10px] tracking-widest border transition-all ${
                isDark
                  ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-status-info hover:border-status-info/50'
                  : 'bg-day-container border-day-divider text-day-muted hover:text-blue-600 hover:border-blue-400'
              }`}
            >
              {isDark ? <><Sun className="w-3.5 h-3.5" /> SWITCH TO LIGHT</> : <><Moon className="w-3.5 h-3.5" /> SWITCH TO DARK</>}
            </button>
          </div>
        </div>

        {/* ── Location ── */}
        <div className={`space-y-3 pb-5 border-b ${divider}`}>
          <h3 className={`font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 ${text}`}>
            <MapPin className="w-4 h-4 text-status-info" /> Location &amp; Geofencing
          </h3>
          <SettingRow
            label="AUTOMATIC LOCATION DETECTION"
            desc="Use browser GPS to detect local disaster risks automatically."
            checked={locationPermission}
            onChange={setLocationPermission}
          />
        </div>

        {/* ── Notifications ── */}
        <div className={`space-y-3 pb-5 border-b ${divider}`}>
          <h3 className={`font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 ${text}`}>
            <Bell className="w-4 h-4 text-status-critical" /> Broadcast Alert Thresholds
          </h3>
          <SettingRow
            label="CRITICAL &amp; HIGH RISK ALERTS"
            desc="Immediate notifications for severe rainfall, floods, and landslides."
            checked={highRiskAlerts}
            onChange={setHighRiskAlerts}
          />
          <SettingRow
            label="MODERATE ADVISORY ALERTS"
            desc="Daily weather summaries and high tide advisories."
            checked={moderateAlerts}
            onChange={setModerateAlerts}
          />
        </div>

        {/* ── Language ── */}
        <div className={`space-y-3 pb-5 border-b ${divider}`}>
          <h3 className={`font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 ${text}`}>
            <Globe className="w-4 h-4 text-status-success" /> Language &amp; Regional Localization
          </h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={inputCls}
          >
            <option value="English">English (Default)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
          </select>
        </div>

        {/* ── Save ── */}
        <div className="flex items-center justify-between pt-1">
          {savedSuccess ? (
            <span className="text-[11px] font-mono font-bold text-status-success flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> PREFERENCES SAVED
            </span>
          ) : (
            <span className={`text-[11px] font-mono ${outline}`}>Changes take effect immediately.</span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-[10px] tracking-widest rounded-md shadow transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> SAVE PREFERENCES
          </button>
        </div>

      </div>
    </div>
  );
};
