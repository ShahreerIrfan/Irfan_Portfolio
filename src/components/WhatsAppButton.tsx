'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = '8801344260216'; // Bangladesh country code + number
  const message = encodeURIComponent('Hi Shahreer! I visited your portfolio and would like to connect.');
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp icon */}
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white relative z-10">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.376L1.056 31.2l6.048-1.944A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.098-1.932 2.01-3.156 2.276-.838.18-1.932.322-5.618-1.208-4.716-1.956-7.748-6.742-7.984-7.054-.226-.312-1.896-2.526-1.896-4.816 0-2.29 1.2-3.416 1.626-3.882a1.72 1.72 0 011.25-.586c.156 0 .296.008.422.014.39.016.586.04.844.652.322.764 1.11 2.71 1.208 2.908.098.198.164.43.032.688-.122.266-.184.43-.368.66-.184.228-.386.51-.552.684-.184.19-.376.398-.162.782.214.384.952 1.572 2.044 2.546 1.406 1.254 2.59 1.644 2.958 1.826.368.182.582.152.796-.092.222-.244.942-1.096 1.194-1.474.244-.376.496-.312.836-.188.344.124 2.18 1.028 2.552 1.214.374.186.622.276.714.432.092.156.092.902-.298 2.002z" />
      </svg>
    </a>
  );
}
