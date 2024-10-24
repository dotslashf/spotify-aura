import React from 'react';
import { cn } from '@/lib/utils';

interface AuraColorProps {
  position: string;
  color: {
    primary: string;
    secondary: string;
  };
  preview?: boolean;
}

const AuraColor = ({ color, position, preview = false }: AuraColorProps) => {
  return (
    <div
      className={cn(
        'w-full border-[#252525] dark:border-[#f3f3f3] h-full aspect-square rounded-t-md flex items-center justify-center relative overflow-hidden mx-auto sm:ml-0',
        preview ? 'border-8 border-b-0' : 'rounded-sm'
      )}
      style={{
        background: `radial-gradient(circle at ${position}, ${color.primary}, ${color.secondary})`,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-80 mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.35"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                     1 0 0 0 0
                     1 0 0 0 0
                     0 0 0 0.15 0"
              in="noise"
              result="monoNoise"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
};

export default AuraColor;
