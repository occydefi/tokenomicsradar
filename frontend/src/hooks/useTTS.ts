import { useState, useRef, useCallback } from 'react';

export type TTSState = 'idle' | 'loading' | 'playing' | 'error';

export function useTTS() {
  const [state, setState] = useState<TTSState>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setState('idle');
  }, []);

  const speak = useCallback(async (text: string) => {
    // If already playing, stop
    if (state === 'playing' || state === 'loading') {
      stop();
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'nova' }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setState('error');
        setTimeout(() => setState('idle'), 2000);
      };

      await audio.play();
      setState('playing');
    } catch {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }, [state, stop]);

  return { state, speak, stop };
}
