import React from 'react';
import { EmergencyContact } from '../../types/disaster';
import { Phone, Shield, Flame, Ambulance, Siren, HeartHandshake, PhoneCall } from 'lucide-react';

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
  compact?: boolean;
  isDark?: boolean;
}

const CATEGORY_META: Record<
  string,
  { icon: JSX.Element; accent: string; chip: string }
> = {
  EMERGENCY: {
    icon: <Siren className="w-4 h-4" />,
    accent: 'text-status-critical',
    chip: 'bg-status-critical/15 border-status-critical/40 text-status-critical',
  },
  POLICE: {
    icon: <Shield className="w-4 h-4" />,
    accent: 'text-status-info',
    chip: 'bg-status-info/15 border-status-info/40 text-status-info',
  },
  FIRE: {
    icon: <Flame className="w-4 h-4" />,
    accent: 'text-orange-400',
    chip: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
  },
  MEDICAL: {
    icon: <Ambulance className="w-4 h-4" />,
    accent: 'text-red-400',
    chip: 'bg-red-500/15 border-red-500/40 text-red-300',
  },
  DISASTER: {
    icon: <PhoneCall className="w-4 h-4" />,
    accent: 'text-status-warning',
    chip: 'bg-status-warning-bg/30 border-status-warning/50 text-status-warning',
  },
  HELPLINE: {
    icon: <HeartHandshake className="w-4 h-4" />,
    accent: 'text-status-success',
    chip: 'bg-status-success-bg/20 border-status-success/40 text-status-success',
  },
};

/** Primary dial target for a contact entry like "112 / 079-xxxx" */
export const primaryTelHref = (phoneNumber: string): string => {
  const first = phoneNumber.split('/')[0].trim();
  return `tel:${first.replace(/[^+\d]/g, '')}`;
};

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({
  contacts,
  compact = false,
  isDark = true,
}) => {
  const card    = isDark ? 'bg-ops-container border-ops-divider' : 'bg-white border-day-divider';
  const cardLow = isDark ? 'bg-ops-low border-ops-divider'       : 'bg-day-low border-day-divider';
  const text    = isDark ? 'text-ops-text'  : 'text-day-text';
  const muted   = isDark ? 'text-ops-muted' : 'text-day-muted';
  const outline = isDark ? 'text-ops-outline' : 'text-day-outline';
  const divider = isDark ? 'border-ops-divider' : 'border-day-divider';

  if (compact) {
    // Compact strip: top emergency numbers only (used inside event dispatch box)
    const top = contacts.slice(0, 4);
    return (
      <div className={`rounded-lg border ${cardLow} p-3 space-y-1.5`}>
        <div className={`text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1 ${outline}`}>
          <Siren className="w-3 h-3 text-status-critical" /> EMERGENCY NUMBERS
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {top.map((c) => (
            <a
              key={c.id}
              href={primaryTelHref(c.phoneNumber)}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md border transition-colors ${card} hover:border-status-critical/60`}
            >
              <span className={`text-[9px] font-mono truncate mr-1 ${muted}`}>{c.category}</span>
              <span className="font-mono font-bold text-xs text-status-critical">{c.phoneNumber}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${card} rounded-xl p-5 border space-y-4`}>
      <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: isDark ? '#334155' : '#cbd5e1' }}>
        <h3 className={`text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 ${text}`}>
          <Siren className="w-4 h-4 text-status-critical" /> // EMERGENCY CONTACTS
        </h3>
        <span className={`text-[10px] font-mono ${outline}`}>TAP TO CALL · 24×7</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {contacts.map((contact) => {
          const meta = CATEGORY_META[contact.category] || CATEGORY_META.HELPLINE;
          return (
            <a
              key={contact.id}
              href={primaryTelHref(contact.phoneNumber)}
              className={`group p-3.5 rounded-lg border transition-all hover:border-status-critical/60 ${cardLow}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${meta.chip}`}>
                      {meta.icon} {contact.category}
                    </span>
                  </div>
                  <div className={`font-mono font-bold text-xs leading-snug ${text}`}>{contact.name}</div>
                  {!compact && (
                    <p className={`text-[10px] font-sans leading-snug line-clamp-2 ${muted}`}>{contact.description}</p>
                  )}
                </div>
                <div className="shrink-0 text-right space-y-0.5">
                  <div className="font-mono font-black text-xl tracking-tight text-status-critical group-hover:scale-105 transition-transform">
                    {contact.phoneNumber.split('/')[0].trim()}
                  </div>
                  <div className={`text-[9px] font-mono flex items-center justify-end gap-1 ${outline}`}>
                    <Phone className="w-2.5 h-2.5" /> CALL NOW
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <p className={`text-[9px] font-mono leading-relaxed pt-1 border-t ${divider} ${outline}`}>
        If you are in immediate danger, call 112. Official instructions from NDMA / SDMA / District authorities always take precedence.
      </p>
    </div>
  );
};
