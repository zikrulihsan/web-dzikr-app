'use client';

import React from 'react';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Leaderboard />
    </div>
  );
}
