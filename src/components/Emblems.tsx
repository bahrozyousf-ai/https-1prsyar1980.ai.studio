import React from 'react';
import { LogoType } from '../types/exam';

interface EmblemProps {
  type: LogoType;
  customUrl?: string;
  className?: string;
}

export const KurdistanEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle Ring */}
      <circle cx="60" cy="60" r="56" stroke="#1e3a8a" strokeWidth="3" fill="#f8fafc" />
      <circle cx="60" cy="60" r="51" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Golden Sunburst with 21 rays (Kurdistan Sun) */}
      <g transform="translate(60, 48)">
        {Array.from({ length: 21 }).map((_, i) => {
          const angle = (i * 360) / 21;
          return (
            <line
              key={i}
              x1="0"
              y1="-13"
              x2="0"
              y2="-24"
              stroke="#eab308"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${angle})`}
            />
          );
        })}
        <circle cx="0" cy="0" r="12" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      </g>

      {/* Open Book of Knowledge */}
      <path
        d="M32 76 C 45 70, 56 71, 60 76 C 64 71, 75 70, 88 76 L 88 92 C 75 86, 64 87, 60 92 C 56 87, 45 86, 32 92 Z"
        fill="#ffffff"
        stroke="#1e3a8a"
        strokeWidth="2"
      />
      {/* Book spine & lines */}
      <line x1="60" y1="76" x2="60" y2="92" stroke="#1e3a8a" strokeWidth="2" />
      <line x1="38" y1="80" x2="54" y2="80" stroke="#94a3b8" strokeWidth="1" />
      <line x1="38" y1="84" x2="54" y2="84" stroke="#94a3b8" strokeWidth="1" />
      <line x1="66" y1="80" x2="82" y2="80" stroke="#94a3b8" strokeWidth="1" />
      <line x1="66" y1="84" x2="82" y2="84" stroke="#94a3b8" strokeWidth="1" />

      {/* Laurel branches */}
      <path
        d="M24 64 C 20 78, 26 95, 42 102"
        stroke="#15803d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M96 64 C 100 78, 94 95, 78 102"
        stroke="#15803d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Small olive leaves */}
      <circle cx="21" cy="74" r="2.5" fill="#15803d" />
      <circle cx="24" cy="85" r="2.5" fill="#15803d" />
      <circle cx="32" cy="97" r="2.5" fill="#15803d" />
      <circle cx="99" cy="74" r="2.5" fill="#15803d" />
      <circle cx="96" cy="85" r="2.5" fill="#15803d" />
      <circle cx="88" cy="97" r="2.5" fill="#15803d" />
    </svg>
  );
};

export const EducationTorch: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="2.5" fill="#fff" />
      {/* Flame */}
      <path
        d="M50 18 C56 26, 62 33, 58 42 C54 48, 46 48, 42 42 C38 33, 44 26, 50 18 Z"
        fill="#f97316"
        stroke="#ea580c"
        strokeWidth="1.5"
      />
      <path
        d="M50 24 C53 28, 56 32, 54 38 C52 42, 48 42, 46 38 C44 32, 47 28, 50 24 Z"
        fill="#fde047"
      />
      {/* Torch base */}
      <path
        d="M44 46 L56 46 L53 66 L47 66 Z"
        fill="#475569"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {/* Torch ribs */}
      <line x1="43" y1="52" x2="57" y2="52" stroke="#0f172a" strokeWidth="2" />
      {/* Open Book beneath */}
      <path
        d="M26 68 C 38 64, 46 65, 50 68 C 54 65, 62 64, 74 68 L 74 80 C 62 76, 54 77, 50 80 C 46 77, 38 76, 26 80 Z"
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {/* Stars on sides */}
      <polygon points="20,40 22,44 26,45 23,48 24,52 20,50 16,52 17,48 14,45 18,44" fill="#ca8a04" />
      <polygon points="80,40 82,44 86,45 83,48 84,52 80,50 76,52 77,48 74,45 78,44" fill="#ca8a04" />
    </svg>
  );
};

export const KurdishFlag: React.FC<{ className?: string }> = ({ className = 'w-16 h-12' }) => {
  return (
    <svg viewBox="0 0 90 60" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* 3 Stripes: Red, White, Green */}
      <rect width="90" height="20" fill="#dc2626" />
      <rect y="20" width="90" height="20" fill="#ffffff" />
      <rect y="40" width="90" height="20" fill="#16a34a" />
      <rect width="90" height="60" stroke="#000000" strokeWidth="1" fill="none" />
      {/* Golden Sun 21 rays */}
      <g transform="translate(45, 30)">
        {Array.from({ length: 21 }).map((_, i) => {
          const angle = (i * 360) / 21;
          return (
            <polygon
              key={i}
              points="0,-16 2.5,-8 -2.5,-8"
              fill="#eab308"
              transform={`rotate(${angle})`}
            />
          );
        })}
        <circle cx="0" cy="0" r="7" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

export const EmblemRenderer: React.FC<EmblemProps> = ({ type, customUrl, className = 'w-16 h-16' }) => {
  if (type === 'none') return null;

  if (type === 'custom' && customUrl) {
    return (
      <img
        src={customUrl}
        alt="School Logo"
        referrerPolicy="no-referrer"
        className={`${className} object-contain`}
      />
    );
  }

  if (type === 'kurdish_flag') {
    return <KurdishFlag className={className} />;
  }

  if (type === 'education_torch') {
    return <EducationTorch className={className} />;
  }

  // Default: krg_seal
  return <KurdistanEmblem className={className} />;
};
