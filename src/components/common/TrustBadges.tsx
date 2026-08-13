import React from 'react';
import { RiskSeverity, SourceType, VerificationStatus } from '../../types/disaster';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, Clock, CheckCircle2, FileText, HelpCircle, XCircle } from 'lucide-react';

interface RiskBadgeProps {
  severity: RiskSeverity;
  size?: 'compact' | 'default' | 'large';
  showLabel?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'default', showLabel = true }) => {
  const getStyle = () => {
    switch (severity) {
      case 'low':
        return 'bg-[#18864B]/10 text-[#18864B] border-[#18864B]/30';
      case 'moderate':
        return 'bg-[#C88719]/10 text-[#C88719] border-[#C88719]/30';
      case 'high':
        return 'bg-[#D65A1F]/10 text-[#D65A1F] border-[#D65A1F]/30';
      case 'critical':
        return 'bg-[#C62828]/10 text-[#C62828] border-[#C62828]/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'low':
        return <Info className="w-3.5 h-3.5" />;
      case 'moderate':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'high':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 animate-pulse" />;
    }
  };

  const sizeClasses = {
    compact: 'text-xs px-2 py-0.5 font-medium border rounded-sm',
    default: 'text-sm px-2.5 py-1 font-semibold border rounded-md',
    large: 'text-base px-3.5 py-1.5 font-bold border rounded-lg',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase tracking-wide ${getStyle()} ${sizeClasses[size]}`}>
      {getIcon()}
      {showLabel && <span>{severity} RISK</span>}
    </span>
  );
};

interface SourceBadgeProps {
  type: SourceType;
  name?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ type, name }) => {
  const getBadge = () => {
    switch (type) {
      case 'official':
        return {
          bg: 'bg-brand-100 text-brand-900 border-brand-500/30',
          label: name || 'Official Government Source',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
        };
      case 'trusted':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: name || 'Trusted Meteorological Source',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'corroborated':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          label: name || 'Corroborated Public Report',
          icon: <FileText className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'public':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          label: name || 'Public Citizen Report',
          icon: <FileText className="w-3.5 h-3.5 text-purple-600" />
        };
      case 'unverified':
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          label: name || 'Unverified Signal',
          icon: <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
        };
    }
  };

  const badge = getBadge();

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${badge.bg}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
};

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'VERIFIED':
        return { bg: 'bg-[#18864B]/10 text-[#18864B] border-[#18864B]/40', icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'VERIFIED' };
      case 'CORROBORATED':
        return { bg: 'bg-blue-100/80 text-blue-800 border-blue-300', icon: <FileText className="w-3.5 h-3.5" />, label: 'CORROBORATED' };
      case 'UNDER_REVIEW':
        return { bg: 'bg-amber-100/80 text-amber-800 border-amber-300', icon: <Clock className="w-3.5 h-3.5" />, label: 'UNDER REVIEW' };
      case 'UNVERIFIED':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: <HelpCircle className="w-3.5 h-3.5" />, label: 'UNVERIFIED' };
      case 'REJECTED':
        return { bg: 'bg-red-100 text-red-800 border-red-300', icon: <XCircle className="w-3.5 h-3.5" />, label: 'REJECTED' };
    }
  };

  const badge = getStyle();

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-sm border ${badge.bg}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
};

interface FreshnessIndicatorProps {
  timestamp: string;
  isStale?: boolean;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ timestamp, isStale = false }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-textMain-secondary font-medium">
      <span className={`w-2 h-2 rounded-full ${isStale ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
      <Clock className="w-3 h-3 text-textMain-muted" />
      <span>Updated {timestamp}</span>
    </span>
  );
};

interface SeverityIndicatorProps {
  severity: RiskSeverity;
  disasterType: string;
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({ severity, disasterType }) => {
  const getSymbol = () => {
    switch (severity) {
      case 'critical': return '▲ CRITICAL';
      case 'high': return '▲ HIGH';
      case 'moderate': return '■ MODERATE';
      case 'low': return '● LOW';
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'critical': return 'text-[#C62828] bg-red-50 border-red-200';
      case 'high': return 'text-[#D65A1F] bg-orange-50 border-orange-200';
      case 'moderate': return 'text-[#C88719] bg-amber-50 border-amber-200';
      case 'low': return 'text-[#18864B] bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className={`px-3 py-1.5 rounded-md border text-xs font-bold flex items-center gap-2 ${getColor()}`}>
      <span>{getSymbol()}</span>
      <span className="text-textMain-primary font-normal">| {disasterType.toUpperCase()} HAZARD</span>
    </div>
  );
};
