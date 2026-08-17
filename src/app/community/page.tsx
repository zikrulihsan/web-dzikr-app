'use client';

import React from 'react';
import CommunityPresence from '@/components/CommunityPresence';
import ThemeProvider from '@/components/ThemeProvider';

export default function CommunityPage() {
  return (
    <ThemeProvider>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CommunityPresence />
      </div>
    </ThemeProvider>
  );
}
