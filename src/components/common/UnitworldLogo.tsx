import React, { useState } from 'react';
import { DEFAULT_BRAND_LOGO } from '../../firebase';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'full' | 'compact' | 'icon-only';
  inverted?: boolean;
  logoUrl?: string;
  preferVector?: boolean;
}

export const UnitworldLogo: React.FC<LogoProps> = ({
  className = 'h-11 sm:h-12',
  showTagline = true,
  variant = 'full',
  inverted = false,
  logoUrl = DEFAULT_BRAND_LOGO,
  preferVector = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // If user has the Cloudinary / saved brand image from Firebase
  if (!preferVector && !imgError && logoUrl) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src={logoUrl}
          alt="Unitworld Sarl - Your Global Marketplace"
          onError={() => setImgError(true)}
          className={`h-full w-auto object-contain max-h-14 drop-shadow-2xs transition-all ${
            inverted ? 'bg-white/95 p-1 rounded-lg shadow-sm' : ''
          }`}
        />
      </div>
    );
  }

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g transform="translate(18, 0)">
          <circle cx="50" cy="45" r="32" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="3" />
          <path d="M22 45h56M50 17c-10 12-10 44 0 56M50 17c10 12 10 44 0 56" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <rect x="42" y="24" width="38" height="38" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M52 43l6 6 12-12" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path
          d="M10 24h18l18 52h64l14-42H38"
          stroke="#0284C7"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38 76h74c3 0 6-2 7-5l12-37H32"
          fill="#0284C7"
          fillOpacity="0.9"
        />
        <circle cx="54" cy="98" r="14" fill="#0369A1" />
        <circle cx="54" cy="98" r="6" fill="#38BDF8" />
        <circle cx="106" cy="98" r="14" fill="#0369A1" />
        <circle cx="106" cy="98" r="6" fill="#38BDF8" />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Icon matching the badge */}
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-[4/3] shrink-0 drop-shadow-sm"
      >
        <g transform="translate(18, 0)">
          <circle cx="50" cy="45" r="32" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M22 45h56M50 17c-10 12-10 44 0 56M50 17c10 12 10 44 0 56" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <rect x="42" y="24" width="38" height="38" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M52 43l6 6 12-12" stroke="#10B981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path
          d="M10 24h18l18 52h64l14-42H38"
          stroke="#0284C7"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38 76h74c3 0 6-2 7-5l12-37H32"
          fill="#0284C7"
        />
        <circle cx="54" cy="98" r="14" fill="#0369A1" />
        <circle cx="54" cy="98" r="6" fill="#38BDF8" />
        <circle cx="106" cy="98" r="14" fill="#0369A1" />
        <circle cx="106" cy="98" r="6" fill="#38BDF8" />
      </svg>

      {/* Official Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex flex-col">
          <span className="text-[1.25rem] sm:text-[1.4rem] font-black tracking-tight text-[#0284C7] uppercase font-sans">
            UNITWORLD
          </span>
          <span className="text-[1.1rem] sm:text-[1.25rem] font-black tracking-wider text-[#0369A1] uppercase -mt-1 font-sans">
            SARL
          </span>
        </div>

        {showTagline && (
          <div className="mt-1 pt-0.5 border-t border-[#38BDF8]/60 flex items-center">
            <span
              className={`text-[0.55rem] sm:text-[0.62rem] font-bold tracking-[0.16em] uppercase whitespace-nowrap ${
                inverted ? 'text-slate-300' : 'text-slate-800'
              }`}
            >
              YOUR GLOBAL MARKETPLACE.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
