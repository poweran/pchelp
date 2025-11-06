import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { addRouteChangeListener, getCurrentPath } from '../../utils/router';

const DEFAULT_TRACK = '/assets/audio/832077__silverillusionist__shadowmancer-loop-80-bpm-4-bar.mp3';
const ADMIN_TRACK = '/assets/audio/830558__universfield__dark-80s-sci-fi-atmosphere.mp3';
const DEFAULT_VOLUME = 0.05;
const LOOP_DELAY_MS = 0;

function buildPlaylist(pathname: string): string[] {
  return pathname.startsWith('/admin')
    ? [DEFAULT_TRACK]
    : [ADMIN_TRACK];
}

export function BackgroundAudio(): ReactElement {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loopTimeoutRef = useRef<number | null>(null);
  const interactionHandlerRef = useRef<(() => void) | null>(null);
  const isManuallyPausedRef = useRef<boolean>(false);
  const attemptPlayRef = useRef<(() => void) | null>(null);
  const [isWaitingForNextTrack, setIsWaitingForNextTrack] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [DEFAULT_TRACK];
    }
    return buildPlaylist(getCurrentPath());
  });
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const currentTrack =
    playlist.length > 0 ? playlist[trackIndex % playlist.length] : DEFAULT_TRACK;

  useEffect(() => {
    const unsubscribe = addRouteChangeListener((path: string) => {
      if (loopTimeoutRef.current !== null) {
        window.clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
      setIsWaitingForNextTrack(false);
      setPlaylist(buildPlaylist(path));
      setTrackIndex(0);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const clearInteractionHandlers = () => {
      if (interactionHandlerRef.current) {
        document.removeEventListener('click', interactionHandlerRef.current);
        document.removeEventListener('keydown', interactionHandlerRef.current);
        interactionHandlerRef.current = null;
      }
    };

    const attemptPlay = () => {
      if (isManuallyPausedRef.current) {
        return;
      }
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          if (interactionHandlerRef.current) {
            return;
          }
          const handler = () => {
            document.removeEventListener('click', handler);
            document.removeEventListener('keydown', handler);
            interactionHandlerRef.current = null;
            attemptPlay();
          };
          interactionHandlerRef.current = handler;
          document.addEventListener('click', handler);
          document.addEventListener('keydown', handler);
        });
      }
    };
    attemptPlayRef.current = attemptPlay;

    const handleCanPlay = () => {
      if (isWaitingForNextTrack || isManuallyPausedRef.current) {
        return;
      }
      audio.removeEventListener('canplay', handleCanPlay);
      attemptPlay();
    };

    const handleEnded = () => {
      if (loopTimeoutRef.current !== null) {
        window.clearTimeout(loopTimeoutRef.current);
      }
      setIsWaitingForNextTrack(true);
      loopTimeoutRef.current = window.setTimeout(() => {
        loopTimeoutRef.current = null;
        setTrackIndex(prev => {
          if (playlist.length === 0) {
            return prev;
          }
          return (prev + 1) % playlist.length;
        });
        setIsWaitingForNextTrack(false);
      }, LOOP_DELAY_MS);
    };

    audio.loop = false;
    audio.volume = DEFAULT_VOLUME;
    audio.addEventListener('ended', handleEnded);

    if (isWaitingForNextTrack || isManuallyPausedRef.current) {
      audio.pause();
    } else {
      audio.pause();
      audio.currentTime = 0;

      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        attemptPlay();
      } else {
        audio.addEventListener('canplay', handleCanPlay);
      }
    }

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      clearInteractionHandlers();
    };
  }, [currentTrack, playlist.length, isWaitingForNextTrack]);

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current !== null) {
        window.clearTimeout(loopTimeoutRef.current);
        loopTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audio = () => audioRef.current;

    const requestPlay = () => {
      const el = audio();
      if (!el) {
        return;
      }
      isManuallyPausedRef.current = false;
      if (attemptPlayRef.current) {
        attemptPlayRef.current();
      } else {
        el.play().catch(() => undefined);
      }
    };

    const requestPause = () => {
      const el = audio();
      if (!el) {
        return;
      }
      isManuallyPausedRef.current = true;
      el.pause();
    };

    const handleMediaKey = (event: KeyboardEvent) => {
      if (event.code !== 'MediaPlayPause') {
        return;
      }
      const el = audio();
      if (!el) {
        return;
      }
      if (el.paused || isManuallyPausedRef.current) {
        requestPlay();
      } else {
        requestPause();
      }
    };

    const handleParticleControl = (event: Event) => {
      const custom = event as CustomEvent<{ play?: boolean }>;
      if (custom.detail?.play) {
        requestPlay();
      } else {
        requestPause();
      }
    };

    window.addEventListener('keydown', handleMediaKey);
    window.addEventListener('particle-media-control', handleParticleControl as EventListener);
    return () => {
      window.removeEventListener('keydown', handleMediaKey);
      window.removeEventListener('particle-media-control', handleParticleControl as EventListener);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={currentTrack}
      autoPlay
      preload="auto"
      playsInline
      style={{ display: 'none' }}
    />
  );
}
