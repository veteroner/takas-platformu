import React from "react";

export default function TakaIcon({ 
  size = 64, 
  className = "", 
  ariaLabel = "TakaZone icon" 
}: {
  size?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const uniqueId = React.useId();
  
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`bg-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="108" fill={`url(#bg-${uniqueId})`} />

      <g transform="translate(256, 256)">
        {/* Upper arrow (pointing right) */}
        <g transform="translate(0, -50)">
          <line x1="-100" y1="0" x2="70" y2="0" stroke="white" strokeWidth="36" strokeLinecap="round" />
          <polyline points="40,-35 85,0 40,35" stroke="white" strokeWidth="36" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Lower arrow (pointing left) */}
        <g transform="translate(0, 50)">
          <line x1="100" y1="0" x2="-70" y2="0" stroke="white" strokeWidth="36" strokeLinecap="round" />
          <polyline points="-40,35 -85,0 -40,-35" stroke="white" strokeWidth="36" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
