'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDzikrStore } from '@/store/dzikrStore';

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const getFullscreenElement = () => {
  const doc = document as FullscreenDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
};

// Fullscreen is a nice-to-have: iOS Safari refuses it outside <video>, and any
// browser may block it when the call is not tied to a gesture. The CSS focus
// layout stands on its own, so a rejection here is never surfaced.
const requestFullscreen = () => {
  const element = document.documentElement as FullscreenElement;
  const request = element.requestFullscreen ?? element.webkitRequestFullscreen;
  if (!request) return;
  try {
    void Promise.resolve(request.call(element)).catch(() => undefined);
  } catch {
    /* ignore */
  }
};

const exitFullscreen = () => {
  if (!getFullscreenElement()) return;
  const doc = document as FullscreenDocument;
  const exit = doc.exitFullscreen ?? doc.webkitExitFullscreen;
  if (!exit) return;
  try {
    void Promise.resolve(exit.call(doc)).catch(() => undefined);
  } catch {
    /* ignore */
  }
};

export const useFocusMode = () => {
  const focusMode = useDzikrStore((state) => state.settings.focusMode ?? false);
  const updateSettings = useDzikrStore((state) => state.updateSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const setFocusMode = useCallback(
    (value: boolean) => {
      updateSettings({ focusMode: value });
      if (value) requestFullscreen();
      else exitFullscreen();
    },
    [updateSettings],
  );

  const enterFocusMode = useCallback(() => setFocusMode(true), [setFocusMode]);
  const exitFocusMode = useCallback(() => setFocusMode(false), [setFocusMode]);
  const toggleFocusMode = useCallback(() => setFocusMode(!focusMode), [focusMode, setFocusMode]);

  // Leaving native fullscreen (Esc, browser gesture) should leave focus mode too.
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!getFullscreenElement()) updateSettings({ focusMode: false });
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [updateSettings]);

  // Esc still exits when the fullscreen request was blocked or unsupported.
  useEffect(() => {
    if (!focusMode) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !getFullscreenElement()) exitFocusMode();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, exitFocusMode]);

  return {
    // Guarded by mount so the persisted value never fights server-rendered markup.
    isFocusMode: isMounted && focusMode,
    enterFocusMode,
    exitFocusMode,
    toggleFocusMode,
  };
};
