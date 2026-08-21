import React, { useState } from 'react';
import { DisasterType, LocationCoordinates, IncidentReport } from '../../types/disaster';
import { PlusCircle, MapPin, Camera, CheckCircle2, Shield, Send, ArrowLeft } from 'lucide-react';

interface ReportIncidentScreenProps {
  currentLocation: LocationCoordinates;
  onSubmitReport: (newReport: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>) => void;
  onCancel: () => void;
  isDark?: boolean;
}

export const ReportIncidentScreen: React.FC<ReportIncidentScreenProps> = ({
  currentLocation,
  onSubmitReport,
  onCancel,
  isDark = true,
}) => {
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [locationName, setLocationName] = useState(`${currentLocation.name}, ${currentLocation.district}`);
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('Citizen Observer');
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploaded' | 'failed'>('idle');

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('uploaded');
        setMediaFile(URL.createObjectURL(e.target.files![0]));
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe what you observed during the incident.');
      return;
    }

    onSubmitReport({
      userName: userName.trim() || 'Anonymous Citizen',
      type: disasterType,
      description: description.trim(),
      lat: currentLocation.lat + (Math.random() - 0.5) * 0.02,
      lng: currentLocation.lng + (Math.random() - 0.5) * 0.02,
      locationName: locationName.trim(),
      mediaUrl: mediaFile || undefined,
      verificationStatus: 'UNDER_REVIEW',
      confidenceScore: 50
    });
  };

  const disasterTypesList: { type: DisasterType; label: string; icon: string }[] = [
    { type: 'flood', label: 'Flood / Inundation', icon: '🌊' },
    { type: 'heavy_rain', label: 'Heavy Rainfall', icon: '🌧️' },
    { type: 'landslide', label: 'Landslide', icon: '⛰️' },
    { type: 'cyclone', label: 'Cyclone / High Winds', icon: '🌀' },
    { type: 'earthquake', label: 'Earthquake Shaking', icon: '⚡' },
    { type: 'heatwave', label: 'Extreme Heatwave', icon: '☀️' }
  ];

  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const cardHigh= isDark ? 'bg-ops-high border-ops-divider'      : 'bg-day-container border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';
  const inputCls = isDark
    ? 'w-full p-2.5 bg-ops-low border border-ops-divider rounded-md font-mono text-xs text-ops-text placeholder:text-ops-outline focus:ring-1 focus:ring-status-info focus:outline-none'
    : 'w-full p-2.5 bg-day-low border border-day-divider rounded-md font-mono text-xs text-day-text placeholder:text-day-outline focus:ring-1 focus:ring-blue-500 focus:outline-none';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      
      {/* Header Bar */}
      <div className={`flex items-center justify-between border-b ${divider} pb-3`}>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-status-info hover:underline text-xs font-mono font-bold tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> CANCEL
        </button>
        <h2 className={`text-base font-bold font-mono tracking-tight flex items-center gap-2 ${text}`}>
          <PlusCircle className="w-4 h-4 text-status-info" /> // FIELD INCIDENT SUBMISSION (S07)
        </h2>
        <span className={`text-[10px] font-mono ${outline}`}>STEP 1 OF 1</span>
      </div>

      <form onSubmit={handleSubmit} className={`${card} rounded-xl p-5 border shadow-md space-y-5`}>
        
        {/* Step 1: Hazard Type */}
        <div className="space-y-2">
          <label className={`block text-xs font-mono font-bold tracking-wider uppercase ${text}`}>
            1. What hazard occurred? <span className="text-status-critical">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {disasterTypesList.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setDisasterType(item.type)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col items-center justify-center gap-1 font-mono text-xs ${
                  disasterType === item.type
                    ? 'bg-status-info/20 border-status-info text-status-info font-bold ring-1 ring-status-info/40'
                    : `${cardLow} ${muted} hover:${text} hover:border-status-info/40`
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] text-center font-bold">{item.label.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Location */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-mono font-bold tracking-wider uppercase ${text}`}>
            2. Where did this occur? <span className="text-status-critical">*</span>
          </label>
          <div className="relative">
            <MapPin className={`w-3.5 h-3.5 ${outline} absolute left-3 top-3`} />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Precise landmark, street, sector..."
              className={`pl-8 ${inputCls}`}
              required
            />
          </div>
          <p className={`text-[10px] font-mono flex items-center gap-1 ${muted}`}>
            <MapPin className="w-3 h-3 text-status-success" /> GPS coordinates will be geotagged to the submission envelope.
          </p>
        </div>

        {/* Step 3: Description */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-mono font-bold tracking-wider uppercase ${text}`}>
            3. What did you observe? <span className="text-status-critical">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe flood water depth, blocked routes, structural damages, stranded persons, or active risks..."
            className={inputCls}
            required
          />
        </div>

        {/* Step 4: Photo / Video Attachment */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-mono font-bold tracking-wider uppercase ${text}`}>
            4. Photo / Sensor Evidence (Optional)
          </label>
          
          <div className={`border-2 border-dashed ${divider} ${cardLow} p-4 rounded-lg text-center hover:border-status-info/50 transition-colors relative cursor-pointer`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleSimulatePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {isUploading ? (
              <div className="text-xs text-status-info font-mono font-bold animate-pulse py-2">
                UPLOADING &amp; VERIFYING GEOTAG METADATA...
              </div>
            ) : uploadStatus === 'uploaded' ? (
              <div className="text-xs text-status-success font-mono font-bold flex items-center justify-center gap-1.5 py-1">
                <CheckCircle2 className="w-4 h-4" /> PHOTO ATTACHED (METADATA GEOTAGGED)
              </div>
            ) : (
              <div className="space-y-1">
                <Camera className="w-5 h-5 text-status-info mx-auto" />
                <div className={`text-xs font-mono font-bold ${text}`}>CLICK TO ATTACH FIELD PHOTO</div>
                <div className={`text-[10px] font-mono ${outline}`}>Supports JPG, PNG, WEBP. Geotag verified automatically.</div>
              </div>
            )}
          </div>
        </div>

        {/* User Identity Note */}
        <div className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2 ${cardHigh} ${muted}`}>
          <Shield className="w-4 h-4 text-status-info shrink-0 mt-0.5" />
          <div>
            <strong className={text}>AUTOMATED CORROBORATION:</strong> Submitted reports enter <span className="font-bold text-status-warning">UNDER REVIEW</span>. Clustering with other reports or IMD sensors within 2km elevates status to <span className="font-bold text-status-info">CORROBORATED</span>.
          </div>
        </div>

        {/* Primary CTA Submit */}
        <div className="pt-1 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`flex-1 py-2.5 px-4 rounded-md font-mono text-xs font-bold tracking-wider border transition-colors ${
              isDark ? 'bg-ops-high border-ops-divider text-ops-muted hover:text-ops-text' : 'bg-day-container border-day-divider text-day-muted hover:text-day-text'
            }`}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 px-6 bg-status-info hover:bg-blue-500 text-white font-mono font-bold text-xs tracking-wider rounded-md shadow transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" /> SUBMIT FIELD REPORT
          </button>
        </div>

      </form>
    </div>
  );
};
