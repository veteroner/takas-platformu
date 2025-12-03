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

      <g transform="translate(56,40) scale(0.78)" fill="none" stroke="#ffffff" strokeWidth="28" strokeLinejoin="round" strokeLinecap="round">
        <path d="M256 128 L384 192 L256 256 L128 192 Z" />
        <path d="M128 192 L128 320 L256 384 L256 256 Z" />
        <path d="M384 192 L384 320 L256 384 L256 256 Z" />
      </g>

      <text 
        x="256" 
        y="450" 
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
