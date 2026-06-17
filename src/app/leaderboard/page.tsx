'use client';

import React from 'react';
import Leaderboard from '@/components/Leaderboard';
import ThemeProvider from '@/components/ThemeProvider';

export default function LeaderboardPage() {
  return (
    <ThemeProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Leaderboard />
      </div>
    </ThemeProvider>
  );
}
