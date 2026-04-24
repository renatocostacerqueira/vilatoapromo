import React from 'react';

export default function Logo({ variant = 'dark', className = '' }) {
  const color = variant === 'light' ? '#F7F4EF' : '#362822';
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="font-serif tracking-[0.35em] text-xs uppercase"
        style={{ color }}
      >
        Vila
      </div>
      <div
        className="font-serif italic text-3xl leading-none -mt-0.5"
        style={{ color: '#B38C61' }}
      >
        Toá
      </div>
    </div>
  );
}