'use client';

import { useEffect, useState } from 'react';
import { useGsapReveal, useGsapStagger } from '@/hooks/useGsap';

interface Client {
  name: string;
  logo: string;
  url?: string;
}

export default function ClientShowcase() {
  const [clients, setClients] = useState<Client[]>([]);
  const titleRef = useGsapReveal({ y: 40 });
  const gridRef = useGsapStagger({ stagger: 0.06 });

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings?.clientLogos) {
          try {
            const parsed = JSON.parse(d.settings.clientLogos);
            if (Array.isArray(parsed)) setClients(parsed);
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  if (clients.length === 0) return null;

  return (
    <section id="clients" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div ref={titleRef} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Clients & Partners
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client) => {
            const inner = (
              <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl p-6 flex items-center justify-center h-24 hover:border-gray-700 hover:bg-gray-800/60 transition-all group">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    {client.name}
                  </span>
                )}
              </div>
            );

            return client.url ? (
              <a key={client.name} href={client.url} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div key={client.name}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
