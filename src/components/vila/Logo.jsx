import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/69eb50b879112948be76e574/2dd4b8627_logo.png';

export default function Logo({ variant = 'dark', className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={LOGO_URL}
        alt="Vila Toá"
        className="h-16 md:h-20 w-auto object-contain"
        style={variant === 'dark' ? { filter: 'invert(15%) sepia(18%) saturate(1200%) hue-rotate(340deg) brightness(25%)' } : undefined}
      />
    </div>
  );
}