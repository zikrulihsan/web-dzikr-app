'use client';

import React from 'react';

interface IconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ 
  icon, 
  size = 16, 
  color = 'currentColor',
  className = '' 
}) => {
  return (
    <i
      className={`${icon} ${className}`}
      style={{
        fontSize: `${size}px`,
        color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

export default Icon;
