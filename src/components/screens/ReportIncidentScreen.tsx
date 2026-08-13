import React, { useState } from 'react';
import { DisasterType, LocationCoordinates, IncidentReport } from '../../types/disaster';
import { PlusCircle, MapPin, Camera, AlertTriangle, CheckCircle2, Shield, Upload, FileText, Send, ArrowLeft } from 'lucide-react';

interface ReportIncidentScreenProps {
  currentLocation: LocationCoordinates;
  onSubmitReport: (newReport: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt' | 'upvotes'>) => void;
  onCancel: () => void;
}

export const ReportIncidentScreen: React.FC<ReportIncidentScreenProps> = ({
  currentLocation,
  onSubmitReport,
  onCancel
}) => {
  const [disasterType, setDisasterType] = useState<DisasterType>('flood');
  const [locationName, setLocationName] = useState(`${currentLocation.name}, ${currentLocation.district}`);
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('Anish Patel (Citizen)');
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
    { type: 'landslide', label: 'Landslide / Mudslide', icon: '⛰️' },
    { type: 'cyclone', label: 'Cyclone / High Winds', icon: '🌀' },
    { type: 'earthquake', label: 'Earthquake Shaking', icon: '⚡' },
    { type: 'heatwave', label: 'Extreme Heatwave', icon: '☀️' }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-brand-700 hover:text-brand-900 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
        <h2 className="text-lg font-extrabold text-brand-900 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-brand-700" /> Report an Incident (S07)
        </h2>
        <span className="text-xs text-textMain-muted">Step 1 of 1</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-surface-border shadow-md space-y-6">
        
        {/* Step 1: What Happened? (DisasterTypeSelector) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-brand-900">
            1. What happened? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {disasterTypesList.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setDisasterType(item.type)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col items-center justify-center gap-1 ${
                  disasterType === item.type
                    ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold ring-2 ring-brand-500/20'
                    : 'bg-white border-surface-border hover:bg-surface-bg text-textMain-primary'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Where? (LocationPicker) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-brand-900">
            2. Where did this occur? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-brand-700 absolute left-3 top-3" />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Enter precise landmark, road, or street..."
              className="w-full pl-9 pr-4 py-2 bg-surface-bg border border-surface-border rounded-md text-sm text-textMain-primary font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
              required
            />
          </div>
          <p className="text-[11px] text-textMain-secondary flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" /> GPS Coordinates automatically attached to report envelope.
          </p>
        </div>

        {/* Step 3: What did you see? (Description) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-brand-900">
            3. What did you observe? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe water level depth, road blockages, structural damage, stranded persons, or urgent safety hazards..."
            className="w-full p-3 bg-surface-bg border border-surface-border rounded-md text-sm text-textMain-primary focus:ring-2 focus:ring-brand-500 focus:outline-none"
            required
          ></textarea>
        </div>

        {/* Step 4: Evidence Photo/Video (MediaUploader) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-brand-900">
            4. Evidence / Photo Attachment (Optional)
          </label>
          
          <div className="border-2 border-dashed border-surface-border bg-surface-bg p-4 rounded-lg text-center hover:bg-brand-50/50 transition-colors relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleSimulatePhotoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {isUploading ? (
              <div className="text-xs text-brand-700 font-semibold animate-pulse py-2">
                Uploading & Verifying Geotag Metadata...
              </div>
            ) : uploadStatus === 'uploaded' ? (
              <div className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1.5 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Photo attached successfully (Metadata Geotagged)
              </div>
            ) : (
              <div className="space-y-1">
                <Camera className="w-6 h-6 text-brand-700 mx-auto" />
                <div className="text-xs font-semibold text-brand-900">Click or Tap to Attach Photo Evidence</div>
                <div className="text-[10px] text-textMain-muted">Supports JPG, PNG, WEBP. Geotag verified automatically.</div>
              </div>
            )}
          </div>
        </div>

        {/* User Identity Note */}
        <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 text-xs text-brand-900 flex items-start gap-2">
          <Shield className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
          <div>
            <strong>Report Trust Pipeline:</strong> Submitted reports enter <span className="font-bold text-amber-800 bg-amber-100 px-1 rounded">UNDER REVIEW</span> state. Multiple independent submissions in the same 500m radius automatically trigger <span className="font-bold text-blue-800 bg-blue-100 px-1 rounded">CORROBORATED</span> status.
          </div>
        </div>

        {/* Primary CTA Submit */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-white border border-surface-border text-textMain-secondary font-semibold text-xs rounded-md hover:bg-surface-bg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-2 py-2.5 px-6 bg-brand-700 hover:bg-brand-900 text-white font-bold text-xs rounded-md shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Report
          </button>
        </div>

      </form>
    </div>
  );
};
