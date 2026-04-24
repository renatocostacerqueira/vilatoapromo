import React from 'react';

export default function Ornament({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-[#B38C61]/50" />
      <svg width="8" height="8" viewBox="0 0 8 8" className="text-[#B38C61]">
        <circle cx="4" cy="4" r="3" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-[#B38C61]/50" />
    </div>
  );
}