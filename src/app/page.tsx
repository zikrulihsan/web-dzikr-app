'use client';

import React from 'react';
import Header from '@/components/Header';
import DzikrSlider from '@/components/DzikrSlider';
import ThemeProvider from '@/components/ThemeProvider';

export default function Home() {
  return (
    <ThemeProvider>
      <Header />
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <DzikrSlider />
      </div>
    </ThemeProvider>
  );
}
