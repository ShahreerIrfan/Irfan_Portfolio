'use client';

import { useRocketScroll } from '@/hooks/useGsap';

export default function RocketScroll() {
  const rocketRef = useRocketScroll();

  return (
    <div ref={rocketRef} className="rocket-container hidden md:block">
      <div className="relative select-none">
        <span role="img" aria-label="rocket" className="block text-4xl transform -rotate-12 drop-shadow-lg">
          🚀
        </span>
      </div>
    </div>
  );
}
