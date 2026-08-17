'use client';

import React from 'react';
import Header from '@/components/Header';
import DzikrSlider from '@/components/DzikrSlider';

export default function Home() {
  return (
    <>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DzikrSlider />
      </div>
    </>
  );
}
