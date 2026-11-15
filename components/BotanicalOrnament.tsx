import React from 'react';

export const BotanicalDivider: React.FC<{ variant?: 'light' | 'dark'; className?: string }> = ({
  variant = 'dark',
  className = '',
}) => {
  const lineColor = variant === 'light' ? 'rgba(247, 249, 251, 0.28)' : 'rgba(31, 59, 74, 0.18)';
  const roseColor = variant === 'light' ? '#E7C6CA' : '#A85D66';
  const leafColor = variant === 'light' ? '#9AB8C7' : '#4E6775';

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-12 sm:w-20" style={{ backgroundColor: lineColor }} />
      <svg
        width="36"
        height="22"
        viewBox="0 0 36 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 11C14.5 7 9.5 6.5 4 9.5C8 12.5 13 13 18 11Z"
          stroke={leafColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 11C21.5 7 26.5 6.5 32 9.5C28 12.5 23 13 18 11Z"
          stroke={leafColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="10.5" r="3.2" stroke={roseColor} strokeWidth="1.3" />
        <path
          d="M16.6 10.5C16.6 9.7 17.2 9.1 18 9.1C18.8 9.1 19.4 9.7 19.4 10.5C19.4 11.4 18.5 12 17.6 11.8"
          stroke={roseColor}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
      <span className="h-px w-12 sm:w-20" style={{ backgroundColor: lineColor }} />
    </div>
  );
};

export const BotanicalCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'light' | 'dark';
}> = ({ position, variant = 'light' }) => {
  const strokeMain = variant === 'light' ? 'rgba(231, 198, 202, 0.55)' : 'rgba(168, 93, 102, 0.45)';
  const strokeLeaf = variant === 'light' ? 'rgba(190, 214, 226, 0.45)' : 'rgba(78, 103, 117, 0.35)';

  const transformMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4 scale-x-[-1]',
    'bottom-left': 'bottom-4 left-4 scale-y-[-1]',
    'bottom-right': 'bottom-4 right-4 scale-[-1]',
  };

  return (
    <svg
      className={`pointer-events-none absolute w-14 h-14 sm:w-20 sm:h-20 ${transformMap[position]}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 52C6 28 24 8 54 6"
        stroke={strokeLeaf}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M14 36C10 28 11 20 18 16C20 23 18 30 14 36Z"
        stroke={strokeLeaf}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M36 14C28 10 20 11 16 18C23 20 30 18 36 14Z"
        stroke={strokeLeaf}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="5" stroke={strokeMain} strokeWidth="1.2" />
      <path
        d="M14 16C14 14.8 14.9 14 16 14C17.1 14 18 14.9 18 16C18 17.3 16.8 18.2 15.5 18"
        stroke={strokeMain}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
};
