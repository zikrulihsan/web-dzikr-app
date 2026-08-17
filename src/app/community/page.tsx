'use client';

import React from 'react';
import CommunityPresence from '@/components/CommunityPresence';

export default function CommunityPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CommunityPresence />
    </div>
  );
}
