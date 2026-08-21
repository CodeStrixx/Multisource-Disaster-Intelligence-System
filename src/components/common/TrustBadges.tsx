import React from 'react';
import { RiskSeverity, SourceType, VerificationStatus } from '../../types/disaster';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, Clock, CheckCircle2, FileText, HelpCircle, XCircle, Tv, Radio } from 'lucide-react';

// ── RiskBadge ──────────────────────────────────────────────────────────────
interface RiskBadgeProps {
  severity: RiskSeverity;
  size?: 'compact' | 'default' | 'large';
  showLabel?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'default', showLabel = true }) => {
  const getStyle = () => {
    switch (severity) {
      case 'low':      return 'bg-status-success-bg/20 text-status-success border-status-success/40';
      case 'moderate': return 'bg-status-warning-bg/20 text-status-warning border-status-warning/40';
      case 'high':     return 'bg-orange-900/20 text-orange-400 border-orange-500/40';
      case 'critical': return 'bg-status-critical-bg/20 text-status-critical border-status-critical/40';
      default:         return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'low':      return <Info className="w-3.5 h-3.5" />;
      case 'moderate': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'high':     return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'critical': return <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />;
    }
  };

  const sizeClasses = {
    compact: 'text-[10px] px-1.5 py-0.5 font-semibold border rounded-sm font-mono tracking-widest',
    default: 'text-xs px-2.5 py-1 font-bold border rounded-md font-mono tracking-widest',
    large:   'text-sm px-3 py-1.5 font-bold border rounded-lg font-mono tracking-widest',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase ${getStyle()} ${sizeClasses[size]}`}>
      {getIcon()}
      {showLabel && <span>{severity} RISK</span>}
    </span>
  );
};

// ── SourceBadge ────────────────────────────────────────────────────────────
interface SourceBadgeProps {
  type: SourceType;
  name?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ type, name }) => {
  const getBadge = () => {
    switch (type) {
      case 'official':
        return { style: 'bg-status-info-bg/30 text-status-info border-status-info/40', label: name || 'Official Gov Source', icon: <ShieldCheck className="w-3 h-3" /> };
      case 'regional_media':
        return { style: 'bg-amber-500/20 text-amber-300 border-amber-500/40', label: name || 'Regional News Bureau', icon: <Tv className="w-3 h-3 text-amber-400" /> };
      case 'news_wire':
        return { style: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', label: name || 'National News Wire (PTI/ANI)', icon: <Radio className="w-3 h-3 text-cyan-400" /> };
      case 'trusted':
        return { style: 'bg-status-success-bg/20 text-status-success border-status-success/40', label: name || 'Trusted Met Source', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'corroborated':
        return { style: 'bg-blue-900/30 text-blue-300 border-blue-500/40', label: name || 'Corroborated Report', icon: <FileText className="w-3 h-3" /> };
      case 'public':
        return { style: 'bg-purple-900/30 text-purple-300 border-purple-500/40', label: name || 'Public Citizen Report', icon: <FileText className="w-3 h-3" /> };
      case 'unverified':
      default:
        return { style: 'bg-status-warning-bg/20 text-status-warning border-status-warning/40', label: name || 'Unverified Signal', icon: <HelpCircle className="w-3 h-3" /> };
    }
  };

  const badge = getBadge();

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm border tracking-wider ${badge.style}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
};

// ── VerificationBadge ──────────────────────────────────────────────────────
interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'VERIFIED':
        return { style: 'bg-status-success-bg/20 text-status-success border-status-success/40', icon: <CheckCircle2 className="w-3 h-3" />, label: 'VERIFIED' };
      case 'CORROBORATED':
        return { style: 'bg-status-info-bg/30 text-status-info border-status-info/40', icon: <FileText className="w-3 h-3" />, label: 'CORROBORATED' };
      case 'UNDER_REVIEW':
        return { style: 'bg-status-warning-bg/20 text-status-warning border-status-warning/40', icon: <Clock className="w-3 h-3" />, label: 'UNDER REVIEW' };
      case 'UNVERIFIED':
        return { style: 'bg-ops-high text-ops-muted border-ops-divider', icon: <HelpCircle className="w-3 h-3" />, label: 'UNVERIFIED' };
      case 'REJECTED':
        return { style: 'bg-status-critical-bg/20 text-status-critical border-status-critical/40', icon: <XCircle className="w-3 h-3" />, label: 'REJECTED' };
    }
  };

  const badge = getStyle();

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border tracking-widest ${badge.style}`}>
      {badge.icon}
      <span>{badge.label}</span>
    </span>
  );
};

// ── FreshnessIndicator ─────────────────────────────────────────────────────
interface FreshnessIndicatorProps {
  timestamp: string;
  isStale?: boolean;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ timestamp, isStale = false }) => {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-ops-muted font-mono">
      <span className={`w-1.5 h-1.5 rounded-full ${isStale ? 'bg-status-warning' : 'bg-status-success animate-pulse'}`} />
      <Clock className="w-3 h-3 text-ops-outline" />
      <span>UPD {timestamp}</span>
    </span>
  );
};

// ── SeverityIndicator ──────────────────────────────────────────────────────
interface SeverityIndicatorProps {
  severity: RiskSeverity;
  disasterType: string;
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({ severity, disasterType }) => {
  const getSymbol = () => {
    switch (severity) {
      case 'critical': return '▲ CRITICAL';
      case 'high':     return '▲ HIGH';
      case 'moderate': return '■ MODERATE';
      case 'low':      return '● LOW';
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'critical': return 'text-status-critical border-status-critical/40 bg-status-critical-bg/20';
      case 'high':     return 'text-orange-400 border-orange-500/40 bg-orange-900/20';
      case 'moderate': return 'text-status-warning border-status-warning/40 bg-status-warning-bg/20';
      case 'low':      return 'text-status-success border-status-success/40 bg-status-success-bg/20';
    }
  };

  return (
    <div className={`px-3 py-1.5 rounded-md border text-xs font-mono font-bold flex items-center gap-2 ${getColor()}`}>
      <span className="tracking-widest">{getSymbol()}</span>
      <span className="text-ops-muted font-normal tracking-wider">| {disasterType.toUpperCase()} HAZARD</span>
    </div>
  );
};
