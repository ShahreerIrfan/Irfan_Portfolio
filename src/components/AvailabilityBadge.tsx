'use client';

import { useEffect, useState } from 'react';
import { Circle } from 'lucide-react';

export default function AvailabilityBadge() {
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings && d.settings.availableForHire !== undefined) {
          setAvailable(d.settings.availableForHire === 'true' || d.settings.availableForHire === true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm transition-all ${
      available
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }`}>
      <Circle className={`w-2.5 h-2.5 fill-current ${available ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
      {available ? 'Available for Hire' : 'Currently Busy'}
    </div>
  );
}
