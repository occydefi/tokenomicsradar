import { useState, useEffect, useCallback } from 'react';

export type TTSState = 'idle' | 'loading' | 'playing' | 'error';

// ── Global singleton — only ONE audio plays at a time, anywhere on the page ──
let globalAudio: HTMLAudioElement | null = null;
let globalObjectUrl: string | null = null;
const listeners = new Set<(s: TTSState) => void>();
let globalState: TTSState = 'idle';

function setGlobalState(s: TTSState) {
  globalState = s;
  listeners.forEach(fn => fn(s));
}

function stopGlobal() {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.src = '';
    globalAudio = null;
  }
  if (globalObjectUrl) {
    URL.revokeObjectURL(globalObjectUrl);
    globalObjectUrl = null;
  }
  setGlobalState('idle');
}

async function speakGlobal(text: string) {
  // Always stop any existing audio first
  stopGlobal();

  // Trim text to 400 chars max to reduce generation time
  const trimmed = text.length > 400 ? text.slice(0, 397) + '...' : text;

  setGlobalState('loading');
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, voice: 'nova' }),
    });

    if (!res.ok) throw new Error('TTS failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    globalObjectUrl = url;

    const audio = new Audio(url);
    globalAudio = audio;

    audio.onended = () => {
      if (globalObjectUrl === url) {
        URL.revokeObjectURL(url);
        globalObjectUrl = null;
      }
      globalAudio = null;
      setGlobalState('idle');
    };

    audio.onerror = () => {
      if (globalObjectUrl === url) {
        URL.revokeObjectURL(url);
        globalObjectUrl = null;
      }
      globalAudio = null;
      setGlobalState('error');
      setTimeout(() => { if (globalState === 'error') setGlobalState('idle'); }, 2000);
    };

    await audio.play();
    setGlobalState('playing');
  } catch {
    stopGlobal();
    setGlobalState('error');
    setTimeout(() => { if (globalState === 'error') setGlobalState('idle'); }, 2000);
  }
}

// ── React hook — subscribes to global state ──
export function useTTS() {
  const [state, setState] = useState<TTSState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => { listeners.delete(setState); };
  }, []);

  const speak = useCallback((text: string) => {
    if (globalState === 'playing' || globalState === 'loading') {
      stopGlobal(); // toggle: click again to stop
    } else {
      speakGlobal(text);
    }
  }, []);

  const stop = useCallback(() => stopGlobal(), []);

  return { state, speak, stop };
}
