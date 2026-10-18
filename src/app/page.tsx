'use client';

import React, { useCallback, useState } from 'react';
import Header from '@/components/Header';
import DzikrSlider from '@/components/DzikrSlider';
import FocusMenu from '@/components/FocusMenu';
import Onboarding from '@/components/Onboarding';
import StartScreen from '@/components/StartScreen';
import { useFocusMode } from '@/lib/useFocusMode';

export default function Home() {
  const { isFocusMode, enterFocusMode } = useFocusMode();
  const [hasStarted, setHasStarted] = useState(false);

  // Every visit opens on the start screen; the tap that dismisses it is the
  // gesture the browser needs before it allows fullscreen.
  const handleStart = useCallback(() => {
    enterFocusMode();
    setHasStarted(true);
  }, [enterFocusMode]);

  return (
    <div className={`app-shell ${isFocusMode ? 'is-focus' : ''}`}>
      <Header />

      <div className="app-body">
        <DzikrSlider />
      </div>

      {isFocusMode && hasStarted && <FocusMenu />}
      {isFocusMode && hasStarted && <Onboarding />}
      {!hasStarted && <StartScreen onStart={handleStart} />}
    </div>
  );
}
