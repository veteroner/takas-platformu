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
        <linearGradient id="takaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      <rect x="16" y="16" width="480" height="480" rx="110" fill="url(#takaGradient)" />

      <g transform="translate(256, 180)">
        <path d="M-140 -20 L60 -20 L60 -50 L110 0 L60 50 L60 20 L-140 20 Z" 
              fill="#ffffff" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M140 70 L-60 70 L-60 100 L-110 50 L-60 0 L-60 30 L140 30 Z" 
              fill="#ffffff" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round"/>
      </g>

      <text 
        x="256" 
        y="420" 
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" 
        fontSize="72" 
        fontWeight="700" 
        fill="#ffffff" 
        textAnchor="middle"
      >
        TakaZone
      </text>
    </svg>
  );
}
